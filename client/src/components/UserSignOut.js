import React from 'react';
import { Redirect } from 'react-router-dom';

// Signs out the authenticated user and redirects the user to the default route.
export default ({ context }) => {
	context.actions.signOut();
	
	return (
		<Redirect to='/' />
	);
}
