import base64
import json
import pickle
from typing import List
from flair.models import TextClassifier
from flair.data import Sentence
from heapq import nsmallest
import pandas as pd


def get_data():
    song_list = List[dict]
    with open('songs.pkl', 'rb') as f:
        song_list = pickle.load(f)
    df = pd.DataFrame.from_records(song_list)
    process_data(df)
    return df

def process_data(df):
    positive_artists = []
    negative_artists = []

    positive_titles = []
    negative_titles = []

    positive_thumbnails = []
    negative_thumbnails = []

    positive_scores = []
    negative_scores = []

    positive_labels = []
    negative_labels = []

    textClassifier = TextClassifier.load('en-sentiment')
    for idx, lyric in enumerate(df['lyrics']):
        songLyrics = Sentence(lyric)
        textClassifier.predict(songLyrics)
        classified = songLyrics.labels[0]
        if "POSITIVE" in str(classified):
            positive_artists.append(df.iloc[idx]['artiste'])
            positive_titles.append(df.iloc[idx]['title'])
            positive_thumbnails.append(df.iloc[idx]['thumbnail'])
            positive_scores.append(songLyrics.score)
            positive_labels.append("pos")
        elif "NEGATIVE" in str(classified):
            negative_artists.append(df.iloc[idx]['artiste'])
            negative_titles.append(df.iloc[idx]['title'])
            negative_thumbnails.append(df.iloc[idx]['thumbnail'])
            negative_scores.append(songLyrics.score)
            negative_labels.append("neg")

    positive_df = pd.DataFrame({'title': positive_titles, 'artiste': positive_artists, 'thumbnail': positive_thumbnails, 'score': positive_scores, 'label': positive_labels})
    negative_df = pd.DataFrame({'title': negative_titles, 'artiste': negative_artists, 'thumbnail': negative_thumbnails, 'score': negative_scores, 'label': negative_labels})

    phraseSentiment = Sentence('I hate life')
    textClassifier.predict(phraseSentiment)
    mySentiment = phraseSentiment.labels[0]
    songScore = phraseSentiment.score
    print(mySentiment)

    ten_song_list = []

    if "POSITIVE" in str(mySentiment):
        # matching function
        closest_ten_pos = nsmallest(10, positive_df['score'], key=lambda x: abs(x - songScore))
        for value in closest_ten_pos:
            ten_song_list.append({
                "artiste": str(positive_df.loc[positive_df['score'].eq(value), 'artiste'].iloc[0]).strip(),
                "title": str(positive_df.loc[positive_df['score'].eq(value), 'title'].iloc[0]).strip().replace('\xa0', ' '),
                "thumbnail": str(positive_df.loc[positive_df['score'].eq(value), 'thumbnail'].iloc[0]).strip(),
            })
        print(ten_song_list)
    elif "NEGATIVE" in str(mySentiment):
        # matching function
        closest_ten_neg = nsmallest(10, negative_df['score'], key=lambda x: abs(x - songScore))
        for value in closest_ten_neg:
            ten_song_list.append({
                "artiste": str(negative_df.loc[negative_df['score'].eq(value), 'artiste'].iloc[0]).strip(),
                "title": str(negative_df.loc[negative_df['score'].eq(value), 'title'].iloc[0]).strip().replace('\xa0', ' '),
                "thumbnail": str(negative_df.loc[negative_df['score'].eq(value), 'thumbnail'].iloc[0]).strip(),
            })
        print(ten_song_list)


dataset = get_data()