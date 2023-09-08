const webpack = require("webpack");
const path = require("path");
const compile = webpack(path.resolve("wbepack.config.js"));

compile.run((err, stat) => {
	if (err) {
		// console.log(err);
	} else {
		stat.toString({
			colors: true
		});
	}
});
