const OLSKRollupLocalizeInternationalizationToken = 'JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)';

const mod = {

	OLSKRollupLocalizeExtractOLSKLocalizedConstants (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		let match = inputData.match(/OLSKLocalized\(['"`](\w+)/g);

		if (!match && (match = (/OLSKLocalized\((.*)\)/g).exec(inputData))) {
			match = match[1].match(/(['"`]\w+['"`])/g);
		}

		if (!match) {
			return [];
		}

		return match.map(function (e) {
			return e.replace('OLSKLocalized', '').replace(/\W/g, '');
		});
	},

	OLSKRollupLocalizeExtractMatchingIdentifiers (param1, param2) {
		if (!Array.isArray(param1)) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param2 !== 'object' || param2 === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return Object.keys(param2).filter(function (identifier) {
			return param1.filter(function (e) {
				return identifier.match(new RegExp(`^${ e }`));
			}).length;
		}).reduce(function (coll, item) {
			return (coll[item] = param2[item]) && coll;
		}, {});
	},

	OLSKRollupLocalizeInternationalizationToken,

	OLSKRollupLocalizeReplaceInternationalizationToken (param1, param2) {
		if (typeof param1 !== 'object' || param1 === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param1.code !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param2 !== 'object' || param2 === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		let startIndex = param1.code.indexOf(OLSKRollupLocalizeInternationalizationToken);

		if (startIndex === -1) return null;

		let magicString = new (require('magic-string'))(param1.code);

		(function replaceToken() {
			const endIndex = startIndex + OLSKRollupLocalizeInternationalizationToken.length;

			magicString.overwrite(startIndex, endIndex, JSON.stringify(param2));

			startIndex = param1.code.slice(endIndex).indexOf(OLSKRollupLocalizeInternationalizationToken);

			if (startIndex === -1) {
				return;
			}

			startIndex += endIndex;

			replaceToken();
		})();

		const outputData = {
			code: magicString.toString()
		};

		if (param1.map) {
			outputData.map = magicString.generateMap({ hires: true });
		}

		return outputData;
	},

};

Object.assign(exports, mod);
