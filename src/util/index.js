const log = function(...arg) {
	console.log.apply(console, arg);
};

const help = () => {
	console.log("helo");
};

window.log = log;

export { log };
