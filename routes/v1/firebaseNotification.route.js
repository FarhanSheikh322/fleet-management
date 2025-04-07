const express = require('express');

const firebaseNotiController = require('../../controllers/firebaseNotification.controller.js');
const router = express.Router();


router.route('/').post(firebaseNotiController.sentNotification);
// router.route('/thirty-minutes-notification-content').get(firebaseNotiController.thirtyMinutesNotificationContent)

router.route('/send-to-all-users').post(firebaseNotiController.sendNotificationToAllUsers);
// router.route('/scheduler-notification').post(firebaseNotiController.schedulerNotification)


module.exports = router;
