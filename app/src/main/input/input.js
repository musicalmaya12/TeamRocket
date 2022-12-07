import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './input.css';
import { getMoodPlaylist } from '../../services/generator';

export default function Input({ hintText }) {
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