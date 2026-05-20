from sqlalchemy import JSON, Boolean, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class PipelineConfig(Base):
    """Singleton row — id=1 always."""

    __tablename__ = "pipeline_config"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    niche: Mapped[str] = mapped_column(String(255), default="")
    audience: Mapped[str] = mapped_column(String(255), default="")
    tone: Mapped[str] = mapped_column(String(40), default="Casual")
    quota: Mapped[int] = mapped_column(Integer, default=5)
    days: Mapped[dict] = mapped_column(JSON, default=dict)
    slots: Mapped[list[str]] = mapped_column(JSON, default=list)
    paused: Mapped[bool] = mapped_column(Boolean, default=False)


class AppSettings(Base):
    """Singleton row — id=1 always."""

    __tablename__ = "app_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    weights: Mapped[dict] = mapped_column(JSON, default=dict)
    auto_approve_threshold: Mapped[int] = mapped_column(Integer, default=90)
    budget_daily: Mapped[float] = mapped_column(Float, default=20.0)
    budget_monthly: Mapped[float] = mapped_column(Float, default=500.0)
    budget_alert_at: Mapped[int] = mapped_column(Integer, default=80)
