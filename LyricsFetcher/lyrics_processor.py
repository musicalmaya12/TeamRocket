import pickle
from typing import  List

song_list: List[dict]
with open('songs.pkl', 'rb') as f:
    song_list = pickle.load(f)

print(song_list)
