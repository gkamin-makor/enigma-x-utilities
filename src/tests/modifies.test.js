const utils = require('../main');
const { setConfig } = require('../config');
const { numberFormatter } = require('../functions/modifies');

test('simple input - successes', async () => {
	utils.setConfig('phones', {
		format: '3-8',
	});
	await expect(utils.phoneNumberFormatter('12345678765')).toStrictEqual({
		data: '123-45678765',
		message: 'Phone number successfully formatted',
		success: true,
	});
});

test('simple input with isInternational: false- successes', async () => {
	utils.setConfig('phones', {
		format: '3-4-4',
		isInternational: false,
	});
	await expect(utils.phoneNumberFormatter('12345678765')).toStrictEqual({
		data: '4567-8765',
		message: 'Phone number successfully formatted',
		success: true,
	});
});

test('phone number length test - error', async () => {
	utils.setConfig('phones', {
		format: '3-8-5',
	});
	await expect(utils.phoneNumberFormatter('123-4567-876544133')).toStrictEqual({
		success: false,
		message: 'Phone number length can contain only 7-15 digits',
	});
});

test('phone number format test - error', async () => {
	utils.setConfig('phones', {
		format: '3-8',
	});
	await expect(utils.phoneNumberFormatter('123-4567-876544133')).toStrictEqual({
		success: false,
		message: 'Format does not match no. of digits in phone number',
	});
});

test('phone number format invalid - error', async () => {
	utils.setConfig('phones', {
		format: '3-3-4',
	});
	await expect(utils.phoneNumberFormatter('123$456$4133')).toStrictEqual({
		success: false,
		message: 'Phone number input is invalid',
	});
});

//************************************************************/

test("user sends one separator - string is split according to it (even if it's not the most frequent) - successes", async () => {
	utils.setConfig('tags', {
		separators: [','],
	});
	await expect(utils.tagsSeparator('a:b:c:d,e,f')).toStrictEqual({
		data: ['a:b:c:d', 'e', 'f'],
		message: 'Tags array created successfully',
		success: true,
	});
});

test('user sends a couple of separators , string is split according to the most frequent among them  - successes', async () => {
	utils.setConfig('tags', {
		separators: [',', '-'],
	});
	await expect(utils.tagsSeparator('a,b,c-d,e,f,a-b-c-d-e-f')).toStrictEqual({
		data: ['a,b,c', 'd,e,f,a', 'b', 'c', 'd', 'e', 'f'],
		message: 'Tags array created successfully',
		success: true,
	});
});

test('user does not send separators, the string is split using the most frequent special char - successes', async () => {
	await expect(utils.tagsSeparator('a,b,c,d,e,f')).toStrictEqual({
		data: ['a', 'b', 'c', 'd', 'e', 'f'],
		message: 'Tags array created successfully',
		success: true,
	});
});

test('user sends separators that do not exist in string , function sends back array with one unsplit string - successes', async () => {
	utils.setConfig('tags', {
		separators: ['|', '.'],
	});
	await expect(utils.tagsSeparator('a,b,c-d,e,f,a-b-c-d-e-f')).toStrictEqual({
		data: ['a,b,c-d,e,f,a-b-c-d-e-f'],
		message: 'Tags array created successfully',
		success: true,
	});
});

test('user sends empty separators array, string is split according to most frequent special char', async () => {
	utils.setConfig('tags', {
		separators: [],
	});
	await expect(utils.tagsSeparator('a,b,c-d,e,f,a-b-c-d-e-f')).toStrictEqual({
		data: ['a,b,c', 'd,e,f,a', 'b', 'c', 'd', 'e', 'f'],
		message: 'Tags array created successfully',
		success: true,
	});
});

test('double char seperator - error', async () => {
	utils.setConfig('tags', {
		separators: [',,'],
	});
	await expect(utils.tagsSeparator('a,b,c,d,e,f')).toStrictEqual({
		message: 'Separators may only include one character each.',
		success: false,
	});
});
test('seperator doesnt contains special char - error', async () => {
	utils.setConfig('tags', {
		separators: ['3'],
	});
	await expect(utils.tagsSeparator('a3b3c3d3e3f')).toStrictEqual({
		message: 'Separators may only include special characters.',
		success: false,
	});
});

