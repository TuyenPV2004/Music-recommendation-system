from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..dependencies import get_db
from ..models.song import Mood

router = APIRouter()


@router.get("")
def list_moods(db: Session = Depends(get_db)):
    """Danh sách tất cả mood/cảm xúc"""
    moods = db.query(Mood).order_by(Mood.name).all()
    return {
        "success": True,
        "data": [{"id": m.id, "name": m.name} for m in moods],
    }
