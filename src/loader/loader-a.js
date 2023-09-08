function loader(source) {
	const options = this.getOptions();

	console.log(options);

	console.log(this.resourcePath);

	return source;
}

module.exports = loader;
