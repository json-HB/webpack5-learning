const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

// adds all your dependencies as shared modules
// version is inferred from package.json in the dependencies
// requiredVersion is used from your package.json
// dependencies will automatically use the highest available package
// in the federated app, based on version requirement in package.json
// multiple different versions might coexist in the federated app
// Note that this will not affect nested paths like "lodash/pluck"
// Note that this will disable some optimization on these packages
// with might lead the bundle size problems
const deps = require("./package.json").dependencies;

module.exports = {
	entry: "./src/main.js",
	mode: "development",
	devServer: {
		static: {
			directory: path.join(__dirname, "dist")
		},
		allowedHosts: "all",
		port: 3000
	},
	target: "web",
	output: {
		publicPath: "auto"
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				options: {
					presets: ["@babel/preset-react"]
				}
			}
		]
	},
	plugins: [
		new ModuleFederationPlugin({
			name: "app1",
			filename: "remoteEntry.js",
			remotes: {
				app2: "app2@http://localhost:3002/remoteEntry.js"
			},
			exposes: {
				"./Button": "./src/remote/button.jsx"
			},
			shared: {
				react: {
					requiredVersion: deps.react,
					import: "react", // the "react" package will be used a provided and fallback module
					shareKey: "react", // under this name the shared module will be placed in the share scope
					shareScope: "default", // share scope with this name will be used
					singleton: true // only a single version of the shared module is allowed
				},
				"react-dom": {
					requiredVersion: deps["react-dom"],
					singleton: true // only a single version of the shared module is allowed
				}
			}
		}),
		new HtmlWebpackPlugin({
			template: "./index.html"
		})
	]
};
