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

describe('OLSKRollupI18NReplaceInternationalizationToken', function OLSKRollupI18NReplaceInternationalizationToken() {
	it('throws if param1 not object', function () {
		throws(function () {
			mainModule.OLSKRollupI18NReplaceInternationalizationToken(null, {});
		}, /OLSKErrorInputInvalid/);
	});

	it('throws if param1 without object.code', function () {
		throws(function () {
			mainModule.OLSKRollupI18NReplaceInternationalizationToken({}, {});
		}, /OLSKErrorInputInvalid/);
	});

	it('throws if param2 not object', function () {
		throws(function () {
			mainModule.OLSKRollupI18NReplaceInternationalizationToken({
			code: 'alfa',
		}, null);
		}, /OLSKErrorInputInvalid/);
	});

	it('returns input', function() {
		deepEqual(mainModule.OLSKRollupI18NReplaceInternationalizationToken({
			code: 'alfa',
		}, {}), {
			code: 'alfa',
		});
	});

	it('outputs map if specified', function() {
		deepEqual(mainModule.OLSKRollupI18NReplaceInternationalizationToken({
			code: 'alfa',
			map: 'bravo',
		}, {}), {
			code: 'alfa',
			map: 'bravo',
		});
	});

	it('replaces token', function() {
		deepEqual(mainModule.OLSKRollupI18NReplaceInternationalizationToken({
			code: mainModule.OLSKRollupI18NInternationalizationToken,
		}, {
			alfa: 'bravo',
		}), {
			code: "JSON.parse(`{\"alfa\":\"bravo\"}`)",
		});
	});

	it('escapes backticks', function() {
		deepEqual(mainModule.OLSKRollupI18NReplaceInternationalizationToken({
			code: mainModule.OLSKRollupI18NInternationalizationToken,
		}, {
			alfa: '`bravo`',
		}), {
			code: "JSON.parse(`{\"alfa\":\"\\\`bravo\\\`\"}`)",
		});
	});

});
