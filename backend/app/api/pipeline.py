import random
from datetime import datetime
from typing import Annotated
from urllib.parse import quote

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.db import get_db
from app.models import PipelineConfig, VideoJob
from app.schemas.job import GenerateBody, VideoJobOut

router = APIRouter(prefix="/api/pipeline", tags=["pipeline"])

DbDep = Annotated[AsyncSession, Depends(get_db)]

_LIVE_STATUSES = (
    "queued",
    "generating_idea",
    "writing_script",
    "generating_video",
    "assembling",
    "scoring",
)

_IDEA_POOL = [
    "Top 3 AI tools cho creator 2026",
    "Cách dùng Veo3 tạo video viral",
    "Một ngày dùng AI thay assistant",
    "5 prompt giúp Veo3 ra video đẹp x10",
    "AI Agent vs ChatGPT — khác biệt thực sự",
]


def _thumb(seed: str, hue: int) -> str:
    svg = (
        f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 640'>"
        f"<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>"
        f"<stop offset='0%' stop-color='hsl({hue},80%,55%)'/>"
        f"<stop offset='100%' stop-color='hsl({(hue + 40) % 360},80%,40%)'/></linearGradient></defs>"
        f"<rect width='360' height='640' fill='url(#g)'/>"
        f"<text x='180' y='340' text-anchor='middle' font-family='sans-serif' font-size='26' "
        f"font-weight='700' fill='white'>{seed}</text></svg>"
    )
    return f"data:image/svg+xml;utf8,{quote(svg)}"


@router.get("/live", response_model=list[VideoJobOut])
async def live_jobs(db: DbDep):
    stmt = (
        select(VideoJob)
        .options(selectinload(VideoJob.clips), selectinload(VideoJob.score_breakdown))
        .where(VideoJob.status.in_(_LIVE_STATUSES))
        .order_by(VideoJob.created_at.desc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/generate", response_model=VideoJobOut)
async def generate_now(body: GenerateBody, db: DbDep):
    title = body.title or random.choice(_IDEA_POOL)
    topic = body.topic or "AI productivity"
    new_id = f"job-{random.randint(1300, 9999)}"

    job = VideoJob(
        id=new_id,
        title=title,
        topic=topic,
        status="generating_idea",
        progress=5,
        thumbnail_url=_thumb(title[:24], random.randint(200, 340)),
        duration=0,
        ai_score=0,
        created_at=datetime.utcnow(),
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job


@router.post("/pause")
async def pause_pipeline(db: DbDep):
    cfg = (await db.execute(select(PipelineConfig).where(PipelineConfig.id == 1))).scalar_one()
    cfg.paused = True
    await db.commit()
    return {"paused": True}


@router.post("/resume")
async def resume_pipeline(db: DbDep):
    cfg = (await db.execute(select(PipelineConfig).where(PipelineConfig.id == 1))).scalar_one()
    cfg.paused = False
    await db.commit()
    return {"paused": False}


@router.post("/tick", include_in_schema=False)
async def tick_pipeline(db: DbDep):
    """Internal — advance live jobs by random amount. Called from frontend interval as a fake worker."""
    cfg = (await db.execute(select(PipelineConfig).where(PipelineConfig.id == 1))).scalar_one()
    if cfg.paused:
        return {"ticked": 0}

    stmt = select(VideoJob).where(VideoJob.status.in_(_LIVE_STATUSES))
    jobs = (await db.execute(stmt)).scalars().all()

    for j in jobs:
        increment = random.random() * 4 + 1
        j.progress = min(100, (j.progress or 0) + increment)
        if j.progress > 35 and j.status == "writing_script":
            j.status = "generating_video"
        elif j.progress > 75 and j.status == "generating_video":
            j.status = "assembling"
        elif j.progress >= 100 and j.status != "scoring":
            j.status = "scoring"

    await db.commit()
    return {"ticked": len(jobs)}
