# Kiến trúc Core Backend
---
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app, CORS, mount routers
│   ├── config.py                # Env vars (DB URL, JWT secret)
│   ├── database.py              # SQLAlchemy engine + session
│   ├── dependencies.py          # get_db, get_current_user
│   │
│   ├── models/                  # SQLAlchemy ORM (map 9 bảng SQL)
│   │   ├── __init__.py          # Import tất cả models
│   │   ├── user.py
│   │   ├── song.py              # Song, Genre, Mood, SongMood
│   │   ├── interaction.py       # UserSongInteraction
│   │   ├── playlist.py          # Playlist, PlaylistSong
│   │   └── token.py             # ResetPasswordToken
│   │
│   ├── schemas/                 # Pydantic (request/response shapes)
│   │   ├── __init__.py
│   │   ├── auth.py              # LoginRequest, RegisterRequest, TokenResponse
│   │   ├── user.py              # UserResponse, UserUpdate
│   │   ├── song.py              # SongResponse, SongListResponse
│   │   ├── genre.py             # GenreResponse
│   │   ├── mood.py              # MoodResponse
│   │   ├── interaction.py       # PlayInteraction, RateInteraction
│   │   ├── playlist.py          # PlaylistCreate, PlaylistResponse
│   │   └── recommendation.py    # MoodRequest, RecommendationResponse
│   │
│   ├── routers/                 # API endpoints
│   │   ├── __init__.py
│   │   ├── auth.py              # /api/auth/*
│   │   ├── users.py             # /api/users/*
│   │   ├── songs.py             # /api/songs/*
│   │   ├── genres.py            # /api/genres/*
│   │   ├── moods.py             # /api/moods/*
│   │   ├── interactions.py      # /api/interactions/*
│   │   ├── playlists.py         # /api/playlists/*
│   │   ├── recommendations.py   # /api/recommendations/*
│   │   └── admin.py             # /api/admin/*
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   └── auth_service.py      # JWT + bcrypt
│   │
│   └── ai/                      # AI integration (placeholder)
│       ├── __init__.py
│       ├── mood_predictor.py    # Wrapper gọi module_1/predict.py
│       └── song_recommender.py  # Wrapper gọi module 2 LightFM
│
├── requirements.txt
├── .env
└── .env.example
