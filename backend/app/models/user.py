from sqlalchemy import Column, Integer, String, Date, DateTime, Enum
from sqlalchemy.sql import func
from ..database import Base


class User(Base):
    __tablename__ = "user"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    user_hash  = Column(String(40), unique=True, nullable=False)
    name       = Column(String(255), nullable=False, default="")
    birth_date = Column(Date, nullable=True)
    email      = Column(String(255), unique=True, nullable=True)
    password   = Column(String(255), nullable=True)
    country    = Column(String(100), nullable=True)
    sex        = Column(Enum("male", "female", "other"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
