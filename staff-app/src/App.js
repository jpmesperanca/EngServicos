import React, { Component } from "react";
import Order from "./components/order";
import LoginForm from "./components/loginForm";
import "./App.css";
import bcrypt from "bcryptjs";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			login: false,
			orders: [
				{
					Food: ["Apples", "Apples", "Apples"],
					Status: "Done",
					Tag: "1",
				},
				{ Food: ["Bananas", "Bananas"], Status: "Ongoing", Tag: "2" },
				{ Food: ["Oranges"], Status: "Done", Tag: "3" },
			],
		};
	}

	handleClickRefresh() {
		this.setState({
			orders: [{ Food: ["McSopíssima"], Status: "Done", Tag: "4" }],
		});
	}

	handleLogin(data) {
		//const salt = bcrypt.genSaltSync(10);
		//var hash = bcrypt.hashSync(pass.value, salt);
		//console.log(hash);

		var hash =
			"$2a$10$jAieim6G6lWDIsrWk/vuduJjI1Yr/z5ZeEVIsKBKh9i8DE.1V3zGe";

		if (
			data.username === "admin" &&
			bcrypt.compareSync(data.password, hash)
		) {
			this.setState({
				login: true,
			});
		}
	}

	renderOrder(order) {
		return (
			<li key={order.Tag}>
				<Order
					Food={order.Food}
					Status={order.Status}
					Tag={order.Tag}
				/>
			</li>
		);
	}

	render() {
		const orderList = this.state.orders.map((order) => {
			return this.renderOrder(order);
		});

		if (!this.state.login) {
			return (
				<div className="App">
					<LoginForm onSubmit={(data) => this.handleLogin(data)} />
				</div>
			);
		}

		return (
			<div className="App">
				<div className="Request">
					{"Requests:"}
					<ul className="RequestList">{orderList}</ul>
					<button
						className="Button"
						onClick={() => this.handleClickRefresh()}
					>
						{"Refresh"}
					</button>
				</div>
			</div>
		);
	}
}

export default App;
