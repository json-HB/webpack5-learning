import React from "React";
import { main } from "../../style/style.module.css";
import httpsContent from "http://localhost:3008/service/app.js?1=2";

console.log(httpsContent, "httpsContent");

export default () => {
	return (
		<div>
			{" "}
			<span className={main}>about color</span>
			<br />
		</div>
	);
};
