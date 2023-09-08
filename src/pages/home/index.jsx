import React from "React";

export default () => {
	const [dayamic, setDayamic] = React.useState(null);

	const handle = () => {
		import(
			/* webpackChunkName: "print" */
			/* webpackMode: "lazy" */
			"../../print.js"
		).then(({ default: fn }) => {
			fn();
		});
	};

	const daynamic = () => {
		import(
			/* webpackChunkName: 'daynamic' */ "../../components/daymic/index.jsx"
		).then(({ default: Com }) => {
			setDayamic(Com);
		});
	};

	return (
		<div>
			<div className='w-20'></div>
			<div className='w-30 bg-fixed bg-image h-48 bg-no-repeat'></div>
			<div className='text-green-200'>{name}</div>
			<button className='btn btn-primary p-2 border border-2' onClick={handle}>
				click
			</button>
			<button
				className='btn btn-primary p-2 border border-2'
				onClick={daynamic}>
				daynamic
			</button>

			<div>{dayamic}</div>
		</div>
	);
};
