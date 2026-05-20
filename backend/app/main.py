from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import ai, config, jobs, pipeline
from app.core.config import settings
from app.core.db import Base, SessionLocal, engine
from app.core.seed import seed_if_empty


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Create tables (Alembic optional in Phase 2; auto-create cho dev)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    # Seed if empty
    async with SessionLocal() as session:
        await seed_if_empty(session)
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="AIVEO3 — AI Video Pipeline backend",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router)
app.include_router(pipeline.router)
app.include_router(config.router)
app.include_router(ai.router)


@app.get("/health")
async def health():
    return {"status": "ok", "app": settings.app_name}
