import React, { useState } from "react";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { GOOD, MORE_NEGATIVE, MORE_POSITIVE } from '../../services/constants';
import { Tooltip } from "@mui/material";

/*
Handles user feedback.
*/
export default function Feedback({ playlistName, regeneratePlaylist, statsData, setStatsData }) {

    const [feedback, setFeedback] = useState(null);

    const handleClick = (newFeedback) => {
        const stat = statsData && Array.isArray(statsData) && statsData.find(element => element.name === playlistName);

        if (stat) {
            if (feedback === GOOD) {
                stat.good = true;
            } else {
                stat.good = false;

                if (feedback === MORE_NEGATIVE) {
                    stat.tooNegative += 1;
                } else {
                    stat.tooPositive += 1;
                }
            }
        }



        setFeedback(newFeedback);

        if (regeneratePlaylist) {
            if (stat) {
                stat.retries += 1;
            }

            regeneratePlaylist(newFeedback);
        }

        const newData = statsData.filter(function(e) { return e.name !== playlistName })

        setStatsData(newData.push(stat))

        console.log(statsData)
    }

    const feedbackMatches = (matchStr) => {
        return feedback === matchStr
    }

    return (
        <div className="feedback-container">
            <Tooltip title="Fits perfectly">
                <ThumbUpOffAltIcon
                    onClick={() => handleClick(GOOD)}
                    sx={{ color: feedbackMatches(GOOD) ? "#25cd87" : "rgb(255 255 255 / 80%)", "&:hover": { color: "#25cd87", cursor: "pointer" } }}
                />
            </Tooltip>
            <Tooltip title="Needs more positivity">
                <SentimentSatisfiedAltIcon
                    sx={{ color: feedbackMatches(MORE_POSITIVE) ? "#41dbdf" : "rgb(255 255 255 / 80%)", "&:hover": { color: "#fff135", cursor: "pointer" } }}
                    onClick={() => handleClick(MORE_POSITIVE)}
                />
            </Tooltip>
            <Tooltip title="Needs more negativity">
                <SentimentVeryDissatisfiedIcon
                    sx={{ color: feedbackMatches(MORE_NEGATIVE) ? "#41dbdf" : "rgb(255 255 255 / 80%)", "&:hover": { color: "#ff7373", cursor: "pointer" } }}
                    onClick={() => handleClick(MORE_NEGATIVE)}
                />
            </Tooltip>
        </div>
    );
}

