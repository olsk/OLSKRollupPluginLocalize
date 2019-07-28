import { throws, deepEqual } from 'assert';

import * as mainModule from './main.js';

describe('OLSKRollupI18NExtractOLSKLocalizedConstants', function testOLSKRollupI18NExtractOLSKLocalizedConstants() {

	it('returns array', function() {
		deepEqual(mainModule.OLSKRollupI18NExtractOLSKLocalizedConstants(), []);
	});

	it('matches single quotes', function() {
		deepEqual(mainModule.OLSKRollupI18NExtractOLSKLocalizedConstants("window.OLSKLocalized('Alfa')"), [
			'Alfa',
			]);
	});

	it('matches double quotes', function() {
		deepEqual(mainModule.OLSKRollupI18NExtractOLSKLocalizedConstants('window.OLSKLocalized("Alfa")'), [
			'Alfa',
			]);
	});

	it('matches backticks', function() {
		deepEqual(mainModule.OLSKRollupI18NExtractOLSKLocalizedConstants('window.OLSKLocalized(`Alfa`)'), [
			'Alfa',
			]);
	});

	it('matches partial', function() {
		deepEqual(mainModule.OLSKRollupI18NExtractOLSKLocalizedConstants('window.OLSKLocalized(`Alfa${ Bravo }`)'), [
			'Alfa',
			]);
			]);
	});

	it('extracts single', function() {
		deepEqual(mainModule.OLSKRollupI18NExtractOLSKLocalizedConstants("window.OLSKLocalized('Alfa')"), [
			'Alfa',
			]);
	});

	it('extracts multiple', function() {
		deepEqual(mainModule.OLSKRollupI18NExtractOLSKLocalizedConstants("window.OLSKLocalized('Alfa'),window.OLSKLocalized('Bravo')"), [
			'Alfa',
			'Bravo',
			]);
	});

});

describe('OLSKRollupI18NExtractMatchingIdentifiers', function testOLSKRollupI18NExtractMatchingIdentifiers() {

	it('throws if param1 not array', function () {
		throws(function () {
			mainModule.OLSKRollupI18NReplaceInternationalizationToken(null, {});
		}, /OLSKErrorInputInvalid/);
	});

	it('throws if param2 not object', function () {
		throws(function () {
			mainModule.OLSKRollupI18NReplaceInternationalizationToken([], null);
		}, /OLSKErrorInputInvalid/);
	});

	it('returns object', function() {
		deepEqual(mainModule.OLSKRollupI18NExtractMatchingIdentifiers([], {}), {});
	});

	it('excludes non-matching', function() {
		deepEqual(mainModule.OLSKRollupI18NExtractMatchingIdentifiers(['alfa'], {
			bravo: 'charlie',
		}), {});
	});

	it('includes full match', function() {
		deepEqual(mainModule.OLSKRollupI18NExtractMatchingIdentifiers(['alfa'], {
			alfa: 'bravo',
		}), {
			alfa: 'bravo',
		});
	});

	it('includes head match', function() {
		deepEqual(mainModule.OLSKRollupI18NExtractMatchingIdentifiers(['alfa'], {
			alfabravo: 'charlie',
		}), {
			alfabravo: 'charlie',
		});
	});

	it('excludes non-head match', function() {
		deepEqual(mainModule.OLSKRollupI18NExtractMatchingIdentifiers(['alfa'], {
			bravoalfa: 'charlie',
		}), {});
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

	it('returns null if no token', function() {
		deepEqual(mainModule.OLSKRollupI18NReplaceInternationalizationToken({
			code: 'alfa',
		}, {}), null);
	});

	it('replaces token single', function() {
		deepEqual(mainModule.OLSKRollupI18NReplaceInternationalizationToken({
			code: mainModule.OLSKRollupI18NInternationalizationToken,
		}, {
			alfa: 'bravo',
		}), {
			code: "JSON.parse(`{\"alfa\":\"bravo\"}`)",
		});
	});

	it('replaces token multiple', function() {
		deepEqual(mainModule.OLSKRollupI18NReplaceInternationalizationToken({
			code: `${ mainModule.OLSKRollupI18NInternationalizationToken }, ${ mainModule.OLSKRollupI18NInternationalizationToken }`,
		}, {
			alfa: 'bravo',
		}), {
			code: "JSON.parse(`{\"alfa\":\"bravo\"}`), JSON.parse(`{\"alfa\":\"bravo\"}`)",
		});
	});

	it('escapes newlines', function() {
		deepEqual(mainModule.OLSKRollupI18NReplaceInternationalizationToken({
			code: mainModule.OLSKRollupI18NInternationalizationToken,
		}, {
			alfa: 'bravo\n',
		}), {
			code: "JSON.parse(`{\"alfa\":\"bravo\\\\n\"}`)",
		});
	});

	it('escapes return', function() {
		deepEqual(mainModule.OLSKRollupI18NReplaceInternationalizationToken({
			code: mainModule.OLSKRollupI18NInternationalizationToken,
		}, {
			alfa: 'bravo\r',
		}), {
			code: "JSON.parse(`{\"alfa\":\"bravo\\\\r\"}`)",
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

	it('outputs map if specified', function() {
		deepEqual(typeof mainModule.OLSKRollupI18NReplaceInternationalizationToken({
			code: mainModule.OLSKRollupI18NInternationalizationToken,
			map: true,
		}, {}).map, 'object');
	});

});
