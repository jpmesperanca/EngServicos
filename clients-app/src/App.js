import React, { Component } from "react";
import Food from "./components/food";
import "./App.css";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			order: [],
			orderNum: 0,
			foodTypes: ["Apple", "Banana", "Orange"],
		};
	}

	handleClickFood(food) {
		this.setState({
			order: [...this.state.order, food],
		});
	}

	handleClickRefresh() {
		this.setState({
			foodTypes: ["Morangos", "Melancia", "Melão", "McSopíssima"],
		});
	}

	handleClickSubmit() {
		if (this.state.order.length > 0) {
			this.setState({
				order: [],
				orderNum: this.state.orderNum + 1,
			});
		}
	}

	renderFood(food, index) {
		return (
			<li key={index}>
				<Food name={food} onClick={() => this.handleClickFood(food)} />
			</li>
		);
	}

	renderOrder(food, index) {
		return <li key={index}>{food}</li>;
	}

	render() {
		const menu = this.state.foodTypes.map((food, index) => {
			return this.renderFood(food, index);
		});

		const orderlist = this.state.order.map((food, index) => {
			return this.renderOrder(food, index);
		});

		return (
			<div className="App">
				<div className="Menu">
					{"Menu:"}
					<ul className="MenuList">{menu}</ul>
					<button
						className="Button"
						onClick={() => this.handleClickRefresh()}
					>
						{"Refresh"}
					</button>
				</div>

				<div className="Order">
					{"Current order:"}
					<ul className="OrderList">{orderlist}</ul>
				</div>

				<div className="Submit">
					{"Total price: 29.99€"}
					<button
						className="Button"
						onClick={() => this.handleClickSubmit()}
					>
						{"Submit"}
					</button>
				</div>
			</div>
		);
	}
}

export default App;
