Write-Host "Checking if Docker is installed..."

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is not installed. Please install Docker Desktop from https://docs.docker.com/desktop/setup/install/windows-install/"
    Exit 1
}

Write-Host "Docker is installed. Checking if Docker Desktop is running..."

if(-not ((docker ps 2>&1) -match '^(?!error)')){
   Write-Host "Docker Desktop is not running. Please start Docker Desktop and try again."
   Exit 1
}

Write-Host "Docker Desktop is running. Proceeding..."

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