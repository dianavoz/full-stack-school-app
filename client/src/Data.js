
// Contains methods used to fetch data from the REST API.
export default class Data {
	// Makes the requests to the REST API.
	api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
		const url = 'http://localhost:5000/api' + path;
		const options = {
			method,
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		};

		if (body !== null) {
			options.body = JSON.stringify(body);
		};

		if (requiresAuth) {    
			const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);

			options.headers['Authorization'] = `Basic ${encodedCredentials}`;
		};

		return fetch(url, options);
	};

	// --- USER DATA --- //

	// GET user credentials from the database.
	async getUser(emailAddress, password) {
		const response = await this.api(`/users`, 'GET', null, true, { emailAddress, password });
		
		if (response.status === 200) {
			return response.json().then(data => data);
		} else if (response.status === 401) {
			return null;
		} else {
			throw new Error();
		};
	};
  
	// POST new user info to the database.
	async createUser(user) {
		const response = await this.api('/users', 'POST', user);
		
		if (response.status === 201) {
			return [];
		} else if (response.status === 400) {
			return response.json().then(data => {
				return data.error;
			});
		} else {
			throw new Error();
		};
	};

	// --- COURSE DATA --- //

	// GET all courses data from the database.
	async getCourses() {
		const response = await this.api('/courses', 'GET');
		
		if (response.status === 200) {
			return response.json().then(data => data);
		} else if (response.status === 404) {
			return response.json().then(data => {
				return data;
			});
		} else {
			throw new Error();
		};
	};

	// GET a course's data from the database.
	async getCourse(courseId) {
		const response = await this.api(`/courses/${courseId}`, 'GET');
		
		if (response.status === 200) {
			return response.json().then(data => data);
		} else if (response.status === 404) {
			return response.json().then(data => {
				return data;
			});
		} else {
			throw new Error();
		};
	};

	// POST a new course's data to the database.
	async createCourse(course, emailAddress, password) {
		const response = await this.api('/courses', 'POST', course, true, { emailAddress, password });
		
		if (response.status === 201) {
			return [];
		} else if (response.status === 400) {
			return response.json().then(data => {
				return data.error;
			});
		} else {
			throw new Error();
		};
	};

	// PUT an existing course's updates in the database.
	async updateCourse(courseId, course, emailAddress, password) {
		const response = await this.api(`/courses/${courseId}`, 'PUT', course, true, { emailAddress, password });
		
		if (response.status === 204) {
			return [];
		} else if (response.status === 400) {
			return response.json().then(data => {
				return data.error;
			});
		} else {
			throw new Error();
		};
	};

	// DELETE a course from the database.
	async deleteCourse(courseId, emailAddress, password) {
		const response = await this.api(`/courses/${courseId}`, 'DELETE', null, true, { emailAddress, password });
		
		if (response.status === 204) {
			return [];
		} else if (response.status === 403) {
			return response.json().then(data => {
				return data.error;
			});
		} else {
			throw new Error();
		};
	};
}