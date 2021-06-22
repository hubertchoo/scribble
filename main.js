const { menubar } = require('menubar');
const Store = require('electron-store');
const ipcMain = require('electron').ipcMain

const store = new Store();

let mb = menubar({
    browserWindow:{
        width: 400,
        height: 200,
        resizable: false,
        alwaysOnTop: true,
        webPreferences:{
            nodeIntegration: true,
        }
    },
    icon: __dirname + "/icon.png",
    preloadWindow: true,
});


mb.on('ready', () => {
  console.log('app is ready');
});

mb.on('after-create-window', () => {
  data = store.get('scribble');
  if(typeof data === 'undefined'){
      store.set('scribble', '')
      data = ''
  }
  //mb.window.webContents.openDevTools()
  mb.window.webContents.send('fill_in_scribble', data)
});

mb.on('focus-lost', () => {
    mb.window.webContents.send('save_scribble', '')
});

ipcMain.on('save_scribble_from_render', (event, arg) => {
    store.set('scribble', arg)
});