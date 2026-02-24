const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(['teacher']), assignmentController.createAssignment);
router.get('/', authMiddleware, assignmentController.getAllAssignments);
router.get('/:id', authMiddleware, assignmentController.getAssignmentById);

module.exports = router;
