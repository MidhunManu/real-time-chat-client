import Cookies from "js-cookie";
import { useEffect, useState } from "react"
import Stomp from "stompjs";
import SockJS from "sockjs-client";

export default function Home() {
	const [userList, setUserList] = useState([]);
	const [header, setHeader] = useState({
		"username": "",
		"user_avatar": "",
	});

	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState('');
	const [stompClient, setStompClient] = useState(null);

	// fetching available contacts from api
	useEffect(() => {
		async function getUserList() {
			try {
				const response = await fetch("http://localhost:8080/api/v1/showUsers");
				const json =await response.json();

				if(response.ok) {
					console.log(json);
					setUserList(json);
				}
			}
			catch(err) {
				console.error(err);
			}
		}
		getUserList();
	}, [])

	// setting default header
	useEffect(() => {
		async function setDefaultHeader() {
			if(header.username === "") {
				const current_user_name = Cookies.get("current_user");
				const current_user_avatar = await getSpecificUser(current_user_name);
				console.log(current_user_avatar);
				setHeader({"username": Cookies.get("current_user"), user_avatar: current_user_avatar})
			}
		}
		setDefaultHeader();
	}, [header])

	// establishing socket connection
	
	
	async function getSpecificUser(username) {
		try {
			const response = await fetch(`http://localhost:8080/api/v1/specificUser?username=${username}`);
			const json = await response.json();
			return json.user_avatar;
		}
		catch(err) {
			console.log(`specific user fetching error\n${err}`);
		}
	}

	return (
		<div className="container">
<div className="row clearfix">
    <div className="col-lg-12">
        <div className="card chat-app">
            <div id="plist" className="people-list">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className="fa fa-search"></i></span>
                    </div>
                    <input type="text" className="form-control" placeholder="Search..."/>
                </div>
                <ul className="list-unstyled chat-list mt-2 mb-0">
					{
						userList.map((user) => (
							<li className="clearfix" onClick={() => {setHeader(
								{
									"username": user.username,
									"user_avatar": user.user_avatar,
								}
							)}}>
							<img src={user.user_avatar} alt="img"/>
							<div className="about">
							<div className="name">{user.username}</div>
							<div className="status"> <i className="fa fa-circle offline">
							</i> left 7 mins ago </div>                                            

							</div>

							</li>

						))
					}
                </ul>
            </div>
            <div className="chat">
                <div className="chat-header clearfix">
                    <div className="row">
                        <div className="col-lg-6">
                            <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                                <img src={header.user_avatar} alt="avatar"/>
                            </a>
                            <div className="chat-about">
                                <h6 className="m-b-0">{header.username}</h6>
                                <small>Last seen: 2 hours ago</small>
                            </div>
                        </div>
                        <div className="col-lg-6 hidden-sm text-right">
                            <a href="javascript:void(0);" className="btn btn-outline-secondary"><i className="fa fa-camera"></i></a>
                            <a href="javascript:void(0);" className="btn btn-outline-primary"><i className="fa fa-image"></i></a>
                            <a href="javascript:void(0);" className="btn btn-outline-info"><i className="fa fa-cogs"></i></a>
                            <a href="javascript:void(0);" className="btn btn-outline-warning"><i className="fa fa-question"></i></a>
                        </div>
                    </div>
                </div>
                <div className="chat-history">
                    <ul className="m-b-0">
                        <li className="clearfix">
                            <div className="message-data text-right">
                                <span className="message-data-time">10:10 AM, Today</span>
                                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar"/>
                            </div>
                            <div className="message other-message float-right"> Hi Aiden, how are you? How is the project coming along? </div>
                        </li>
                        <li className="clearfix">
                            <div className="message-data">
                                <span className="message-data-time">10:12 AM, Today</span>
                            </div>
                            <div className="message my-message">Are we meeting today?</div>                                    
                        </li>                               
                        <li className="clearfix">
                            <div className="message-data">
                                <span className="message-data-time">10:15 AM, Today</span>
                            </div>
                            <div className="message my-message">Project has been already finished and I have results to show you.</div>
                        </li>
                    </ul>
                </div>
                <div className="chat-message clearfix">
                    <div className="input-group mb-0">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i className="fa fa-send"></i></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Enter text here..."/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>

	)
}
