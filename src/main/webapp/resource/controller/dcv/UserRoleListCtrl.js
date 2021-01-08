'use strict';

App.controller('UserRoleListController', ['CommonService', '$state', function(CommonService, $state) {
	var vm = this;
	
	vm.totalItems = 0;
	vm.pageNumber = 1;
    vm.itemPerpage = 10;
	vm.maxSize = 7;
    
	loadData();
	
    vm.viewUserRole = function(userRole) {
		$state.go('home.user-role-add', {dataUserRole: userRole, USER_ID : userRole.USER_ID, STATE : CommonService.VIEWONLY});
	}
    
	vm.editUserRole = function(userRole){
		$state.go('home.user-role-add', {dataUserRole: userRole, USER_ID : userRole.USER_ID});
	}
	
	vm.pageChanged = function() {
		loadData();
	}
	
	/**SERVICE**/
	function loadData() {
		var paramData = {min : CommonService.calculateOffset(vm.itemPerpage, vm.pageNumber), 
			max : (vm.itemPerpage * vm.pageNumber)};
		/** CommonService.listResource('userRole', paramData)
		.then(function(data){
			vm.userRoleList = data.userRoleList;
			console.log(JSON.stringify(vm.userRoleList));
			vm.totalItems = data.TOTAL;
		}); **/
		
		CommonService.getMenuManual('./dist/json/userRole.json')
		.then(function(data){
			vm.userRoleList = data.data;
			vm.totalItems = 3;
		});
	}
	
}]);
