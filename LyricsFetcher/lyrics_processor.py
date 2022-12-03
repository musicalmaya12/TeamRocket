import pickle
from typing import List
from flair.models import TextClassifier
from flair.data import Sentence
import pandas as pd


def get_data():
    song_list = List[dict]
    with open('songs.pkl', 'rb') as f:
        song_list = pickle.load(f)
    df = pd.DataFrame.from_records(song_list)
    process_data(df)
    return df

def process_data(df):
    scores = []
    labels = []
    textClassifier = TextClassifier.load('en-sentiment')
    for lyric in df['lyrics']:
        songLyrics = Sentence(lyric)
        textClassifier.predict(songLyrics)
        classified = songLyrics.labels[0]
        scores.append(songLyrics.score)
        if "POSITIVE" in str(classified):
            labels.append("pos")
        elif "NEGATIVE" in str(classified):
            labels.append("neg")
        else:
            labels.append("neu")
    final_df = pd.DataFrame({'score': scores, 'label': labels})
    final_df = pd.concat([df, final_df], axis=1)
    
    print(final_df)



dataset = get_data()