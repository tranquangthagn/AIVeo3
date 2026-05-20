@echo off
REM ─── AIVEO3 — Start backend + frontend in 2 windows ──────────────────────
setlocal

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"

echo.
echo  ╭──────────────────────────────────────────╮
echo  │   AIVEO3 — Starting backend ^& frontend   │
echo  ╰──────────────────────────────────────────╯
echo.

if not exist "%BACKEND%\.venv\Scripts\python.exe" (
  echo  [!] Backend venv chua ton tai. Chay setup.bat truoc.
  pause
  exit /b 1
)

if not exist "%FRONTEND%\node_modules" (
  echo  [!] Frontend node_modules chua co. Chay setup.bat truoc.
  pause
  exit /b 1
)

echo  [1/2] Mo backend tab (port 8000)...
start "AIVEO3 Backend" cmd /k "cd /d "%BACKEND%" && .venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"

timeout /t 2 /nobreak >nul

echo  [2/2] Mo frontend tab (port 5173)...
start "AIVEO3 Frontend" cmd /k "cd /d "%FRONTEND%" && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo  ✓ Backend:  http://localhost:8000  (Swagger: /docs)
echo  ✓ Frontend: http://localhost:5173
echo.
echo  Mo browser tu dong sau 3 giay... (Ctrl+C de huy)
timeout /t 3 /nobreak >nul
start http://localhost:5173

endlocal
exit /b 0
