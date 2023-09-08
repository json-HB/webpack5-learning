import React from "React";
import { Outlet, Link } from "react-router-dom";

export default () => {
	return (
		<div>
			<ul>
				<li className='inline-block border mr-10 p-2 text-green-200'>
					<Link to='home'>home</Link>
				</li>
				<li className='inline-block border  p-2 text-green-200'>
					<Link to='about'>about</Link>
				</li>
				<li className='inline-block border  p-2 text-green-200'>
					<Link to='fetch'>fetch</Link>
				</li>
			</ul>
			<Outlet />
		</div>
	);
};
