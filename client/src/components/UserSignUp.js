import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ErrorsDisplay from './ErrorsDisplay';

// Allows a user to sign up by creating a new account,
export default class UserSignUp extends Component {
	state = {
		firstName: '',
		lastName: '',
		emailAddress: '',
		password: '',
		confirmPassword: '',
		errors: [],
	};

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

	// Checks if password and confirmPassword inputs match before submitting.
	checkPasswords = (event) => {
		event.preventDefault();

		const {
			password,
			confirmPassword,
		} = this.state; 

		if (password !== confirmPassword) {
			this.setState({ errors: [ 'Passwords do not match.' ] });
		} else {
			this.submit(event);
		};
	};

	// Saves new user data to database on submit.
	submit = (event) => {
		event.preventDefault();

		const { context } = this.props;
		const {
			firstName,
			lastName,
			emailAddress,
			password,
			confirmPassword,
		} = this.state; 
		const user = {
			firstName,
			lastName,
			emailAddress,
			password,
			confirmPassword
		};

		context.data.createUser(user)
			.then(error => {
				if (error.length) {
					this.setState({ errors: error });
				} else {
					console.log(`${emailAddress} is successfully signed up and authenticated!`);
					context.actions.signIn(emailAddress, password)
						.then(() => {
							this.props.history.push('/');    
						});
				};
			})
			.catch((error) => {
				console.log(error);
				this.props.history.push('/error')
			});
	};

	// Redirects user to the default route.
	cancel = (event) => {
		event.preventDefault();
		this.props.history.push('/');
	};

	render() {
		const {
			firstName,
			lastName,
			emailAddress,
			password,
			confirmPassword,
			errors,
		} = this.state;

		return (
			<div className='bounds'>
				<div className='grid-33 centered signin'>
					<h1>Sign Up</h1>
					<ErrorsDisplay errors={errors} />
					<div>
						<form onSubmit={this.checkPasswords}>
							<div>
								<input 
									id='firstName' 
									name='firstName' 
									type='text'
									className=''
									placeholder='First Name'
									value={firstName} 
									onChange={this.change} />
							</div>
							<div>
								<input 
									id='lastName' 
									name='lastName' 
									type='text'
									className=''
									placeholder='Last Name'
									value={lastName} 
									onChange={this.change} />
							</div>
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
							<div>
								<input 
									id='confirmPassword' 
									name='confirmPassword' 
									type='password'
									className=''
									placeholder='Confirm Password'
									value={confirmPassword} 
									onChange={this.change} />
							</div>
							<div className='grid-100 pad-bottom'>
								<button className='button' type='submit'>Sign Up</button>
								<button className='button button-secondary' id='cancel' onClick={this.cancel}>Cancel</button>
							</div>
						</form>
					</div>
					<p>&nbsp;</p>
					<p>Already have a user account? <Link to='/signin'>Click here</Link> to sign in!</p>
				</div>
			</div>
		);
	};
}
