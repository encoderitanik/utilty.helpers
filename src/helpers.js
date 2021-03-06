const v = input => {
	return {
		isFile() {
			return input instanceof File
		},
		isArray() {
			return Array.isArray(input)
		},
		isString() {
			return typeof input === 'string'
		},
		isObject() {
			return isPlainObject(input)
		}
	}
}

/**
 * 
 * Get the reference of a value from deep array or object
 * 
 * @param {Array | Object} input - Input object or array
 * @param {String} path - Dotten path of which value to get 
 */
function deepGet(input, path) {
	let i
	path = path.split('.');
	for (i = 0; i < path.length; i++)
		input = input[path[i]];
	return input
}

/**
 * 
 * Set value of deep array or object
 * 
 * @param {Array | Object} input - Input object or array
 * @param {String} path - Dotten path of where to set 
 * @param {Any} value - Value to set in specified path
 */
function deepSet(input, path, value) {
	let i, originalInput = input;
	path = path.split('.');
	for (i = 0; i < path.length - 1; i++)
		input = input[path[i]];
	input[path[i]] = value;
	return originalInput
}

function convertIfNumber(input) {
	if (typeof input !== 'string') return input
	if (typeof input === 'string' && input.startsWith('+')) return input
	console.log('CON NUM: => ', containsNumber(input));
	return containsNumber(input) ? +input : input
}

function containsNumber(input) {
	return /^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/.test(input)
}

function toSuccess(res) {
	if (res.status === 'error' || res.error) return toError(res)
	return {
		...toCamelCase(res), error: false,
		message: res.message || res.msg || 'Request succeeded'
	}
}

function toError(error) {
	let data = { error: true }
	if (error.response) {
		const res = error.response.data
		if (res.data.errors) data.errors = toCamelCase(
			Object
				.entries(res.errors)
				.reduce((acc, [key, value]) => ({
					...acc, [key]: value
				}), {})
		)
		data.message = res.message || res.error || error.response.message
	}
	else data.message = error.message
	return data
}

function isPlainObject(input) {
	return Object.prototype.toString.call(input) === '[object Object]'
}

function has(input, key) {
	if (Array.isArray(input)) return input.some(a => a === key)
	if (isPlainObject(input)) return Object.prototype.hasOwnProperty.call(input, key)
	return false
}

function only(object, keys) {
	return keys.reduce((data, key) => {
		if (!key) return data
		const splitted = key.split('.')
		if (has(object, key)) data[key] = object[key]
		else if (splitted.length > 1 && has(object, splitted[0])) {
			data[splitted[0]] = only(
				object[splitted[0]],
				splitted.slice(1).join('.').split(',')
			)
		}
		return data
	}, {})
}

function toSnakeCase(data) {
	if (typeof data === 'string') return data
		.replace(/[-.]/g, '')
		.replace(/[A-Z]/g, char => `_${char.toLowerCase()}`)
	if (Array.isArray(data)) return data.map(
		el => Array.isArray(el) || isPlainObject(el)
			? toSnakeCase(el)
			: el
	)
	if (isPlainObject(data)) return Object.entries(data)
		.reduce((nData, [key, value]) => {
			nData[toSnakeCase(key)] =
				Array.isArray(value) || isPlainObject(value)
					? toSnakeCase(value)
					: value;
			return nData
		}, {})
	return data
}

function toCamelCase(data) {
	if (typeof data === 'string') {
		return data
			.replace(/^[_.\- ]+/, '')
			.toLowerCase()
			.replace(/[_.\- ]+(\w|$)/g, (_, p1) => p1.toUpperCase())
			.replace(/\d+(\w|$)/g, m => m.toUpperCase());
	}
	if (Array.isArray(data)) {
		return data.map(
			el => Array.isArray(el) || isPlainObject(el)
				? toCamelCase(el)
				: el)
	}
	if (isPlainObject(data)) return Object.entries(data)
		.reduce((nData, [key, value]) => {
			nData[toCamelCase(key)] =
				isPlainObject(value) || Array.isArray(value)
					? toCamelCase(value)
					: value;
			return nData
		}, {})

	return data
}

function object(input) {
	return {
		toCamelCase: () => toCamelCase(input),
		toSnakeCase: () => toSnakeCase(input),
		only: (...keys) => only(input, keys),
	}
}

module.exports = {
	deepGet,
	deepSet,
	convertIfNumber,
	initialize() {
		Object.defineProperty(Object.prototype, 'toCamelCase', {
			value: function () {
				return toCamelCase(this)
			}
		})
		Object.defineProperty(Array.prototype, 'toCamelCase', {
			value: function () {
				return toCamelCase(this)
			}
		})
		Object.defineProperty(Object.prototype, 'toSnakeCase', {
			value: function () {
				return toSnakeCase(this)
			}
		})
		Object.defineProperty(Array.prototype, 'toSnakeCase', {
			value: function () {
				return toSnakeCase(this)
			}
		})
		Object.defineProperty(Object.prototype, 'only', {
			value: function (...keys) {
				return only(this, keys)
			}
		})
		Object.defineProperty(Array.prototype, 'toSet', {
			value: function () {
				return [...new Set(this)]
			}
		})
	}
}

