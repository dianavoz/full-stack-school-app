import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './components/Header';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import PrivateRoute from './PrivateRoute';
import withContext from './Context';
import Forbidden from './components/Forbidden';
import NotFound from './components/NotFound';
import Error from './components/Error';

// Connect the components to context.
const HeaderWithContext = withContext(Header);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const CoursesWithContext = withContext(Courses);
const CourseDetailWithContext = withContext(CourseDetail);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);

export default () => (
	<Router>
		<div>
			<HeaderWithContext />
			<Switch>
				<Route exact path='/' component={CoursesWithContext}/>
				<PrivateRoute exact path='/courses/create' component={CreateCourseWithContext}/>
				<Route exact path='/courses/:id' component={CourseDetailWithContext}/>
				<PrivateRoute exact path='/courses/:id/update' component={UpdateCourseWithContext}/>

				<Route path='/signup' component={UserSignUpWithContext} />
				<Route path='/signin' component={UserSignInWithContext} />
				<Route path='/signout' component={UserSignOutWithContext} />

				<Route path='/forbidden' component={Forbidden} />
				<Route path='/error' component={Error} />
				<Route path='/notfound' component={NotFound} />
				<Route component={NotFound} />
			</Switch>
		</div>
	</Router>
);
