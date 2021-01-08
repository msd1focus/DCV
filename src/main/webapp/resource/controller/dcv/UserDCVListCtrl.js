'use strict';

App.controller('UserDCVListController', ['$window', '$state', '$scope', 'CommonService', 'DTOptionsBuilder', '$uibModal',
				function($window, $state, $scope, CommonService, DTOptionsBuilder, $uibModal) {
	
	var vm = this;
	
	/*--- Variables ---*/
	vm.user = {};
	
	//Initiate for Angular-DataTable
	vm.dtOptions = DTOptionsBuilder.newOptions()
					.withOption('paging', true)
				    .withOption('scrollCollapse', true)
				    .withOption('sort', false)
				    .withOption('lengthMenu', [[5], [5]])
					.withDisplayLength(5)
				    .withOption('sDom', 'lrtip')
				    .withOption('lengthChange', false)
	
	
	/*--- Function-function ---*/
	init();
	
	vm.loadSelected = function() {
		CommonService.doPost('/getUserByUserName', vm.user)
  		.then(
  			function(data){
  				//console.log(JSON.stringify(data));
  				vm.userList = data;
  			}
  		);
	}
	
	vm.editUser = function(data) {
		$state.go('home.user-update', {dataUserEdit: data});
	}
	
	vm.uploadUser = function() {
		$state.go('home.user-add');
	}
	
	function init() {
		CommonService.doPost('/dcvUsers')
  		.then(
  			function(data){
  				//console.log(JSON.stringify(data));
  				vm.userList = data;
  			}
  		);
	}
}]);