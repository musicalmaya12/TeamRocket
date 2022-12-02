from abc import ABC, abstractmethod
from typing import List, Tuple
import pickle
from typing import  List


from RocketBE.Model.request_model import Song

SONGFILE = "LyricsFetcher/songs.pkl"
class SongProcessor(ABC):

    @abstractmethod
    def process_input(self, user_mood) ->  Tuple[List[Song], str]:
        pass

    @abstractmethod
    def process_data(self) -> None:
        pass

    '''
    Returns a list of songs of the format:
    {
        "artiste": "Beyonce",
        "title": "Pretty Hurt",
        "thumbnail": "https://some_url.com/jfhdsjlkh",
        "lyrics": "Hu Oh Oh"
    }
    '''
    def get_data(self) ->  List[dict]:
        song_list: List[dict]
        with open(SONGFILE, 'rb') as f:
            song_list = pickle.load(f)
        return song_list
