"""
FastAPI main application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes.router import router
from app.config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    description="A simple social networking application backend",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(router, prefix=settings.API_PREFIX)


@app.get("/")
def read_root():
    """
    Root endpoint
    """
    return {
        "message": "Social Networking App API",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"}
