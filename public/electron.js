const { app, BrowserWindow, clipboard } = require('electron');
const ffi = require('ffi-napi');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const url = require('url');

const WM_COPYDATA = 0x004A;

let mainWindow;

let candidateList = '';

let db;
const highFrequencySql = `select word from t_word join (t_character_word join t_character on char_id = t_character.id) on word_id = t_word.id where character=? order by frequency desc limit 1`;

function createWindow () {
  const IS_DEV = process.env.NODE_ENV === 'development';
  IS_DEV && console.log('env =', process.env.NODE_ENV);

  const staticIndexPath = path.join(__dirname, './index.html');
  const main = IS_DEV ? 'http://localhost:3000' : url.format({
    pathname: staticIndexPath,
    protocol: 'file:',
    slashes: true,
  });
  mainWindow = new BrowserWindow({
    // 16:9
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true // so that page can use ipcRenderer of electron
    },
  });
  mainWindow.loadURL(main);
  IS_DEV && mainWindow.webContents.openDevTools();

  let dll = ffi.Library('dll/PinyinHookDll.dll', {
    'SetHook': ['void', ['int']],
    'Unhook': ['void', []],
  });
  dll.SetHook(mainWindow.getNativeWindowHandle().readInt32LE());

  db = new sqlite3.Database('db/wcp.db');

  mainWindow.hookWindowMessage(WM_COPYDATA, async value => {
    let temp = clipboard.readText().trim();

    if (temp !== candidateList) {
      candidateList = temp;
      console.log('receive:', temp);  // use 'CHCP 65001' in windows console to avoid Chinese character error
      let characters = temp.trim().split(' ');

      for (let i = 0; i < characters.length; i++) {
        let word = await ((character, database) => {
          // use async/await to solve the problem of asynchronous sqlite query
          return new Promise((resolve, reject) => {
            database.serialize(() => {
              database.get(
                highFrequencySql,
                [character],
                (err, row) => {
                  if (err) reject(err.message);
                  else if (row) {
                    resolve(`、${row.word}`)
                  } else resolve('');
                }
              );
            });
          });
        })(characters[i], db);

        characters[i] += word;
      }

      mainWindow.webContents.send(
        'receive-candidate-list',
        characters.reduce((prev, curr, index) => `${prev}${index + 1}${curr}、`, '')
      );
    }
    clipboard.clear();
  });

  mainWindow.on('closed', () => {
    dll.Unhook();
    db.close();
    console.log('close');
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
