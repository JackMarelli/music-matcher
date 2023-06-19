class User {
	username = "";
	img = "";
    token = "";
    
    
    

	constructor (username = "", img = "", token = "", timeTokenCreation = null) {
		// console.log("New user constructed!");
		this.username = username;
        if (img)  this.img = img;

		this.token = token;
        if (timeTokenCreation) this.timeTokenCreation = timeTokenCreation;
	}

}

export default User;