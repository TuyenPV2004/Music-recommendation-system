from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    birth_date: Optional[date] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    success: bool = True
    token: str
    user: dict


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class MessageResponse(BaseModel):
    success: bool = True
    message: str
