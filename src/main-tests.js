import { deepEqual } from 'assert';

import * as mainModule from './main.js';

describe('ExtractOLSKLocalized', function testExtractOLSKLocalized() {

	it('returns array', function() {
		deepEqual(mainModule.ExtractOLSKLocalized(), []);
	});

	it('extracts single', function() {
		deepEqual(mainModule.ExtractOLSKLocalized("window.OLSKLocalized('Alfa')"), [
			'Alfa'
			]);
	});

	it('extracts multiple', function() {
		deepEqual(mainModule.ExtractOLSKLocalized("window.OLSKLocalized('Alfa'),window.OLSKLocalized('Bravo')"), [
			'Alfa',
			'Bravo',
			]);
	});

});
