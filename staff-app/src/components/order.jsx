import React from "react";

function Order(props) {
	const orderFood = props.Food.map((food, index) => {
		return <li key={index}>{food}</li>;
	});

	return (
		<ul className="Order">
			{props.Tag + " -> " + props.Status}
			{orderFood}
		</ul>
	);
}

export default Order;
