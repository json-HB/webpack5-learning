import React from "React";

export default () => {
	return (
		<div>
			remote
			<button
				onClick={() => {
					console.log("remote2");
				}}>
				app1 Button
			</button>
		</div>
	);
};
