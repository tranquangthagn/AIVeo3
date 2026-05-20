from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "AIVEO3"
    debug: bool = True
    cors_origins: str = "http://localhost:5173"

    database_url: str = "sqlite+aiosqlite:///./aiveo3.db"

    gemini_api_key: str = ""
    anthropic_api_key: str = ""
    elevenlabs_api_key: str = ""

    storage_path: str = "./storage"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
