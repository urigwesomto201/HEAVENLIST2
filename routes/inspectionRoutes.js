
const router = require('express').Router();
const  {scheduleInspection}= require('../controller/inspectionController');

router.post('/schedule/:tenantId/:listingId', scheduleInspection);

module.exports = router;