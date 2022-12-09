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
      </div>
      <h1>Statistics</h1>
      <h2>User Feedback on Sentiment Accuracy of Positive and Negative Playlists</h2>
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
          <XAxis label={{ value: "Playlist Sentiment", position: "insideBottomRight", dx: -200}} offset={90} dataKey="name" stroke="white" />
          <YAxis label={{ value: "# of Feedback Icon Clicks", position: "insideLeft", angle: -90, dy: 80}} stroke="white" />
          <ChartTooltip />
          <Legend />
          <Bar dataKey="tooPositive" fill="#d8e897" name="Too Positive" />
          <Bar dataKey="tooNegative" fill="#56d9ff" name="Too Negative" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


const aggregateData = (data) => {
  const newData = [];

  if (Object.keys(data).length === 0) {
    return newData;
  }
  let negative = {
    name: "Negative",
    tooNegative: data.negative.tooNegative,
    tooPositive: data.negative.tooPositive
  }

  let positive = {
    name: "Positive",
    tooNegative: data.positive.tooNegative,
    tooPositive: data.positive.tooPositive
  }

  newData.push(positive, negative);

  return newData;
}
