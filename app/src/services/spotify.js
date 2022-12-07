const CLIENT_ID = '5aef7021adaa4616a023abf0deaf6e9b'; // Your client id
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_API_KEY; // Your secret

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search?';

export const getSpotifyAuth = () => {
    return fetch(SPOTIFY_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    })
        .then(res => res.json())
}

export const getTracksFromSpotify = (query) => {
    return getSpotifyAuth()
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
                return result
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
