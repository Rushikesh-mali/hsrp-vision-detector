@echo off
title HSRP Vision Startup Manager
echo ===================================================
echo   Starting HSRP Vision Project (Desktop + Mobile)
echo ===================================================
echo.

:: 1. Start the FastAPI Backend (Network Enabled)
echo [1/3] Starting Python Backend on 0.0.0.0...
start "HSRP Backend" cmd /k "cd /d %~dp0 && call venv\Scripts\activate && cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

:: 2. Start the React Frontend (Network Enabled)
echo [2/3] Starting React Frontend...
start "HSRP Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"

:: 3. Wait for servers to boot, then open desktop browser
echo [3/3] Waiting for servers to initialize...
timeout /t 3 /nobreak >nul
start http://localhost:5173/

echo.
echo All services launched! 
echo ===================================================
echo MOBILE ACCESS: Look at the black "HSRP Frontend" 
echo terminal window and type the "Network:" URL 
echo into your phone's web browser.
echo ===================================================