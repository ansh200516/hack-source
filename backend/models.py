# backend/models.py

from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import declarative_base
from werkzeug.security import generate_password_hash, check_password_hash

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    role = Column(String(20), nullable=False, default='user')  # 'admin' or 'user'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Hackathon(Base):
    __tablename__ = 'hackathons'
    id = Column(Integer, primary_key=True)
    source = Column(String)
    title = Column(String)
    description = Column(Text, nullable=True)
    deadline = Column(String, nullable=True)
    prize = Column(String, nullable=True)
    location = Column(String, nullable=True)
    registration_link = Column(String, nullable=True)
    institution = Column(String, nullable=True)
    days_left = Column(String, nullable=True)
    mode = Column(String, nullable=True)
    start_date = Column(String, nullable=True)
    featured = Column(Integer, default=0)  # 0 for not featured, 1 for featured