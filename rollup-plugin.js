const OLSKRollupLocalize = require('./main.js');

module.exports = function i18nPlugin( options = {} ) {

	const mod = {

		// VALUE

		_ValueConstants: [],

		// DATA

		_DataFilter: require('rollup-pluginutils').createFilter( options.include, options.exclude ),
		_DataHasSourceMap: options.sourceMap !== false, // #purge
		_DataBaseDirectory: options.baseDirectory,

	};

	return {
		name: 'i18n',

		_OLSKRollupLocalizeReplaceInternationalizationToken: OLSKRollupLocalize.OLSKRollupLocalizeReplaceInternationalizationToken,

		transform(code, id) {
			if (!mod._DataFilter(id)) {
				return null;
			}
			
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
			}, require('OLSKInternational')._OLSKInternationalPaths(mod._DataBaseDirectory).reduce(function(coll, item) {
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
