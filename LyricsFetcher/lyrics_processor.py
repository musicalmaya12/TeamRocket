import pickle
from typing import  List
import tabulate
import pandas as pd


def get_data()-> pd.DataFrame:
    song_list: List[dict]
    with open('LyricsFetcher/songs.pkl', 'rb') as f:
        song_list = pickle.load(f)
    df = pd.DataFrame.from_records(song_list)
    return df



dataset = get_data()
print(dataset.head())
#print_dataset(dataset)