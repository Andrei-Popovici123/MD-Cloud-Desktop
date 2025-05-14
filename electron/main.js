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
      contextIsolation: false,
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
  startDockerCompose();
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

//docker start script

const startDockerCompose = () => {
  const composePath = path.join(__dirname, '../docker-compose.yml');


  exec(`docker compose  up -d`, (error, stdout, stderr) => {
    if (error) {
      console.error(` Docker Compose failed: ${error.message}`);
      return;
    }
    if (stderr) console.warn(` Docker stderr: ${stderr}`);
    console.log(` Docker stdout: ${stdout}`);
  });
};

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});