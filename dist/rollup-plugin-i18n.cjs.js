'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rollupPluginutils = require('rollup-pluginutils');
var MagicString = _interopDefault(require('magic-string'));
var OLSKInternational = require('OLSKInternational');
var globPackage = _interopDefault(require('glob'));
var pathPackage = _interopDefault(require('path'));
var jsYAMLPackage = _interopDefault(require('js-yaml'));

const OLSKRollupI18NExtractOLSKLocalizedConstants = function(inputData) {
	let match = (inputData || '').match(/OLSKLocalized\(['"`](\w+)/g);

	if (!match) {
		return [];
	}

	return match.map(function (e) {
		return e.replace('OLSKLocalized', '').replace(/\W/g, '');
	});
};

const OLSKRollupI18NExtractMatchingIdentifiers = function(param1, param2) {
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
const OLSKRollupI18NInternationalizationToken = 'JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)';

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

	(function replaceToken() {
		magicString.overwrite(startIndex, startIndex + OLSKRollupI18NInternationalizationToken.length, `JSON.parse(\`${ JSON.stringify(param2).replace(/`/g, '\\\`').replace(/\\n/g, '\\\\n').replace(/\\r/g, '\\\\r') }\`)`);

		startIndex = param1.code.slice(startIndex + OLSKRollupI18NInternationalizationToken.length).indexOf(OLSKRollupI18NInternationalizationToken);

		if (startIndex === -1) return;

		startIndex = startIndex + OLSKRollupI18NInternationalizationToken.length;

		replaceToken();
	})();

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
  let allConstants = [];
  let watchedFiles = [];

  return {
		name: 'i18n',

		buildStart() {
      if (!baseDirectory) {
      	throw new Error('missing options.baseDirectory');
      }

      (watchedFiles = globPackage.sync('*i18n*.y*(a)ml', {
			  matchBase: true,
			  cwd: baseDirectory,
			}).filter(function(e) {
			  return OLSKInternational.OLSKInternationalInputDataIsTranslationFileBasename(pathPackage.basename(e));
			}).map(function (e) {
				return pathPackage.join(baseDirectory, e);
			})).map(this.addWatchFile);
    },

		transform(code, id) {
			if (id.match('node_modules')) {
				return null;
			}

			if (!filter(id)) {
				return null;
			}
			
			OLSKRollupI18NExtractOLSKLocalizedConstants(code).forEach(function (e) {
				if (allConstants.indexOf(e) !== -1) {
					return;
				}

				allConstants.push(e);
			});

			return null;
		},

		renderChunk(code, chunk, options) {
			return OLSKRollupI18NReplaceInternationalizationToken({
				code: code,
				map: sourceMap,
			}, watchedFiles.reduce(function(coll, item) {
				let languageID = OLSKInternational.OLSKInternationalLanguageIDForTranslationFileBasename(pathPackage.basename(item));

				return (coll[languageID] = Object.assign(coll[languageID] || {}, OLSKRollupI18NExtractMatchingIdentifiers(allConstants, jsYAMLPackage.safeLoad(require('fs').readFileSync(item, 'utf8'))))) && coll;
			}, {}));
					
		},
  };
}

module.exports = i18nPlugin;
