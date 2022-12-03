from typing import Union

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from RocketBE.Model.request_model import MoodRequest, MoodRespond
from RocketBE.SongProcessor.flair_processor import FlairSentimentAnalyzer


app = FastAPI()

flair_processor = FlairSentimentAnalyzer()

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

    