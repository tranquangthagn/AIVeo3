"""Seed database with mock data matching frontend, for dev/demo."""

from datetime import datetime, timedelta
from urllib.parse import quote

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import AppSettings, Clip, PipelineConfig, ScoreBreakdown, VideoJob


def _thumb(seed: str, hue: int = 270) -> str:
    svg = (
        f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 640'>"
        f"<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>"
        f"<stop offset='0%' stop-color='hsl({hue},80%,55%)'/>"
        f"<stop offset='100%' stop-color='hsl({(hue + 40) % 360},80%,40%)'/></linearGradient></defs>"
        f"<rect width='360' height='640' fill='url(#g)'/>"
        f"<text x='180' y='340' text-anchor='middle' font-family='sans-serif' font-size='28' "
        f"font-weight='700' fill='white' opacity='0.95'>{seed}</text></svg>"
    )
    return f"data:image/svg+xml;utf8,{quote(svg)}"


def _now(minutes_ago: int = 0) -> datetime:
    return datetime.utcnow() - timedelta(minutes=minutes_ago)


async def seed_if_empty(session: AsyncSession) -> None:
    result = await session.execute(select(VideoJob).limit(1))
    if result.scalar_one_or_none() is not None:
        return  # already seeded

    # PipelineConfig singleton
    session.add(
        PipelineConfig(
            id=1,
            niche="Công nghệ AI, productivity tools",
            audience="GenZ Việt Nam 18-30, tech enthusiast",
            tone="Casual",
            quota=5,
            days={"mon": True, "tue": True, "wed": True, "thu": True, "fri": True, "sat": False, "sun": False},
            slots=["08:00", "14:00"],
            paused=False,
        )
    )

    # AppSettings singleton
    session.add(
        AppSettings(
            id=1,
            weights={"hook": 30, "visual": 20, "audio": 15, "caption": 15, "trend": 20},
            auto_approve_threshold=90,
            budget_daily=20.0,
            budget_monthly=500.0,
            budget_alert_at=80,
        )
    )

    # Review queue jobs
    job1247 = VideoJob(
        id="job-1247",
        title="5 mẹo dùng AI tăng productivity",
        topic="AI productivity",
        status="review",
        progress=100,
        thumbnail_url=_thumb("5 mẹo AI", 270),
        duration=35,
        ai_score=87,
        verdict="approve_recommended",
        caption="5 cách dùng AI tăng x2 productivity 🚀 Bạn áp dụng cái nào đầu tiên?",
        hashtags=["#ai", "#productivity", "#aivietnam", "#fyp"],
        suggestions=[
            "Re-generate scene 3 để fix nhiễu visual",
            "Thêm hashtag #AIVietNam và #productivity2026",
            "Tăng speed voiceover lên 1.1x cho khớp cut",
        ],
        created_at=_now(32),
    )
    job1247.clips = [
        Clip(id="c1247-1", idx=1, duration=5, prompt="Person looking at glowing AI screens", thumbnail_url=_thumb("1", 270)),
        Clip(id="c1247-2", idx=2, duration=6, prompt="Hands typing on laptop, code flowing", thumbnail_url=_thumb("2", 260)),
        Clip(id="c1247-3", idx=3, duration=8, prompt="Split screen comparing tasks", thumbnail_url=_thumb("3", 250), warning="Visual jitter at 0:18"),
        Clip(id="c1247-4", idx=4, duration=8, prompt="Calendar auto-filling with smart blocks", thumbnail_url=_thumb("4", 240)),
        Clip(id="c1247-5", idx=5, duration=8, prompt="Happy creator with finished work, sunset", thumbnail_url=_thumb("5", 230)),
    ]
    job1247.score_breakdown = [
        ScoreBreakdown(criterion="hook", score=9, weight=30, feedback="Câu hỏi mở đầu cuốn hút, hook trong 2s đầu rất mạnh."),
        ScoreBreakdown(criterion="visual", score=8, weight=20, feedback="Clip 3 có nhiễu nhẹ ở giây 0:18, các clip còn lại sharp."),
        ScoreBreakdown(criterion="audio", score=8, weight=15, feedback="Voiceover hơi chậm so với cut. Music khớp beat ổn."),
        ScoreBreakdown(criterion="caption", score=9, weight=15, feedback="CTA mạnh, mix hashtag trending + niche cân đối."),
        ScoreBreakdown(criterion="trend", score=7, weight=20, feedback="Topic OK nhưng chưa nằm trong peak trend tuần này."),
    ]
    session.add(job1247)

    job1245 = VideoJob(
        id="job-1245",
        title="Veo3 vs Sora — ai mạnh hơn?",
        topic="AI video comparison",
        status="review",
        progress=100,
        thumbnail_url=_thumb("Veo3 vs Sora", 200),
        duration=42,
        ai_score=64,
        verdict="needs_edit",
        caption="So sánh Veo3 và Sora chi tiết, đâu là tool tốt hơn cho creator?",
        hashtags=["#ai", "#veo3", "#sora"],
        suggestions=["Rút hook xuống 2s", "Viết lại caption ngắn hơn + thêm CTA"],
        created_at=_now(110),
    )
    job1245.score_breakdown = [
        ScoreBreakdown(criterion="hook", score=6, weight=30, feedback="Hook OK nhưng chậm, mất 4s mới vào main topic."),
        ScoreBreakdown(criterion="visual", score=7, weight=20, feedback="Comparison frame rõ, nhưng lighting không đều."),
        ScoreBreakdown(criterion="audio", score=7, weight=15, feedback="Voiceover rõ ràng, music ổn."),
        ScoreBreakdown(criterion="caption", score=5, weight=15, feedback="Caption hơi dài và thiếu CTA."),
        ScoreBreakdown(criterion="trend", score=8, weight=20, feedback="Trend tốt — AI comparison đang hot."),
    ]
    session.add(job1245)

    job1244 = VideoJob(
        id="job-1244",
        title="AI Agent là gì? 60s giải thích",
        topic="AI education",
        status="review",
        progress=100,
        thumbnail_url=_thumb("AI Agent", 340),
        duration=58,
        ai_score=42,
        verdict="reject_recommended",
        caption="AI Agent là gì?",
        hashtags=["#ai"],
        suggestions=["Re-generate toàn bộ với hook hấp dẫn hơn", "Pick angle mới: AI Agent thay developer?"],
        created_at=_now(145),
    )
    job1244.score_breakdown = [
        ScoreBreakdown(criterion="hook", score=3, weight=30, feedback="Hook yếu, mở đầu là định nghĩa khô khan."),
        ScoreBreakdown(criterion="visual", score=6, weight=20, feedback="Visual ổn, nhưng nhiều text wall."),
        ScoreBreakdown(criterion="audio", score=5, weight=15, feedback="Voiceover monotone, thiếu cảm xúc."),
        ScoreBreakdown(criterion="caption", score=4, weight=15, feedback="Caption thiếu hook."),
        ScoreBreakdown(criterion="trend", score=5, weight=20, feedback="Topic basic, đã có nhiều video tương tự."),
    ]
    session.add(job1244)

    # Published history
    session.add(
        VideoJob(
            id="job-1242",
            title="Veo3 vs Sora — ai mạnh hơn?",
            topic="comparison",
            status="published",
            progress=100,
            thumbnail_url=_thumb("Veo3 vs Sora", 200),
            duration=42,
            ai_score=92,
            views=5420,
            likes=412,
            created_at=_now(60 * 26),
            published_at=_now(60 * 20),
        )
    )
    session.add(
        VideoJob(
            id="job-1241",
            title="Tôi để AI viết content 30 ngày, kết quả?",
            topic="AI experiment",
            status="published",
            progress=100,
            thumbnail_url=_thumb("AI 30 ngày", 175),
            duration=38,
            ai_score=89,
            views=12300,
            likes=1050,
            created_at=_now(60 * 48),
            published_at=_now(60 * 42),
        )
    )
    session.add(
        VideoJob(
            id="job-1240",
            title="ChatGPT vs Claude — pick ai?",
            topic="AI tools",
            status="approved",
            progress=100,
            thumbnail_url=_thumb("ChatGPT vs Claude", 150),
            duration=40,
            ai_score=78,
            created_at=_now(60 * 72),
            scheduled_for=_now(-60 * 4),  # future
        )
    )

    # Live pipeline (in-progress jobs)
    session.add(
        VideoJob(
            id="job-1248",
            title="Tại sao Veo3 thay đổi content creation",
            topic="AI video",
            status="generating_video",
            progress=55,
            thumbnail_url=_thumb("Veo3 changes", 285),
            duration=0,
            ai_score=0,
            created_at=_now(4),
        )
    )
    session.add(
        VideoJob(
            id="job-1249",
            title="10 prompt Veo3 viral nhất tuần này",
            topic="AI prompt",
            status="writing_script",
            progress=25,
            thumbnail_url=_thumb("10 viral prompts", 305),
            duration=0,
            ai_score=0,
            created_at=_now(1),
        )
    )

    await session.commit()
