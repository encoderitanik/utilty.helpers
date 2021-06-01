const assert = require('assert');
const { isNumber } = require('util');
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
			],
			[
				{ a: 'v', b: { c: 'v', d: 'v', e: 'v', g: { h: '', i: '' } } },
				['a', 'b.c,e,g.h'],
				{ a: 'v', b: { c: 'v', e: 'v', g: { h: '' } } },
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
	describe('toSnakeCase', function () {
		const cases = [
			[
				{
					'aB': 'v',
					'c.D': 'v',
					'e-F': 'v'
				},
				{
					'a_b': 'v',
					'c_d': 'v',
					'e_f': 'v'
				},

			],
			[['aB'], ['aB']],
			[{ 'aB': 'v' }, { 'a_b': 'v' }],
			[{ a: ['aB'] }, { a: ['aB'] }],
			[{ a: [{ 'aB': 'v' }] }, { a: [{ 'a_b': 'v' }] }],
		]
		cases.forEach((c) => {
			it(`${JSON.stringify(c[0])} => ${JSON.stringify(c[1])}`, function () {
				assert.deepStrictEqual(c[0].toSnakeCase(), c[1]);
			});
		})
	});
	describe('toSet', function () {
		const cases = [
			[
				[1, 2, 2, 3],
				[1, 2, 3],
			],
			[
				['a', 'a', 'b', 'c'],
				['a', 'b', 'c'],
			],
		]
		cases.forEach((c) => {
			it(`${JSON.stringify(c[0])} => ${JSON.stringify(c[1])}`, function () {
				assert.deepStrictEqual(c[0].toSet(), c[1]);
			});
		})
	});
	describe('convetIfNumber', function () {
		const cases = [
			[0, 0],
			[1, 1],
			[true, true],
			[false, false],
			[{}, {}],
			[[], []],
			[NaN, NaN],
			[32, 32],
			[Infinity, Infinity],
			[Infinity, Infinity],
			["0", '0'],
			["1", '1'],
			["10", '10'],
			["01", '1'],
			["-1", '-1'],
			["-01", '-1'],
			["+1", '+1'],
		]
		cases.forEach((c) => {
			it(`${JSON.stringify(c[0])} => ${JSON.stringify(c[1])}`, function () {
				assert.deepStrictEqual(
					helpers.convertIfNumber(c[0]),
					c[1]
				);
			});
		})
	});
});