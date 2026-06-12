// MAIN.JSX - React app entry point
// Wraps App with Redux Provider (for state) and Router (for pages)


import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; // gives whole app access to Redux store
import { BrowserRouter } from "react-router-dom"; // enables page navigation
import App from "./App.jsx";
import { store } from "./redux/store.js";
import "./index.css"; // Tailwind styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Provider makes Redux store available to ALL components */}
    <Provider store={store}>
      {/* BrowserRouter enables <Routes> and navigation */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
