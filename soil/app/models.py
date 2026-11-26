from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database import Base


class Reading(Base):
    __tablename__ = "readings"

    id = Column(Integer, primary_key=True, index=True)
    deviceId = Column(String, index=True)
    moisture = Column(Float)
    soilTemp = Column(Float, nullable=True)
    ambientTemp = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    createdAt = Column(DateTime, default=datetime.utcnow)

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    deviceId = Column(String)
    type = Column(String)
    message = Column(String)
    severity = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class KBItem(Base):
    __tablename__ = "kbitems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    body = Column(String)
    createdAt = Column(DateTime, default=datetime.utcnow)
