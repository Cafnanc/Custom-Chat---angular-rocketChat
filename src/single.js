const { rocketChatApis } = require('./rocketChatApis');
const { getUser } = require('./fakerUtils');

let adminUser = {
	username: 'joffinjoy',
	password: 'qXN5tYzXTNYgqHj',
};

let normalUser = getUser();
console.log({ normalUser });

let secondUser_ = getUser();

const generateRandomId = () => Math.floor(Math.random() * 100).toString();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const groupName = 'TestRoom' + generateRandomId();

const main = async () => {
	const normalUserSignUpResponse = await rocketChatApis.registerUser(normalUser);
	normalUser.userId = normalUserSignUpResponse.data.user._id;
	const adminLoginResponse = await rocketChatApis.login({ user: adminUser.username, password: adminUser.password });
	const admin = adminLoginResponse.data.data;
	delete admin.me;
	admin.username = adminUser.username;
	const normalUserLoginResponse = await rocketChatApis.login({
		user: normalUser.username,
		password: normalUser.pass,
	});
	const user = normalUserLoginResponse.data.data;
	delete user.me;
	user.username = normalUser.username;
	console.log('USER: ', { admin, user });

	const checkRoomResponse = await rocketChatApis.getRoomNameExists(admin, groupName);
	console.log(checkRoomResponse);

	const createGroupResponse = await rocketChatApis.createGroup(
		admin,
		groupName,
		[admin.username, user.username],
		false,
		{ topic: 'Something', broadcast: false, encrypted: false }
	);
	console.log(createGroupResponse);
	const group = createGroupResponse.group;
	const checkRoomResponse2 = await rocketChatApis.getRoomNameExists(admin, groupName);
	console.log(checkRoomResponse2);
	const adminSendMessageResponse = await rocketChatApis.sendMessage(admin, group._id, 'Hello');
	console.log(adminSendMessageResponse);
	const userSendMessageResponse = await rocketChatApis.sendMessage(user, group._id, 'Hey');
	console.log(userSendMessageResponse);

	//SECOND USER FLOW
	const secondUserResponse = await rocketChatApis.registerUser(secondUser_);
	secondUser_.userId = secondUserResponse.data.user._id;
	const secondUserLoginResponse = await rocketChatApis.login({
		user: secondUser_.username,
		password: secondUser_.pass,
	});
	const secondUser = secondUserLoginResponse.data.data;
	delete secondUser.me;
	secondUser.username = secondUser_.username;
	console.log('SECOND USER: ', { secondUser });

	const createSecondGroupResponse = await rocketChatApis.createGroup(
		admin,
		groupName + generateRandomId(),
		[user.username, secondUser.username],
		false,
		{ topic: 'Something', broadcast: false, encrypted: false }
	);
	await delay(5000);
	const secondGroup = createSecondGroupResponse.group;
	do {
		await rocketChatApis.sendMessage(user, secondGroup._id, 'Hello' + generateRandomId());
		await rocketChatApis.sendMessage(secondUser, secondGroup._id, 'Hey' + generateRandomId());
	} while (true);
};

main();
