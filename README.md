# AIVEO3

Internal AI video pipeline — Veo3 + Claude scoring + TikTok publish workflow.

## 🚀 Quick start

### Lần đầu tiên (chỉ chạy 1 lần)

Double-click **`setup.bat`** — cài Python venv + pip deps + npm deps, copy `.env`.

Yêu cầu trước:
- [Python 3.12+](https://www.python.org/downloads/) (tick "Add to PATH" khi cài)
- [Node.js 20+](https://nodejs.org/)

### Mỗi lần làm việc

| Lệnh | Việc |
|---|---|
| Double-click **`start.bat`** | Mở 2 terminal: backend (port 8000) + frontend (port 5173), tự open browser |
| Double-click **`stop.bat`** | Kill 2 services theo port |

## 🌐 URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs

## 📂 Project structure

```
AIVEO3/
├── backend/          FastAPI + SQLAlchemy + SQLite
│   ├── app/
│   ├── .venv/        Python virtual env (auto-tạo)
│   ├── aiveo3.db     SQLite database (auto-tạo + seed)
│   └── requirements.txt
├── frontend/         React + Vite + Tailwind + shadcn
│   ├── src/
│   └── package.json
├── setup.bat         Lần đầu setup
├── start.bat         Run dev
└── stop.bat          Stop dev
```

## 🔄 Reset database

```powershell
cd backend
del aiveo3.db
# Restart start.bat → tự seed lại
```

## 📚 Tech stack

- **Backend:** Python 3.12 · FastAPI · SQLAlchemy 2 · SQLite · Pydantic
- **Frontend:** React 18 · TypeScript · Vite · Tailwind 3 · shadcn/ui · TanStack Query · Zustand
