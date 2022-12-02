import './main.css';
import Input from '../input/input';

export default function Main() {
  return (
    <div className="main-container">
      <div class="input-container">
        <div class="title">The Mood Playlist Generator</div>
        <Input hintText="What is the mood for today?" />
      </div>
    </div>
  );
}