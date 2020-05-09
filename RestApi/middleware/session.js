const jwt = require('jsonwebtoken')

const sessionMiddleware = (req, res, next) => {
    const session = req.cookies.authToken;
    
	try {
		if (session) {
            const user = jwt.verify(session, process.env.TOKEN_SECRET)
			req.auth = user;
		} else {
			req.auth = null
		}
	} catch(e) {
		req.auth = null
    }
    
	next()
}

module.exports = sessionMiddleware
