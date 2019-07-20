import { throws, deepEqual } from 'assert';

import * as mainModule from './main.js';

describe('OLSKRollupI18NExtractOLSKLocalizedIdentifiers', function testOLSKRollupI18NExtractOLSKLocalizedIdentifiers() {

	it('returns array', function() {
		deepEqual(mainModule.OLSKRollupI18NExtractOLSKLocalizedIdentifiers(), []);
	});

	it('extracts single', function() {
		deepEqual(mainModule.OLSKRollupI18NExtractOLSKLocalizedIdentifiers("window.OLSKLocalized('Alfa')"), [
			'Alfa'
			]);
	});

	it('extracts multiple', function() {
		deepEqual(mainModule.OLSKRollupI18NExtractOLSKLocalizedIdentifiers("window.OLSKLocalized('Alfa'),window.OLSKLocalized('Bravo')"), [
			'Alfa',
			'Bravo',
			]);
	});

});
