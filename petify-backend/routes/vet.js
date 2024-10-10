// routes/vetRoutes.js
const express = require('express');
const router = express.Router();
const vetController = require('../controllers/vetcontroller');

router.post('/apply', vetController.submitApplication);
router.put('/approve/:vetId', vetController.approveVet);
module.exports = router;
