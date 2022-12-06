# The Mood Playlist Generator

To install:
1. `cd app`
2.  `pip install -r requirements.txt` 
3. `npm install`

To run the application:
1. `cd app`
2. `npm start`

#### Backend Initiatization
1. `cd app`
2. install stuff `pip install -r requirements.txt`
3. Run `uvicorn RocketBE.main:app --reload`
4. go to `http://127.0.0.1:8000/docs`

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
  "sentiment": "excited",
  "score": 0.99,
  "playlist": [
    {
      "artiste": " One Direction ",
      "title": "If I Could Fly by One Direction",
      "thumbnail": "https://images.genius.com/d1815a034dd35663795e483d8a62ea5f.1000x1000x1.jpg",
      "link": "https://twitter.com/elon"
    },
    {
      "artiste": " Draaco Aventura ",
      "title": "Insaciable by Draaco Aventura",
      "thumbnail": "https://images.genius.com/0bfc284e0c63e81511b883bfa4ab2c9b.1000x1000x1.jpg",
      "link": "https://twitter.com/elon"
    },
    {
      "artiste": " One Direction ",
      "title": "Night Changes by One Direction",
      "thumbnail": "https://images.rapgenius.com/a8c066965cd804df56261afe172cce2b.1000x1000x1.jpg",
      "link": "https://twitter.com/elon"
    },
    {
      "artiste": " Drake ",
      "title": "Hold On, We're Going Home by Drake (Ft. Majid Jordan)",
      "thumbnail": "https://images.rapgenius.com/f545371242592e32983526102bd7b01d.600x600x1.jpg",
      "link": "https://twitter.com/elon"
    },
    {
      "artiste": " Carrie Underwood ",
      "title": "Jesus, Take the Wheel by Carrie Underwood",
      "thumbnail": "https://images.genius.com/6da12b47f7f56625a73187f3ab93d562.1000x1000x1.jpg",
      "link": "https://twitter.com/elon"
    },
    {
      "artiste": " Drake ",
      "title": "From Time by Drake (Ft. Jhené Aiko)",
      "thumbnail": "https://images.genius.com/6d70f1e6d38e9af4ddb7b3582a40dab8.1000x1000x1.jpg",
      "link": "https://twitter.com/elon"
    },
    {
      "artiste": " One Direction ",
      "title": "Story of My Life by One Direction",
      "thumbnail": "https://images.rapgenius.com/87839ab693a21fe86fbb9d2812748705.960x960x1.png",
      "link": "https://twitter.com/elon"
    },
    {
      "artiste": " Drake ",
      "title": "Hotline Bling by Drake",
      "thumbnail": "https://images.genius.com/f3be0158d3a067a81b075686a3a2e63d.1000x1000x1.png",
      "link": "https://twitter.com/elon"
    },
    {
      "artiste": " Joey + Rory ",
      "title": "I Need Thee Every Hour by Joey + Rory",
      "thumbnail": "https://images.genius.com/696da21338fdf225eb42457082f4760a.1000x1000x1.jpg",
      "link": "https://twitter.com/elon"
    },
    {
      "artiste": " One Direction ",
      "title": "Drag Me Down by One Direction",
      "thumbnail": "https://images.rapgenius.com/81f934585e8735158bab36d3cf5d9520.1000x1000x1.jpg",
      "link": "https://twitter.com/elon"
    }
  ]
}
```
