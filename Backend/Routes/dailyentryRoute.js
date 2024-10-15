const {Router} = require('express');
const {getUserEntryDetail,updateDailyEntry} = require('../Controller/dailyentryController')
const dailyentryRouter = Router();

dailyentryRouter.get('/getuserentry/:userId',getUserEntryDetail);
dailyentryRouter.post('/updateentry',updateDailyEntry);

module.exports = dailyentryRouter;



