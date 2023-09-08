const path = require("path");
const Webpack = require("webpack");

module.exports = {
	entry: {
		vendors: ["react", "react-dom"]
	},
	mode: "production",
	output: {
		filename: "dll-bundle.js",
		path: path.resolve(process.cwd(), "dll"),
		clean: true
	},
	plugins: [
		new Webpack.DllPlugin({
			context: __dirname,
			name: "[name]_[fullhash]",
			path: path.join(__dirname, "manifest.json")
		})
	]
};
