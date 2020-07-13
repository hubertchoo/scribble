const {ipcRenderer, ipcMain} = require('electron');

ipcRenderer.on('fill_in_scribble', (event, arg) => {
    document.getElementById('scribble_area').value = arg
});

ipcRenderer.on('save_scribble', (event, arg) => {
    data = document.getElementById('scribble_area').value
    ipcRenderer.send('save_scribble_from_render', data)
});