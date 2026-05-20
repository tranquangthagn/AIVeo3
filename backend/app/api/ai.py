import asyncio
import random

from fastapi import APIRouter

from app.schemas.job import SuggestHashtagsBody, SuggestHashtagsOut

router = APIRouter(prefix="/api/ai", tags=["ai"])

_HASHTAG_POOL = [
    "#fyp",
    "#aitools",
    "#productivity2026",
    "#aivietnam",
    "#tech",
    "#creator",
    "#veo3",
    "#viralvideo",
    "#trendingnow",
    "#promptengineering",
]


@router.post("/suggest-hashtags", response_model=SuggestHashtagsOut)
async def suggest_hashtags(body: SuggestHashtagsBody):
    """Mock — Phase 3 sẽ gọi Claude API."""
    await asyncio.sleep(0.8)
    pool = [h for h in _HASHTAG_POOL if h not in body.existing]
    random.shuffle(pool)
    return SuggestHashtagsOut(hashtags=pool[:4])
