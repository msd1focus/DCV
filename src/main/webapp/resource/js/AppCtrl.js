'use strict';

App.controller('LoginController', ['CommonService', '$state', '$rootScope', '$cookies', '$localStorage','LogServices',
		function(CommonService, $state, $rootScope, $cookies, $localStorage, LogServices) {
	var vm = this;
	console.log("MASUP SINI");
	$state.go("/login");
}]);