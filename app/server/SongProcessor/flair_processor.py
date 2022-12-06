
from typing import List, Tuple
import pickle
from flair.models import TextClassifier
from flair.data import Sentence
from heapq import nsmallest
import pandas as pd

from app.server.Model.request_model import Song
from app.server.SongProcessor.processor import SongProcessor

class FlairSentimentAnalyzer(SongProcessor):

    def __init__(self) -> None:
        super().__init__()
        self.textClassifier = TextClassifier.load('en-sentiment')
        self.positive_df = None
        self.negative_df = None
        self.process_data()


    def process_input(self, user_mood) -> Tuple[List[Song], str]:
        # runs sentiment analysis on user input
        phraseSentiment = Sentence(user_mood)
        self.textClassifier.predict(phraseSentiment)
        mySentiment = phraseSentiment.labels[0]
        phraseScore = phraseSentiment.score
        print(phraseSentiment)
        print(mySentiment)

        ten_song_list = []
        mood = "positive"
        # matches user input based on Positive or Negative sentiment to ten songs closest to its sentiment score
        if "POSITIVE" in str(mySentiment):
            # matching function
            closest_ten_pos = nsmallest(10, self.positive_df['score'], key=lambda x: abs(x - phraseScore))
            '''
            {
                    "artiste": str(self.positive_df.loc[self.positive_df['score'].eq(value), 'artiste'].iloc[0]).strip(),
                    "title": str(self.positive_df.loc[self.positive_df['score'].eq(value), 'title'].iloc[0]).strip().replace('\xa0', ' '),
                    "thumbnail": str(self.positive_df.loc[self.positive_df['score'].eq(value), 'thumbnail'].iloc[0]).strip(),
                }
            '''
            for value in closest_ten_pos:
                ten_song_list.append(Song(
                    artiste=FlairSentimentAnalyzer.get_song_field(self.positive_df, value,"artiste").strip(),
                    title =  FlairSentimentAnalyzer.get_song_field(self.positive_df, value,'title').strip().replace('\xa0', ' '),
                    thumbnail = FlairSentimentAnalyzer.get_song_field(self.positive_df, value, 'thumbnail').strip(),
                ))
            print(ten_song_list)
        elif "NEGATIVE" in str(mySentiment):
            mood = "negative"
            # matching function
            closest_ten_neg = nsmallest(10, self.negative_df['score'], key=lambda x: abs(x - phraseScore))
            for value in closest_ten_neg:
                ten_song_list.append(Song(
                    artiste=FlairSentimentAnalyzer.get_song_field(self.negative_df, value,"artiste").strip(),
                    title =  FlairSentimentAnalyzer.get_song_field(self.negative_df, value,'title').strip().replace('\xa0', ' '),
                    thumbnail = FlairSentimentAnalyzer.get_song_field(self.negative_df, value, 'thumbnail').strip(),
                ))
              
        return ten_song_list, mood     

    def process_data(self) -> None:
        pos_song_list = List[dict]
        neg_song_list = List[dict]
        with open('app\server\SongProcessor\\2000songs_positive_df.pkl', 'rb') as f:
            pos_song_list = pickle.load(f)
        self.positive_df = pd.DataFrame.from_records(pos_song_list)

        print("positive shape", self.positive_df.shape)

        with open('app\server\SongProcessor\\2000songs_negative_df.pkl', 'rb') as f:
            neg_song_list = pickle.load(f)
        self.negative_df = pd.DataFrame.from_records(neg_song_list)
        print("negative shape", self.negative_df.shape)
        print('Hooray!!!!! Data processed!')
    @classmethod
    def get_song_field(self, df: pd.DataFrame, score: float, col: str) -> str:
        return str(df.loc[df['score'].eq(score), col].iloc[0])
        
        