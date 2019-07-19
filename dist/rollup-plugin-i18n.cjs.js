'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rollupPluginutils = require('rollup-pluginutils');
var MagicString = _interopDefault(require('magic-string'));
var OLSKInternational = require('OLSKInternational');
var globPackage = _interopDefault(require('glob'));
var pathPackage = _interopDefault(require('path'));
var jsYAMLPackage = _interopDefault(require('js-yaml'));

const ExtractOLSKLocalized = function(inputData) {
	let match = (inputData || '').match(/OLSKLocalized\([\'\"](\w+)[\'\"]\)/g);

	if (!match) {
		return [];
	}

	return match.map(function (e) {
		return e.replace('OLSKLocalized', '').replace(/\W/g, '');
	});
};

function i18nPlugin( options = {} ) {
  const filter = rollupPluginutils.createFilter( options.include, options.exclude );
  const sourceMap = options.sourceMap !== false;

  const replaceToken = '{"PLUGIN_ALFA_SEARCH_REPLACE":"PLUGIN_ALFA_SEARCH_REPLACE"}';
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
			
			ExtractOLSKLocalized(code).forEach(function (e) {
				if (matchedContstants.indexOf(e) !== -1) {
					return;
				}

				matchedContstants.push(e);
			});

			return null;
		},

		renderChunk(code, chunk, options) {
			let startIndex = code.indexOf(replaceToken);

			if (startIndex === -1) return null;

			if (!baseDirectory) {
				throw new Error('missing options.baseDirectory');
			}

			let magicString = new MagicString(code);

			magicString.overwrite(startIndex, startIndex + replaceToken.length, JSON.stringify(globPackage.sync('*i18n*.y*(a)ml', {
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
			}, {})));

			return {
				code: magicString.toString(),
				map: sourceMap ? magicString.generateMap() : null,
			};
					
		},
  };
}

module.exports = i18nPlugin;
