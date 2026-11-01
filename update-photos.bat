@echo off
rem ===========================================================================
rem  NS SMART - update-photos.bat
rem  Double-click this after dropping new photos into the assets\images folders.
rem  Every JPG/PNG there becomes a small, web-ready .webp with the same name
rem  (GPS location removed), and the original JPG/PNG is deleted.
rem  For your computer only: don't upload this file to Xneelo.
rem ===========================================================================
cd /d "%~dp0"
python tools\prepare-photos.py
echo.
pause
