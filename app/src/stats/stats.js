import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import './stats.css';
import { getStats } from "../services/generator";

export default function Stats() {
  const [data, setData] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {

    getStats()
      .then((results) => {
        setData(results);
      })

  }, []);

  const mockData = [
    {
      name: 'Happy',
      sentiment: 'positive',
      good: true,
      retries: 0,
      tooNegative: 0,
      tooPositive: 0
    },
    {
      name: 'Sad',
      sentiment: 'negative',
      good: false,
      retries: 0,
      tooNegative: 0,
      tooPositive: 2,
    },
    {
      name: 'Bored',
      sentiment: 'negative',
      good: false,
      retries: 1,
      tooNegative: 1,
      tooPositive: 2
    },
    {
      name: 'Bored',
      sentiment: 'negative',
      good: false,
      retries: 0,
      tooNegative: 0,
      tooPositive: 0
    },
    {
      name: 'Bored',
      sentiment: 'positive',
      good: false,
      retries: 0,
      tooNegative: 1,
      tooPositive: 2
    }
  ];

  return (
    <div className="stats-container">
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
        {/* <Tooltip title="Back to Playlist" placement="bottom">
          <Button
            variant="contained"
            size="small"
            id="playlist-button"
            sx={{ backgroundColor: "rgb(0 0 0 / 20%) !important", "&:hover": { backgroundColor: "rgb(0 0 0 / 50%) !important" } }}
            onClick={() => navigate("/playlist")}
          >
            Playlist
          </Button>
        </Tooltip> */}
      </div>
      <h1>Statistics</h1>
      <h2>User Feedback on Positive vs. Negative Playlists</h2>
      <LikeDislikeChart data={aggregateData(data)} />
    </div>
  );
}


const LikeDislikeChart = ({ data }) => {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="white" />
          <XAxis dataKey="name" stroke="white" />
          <YAxis stroke="white" />
          <ChartTooltip />
          <Legend />
          <Bar dataKey="tooPositive" fill="#d8e897" name="too positive" />
          <Bar dataKey="tooNegative" fill="#56d9ff" name="too negative" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const AccuracyChart = ({ data }) => {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="white" />
          <XAxis dataKey="name" stroke="white" />
          <YAxis stroke="white" />
          <ChartTooltip />
          <Legend />
          <Bar dataKey="accuracy" fill="#ffcaca" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const aggregateData = (data) => {
  const newData = [];

  let negNum = 0;
  let posNum = 0;
  let total = 0;

  let negative = {
    name: "negative",
    retries: 0,
    accuracy: 0,
    tooNegative: 0,
    tooPositive: 0
  }

  let positive = {
    name: "positive",
    retries: 0,
    accuracy: 0,
    tooNegative: 0,
    tooPositive: 0
  }

  data.forEach((stat) => {
    total = total + 1;
    if (stat.sentiment === "negative") {
      console.log('negative');
      negNum = negNum + 1;
      negative.retries = (negative.retries + stat.retries) / negNum;
      negative.tooNegative = (negative.tooNegative + stat.tooNegative);
      negative.tooPositive = (negative.tooPositive + stat.tooPositive);

      let accuracy = stat.retries > 0 ? 0 : 1;
      console.log(total);

      negative.accuracy = (negative.accuracy + 1) / negNum;

    } else if (stat.sentiment === "positive") {
      posNum = posNum + 1;
      positive.retries = (positive.retries + stat.retries) / posNum;
      positive.retries = 0.90;
      positive.tooNegative = (positive.tooNegative + stat.tooNegative);
      positive.tooPositive = (positive.tooPositive + stat.tooPositive);

      let accuracy = stat.retries > 0 ? 0 : 1;

      positive.accuracy = (positive.accuracy + accuracy) / posNum;
    }
  })

  newData.push(positive, negative);

  return newData;
}
