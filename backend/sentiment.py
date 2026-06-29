import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

# Download VADER once
nltk.download('vader_lexicon')

sia = SentimentIntensityAnalyzer()

def analyze_sentiment(text):

    score = sia.polarity_scores(text)

    compound = score["compound"]

    if compound >= 0.05:
        sentiment = "Positive"
    elif compound <= -0.05:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    return {
        "sentiment": sentiment,
        "score": round(compound, 2)
    }