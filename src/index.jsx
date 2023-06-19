import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// style
import "./index.css";
// internal
import Login from "./routes/Login";
import Register from "./routes/Register";
import Reset from "./routes/Reset";
import Dashboard from "./routes/Dashboard";
import LaunchPage from "./routes/LaunchPage";
import CharacterPage from "./routes/CharacterPage";
import UploadPage from "./routes/UploadPage";
import UserPage from "./routes/UserPage";

const router = createBrowserRouter([
  {
    path: "/ck3-dna/",
    element: <LaunchPage />,
  },
  {
    path: "/ck3-dna/login",
    element: <Login />,
  },
  {
    path: "/ck3-dna/register",
    element: <Register />,
  },
  {
    path: "/ck3-dna/reset",
    element: <Reset />,
  },
  {
    path: "/ck3-dna/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/ck3-dna/chara/:charaId",
    element: <CharacterPage />,
  },
  {
    path: "/ck3-dna/upload",
    element: <UploadPage />,
  },
  {
    path: "/ck3-dna/user/:uid",
    element: <UserPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);
