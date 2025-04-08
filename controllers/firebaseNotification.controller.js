const httpStatus = require('http-status');
const {
	sendNotification,
	sendNotificationToMultipleDevices,
	// createNotificationPayload,
	// before30MinutesTitle,
	// before30MinutesBodyContent
} = require('../util/firebaseNotification');
const cron = require('node-cron');
const moment = require('moment');
// const { getConsumerDeviceByConsumerId } = require('../services/consumerDevice.service');
const config = require('../config');

const sentNotification = async (req, res) => {
	const notiMessageData = req.body;

	try {
		const responseData = await sendNotification(notiMessageData);
		if (responseData) {
			res.send({
				status: httpStatus.OK,
				data: responseData,
				message: 'Notification sent successfully'
			});
		}
	} catch (error) {
		res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
	}
};

const sendNotificationToAllUsers = async (req, res) => {
	const notiMessageData = req.body;

	try {
		const responseData = await sendNotificationToMultipleDevices(notiMessageData);
		if (responseData) {
			res.send({
				status: httpStatus.OK,
				data: responseData,
				message: 'Notification sent to all users successfully'
			});
		}
	} catch (error) {
		res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
	}
};

/*const schedulerNotification = async (req, res) => {
	const notiMessageData = req.body;
	// console.log('notiMessageData ', notiMessageData);

	try {
		const matchedConsumerDevices = await getConsumerDeviceByConsumerId(req.schemaName, notiMessageData?.consumerId);
		// console.log('matchedConsumerDevices ', matchedConsumerDevices);
		let lastConsumerDevice = matchedConsumerDevices[matchedConsumerDevices.length - 1];
		// console.log('lastConsumerDevice ', lastConsumerDevice);

		if (lastConsumerDevice) {
			const notificationObj = {
				title: before30MinutesTitle,
				body: before30MinutesBodyContent
			};

			const dataObj = {
				screen: String(notiMessageData?.screenName), // TODO
				redeemedId: String(notiMessageData?.redemptionDetails?.redeemedId) // TODO
			};

			const notificationPayload = await createNotificationPayload(lastConsumerDevice.token, notificationObj, dataObj);
			// console.log("notificationPayload ", notificationPayload)
			// Get system timezone dynamically
			const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			let endTime = notiMessageData?.redemptionDetails?.endTime;

			const notificationTime = moment.utc(endTime).subtract(config.app.schedulerNotificationTime, 'minutes');
			// console.log("notificationTime ", notificationTime)
			// Check if notification time is in the future
			// if (notificationTime.isAfter(currentTime)) {
			const cronTime = notificationTime.format('m H D M *'); // cron format: minute hour day month day-of-week
			// console.log("cronTime ", cronTime)
			if (cronTime) {
				res.send({
					status: httpStatus.OK,
					message: 'Scheduler set for notification'
				});

				cron.schedule(
					cronTime,
					async () => {
						console.log('Triggering notification');
						const result = await sendNotification(notificationPayload);
						console.log('RESULT ', result);
					},
					{ scheduled: true, timezone: systemTimeZone }
				);
			} else {
				res.send({
					status: httpStatus.BAD_REQUEST,
					data: responseData,
					message: 'Time is not correct'
				});
			}

			// } else {
			// 	res.send({
			// 		status: httpStatus.OK,
			// 		message: 'End time must be at least 2 minutes from now.'
			// 	});

			// 	console.log('End time must be at least 2 minutes from now.');
			// }
		}
	} catch (error) {
		console.log('Scheduler notification failed ', error);
		res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
	}
};

const thirtyMinutesNotificationContent = async (req, res) => {
	try {
		const lang = req.query.lang;
		let notificationContent =
			lang?.toLocaleLowerCase() === 'ar' ? config.thirtyMinutesNotiContentAR : config.thirtyMinutesNotiContentEN;
		if (notificationContent) {
			res.send({
				status: httpStatus.OK,
				data: notificationContent,
				message: 'Notification sent to all users successfully'
			});
		}
	} catch (error) {
		console.log('Thirty minutes notification content failed to fetch', error);
		res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
	}
};*/

module.exports = {
	sentNotification,
	sendNotificationToAllUsers,
	// schedulerNotification,
	// thirtyMinutesNotificationContent
};
