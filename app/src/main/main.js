import './main.css';
import React, { useContext } from 'react';
import Input from './input/input';
import { DataContext } from '..';

export default function Main() {
  const [ statsData, setStatsData ] = useContext(DataContext);
  return (
    <div className="main-container">
      <div class="input-container">
        <div class="title">The Mood Playlist Generator</div>
        <Input hintText="How are you feeling?" statsData={statsData} setStatsData={setStatsData} />
      </div>
    </div>
  );
}