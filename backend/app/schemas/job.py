from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ClipOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    idx: int
    duration: int
    prompt: str
    thumbnail_url: str | None = Field(None, alias="thumbnail")
    video_url: str | None = None
    warning: str | None = None


class ScoreBreakdownOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    criterion: str
    score: int
    weight: int
    feedback: str


class VideoJobOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    topic: str
    status: str
    progress: float
    caption: str | None = None
    hashtags: list[str] | None = None
    thumbnail_url: str | None = None
    video_url: str | None = None
    duration: int
    ai_score: int
    verdict: str | None = None
    suggestions: list[str] | None = None
    views: int | None = None
    likes: int | None = None
    error_message: str | None = None
    created_at: datetime
    scored_at: datetime | None = None
    published_at: datetime | None = None
    scheduled_for: datetime | None = None
    clips: list[ClipOut] = []
    score_breakdown: list[ScoreBreakdownOut] = []


class VideoJobPatch(BaseModel):
    caption: str | None = None
    hashtags: list[str] | None = None


class ApproveBody(BaseModel):
    scheduled_for: datetime | None = None


class GenerateBody(BaseModel):
    title: str | None = None
    topic: str | None = None


class SuggestHashtagsBody(BaseModel):
    existing: list[str] = []


class SuggestHashtagsOut(BaseModel):
    hashtags: list[str]


JobSortKey = Literal["score_desc", "score_asc", "newest", "oldest", "views_desc"]
