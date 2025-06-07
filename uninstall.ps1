Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$rootDir = $PSScriptRoot
$frontendDir = Join-Path $rootDir "frontend"
$backendDir = Join-Path $rootDir "backend"
$electronDist = Join-Path $rootDir "electron\dist"
$logFile = Join-Path $rootDir "uninstall.log"
Clear-Content -Path $logFile -ErrorAction SilentlyContinue

function Safe-Remove([string]$path) {
    if (Test-Path $path) {
        Write-Host "Removing: $path"
        "Removing: $path" *>> $logFile
        Remove-Item -LiteralPath $path -Force -Recurse
    }
    else {
        Write-Host "Folder not found -> skipping: $path"
        "Folder not found -> skipping: $path" *>> $logFile
    }
}

$apiKeyScript = Join-Path $rootDir "backend\src\utils\deleteApiKey.js"
node $apiKeyScript *>> $logFile

Write-Host "API key has been removed from secure storage"

Safe-Remove (Join-Path $rootDir "node_modules")
Safe-Remove (Join-Path $frontendDir "node_modules")
Safe-Remove (Join-Path $backendDir "node_modules")
Safe-Remove $electronDist

$programFiles = $Env:ProgramFiles
$installDir = Join-Path $programFiles "MD-Cloud-Desktop"

if (-not (Test-Path $installDir)) {
    Write-Warning "Installation folder not found $installDir"
    "Installation folder not found $installDir" *>> $logFile
    exit 1
}

Push-Location $installDir

$uninstaller = Join-Path $installDir "Uninstall MD-Cloud-Desktop.exe"
if (-not (Test-Path $uninstaller)) {
    Write-Warning "Uninstaller not found at $uninstaller"
    "Uninstaller not found at $uninstaller" *>> $logFile
    exit 1
}

Write-Host "Running uninstaller $uninstaller"

& $uninstaller

Pop-Location
