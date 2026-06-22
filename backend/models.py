from sqlalchemy import Column, Integer, String, Text
from database import Base


from sqlalchemy import Column, Integer, String, Float
from database import Base

class SentimentRecord(Base):
    __tablename__ = "sentiment_records"

    id = Column(Integer, primary_key=True, index=True)

    company = Column(String)
    industry = Column(String)

    news = Column(String)

    sentiment = Column(String)

    score = Column(Float)