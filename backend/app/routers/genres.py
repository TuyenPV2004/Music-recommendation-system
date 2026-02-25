from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..dependencies import get_db
from ..models.song import Genre

router = APIRouter()

# Bảng màu cho frontend genre cards
GENRE_COLORS = [
    "bg-blue-500", "bg-red-500", "bg-purple-500", "bg-yellow-500",
    "bg-green-600", "bg-pink-500", "bg-indigo-500", "bg-orange-500",
    "bg-teal-500", "bg-cyan-500", "bg-rose-500", "bg-violet-500",
]


@router.get("")
def list_genres(db: Session = Depends(get_db)):
    """Danh sách tất cả thể loại nhạc"""
    genres = db.query(Genre).order_by(Genre.name).all()
    return {
        "success": True,
        "data": [
            {
                "id": g.id,
                "name": g.name,
                "color": GENRE_COLORS[i % len(GENRE_COLORS)],
            }
            for i, g in enumerate(genres)
        ],
    }
