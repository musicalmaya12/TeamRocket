import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getTracksFromSpotify } from "../services/spotify";

import "./playlist.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

export default function Playlist() {
  const { state } = useLocation();
  const playlistData = state.playlistData.playlist || [];
  const playlistMood = state.message || "";
  const [tracks, setTracks] = useState([]);

  const fetchPlaylistTracks = playlistData.map(async (songInfo) => {
    const result = await getTracksFromSpotify(songInfo.title);
    return result.tracks;
  });

  useEffect(() => {
    Promise.all(fetchPlaylistTracks)
      .then((results) => {
        setTracks(results);
      })

      .catch((error) => {
        console.log("Error: " + error);
      });
  }, []);
  console.log(tracks);

  const getUrls = (name) => {
    const trackInfo = tracks.filter((track) =>
      decodeURIComponent(track.href).includes(name.split(" ").join("+"))
    )[0];
    const songInfo =
      trackInfo &&
      (trackInfo.items.filter((item) => item.name === name)[0] ||
        trackInfo.items[0]);
    const spotifyUrl = songInfo && songInfo.external_urls.spotify;
    const previewUrl = songInfo && songInfo.preview_url;
    return { spotifyUrl, previewUrl };
  };

  return (
    <div className="playlist-container">
      <h1>{`${
        playlistMood[0].toUpperCase() + playlistMood.substring(1)
      } Playlist`}</h1>
      {playlistData.map((songInfo) => (
        <List className="playlist-item" key={songInfo.title}>
          <ListItem>
            <ListItemAvatar>
              <Avatar src={songInfo.thumbnail} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Tooltip title="Listen at Spotify" placement="right-start">
                  <a
                    className="song-title-link"
                    href={getUrls(songInfo.title).spotifyUrl}
                  >
                    {songInfo.title.split(" by")[0]}
                  </a>
                </Tooltip>
              }
              secondary={
                <Typography component="span" variant="body2" color="#D3D3D3">
                  {songInfo.artiste}
                </Typography>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      ))}
    </div>
  );
}
