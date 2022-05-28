import React, { Component } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Food from "./components/food";
import "./App.css";
//import axios from "axios";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			order: [],
			orderNum: 0,
			hasSubmitted: 0,
			hasCompleted: 0,
			foodTypes: ["Apple", "Banana", "Orange"],
			photoUri: null,
		};
	}

	handleClickFood(food) {
		this.setState({
			order: [...this.state.order, food],
		});
	}

	handleClickRefresh() {
		//axios
		//	.get(
		//		"http://proj-env.eba-pch63pxp.us-east-1.elasticbeanstalk.com/polls/"
		//	)
		//	.then((res) => {
		//		console.log(res);
		//	});
		this.setState({
			foodTypes: ["Morangos", "Melancia", "Melão", "McSopíssima"],
		});
	}

	handleClickRemoveOrder() {
		let arr = this.state.order.slice(0, -1);
		this.setState({
			order: arr,
		});
	}

	handleClickSubmit() {
		if (this.state.order.length > 0) {
			this.setState({
				hasSubmitted: 1,
			});
		}
	}

	handleClickReturn() {
		this.setState({
			hasSubmitted: 0,
			photoUri: null,
		});
	}

	handleClickConfirm() {
		if (this.state.photoUri !== null) {
			this.setState({
				hasCompleted: 1,
			});
		}
	}

	handleClickFinalize() {
		this.setState({
			order: [],
			hasSubmitted: 0,
			hasCompleted: 0,
			photoUri: null,
			orderNum: this.state.orderNum + 1,
		});
	}

	handleClickRetake() {
		this.setState({
			photoUri: null,
		});
	}

	handleTakePhoto(dataUri) {
		this.setState({
			photoUri: dataUri,
		});
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

		if (this.state.hasSubmitted === 0) {
			return (
				<div className="App">
					<div className="Menu">
						Menu:
						<ul className="MenuList">{menu}</ul>
						<button
							className="Button"
							onClick={() => this.handleClickRefresh()}
						>
							Refresh
						</button>
						<button
							className="Button"
							onClick={() => this.handleClickRemoveOrder()}
						>
							Remove item
						</button>
					</div>

					<div className="Order">
						{"Current order:"}
						<ul className="OrderList">{orderlist}</ul>
					</div>

					<div className="Submit">
						<button
							className="Button"
							onClick={() => this.handleClickSubmit()}
						>
							Next
						</button>
					</div>
				</div>
			);
		} else if (this.state.hasCompleted === 0) {
			return (
				<div className="App">
					<div>Preço: 29.99€</div>
					<div className="DecisionButtons">
						<button
							className="Button"
							onClick={() => this.handleClickConfirm()}
						>
							Confirm
						</button>
						<button
							className="Button"
							onClick={() => this.handleClickReturn()}
						>
							Return
						</button>
					</div>
					<div>
						{this.state.photoUri ? (
							<div className={"PreviewImage"}>
								<img
									src={this.state.photoUri}
									alt="You should not be seeing this, oopsie!"
								/>
								<button
									className="Button"
									onClick={() => this.handleClickRetake()}
								>
									Retake
								</button>
							</div>
						) : (
							<Camera
								onTakePhoto={(dataUri) =>
									this.handleTakePhoto(dataUri)
								}
								isDisplayStartCameraError={false}
							/>
						)}
					</div>
				</div>
			);
		} else {
			return (
				<div className="App">
					<div>
						<button
							className="Button"
							onClick={() => this.handleClickFinalize()}
						>
							MEAL HAS ARRIVED!
						</button>
					</div>
				</div>
			);
		}
	}
}

export default App;
