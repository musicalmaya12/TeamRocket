import './main.css';
import React from 'react';
import Input from './input/input';

export default function Main() {
  return (
    <div className="main-container">
      <div class="input-container">
        <div class="title">The Mood Playlist Generator</div>
        <Input hintText="How are you feeling?" />
      </div>
    </div>
  );
}