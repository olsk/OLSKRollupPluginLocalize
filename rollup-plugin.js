import { createFilter } from 'rollup-pluginutils';
import MagicString from 'magic-string';

import * as OLSKInternational from 'OLSKInternational';

import globPackage from 'glob';
import pathPackage from 'path';
import jsYAMLPackage from 'js-yaml';

import { OLSKRollupI18NExtractOLSKLocalizedConstants, OLSKRollupI18NExtractMatchingIdentifiers, OLSKRollupI18NReplaceInternationalizationToken } from './main.js';

export default function i18nPlugin( options = {} ) {
  const filter = createFilter( options.include, options.exclude );
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
			})).map(this.addWatchFile)
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
