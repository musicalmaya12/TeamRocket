import { Buffer } from 'buffer';

const client_id = '5aef7021adaa4616a023abf0deaf6e9b'; // Your client id
const client_secret = 'e60371614a224640b59c0ac21bd5a616'; // Your secret

const SPOTIFY_URL = 'https://api.spotify.com/v1/search?';

var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

export const getSpotifyAuth = () => {
    let token = null;

    fetch(authOptions.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + client_id + '&client_secret=' + client_secret
    })
        .then(res => res.json())
        .then(
            (result) => {
                console.log("Get here")
                console.log(result);
                token = result.access_token
            },
            (error) => {
                console.log("Token error")
                console.log(error);
            }
        )

    // request.post(authOptions, function (error, response, body) {
    //     if (!error && response.statusCode === 200) {
    //         token = body.access_token;
    //     }
    // });

    return token;
}



export const getTracks = (query) => {
    fetch(authOptions.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + client_id + '&client_secret=' + client_secret
    })
        .then(res => res.json())
        .then(
            (result) => {
                console.log("Get here")
                console.log(result);
                const token = result.access_token

                return fetch(SPOTIFY_URL + new URLSearchParams({
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
