const MOOD_URL = 'http://localhost:8000'

export const getMoodPlaylist = (query) => {
    const requestData = {
        phrase: query
    }

    return fetch(MOOD_URL + "/get_mood_songs", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(res => res.json())
}

export const getStats = () => {
    return fetch(MOOD_URL + "/get_stat", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
}

export const setStats = (sentiment, value) => {
    const requestData = {
        sentiment: sentiment,
        value: value
    }

    return fetch(MOOD_URL + "/set_stat", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(res => res.json())
} 