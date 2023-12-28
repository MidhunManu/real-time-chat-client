import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';

const Avatars = () => {
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/showAvatars')
      .then((response) => response.json())
      .then((data) => setAvatars(data))
      .catch((error) => console.error('Error fetching avatars:', error));
  }, []);

  const handleAvatarSelection = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleLetsGoClick = (avatar_id) => {
    console.log("Let's Go button clicked!");
  };

  return (
    <form>
      <div className="container mt-4">
        <h2 className="mb-4">Choose Your Avatar</h2>
        <div className="d-flex flex-nowrap">
          {avatars.map((avatar) => (
            <div
              key={avatar.a_id}
              className={`card mr-3 ${selectedAvatar === avatar ? 'border-primary' : ''}`}
              style={{ width: '12rem', cursor: 'pointer' }}
              onClick={() => handleAvatarSelection(avatar)}
            >
              <img src={avatar.avatar_url} className="card-img-top" alt={avatar.avatar_name} />
              <div className="card-body">
                <h5 className="card-title">{avatar.avatar_name}</h5>
              </div>
            </div>
          ))}
        </div>
        {selectedAvatar && (
          <div className="mt-4 d-flex align-items-center">
            <div className="mr-3">
              <h4>Selected Avatar:</h4>
              <div className="card" style={{ width: '12rem' }}>
                <img src={selectedAvatar.avatar_url} className="card-img-top" alt={selectedAvatar.avatar_name} />
                <div className="card-body">
                  <h5 className="card-title">{selectedAvatar.avatar_name}</h5>
                </div>
              </div>
            </div>
            <button className="btn btn-primary ml-3 mx-5" onClick={async (e) => {
				e.preventDefault();
				console.log(selectedAvatar.avatar_name)
				console.log(Cookies.get("current_user"));

				try {
					const selectionRes = await fetch("http://localhost:8080/api/v1/setAvatar", {
						method: "post",
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify(
							{
								"username": Cookies.get("current_user"),
								"avatar": selectedAvatar.avatar_url
							}
						)
					})

					if(selectionRes.ok) {
						console.log("done");
						document.location.href = "/home"
					}
					else {
						console.log("not done");
					}
				}
				catch(err) {
					console.error(`avatar selection error : ${err}`);
				}
			}}>
				
              Let's Go
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default Avatars;

