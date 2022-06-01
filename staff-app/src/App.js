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
		const fd = new FormData();
		fd.append("jwt", this.state.login);

		axios
			.post(
				"http://proj-env.eba-pch63pxp.us-east-1.elasticbeanstalk.com/staff/user"
			)
			.then((res) => {
				let arr = [];
				res.data.forEach((element) => {
					let allfood = [];
					element.meals.forEach((el) => {
						allfood.push(el.meals__name);
					});
					arr.push({
						Id: element.id,
						Food: allfood,
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

				const fd = new FormData();
				fd.append("jwt", res.data.jwt);

				axios
					.post(
						"http://proj-env.eba-pch63pxp.us-east-1.elasticbeanstalk.com/staff/user"
					)
					.then((res) => {
						let arr = [];
						res.data.forEach((element) => {
							let allfood = [];
							element.meals.forEach((el) => {
								allfood.push(el.meals__name);
							});
							arr.push({
								Id: element.id,
								Food: allfood,
								Status: element.status,
								Tag: element.location_tag,
							});
						});
						this.setState({
							orders: arr,
						});
					})
					.catch((reason) => {
						console.log(reason);
					});
			})
			.catch(() => {
				this.setState({
					error: true,
				});
			});
	}

	renderOrder(order) {
		return (
			<li key={order.Id}>
				<Order
					Food={order.Food}
					Status={order.Status}
					Tag={order.Tag}
					Id={order.Id}
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
