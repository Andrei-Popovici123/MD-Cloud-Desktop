const { app, BrowserWindow,ipcMain } = require('electron');
const { exec } =require('child_process');
const path = require('path');

let mainWindow;
let fileToUpload = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname,'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });
 
  
  mainWindow.loadURL('http://localhost:5173');
  
  mainWindow.webContents.openDevTools();
  
  mainWindow.webContents.once('did-finish-load',()=>{
    if(fileToUpload){
      mainWindow?.webContents.send('file-to-upload', fileToUpload)
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(()=>{

//checks if file has been picked up by the context menu

createWindow();
  const args =process.argv;

  if(args.length>=2){

  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});