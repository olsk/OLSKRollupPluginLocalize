import * as assert from 'assert';

import * as mainModule from './main.js';

describe('ExtractOLSKLocalized', function testExtractOLSKLocalized() {

	it('returns array', function() {
		assert.deepEqual(mainModule.ExtractOLSKLocalized(), []);
	});

	it('extracts single', function() {
		assert.deepEqual(mainModule.ExtractOLSKLocalized("window.OLSKLocalized('Alfa')"), [
			'Alfa'
			]);
	});

	it('extracts multiple', function() {
		assert.deepEqual(mainModule.ExtractOLSKLocalized("window.OLSKLocalized('Alfa'),window.OLSKLocalized('Bravo')"), [
			'Alfa',
			'Bravo',
			]);
	});

});
