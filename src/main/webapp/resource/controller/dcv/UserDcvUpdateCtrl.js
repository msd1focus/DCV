'use strict';

App.controller('UserDCVUpdateController', ['CommonService', '$state', '$stateParams', function(CommonService, $state, $stateParams) {
	var vm = this;
	
	/*--- Variables ---*/
	vm.user = $stateParams.dataUserEdit;
	console.log(JSON.stringify(vm.user));
	vm.jenisDivisi = [
		{ "PARAM_NAME": "MIS ADMIN", "PARAM_VALUE": "MIS ADMIN" },
		{ "PARAM_NAME": "PROMO", "PARAM_VALUE": "PROMO" },
		{ "PARAM_NAME": "TC", "PARAM_VALUE": "TC" },
		{ "PARAM_NAME": "TAX", "PARAM_VALUE": "TAX" },
		{ "PARAM_NAME": "SALES", "PARAM_VALUE": "SALES" },
		{ "PARAM_NAME": "AP", "PARAM_VALUE": "AP" },
		{ "PARAM_NAME": "AR", "PARAM_VALUE": "AR" },
		{ "PARAM_NAME": "DISTRIBUTOR", "PARAM_VALUE": "DISTRIBUTOR" }
	];
	vm.jenisSPV = [
		{ "PARAM_NAME": "Direksi", "PARAM_VALUE": "12" },
		{ "PARAM_NAME": "Manager Area", "PARAM_VALUE": "1" }
	];
	
	/*--- Function-function ---*/
	init();
	
	vm.back = function() {
		$state.go('home.user');
	}
	
	vm.update = function() {
		//TODO: panggil store proc atau gunakan JPA
	}
	
	function init() {
		angular.forEach(vm.jenisDivisi, function(value){
			if(value.PARAM_NAME == vm.user.userDivision) {
				vm.userDivision = value;
			}
		});
		angular.forEach(vm.jenisSPV, function(value){
			if(value.PARAM_NAME == vm.user.directSpvId) {
				vm.directSpvId = value;
			}
		})
	}
}]);