const MOOD_URL = 'http://localhost:8000/get_mood_songs'

export const getMoodPlaylist = (query) => {
    const requestData = {
        phrase: query
    }

    return fetch(MOOD_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(res => res.json())
}