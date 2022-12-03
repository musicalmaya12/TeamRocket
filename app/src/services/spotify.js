const client_id = '5aef7021adaa4616a023abf0deaf6e9b'; // Your client id
const client_secret = 'e60371614a224640b59c0ac21bd5a616'; // Your secret

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search?';
const MOOD_URL = 'http://localhost:8000/get_mood_songs'

export const getSpotifyAuth = () => {
    return fetch(SPOTIFY_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + client_id + '&client_secret=' + client_secret
    })
        .then(res => res.json())
}

export const getMoodPlaylist = (query) => {
    const requestData = {
        phrase: query
    }

    fetch(MOOD_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(res => res.json())
        .then((result) => {
            console.log(result);
        }, 
        (error) => {
            console.log(error);
        })
}

export const getTracksFromSpotify = (query) => {
    getSpotifyAuth()
        .then((result) => {
            const token = result.access_token

            return fetch(SPOTIFY_SEARCH_URL + new URLSearchParams({
                q: query,
                type: 'track',
                limit: 5
            }), {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

        }
        )
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result);
            },
            (error) => {
                console.log(error);
            }
        )
        .catch(function (err) {
            // Log any errors
            console.log('something went wrong', err);
        });
}
