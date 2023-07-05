class User {
	username = "";
	r1 = "";
	r2 = "";
	r3= "";
	// todo: domande a vettore

	constructor (username = "", r1 = "", r2 = "", r3= "") {
		if (username) this.username = username;
        if (r1) this.r1 = r1;
		if (r2) this.r2 = r2;
        if (r3) this.r3 = r3;
	}

}

export default User;