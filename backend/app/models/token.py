from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base


class ResetPasswordToken(Base):
    __tablename__ = "Reset_Password_Token"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    user_id    = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"), nullable=False)
    token      = Column(String(512), nullable=False)
    used_at    = Column(DateTime, nullable=True)
    expired_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
