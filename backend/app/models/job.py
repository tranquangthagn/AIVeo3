from datetime import datetime
from enum import Enum

from sqlalchemy import JSON, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


class JobStatus(str, Enum):
    queued = "queued"
    generating_idea = "generating_idea"
    writing_script = "writing_script"
    generating_video = "generating_video"
    assembling = "assembling"
    scoring = "scoring"
    review = "review"
    approved = "approved"
    published = "published"
    rejected = "rejected"
    failed = "failed"


class Verdict(str, Enum):
    approve_recommended = "approve_recommended"
    needs_edit = "needs_edit"
    reject_recommended = "reject_recommended"


class VideoJob(Base):
    __tablename__ = "video_jobs"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    topic: Mapped[str] = mapped_column(String(120))
    status: Mapped[str] = mapped_column(String(40), default=JobStatus.queued.value, index=True)
    progress: Mapped[float] = mapped_column(Float, default=0.0)

    caption: Mapped[str | None] = mapped_column(Text, nullable=True)
    hashtags: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    thumbnail_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    video_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    duration: Mapped[int] = mapped_column(Integer, default=0)

    ai_score: Mapped[int] = mapped_column(Integer, default=0)
    verdict: Mapped[str | None] = mapped_column(String(40), nullable=True)
    suggestions: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)

    views: Mapped[int | None] = mapped_column(Integer, nullable=True)
    likes: Mapped[int | None] = mapped_column(Integer, nullable=True)

    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    scored_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    published_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    scheduled_for: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    clips: Mapped[list["Clip"]] = relationship(
        "Clip",
        back_populates="job",
        cascade="all, delete-orphan",
        order_by="Clip.idx",
    )
    score_breakdown: Mapped[list["ScoreBreakdown"]] = relationship(
        "ScoreBreakdown",
        back_populates="job",
        cascade="all, delete-orphan",
    )


class Clip(Base):
    __tablename__ = "clips"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    job_id: Mapped[str] = mapped_column(ForeignKey("video_jobs.id", ondelete="CASCADE"), index=True)
    idx: Mapped[int] = mapped_column(Integer)
    prompt: Mapped[str] = mapped_column(Text)
    duration: Mapped[int] = mapped_column(Integer, default=0)
    thumbnail_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    video_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    warning: Mapped[str | None] = mapped_column(Text, nullable=True)
    regen_count: Mapped[int] = mapped_column(Integer, default=0)

    job: Mapped["VideoJob"] = relationship("VideoJob", back_populates="clips")


class ScoreBreakdown(Base):
    __tablename__ = "score_breakdowns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    job_id: Mapped[str] = mapped_column(ForeignKey("video_jobs.id", ondelete="CASCADE"), index=True)
    criterion: Mapped[str] = mapped_column(String(40))  # hook | visual | audio | caption | trend
    score: Mapped[int] = mapped_column(Integer)  # 0-10
    weight: Mapped[int] = mapped_column(Integer)  # 0-100
    feedback: Mapped[str] = mapped_column(Text)

    job: Mapped["VideoJob"] = relationship("VideoJob", back_populates="score_breakdown")
