const OLSKRollupLocalize = require('./main.js');

module.exports = function i18nPlugin( options = {} ) {
	const filter = require('rollup-pluginutils').createFilter( options.include, options.exclude );
	const sourceMap = options.sourceMap !== false;

	let allConstants = [];
	let watchedFiles = [];

	return {
		name: 'i18n',

		_OLSKRollupLocalizeReplaceInternationalizationToken: OLSKRollupLocalize.OLSKRollupLocalizeReplaceInternationalizationToken,

		buildStart() {
			if (!options.baseDirectory) {
      	throw new Error('missing options.baseDirectory');
			}

			(watchedFiles = require('glob').sync('*i18n*.y*(a)ml', {
			  matchBase: true,
			  cwd: options.baseDirectory,
			}).filter(function(e) {
			  return require('OLSKInternational').OLSKInternationalIsTranslationFileBasename(require('path').basename(e));
			}).map(function (e) {
				return require('path').join(options.baseDirectory, e);
			})).map(this.addWatchFile);
		},

		transform(code, id) {
			// if (id.match('node_modules')) {
			// 	return null;
			// }

			if (!filter(id)) {
				return null;
			}

			// return OLSKRollupLocalize.OLSKRollupLocalizeReplaceInternationalizationToken({
			// 	code: code,
			// 	map: sourceMap || options.sourceMap || options.sourcemap,
			// }, watchedFiles.reduce(function(coll, item) {
			// 	let languageID = require('OLSKInternational').OLSKInternationalLanguageID(require('path').basename(item));

			// 	return (coll[languageID] = Object.assign(coll[languageID] || {}, jsYAMLPackage.safeLoad(require('fs').readFileSync(item, 'utf8')))) && coll;
			// }, {}));
			
			OLSKRollupLocalize.OLSKRollupLocalizeExtractOLSKLocalizedConstants(code).forEach(function (e) {
				if (allConstants.includes(e)) {
					return;
				}

				allConstants.push(e);
			});

			return null;
		},

		renderChunk(code, chunk, options) {
			return OLSKRollupLocalize.OLSKRollupLocalizeReplaceInternationalizationToken({
				code: code,
				map: sourceMap || options.sourceMap || options.sourcemap,
			}, watchedFiles.reduce(function(coll, item) {
				let languageID = require('OLSKInternational').OLSKInternationalLanguageID(require('path').basename(item));

				return (coll[languageID] = Object.assign(coll[languageID] || {}, OLSKRollupLocalize.OLSKRollupLocalizeExtractMatchingIdentifiers(allConstants, require('js-yaml').safeLoad(require('fs').readFileSync(item, 'utf8'))))) && coll;
			}, {}));			
		},
		
	};
}
