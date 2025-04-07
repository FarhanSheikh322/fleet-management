/********************************************************/
/***** Require Firebase *****/
/********************************************************/
const { firebase } = require('../firebase/index');

const before30MinutesTitle = "You have only 30 minutes left" 
const before30MinutesBodyContent = `You have 30 min left for your parking time to end. If you wish to continue please pay separatly for additonal charges`
					 

const createNotificationPayload = async (token, notiObj, dataObj, imgUrl) => {
	try {
		const singleNotificationPayload = {
			token: token,
			notification: notiObj,
			data: dataObj,
			android: {
				notification: {
					imageUrl: imgUrl
						? imgUrl
						: 'https://zapspremiumblobstorage.blob.core.windows.net/image/1727523174-Screenshot_2.jpg'
				}
			},
			apns: {
				payload: {
					aps: {
						alert: {...notiObj},
						'mutable-content': 1,
						category: 'NEW_LOCATION',
						badge: 1
					}
				},
				fcm_options: {
					image: imgUrl
						? imgUrl
						: 'https://zapspremiumblobstorage.blob.core.windows.net/image/1727523174-Screenshot_2.jpg'
				}
			}
		};

		return singleNotificationPayload;
	} catch (error) {
		console.log("Notification payload not created ", error)
		throw error
	}
};

const sendNotification = async (notificationPayload) => {
	// console.log('~~~~~ notificationPayload ~~~~~ ', notificationPayload);

	const result = await firebase
		.messaging()
		.send(notificationPayload)
		.then((response) => {
			console.log('notification sent successfully ', response);
			return response;
		})
		.catch((error) => {
			console.log('notification failed ', error.errorInfo);
			return error.errorInfo.code 

			// if (error.errorInfo.code === 'messaging/registration-token-not-found') {
			// 	console.log('Invalid or expired token: ', notificationPayload.token);
			// 	return error.errorInfo.message 
			// } else {
			// 	console.log('notification failed ', error.errorInfo.message);
			// }
	
		});

	console.log('result... ', result);

	return result;
};

const messageForTopics = {
	notification: {
		title: 'Hello Everyone!',
		body: 'This is a generic notification sent to all users.'
	},
	topic: 'all'
};

const sendNotificationToMultipleDevices = async (messagePayload) => {
	console.log('messagePayload ', messagePayload);
	const result = await firebase
		.messaging()
		.send(messagePayload)
		.then((response) => {
			console.log('notification sent successfully ', response);
			return response;
		})
		.catch((error) => {
			console.log('notification failed ', error);
		});

	console.log('result... ', result);

	return result;
};

// const registrationToken =
// 	'eGZ9nMbfS-SxnHpv_RTs4D:APA91bFaCGkNP_5byPwVJifYVKSZNido7TtBKHzn5Qt6KjOVDDltE1PPGI6cOhqgGNaIO4aORpnQSXP5qWz_pozHEmoQ-VcqEGrzdJbglD1zQFqJbZcxn6wB6i04YEAnZopAGt7NpJih';

module.exports = {
	// before30MinutesTitle,
	// before30MinutesBodyContent,
	// createNotificationPayload,
	sendNotification,
	sendNotificationToMultipleDevices
};
