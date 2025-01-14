# The Mood Playlist Generator

### Overview
The Mood Playlist Generator is an application that uses sentiment analysis to generate "smart" playlists depending on a user's mood. We retrieve song information from the Spotify API and lyrics from the Genius API and store this data in a local datastore. We process this data using Flair, a natural language processing library, for sentiment analysis on the song information and user-inputted phrase. We use a matching algorithm between the phrase and songs to output a playlist with ten songs that can be listened to on Spotify.

### Video demo (please download the video for full high-quality resolution)
https://drive.google.com/file/d/146cqUF1BjlVZfNuvATw1R7auFf1vTnFb/view?usp=sharing

### How to use the application

Clone this repository to your local machine.
If you do not have Python 3.6, install that first.

If you're facing issues with setup in your local machine, please run the app in your favorite virtual environment.

To run the app, follow these steps (one time installation):
1. `cd app`
2.  `pip install -r requirements.txt` 
3. `npm install`

Next, run the application:
1. `cd app`
2. `npm start`

#### Backend Initialization - to use the API (on FastAPI)
1. `cd app`
2. Install stuff: `pip install -r requirements.txt`
3. Run `uvicorn app.server.main:app --reload`
4. Go to `http://127.0.0.1:8000/docs`

`POST: URL http://127.0.0.1:8000/get_mood_songs`

Sample Request/Body
```
{
  "phrase": "string"
}
```

Sample Response
```
{
  "sentiment": "positive, 0.99",
  "playlist": [
    {
      "artiste": " One Direction ",
      "title": "If I Could Fly by One Direction",
      "thumbnail": "https://images.genius.com/d1815a034dd35663795e483d8a62ea5f.1000x1000x1.jpg",
    },
    {
      "artiste": " Draaco Aventura ",
      "title": "Insaciable by Draaco Aventura",
      "thumbnail": "https://images.genius.com/0bfc284e0c63e81511b883bfa4ab2c9b.1000x1000x1.jpg",
    },
    {
      "artiste": " One Direction ",
      "title": "Night Changes by One Direction",
      "thumbnail": "https://images.rapgenius.com/a8c066965cd804df56261afe172cce2b.1000x1000x1.jpg",
    },
    {
      "artiste": " Drake ",
      "title": "Hold On, We're Going Home by Drake (Ft. Majid Jordan)",
      "thumbnail": "https://images.rapgenius.com/f545371242592e32983526102bd7b01d.600x600x1.jpg",
    },
    {
      "artiste": " Carrie Underwood ",
      "title": "Jesus, Take the Wheel by Carrie Underwood",
      "thumbnail": "https://images.genius.com/6da12b47f7f56625a73187f3ab93d562.1000x1000x1.jpg",
    },
    {
      "artiste": " Drake ",
      "title": "From Time by Drake (Ft. Jhené Aiko)",
      "thumbnail": "https://images.genius.com/6d70f1e6d38e9af4ddb7b3582a40dab8.1000x1000x1.jpg",
    },
    {
      "artiste": " One Direction ",
      "title": "Story of My Life by One Direction",
      "thumbnail": "https://images.rapgenius.com/87839ab693a21fe86fbb9d2812748705.960x960x1.png",
    },
    {
      "artiste": " Drake ",
      "title": "Hotline Bling by Drake",
      "thumbnail": "https://images.genius.com/f3be0158d3a067a81b075686a3a2e63d.1000x1000x1.png",
    },
    {
      "artiste": " Joey + Rory ",
      "title": "I Need Thee Every Hour by Joey + Rory",
      "thumbnail": "https://images.genius.com/696da21338fdf225eb42457082f4760a.1000x1000x1.jpg",
    },
    {
      "artiste": " One Direction ",
      "title": "Drag Me Down by One Direction",
      "thumbnail": "https://images.rapgenius.com/81f934585e8735158bab36d3cf5d9520.1000x1000x1.jpg",
    }
  ]
}
```
### How the application is implemented

