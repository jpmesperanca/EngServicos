import React from "react";

function Food(props) {
	return (
		<button className="food" onClick={props.onClick}>
			{props.name}
		</button>
	);
}

export default Food;
