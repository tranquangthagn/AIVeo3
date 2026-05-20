@echo off
REM ─── AIVEO3 — First-time setup (venv + deps) ─────────────────────────────
setlocal

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"

echo.
echo  ╭──────────────────────────────────────────╮
echo  │   AIVEO3 — Lan dau setup                 │
echo  ╰──────────────────────────────────────────╯
echo.

REM ── Backend ──────────────────────────────────────────────────────────────
echo  [1/4] Tao Python venv...
cd /d "%BACKEND%"
if not exist .venv (
  py -m venv .venv
  if errorlevel 1 (
    echo  [!] Loi tao venv. Kiem tra Python da cai chua.
    pause
    exit /b 1
  )
) else (
  echo       (venv da ton tai)
)

echo  [2/4] Cai Python dependencies...
.venv\Scripts\python.exe -m pip install --upgrade pip --quiet
.venv\Scripts\python.exe -m pip install -r requirements.txt --quiet
if errorlevel 1 (
  echo  [!] Loi cai pip deps.
  pause
  exit /b 1
)

echo  [3/4] Copy .env tu template...
if not exist .env (
  copy .env.example .env >nul
  echo       OK
) else (
  echo       (.env da ton tai)
)

REM ── Frontend ─────────────────────────────────────────────────────────────
echo  [4/4] Cai Node dependencies (mat 1-2 phut)...
cd /d "%FRONTEND%"
if not exist node_modules (
  call npm install --no-audit --no-fund --silent
  if errorlevel 1 (
    echo  [!] Loi npm install.
    pause
    exit /b 1
  )
) else (
  echo       (node_modules da ton tai)
)

echo.
echo  ✓ Setup xong! Chay start.bat de start app.
echo.
pause

endlocal
