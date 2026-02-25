from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..dependencies import get_db, get_current_user
from ..models.user import User
from ..schemas.user import UserResponse, UserUpdate

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    """Lấy thông tin user hiện tại từ JWT token"""
    return current_user


@router.put("/me", response_model=UserResponse)
def update_profile(
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cập nhật thông tin user (name, birth_date)"""
    if data.name is not None:
        current_user.name = data.name
    if data.birth_date is not None:
        current_user.birth_date = data.birth_date
    db.commit()
    db.refresh(current_user)
    return current_user
