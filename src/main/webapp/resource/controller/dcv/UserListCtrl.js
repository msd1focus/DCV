'use strict';

App.controller('UserListController', ['CommonService', '$state', function(CommonService, $state) {
	var vm = this;
	
	vm.totalItems = 0;
	vm.pageNumber = 1;
    vm.itemPerpage = 25;
	vm.maxSize = 7;
    
	loadData();
	
	/**button**/
	
	/**
	 * invoked when paging is clicked
	 */
	vm.pageChanged = function() {
		loadData();
	}
	
	vm.addUser = function() {
		$state.go('home.user-add');
	}
	
	vm.editUser = function(user) {
		$state.go('home.user-add', {userId : user.USER_ID});
	}
	
	vm.viewUser = function(user) {
		$state.go('home.user-add', {userId : user.USER_ID, state : "viewOnly"});
	}
	
	vm.deleteUser = function(user) {
		CommonService.modalAlert('confirmation', 'Are you sure want to delete this data?')
		.then(function(result) {
			CommonService.deleteResource('user/'+user.USER_ID)
			.then(
				function(result){
					CommonService.showGrowl(CommonService.SUCCESS, CommonService.SUCCESS);
					loadData();
				},
				function(result){
					CommonService.showGrowl(CommonService.WARNING, CommonService.INTERNALERROR);
				}
			);
		});
	}
	
	/**load data user**/
	function loadData() {
		var paramData = {"min" : CommonService.calculateOffset(vm.itemPerpage, vm.pageNumber), 
				"max" : (vm.itemPerpage * vm.pageNumber)
			};
		/** CommonService.listResource('user', paramData)
		.then(function(data){
			console.log("User = "+JSON.stringify(data));
			vm.userList = data.userList;
			vm.totalItems = data.TOTAL;
		}); **/
		
		/*CommonService.getMenuManual('./dist/json/userList.json')
		.then(function(data){
			//console.log(JSON.stringify(data.data));
			vm.userList = data.data;
			vm.totalItems = 6;
		});*/
		
		CommonService.doPost('/dcvUsers')
  		.then(
  			function(data){
  				//console.log(JSON.stringify(data));
  				vm.userList = data;
  			}
  		);
	}
	
}]);
