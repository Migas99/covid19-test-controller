const jwt = require('jsonwebtoken');

const sessionMiddleware = (req, res, next) => {
	
	//check header or url parameters or post parametes for token
	var session = req.headers['x-access-token'];
	
	try {
		if (session) {
			const user = jwt.verify(session, process.env.TOKEN_SECRET);
			req.auth = user;
		} else {
			req.auth = null;
		}
	} catch (e) {
		req.auth = null;
	}

	next();
}

module.exports = sessionMiddleware;