#### Creating our database of songs
The song data was obtained from the GeniusAPI. To use this API we needed to pass in the name of the artiste to find their associated top songs. We used MTVBase top artistes we found on GitHub. We passed this into the GeniusAPI object in this format
```
genius = Genius(TOKEN, retries=3)
songs = genius.search_artist(artiste, sort="popularity", max_songs=SONG_COUNT)
```

This data was not labelled and postprocessing steps had to be done in the processing stage. The API was slow and took a large amount of time to fully get all the songs. An alternative to this approach would have been to use the million songs dataset `http://millionsongdataset.com` which has labelled data in a bag of words format. The draw back to using it is that we lose the word ordering and the sentence-piece module in Flair would not understand word ordering.


#### Creating our API using FastAPI
To quickly set up the backend, we used FastAPI `https://fastapi.tiangolo.com`. We exposed two endpoints 
1. `/get_mood` to accept post requests from the client. This endpoint returns the sentiment and the list of songs curated for that sentiment and takes in the phrase. It returns 400 response code for bad request.
2. `health` to return the health of the app. 

![image](https://user-images.githubusercontent.com/109922285/206603286-6990eecb-99d7-4f07-b93e-c4bef79e6828.png)
FastAPI

#### Usage of Flair for sentiment scores
Flair is the NLP library we chose to use to process the songs in our database and our user-inputted phrase to generate a sentiment score. Flair is built on top of PyTorch and its' pre-trained sentiment analysis model is trained on the IMDB dataset. This pre-trained model allows us to perform sentiment analysis without having to train our own model. We use Flair's Sentence object to tokenize the songs' lyrics and the user-inputted phrase and then run the predict function on the tokenized Sentence to get the outputted sentiment score (in the range 0.0-1.0) and sentiment ("POSITIVE" or "NEGATIVE"). The sentiment analysis functionality is built on top of BERT (Bidirectional Representation for Transformers).

#### Generating sentiment scores for each song in our database and saving this information for the score matching algorithm

After our database of 2000 songs was saved locally in a pickle file, we turned the file into a Pandas DataFrame and processed the lyrics for each song using Flair (https://github.com/flairNLP/flair) - described above. We created two new DataFrames, 'positive_df' and 'negative_df', where we split up the 'POSITIVE' labeled songs vs. the 'NEGATIVE' labeled songs. These two DataFrames contain the columns 'artiste', 'title', 'thumbnail', 'score', and 'label'. Then, we turned these two DataFrames into two new pickle files, '2000songs_negative_df.pkl' and '2000songs_positive_df.pkl', and saved them into our SongProcessor folder under our main app folder.

#### The sentiment score matching algorithm

We used the Flair sentiment analysis functionality to get the sentiment score for our user-inputted phrase, as well. This allows the scores for the user-inputted phrase and the song library to be on the same scale. After getting the sentiment score of the user's phrase, we check if the sentiment is positive or negative. If positive, we compare the user's numerical sentiment score to the song's numerical sentence scores in 2000songs_positive_df and return back the 10 songs with the closest sentiment scores. To calculate this, we use nsmallest from heapq and get the 10 scores with the smallest difference from the user-inputted phrase (hence, the closest scores). We do the same thing with negative songs but use 2000songs_negative_df instead. We then gather all the information for the 10 closest songs and return them in an array along with the sentiment label and score. The data returned is fetched from the API when the user enters a phrase and clicks Submit in the application.

#### Usage of the Spotify API to link our playlist to Spotify

We used the Spotify API to fetch the information of the songs. First, we generated a token from Spotify using https://accounts.spotify.com/api/token. Then with the token, we proceeded to obtain details of the songs using "Search for Item" API (https://api.spotify.com/v1/search). To use the Spotify "Search for Item" API (read more: https://developer.spotify.com/documentation/web-api/reference/#/operations/search), we passed 3 parameters to it, **q**, **type** and **limit**. 
  - **q** (required): it allows filters including *album, artist, track, year, upc, tag:hipster, tag:new, isrc*, and *genre* to filter out irrelevant matches. We used *track* and *artist* to refine the matches.
  - **type** (required): we used *type: 'track'* to get information about the track.
  - **limit** (optional): we set *limit: 5* to get the top 5 matches.

The response JSON from Spotify looks like the sample response below. Among the top 5 matches we recieved from Spotify, we further refined these 5 matches by finding the exact song title and artist match. Finally, the link to listen at Spotify was obtained via ```<the_best_match>.external_urls.spotify```. We wrapped the title of the song with the link so users can listen to it at Spotify via clicking the title.

Sample Response: 
```
{
    "tracks": {
        "href": "https://api.spotify.com/v1/search?query=track%3ACollide+artist%3ARachel+Platten&type=track&locale=en-US%2Cen%3Bq%3D0.9%2Cla%3Bq%3D0.8&offset=0&limit=5",
        "items": [
            {
                "album": {
                    "album_type": "album",
                    "artists": [
                        {
                            "external_urls": {
                                "spotify": "https://open.spotify.com/artist/3QLIkT4rD2FMusaqmkepbq"
                            },
                            "href": "https://api.spotify.com/v1/artists/3QLIkT4rD2FMusaqmkepbq",
                            "id": "3QLIkT4rD2FMusaqmkepbq",
                            "name": "Rachel Platten",
                            "type": "artist",
                            "uri": "spotify:artist:3QLIkT4rD2FMusaqmkepbq"
                        }
                    ],
                    "available_markets": ["AD", "AE"],
                    "external_urls": {
                        "spotify": "https://open.spotify.com/album/1mH4ntQRUk1akxx6WNST8q"
                    },
                    "href": "https://api.spotify.com/v1/albums/1mH4ntQRUk1akxx6WNST8q",
                    "id": "1mH4ntQRUk1akxx6WNST8q",
                    "images": [
                        {
                            "height": 640,
                            "url": "https://i.scdn.co/image/ab67616d0000b27379a74bed80ea8e2ac850af1f",
                            "width": 640
                        }
                    ],
                    "name": "Waves",
                    "release_date": "2017-10-27",
                    "release_date_precision": "day",
                    "total_tracks": 13,
                    "type": "album",
                    "uri": "spotify:album:1mH4ntQRUk1akxx6WNST8q"
                },
                "artists": [
                    {
                        "external_urls": {
                            "spotify": "https://open.spotify.com/artist/3QLIkT4rD2FMusaqmkepbq"
                        },
                        "href": "https://api.spotify.com/v1/artists/3QLIkT4rD2FMusaqmkepbq",
                        "id": "3QLIkT4rD2FMusaqmkepbq",
                        "name": "Rachel Platten",
                        "type": "artist",
                        "uri": "spotify:artist:3QLIkT4rD2FMusaqmkepbq"
                    }
                ],
                "available_markets": ["AD","AE"],
                "disc_number": 1,
                "duration_ms": 205786,
                "explicit": false,
                "external_ids": {
                    "isrc": "USSM11708394"
                },
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/2RZvxgQsFR1mUcwFZpsav9"
                },
                "href": "https://api.spotify.com/v1/tracks/2RZvxgQsFR1mUcwFZpsav9",
                "id": "2RZvxgQsFR1mUcwFZpsav9",
                "is_local": false,
                "name": "Collide",
                "popularity": 54,
                "preview_url": "https://p.scdn.co/mp3-preview/7bcbcad7258906323dd47da2c197616b8863211c?cid=5aef7021adaa4616a023abf0deaf6e9b",
                "track_number": 3,
                "type": "track",
                "uri": "spotify:track:2RZvxgQsFR1mUcwFZpsav9"
            }
        ],
        "limit": 5,
        "next": null,
        "offset": 0,
        "previous": null,
        "total": 1
    }
}
```

#### The UI
The user interface is implemented using ReactJS. The user inputs a phrase and clicks Submit, which takes them to their personalized mood playlist. The background of their playlist page is customized based on the range of their positive or negative sentiment score. The highest range is > 0.99 (both highly positive or highly negative), which results in the lightest background for the positive range and darkest background for the negative range (both ranges: > 0.99, > 0.97 & < 0.99, > 0.90 & < 0.97, > 0.80 & < 0.90, < 0.80). The background color gradients proceedingly get darker the less positive the playlist becomes, and lighter the less negative it becomes. We also give users a little message at the top above the playlist tailored to their mood. To listen to the songs, users can click on the title of the song and it will take them to spotify in a seperate tab. Users can also regenerate their mood list by hitting the back button.

![image](https://user-images.githubusercontent.com/109922285/206602546-8cbb67a7-3a1d-4c92-a148-ed874e0a31a9.png)
Home page

![image](https://user-images.githubusercontent.com/109922285/206602740-00d71069-eafd-46b6-a105-7fc4b8c3169f.png)
Playlist in the Positive range > 0.99

![image](https://user-images.githubusercontent.com/109922285/206602828-71f9c5c6-40d7-416c-815b-d3ab3e9263cd.png)
Playlist in the Negative range > 0.99





#### Gathering user feedback

The user is able to provide feedback for both the playlist results and for each song in the playlist result. There are three icons for feedback: "thumbs up", "happy face", and "sad face". Clicking the "thumbs up" indicates that the playlist or song matches the sentiment of the requested mood. Clicking the "happy face" indicates that the playlist or song needs to be more positive to match the mood. Clicking the "sad face" indicates that the playlist or song needs to be more negative to match the mood. If the user clicks the "happy face" or "sad face" icon for a playlist, the playlist re-generates in an attempt to output a playlist that better matches the sentiment. This is done by re-sending the user-inputted phrase to the API with an appended string that says "positive" if the user asks for a more positive playlist, or "negative" if they want a more negative playlist. We found this method to be quite successful with slowly increasing a positivity or negativity score based on what the user desires. The metrics for each playlist and song are stored and displayed in a separate 'Statistics' page.

Currently, the Statistics page displays a chart which compares the metrics between positive and negative playlists, as determined by the sentiment analysis algorithm. The chart shows how many times a user chose "too negative" (sad face) or "too positive" (happy face) for each playlist sentiment. This gives further detail about what sentiment the algorithm tends to skew toward.

![image](https://user-images.githubusercontent.com/109922285/206627127-8645440b-b97b-4583-95c0-0061b736ab4a.png)
Stats page

![image](https://user-images.githubusercontent.com/109922285/206603063-0d0af9cb-b366-4d06-ba26-775b007287b9.png)
Playlist with user feedback to make it more positive

![image](https://user-images.githubusercontent.com/109922285/206603148-b29df2c2-9502-4116-b0c8-a43d3e442615.png)
Playlist with user feedback to make it more negative

### Team contributions

Maya Subramanian: Processed the song data using Flair, created the sentiment score matching algorithm, customized the UI backgrounds and phrases returned based on sentiment score ranges.

Tayo Amuneke: Created the FastAPI endpoint, set up the Lyrics fetcher for songs from the Genius API, and challenges documentation for data extraction

Jessica Nwaogbe: Created the input page and statistics page for the UI, added the functionality for re-generating the playlists and recording the user feedback. 

Meng Mu: Worked on the UI playlist view, made rest api call to Spotify API to fetch song links and attached them to each song to allow users to listen to it.

### Challenges
* The sentence boundaries for lyrics posed a problem during processing. Lyrics sometimes continue on new line and are sometimes bounded by only commas. We used new line boundary to store them, we are aware that a sentence boundary algorithm may provide a better performance
* Flair uses 512 token length per block, as it uses BERT internally. We ignored lyrics with words over 512. A different token formatting or chorus inclusion may be good for future work.
* Getting the lyrics data files posed a challenge as stated in the progress report. A dataset in a desired format may be a great task.
* We explored other techniques like topic modelling using TopicBERT and Sentence Similarity with Query Expansion. They proved to not really give good results because of the above two reasons. A further study on this may provide interesting results.


### References and Libraries
Spotify API: https://api.spotify.com/

Genius API: https://docs.genius.com/

Flair: https://github.com/flairNLP/flair

FastAPI: https://fastapi.tiangolo.com/
