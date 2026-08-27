const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const upload = require('../middlewares/uploadMiddleware');

const {createAssessment, uploadAssessmentFiles} = require('../controllers/assessmentController');

router.post('/', authMiddleware, createAssessment);

router.post("/:id/upload", authMiddleware, upload.fields([
    {
      name: "questionPaper",
      maxCount: 1,
    },
    {
      name: "answerSheet",
      maxCount: 1,
    },
  ]),
  uploadAssessmentFiles
);

module.exports = router;