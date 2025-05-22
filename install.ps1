Write-Host "Installing backend npm packages..."
Set-Location -Path .\backend -PassThru
npm install

Set-Location -Path .. -PassThru

Write-Host "Installing frontend npm packages..."
Set-Location -Path .\frontend -PassThru
npm install

Set-Location -Path .. -PassThru

Write-Host "Creating docker images..."
docker-compose build

Write-Host "Starting docker containers..."
docker-compose up -d

Write-Host "Installing electron npm packages..."
npm install

Write-Host "Building Electron app..."
npm run build

Write-Host "Installing the app..."
Start-Process -FilePath ".\electron\dist\MD Cloud Desktop Setup 1.0.0.exe"