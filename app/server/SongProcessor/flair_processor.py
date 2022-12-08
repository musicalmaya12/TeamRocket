
from typing import List, Tuple
import pickle
from flair.models import TextClassifier
from flair.data import Sentence
from heapq import nsmallest
from pathlib import Path
import pandas as pd
try:
    from app.server.Model.request_model import Song
    from app.server.SongProcessor.processor import SongProcessor
except:
    from server.Model.request_model import Song
    from server.SongProcessor.processor import SongProcessor

class FlairSentimentAnalyzer(SongProcessor):

    def __init__(self) -> None:
        super().__init__()
        self.textClassifier = TextClassifier.load('en-sentiment')
        self.positive_df = None
        self.negative_df = None
        self.process_data()


    # Gives user-inputted phrase a sentiment score and matches input to 10 songs with the most closest sentiment scores to it
    def process_input(self, user_mood) -> Tuple[List[Song], str]:
        # runs sentiment analysis on user input
        phraseSentiment = Sentence(user_mood)
        self.textClassifier.predict(phraseSentiment)
        mySentiment = phraseSentiment.labels[0]
        phraseScore = phraseSentiment.score
        print(mySentiment)

        ten_song_list = []
        mood = f'positive, {phraseScore}'
        # matches user input based on Positive or Negative sentiment to ten songs closest to its sentiment score
        if "POSITIVE" in str(mySentiment):
            closest_ten_pos = nsmallest(10, self.positive_df['score'], key=lambda x: abs(x - phraseScore))
            for value in closest_ten_pos:
                ten_song_list.append(Song(
                    artiste = FlairSentimentAnalyzer.get_song_field(self.positive_df, value,"artiste").strip(),
                    title = FlairSentimentAnalyzer.get_song_field(self.positive_df, value,'title').strip().replace('\xa0', ' '),
                    thumbnail = FlairSentimentAnalyzer.get_song_field(self.positive_df, value, 'thumbnail').strip(),
                ))
        elif "NEGATIVE" in str(mySentiment):
            mood = f'negative, {phraseScore}'
            closest_ten_neg = nsmallest(10, self.negative_df['score'], key=lambda x: abs(x - phraseScore))
            for value in closest_ten_neg:
                ten_song_list.append(Song(
                    artiste = FlairSentimentAnalyzer.get_song_field(self.negative_df, value,"artiste").strip(),
                    title = FlairSentimentAnalyzer.get_song_field(self.negative_df, value,'title').strip().replace('\xa0', ' '),
                    thumbnail = FlairSentimentAnalyzer.get_song_field(self.negative_df, value, 'thumbnail').strip(),
                ))
              
        return ten_song_list, mood     

    # Opens pickle files and converts to Pandas DataFrames for matching algorithm
    def process_data(self) -> None:
        pos_song_list = List[dict]
        neg_song_list = List[dict]

        with open(Path().resolve()/Path('server/SongProcessor/2000songs_negative_df.pkl'), 'rb') as f:
            neg_song_list = pickle.load(f)
        with open(Path().resolve()/Path('server/SongProcessor/2000songs_positive_df.pkl'), 'rb') as f:
            pos_song_list = pickle.load(f)

        self.positive_df = pd.DataFrame.from_records(pos_song_list)
        self.negative_df = pd.DataFrame.from_records(neg_song_list)
        print('Hooray!!!!! Data processed!')
    
    # Function to simplify Pandas DataFrame search functionality
    @classmethod
    def get_song_field(self, df: pd.DataFrame, score: float, col: str) -> str:
        return str(df.loc[df['score'].eq(score), col].iloc[0])
        
        