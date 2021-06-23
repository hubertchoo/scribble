const { menubar } = require('menubar');
const Store = require('electron-store');
const ipcMain = require('electron').ipcMain

const store = new Store();

let mb = menubar({
    browserWindow:{
        minWidth: 400,
        minHeight: 200,
        width: 400,
        height: 200,
        resizable: true,
        alwaysOnTop: true,
        movable: false,
        webPreferences:{
            nodeIntegration: true,
        }
    },
    icon: __dirname + "/iconTemplate.png",
    preloadWindow: true,
});


mb.on('ready', () => {
  console.log('app is ready');

  // browserwindow event listeners must be put inside an app event
  // not on its own outside
  
  // below is for rough adjustment to keep the window under the toolbar icon
  // dynamically during resizing
  mb.window.once('will-resize', () =>{
    initial_x = mb.window.getPosition()[0] + mb.window.getSize()[0]/2
    y = mb.window.getPosition()[1]
  })

  mb.window.on('resize', () =>{
    x = initial_x - mb.window.getSize()[0]/2
    mb.window.setPosition(Math.floor(x), Math.floor(y))
  })
});

mb.on('after-create-window', () => {
  data = store.get('scribble');
  if(typeof data === 'undefined'){
    store.set('scribble', '')
    data = ''
  }
  //mb.window.webContents.openDevTools()
  windowSize = store.get('windowSize')
  if (typeof windowSize === 'undefined'){
    windowSize = mb.window.getSize()
    store.set('windowSize', windowSize)
  }
  mb.window.setSize(windowSize[0], windowSize[1])
  mb.window.webContents.send('fill_in_scribble', data)
});

mb.on('focus-lost', () => {
    mb.window.webContents.send('save_scribble', '')
    store.set('windowSize', mb.window.getSize())
});

ipcMain.on('save_scribble_from_render', (event, arg) => {
    store.set('scribble', arg)
});