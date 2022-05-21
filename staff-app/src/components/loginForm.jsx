import React from "react";

function LoginForm(props) {
	const usernameRef = React.useRef();
	const passwordRef = React.useRef();

	const handleSubmit = (e) => {
		e.preventDefault();
		const data = {
			username: usernameRef.current.value,
			password: passwordRef.current.value,
		};
		props.onSubmit(data);
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="Input">
				<label>Username </label>
				<input ref={usernameRef} type="text" />
			</div>
			<div className="Input">
				<label>Password </label>
				<input ref={passwordRef} type="password" />
			</div>
			<div>
				<button className="LoginButton" type="submit">
					Submit
				</button>
			</div>
		</form>
	);
}

export default LoginForm;
