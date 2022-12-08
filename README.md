# The Mood Playlist Generator

#### How to use the application:

Clone this repository to your local machine.

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
#### How the application is implemented:

## Generating sentiment scores for each song in our database and saving this information for the score matching algorithm

After our database of 2000 songs was saved locally in a pickle file, we turned the file into a Pandas DataFrame and processed the lyrics for each song using Flair (https://github.com/flairNLP/flair). We created a Text Classifier and ran the lyrics for each song through the predict() function to get its' sentiment ('POSITIVE' or 'NEGATIVE') and the corresponding sentiment score (0 - 1.0). We created two new DataFrames, 'positive_df' and 'negative_df', where we split up the 'POSITIVE' labeled songs vs. the 'NEGATIVE' labeled songs. These two DataFrames contain the columns 'artiste', 'title', 'thumbnail', 'score', and 'label'. Then, we turned these two DataFrames into two new pickle files, '2000songs_negative_df.pkl' and '2000songs_positive_df.pkl', and saved them into our SongProcessor folder under our main app folder.
