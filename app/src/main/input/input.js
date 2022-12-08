import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './input.css';
import { getMoodPlaylist } from '../../services/generator';

/*
Handles user input to send to API
*/
export default function Input({ hintText, statsData, setStatsData }) {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        setMessage(event.target.value);
    }

    const handleClick = () => {
        if (isStringEmpty(message)) {
            return;
        }

        generatePlaylist(navigate, message);

        if (statsData && Array.isArray(statsData)) {
            console.log("Reach here")

            const newData = statsData.push({
                name: message,
                good: false,
                retries: 0,
                tooPositive: 0,
                tooNegative: 0
            })

            setStatsData(newData)
            console.log(statsData)

        }

    }

    return (
        <div class="mood-input-container">
            <TextField
                id="mood-input"
                label={hintText}
                variant="filled"
                className='input-field'
                size="large"
                inputProps={{
                    autoComplete: 'off',
                }}
                onChange={handleChange}
                value={message}
            />
            <div>
                <Button variant="outlined" onClick={handleClick}>Submit</Button>
            </div>
        </div>
    );
}

const isStringEmpty = (str) => {
    return str.trim().length === 0;
}

export const generatePlaylist = (navigate, message) => {
    getMoodPlaylist(message)
        .then((playlistData) => {
            navigate("/playlist", { state: { playlistData, message } });
        });
}