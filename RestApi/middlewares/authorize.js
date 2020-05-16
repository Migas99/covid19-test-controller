const authorizeBasedOnRoles = (opts) => {

	opts = opts || []
	return (req, res, next) => {

		if (!req.auth) {
			return res.status(401).send('Not authenticated!');
		}

		const hasAuthorization = opts.includes(req.auth.role);
		if (hasAuthorization) {
			next();
		} else {
			return res.status(403).send('Not authorized!');
		}
	}
};

const authorizeBasedOnRolesAndUserId = (opts) => {
	opts = opts || []

	return (req, res, next) => {

		if (!req.auth) {
			return res.status(401).send('Not authenticated!');
		}

		const hasAuthorization = opts.includes(req.auth.role);

		if (hasAuthorization) {
			next();
		} else {
			if (req.params.userId == req.auth.id) {
				next();
			} else {
				return res.status(403).send('Not authorized!');
			}
		}
	}
};

module.exports.authorizeBasedOnRoles = authorizeBasedOnRoles;
module.exports.authorizeBasedOnRolesAndUserId = authorizeBasedOnRolesAndUserId;