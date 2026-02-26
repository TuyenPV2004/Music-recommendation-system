from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, UniqueConstraint
from ..database import Base


class UserSongInteraction(Base):
    __tablename__ = "User_Song_Interaction"

    id              = Column(Integer, primary_key=True, autoincrement=True)
    user_id         = Column(String(40), ForeignKey("User.user_id", ondelete="CASCADE"), nullable=False)
    song_id         = Column(Integer, ForeignKey("Song.id", ondelete="CASCADE"), nullable=False)
    listen_count    = Column(Integer, nullable=False, default=0)
    rate            = Column(Float, nullable=True)
    last_listen_at  = Column(DateTime, nullable=True)
    listen_duration = Column(Integer, nullable=True)        # tổng thời gian nghe (giây)

    __table_args__ = (
        UniqueConstraint("user_id", "song_id", name="uq_usi_user_song"),
    )
