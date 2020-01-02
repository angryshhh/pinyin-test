const { app, BrowserWindow, clipboard, ipcMain } = require('electron');
const ffi = require('ffi-napi');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const url = require('url');
const xlsx = require('node-xlsx').default;

const WM_COPYDATA = 0x004A;

let mainWindow;

let candidateList = '';
let wordFrequencyLevel = 0, referenceStructureLevel = 0;
let xlsxSheets;

let db;
const randomFrequencySql = `select word from t_word join (t_character_word join t_character on char_id = t_character.id) on word_id = t_word.id where character=? order by random() limit 1`;
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

  xlsxSheets = xlsx.parse('db/data.xlsx');

  mainWindow.hookWindowMessage(WM_COPYDATA, async value => {
    let temp = clipboard.readText().trim();

    if (temp !== candidateList) {
      candidateList = temp;
      console.log('receive:', temp);  // use 'CHCP 65001' in windows console to avoid Chinese character error
      let characters = temp.trim().split(' ');

      for (let i = 0; i < characters.length; i++) {
        let word = await ((character, database, wordFrequencyLevel, referenceStructureLevel) => {
          // use async/await to solve the problem of asynchronous sqlite query
          return new Promise((resolve, reject) => {
            database.serialize(() => {
              database.get(
                wordFrequencyLevel ? highFrequencySql : randomFrequencySql,
                [character],
                (err, row) => {
                  if (err) reject(err.message);
                  else if (row) {
                    resolve(`、${row.word}${referenceStructureLevel ? '' : `的${character}`}`)
                  } else resolve('');
                }
              );
            });
          });
        })(characters[i], db, wordFrequencyLevel, referenceStructureLevel);

        characters[i] += word;
      }

      mainWindow.webContents.send(
        'receive-candidate-list',
        characters.reduce((prev, curr, index) => `${prev}${index + 1}${curr}、`, '')
      );
    }
    clipboard.clear();
  });

  mainWindow.webContents.once('did-finish-load', () => {
    let experimentData = {
      targetStrings: xlsxSheets[1].data[1],
      wordFrequencyLevels: xlsxSheets[1].data[4],
      referenceStructureLevels: xlsxSheets[1].data[7],
      balancedLatinSquare: xlsxSheets[1].data.slice(10, 14).map(row =>
        row.map(combination =>
          ({ wordFrequencyLevel: parseInt(combination[0]), referenceStructureLevel: parseInt(combination[2])})
        )
      ),
    };
    mainWindow.webContents.send('experiment-data', experimentData);
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

ipcMain.on('set-levels', (event, data) => {
  wordFrequencyLevel = data.wordFrequencyLevel;
  referenceStructureLevel = data.referenceStructureLevel;
  console.log(wordFrequencyLevel, referenceStructureLevel)
});

ipcMain.on('get-block', (event, data) => {
  let maxBlock = 0;
  xlsxSheets[0].data.slice(1).forEach(row => {
    if (row[0] === data && row[1] > maxBlock) {
      maxBlock = row[1];
    }
  });
  if (maxBlock === xlsxSheets[1].data[16][0]) event.returnValue = -1;
  else event.returnValue = maxBlock;
});

ipcMain.on('complete', (event, data) => {
  const writeData = [
    [
      'Subject Code',
      'Block',
      'Trial',
      'Word Frequency',
      'Reference Structure',
      'Trial Time',
      'Error Rate',
      'Character Times',
    ],
    ...xlsxSheets[0].data.slice(1),
    ...data.map(result =>
      [
        result.subjectCode,
        result.blockNum,
        result.trialNum,
        result.wordFrequencyLevel,
        result.referenceStructureLevel,
        result.trialTime,
        result.errorRate,
        ...result.charEnterTimes,
      ]
    ),
  ];
  var buffer = xlsx.build([
    {name: 'result', data: writeData},
    {name: 'experimentData', data: xlsxSheets[1].data},
  ]); // Returns a buffer
  fs.writeFileSync('db/data.xlsx', buffer);
  xlsxSheets = xlsx.parse('db/data.xlsx');
  // console.log(data);
});
