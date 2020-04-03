class Push_Notifications {
	constructor(app_key, api_key) {
		const OneSignal = require('onesignal-node');
		this.api = new OneSignal.Client(app_key, api_key);
	}

	async push(title, body, to, key, notification_details, post) {
		let response;

		try {
			let notification = {
				headings: { en: title }, contents: { en: body }, include_external_user_ids: [to],
				data: { notification_data: notification_details, post_data: post, key: key }, large_icon: "http://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/email_logo.png"
			};

			response = await this.api.createNotification(notification);
			console.log(response.body.id);
		} catch (e) {
			if (e instanceof OneSignal.HTTPError) {
				// When status code of HTTP response is not 2xx, HTTPError is thrown.
				console.log(e.statusCode);
				console.log(e.body);

				return e.body;
			}
			response = e;
		}

		return response;
	}
}

module.exports = Push_Notifications;