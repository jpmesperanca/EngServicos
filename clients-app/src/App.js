import React, { Component } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Food from "./components/food";
import { Buffer } from "buffer";
import "./App.css";
import AWS from "aws-sdk";
import axios from "axios";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			order: [],
			orderPrice: -1,
			orderId: -1,
			orderNum: 0,
			photo: null,
			hasSubmitted: 0,
			hasCompleted: 0,
			foodTypes: [],
			errorMessage: false,
			waiting: 0,
		};
	}

	componentDidMount() {
		axios
			.post(
				"http://proj-env.eba-pch63pxp.us-east-1.elasticbeanstalk.com/menu/list"
			)
			.then((res) => {
				let arr = [];
				res.data.forEach((element) => {
					arr.push(element.name);
				});
				this.setState({
					foodTypes: arr,
				});
			});
	}

	randomString(len) {
		var p =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		return [...Array(len)].reduce(
			(a) => a + p[~~(Math.random() * p.length)],
			""
		);
	}

	uploadImage() {
		const s3 = new AWS.S3({
			accessKeyId: "ASIAVTI7IFA5UGDVFQSB",
			secretAccessKey: "sFxDaX88qbhiGa+HA2I3/m4rWuMfBzthEES6rXSU",
			sessionToken:
				"FwoGZXIvYXdzEGgaDAWOcfJMwIiZZ3V8ACLLAZdutpm3z+dhlhxKZI2vnf9dcU8rXgp+6FBesbN3jNL7kI4Ps7NE/w1q9GUf92JRVyIFTnjeuis9h20YSK1A3TXsAbiyhxYkZXJO7TFfM8oW7T/4QZ0M8Fw289nxbOeJG6llKtC61KfGcMiH2zME0VP9Ngc/+N3SZWkETtoDSEQZkCxXndZWGiMiRpxv1CVDgNlNkACGqFBni4nNRG2+RkU29WnR+RC4GEkQX2edkPWlIyv8YmiMr1zETv1JYkz1KGR3GCUZklsR5jJBKM7J35QGMi1V6oFhDDP5yMnK4K+bYow3ohC8HyQGsCQBneBB+APACLWq+F7OL8pnIF8DYxw=",
		});

		let image = this.state.photo;
		image = image.replace(/^data:image\/\w+;base64,/, "");
		const buff = new Buffer.from(image, "base64");

		const name = this.randomString(16) + ".png";

		const params = {
			Bucket: "facialrecon",
			Key: name,
			Body: buff,
			ContentType: "image/png",
			ContentEncoding: "base64",
		};

		s3.upload(params, (err, data) => {
			if (err) {
				console.log("Upload to S3 failed miserably..");
				console.log(err, data);
			} else console.log(data.Location);
		});

		return name;
	}

	handleClickFood(food) {
		this.setState({
			order: [...this.state.order, food],
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
			let arr = [];
			this.state.order.forEach((element) => {
				const f = {
					name: element,
					qtd: 1,
				};
				arr = [...arr, f];
			});

			const fd = {
				order: arr,
				tag: this.state.orderNum,
			};

			axios
				.post(
					"http://proj-env.eba-pch63pxp.us-east-1.elasticbeanstalk.com/menu/receiveorder",
					fd
				)
				.then((res) => {
					this.setState({
						hasSubmitted: 1,
						orderPrice: res.data.total,
						orderId: res.data.orderID,
					});
				});
		}
	}

	handleClickReturn() {
		this.setState({
			hasSubmitted: 0,
			photo: null,
			orderPrice: -1,
			orderId: -1,
		});
	}

	handleClickReset() {
		this.setState({
			errorMessage: false,
			order: [],
			orderPrice: -1,
			orderId: -1,
			hasSubmitted: 0,
			hasCompleted: 0,
			photo: null,
			photoName: "",
			orderNum: 0,
			waiting: 0,
		});
	}

	handleClickConfirm() {
		const photoName = this.uploadImage();

		const fd = {
			orderID: this.state.orderId,
			photo: photoName,
			tag: this.state.orderNum,
		};

		this.setState({
			waiting: 1,
		});

		axios
			.post(
				"http://proj-env.eba-pch63pxp.us-east-1.elasticbeanstalk.com/menu/confirmorder",
				fd
			)
			.then((res) => {
				if (res.data === "FAILED") {
					this.setState({
						errorMessage: true,
					});
				} else {
					this.setState({
						hasSubmitted: 1,
						hasCompleted: 1,
						waiting: 0,
					});
				}
			});
	}

	handleClickFinalize() {
		const fd = {
			orderID: this.state.orderId,
		};

		axios
			.post(
				"http://proj-env.eba-pch63pxp.us-east-1.elasticbeanstalk.com/menu/delivery",
				fd
			)
			.then((res) => {
				this.setState({
					order: [],
					orderPrice: -1,
					orderId: -1,
					hasSubmitted: 0,
					hasCompleted: 0,
					photo: null,
					photoName: "",
					orderNum: 0,
				});
			});
	}

	handleClickRetake() {
		this.setState({
			photo: null,
		});
	}

	handleTakePhoto(dataUri) {
		this.setState({
			photo: dataUri,
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

	updateInputValue(evt) {
		const val = evt.target.value;

		this.setState({
			orderNum: val,
		});
	}

	render() {
		const menu = this.state.foodTypes.map((food, index) => {
			return this.renderFood(food, index);
		});

		const orderlist = this.state.order.map((food, index) => {
			return this.renderOrder(food, index);
		});

		if (this.state.errorMessage) {
			return (
				<div>
					<div>
						{
							"Facial recognition error. Please go to customer support!"
						}
					</div>
					<div>
						<button
							className="Button"
							onClick={() => this.handleClickReset()}
						>
							Go Back
						</button>
					</div>
				</div>
			);
		} else if (this.state.hasSubmitted === 0) {
			return (
				<div className="App">
					<div className="Menu">
						Menu:
						<ul className="MenuList">{menu}</ul>
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
						<div className="Input">
							<label>Location Tag </label>
							<input
								value={this.state.orderNum}
								onChange={(evt) => this.updateInputValue(evt)}
								type="text"
							/>
						</div>
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
					<div>Preço: {this.state.orderPrice}</div>
					<div className="DecisionButtons">
						{this.state.waiting ? (
							<div>Processing payment...</div>
						) : (
							<div>
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
						)}
					</div>
					<div>
						{this.state.photo ? (
							<div className={"PreviewImage"}>
								<img
									src={this.state.photo}
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
							MEAL HAS ARRIVED
						</button>
					</div>
				</div>
			);
		}
	}
}

export default App;
