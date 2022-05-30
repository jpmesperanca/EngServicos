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
			orderNum: 0,
			hasSubmitted: 0,
			hasCompleted: 0,
			foodTypes: [],
			photo: null,
			photoName: "",
		};
	}

	componentDidMount() {
		axios
			.get(
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
			accessKeyId: "ASIAVTI7IFA56ZQTXXKE",
			secretAccessKey: "LeI7zyiQbi+jvJ321rlCAD2SFCH9Myf9knim5hNE",
			sessionToken:
				"FwoGZXIvYXdzECIaDC38wXXtHfupJUIssSLLAefFAECbxyvh2934TXtrQt/PSVxz5qiWbYcgw1k6A3+zwHn6eUFkL3aQ++OdAIIApI9tWT3mn4Qk9bpHQLmohD5JoP7kDcTy82YiHW7i7LmOIHNh+O4uTEJp7HZ354X7oyqF1BZIyhogidbMdFKmxb19BviQ5hrOgX82ONVCh9S3rVxrcIMi0YrnjJ+EPI4SFYrWoQE9XqE0JIiQGd7WzLnsx9UpPcIU0+G4OtTtlx9y2n0HEMJWQvey94NHWCJPMbigFHplnEPMwU65KM2Y0JQGMi27+tmoBAcfDPXkjPM0unE6EnfxGto1XRGBTUe2l4SQ+y8rkuGYojCZNIgg5m0=",
		});

		let image = this.state.photo;
		image = image.replace(/^data:image\/\w+;base64,/, "");
		const buff = new Buffer.from(image, "base64");

		this.setState({
			photoName: this.randomString(16),
		});

		const params = {
			Bucket: "facialrecon",
			Key: this.state.photoName,
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
			this.setState({
				hasSubmitted: 1,
			});
		}
	}

	handleClickReturn() {
		this.setState({
			hasSubmitted: 0,
			photo: null,
		});
	}

	handleClickConfirm() {
		if (this.state.photo !== null) {
			this.setState({
				hasCompleted: 1,
			});
			this.uploadImage();
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
