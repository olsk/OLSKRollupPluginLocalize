const pathPackage = require('path');

const { OLSKRollupLocalizeExtractOLSKLocalizedConstants, OLSKRollupLocalizeExtractMatchingIdentifiers, OLSKRollupLocalizeReplaceInternationalizationToken } = require('./main.js');

module.exports = function i18nPlugin( options = {} ) {
	const filter = require('rollup-pluginutils').createFilter( options.include, options.exclude );
	const sourceMap = options.sourceMap !== false;

	const baseDirectory = options.baseDirectory;
	let allConstants = [];
	let watchedFiles = [];

	return {
		name: 'i18n',

		_OLSKRollupLocalizeReplaceInternationalizationToken: OLSKRollupLocalizeReplaceInternationalizationToken,

		buildStart() {
			if (!baseDirectory) {
      	throw new Error('missing options.baseDirectory');
			}

			(watchedFiles = require('glob').sync('*i18n*.y*(a)ml', {
			  matchBase: true,
			  cwd: baseDirectory,
			}).filter(function(e) {
			  return require('OLSKInternational').OLSKInternationalIsTranslationFileBasename(pathPackage.basename(e));
			}).map(function (e) {
				return pathPackage.join(baseDirectory, e);
			})).map(this.addWatchFile);
		},

		transform(code, id) {
			// if (id.match('node_modules')) {
			// 	return null;
			// }

			if (!filter(id)) {
				return null;
			}

			// return OLSKRollupLocalizeReplaceInternationalizationToken({
			// 	code: code,
			// 	map: sourceMap || options.sourceMap || options.sourcemap,
			// }, watchedFiles.reduce(function(coll, item) {
			// 	let languageID = require('OLSKInternational').OLSKInternationalLanguageID(pathPackage.basename(item));

			// 	return (coll[languageID] = Object.assign(coll[languageID] || {}, jsYAMLPackage.safeLoad(require('fs').readFileSync(item, 'utf8')))) && coll;
			// }, {}));
			
			OLSKRollupLocalizeExtractOLSKLocalizedConstants(code).forEach(function (e) {
				if (allConstants.indexOf(e) !== -1) {
					return;
				}

				allConstants.push(e);
			});

			return null;
		},

		renderChunk(code, chunk, options) {
			return OLSKRollupLocalizeReplaceInternationalizationToken({
				code: code,
				map: sourceMap || options.sourceMap || options.sourcemap,
			}, watchedFiles.reduce(function(coll, item) {
				let languageID = require('OLSKInternational').OLSKInternationalLanguageID(pathPackage.basename(item));

				return (coll[languageID] = Object.assign(coll[languageID] || {}, OLSKRollupLocalizeExtractMatchingIdentifiers(allConstants, require('js-yaml').safeLoad(require('fs').readFileSync(item, 'utf8'))))) && coll;
			}, {}));			
		},
		
	};
}
