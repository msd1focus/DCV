'use strict';

App.controller('RoleListController', ['CommonService', '$state', function(CommonService, $state) {
	var vm = this;
	
	vm.totalItems = 0;
	vm.pageNumber = 1;
    vm.itemPerpage = 25;
	vm.maxSize = 7;
	
	loadData();
	
	/**BUTTON**/
	vm.pageChanged = function() {
		loadData();
	}
	
	vm.addRole = function() {
		$state.go('home.role-add');
	}
	
	vm.editRole = function(role) {
		$state.go('home.role-add', {dataRole: role, ROLE_ID : role.ROLE_ID, STATE : CommonService.EDIT});
	}
	
    vm.viewRole = function(role) {
		$state.go('home.role-add', {dataRole: role, ROLE_ID : role.ROLE_ID, STATE : CommonService.VIEWONLY});
	}
	
	vm.deleteRole = function(role) {
		CommonService.modalAlert('confirmation', 'Are you sure want to delete this data?')
		.then(function(result) {
			CommonService.deleteResource('role/'+role.ROLE_ID, role)
			.then(function(result){
				loadData();
			});
		});
	}
	
	/**SERVICE**/
	function loadData() {
		var paramData = {min : CommonService.calculateOffset(vm.itemPerpage, vm.pageNumber), 
			max : (vm.itemPerpage * vm.pageNumber)};
		/** CommonService.listResource('role', paramData)
		.then(function(data){
			vm.roleList = data.roleList;
			vm.totalItems = data.TOTAL;
		}); **/
		
		CommonService.getMenuManual('./dist/json/role.json')
		.then(function(data){
			vm.roleList = data.data;
			vm.totalItems = 4;
		});
	}
	
	
}]);
