'use strict';

App.controller('WelcomeController', ['$interval', '$scope', 'CommonService', 'parentCtrl', function($interval, $scope, CommonService, parentCtrl) {
	var vm = this;
	vm.username = CommonService.getUsername();
	vm.windowHeight = document.body.clientHeight - 250;
	
	vm.ping = function(){
		CommonService.informIdModal("SUCCESS CREATE SI NO", "asdas")
		.then(function(data){
			window.history.back();
		});
	}	
}]);
