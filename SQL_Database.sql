-- ============================================================
--  Database: music_recommendation_system_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS music_recommendation_system_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE music_recommendation_system_db;

-- ============================================================
-- 1. Bảng User
-- ============================================================
CREATE TABLE User (
    user_id     VARCHAR(40)         NOT NULL COMMENT 'SHA-1 hash từ dataset gốc',
    name        VARCHAR(255)        NOT NULL DEFAULT '',
    birth_date  DATE                NULL,
    email       VARCHAR(255)        NULL UNIQUE,
    password    VARCHAR(255)        NULL,
    country     VARCHAR(100)        NULL,
    gender      ENUM('male','female','other') NULL,
    created_at  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_user PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 2. Bảng Genre
-- ============================================================
CREATE TABLE Genre (
    id      INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    name    VARCHAR(100)        NOT NULL UNIQUE,
    CONSTRAINT pk_genre PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 3. Bảng Mood
-- ============================================================
CREATE TABLE Mood (
    id      INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    name    VARCHAR(100)        NOT NULL UNIQUE,
    CONSTRAINT pk_mood PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 4. Bảng Song
-- ============================================================
CREATE TABLE Song (
    id                  INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    track_hash          VARCHAR(30)         NOT NULL UNIQUE COMMENT 'track_id gốc từ dataset',
    name                VARCHAR(512)        NOT NULL,
    author              VARCHAR(512)        NULL       COMMENT 'Nghệ sĩ / ban nhạc',
    audio_link          TEXT                NULL       COMMENT 'spotify_preview_url',
    spotify_id          VARCHAR(50)         NULL,
    duration            INT UNSIGNED        NULL       COMMENT 'Thời lượng tính bằng mili-giây',
    release_date        DATE                NULL       COMMENT 'Năm phát hành (lấy cột year)',
    tags                TEXT                NULL       COMMENT 'Nhãn genre/mood từ cột tags',
    genre_id            INT UNSIGNED        NULL,
    -- Chỉ số âm nhạc Spotify
    danceability        FLOAT               NULL,
    energy              FLOAT               NULL,
    song_key            TINYINT             NULL,
    loudness            FLOAT               NULL,
    mode                TINYINT             NULL       COMMENT '0=minor, 1=major',
    speechiness         FLOAT               NULL,
    acousticness        FLOAT               NULL,
    instrumentalness    FLOAT               NULL,
    liveness            FLOAT               NULL,
    valence             FLOAT               NULL,
    tempo               FLOAT               NULL,
    time_signature      TINYINT             NULL,
    created_at          DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_song PRIMARY KEY (id),
    CONSTRAINT fk_song_genre FOREIGN KEY (genre_id) REFERENCES Genre(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 5. Bảng SongMood
-- ============================================================
CREATE TABLE Song_Mood (
    song_id     INT UNSIGNED    NOT NULL,
    mood_id     INT UNSIGNED    NOT NULL,
    CONSTRAINT pk_song_mood PRIMARY KEY (song_id, mood_id),
    CONSTRAINT fk_sm_song FOREIGN KEY (song_id) REFERENCES Song(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_sm_mood FOREIGN KEY (mood_id) REFERENCES Mood(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 6. Bảng UserSongInteraction
-- ============================================================
CREATE TABLE User_Song_Interaction (
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    user_id         VARCHAR(40)         NOT NULL,
    song_id         INT UNSIGNED        NOT NULL,
    listen_count    INT UNSIGNED        NOT NULL DEFAULT 0  COMMENT 'Số lần phát (playcount)',
    rate            FLOAT               NULL               COMMENT 'Đánh giá 0–5',
    last_listen_at  DATETIME            NULL,
    listen_duration INT UNSIGNED        NULL               COMMENT 'Tổng thời gian nghe (giây)',
    CONSTRAINT pk_usi PRIMARY KEY (id),
    CONSTRAINT uq_usi_user_song UNIQUE (user_id, song_id),
    CONSTRAINT fk_usi_user FOREIGN KEY (user_id) REFERENCES User(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_usi_song FOREIGN KEY (song_id) REFERENCES Song(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 7. Bảng Playlist
-- ============================================================
CREATE TABLE Playlist (
    id          INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    user_id     VARCHAR(40)         NOT NULL,
    name        VARCHAR(255)        NOT NULL,
    is_public   TINYINT(1)          NOT NULL DEFAULT 0  COMMENT '1=công khai, 0=riêng tư',
    created_at  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_playlist PRIMARY KEY (id),
    CONSTRAINT fk_playlist_user FOREIGN KEY (user_id) REFERENCES User(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 8. Bảng PlaylistSong
-- ============================================================
CREATE TABLE Playlist_Song (
    playlist_id     INT UNSIGNED    NOT NULL,
    song_id         INT UNSIGNED    NOT NULL,
    order_index     INT UNSIGNED    NOT NULL DEFAULT 0,
    CONSTRAINT pk_playlist_song PRIMARY KEY (playlist_id, song_id),
    CONSTRAINT fk_ps_playlist FOREIGN KEY (playlist_id) REFERENCES Playlist(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_ps_song FOREIGN KEY (song_id) REFERENCES Song(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 9. Bảng ResetPasswordToken
-- ============================================================
CREATE TABLE Reset_Password_Token (
    id          INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    user_id     VARCHAR(40)         NOT NULL,
    token       VARCHAR(512)        NOT NULL,
    used_at     DATETIME            NULL,
    expired_at  DATETIME            NOT NULL,
    created_at  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_rpt PRIMARY KEY (id),
    CONSTRAINT fk_rpt_user FOREIGN KEY (user_id) REFERENCES User(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_user_country         ON User(country);
CREATE INDEX idx_user_gender          ON User(gender);
CREATE INDEX idx_song_author          ON Song(author(100));
CREATE INDEX idx_song_genre           ON Song(genre_id);
CREATE INDEX idx_song_danceability    ON Song(danceability);
CREATE INDEX idx_song_energy          ON Song(energy);
CREATE INDEX idx_song_valence         ON Song(valence);
CREATE INDEX idx_usi_user             ON User_Song_Interaction(user_id);
CREATE INDEX idx_usi_song             ON User_Song_Interaction(song_id);
CREATE INDEX idx_usi_listen_count     ON User_Song_Interaction(listen_count);
CREATE INDEX idx_playlist_user        ON Playlist(user_id);
CREATE INDEX idx_rpt_user             ON Reset_Password_Token(user_id);
CREATE INDEX idx_rpt_expired          ON Reset_Password_Token(expired_at);
