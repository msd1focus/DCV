/**loading bar**/
App.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
	cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
	cfpLoadingBarProvider.spinnerTemplate = '<div id="loading" data-loading>'
		+'<img id="loading-image" src="resource/images/loading.gif" alt="Loading..." /></div>';
}]);

/**growl**/
App.config(['growlProvider', function(growlProvider){
	growlProvider.globalTimeToLive(10 * 1000);
	growlProvider.globalDisableCountDown(true);
}]);