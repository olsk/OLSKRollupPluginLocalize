const OLSKRollupLocalize = require('./main.js');

module.exports = function i18nPlugin( options = {} ) {

	const mod = {

		// VALUE

		_ValueConstants: [],
		_ValueWatchedFiles: [],

		// DATA

		_DataFilter: require('rollup-pluginutils').createFilter( options.include, options.exclude ),
		_DataHasSourceMap: options.sourceMap !== false, // #purge
		_DataBaseDirectory: options.baseDirectory,

		// SETUP

		SetupEverything() {
			mod.SetupWatchedFiles();
		},

		SetupWatchedFiles() {
			if (!options.baseDirectory) {
      	throw new Error('missing options.baseDirectory');
			}

			if (!mod._DataWatchFunction) {
				throw new Error('missing mod._DataWatchFunction');
			};

			(mod._ValueWatchedFiles = require('glob').sync('*i18n*.y*(a)ml', {
			  matchBase: true,
			  cwd: options.baseDirectory,
			}).filter(function(e) {
			  return require('OLSKInternational').OLSKInternationalIsTranslationFileBasename(require('path').basename(e));
			}).map(function (e) {
				return require('path').join(options.baseDirectory, e);
			})).map(mod._DataWatchFunction);
		},

		// LIFECYCLE

		LifecycleBuildDidStart() {
			mod.SetupEverything();
		},

	};

	return {
		name: 'i18n',

		_OLSKRollupLocalizeReplaceInternationalizationToken: OLSKRollupLocalize.OLSKRollupLocalizeReplaceInternationalizationToken,

		// buildStart() {
		// 	mod._DataWatchFunction = this.addWatchFile;

		// 	mod.LifecycleBuildDidStart();
		// },

		transform(code, id) {
			// if (id.match('node_modules')) {
			// 	return null;
			// }

			if (!mod._DataFilter(id)) {
				return null;
			}

			// return OLSKRollupLocalize.OLSKRollupLocalizeReplaceInternationalizationToken({
			// 	code: code,
			// 	map: mod._DataHasSourceMap || options.sourceMap || options.sourcemap,
			// }, mod._ValueWatchedFiles.reduce(function(coll, item) {
			// 	let languageID = require('OLSKInternational').OLSKInternationalLanguageID(require('path').basename(item));

			// 	return (coll[languageID] = Object.assign(coll[languageID] || {}, jsYAMLPackage.safeLoad(require('fs').readFileSync(item, 'utf8')))) && coll;
			// }, {}));
			
			OLSKRollupLocalize.OLSKRollupLocalizeExtractOLSKLocalizedConstants(code).forEach(function (e) {
				if (mod._ValueConstants.includes(e)) {
					return;
				}

				mod._ValueConstants.push(e);
			});

			return null;
		},

		renderChunk(code, chunk, options) {
			return OLSKRollupLocalize.OLSKRollupLocalizeReplaceInternationalizationToken({
				code: code,
				map: mod._DataHasSourceMap || options.sourceMap || options.sourcemap,
			}, require('OLSKInternational')._OLSKInternationalPaths({
				OLSKInternationalFileDelegateGlobSync: require('glob').sync,
				OLSKInternationalFileDelegateYAMLRead: require('js-yaml').safeLoad,
			}, mod._DataBaseDirectory).reduce(function(coll, item) {
				const languageID = require('OLSKInternational').OLSKInternationalLanguageID(require('path').basename(item));
				const data = require('js-yaml').safeLoad(require('fs').readFileSync(item, 'utf8'));
				const includeAllData = chunk.facadeModuleId && item.match(require('path').dirname(chunk.facadeModuleId));

				return Object.assign(coll, {
					[languageID]: Object.assign(coll[languageID] || {}, OLSKRollupLocalize.OLSKRollupLocalizeExtractMatchingIdentifiers(mod._ValueConstants, data), includeAllData ? data : {}),
				});
			}, {}));			
		},
		
	};
}
