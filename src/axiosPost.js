const axios = require('axios');

exports.post = async (url, data, headers = {}, options = {}, printBody = false) => {
	try {
		url = 'https://chat-dev.elevate-apis.shikshalokam.org' + url;
		const config = {
			headers,
			...options,
		};
		if (printBody) {
			console.log(data, config);
		}
		const response = await axios.post(url, data, config);
		console.log(`Request to ${url} succeeded with status ${response.status}`);
		return {
			success: true,
			status: response.status,
			data: response.data,
		};
	} catch (err) {
		if (err.response) {
			console.error(`Request to ${url} failed with status ${err.response.status}: ${err.response.statusText}`);
			return {
				success: false,
				status: err.response.status,
				error: err.response.data,
			};
		} else if (err.request) {
			console.error(`No response received for request to ${url}.`);
		} else {
			console.error(`Error setting up request to ${url}: ${err.message}`);
		}
		return {
			success: false,
			error: 'An unexpected error occurred.',
		};
	}
};

exports.get = async (url, headers = {}, options = {}, printBody = false) => {
	try {
		// Prepend the base URL to the request URL
		url = 'https://chat-dev.elevate-apis.shikshalokam.org' + url;

		// Assemble the configuration for the request
		const config = {
			headers,
			...options,
		};

		// If printBody flag is true, log the config (headers and options)
		if (printBody) {
			console.log(config);
		}

		// Perform the HTTP GET request
		const response = await axios.get(url, config);

		// Log success status
		console.log(`Request to ${url} succeeded with status ${response.status}`);

		// Return a success object similar to the post function
		return {
			success: true,
			status: response.status,
			data: response.data,
		};
	} catch (err) {
		// Handle errors similar to the post function
		if (err.response) {
			console.error(`Request to ${url} failed with status ${err.response.status}: ${err.response.statusText}`);
			return {
				success: false,
				status: err.response.status,
				error: err.response.data,
			};
		} else if (err.request) {
			console.error(`No response received for request to ${url}.`);
		} else {
			console.error(`Error setting up request to ${url}: ${err.message}`);
		}
		return {
			success: false,
			error: 'An unexpected error occurred.',
		};
	}
};
