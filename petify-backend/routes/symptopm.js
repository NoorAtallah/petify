const express = require('express');
const router = express.Router();
const { checkSymptoms, getDiagnosis } = require('../controllers/symptomcontroller');

// POST route to check symptoms
router.post('/check-symptoms', checkSymptoms);
router.post('/get-diagnosis', getDiagnosis);
module.exports = router;
