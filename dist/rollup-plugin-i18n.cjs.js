'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rollupPluginutils = require('rollup-pluginutils');
var MagicString = _interopDefault(require('magic-string'));
var OLSKInternational = require('OLSKInternational');
var globPackage = _interopDefault(require('glob'));
var pathPackage = _interopDefault(require('path'));
var jsYAMLPackage = _interopDefault(require('js-yaml'));

const OLSKRollupI18NExtractOLSKLocalizedIdentifiers = function(inputData) {
	let match = (inputData || '').match(/OLSKLocalized\([\'\"](\w+)[\'\"]\)/g);

	if (!match) {
		return [];
	}

	return match.map(function (e) {
		return e.replace('OLSKLocalized', '').replace(/\W/g, '');
	});
};
const OLSKRollupI18NInternationalizationToken = 'JSON.parse(`{"PLUGIN_ALFA_SEARCH_REPLACE":"PLUGIN_ALFA_SEARCH_REPLACE"}`)';

const OLSKRollupI18NReplaceInternationalizationToken = function(param1, param2) {
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

	magicString.overwrite(startIndex, startIndex + OLSKRollupI18NInternationalizationToken.length, `JSON.parse(\`${ JSON.stringify(param2).replace(/`/g, '\\\`') }\`)`);

	return Object.assign(param1, {
		code: magicString.toString(),
	}, param1.map ? {
		map: magicString.generateMap(),
	} : {});
};

function i18nPlugin( options = {} ) {
  const filter = rollupPluginutils.createFilter( options.include, options.exclude );
  const sourceMap = options.sourceMap !== false;

  const baseDirectory = options.baseDirectory;
  let matchedContstants = [];

  return {
		name: 'i18n',

		transform(code, id) {
			if (id.match('node_modules')) {
				return null;
			}

			if (!filter(id)) {
				return null;
			}
			
			OLSKRollupI18NExtractOLSKLocalizedIdentifiers(code).forEach(function (e) {
				if (matchedContstants.indexOf(e) !== -1) {
					return;
				}

				matchedContstants.push(e);
			});

			return null;
		},

		renderChunk(code, chunk, options) {
			if (!baseDirectory) {
				throw new Error('missing options.baseDirectory');
			}

			return OLSKRollupI18NReplaceInternationalizationToken({
				code: code,
				map: sourceMap,
			}, globPackage.sync('*i18n*.y*(a)ml', {
			  matchBase: true,
			  cwd: baseDirectory,
			}).filter(function(e) {
			  return OLSKInternational.OLSKInternationalInputDataIsTranslationFileBasename(pathPackage.basename(e));
			}).reduce(function(coll, item) {
				let languageID = OLSKInternational.OLSKInternationalLanguageIDForTranslationFileBasename(pathPackage.basename(item));
				let allTranslations = jsYAMLPackage.safeLoad(require('fs').readFileSync(pathPackage.join(baseDirectory, item), 'utf8'));

				return (coll[languageID] = Object.assign(coll[languageID] || {}, matchedContstants.reduce(function (coll, item) {
					if (!allTranslations[item]) {
						return coll;
					}
					return (coll[item] = allTranslations[item]) && coll;
				}, {}))) && coll;
			}, {}));
					
		},
  };
}

module.exports = i18nPlugin;
