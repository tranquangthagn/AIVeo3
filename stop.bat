@echo off
REM ─── AIVEO3 — Stop both servers by port ──────────────────────────────────
echo.
echo  Stopping AIVEO3 services...
echo.

REM Stop backend (port 8000)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000.*LISTENING"') do (
  echo  Killing backend PID %%a
  taskkill /F /PID %%a >nul 2>&1
)

REM Stop frontend (port 5173)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173.*LISTENING"') do (
  echo  Killing frontend PID %%a
  taskkill /F /PID %%a >nul 2>&1
)

echo.
echo  ✓ Done. Cua so cmd cu cua start.bat van con — dong tay.
echo.
pause
