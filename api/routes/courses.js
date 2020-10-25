const express = require('express');
const router = express.Router();
const { authenticateUser } = require('./middleware/authenticateUser');
const asyncHandler = require('./middleware/asyncHandler');
const { User, Course } = require('../models');

// GET the list of courses (including the user that owns each course).
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
		attributes: { 
			exclude: ['createdAt', 'updatedAt'] 
		},
		include: {
			model: User,
			as: 'user',
			attributes: ['id', 'firstName', 'lastName', 'emailAddress']
		}
	});
	
	if (courses.length > 0) {
		res.status(200).json(courses);
	} else {
		res.status(404).json({ message: 'No courses found.' });
	};
}));

// GET a specific course (including the user that owns the course).
router.get('/courses/:id', asyncHandler(async (req, res) => {
	const course = await Course.findByPk(req.params.id, {
		attributes: { 
			exclude: ['createdAt', 'updatedAt'] 
		},
		include: {
			model: User,
			as: 'user',
			attributes: ['id', 'firstName', 'lastName', 'emailAddress']
		},
	});
	
	if (course) {
		res.status(200).json(course);
	} else {
		res.status(404).json({ message: 'Course not found.' });
	};
}));

// POST a new course to the database (only if current user is authenticated).
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {	
	try {
		const course = await Course.create(req.body);

		res.status(201).location('/api/courses/' + course.id).end();
	} catch (error) {
		if (error.name === 'SequelizeValidationError') {
			const errorMsg = [];

			error.errors.map((err) => errorMsg.push(err.message));
			res.status(400).json({ error: errorMsg });
		} else {
			next(error);
		};
	};
}));

// PUT a course's updates in the database (only if current user is authenticated).
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {	
	const currentUserId = req.currentUser.dataValues.id;
	const course = await Course.findByPk(req.params.id, {
		include: {
			model: User,
			as: 'user'
		}
	});

	if (course) {
		if (course.dataValues.userId === currentUserId) {
			try {
				const [updated] = await Course.update(req.body, {
					where: {id: req.params.id}
				});

				if (updated) {
					res.status(204).end();
				} else {
					res.status(400).json({ message: 'No data entered. Please enter data to update.' });
				};
			} catch (error) {
				if (error.name === 'SequelizeValidationError') {
					const errorMsg = [];
		
					error.errors.map((err) => errorMsg.push(err.message));
					res.status(400).json({ error: errorMsg });
				} else {
					next(error);
				};
			};
		} else {
			res.status(403).json({ message: 'User not authorized to make changes to this course.' });
		};
	} else {
		res.status(404).json({ message: 'Course not found.' });
	};
}));

// DELETE a course from the database (only if current user is authenticated).
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {	
	const currentUserId = req.currentUser.dataValues.id;
	const course = await Course.findByPk(req.params.id, {
		include: {
			model: User,
			as: 'user'
		}
	});

	if (course) {
		if (course.dataValues.userId === currentUserId) {
			await course.destroy();
			res.status(204).end();
		} else {
			res.status(403).json({ message: 'User not authorized to make changes to this course.' });
		};
	} else {
		res.status(404).json({ message: 'Course not found.' });
	};
}));

module.exports = router;