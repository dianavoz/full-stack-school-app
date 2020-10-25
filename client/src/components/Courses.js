import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';


// Retrieves and renders all courses.
export default class Courses extends Component {
	state ={
		courses: [],
	};
	
	// Gets all course data to save in state.
	componentDidMount() {
		const { context } = this.props;
		
		context.data.getCourses()
			.then(courses => {
				if (courses.message) {
					console.log(courses.message);
					this.props.history.push('/notfound');
				} else {
					this.setState({ courses })
				};
			})
			.catch((error) => {
				console.log(error);
				this.props.history.push('/error');
			});
	};

    render() {
	
		return (
			<React.Fragment>
			<hr></hr>
				<div className='bounds'>
					{this.state.courses.map((course)=>
						<CourseCard
						title={course.title}
						key={course.id}
						id={course.id}
						/>
					)}
					<div className='grid-33'>
						<Link className='course--module course--add--module' to='/courses/create'>
							<h3 className='course--add--title'>
								<svg version='1.1' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px'
									viewBox='0 0 13 13' className='add'>
									<polygon points='7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 '></polygon>
								</svg>New Course
							</h3>
						</Link>
					</div>
				</div>   
			</React.Fragment>
		);
    };
}