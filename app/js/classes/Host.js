class Host {
	id = "";
	username = "";
	img = "";
    token = "";

	constructor (id= "", username = "", img = "", token = "", timeTokenCreation = null) {
		this.id = id;
		this.username = username;
        this.img = img;
		if (token) this.token = token;
        if (timeTokenCreation) this.timeTokenCreation = timeTokenCreation;
	}
}

export default Host;