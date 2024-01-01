import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

export default function Messager() {
	const [userList, setUserList] = useState([]);
	const [header, setHeader] = useState({
		username: "",
		user_avatar: "",
	});
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState('');
	const [currentConversation, setCurrentConversation] = useState(null);
	const stompClientRef = useRef(null);
	const [currentUserId, setCurrentUserId] = useState(0);

	useEffect(() => {
		async function getUserList() {
			try {
				const response = await fetch("http://localhost:8080/api/v1/showUsers");
				const json = await response.json();

				if (response.ok) {
					setUserList(json);
				}
			} catch (err) {
				console.error(err);
			}
		}
		getUserList();
	}, []);

	useEffect(() => {
		async function setDefaultHeader() {
			if (!header.username) {
				const currentUserName = Cookies.get("current_user");
				const currentUserAvatar = await getSpecificUser(currentUserName);
				setHeader({
					"username": currentUserName,
					"user_avatar": currentUserAvatar,
				});
			}
		}
		setDefaultHeader();
	}, [header]);

	useEffect(() => {
		const socket = new SockJS('http://localhost:8080/ws');
		const client = Stomp.over(socket);

		client.connect({}, () => {
			stompClientRef.current = client;

			const subscription = client.subscribe('/topic/messages', (message) => {
				const receivedMessage = JSON.parse(message.body);
				setMessages((prevMessages) => [...prevMessages, receivedMessage]);
			});

			return () => {
				if (subscription) {
					subscription.unsubscribe();
				}

				if (stompClientRef.current && stompClientRef.current.connected) {
					stompClientRef.current.disconnect();
				}
			};
		});
	}, []);

	useEffect(() => {
		if (currentConversation) {
			const privateSubscription = stompClientRef.current.subscribe(`/user/${currentConversation}/topic/messages`, (message) => {
				const receivedMessage = JSON.parse(message.body);
				setMessages((prevMessages) => [...prevMessages, receivedMessage]);
			});

			return () => {
				if (privateSubscription) {
					privateSubscription.unsubscribe();
				}
			};
		}
	}, [currentConversation]);

	useEffect(() => {
		async function fetchCurrentUser() {
			try {
				const username = Cookies.get("current_user");
				const response = await fetch(`http://localhost:8080/api/v1/getAllDetails?username=${username}`);
				const json = await response.json();	
				console.log(json);
				setCurrentUserId(json.u_id);
			}
			catch(err) {
				console.log(`erro fetching current user id : ${err}`);
			}
		}
		fetchCurrentUser();
	}, [])



	async function getSpecificUser(username) {
		try {
			const response = await fetch(`http://localhost:8080/api/v1/specificUser?username=${username}`);
			const json = await response.json();
			return json.user_avatar;
		} catch (err) {
			console.log(`specific user fetching error\n${err}`);
		}
	}

	async function getUserId(username) {
		try {
			const response = await fetch(`http://localhost:8080/api/v1/getUserIdJson?username=${username}`);
			const response_json = await response.json();
			if (response.ok) {
				return response_json.userId;
			} else {
				console.log(response.body);
			}
		} catch (err) {
			console.log(`error fetching user id : ${err}`);
		}
	}


	function handleMessageChange(e) {
		setMessage(e.target.value);
	}

	async function sendMessage() {
		if (message.trim()) {
			const username = Cookies.get("current_user");
			const senderId = await getUserId(username);
			const conversationId = currentConversation;

			const chatMessage = {
				senderId,
				messageContent: message,
				connectionId: conversationId
			};

			if (stompClientRef.current && stompClientRef.current.connected) {
				if (currentConversation) {
					stompClientRef.current.send(`/app/chat/${currentConversation}`, {}, JSON.stringify(chatMessage));
				} else {
					stompClientRef.current.send("/app/chat", {}, JSON.stringify(chatMessage));
				}
				setMessage('');
			}
		}
	}

	async function setUpConversation(senderName, receiverName) {
		try {
			const response = await fetch(`http://localhost:8080/api/v1/getConversationId?user1=${senderName}&user2=${receiverName}`);
			const json = await response.json();
			setCurrentConversation(json.get_conversation_by_id);
		} catch (err) {
			console.error(`error fetching conversation : ${err}`);
		}
	}

	console.log(currentUserId + "is the user id");
	
  return (
    <div className="container">
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card chat-app">
            <div id="plist" className="people-list">
              <ul className="list-unstyled chat-list mt-2 mb-0">
                {userList.map((user) => (
                  <li key={user.username} className="clearfix" onClick={() => {
                    setHeader({
                      "username": user.username,
                      "user_avatar": user.user_avatar,
                    });
                    const currentUser = Cookies.get("current_user");
                    setUpConversation(currentUser, user.username);
                  }}>
                    <img src={user.user_avatar} alt="img" />
                    <div className="about">
                      <div className="name">{user.username}</div>
                      <div className="status"> <i className="fa fa-circle offline"></i> left 7 mins ago </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="chat">
              <div className="chat-header clearfix">
                <div className="row">
                  <div className="col-lg-6">
                    <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                      <img src={header.user_avatar} alt="avatar" />
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
				{messages.map((msg) => (
					<li key={msg.messageId} className="clearfix">
						<div className={`message-data ${msg.senderId === currentUserId ? 'text-right' : 'text-left'}`}>
						</div>
						<div className={`message ${msg.senderId === currentUserId ? 'other-message float-right' : 'own-message float-left'}`}>
						{msg.messageContent}
						</div>
					</li>
				))}
			</ul>

	
              </div>
              <div className="chat-message clearfix">
                <div className="input-group mb-0">
                  <div className="input-group-prepend">
                    <button className="input-group-text" onClick={sendMessage}><i className="fa fa-send"></i></button>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter text here..."
                    value={message}
                    onChange={handleMessageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

