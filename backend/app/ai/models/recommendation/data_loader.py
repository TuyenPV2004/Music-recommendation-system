import pandas as pd
from sqlalchemy import create_engine
import os

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

def load_data():
    users = pd.read_sql("SELECT * FROM users", engine)
    interactions = pd.read_sql("SELECT * FROM user_interactions", engine)
    tracks = pd.read_sql("SELECT * FROM tracks", engine)

    return users, interactions, tracks