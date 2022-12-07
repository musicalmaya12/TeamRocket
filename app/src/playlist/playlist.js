import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import Button from "@mui/material/Button";

export default function Playlist() {
  const { state } = useLocation();
  const playlistData = state.playlistData.playlist || [];
  const playlistMood = state.message || "";
  const playlistSentiment = state.playlistData.sentiment.toString().split(",").map(function (item) { return item.trim() }) || [];
  const [tracks, setTracks] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylistTracks = playlistData.map(async (songInfo) => {
      const result = await getTracksFromSpotify(songInfo.title);
      return result.tracks;
    });

    Promise.all(fetchPlaylistTracks)
      .then((results) => {
        setTracks(results);
      })

      .catch((error) => {
        console.log("Error: " + error);
      });
  }, []);

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
      <Tooltip title="Search Mood Again" placement="bottom">
        <Button
          variant="contained"
          size="small"
          id="back-button"
          onClick={() => navigate("/")}
        >
          Back
        </Button>
      </Tooltip>
      <h1 className="playlist-title">{`${playlistMood[0].toUpperCase() + playlistMood.substring(1).toLowerCase()
        } Playlist`}</h1>
      {playlistSentiment[0] === 'positive' ?
        (parseFloat(playlistSentiment[1]) > 0.99 ?
          <h3 className="playlist-title">{`Sounds like you're feeling amazing today!`}</h3> :
          parseFloat(playlistSentiment[1]) > 0.97 && parseFloat(playlistSentiment[1]) < 0.99 ?
            <h3 className="playlist-title">{`Sounds like you're feeling great today!`}</h3> :
            parseFloat(playlistSentiment[1]) > 0.90 && parseFloat(playlistSentiment[1]) < 0.97 ?
              <h3 className="playlist-title">{`Sounds like you're feeling good today!`}</h3> :
              parseFloat(playlistSentiment[1]) > 0.80 && parseFloat(playlistSentiment[1]) < 0.90 ?
                <h3 className="playlist-title">{`Sounds like you're feeling fine today!`}</h3> :
                parseFloat(playlistSentiment[1]) < 0.80 ?
                  <h3 className="playlist-title">{`Sounds like you're feeling okay today!`}</h3> : null)
        : (parseFloat(playlistSentiment[1]) > 0.99 ?
          <h3 className="playlist-title">{`Sounds like you're not feeling amazing today. We hope you feel better soon!`}</h3> :
          parseFloat(playlistSentiment[1]) > 0.97 && parseFloat(playlistSentiment[1]) < 0.99 ?
            <h3 className="playlist-title">{`Sounds like you're not feeling great today. We hope you feel better soon!`}</h3> :
            parseFloat(playlistSentiment[1]) > 0.90 && parseFloat(playlistSentiment[1]) < 0.97 ?
              <h3 className="playlist-title">{`Sounds like you're not feeling good today. We hope you feel better soon!`}</h3> :
              parseFloat(playlistSentiment[1]) > 0.80 && parseFloat(playlistSentiment[1]) < 0.90 ?
                <h3 className="playlist-title">{`Sounds like you're not feeling fine today. We hope you feel better soon!`}</h3> :
                parseFloat(playlistSentiment[1]) < 0.80 ?
                  <h3 className="playlist-title">{`Sounds like you're just okay today. We hope you feel better soon!`}</h3> : null)}
      <h3 className="playlist-title">Here is a playlist that matches your mood:</h3>
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
                    href={getUrls(songInfo.title.split(" by")[0]).spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
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
