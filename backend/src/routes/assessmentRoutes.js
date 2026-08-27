const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const {createAssessment} = require('../controllers/assessmentController');

router.post('/', authMiddleware, createAssessment);

module.exports = router;