import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import { HashRouter } from "react-router-dom";

import "./style/index.css";

import(/* webpackChunkName: "demo" */ "./a.haibo").then((res) => {
	console.log(res);
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
