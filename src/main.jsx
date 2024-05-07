import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { legacy_createStore } from "redux";
import { Provider } from "react-redux";
import Root from "./components/Redux/Root.js";

const store = legacy_createStore(Root);
ReactDOM.createRoot(document.getElementById("root")).render(
     <Provider store={store}>
      <App />
    </Provider>
 );
