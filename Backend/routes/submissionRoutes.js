const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', authMiddleware, roleMiddleware(['student']), upload, submissionController.submitAssignment);
router.get('/:assignment_id', authMiddleware, roleMiddleware(['teacher']), submissionController.getSubmissionsByAssignment);

module.exports = router;
