import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import Main from './main/main';
import Playlist from './playlist/playlist';
import reportWebVitals from './reportWebVitals';
import Stats from './stats/stats';

export const DataContext = React.createContext('');

const App = ({ children }) => {
  const [ statsData, setStatsData] = useState([]);

  return (
    <DataContext.Provider value={[statsData, setStatsData]}>
      {children}
    </DataContext.Provider>
  )
}
const router = createBrowserRouter([
  
      {
        path: "/",
        element: <Main />,
      },
      {
        path: "/playlist",
        element: <Playlist />,
      },
      {
        path: "stats",
        element: <Stats />
      }
    
  

]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App>
    <RouterProvider router={router} />
    </App>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
