import { createFilter } from 'rollup-pluginutils';
import MagicString from 'magic-string';

import * as OLSKInternational from 'OLSKInternational';

import globPackage from 'glob';
import pathPackage from 'path';
import jsYAMLPackage from 'js-yaml';

import { OLSKRollupI18NExtractOLSKLocalizedIdentifiers } from './main.js';

export default function i18nPlugin( options = {} ) {
  const filter = createFilter( options.include, options.exclude );
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
			
			OLSKRollupI18NExtractOLSKLocalizedIdentifiers(code).forEach(function (e) {
				if (matchedContstants.indexOf(e) !== -1) {
					return;
				}

				matchedContstants.push(e);
			})

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
