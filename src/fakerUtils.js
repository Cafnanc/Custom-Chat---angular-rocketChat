const { faker } = require('@faker-js/faker');

exports.getUser = () => {
	try {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();
		const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${faker.number.int({
			min: 10,
			max: 99,
		})}`;
		const email = `${username}@example.com`;
		const pass = 'password';
		const name = `${firstName} ${lastName}`;
		return {
			username,
			email,
			pass,
			name,
		};
	} catch (err) {
		console.log(err);
		return null;
	}
};
