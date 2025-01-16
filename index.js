export default function parse(text, position = 0) {
	return parseItem(text, position, [undefined])
}

function parseItem(text, position, terminators) {
	const map = parseMap(text, position, terminators)
	if (map.success) {
		return map
	}

	const list = parseList(text, position, terminators)
	if (list.success) {
		return list
	}

	const toggle = parseToggle(text, position, terminators)
	if (toggle.success) {
		return toggle
	}

	const empty = parseEmpty(text, position, terminators)
	if (empty.success) {
		return empty
	}

	const number = parseNumber(text, position, terminators)
	if (number.success) {
		return number
	}

	const string = parseString(text, position, terminators)
	if (string.success) {
		return string
	}

	return {success: false}
}

function parseMap(text, position) {
	if (text.at(position) !== '{') {
		return {success: false}
	}

	if (text.at(position + 1) === '}') {
		return {success: true, value: {}, end: position + 2}
	}

	const pairs = parseKeyValuePairs(text, position + 1)
	if (pairs.success) {
		return {
			success: true,
			value: Object.fromEntries(pairs.value),
			end: pairs.end,
		}
	} else {
		return {success: false}
	}
}

function parseKeyValuePairs(text, position, pairs = []) {
	const pair = parseKeyValuePair(text, position)
	if (pair.success) {
		if (text.at(pair.end) === '}') {
			pairs.push(pair.value)
			return {success: true, value: pairs, end: pair.end + 1}
		} else {
			pairs.push(pair.value)
			return parseKeyValuePairs(text, pair.end + 1, pairs)
		}
	} else {
		return {success: false}
	}
}

function parseKeyValuePair(text, position) {
	const key = parseString(text, position, [':'])
	if (!key.success) {
		return {success: false}
	}

	const value = parseItem(text, key.end + 1, [',', '}'])
	if (!value.success) {
		return {success: false}
	}

	return {success: true, value: [key.value, value.value], end: value.end}
}

function parseList(text, position) {
	if (text.at(position) !== '[') {
		return {success: false}
	}

	if (text.at(position + 1) === ']') {
		return {success: true, value: [], end: position + 2}
	}

	const items = parseListItems(text, position + 1)
	if (items.success) {
		return items
	} else {
		return {success: false}
	}
}

function parseListItems(text, position, items = []) {
	const item = parseItem(text, position, [',', ']'])
	if (item.success) {
		if (text.at(item.end) === ']') {
			items.push(item.value)
			return {success: true, value: items, end: item.end + 1}
		} else {
			items.push(item.value)
			return parseListItems(text, item.end + 1, items)
		}
	} else {
		return {success: false}
	}
}

function parseToggle(text, position, terminators) {
	if (
		text.slice(position, position + 4) === 'true' &&
		terminators.includes(text.at(position + 4))
	) {
		return {success: true, value: true, end: position + 4}
	} else if (
		text.slice(position, position + 5) === 'false' &&
		terminators.includes(text.at(position + 5))
	) {
		return {success: true, value: false, end: position + 5}
	} else {
		return {success: false}
	}
}

function parseNumber(text, position, terminators) {
	for (let i = position; i < text.length; i++) {
		if (terminators.includes(text.at(i))) {
			return {
				success: true,
				value: Number.parseFloat(text.slice(position, i)),
				end: i,
			}
		} else if (!/^[0-9.]$/.test(text.at(i))) {
			return {success: false}
		}
	}
	if (terminators.includes(undefined)) {
		return {
			success: true,
			value: Number.parseFloat(text.slice(position)),
			end: text.length,
		}
	} else {
		return {success: false}
	}
}

function parseString(text, position, terminators) {
	for (let i = position; i < text.length; i++) {
		if (terminators.includes(text.at(i))) {
			return {success: true, value: text.slice(position, i), end: i}
		}
	}
	if (terminators.includes(undefined)) {
		return {success: true, value: text.slice(position), end: text.length}
	} else {
		return {success: false}
	}
}

function parseEmpty(text, position, terminators) {
	if (
		text.slice(position, position + 4) === 'null' &&
		terminators.includes(text.at(position + 4))
	) {
		return {success: true, value: null, end: position + 4}
	} else {
		return {success: false}
	}
}
