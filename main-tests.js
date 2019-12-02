const { throws, deepEqual } = require('assert');

const mainModule = require('./main.js');

describe('OLSKRollupLocalizeExtractOLSKLocalizedConstants', function testOLSKRollupLocalizeExtractOLSKLocalizedConstants() {
	it('throws if not string', function () {
		throws(function () {
			mainModule.OLSKRollupLocalizeExtractOLSKLocalizedConstants(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mainModule.OLSKRollupLocalizeExtractOLSKLocalizedConstants(''), []);
	});

	it('matches single quotes', function() {
		deepEqual(mainModule.OLSKRollupLocalizeExtractOLSKLocalizedConstants("window.OLSKLocalized('Alfa')"), [
			'Alfa',
		]);
	});

	it('matches double quotes', function() {
		deepEqual(mainModule.OLSKRollupLocalizeExtractOLSKLocalizedConstants('window.OLSKLocalized("Alfa")'), [
			'Alfa',
		]);
	});

	it('matches backticks', function() {
		deepEqual(mainModule.OLSKRollupLocalizeExtractOLSKLocalizedConstants('window.OLSKLocalized(`Alfa`)'), [
			'Alfa',
		]);
	});

	it('matches partial', function() {
		deepEqual(mainModule.OLSKRollupLocalizeExtractOLSKLocalizedConstants('window.OLSKLocalized(`Alfa${ Bravo }`)'), [
			'Alfa',
		]);
	});

	it('matches dynamic', function() {
		deepEqual(mainModule.OLSKRollupLocalizeExtractOLSKLocalizedConstants("window.OLSKLocalized(alfa ? 'Bravo' : 'Charlie')"), [
			'Bravo',
			'Charlie',
		]);
	});

	it('extracts single', function() {
		deepEqual(mainModule.OLSKRollupLocalizeExtractOLSKLocalizedConstants("window.OLSKLocalized('Alfa')"), [
			'Alfa',
		]);
	});

	it('extracts multiple', function() {
		deepEqual(mainModule.OLSKRollupLocalizeExtractOLSKLocalizedConstants("window.OLSKLocalized('Alfa'),window.OLSKLocalized('Bravo')"), [
			'Alfa',
			'Bravo',
		]);
	});

});

describe('OLSKRollupLocalizeExtractMatchingIdentifiers', function testOLSKRollupLocalizeExtractMatchingIdentifiers() {

	it('throws if param1 not array', function () {
		throws(function () {
			mainModule.OLSKRollupLocalizeReplaceInternationalizationToken(null, {});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not object', function () {
		throws(function () {
			mainModule.OLSKRollupLocalizeReplaceInternationalizationToken([], null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function() {
		deepEqual(mainModule.OLSKRollupLocalizeExtractMatchingIdentifiers([], {}), {});
	});

	it('excludes non-matching', function() {
		deepEqual(mainModule.OLSKRollupLocalizeExtractMatchingIdentifiers(['alfa'], {
			bravo: 'charlie',
		}), {});
	});

	it('includes full match', function() {
		deepEqual(mainModule.OLSKRollupLocalizeExtractMatchingIdentifiers(['alfa'], {
			alfa: 'bravo',
		}), {
			alfa: 'bravo',
		});
	});

	it('includes head match', function() {
		deepEqual(mainModule.OLSKRollupLocalizeExtractMatchingIdentifiers(['alfa'], {
			alfabravo: 'charlie',
		}), {
			alfabravo: 'charlie',
		});
	});

	it('excludes non-head match', function() {
		deepEqual(mainModule.OLSKRollupLocalizeExtractMatchingIdentifiers(['alfa'], {
			bravoalfa: 'charlie',
		}), {});
	});

});

describe('OLSKRollupLocalizeReplaceInternationalizationToken', function OLSKRollupLocalizeReplaceInternationalizationToken() {
	it('throws if param1 not object', function () {
		throws(function () {
			mainModule.OLSKRollupLocalizeReplaceInternationalizationToken(null, {});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param1 without object.code', function () {
		throws(function () {
			mainModule.OLSKRollupLocalizeReplaceInternationalizationToken({}, {});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not object', function () {
		throws(function () {
			mainModule.OLSKRollupLocalizeReplaceInternationalizationToken({
				code: 'alfa',
			}, null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns null if no token', function() {
		deepEqual(mainModule.OLSKRollupLocalizeReplaceInternationalizationToken({
			code: 'alfa',
		}, {}), null);
	});

	it('replaces token single', function() {
		deepEqual(mainModule.OLSKRollupLocalizeReplaceInternationalizationToken({
			code: mainModule.OLSKRollupLocalizeInternationalizationToken,
		}, {
			alfa: 'bravo',
		}), {
			code: "JSON.parse(`{\"alfa\":\"bravo\"}`)",
		});
	});

	it('replaces token multiple', function() {
		deepEqual(mainModule.OLSKRollupLocalizeReplaceInternationalizationToken({
			code: `${ mainModule.OLSKRollupLocalizeInternationalizationToken }, ${ mainModule.OLSKRollupLocalizeInternationalizationToken }`,
		}, {
			alfa: 'bravo',
		}), {
			code: "JSON.parse(`{\"alfa\":\"bravo\"}`), JSON.parse(`{\"alfa\":\"bravo\"}`)",
		});
	});

	it('replaces token multiple [3]', function() { // testing two is insufficient
		deepEqual(mainModule.OLSKRollupLocalizeReplaceInternationalizationToken({
			code: `${ mainModule.OLSKRollupLocalizeInternationalizationToken }, ${ mainModule.OLSKRollupLocalizeInternationalizationToken }, ${ mainModule.OLSKRollupLocalizeInternationalizationToken }`,
		}, {
			alfa: 'bravo',
		}), {
			code: "JSON.parse(`{\"alfa\":\"bravo\"}`), JSON.parse(`{\"alfa\":\"bravo\"}`), JSON.parse(`{\"alfa\":\"bravo\"}`)",
		});
	});

	it('escapes newlines', function() {
		deepEqual(mainModule.OLSKRollupLocalizeReplaceInternationalizationToken({
			code: mainModule.OLSKRollupLocalizeInternationalizationToken,
		}, {
			alfa: 'bravo\n',
		}), {
			code: "JSON.parse(`{\"alfa\":\"bravo\\\\n\"}`)",
		});
	});

	it('escapes return', function() {
		deepEqual(mainModule.OLSKRollupLocalizeReplaceInternationalizationToken({
			code: mainModule.OLSKRollupLocalizeInternationalizationToken,
		}, {
			alfa: 'bravo\r',
		}), {
			code: "JSON.parse(`{\"alfa\":\"bravo\\\\r\"}`)",
		});
	});

	it('escapes backticks', function() {
		deepEqual(mainModule.OLSKRollupLocalizeReplaceInternationalizationToken({
			code: mainModule.OLSKRollupLocalizeInternationalizationToken,
		}, {
			alfa: '`bravo`',
		}), {
			code: "JSON.parse(`{\"alfa\":\"\\\`bravo\\\`\"}`)",
		});
	});

	it('outputs map if specified', function() {
		deepEqual(typeof mainModule.OLSKRollupLocalizeReplaceInternationalizationToken({
			code: mainModule.OLSKRollupLocalizeInternationalizationToken,
			map: true,
		}, {}).map, 'object');
	});

});
