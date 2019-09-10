import * as OLSKInternational from 'OLSKInternational';

import pathPackage from 'path';

import { OLSKRollupI18NExtractOLSKLocalizedConstants, OLSKRollupI18NExtractMatchingIdentifiers, OLSKRollupI18NReplaceInternationalizationToken } from './main.js';

import { createFilter } from 'rollup-pluginutils';
export default function i18nPlugin( options = {} ) {
	const filter = createFilter( options.include, options.exclude );
	const sourceMap = options.sourceMap !== false;

	const baseDirectory = options.baseDirectory;
	let allConstants = [];
	let watchedFiles = [];

	return {
		name: 'i18n',

		_OLSKRollupI18NReplaceInternationalizationToken: OLSKRollupI18NReplaceInternationalizationToken,

		buildStart() {
			if (!baseDirectory) {
      	throw new Error('missing options.baseDirectory');
			}

			(watchedFiles = require('glob').sync('*i18n*.y*(a)ml', {
			  matchBase: true,
			  cwd: baseDirectory,
			}).filter(function(e) {
			  return OLSKInternational.OLSKInternationalIsTranslationFileBasename(pathPackage.basename(e));
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

			// return OLSKRollupI18NReplaceInternationalizationToken({
			// 	code: code,
			// 	map: sourceMap || options.sourceMap || options.sourcemap,
			// }, watchedFiles.reduce(function(coll, item) {
			// 	let languageID = OLSKInternational.OLSKInternationalLanguageID(pathPackage.basename(item));

			// 	return (coll[languageID] = Object.assign(coll[languageID] || {}, jsYAMLPackage.safeLoad(require('fs').readFileSync(item, 'utf8')))) && coll;
			// }, {}));
			
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
				map: sourceMap || options.sourceMap || options.sourcemap,
			}, watchedFiles.reduce(function(coll, item) {
				let languageID = OLSKInternational.OLSKInternationalLanguageID(pathPackage.basename(item));

				return (coll[languageID] = Object.assign(coll[languageID] || {}, OLSKRollupI18NExtractMatchingIdentifiers(allConstants, require('js-yaml').safeLoad(require('fs').readFileSync(item, 'utf8'))))) && coll;
			}, {}));			
		},
		
	};
}
