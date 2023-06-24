class User {
	id = "";
	username = "";
	img = "";
    token = "";

	constructor (id= "", username = "", img = "", token = "", timeTokenCreation = null) {
		// console.log("New user constructed!");
		if (id) this.id = id;
		if (username) this.username = username;
        if (img) this.img = img;
		if (token) this.token = token;
        if (timeTokenCreation) this.timeTokenCreation = timeTokenCreation;
	}

}

export default User;