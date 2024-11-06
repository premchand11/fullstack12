from sqlmodel import SQLModel, Session, create_engine
from ..core.config import get_settings

settings = get_settings()

engine = create_engine(settings.DATABASE_URL)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session