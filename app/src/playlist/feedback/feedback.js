import React, { useState } from "react";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { Tooltip } from "@mui/material";

export default function Feedback({ regeneratePlaylist }) {
    const GOOD = "good"
    const BAD = "bad"

    const [feedback, setFeedback] = useState(null);

    const handleClick = (newFeedback) => {
        setFeedback(newFeedback);

        if (regeneratePlaylist) {
            regeneratePlaylist(newFeedback);
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
            <Tooltip title="Doesn't match">
                <ThumbDownOffAltIcon
                    sx={{ color: feedbackMatches(BAD) ? "#ff7373" : "rgb(255 255 255 / 80%)", "&:hover": { color: "#ff2800", cursor: "pointer" } }}
                    onClick={() => handleClick(BAD)}
                />
            </Tooltip>
        </div>
    );
}

