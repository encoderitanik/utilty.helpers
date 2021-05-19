const assert = require('assert');
const helpers = require('../src/helpers')

helpers.initialize()

describe('Object', function () {
	describe('Only', function () {
		const cases = [
			[
				{ a: 'v', b: 'v' },
				['a'],
				{ a: 'v' },
			],
			[
				{ a: 'v', b: { c: 'v', d: 'v' } },
				['a', 'b.c'],
				{ a: 'v', b: { c: 'v' } },
			],
			[
				{ a: 'v', b: { c: 'v', d: 'v', e: 'v' } },
				['a', 'b.c,e'],
				{ a: 'v', b: { c: 'v', e: 'v' } },
			]
		]
		cases.forEach((c) => {
			it(`${JSON.stringify(c[0])}(${c[1].toString()}) => ${JSON.stringify(c[2])}`, function () {
				assert.deepStrictEqual(c[0].only(...c[1]), c[2]);
			});
		})
	});
	describe('toCamelCase', function () {
		const cases = [
			[
				{
					'a_b': 'aB',
					'c-d': 'cD',
					'e.f': 'eF'
				},
				{
					'aB': 'aB',
					'cD': 'cD',
					'eF': 'eF'
				}
			],
			[['a_b'], ['a_b']],
			[{ 'a_b': 'aB' }, { 'aB': 'aB' }],
			[{ a: ['a_b'] }, { a: ['a_b'] }],
			[{ a: [{ 'a_b': 'aB' }] }, { a: [{ 'aB': 'aB' }] }],
		]
		cases.forEach((c) => {
			it(`${JSON.stringify(c[0])} => ${JSON.stringify(c[1])}`, function () {
				assert.deepStrictEqual(c[0].toCamelCase(), c[1]);
			});
		})
	});
});