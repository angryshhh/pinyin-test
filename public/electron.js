const { app, BrowserWindow, clipboard, ipcMain } = require('electron');
const ffi = require('ffi-napi');
const { debounce } = require('lodash');
const path = require('path');
const url = require('url');

const WM_COPYDATA = 0x004A;

let mainWindow;

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
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true // so that page can write const { ipcRenderer } = window.require('electron');
    }
  });

  mainWindow.loadURL(main);
  IS_DEV && mainWindow.webContents.openDevTools();
  let dll = ffi.Library('dll/PinyinHookDll.dll', {
    'SetHook': ['void', ['int']],
    'Unhook': ['void', []],
  });
  dll.SetHook(mainWindow.getNativeWindowHandle().readInt32LE());

  mainWindow.hookWindowMessage(WM_COPYDATA, debounce(value => {
    console.log('receive');
    let candidateList = clipboard.readText();
    // console.log(candidateList);  // use 'CHCP 65001' in windows console to avoid Chinese character error
    mainWindow.webContents.send('receive-candidate-list', candidateList);
    clipboard.clear();
  }, 200));
  mainWindow.on('closed', () => {
    dll.Unhook();
    console.log('close')
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
