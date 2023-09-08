const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const Webpack = require("webpack");
const { FileListPlugin } = require("./plugin/demo.js");
const addAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");

const md5 = require("crypto")
	.createHash("sha256")
	.update("hello owrld")
	.digest()
	.toString("hex")
	.substring(0, 8);

console.log(process.env.port);

const port = process.env.port || 3000;

module.exports = {
	entry: {
		app: {
			import: "./src/index.js"
			// dependOn: ["shared"]
		}
		// anotherModule: {
		// 	import: "./src/print.js",
		// 	dependOn: ["shared"]
		// },
		// shared: "lodash"
	},
	output: {
		filename: "[name]-[contenthash:8]-bundle.js",
		path: path.resolve(process.cwd(), "dist"),
		clean: true,
		publicPath: "/",
		// chunkFilename: "[name]-async.js",
		assetModuleFilename: "image/[name]-[ext]"
	},
	devtool: "inline-cheap-module-source-map",
	module: {
		rules: [
			// {
			// 	test: /\.css$/,
			// 	use: ["style-loader", "css-loader"]
			// },
			{
				test: /\.haibo$/,
				use: [
					{
						loader: require("path").resolve("src/loader/loader-a.js"),
						options: {
							name: "a"
						}
					}
				]
			},
			{
				test: /\.js(x)?$/,
				include: path.resolve(__dirname, "src"),
				use: [
					{
						loader: "babel-loader"
					}
				]
			},
			{
				test: /\.(jpg|jpeg|png|gif|svg)$/,
				type: "asset/resource",
				generator: {
					outputPath: "asset"
				}
			}
		]
	},
	devServer: {
		static: "dist",
		open: true,
		hot: false,
		port: port,
		// allowedHosts: ["haibo.com"],
		headers: {
			csrf_token: md5
		},
		setupMiddlewares: (middlewares, devServer) => {
			devServer.app.get("/devServer", (req, res) => {
				res.send("dev server");
			});

			middlewares.push({
				name: "userInfo",
				path: "/api/userInfo",
				middleware(req, res) {
					console.log(req.url);
					res.send(
						JSON.stringify({
							name: "haibo",
							age: 32
						})
					);
				}
			});

			return middlewares;
		}
	},
	resolve: {
		symlinks: true,
		alias: {
			"@": path.resolve("src")
		},
		extensions: [".js", ".json", ".jsx"],
		mainFields: ["index", "main"]
	},
	optimization: {
		moduleIds: "deterministic",
		runtimeChunk: "single",
		usedExports: true
		// runtimeChunk: {
		// 	name: entry => `runtime-${entry.name}`
		// }
		// splitChunks: {
		// 	chunks: "all",
		// 	// minSize: 20000,
		// 	// minRemainingSize: 0,
		// 	// minChunks: 1,
		// 	// maxAsyncRequests: 30,
		// 	// maxInitialRequests: 30,
		// 	// enforceSizeThreshold: 50000,
		// 	automaticNameDelimiter: "~",
		// 	// chunks: chunk => {
		// 	// 	console.log(chunk.name);
		// 	// 	return true;
		// 	// },
		// 	cacheGroups: {
		// 		verdor: {
		// 			test: ({ resource }) => {
		// 				const arr = ["react", "react-dom"].map(i => "node_modules/" + i);
		// 				return arr.some(item => resource && resource.includes(item));
		// 			},
		// 			// reuseExistingChunk: true,
		// 			name: "react-vendon",
		// 			enforce: true,
		// 			chunks: "all"
		// 		},
		// 		log: {
		// 			test: /[\\/]src[\\/]util[\\/]index.js/,
		// 			name: "log",
		// 			// usedExports: true,
		// 			enforce: true
		// 		}
		// 	}
		// }
	},
	mode: "development",
	cache: {
		type: "filesystem",
		allowCollectingMemory: true
	},
	experiments: {
		lazyCompilation: {
			imports: true
		},
		css: true,
		buildHttp: {
			allowedUris: ["http://localhost:3008/"]
		}
	},
	performance: {
		maxAssetSize: 100000
	},
	plugins: [
		new HtmlWebpackPlugin({
			meta: { name: "viewport" },
			template: path.resolve(__dirname, "index.html"),
			minify: false
		}),
		// new WebpackManifestPlugin({
		// 	basePath: "",
		// 	fileName: "manifest.json",
		// 	useEntryKeys: true,
		// 	writeToFileEmit: true
		// }),
		new Webpack.DefinePlugin({
			env: JSON.stringify(`${port}`)
		}),
		new Webpack.ProvidePlugin({
			_: "lodash"
		}),
		new Webpack.DllReferencePlugin({
			context: __dirname,
			manifest: path.resolve("./manifest.json"),
			scope: "react",
			sourceType: "commonjs2"
		}),

		new addAssetHtmlWebpackPlugin({
			filepath: path.resolve(__dirname, "dll/dll-bundle.js")
		}),

		new FileListPlugin()
		// new Webpack.container.ModuleFederationPlugin({
		// 	name: "app1",
		// 	// filename: "remoteEntry.js",
		// 	remotes: {
		// 		app2: "app2@http://localhost:3002/remoteEntry.js"
		// 	}
		// 	// exposes: {
		// 	// 	"./Button": "./src/remote/button"
		// 	// }
		// 	// shared: {
		// 	// 	react: {
		// 	// 		singleton: true,
		// 	// 		requiredVersion: "^18.2.0"
		// 	// 	},
		// 	// 	"react-dom": {
		// 	// 		singleton: true,
		// 	// 		requiredVersion: "^18.2.0"
		// 	// 	}
		// 	// }
		// })
	]
};
