from typing import Union

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
try:
    from app.server.Model.request_model import MoodRequest, MoodRespond, StatRequest, StatResponse
    from app.server.SongProcessor.flair_processor import FlairSentimentAnalyzer
except:
    from server.Model.request_model import MoodRequest, MoodRespond, StatRequest, StatResponse
    from server.SongProcessor.flair_processor import FlairSentimentAnalyzer

app = FastAPI()

flair_processor = FlairSentimentAnalyzer()

stats = {
    "negative": StatResponse(),
    "positive": StatResponse() 
}

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def fetch():
    return {"Team Name": "Rocket"}


@app.get("/health")
def health():
    return {
        "Health": "excellent",
        "negative count": flair_processor.negative_df.shape[0],
        "positive count": flair_processor.positive_df.shape[0]
    }

@app.post("/get_mood_songs/")
async def get_mood_songs(request: MoodRequest):
    if request.phrase is None:
        print("Error: Phrase cannot be empty")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Phrase cannot be empty',
        )

    user_songs, sentiment =  flair_processor.process_input(request.phrase)
    return MoodRespond(
        sentiment=sentiment,
        playlist = user_songs
    )

@app.post("/set_stat/")
async def set_stat(request: StatRequest):
    if request.sentiment is None or  request.value is None:
        print("Error: Phrase cannot be empty")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Phrase cannot be empty',
        )

    if request.sentiment == "positive":
        if request.value == "tooPositive":
            stats["positive"].tooPositive +=1
        else:
            stats["positive"].tooNegative +=1
    else:
        if request.value == "tooPositive":
            stats["negative"].tooPositive +=1
        else:
            stats["negative"].tooNegative +=1

@app.get("/get_stat/")
async def get_stat():
    return stats
    
