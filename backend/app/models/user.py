from sqlalchemy import Column, String, Date, DateTime, Enum
from sqlalchemy.sql import func
from ..database import Base


class User(Base):
    __tablename__ = "user"

    user_id    = Column(String(40), primary_key=True)
    name       = Column(String(255), nullable=False, default="")
    birth_date = Column(Date, nullable=True)
    email      = Column(String(255), unique=True, nullable=True)
    password   = Column(String(255), nullable=True)
    country    = Column(String(100), nullable=True)
    gender     = Column(Enum("male", "female", "other"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
