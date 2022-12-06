
from typing import List, Tuple
import pickle
from flair.models import TextClassifier
from flair.data import Sentence
from heapq import nsmallest
import pandas as pd

from app.RocketBE.Model.request_model import Song
from app.RocketBE.SongProcessor.processor import SongProcessor

class FlairSentimentAnalyzer(SongProcessor):

    def __init__(self) -> None:
        super().__init__()
        self.process_data()
        self.textClassifier = TextClassifier.load('en-sentiment')
        self.positive_df = None
        self.negative_df = None

    def process_input(self, user_mood) -> Tuple[List[Song], str]:
        # runs sentiment analysis on user input
        phraseSentiment = Sentence(user_mood)
        self.textClassifier.predict(phraseSentiment)
        mySentiment = phraseSentiment.labels[0]
        songScore = phraseSentiment.score
        print(mySentiment)

        ten_song_list = []

        # matches user input based on Positive or Negative sentiment to ten songs closest to its sentiment score
        if "POSITIVE" in str(mySentiment):
            # matching function
            closest_ten_pos = nsmallest(10, self.positive_df['score'], key=lambda x: abs(x - songScore))
            for value in closest_ten_pos:
                ten_song_list.append({
                    "artiste": str(self.positive_df.loc[self.positive_df['score'].eq(value), 'artiste'].iloc[0]).strip(),
                    "title": str(self.positive_df.loc[self.positive_df['score'].eq(value), 'title'].iloc[0]).strip().replace('\xa0', ' '),
                    "thumbnail": str(self.positive_df.loc[self.positive_df['score'].eq(value), 'thumbnail'].iloc[0]).strip(),
                })
            print(ten_song_list)
        elif "NEGATIVE" in str(mySentiment):
            # matching function
            closest_ten_neg = nsmallest(10, self.negative_df['score'], key=lambda x: abs(x - songScore))
            for value in closest_ten_neg:
                ten_song_list.append({
                    "artiste": str(self.negative_df.loc[self.negative_df['score'].eq(value), 'artiste'].iloc[0]).strip(),
                    "title": str(self.negative_df.loc[self.negative_df['score'].eq(value), 'title'].iloc[0]).strip().replace('\xa0', ' '),
                    "thumbnail": str(self.negative_df.loc[self.negative_df['score'].eq(value), 'thumbnail'].iloc[0]).strip(),
                })
              
            return ten_song_list, 'excited'     

    def process_data(self) -> None:
        pos_song_list = List[dict]
        neg_song_list = List[dict]
        with open('positive_songs.pkl', 'rb') as f:
            pos_song_list = pickle.load(f)
        self.positive_df = pd.DataFrame.from_records(pos_song_list)
        with open('negative_songs.pkl', 'rb') as f:
            neg_song_list = pickle.load(f)
        self.negative_df = pd.DataFrame.from_records(neg_song_list)
        print('Hooray!!!!! Data processed!')
        