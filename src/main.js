export const OLSKRollupI18NExtractOLSKLocalizedConstants = function(inputData) {
	let match = (inputData || '').match(/OLSKLocalized\(['"`](\w+)/g);

	if (!match) {
		return [];
	}

	return match.map(function (e) {
		return e.replace('OLSKLocalized', '').replace(/\W/g, '');
	});
};

export const OLSKRollupI18NExtractMatchingIdentifiers = function(param1, param2) {
	if (!Array.isArray(param1)) {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (typeof param2 !== 'object' || param2 === null) {
		throw new Error('OLSKErrorInputInvalid');
	}

	return Object.keys(param2).filter(function (identifier) {
		return param1.filter(function (e) {
			return identifier.match(new RegExp(`^${ e }`));
		}).length;
	}).reduce(function (coll, item) {
		return (coll[item] = param2[item]) && coll;
	}, {});
};


import MagicString from 'magic-string';
export const OLSKRollupI18NInternationalizationToken = 'JSON.parse(`{"PLUGIN_ALFA_SEARCH_REPLACE":"PLUGIN_ALFA_SEARCH_REPLACE"}`)';

export const OLSKRollupI18NReplaceInternationalizationToken = function(param1, param2) {
	if (typeof param1 !== 'object' || param1 === null) {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (typeof param1.code !== 'string') {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (typeof param2 !== 'object' || param2 === null) {
		throw new Error('OLSKErrorInputInvalid');
	}

	let startIndex = param1.code.indexOf(OLSKRollupI18NInternationalizationToken);

	if (startIndex === -1) return null;

	let magicString = new MagicString(param1.code);

	magicString.overwrite(startIndex, startIndex + OLSKRollupI18NInternationalizationToken.length, `JSON.parse(\`${ JSON.stringify(param2).replace(/`/g, '\\\`').replace(/\\n/g, '\\\\n').replace(/\\r/g, '\\\\r') }\`)`);

	return Object.assign(param1, {
		code: magicString.toString(),
	}, param1.map ? {
		map: magicString.generateMap(),
	} : {});
};