describe(`~~~~~~~~~~~ ~ ~ ~ ### @ @ @                                  @ @ @ ### ~ ~ ~ ~~~~~~~~~~~
~~~~~~~~~~~ ~ ~ ~ ### @ @ @     Testing Number Formatter     @ @ @ ### ~ ~ ~ ~~~~~~~~~~~
~~~~~~~~~~~ ~ ~ ~ ### @ @ @                                  @ @ @ ### ~ ~ ~ ~~~~~~~~~~~\n`, () => {
	test('Test No. 1', () => {
		expect(numberFormatter('234')).toEqual(
			expect.objectContaining({
				success: false,
			}),
		);
	});

	test('Test No. 2', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 10,
			decimalDigitLimit: 2,
		}); 

		expect(numberFormatter(234)).toEqual(
			expect.objectContaining({
				data: { number: '234' },
			}),
		);
	});

	test('Test No. 3', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 2,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(234)).toEqual(
			expect.objectContaining({
				data: { number: '0.2K' },
			}),
		);
	});

	test('Test No. 4', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 3,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(234234)).toEqual(
			expect.objectContaining({
				data: { number: '234K' },
			}),
		);
	});

	test('Test No. 5', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 2,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(234234)).toEqual(
			expect.objectContaining({
				data: { number: '0.2M' },
			}),
		);
	});

	test('Test No. 6', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 3,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(234234)).toEqual(
			expect.objectContaining({
				data: { number: '234K' },
			}),
		);
	});

	test('Test No. 7', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 10,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(234.234)).toEqual(
			expect.objectContaining({
				data: { number: '234.23' },
			}),
		);
	});

	test('Test No. 8', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 1,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(0.234)).toEqual(
			expect.objectContaining({
				data: { number: '0' },
			}),
		);
	});

	test('Test No. 9', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 2,
			decimalDigitLimit: 1,
		});

		expect(numberFormatter(0.234)).toEqual(
			expect.objectContaining({
				data: { number: '0.2' },
			}),
		);
	});

	test('Test No. 10', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 1,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(1000000000)).toEqual(
			expect.objectContaining({
				data: { number: '1G' },
			}),
		);
	});

	test('Test No. 11', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 2,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(100000000)).toEqual(
			expect.objectContaining({
				data: { number: '0.1G' },
			}),
		);
	});

	test('Test No. 12', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 2,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(10000000)).toEqual(
			expect.objectContaining({
				data: { number: '10M' },
			}),
		);
	});

	test('Test No. 13', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 2,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(1000000)).toEqual(
			expect.objectContaining({
				data: { number: '1.0M' },
			}),
		);
	});

	test('Test No. 14', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 10,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(234234.234)).toEqual(
			expect.objectContaining({
				data: { number: '234,234.23' },
			}),
		);
	});

	test('Test No. 15', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 10,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(234)).toEqual(
			expect.objectContaining({
				data: { number: '234' },
			}),
		);
	});

	test('Test No. 16', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 2,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(-1234)).toEqual(
			expect.objectContaining({
				data: { number: '-1.2K' },
			}),
		);
	});

	test('Test No. 17', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 2,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(-0.5)).toEqual(
			expect.objectContaining({
				data: { number: '-0.5' },
			}),
		);
	});

	test('Test No. 18', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 2,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(-0.5)).toEqual(
			expect.objectContaining({
				data: { number: '-0.5' },
			}),
		);
	});

	test('Test No. 19', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 10,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(5000000000)).toEqual(
			expect.objectContaining({
				data: { number: '5,000,000,000' },
			}),
		);
	});

	test('Test No. 20', () => {
		setConfig('numberFormatter', {
			overallDigitLimit: 2,
			decimalDigitLimit: 2,
		});

		expect(numberFormatter(-0.5)).toEqual(
			expect.objectContaining({
				data: { number: '-0.5' },
			}),
		);
	});
});
//success situation when config the function.
test ("specialCharModifier",async ()=>{
	utils.setConfig("specialCharsModifier",{exceptions:"@#$"})
	expect(utils.specialCharsModifier("av!iv @ avisrur $# !&*")).toStrictEqual({success:true,message:"String successfully modified",data:'aviv @ avisrur $# '})
})

//success situation when no configuration function.
test ("specialCharModifier",async ()=>{
	expect(utils.specialCharsModifier("av!iv @ avisrur $# !&*")).toStrictEqual({success:true,message:"String successfully modified", data: 'aviv  avisrur  '})
})

//success situation when no configuration function.
test ("specialCharModifier",async ()=>{
	expect(utils.specialCharsModifier(12345)).toStrictEqual({success:false,message:"1234 should be string"})
})
