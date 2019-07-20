//# OLSKMochaReplaceES6Import

(function OLSKMochaReplaceES6Import() {
	require('OLSKTesting')._OLSKTestingMochaReplaceES6Import();
})();

//# OLSKMochaErrors

(function OLSKMochaErrors() {
	process.on('unhandledRejection', () => {
		// console.log('Unhandledd Rejection at:', arguments)
		// Recommended: send the information to sentry.io
		// or whatever crash reporting service you use
	});
})();
