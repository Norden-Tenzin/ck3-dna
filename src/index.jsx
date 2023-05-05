import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// style
import './index.css';
// internal
import Login from './routes/Login';
import Register from './routes/Register';
import Reset from './routes/Reset';
import Dashboard from './routes/Dashboard';
import LaunchPage from './routes/LaunchPage';
import CharacterPage from './routes/CharacterPage';
import UploadPage from './routes/UploadPage';
import UserPage from './routes/UserPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/reset",
    element: <Reset />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/launch",
    element: <LaunchPage />,
  },
  {
    path: "/chara/:charaId",
    element: <CharacterPage />,
  },
  {
    path: "/upload",
    element: <UploadPage />,
  },
  {
    path: "/user/:uid",
    element: <UserPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);
