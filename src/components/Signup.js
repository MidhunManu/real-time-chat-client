import { useState } from "react";
import Cookies from "js-cookie";

export default function Signup() {
	const [signUpCredentials, setSignUpCredentials] = useState({
		"username": "",
		"email": "",
		"password": "",
	});

	async function handleFormSubmit(e) {
		e.preventDefault();
		try {
			let response = await fetch("http://localhost:8080/api/v1/addNewUser", {
				method: "post",
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(signUpCredentials),
			});
			if(response.ok) {
				console.log("user added successfully");
				Cookies.set("current_user", signUpCredentials.username, {expires: 1, path: "/"})
				document.location.href = "/avatars";
			}
			else {
				console.log(response.body);
			}
		}
		catch(err) {
			console.error(`sign up error: ${err}`);
		}
	}

	function handleOnChange(e) {
		const { name, value } = e.target;
		setSignUpCredentials(prevCredentials => ({
			...prevCredentials,
			[name]: value,
		}));
	}

	return (
		<>
			<div className="card position-absolute top-50 start-50 translate-middle" style={{width: "20rem"}}>
			<form onSubmit={handleFormSubmit}>
			<div className="card-body my-3">
				<h4 className="card-title" style={{textAlign: "center"}}>Signup</h4>
				<div>
				<input onChange={handleOnChange} className="my-1 mx-4"name="username" type="text" placeholder="username" autoComplete="off"/>

				<input onChange={handleOnChange} className="my-3 mx-4"name="email" type="email" placeholder="email" autoComplete="off"/>

				<input onChange={handleOnChange} name="password" className="mx-4" type="password" placeholder="password" autoComplete="off"/>
			</div>
			<div className="mx-5 my-3">
				<div className="mx-4">
				<button className="btn btn-danger mx-4" type="submit">sign up</button>
		</div>
			</div>
			<div className="my-3" style={{textAlign:"center"}}>
		</div>
			</div>
		</form>
		</div>

		</>
	);
}
