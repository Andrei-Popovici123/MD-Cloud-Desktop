const { app, BrowserWindow,ipcMain } = require('electron');
const { spawn } =require('child_process');
const path = require('path');
const { argv } = require('process');
const fs = require('fs');

let mainWindow;
let queuedFilePath = null;


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname,'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });
 
  
  mainWindow.loadURL('http://localhost:5173');
  
  // mainWindow.webContents.openDevTools();
  
  mainWindow.webContents.once('did-finish-load',()=>{
    if(queuedFilePath){
      mainWindow.webContents.send('context-binary-upload', queuedFilePath);
      queuedFilePath =null;
    }
  });
    mainWindow.on('closed', () => {
    mainWindow = null;
  });

}

app.whenReady().then(() =>{
  createWindow();
  queuedFilePath = extractValidPath(process.argv);


  app.on('activate', function (){
    if(BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


ipcMain.handle('run-middleware', async (_event, filePath) => {
    return new Promise((resolve, reject) => {
        const py = spawn('python', [path.join(__dirname, '..', 'backend', 'src', 'middleware', 'archive.py'), filePath]);

        const chunks = [];
        py.stdout.on('data', (chunk) => {
            chunks.push(chunk);
        });

        py.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        py.on('close', (code) => {
            if (code === 0) {
                const buffer = Buffer.concat(chunks);
                resolve(buffer);
            } else {
              const error = new Error(`Middleware exited with code ${code}`);
              error.code = code
                reject(error);
            }
        });

        py.on('error', (err) => {
            reject(err);
        });
    });
});

function extractValidPath(argv) {
  const args = argv.slice(2); 

  for (let i = 0; i < args.length; i++) {
    for (let j = args.length; j > i; j--) {
      const possiblePath = args.slice(i, j).join(' ').replace(/^"+|"+$/g, '');
      if (possiblePath.startsWith('--')) continue; 

      try {
        if (fs.existsSync(possiblePath)) {
          return possiblePath;
        }
      } catch {
        continue;
      }
    }
  }

  return null;
}
