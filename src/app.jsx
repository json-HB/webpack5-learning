import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import Layout from "./components/layout/index.jsx";
import NotFound from "./components/notFound/index.jsx";
// import Home from "./pages/home/index.jsx";
// import About from "./pages/about/index.jsx";
// import Fetch from "./pages/fetch/index.jsx";
import print from "./print";
import { HashRouter } from "react-router-dom";

const HomeCom = React.lazy(() =>
	import(/* webpackChunkName: "home" */ "./pages/home/index.jsx")
);
const AboutCom = React.lazy(() =>
	import(/* webpackChunkName: "about" */ "./pages/about/index.jsx")
);
const FetchCom = React.lazy(() =>
	import(/* webpackChunkName: "fetch" */ "./pages/fetch/index.jsx")
);

print();

const cs = require.context("./components", true, /index.jsx$/);
cs.keys().forEach((key) => {
	console.log(cs(key).default);
});

function loadComponent(scope, module) {
	return async () => {
		// Initializes the share scope. This fills it with known provided modules from this build and all remotes
		await __webpack_init_sharing__("default");
		const container = window[scope]; // or get the container somewhere else
		// Initialize the container, it may provide shared modules
		await container.init(__webpack_share_scopes__.default);
		const factory = await window[scope].get(module);
		const Module = factory();
		return Module;
	};
}

const urlCache = new Set();
const useDynamicScript = (url) => {
	const [ready, setReady] = React.useState(false);
	const [errorLoading, setErrorLoading] = React.useState(false);

	React.useEffect(() => {
		if (!url) return;

		if (urlCache.has(url)) {
			setReady(true);
			setErrorLoading(false);
			return;
		}

		setReady(false);
		setErrorLoading(false);

		const element = document.createElement("script");

		element.src = url;
		element.type = "text/javascript";
		element.async = true;

		element.onload = () => {
			urlCache.add(url);
			setReady(true);
		};

		element.onerror = () => {
			setReady(false);
			setErrorLoading(true);
		};

		document.head.appendChild(element);

		return () => {
			urlCache.delete(url);
			document.head.removeChild(element);
		};
	}, [url]);

	return {
		errorLoading,
		ready
	};
};

const componentCache = new Map();
export const useFederatedComponent = (remoteUrl, scope, module) => {
	const key = `${remoteUrl}-${scope}-${module}`;
	const [Component, setComponent] = React.useState(null);

	const { ready, errorLoading } = useDynamicScript(remoteUrl);
	React.useEffect(() => {
		if (Component) setComponent(null);
		// Only recalculate when key changes
	}, [key]);

	React.useEffect(() => {
		if (ready && !Component) {
			const Comp = React.lazy(loadComponent(scope, module));
			componentCache.set(key, Comp);
			setComponent(Comp);
		}
		// key includes all dependencies (scope/module)
	}, [Component, ready, key]);

	return { errorLoading, Component };
};

const App = () => {
	const [{ module, scope, url }, setSystem] = React.useState({});

	const [mode, setMode] = useState("app2");

	const { Component: FederatedComponent, errorLoading } = useFederatedComponent(
		url,
		scope,
		module
	);

	const handle = (type) => {
		setMode(type);

		window.hash = "/app2";

		if (mode != "local") {
			setSystem({
				url: "http://localhost:3002/remoteEntry.js",
				scope: "app2",
				module: "./Button"
			});
		}
	};

	return (
		<div>
			<a href='/#/' onClick={() => handle("local")}>
				local
			</a>
			<a href='/#/app2' onClick={() => handle("app2")}>
				app2
			</a>
			{mode === "local" ? (
				<HashRouter basename='/'>
					<React.Suspense fallback={<div>loading</div>}>
						<Routes>
							<Route path='/' element={<Layout></Layout>}>
								<Route path='home' element={<HomeCom />}></Route>
								<Route path='about' element={<AboutCom />}></Route>
								<Route path='fetch' element={<FetchCom />}></Route>
							</Route>
							<Route path='*' element={<NotFound />}></Route>
						</Routes>
					</React.Suspense>
				</HashRouter>
			) : (
				<Suspense fallback={"loading"}>
					{errorLoading
						? `Error loading module "${module}"`
						: FederatedComponent && <FederatedComponent />}
				</Suspense>
			)}
		</div>
	);
};

export default App;
if (module.hot) {
	module.hot.accept("./print.js", () => {
		log("print");
	});
}
