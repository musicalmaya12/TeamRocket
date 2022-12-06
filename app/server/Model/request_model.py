from typing import List
from pydantic import BaseModel

class Song(BaseModel):
    artiste: str
    title: str
    thumbnail: str
    

class MoodRequest(BaseModel):
    phrase: str

class MoodRespond(BaseModel):
    sentiment: str
    playlist: List[Song]
