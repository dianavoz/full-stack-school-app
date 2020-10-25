import React, { Component } from 'react';
import ErrorsDisplay from './ErrorsDisplay';

// Create a new course, if user is signed in and authenticated.
export default class CreateCourse extends Component {
	state ={
		title: '',
		description: '',
		estimatedTime: '',
		materialsNeeded: '',
		userId: '',
		errors: []
	};

	// Gets the authUser's id 
	componentDidMount() {
		const { context } = this.props;
		const authUser = context.authenticatedUser;

		this.setState({ 
			userId: authUser.id
		});
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

	// Saves new course data to database on submit
	submit = (event) => {
		event.preventDefault();

		const { context } = this.props;
		const authUser = context.authenticatedUser;
		const emailAddress = authUser.emailAddress;
		const password = context.unhashedPassword;
		const { 
			title,
			description,
			estimatedTime,
			materialsNeeded,
			userId
		} = this.state;
		const course = {
			title,
			description,
			estimatedTime,
			materialsNeeded,
			userId
		};

		context.data.createCourse(course, emailAddress, password)
			.then(error => {
				if (error.length) {
					this.setState({ errors: error });
				} else {
					console.log(`${title} is successfully added!`);
					this.props.history.push('/');    
				};
			})
			.catch((error) => {
				console.log(error);
				this.props.history.push('/error')
			});
	};

	cancel = (event) => {
		event.preventDefault();
		this.props.history.push('/');
	};

    render() {
		const { 
			title,
			description,
			estimatedTime,
			materialsNeeded,
			errors
		} = this.state;
		const { context } = this.props;
		const authUser = context.authenticatedUser;

		return (
			<React.Fragment>
				<hr></hr>
					<div className='bounds course--detail'>
						<h1>Create Course</h1>
						<ErrorsDisplay errors={errors} />
						<div>
							<form onSubmit={this.submit}>
								<div className='grid-66'>
									<div className='course--header'>
										<h4 className='course--label'>Course</h4>
										<div>
											<input 
												id='title' 
												name='title' 
												type='text' 
												className='input-title course--title--input' 
												placeholder='Course title...'
                    							value={title}
												onChange={this.change} />
										</div>
										<p>By {authUser.firstName} {authUser.lastName}</p>
									</div>
									<div className='course--description'>
										<div>
											<textarea 
												id='description' 
												name='description' 
												className='' 
												placeholder='Course description...'
												value={description}
												onChange={this.change} />
										</div>
									</div>
								</div>
								<div className='grid-25 grid-right'>
									<div className='course--stats'>
										<ul className='course--stats--list'>
											<li className='course--stats--list--item'>
												<h4>Estimated Time</h4>
												<div>
													<input 
														id='estimatedTime' 
														name='estimatedTime' 
														type='text' 
														className='course--time--input'
                        								placeholder='Hours' 
														value={estimatedTime}
														onChange={this.change} />
												</div>
											</li>
											<li className='course--stats--list--item'>
												<h4>Materials Needed</h4>
												<div>
													<textarea 
														id='materialsNeeded' 
														name='materialsNeeded' 
														className='' 
														placeholder='List materials...'
														value={materialsNeeded}
														onChange={this.change}  />
												</div>
											</li>
										</ul>
									</div>
								</div>
								<div className='grid-100 pad-bottom'>
									<button className='button' type='submit'>Create Course</button>
									<button className='button button-secondary' id='cancel' onClick={this.cancel}>Cancel</button>
								</div>
							</form>
						</div>
					</div>
			</React.Fragment>
		);
    };
}
