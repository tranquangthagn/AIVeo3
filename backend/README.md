# AIVEO3 Backend

FastAPI + SQLAlchemy + SQLite. Phase 2 scope: REST CRUD matching frontend.

## Setup (1 lần)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

## Run

```powershell
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

- API docs: http://localhost:8000/docs
- Health: http://localhost:8000/health
- DB file: `aiveo3.db` (auto-created, auto-seeded với mock data)

## Reset database

Xóa file `aiveo3.db` rồi restart server — seed sẽ chạy lại.

## Endpoints quan trọng

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/jobs?status=review&sort=score_desc` | List jobs (filter + sort + search) |
| GET | `/api/jobs/{id}` | Job detail kèm clips + score breakdown |
| PATCH | `/api/jobs/{id}` | Save caption/hashtags |
| POST | `/api/jobs/{id}/approve` | Approve & publish |
| POST | `/api/jobs/{id}/reject` | Reject |
| DELETE | `/api/jobs/{id}/clips/{clip_id}` | Remove clip |
| POST | `/api/jobs/{id}/clips/{clip_id}/regenerate` | Re-gen scene (mock 1.5s) |
| GET | `/api/pipeline/live` | Live jobs (queued..scoring) |
| POST | `/api/pipeline/generate` | Trigger gen 1 video mới |
| POST | `/api/pipeline/pause` / `/resume` | Toggle pipeline |
| POST | `/api/pipeline/tick` | Internal — advance live jobs |
| GET/PATCH | `/api/config` | Pipeline config |
| GET/PATCH | `/api/settings` | App settings (weights, budget) |
| POST | `/api/ai/suggest-hashtags` | Mock LLM hashtag suggest |
