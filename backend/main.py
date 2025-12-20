from __future__ import annotations

from fastapi import FastAPI

from .database import Base, engine
from .routes import campaigns


def create_app() -> FastAPI:
    app = FastAPI(title="Instalora Partner Studio API")
    app.include_router(campaigns.router)
    return app


Base.metadata.create_all(bind=engine)
app = create_app()
