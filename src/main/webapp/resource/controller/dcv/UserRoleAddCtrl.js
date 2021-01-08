'use strict';

App.controller('UserRoleAddController', ['CommonService', '$state', '$stateParams', function(CommonService, $state, $stateParams) {
	var vm = this;
    
    vm.totalItems = 0;
	vm.pageNumber = 1;
    
	vm.userRole = {};
	vm.viewOnly = false;
    
	if(CommonService.isNotEmpty($stateParams.USER_ID)){
		if ($stateParams.dataUserRole != undefined) {
			vm.userRole = $stateParams.dataUserRole;
			//console.log(JSON.stringify(vm.userRole));
		}
		else{
			getUserRole($stateParams.USER_ID);
		}
		
		if($stateParams.STATE==CommonService.VIEWONLY){
			vm.viewOnly = true;
		}
		
		loadRole();
	}
	
    /**BUTTON ACTION**/
    vm.backToIndex = function() {
		window.history.back();
	}
    
	vm.saveUserRole = function(invalid) {
		if (invalid == false) {
            vm.userRole.ROLE_ID = vm.role.ROLE_ID;
			CommonService.modalAlert('confirmation', 'Are you sure want to add this role?')
            .then(function(result) {
				CommonService.createResource('userRole', vm)
				.then(function(result){
//				   $state.go('home.user-role');
                    getUserRole($stateParams.USER_ID);
				});    
			});
		}
	}
    vm.deleteUserRole = function(userRole) {
		CommonService.modalAlert('confirmation', 'Are you sure want to delete this data?')
		.then(function(result) {
			CommonService.deleteResourceWithParameter('userRole', userRole)
			.then(function(result){
				getUserRole($stateParams.USER_ID);
			});
		});
	}
	
	/**SERVICE**/
	function getUserRole(userId){
		CommonService.listResource('userRole/'+userId)
		.then(function(data){
			vm.userRole = data.userRole;
			//console.log(JSON.stringify(vm.userRole));
		});
	}
    
	function loadRole(){
		var paramData = {min : 0, 
			max : 100};
		/** CommonService.listResource('role', paramData)
		.then(function(data){
			vm.roleList = data.roleList;
			console.log(JSON.stringify(vm.roleList));
		}); **/
		
		CommonService.getMenuManual('./dist/json/role.json')
		.then(function(data){
			vm.roleList = data.data;
		});
	}
	
}]);
