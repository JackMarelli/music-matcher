class User {
	username = "";
	answers = []
	r1 = "";
	r2 = "";
	r3= "";

	constructor (username = "", r1 = "", r2 = "", r3= "") {
		if (username) this.username = username;
        this.r1 = r1;
		this.r2 = r2;
        this.r3 = r3;
	}

}

export default User;