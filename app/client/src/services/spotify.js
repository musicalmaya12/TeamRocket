import { Buffer } from 'buffer';

const client_id = '5aef7021adaa4616a023abf0deaf6e9b'; // Your client id
const client_secret = ''; // Your secret

const SPOTIFY_URL = 'https://api.spotify.com/v1/search?';

export const getTracks = (query) => {
    fetch(SPOTIFY_URL + new URLSearchParams({
        q: query,
        type: 'track',
        limit: 5
    }), {
        headers: {
            'Authorization': 'Bearer ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
        }
    })
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result);
            },
            (error) => {
                console.log(error);
            }
        )
}
