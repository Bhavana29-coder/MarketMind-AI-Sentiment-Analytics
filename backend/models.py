from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

class SentimentRecord(Base):

    __tablename__ = "sentiment_records"

    id = Column(Integer, primary_key=True, index=True)

    company = Column(String)

    industry = Column(String)

    news = Column(String)

    sentiment = Column(String)

    score = Column(Float)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )