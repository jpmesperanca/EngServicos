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
			accessKeyId: "ASIAVTI7IFA5RTCRA6GZ",
			secretAccessKey: "a3Ua6Y0PuOeuB4uu6Q4jVGYZZMtp2066WyA2Tbzo",
			sessionToken:
				"FwoGZXIvYXdzEDcaDBOf/aXk9o5iaj2K4SLLARI5s252/DLSJfIk+BSIDnBzBw1dMec2Iuvef4xUb3f5cf/jNWCgx9S1Erm6fv9JjG9ZlceI4wQJfNkuoe4b/lnyxU1+7wdTanGv3Hom3wWhZYso6yAsoKXqyJMgNXCSfvf2zXhQm9yacKk9hzkYv8yP3uA9+9Izl0C8aZeIU9fVIOzNzc7JlyfCQOtAnv0jBLT3L2sH7fiCQiM9DWkBMzNLdpOjMQ7rIqvuvHDPSLYQBu5vhgc5/H4/xu7R2T1O8gHwU8KSBqZsOoCRKJfn1JQGMi1s4VA3YR7bckaCxEUgaHTmRDPe9CyPFfEjcd079vq5lrqsv+fGKy8RxXfwQHI=",
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

	handleClickConfirm() {
		if (this.state.photo !== null) {
			this.setState({
				hasCompleted: 1,
			});

			const photoName = this.uploadImage();

			const fd = {
				orderId: this.state.orderId,
				photo: photoName,
				tag: this.state.orderNum,
			};

			axios
				.post(
					"http://proj-env.eba-pch63pxp.us-east-1.elasticbeanstalk.com/menu/confirmorder",
					fd
				)
				.then((res) => {
					if (this.state.order.length > 0) {
						this.setState({
							hasSubmitted: 1,
						});
					}
					console.log(res);
				});
		}
	}

	handleClickFinalize() {
		this.setState({
			order: [],
			hasSubmitted: 0,
			hasCompleted: 0,
			photo: null,
			photoName: "",
			orderNum: this.state.orderNum + 1,
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
					<div>Preço: {this.state.orderPrice}</div>
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
							MEAL HAS ARRIVED!
						</button>
					</div>
				</div>
			);
		}
	}
}

export default App;
