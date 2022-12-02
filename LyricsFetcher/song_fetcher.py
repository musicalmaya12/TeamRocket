from lyricsgenius.artist import Artist
from requests.exceptions import HTTPError, Timeout
from lyricsgenius import Genius
import pickle
import csv

TOKEN = "<TOKEN>"
TOTAL_ARTISTES = 10 # must be less than 3k

def process_lyrics(lyrics):
    lyrics_stored = lyrics.split("\n")
    lyrics = ""
    for line in lyrics_stored:
        if "[" in line and "]" in line:
            continue
        else:
            lyrics+= (line.lower()+". ")
    return lyrics


def get_music_by_artiste(artiste, song_count = 10):
    song_list = []
    try:
        genius = Genius(TOKEN, retries=3)
        songs = genius.search_artist(artiste, sort="popularity", max_songs=song_count)
        if songs is None:
            return []

        for song in songs.songs:
            song_list.append({
                "artiste": artiste,
                "title": song.full_title,
                "thumbnail": song.song_art_image_url,
                "lyrics": process_lyrics(song.lyrics)
            })
    except HTTPError as e:
        print(e.errno)  # status code
        print(e.args[0])  # status code
        print(e.args[1])  # error message
    except Timeout:
        pass
    finally:
        return song_list

def main():
    all_songs = []
    with open('10000-MTV-Music-Artists-page-1.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            if line_count == TOTAL_ARTISTES:
                break
            if line_count != 0:
                print("Getting ", row[0])
                songs_from_artiste = get_music_by_artiste(row[0])
                all_songs = all_songs + songs_from_artiste
            line_count += 1
        print(f'Processed {line_count} lines.')

    with open('songs.pkl', 'wb') as f:
        pickle.dump(all_songs, f)

if __name__ == '__main__':
    main()
