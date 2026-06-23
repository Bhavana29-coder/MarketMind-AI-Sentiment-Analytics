from fastapi.responses import FileResponse
import csv
from fastapi import FastAPI
from sentiment import analyze_sentiment

from database import engine, Base, SessionLocal
from models import SentimentRecord
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "MarketMind Backend Running"}


@app.post("/sentiment")
def sentiment(data: dict):

    text = data.get("text", "")
    company = data.get("company", "")
    industry = data.get("industry", "")

    result = analyze_sentiment(text)

    db = SessionLocal()

    record = SentimentRecord(
        company=company,
        industry=industry,
        news=text,
        sentiment=result["sentiment"],
        score=result["score"]
    )

    db.add(record)
    db.commit()
    db.close()

    return result

@app.get("/records")
def get_records():

    db = SessionLocal()

    records = db.query(SentimentRecord).all()

    result = []

    for record in records:
        result.append({
            "id": record.id,
            "company": record.company,
            "industry": record.industry,
            "sentiment": record.sentiment,
            "score": record.score
        })

    db.close()

    return result
@app.delete("/records/{record_id}")
def delete_record(record_id: int):

    db = SessionLocal()

    record = db.query(SentimentRecord).filter(
        SentimentRecord.id == record_id
    ).first()

    if record:
        db.delete(record)
        db.commit()

    db.close()

    return {"message": "Record deleted"};

@app.put("/records/{record_id}")
def update_record(record_id: int, data: dict):

    db = SessionLocal()

    record = db.query(SentimentRecord).filter(
        SentimentRecord.id == record_id
    ).first()

    if record:

        record.company = data.get(
            "company",
            record.company
        )

        record.industry = data.get(
            "industry",
            record.industry
        )

        db.commit()

    db.close()

    return {"message": "Record updated"}
@app.get("/export")
def export_csv():

    db = SessionLocal()

    records = db.query(SentimentRecord).all()

    with open("sentiment_records.csv", "w", newline="") as file:

        writer = csv.writer(file)

        writer.writerow([
            "Company",
            "Industry",
            "Sentiment",
            "Score"
        ])

        for record in records:

            writer.writerow([
                record.company,
                record.industry,
                record.sentiment,
                record.score
            ])

    db.close()

    return FileResponse(
        "sentiment_records.csv",
        media_type="text/csv",
        filename="sentiment_records.csv"
    )