import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getTracksFromSpotify } from '../services/spotify';

import "./playlist.css";

export default function Playlist() {
    const { state } = useLocation();
    const playlistData = state.playlist || [];

    playlistData.map((songInfo) => {
        getTracksFromSpotify(songInfo.title)
    })

    return (
        <div className="playlist-container">
            {playlistData.map((songInfo) => {
                return <div>{songInfo.title}</div>
            })}
        </div>
    );
}

