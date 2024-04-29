const { post, get } = require('./axiosPost');
const { urnGenerator } = require('./uniqueRandomNumberGenerator');

const registerUser = async ({ username, email, pass = 'password', name }: any) => {
	try {
		const url = '/api/v1/users.register';
		return await post(url, { username, email, pass, name });
	} catch (err) {
		console.log(err);
	}
};

const login = async ({ user, password }: any) => {
	try {
		const url = '/api/v1/login';
		return await post(url, { user, password });
	} catch (err) {
		console.log(err);
	}
};

/* {
    "msg": "method",
    "id": "32",
    "method": "getRoomByTypeAndName",
    "params": ["d", "rogersmith"]
  } */

const getRoomByTypeAndName = async (currentUser: any, targetUser: any) => {
	try {
		const url = '/api/v1/method.call/getRoomByTypeAndName';
		return await post(
			url,
			{
				msg: 'method',
				id: await urnGenerator.generateUniqueRandomNumber(1, 9999999),
				method: 'getRoomByTypeAndName',
				params: ['d', targetUser.username],
				message: 'Request to get room by type and name',
			},
			{
				'X-Auth-Token': currentUser.authToken,
				'X-User-Id': currentUser._id,
			},
			{},
			true
		);
	} catch (err) {
		console.log(err);
	}
};

const getRoomNameExists = async (currentUser: any, roomName: any) => {
	try {
		const url = `/api/v1/rooms.nameExists?roomName=${encodeURIComponent(roomName)}`;
		return await get(
			url,
			{
				'X-Auth-Token': currentUser.authToken,
				'X-User-Id': currentUser.userId,
				Cookie: `rc_uid=${currentUser.userId}; rc_token=${currentUser.authToken}`,
				Referer: `https://chat-dev.elevate-mentoring.shikshalokam.org/group/${roomName}`,
			}, // Assuming this is where body/content would go, but GET requests typically don't have a body.
			{},
			false // Assuming the last parameter dictates whether it's a POST request, so set to false for GET
		);
	} catch (err) {
		console.error(err);
	}
};

const createGroup = async ({ authToken, userId }: any, groupName: any, members: any, readOnly: any, extraData: any) => {
	try {
		const url = '/api/v1/groups.create';
		const data = {
			name: groupName,
			members: members,
			readOnly: readOnly,
			extraData: extraData,
		};

		//console.log(data);

		const headers = {
			'Content-Type': 'application/json',
			Cookie: `rc_uid=${userId}; rc_token=${authToken}`,
			Origin: 'https://chat-dev.elevate-mentoring.shikshalokam.org',
			Referer: 'https://chat-dev.elevate-mentoring.shikshalokam.org/group/helloTest',
			'X-Auth-Token': authToken,
			'X-User-Id': userId,
		};

		//console.log(headers);

		const response = await post(url, data, headers);
		console.log(`Group created successfully with status ${response.status}`);
		return response.data; // or handle as needed
	} catch (error: any) {
		console.error(`Failed to create group: ${error.response ? error.response.data : error.message}`);
		throw error;
	}
};

const generateRandomId = () => Math.floor(Math.random() * 100000).toString();

const sendMessage = async ({ authToken, userId }: any, roomId: any, messageText: any, messageId = generateRandomId()) => {
	try {
		const url = '/api/v1/method.call/sendMessage';
		const headers = {
			'Content-Type': 'application/json',
			Cookie: `rc_uid=${userId}; rc_token=${authToken}`,
			Origin: 'https://chat-dev.elevate-mentoring.shikshalokam.org',
			Referer: 'https://chat-dev.elevate-mentoring.shikshalokam.org/group/TestRoomAlpha',
			'X-Auth-Token': authToken,
			'X-User-Id': userId,
		};
		const data = {
			message: JSON.stringify({
				msg: 'method',
				id: generateRandomId(),
				method: 'sendMessage',
				params: [
					{
						_id: messageId,
						rid: roomId,
						msg: messageText,
					},
					null,
				],
			}),
		};

		/* console.log({ data });
		console.log({ headers }); */
		const response = await post(url, data, headers);
		console.log(`Message sent successfully with status ${response.status}`);
		return response.data;
	} catch (error: any) {
		console.error(`Failed to send message: ${error.response ? error.response.data : error.message}`);
		throw error;
	}
};

exports.rocketChatApis = {
	registerUser,
	login,
	getRoomByTypeAndName,
	getRoomNameExists,
	createGroup,
	sendMessage,
};
