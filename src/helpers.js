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
		if (has(object, key)) data[key] = object[key]
		else if (key.includes('.') && has(object, key.split('.')[0])) {
			const dotKeys = key.split('.')
			data[dotKeys[0]] = only(object[dotKeys[0]], dotKeys[1].split(','))
		}
		return data
	}, {})
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

module.exports = {
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
		Object.defineProperty(Object.prototype, 'only', {
			value: function (...keys) {
				return only(this, keys)
			}
		})
	}
}