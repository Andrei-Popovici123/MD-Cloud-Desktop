@echo off
REM Path to the selected file or folder
set FILE_PATH=%1

REM Run the Python middleware with the selected path
REM python "C:\Program Files\MD-Desktop\backend\src\middleware\archive.py" "%FILE_PATH%"
python ".\backend\src\middleware\archive.py" "%FILE_PATH%"

REM  Launch Electron app and pipe zipped data
REM "C:\Program Files\MD-Desktop\MD-Desktop.exe" --zipped-stdin
