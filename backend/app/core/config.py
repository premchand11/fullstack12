from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./pdf_qa.db"
    OPENAI_API_KEY: str
    DOCUMENTS_PATH: str = "./documents"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()