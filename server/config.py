import os
from datetime import timedelta

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://eddie:zeddie20062306@localhost:5432/neighborhood_watch'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
