@echo off
cd /d "%~dp0"

echo Starting New Game dev server...
echo URL: http://127.0.0.1:5173/
echo.

npm run dev -- --host 127.0.0.1

echo.
echo Dev server stopped.
pause
