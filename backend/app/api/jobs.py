from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.db import get_db
from app.models import Clip, VideoJob
from app.schemas.job import (
    ApproveBody,
    VideoJobOut,
    VideoJobPatch,
)

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

DbDep = Annotated[AsyncSession, Depends(get_db)]


def _sort_clause(sort: str):
    if sort == "score_desc":
        return VideoJob.ai_score.desc()
    if sort == "score_asc":
        return VideoJob.ai_score.asc()
    if sort == "newest":
        return VideoJob.created_at.desc()
    if sort == "oldest":
        return VideoJob.created_at.asc()
    if sort == "views_desc":
        return VideoJob.views.desc().nullslast()
    return VideoJob.created_at.desc()


@router.get("", response_model=list[VideoJobOut])
async def list_jobs(
    db: DbDep,
    status: str | None = Query(None, description="Filter by status"),
    verdict: str | None = Query(None, description="Filter by verdict"),
    search: str | None = None,
    sort: str = "score_desc",
    limit: int = Query(100, le=500),
):
    conds = []
    if status:
        if "," in status:
            conds.append(VideoJob.status.in_(status.split(",")))
        else:
            conds.append(VideoJob.status == status)
    if verdict:
        conds.append(VideoJob.verdict == verdict)
    if search:
        like = f"%{search.lower()}%"
        conds.append(
            or_(
                VideoJob.title.ilike(like),
                VideoJob.topic.ilike(like),
                VideoJob.id.ilike(like),
                VideoJob.caption.ilike(like),
            )
        )

    stmt = (
        select(VideoJob)
        .options(selectinload(VideoJob.clips), selectinload(VideoJob.score_breakdown))
        .where(and_(*conds) if conds else True)
        .order_by(_sort_clause(sort))
        .limit(limit)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{job_id}", response_model=VideoJobOut)
async def get_job(job_id: str, db: DbDep):
    stmt = (
        select(VideoJob)
        .options(selectinload(VideoJob.clips), selectinload(VideoJob.score_breakdown))
        .where(VideoJob.id == job_id)
    )
    job = (await db.execute(stmt)).scalar_one_or_none()
    if not job:
        raise HTTPException(404, "Job not found")
    return job


@router.patch("/{job_id}", response_model=VideoJobOut)
async def patch_job(job_id: str, body: VideoJobPatch, db: DbDep):
    stmt = (
        select(VideoJob)
        .options(selectinload(VideoJob.clips), selectinload(VideoJob.score_breakdown))
        .where(VideoJob.id == job_id)
    )
    job = (await db.execute(stmt)).scalar_one_or_none()
    if not job:
        raise HTTPException(404, "Job not found")
    if body.caption is not None:
        job.caption = body.caption
    if body.hashtags is not None:
        job.hashtags = body.hashtags
    await db.commit()
    await db.refresh(job)
    return job


@router.post("/{job_id}/approve", response_model=VideoJobOut)
async def approve_job(job_id: str, body: ApproveBody, db: DbDep):
    stmt = (
        select(VideoJob)
        .options(selectinload(VideoJob.clips), selectinload(VideoJob.score_breakdown))
        .where(VideoJob.id == job_id)
    )
    job = (await db.execute(stmt)).scalar_one_or_none()
    if not job:
        raise HTTPException(404, "Job not found")
    if body.scheduled_for:
        job.status = "approved"
        job.scheduled_for = body.scheduled_for
    else:
        job.status = "published"
        job.published_at = datetime.utcnow()
    await db.commit()
    await db.refresh(job)
    return job


@router.post("/{job_id}/reject", response_model=VideoJobOut)
async def reject_job(job_id: str, db: DbDep):
    stmt = (
        select(VideoJob)
        .options(selectinload(VideoJob.clips), selectinload(VideoJob.score_breakdown))
        .where(VideoJob.id == job_id)
    )
    job = (await db.execute(stmt)).scalar_one_or_none()
    if not job:
        raise HTTPException(404, "Job not found")
    job.status = "rejected"
    await db.commit()
    await db.refresh(job)
    return job


@router.delete("/{job_id}/clips/{clip_id}")
async def delete_clip(job_id: str, clip_id: str, db: DbDep):
    stmt = select(Clip).where(Clip.id == clip_id, Clip.job_id == job_id)
    clip = (await db.execute(stmt)).scalar_one_or_none()
    if not clip:
        raise HTTPException(404, "Clip not found")
    await db.delete(clip)
    await db.commit()
    return {"ok": True}


@router.post("/{job_id}/clips/{clip_id}/regenerate")
async def regenerate_clip(job_id: str, clip_id: str, db: DbDep):
    """Mock — Phase 3 sẽ thực sự gọi Veo3."""
    import asyncio

    stmt = select(Clip).where(Clip.id == clip_id, Clip.job_id == job_id)
    clip = (await db.execute(stmt)).scalar_one_or_none()
    if not clip:
        raise HTTPException(404, "Clip not found")
    await asyncio.sleep(1.5)  # simulate Veo3 call
    clip.regen_count = (clip.regen_count or 0) + 1
    clip.warning = None
    await db.commit()
    return {"ok": True, "regen_count": clip.regen_count}
