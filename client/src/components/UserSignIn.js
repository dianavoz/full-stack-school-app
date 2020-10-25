import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ErrorsDisplay from './ErrorsDisplay';

// Allows a user to sign in with proper credentials.
export default class UserSignIn extends Component {
	state = {
		emailAddress: '',
		password: '',
		errors: []
	}

	// Saves input data to state.
	change = (event) => {
		const name = event.target.name;
		const value = event.target.value;

		this.setState(() => {
			return {
				[name]: value
			};
		});
	};

	// Signs a user in on submit, or displays errors.
	submit = (event) => {
		event.preventDefault();

		const { context } = this.props;
		const { from } = this.props.location.state || { from: { pathname: '/' } };
		const { 
			emailAddress, 
			password 
		} = this.state;
		
		context.actions.signIn(emailAddress, password)
			.then(user => {
				if (user === null) {
					this.setState(() => {
						return { errors: [ 'Sign-in was unsuccessful.' ] };
					});
				} else {
					console.log(`${emailAddress} is now signed in!`);
					this.props.history.push(from);
				}
			})
			.catch((error) => {
				console.log(error);
				this.props.history.push('/error');
			})
	};

	// Redirects user to the default route.
	cancel = (event) => {
		event.preventDefault();
		this.props.history.push('/');
	};

	render() {
		const {
			emailAddress,
			password,
			errors,
		} = this.state;

		return (
			<div className='bounds'>
				<div className='grid-33 centered signin'>
					<h1>Sign In</h1>
					<ErrorsDisplay errors={errors} />
					<div>
						<form onSubmit={this.submit}>
							<div>
								<input 
									id='emailAddress' 
									name='emailAddress' 
									type='text'
									className=''
									placeholder='Email Address'
									value={emailAddress} 
									onChange={this.change} />
							</div>
							<div>
								<input 
									id='password' 
									name='password' 
									type='password'
									className=''
									placeholder='Password'
									value={password} 
									onChange={this.change} />
							</div>
							<div className='grid-100 pad-bottom'>
								<button className='button' type='submit'>Sign In</button>
								<button className='button button-secondary' id='cancel' onClick={this.cancel}>Cancel</button>
							</div>
						</form>
					</div>
					<p>&nbsp;</p>
					<p>Don't have a user account? <Link to='/signup'>Click here</Link> to sign up!</p>
				</div>
			</div>
		);
	};
}
