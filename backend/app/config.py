"""
Configuration settings for Social Network Backend
"""

from os.path import dirname, join
from typing import List, ClassVar
from pydantic_settings import BaseSettings

# Use root .env file
dotenv_path = join(dirname(__file__), '..', '..', '.env')

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # App Settings
    APP_NAME: str = "Zephyr Social Network"
    DEBUG: bool = False
    
    # Database (SQLite for dev, MySQL for production)
    DATABASE_URL: str = "sqlite:///./database.db"
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    
    # API
    API_PREFIX: str = "/api"
    
    env_file: ClassVar[str] = dotenv_path
    case_sensitive: ClassVar[bool] = True


settings = Settings()
