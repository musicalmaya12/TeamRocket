import React, { useEffect, useState } from "react";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { GOOD, MORE_NEGATIVE, MORE_POSITIVE } from '../../services/constants';
import { Tooltip } from "@mui/material";
import { setStats } from "../../services/generator";

/*
Handles user feedback.
*/
export default function Feedback({ sentiment, regeneratePlaylist }) {
    const [feedback, setFeedback] = useState(null);

    const handleClick = (newFeedback) => {
        setFeedback(newFeedback);

        if (regeneratePlaylist) {
            regeneratePlaylist(newFeedback);
        }

        if (newFeedback !== GOOD) {
            if (newFeedback !== MORE_NEGATIVE) {
                setStats(sentiment, "tooNegative")
            } else {
                setStats(sentiment, "tooPositive")
            }
        }

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

