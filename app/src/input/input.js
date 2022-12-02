import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './input.css';
import { getTracks } from '../services/spotify';

export default function Input({hintText}) {
    return (
        <div class="mood-input-container">
            <TextField
                id="mood-input"
                label={hintText}
                variant="filled"
                className='input-field'
                size="large"
            />
            <div><Button variant="outlined" onClick={() => getTracks("Talk 2 U")}>Submit</Button></div> 
        </div>
    );
}