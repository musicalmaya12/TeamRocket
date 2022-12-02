import pickle
from typing import  List
import tabulate


def get_data():
    song_list: List[dict]
    with open('LyricsFetcher/songs.pkl', 'rb') as f:
        song_list = pickle.load(f)
    return song_list

def print_dataset(dataset):
    header = dataset[0].keys()
    rows =  [x.values() for x in dataset][:10]
    print(tabulate.tabulate(rows, header))


dataset = get_data()
print(dataset[60])
#print_dataset(dataset)