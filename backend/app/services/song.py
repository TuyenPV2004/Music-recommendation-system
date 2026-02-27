from sqlalchemy.orm import Session
from ..models import Song  # model ORM của bạn

class SongService:
    def __init__(self, db: Session):
        self.db = db

    def get_songs_by_ids(self, song_ids: list):
        songs = self.db.query(Song).filter(
            Song.track_hash.in_(song_ids)
        ).all()

        # Map theo track_hash
        song_map = {song.track_hash: song for song in songs}

        # Giữ thứ tự ranking
        ordered_songs = [song_map[sid] for sid in song_ids if sid in song_map]

        return ordered_songs
