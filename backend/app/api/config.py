from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.models import AppSettings, PipelineConfig
from app.schemas.settings import (
    AppSettingsOut,
    AppSettingsPatch,
    PipelineConfigOut,
    PipelineConfigPatch,
)

router = APIRouter(tags=["config"])

DbDep = Annotated[AsyncSession, Depends(get_db)]


@router.get("/api/config", response_model=PipelineConfigOut)
async def get_config(db: DbDep):
    cfg = (await db.execute(select(PipelineConfig).where(PipelineConfig.id == 1))).scalar_one()
    return cfg


@router.patch("/api/config", response_model=PipelineConfigOut)
async def patch_config(body: PipelineConfigPatch, db: DbDep):
    cfg = (await db.execute(select(PipelineConfig).where(PipelineConfig.id == 1))).scalar_one()
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(cfg, field, value)
    await db.commit()
    await db.refresh(cfg)
    return cfg


@router.get("/api/settings", response_model=AppSettingsOut)
async def get_settings(db: DbDep):
    s = (await db.execute(select(AppSettings).where(AppSettings.id == 1))).scalar_one()
    return s


@router.patch("/api/settings", response_model=AppSettingsOut)
async def patch_settings(body: AppSettingsPatch, db: DbDep):
    s = (await db.execute(select(AppSettings).where(AppSettings.id == 1))).scalar_one()
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(s, field, value)
    await db.commit()
    await db.refresh(s)
    return s
