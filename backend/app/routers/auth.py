import hashlib
import uuid
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..dependencies import get_db
from ..models.user import User
from ..models.token import ResetPasswordToken
from ..schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    MessageResponse,
)
from ..services.auth_service import hash_password, verify_password, create_token

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Đăng ký tài khoản mới"""
    # 1. Check email đã tồn tại
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email đã được sử dụng")

    # 2. Tạo user_hash (SHA-1 ngẫu nhiên cho user mới, không từ CSV)
    user_hash = hashlib.sha1(uuid.uuid4().bytes).hexdigest()

    # 3. Hash password bằng bcrypt
    hashed_pw = hash_password(req.password)

    # 4. Tạo user
    user = User(
        user_id=user_hash,
        name=req.name,
        email=req.email,
        password=hashed_pw,
        birth_date=req.birth_date,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 5. Tạo JWT token
    token = create_token(user.user_id)
    return TokenResponse(
        token=token,
        user={
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "birth_date": str(user.birth_date) if user.birth_date else None,
            "country": user.country,
            "gender": user.gender,
            "created_at": str(user.created_at) if user.created_at else None,
        },
    )


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Đăng nhập hệ thống"""
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not user.password or not verify_password(req.password, user.password):
        raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không đúng")

    token = create_token(user.user_id)
    return TokenResponse(
        token=token,
        user={
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "birth_date": str(user.birth_date) if user.birth_date else None,
            "country": user.country,
            "gender": user.gender,
            "created_at": str(user.created_at) if user.created_at else None,
        },
    )


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Gửi liên kết khôi phục mật khẩu"""
    user = db.query(User).filter(User.email == req.email).first()

    if user:
        # Tạo reset token (UUID)
        raw_token = str(uuid.uuid4())
        reset_token = ResetPasswordToken(
            user_id=user.user_id,
            token=raw_token,
            expired_at=datetime.utcnow() + timedelta(hours=1),
        )
        db.add(reset_token)
        db.commit()
        # TODO: Gửi email chứa link reset-password?token=<raw_token>
        # Hiện tại chỉ lưu DB, chưa gửi email thật

    # Luôn trả success (không tiết lộ email có tồn tại không)
    return MessageResponse(message="Nếu email tồn tại, liên kết khôi phục đã được gửi.")


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Đặt lại mật khẩu bằng token"""
    # Tìm token hợp lệ
    token_record = (
        db.query(ResetPasswordToken)
        .filter(
            ResetPasswordToken.token == req.token,
            ResetPasswordToken.used_at.is_(None),
            ResetPasswordToken.expired_at > datetime.utcnow(),
        )
        .first()
    )

    if not token_record:
        raise HTTPException(status_code=400, detail="Mã xác nhận không hợp lệ hoặc đã hết hạn")

    # Update password
    user = db.query(User).filter(User.user_id == token_record.user_id).first()
    user.password = hash_password(req.new_password)

    # Đánh dấu token đã sử dụng
    token_record.used_at = datetime.utcnow()

    db.commit()
    return MessageResponse(message="Mật khẩu đã được cập nhật thành công.")
