const fs = require('fs');
const { rocketChatApis } = require('./rocketChatApis');
const { getUser } = require('./fakerUtils');

const FILE_PATH = 'users.json';

const readUsersFromFile = () => {
	try {
		const data = fs.readFileSync(FILE_PATH);
		return JSON.parse(data);
	} catch (err) {
		return [];
	}
};

const writeUsersToFile = (users) => {
	fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2));
};

const main = async () => {
	let users = readUsersFromFile();
	const existingUserCount = users.length;
	const targetUserCount = 100;
	for (let i = existingUserCount; i < targetUserCount; i++) {
		const user = getUser();
		const response = await rocketChatApis.registerUser(user);
		if (response?.success) {
			user._id = response.data.user._id;
			users.push(user);
		}
		console.log('User: ', user);
	}
	writeUsersToFile(users);
	console.log('Total Users:', users.length);
	await Promise.all(
		users.map(async (user, i) => {
			const response = await rocketChatApis.login({ user: user.username, password: user.pass });
			if (response?.success) users[i].authToken = response.data.data.authToken;
			return true;
		})
	);
	/* console.log(users); */
	/* for (let i = 0; i < targetUserCount; i++) {
		const response = await rocketChatApis.login({ user: users[i].username, password: users[i].pass });
		if (response?.success) users[i].authToken = response.data.data.authToken;
	} */

	const response = await rocketChatApis.getRoomByTypeAndName(users[0], users[1]);
	console.log(response);
	users[0] = { rc_uid: 'gGQMHdbEJ9WPqWwdf', rc_token: '0ErUPc0m8V9lbQp5qlrqZ6ZkCMwDtlaVMqL9AmTY66a', ...users[0] };
	const checkRoomResponse = await rocketChatApis.getRoomNameExists(users[0], 'HelloRoom');
	console.log(checkRoomResponse);
	console.log(users[0], users[1]);
	const adminUser = await rocketChatApis.login({ user: 'joffinjoy', password: 'qXN5tYzXTNYgqHj' });
	console.log(adminUser);
	const joffin = adminUser.data.data;
	console.log({ joffin });
	const createGroupResponse = await rocketChatApis.createGroup(
		joffin.authToken,
		joffin.userId,
		'HelloRoom',
		['kiranharidas', 'joffinjoy'],
		false,
		{ topic: 'Something', broadcast: false, encrypted: false }
	);
	console.log(createGroupResponse);
	const group = createGroupResponse.group;
	const checkRoomResponse2 = await rocketChatApis.getRoomNameExists(admin, 'HelloRoom');
	console.log(checkRoomResponse2);
	const adminSendMessageResponse = await rocketChatApis.sendMessage(admin, group._id, 'Hello');
	console.log(adminSendMessageResponse);
	const userSendMessageResponse = await rocketChatApis.sendMessage(user, group._id, 'Hey');
	console.log(userSendMessageResponse);
};

main();
