const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const User = require('../../models').User;

// Middleware to authenticate the request using Basic Authentication.
async function authenticateUser(req, res, next) {
	let message = null;

	// Parse the user's credentials from the Authorization header.
	const credentials = auth(req);

	if (credentials) {
		// Attempt to retrieve the user from the database by their username.
		const user = await User.findOne({
			where: {
			  	emailAddress: credentials.name
			}
		});

		// If a user was successfully retrieved from the data store...
		if (user) {
			// Compare the user's password (from the Auth header) to the user's password from the db.
			const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

			// If the passwords match...
			if (authenticated) {
				// Store the retrieved user object on the request object.
				req.currentUser = user;
			} else {
				message = `Authentication failure for username: ${user.emailAddress}`;
			}
		} else {
			message = `User not found for username: ${credentials.name}`;
		}
	} else {
		message = 'Auth header not found';
	}

	if (message) {
		// If user authentication failed, return response with 401 Unathorized status code.
		console.warn(message);
		res.status(401).json({ message: 'Access Denied' });
	} else {
		// If user authentication succeeded, then proceed.
		next();
	}
};

module.exports = { authenticateUser };