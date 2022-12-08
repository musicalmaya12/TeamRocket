import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTracksFromSpotify } from "../services/spotify";
import { generatePlaylist } from "../main/input/input";

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
import Feedback from "./feedback/feedback";
import { MORE_POSITIVE, MORE_NEGATIVE } from "../services/constants";
import { DataContext } from "..";

/*
Function to create user's mood playlist.
*/
export default function Playlist() {
  const { state } = useLocation();
  const playlistData = state.playlistData.playlist || [];
  const playlistMood = state.message || "";
  const playlistSentiment = state.playlistData.sentiment.toString().split(",").map(function (item) { return item.trim() }) || [];
  const [tracks, setTracks] = useState([]);
  const [regenerated, setRegenerated] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [statsData, setStatsData] = useContext(DataContext);
  
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
    // sets playlist name to avoid putting in feedback data in name
    setPlaylistName(playlistMood.toString()[0].toUpperCase() + playlistMood.toString().substring(1).toLowerCase())
  }, []);

  useEffect(() => {
    console.log("regenerated")
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

  }, [playlistData, regenerated]);


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

  const regeneratePlaylist = (feedback) => {
    if (feedback === MORE_POSITIVE) {
      setRegenerated(true);
      generatePlaylist(navigate, playlistMood + ' positive');
    } else if (feedback === MORE_NEGATIVE) {
      setRegenerated(true);
      generatePlaylist(navigate, playlistMood + ' negative');
    }
    else {
      setRegenerated(false);
    }
  }

  return (
    <div className={playlistSentiment[0] === 'positive' ?
      (parseFloat(playlistSentiment[1]) > 0.99 ?
        "playlist-container-1" :
        parseFloat(playlistSentiment[1]) > 0.97 && parseFloat(playlistSentiment[1]) < 0.99 ?
          "playlist-container-2" :
          parseFloat(playlistSentiment[1]) > 0.90 && parseFloat(playlistSentiment[1]) < 0.97 ?
            "playlist-container-3" :
            parseFloat(playlistSentiment[1]) > 0.80 && parseFloat(playlistSentiment[1]) < 0.90 ?
              "playlist-container-4" :
              parseFloat(playlistSentiment[1]) < 0.80 ?
                "playlist-container-5" : "playlist-container-1") :
      (parseFloat(playlistSentiment[1]) > 0.99 ?
        "negative-container-1" :
        parseFloat(playlistSentiment[1]) > 0.97 && parseFloat(playlistSentiment[1]) < 0.99 ?
          "negative-container-2" :
          parseFloat(playlistSentiment[1]) > 0.90 && parseFloat(playlistSentiment[1]) < 0.97 ?
            "negative-container-3" :
            parseFloat(playlistSentiment[1]) > 0.80 && parseFloat(playlistSentiment[1]) < 0.90 ?
              "negative-container-4" :
              parseFloat(playlistSentiment[1]) < 0.80 ?
                "negative-container-5" : "negative-container-1")}>

      <div className="nav">
        <Tooltip title="Change your Mood" placement="bottom">
          <Button
            variant="contained"
            size="small"
            id="back-button"
            sx={{ backgroundColor: "rgb(0 0 0 / 20%) !important", "&:hover": { backgroundColor: "rgb(0 0 0 / 50%) !important" } }}
            onClick={() => navigate("/")}
          >
            Back
          </Button>
        </Tooltip>
        <Tooltip title="Current Statistics" placement="bottom">
          <Button
            variant="contained"
            size="small"
            id="stats-button"
            sx={{ backgroundColor: "rgb(0 0 0 / 20%) !important", "&:hover": { backgroundColor: "rgb(0 0 0 / 50%) !important" } }}
            onClick={() => navigate("/stats")}
          >
            Stats
          </Button>
        </Tooltip>
      </div>
      <h1 className="playlist-title">
        <span>
          {`${playlistName.replace(/positive/g, '').replace(/negative/g, '') + ' Playlist'
            }`}
        </span>
        <Feedback playlistName={playlistName} regeneratePlaylist={regeneratePlaylist} statsData={statsData} setStatsData={setStatsData} />
      </h1>
      {playlistSentiment[0] === 'positive' ?
        (parseFloat(playlistSentiment[1]) > 0.99 ?
          <h2 className="playlist-title">{`Sounds like you're feeling amazing today!`}</h2> :
          parseFloat(playlistSentiment[1]) > 0.97 && parseFloat(playlistSentiment[1]) < 0.99 ?
            <h2 className="playlist-title">{`Sounds like you're feeling grand today!`}</h2> :
            parseFloat(playlistSentiment[1]) > 0.90 && parseFloat(playlistSentiment[1]) < 0.97 ?
              <h2 className="playlist-title">{`Sounds like you're feeling good today!`}</h2> :
              parseFloat(playlistSentiment[1]) > 0.80 && parseFloat(playlistSentiment[1]) < 0.90 ?
                <h2 className="playlist-title">{`Sounds like you're feeling fine today!`}</h2> :
                parseFloat(playlistSentiment[1]) < 0.80 ?
                  <h2 className="playlist-title">{`Sounds like you're feeling okay today!`}</h2> : null)
        : (parseFloat(playlistSentiment[1]) > 0.99 ?
          <h3 className="playlist-title">{`Sounds like you're not feeling amazing today. We hope you feel better soon!`}</h3> :
          parseFloat(playlistSentiment[1]) > 0.97 && parseFloat(playlistSentiment[1]) < 0.99 ?
            <h3 className="playlist-title">{`Sounds like you're not feeling grand today. We hope you feel better soon!`}</h3> :
            parseFloat(playlistSentiment[1]) > 0.90 && parseFloat(playlistSentiment[1]) < 0.97 ?
              <h3 className="playlist-title">{`Sounds like you're not feeling good today. We hope you feel better soon!`}</h3> :
              parseFloat(playlistSentiment[1]) > 0.80 && parseFloat(playlistSentiment[1]) < 0.90 ?
                <h3 className="playlist-title">{`Sounds like you're not feeling fine today. We hope you feel better soon!`}</h3> :
                parseFloat(playlistSentiment[1]) < 0.80 ?
                  <h3 className="playlist-title">{`Sounds like you're just okay today. We hope you feel better soon!`}</h3> : null)}
      <h3 className="playlist-title">Here is a playlist that matches your mood:</h3>
      {regenerated ? <h4 className="playlist-title">We hope this playlist suits your mood better!</h4> : null}

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
                    rel="noopener noreferrer"
                  >
                    {songInfo.title.split(" by")[0]}
                  </a>
                </Tooltip>
              }
              secondary={
                <Typography component="span" variant="body2" color="#ffffff">
                  {songInfo.artiste}
                </Typography>
              }
            />
            <Feedback />
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      ))}
    </div>
  );
}
