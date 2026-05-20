from pydantic import BaseModel, ConfigDict


class PipelineConfigOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    niche: str
    audience: str
    tone: str
    quota: int
    days: dict
    slots: list[str]
    paused: bool


class PipelineConfigPatch(BaseModel):
    niche: str | None = None
    audience: str | None = None
    tone: str | None = None
    quota: int | None = None
    days: dict | None = None
    slots: list[str] | None = None
    paused: bool | None = None


class AppSettingsOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    weights: dict
    auto_approve_threshold: int
    budget_daily: float
    budget_monthly: float
    budget_alert_at: int


class AppSettingsPatch(BaseModel):
    weights: dict | None = None
    auto_approve_threshold: int | None = None
    budget_daily: float | None = None
    budget_monthly: float | None = None
    budget_alert_at: int | None = None
