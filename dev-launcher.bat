@echo off
REM Get path from context menu
set FILE_PATH=%1

REM Activate Python middleware
python C:\Users\alexc\Desktop\MD-Cloud-Desktop\backend\src\middleware\archive.py "%FILE_PATH%"