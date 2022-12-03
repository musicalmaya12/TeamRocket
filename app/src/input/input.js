import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './input.css';
import { getMoodPlaylist } from '../services/spotify';

export default function Input({hintText}) {
    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        setMessage(event.target.value);
    }

    const handleClick = () => {
        // TO-DO: This getTracks method should call the backend to get playlist. 
        // Uncomment once getTracks method works.
        getMoodPlaylist(message);
        console.log(message);
    }

    return (
        <div class="mood-input-container">
            <TextField
                id="mood-input"
                label={hintText}
                variant="filled"
                className='input-field'
                size="large"
                onChange={handleChange}
                value={message}
            />
            <div>
                <Button variant="outlined" onClick={handleClick}>Submit</Button>
            </div> 
        </div>
    );
}