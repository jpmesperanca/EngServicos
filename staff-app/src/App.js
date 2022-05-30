import React, { Component } from "react";
import Order from "./components/order";
import LoginForm from "./components/loginForm";
import "./App.css";
import bcrypt from "bcryptjs";
import axios from "axios";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			login: false,
			orders: [],
		};
	}

	handleClickRefresh() {
		axios
			.get(
				"http://proj-env.eba-pch63pxp.us-east-1.elasticbeanstalk.com/staff/user",
				{
					data: {
						jwt: this.state.login,
					},
				}
			)
			.then((res) => {
				let arr = [];
				res.data.forEach((element) => {
					arr.push({
						Food: element.meals__name,
						Status: element.status,
						Tag: element.location_tag,
					});
				});
				this.setState({
					orders: arr,
				});
			});
	}

	handleLogin(data) {
		const salt = "$2a$10$g/xkuv5T31vaVCAKiYufCu";
		const hash = bcrypt.hashSync(data.password, salt);

		const fd = new FormData();
		fd.append("username", data.username);
		fd.append("password", hash);

		axios
			.post(
				"http://proj-env.eba-pch63pxp.us-east-1.elasticbeanstalk.com/staff/login",
				fd
			)
			.then((res) => {
				this.setState({
					login: res.data.jwt,
				});
				this.handleClickRefresh();
			})
			.catch(() => {
				this.setState({
					error: true,
				});
			});
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
					<div>
						{this.state.error && (
							<p>{"Wrong username or password"} </p>
						)}
					</div>
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
