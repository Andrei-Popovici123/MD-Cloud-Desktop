# MD Desktop

A desktop application for scanning files and folders using OPSWAT's MetaDefender Cloud API. Built with Electron, React, Docker, Node.js and Python.

## Features

- 🔍 Multiple scanning engines for comprehensive file analysis
- 🛡️ Deep CDR (Content Disarm and Reconstruction) 
- 🔐 Proactive DLP (Data Loss Prevention)
- 📂 Support for both single files and folder scanning
- 🗄️ Archive extraction and scanning
- 🖥️ Cross-platform support (Windows, Linux)
- 📱 Modern responsive UI with real-time progress updates
- 🖱️ Windows and Linux right-click context menu integration (right-click "Scan with OPSWAT")
  
## Prerequisites

- Node.js >= 22.x
- Python >= 3.8
- OPSWAT MetaDefender API key
- Docker
- Docker Desktop >= 4.37

## Setup

### 1. Clone the repo
```cmd
git clone https://github.com/Andrei-Popovici123/MD-Cloud-Desktop.git
cd MD-Cloud-Desktop
```
### 2. Run the install script depending on your OS:

### Windows
```cmd
.\install.cmd -apikey <your-api-key>
```

### Linux
```bash
chmod +x install.sh
sudo ./install.sh -apikey <your-api-key>
```

### A shortcut has been created on your Desktop from which you can start the app now.


## Uninstall process

### Windows
```cmd
.\uninstall.cmd
```

### Linux
```bash
chmod +x uninstall.sh
sudo ./uninstall.sh
```

## Project Structure

```
MD-Cloud-Desktop/
├── assets/              # System integration assets
├── backend/            
│   ├── src/            # Backend source code
│   └── server.js       # Express server
├── electron/           
│   ├── main.js         # Electron main process
│   └── preload.js      # Preload scripts
├── frontend/           
│   └── src/            # React frontend code
├── install.cmd         # Windows installer
└── install.sh          # Linux installer
└── uninstall.cmd       # Windows uninstaller
└── uninstall.sh        # Linux uninstaller
```

## Features in Detail

### Right-click Context Menu Integration
- Right-click any file / folder to scan it directly
- Quick access to scanning functionality
- Automatically launches MD Desktop with selected file
  
### MultiScanning
- Multiple antivirus engine scanning
- Real-time scan progress updates
- Detailed scan results per engine

### Deep CDR
- Document sanitization
- Removal of potentially malicious content
- Safe format regeneration

### Proactive DLP
- Detection of sensitive information
- Support for various data types (CCN, SSN, etc.)
- Redaction capabilities
