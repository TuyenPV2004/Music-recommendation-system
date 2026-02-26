from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import auth, users, songs, genres, moods, interactions, playlists, recommendations, admin

app = FastAPI(
    title="Moodify API",
    description="Core Backend cho hệ thống gợi ý nhạc theo thông tin người dùng",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Mount Routers ────────────────────────────────────────
app.include_router(auth.router,            prefix="/api/auth",            tags=["Authentication"])
app.include_router(users.router,           prefix="/api/users",           tags=["Users"])
app.include_router(songs.router,           prefix="/api/songs",           tags=["Songs"])
app.include_router(genres.router,          prefix="/api/genres",          tags=["Genres"])
app.include_router(moods.router,           prefix="/api/moods",           tags=["Moods"])
app.include_router(interactions.router,    prefix="/api/interactions",    tags=["Interactions"])
app.include_router(playlists.router,       prefix="/api/playlists",       tags=["Playlists"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(admin.router,           prefix="/api/admin",           tags=["Admin"])


@app.get("/")
def root():
    return {
        "status": "Moodify API running",
        "docs": "/docs",
        "version": "1.0.0",
    }
