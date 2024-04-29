const fs = require('fs').promises; // Notice we're now using promises from 'fs'
const path = require('path');

const numbersFilePath = path.join(__dirname, 'generatedNumbers.txt');

async function readNumbersFromFile(filePath) {
	try {
		const data = await fs.readFile(filePath, { encoding: 'utf-8' });
		return new Set(data.split('\n').map(Number).filter(Boolean));
	} catch (error) {
		if (error.code === 'ENOENT') {
			// If the file does not exist, return an empty set
			return new Set();
		} else {
			throw error;
		}
	}
}

async function writeNumberToFile(filePath, number) {
	await fs.appendFile(filePath, `${number}\n`, { encoding: 'utf-8' });
}

async function generateUniqueRandomNumber(min, max) {
	const existingNumbers = await readNumbersFromFile(numbersFilePath);
	let attempts = 0;
	let potentialNumber;
	do {
		potentialNumber = Math.floor(Math.random() * (max - min + 1)) + min;
		attempts++;
		if (attempts > max - min) {
			throw new Error('Exhausted all attempts to find a unique number. The range may be fully occupied.');
		}
	} while (existingNumbers.has(potentialNumber));

	// Once a unique number is found, write it to the file
	await writeNumberToFile(numbersFilePath, potentialNumber);
	return potentialNumber;
}

exports.urnGenerator = {
	generateUniqueRandomNumber,
};
