Write-Host "Installing npm packages..."
npm install

Write-Host "Building Electron app..."
npm run build

Write-Host "Installing the app..."
Start-Process -FilePath ".\electron\dist\MD Cloud Desktop Setup 1.0.0.exe"