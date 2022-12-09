from typing import List
from pydantic import BaseModel

class Song(BaseModel):
    artiste: str
    title: str
    thumbnail: str
    
class StatValue(BaseModel):
     tooPositive: int
     tooNegative: int

class MoodRequest(BaseModel):
    phrase: str

class MoodRespond(BaseModel):
    sentiment: str
    playlist: List[Song]

class StatRequest(BaseModel):
    sentiment: str
    value: str

class StatResponse(BaseModel):
    positive: StatValue
    negative: StatValue