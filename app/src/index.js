import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import Main from './main/main';
import Playlist from './playlist/playlist';
import Stats from './stats/stats';
import reportWebVitals from './reportWebVitals';

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
    path: "/stats",
    element: <Stats />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
