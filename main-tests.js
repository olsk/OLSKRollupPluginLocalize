const { throws, deepEqual } = require('assert');

const mod = require('./main.js');

describe('OLSKRollupLocalizeExtractOLSKLocalizedConstants', function test_OLSKRollupLocalizeExtractOLSKLocalizedConstants() {
	it('throws if not string', function () {
		throws(function () {
			mod.OLSKRollupLocalizeExtractOLSKLocalizedConstants(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mod.OLSKRollupLocalizeExtractOLSKLocalizedConstants(''), []);
	});

	it('matches single quotes', function() {
		deepEqual(mod.OLSKRollupLocalizeExtractOLSKLocalizedConstants("window.OLSKLocalized('Alfa')"), [
			'Alfa',
		]);
	});

	it('matches double quotes', function() {
		deepEqual(mod.OLSKRollupLocalizeExtractOLSKLocalizedConstants('window.OLSKLocalized("Alfa")'), [
			'Alfa',
		]);
	});

	it('matches backticks', function() {
		deepEqual(mod.OLSKRollupLocalizeExtractOLSKLocalizedConstants('window.OLSKLocalized(`Alfa`)'), [
			'Alfa',
		]);
	});

	it('matches partial', function() {
		deepEqual(mod.OLSKRollupLocalizeExtractOLSKLocalizedConstants('window.OLSKLocalized(`Alfa${ Bravo }`)'), [
			'Alfa',
		]);
	});

	it('matches dynamic', function() {
		deepEqual(mod.OLSKRollupLocalizeExtractOLSKLocalizedConstants("window.OLSKLocalized(alfa ? 'Bravo' : 'Charlie')"), [
			'Bravo',
			'Charlie',
		]);
	});

	it('extracts single', function() {
		deepEqual(mod.OLSKRollupLocalizeExtractOLSKLocalizedConstants("window.OLSKLocalized('Alfa')"), [
			'Alfa',
		]);
	});

	it('extracts multiple', function() {
		deepEqual(mod.OLSKRollupLocalizeExtractOLSKLocalizedConstants("window.OLSKLocalized('Alfa'),window.OLSKLocalized('Bravo')"), [
			'Alfa',
			'Bravo',
		]);
	});

});

describe('OLSKRollupLocalizeExtractMatchingIdentifiers', function test_OLSKRollupLocalizeExtractMatchingIdentifiers() {

	it('throws if param1 not array', function () {
		throws(function () {
			mod.OLSKRollupLocalizeReplaceInternationalizationToken(null, {});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not object', function () {
		throws(function () {
			mod.OLSKRollupLocalizeReplaceInternationalizationToken([], null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function() {
		deepEqual(mod.OLSKRollupLocalizeExtractMatchingIdentifiers([], {}), {});
	});

	it('excludes non-matching', function() {
		deepEqual(mod.OLSKRollupLocalizeExtractMatchingIdentifiers(['alfa'], {
			bravo: 'charlie',
		}), {});
	});

	it('includes full match', function() {
		deepEqual(mod.OLSKRollupLocalizeExtractMatchingIdentifiers(['alfa'], {
			alfa: 'bravo',
		}), {
			alfa: 'bravo',
		});
	});

	it('includes head match', function() {
		deepEqual(mod.OLSKRollupLocalizeExtractMatchingIdentifiers(['alfa'], {
			alfabravo: 'charlie',
		}), {
			alfabravo: 'charlie',
		});
	});

	it('excludes non-head match', function() {
		deepEqual(mod.OLSKRollupLocalizeExtractMatchingIdentifiers(['alfa'], {
			bravoalfa: 'charlie',
		}), {});
	});

});

describe('OLSKRollupLocalizeReplaceInternationalizationToken', function OLSKRollupLocalizeReplaceInternationalizationToken() {
	it('throws if param1 not object', function () {
		throws(function () {
			mod.OLSKRollupLocalizeReplaceInternationalizationToken(null, {});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param1 without object.code', function () {
		throws(function () {
			mod.OLSKRollupLocalizeReplaceInternationalizationToken({}, {});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not object', function () {
		throws(function () {
			mod.OLSKRollupLocalizeReplaceInternationalizationToken({
				code: 'alfa',
			}, null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns null if no token', function() {
		deepEqual(mod.OLSKRollupLocalizeReplaceInternationalizationToken({
			code: 'alfa',
		}, {}), null);
	});

	it('replaces token single', function() {
		deepEqual(mod.OLSKRollupLocalizeReplaceInternationalizationToken({
			code: mod.OLSKRollupLocalizeInternationalizationToken,
		}, {
			alfa: 'bravo',
		}), {
			code: "JSON.parse(`{\"alfa\":\"bravo\"}`)",
		});
	});

	it('replaces token multiple', function() {
		deepEqual(mod.OLSKRollupLocalizeReplaceInternationalizationToken({
			code: `${ mod.OLSKRollupLocalizeInternationalizationToken }, ${ mod.OLSKRollupLocalizeInternationalizationToken }`,
		}, {
			alfa: 'bravo',
		}), {
			code: "JSON.parse(`{\"alfa\":\"bravo\"}`), JSON.parse(`{\"alfa\":\"bravo\"}`)",
		});
	});

	it('replaces token multiple [3]', function() { // testing two is insufficient
		deepEqual(mod.OLSKRollupLocalizeReplaceInternationalizationToken({
			code: `${ mod.OLSKRollupLocalizeInternationalizationToken }, ${ mod.OLSKRollupLocalizeInternationalizationToken }, ${ mod.OLSKRollupLocalizeInternationalizationToken }`,
		}, {
			alfa: 'bravo',
		}), {
			code: "JSON.parse(`{\"alfa\":\"bravo\"}`), JSON.parse(`{\"alfa\":\"bravo\"}`), JSON.parse(`{\"alfa\":\"bravo\"}`)",
		});
	});

	it('escapes newlines', function() {
		deepEqual(mod.OLSKRollupLocalizeReplaceInternationalizationToken({
			code: mod.OLSKRollupLocalizeInternationalizationToken,
		}, {
			alfa: 'bravo\n',
		}), {
			code: "JSON.parse(`{\"alfa\":\"bravo\\\\n\"}`)",
		});
	});

	it('escapes return', function() {
		deepEqual(mod.OLSKRollupLocalizeReplaceInternationalizationToken({
			code: mod.OLSKRollupLocalizeInternationalizationToken,
		}, {
			alfa: 'bravo\r',
		}), {
			code: "JSON.parse(`{\"alfa\":\"bravo\\\\r\"}`)",
		});
	});

	it('escapes backticks', function() {
		deepEqual(mod.OLSKRollupLocalizeReplaceInternationalizationToken({
			code: mod.OLSKRollupLocalizeInternationalizationToken,
		}, {
			alfa: '`bravo`',
		}), {
			code: "JSON.parse(`{\"alfa\":\"\\\`bravo\\\`\"}`)",
		});
	});

	it('outputs map if specified', function() {
		deepEqual(typeof mod.OLSKRollupLocalizeReplaceInternationalizationToken({
			code: mod.OLSKRollupLocalizeInternationalizationToken,
			map: true,
		}, {}).map, 'object');
	});

});
