'use strict';

// Load modules.
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const usersRoute = require('./routes/users')
const coursesRoute = require('./routes/courses')

// Variable to enable global error logging.
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Create the Express app.
const app = express();

// Set up morgan which provides http request logging.
app.use(morgan('dev'));

// Enable all CORS Requests.
app.use(cors());

// Set up request body JSON parsing.
app.use(express.json());

// Set api routes for users and courses.
app.use('/api', usersRoute);
app.use('/api', coursesRoute);

// Set a friendly greeting for the root route.
app.get('/', (req, res) => {
	res.json({
		message: 'Welcome to my REST API project!',
	});
});

// Catch 404 errors to pass to global handler.
app.use((req, res) => {
	res.status(404).json({
		message: 'Route Not Found',
	});
});

// Global error handler.
app.use((err, req, res, next) => {
	if (enableGlobalErrorLogging) {
		console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
	};

	res.status(err.status || 500).json({
		message: err.message,
		error: {},
	});
});

module.exports = app;
