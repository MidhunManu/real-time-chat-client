import Cookies from "js-cookie";
import { useState } from "react";
import { Link, } from "react-router-dom";

export default function Login() {
	const [credentials, setCredentials] = useState({
		"email": "",
		"password": "",
	});

	const [errorDisplay, setErrorDisplay] = useState("none");

	function handleOnChange(e) {
		const {name, value} = e.target;
		setCredentials(prevCredentials => (
			{
				...prevCredentials,
				[name]:value
			}
		));
	}

	async function handleFormSubmit(e) {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:8080/api/v1/loginUser", {
				method: "post",
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(credentials)
			})

			if(response.ok) {
				console.log("success");
				try {
					const user_response = await fetch(`http://localhost:8080/api/v1/specificUsername?username=${credentials.email}`);
					const user_json = await user_response.json();
					const current_user = user_json.chat_app_get_specific_username;
					Cookies.set("current_user", current_user);
					document.location.href = "/home";

				}
				catch(err) {
					console.error(`current user setting erro : ${err}`);
				}
			}
			else {
				setErrorDisplay("block");
				setTimeout(() => {
					setErrorDisplay("none");
				}, 2500);
			}
		}
		catch(err) {
			console.error(`login error : ${err}`);
		}
	}

	async function getCurrentUserDetails(username_or_email) {
		try {
		}
		catch(err) {
			console.err(`error getting current user details\n ${err}`);
		}
	}

	return (
		<>
		<div className="card position-absolute top-50 start-50 translate-middle" style={{width: "20rem"}}>
			<form onSubmit={handleFormSubmit} method="post">
			<div className="card-body my-3">
				<h4 className="card-title" style={{textAlign: "center"}}>Login</h4>
				<div>
				<input onChange={handleOnChange} className="my-3 mx-4"name="email" type="text" placeholder="username or email" autoComplete="off"/>
				<input onChange={handleOnChange} name="password" className="mx-4" type="password" placeholder="password" autoComplete="off"/>
			</div>
			<div className="mx-5 my-3">
				<div className="mx-3">
				<button className="btn btn-danger mx-5" type="submit">login</button>
		</div>
			</div>
			<div className="my-3" style={{textAlign:"center"}}>
				<Link to="/" className="card-link mx-3">forgot password</Link>
				<Link to="/signup" className="card-link mx-2">signup</Link>
				<p style={{display: errorDisplay, color: "red"}}>wrong password or username</p>
		</div>
			</div>
		</form>
		</div>
		</>
	);
}
