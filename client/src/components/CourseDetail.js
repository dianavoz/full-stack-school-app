import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

// Retrieves and renders a course's details.
export default class CourseDetail extends Component {
	state ={
		course: '',
		user: ''
	};
	
	// Gets the specific course's details to save in state.
	componentDidMount() {
		const { context } = this.props;
		
		context.data.getCourse(this.props.match.params.id)
			.then(course => {
				if (course.message) {
					console.log(course.message);
					this.props.history.push('/notfound');
				} else {
					this.setState({ 
						course, 
						user: course.user
					});
				};
			})
			.catch((error) => {
				console.log(error);
				this.props.history.push('/error');
			});
	};

	// Deletes course data from the database.
	deleteCourse = () => {
		const { context } = this.props;
		const password = context.unhashedPassword;
		const authUser = context.authenticatedUser;
		const emailAddress = authUser.emailAddress;
	
		context.data.deleteCourse(this.props.match.params.id, emailAddress, password)
			.then(error => {
				if (error.length) {
					this.props.history.push('/forbidden');
				} else {
					console.log('The course is successfully deleted!');
					this.props.history.push('/');
				};
			})
			.catch(() => {
				this.props.history.push('/error')
			});	
	};

    render() {
		const { 
			course, 
			user
		} = this.state;

		const { context } = this.props;
		const authUser = context.authenticatedUser;

		return (
			<React.Fragment>
				<hr></hr>
				<div>
				{authUser && authUser.id === user.id ?
					<div className='actions--bar'>
						<div className='bounds'>
							<div className='grid-100'>
								<span>
									<Link className='button' to={`${course.id}/update`}>Update Course</Link>
									<button className='button' onClick={this.deleteCourse}>Delete Course</button>
									<Link className='button button-secondary' to={'/'}>Return to List</Link>
								</span>
							</div>
						</div>
					</div>
				:
					<div className='actions--bar'>
						<div className='bounds'>
							<div className='grid-100'>
								<span>
								<Link className='button button-secondary' to={'/'}>Return to List</Link>
								</span>
							</div>
						</div>
					</div>
				}
					<div className='bounds course--detail'>
						<div className='grid-66'>
							<div className='course--header'>
								<h4 className='course--label'>Course</h4>
								<h3 className='course--title'>{course.title}</h3>
								<p>By {user.firstName} {user.lastName}</p>
							</div>
							<div className='course--description'>
								<ReactMarkdown>
									{course.description}
								</ReactMarkdown>
							</div>
						</div>
						<div className='grid-25 grid-right'>
							<div className='course--stats'>
								<ul className='course--stats--list'>
									<li className='course--stats--list--item'>
										<h4>Estimated Time</h4>
										{course.estimatedTime ?
										<h3>{course.estimatedTime}</h3>
										:
										<h3>No estimated time</h3>
										}
									</li>
									<li className='course--stats--list--item'>
										<h4>Materials Needed</h4>
										{course.materialsNeeded ?
										<ReactMarkdown>
											{course.materialsNeeded}
										</ReactMarkdown>
										:
										<h3>No materials needed</h3>
										}
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
    };
}
