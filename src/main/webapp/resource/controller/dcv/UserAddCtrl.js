'use strict';

App.controller('UserAddController', ['CommonService', '$state', '$stateParams', '$uibModal', function(CommonService, $state, $stateParams, $uibModal) {
	var vm = this;
	vm.user = {};
	vm.user.entity = {};
    vm.viewOnly = false;
    vm.userid = undefined;
		
	if(CommonService.isNotEmpty($stateParams.userId)){
		vm.userid = $stateParams.userId;
		getUser();
		if($stateParams.state != undefined
				&& $stateParams.state=='viewOnly'){
			vm.viewOnly = true;
		}
	}
    
	/**button**/
    vm.backToIndex = function() {
        window.history.back();
	}
	
    vm.saveUser = function(invalid) {
		if (!invalid) {
			CommonService.modalAlert('confirmation', 'Are you sure want to submit this data?')
            .then(function(result) {
            	var paramData = {User : vm.user};
                if (vm.user.USER_ID != undefined) {
                	vm.user.CTL_UPD_BY = CommonService.getUsername();
                    CommonService.createResource('user/' + vm.user.USER_ID, paramData)
				    .then(function(result){
                        window.history.back();
				    });
                }else{
                	vm.user.CTL_INS_BY = CommonService.getUsername();
                    CommonService.createResource('user', paramData)
                    .then(function(result){
                        window.history.back();
				    });
                }
			});
		}
	}
	
    /**
     * invoked when click unlocking
     */
    vm.unlock = function(){
    	var paramData = {input : {USERID : vm.user.USER_ID}};
//		CommonService.exec("soa.entity.user:unlockUser", paramData)
//		.then(function(data){
//			vm.isLocked = false;
//		})
    }
    
    /**
	 * force user to logout
	 */
	vm.kick = function(){
		var paramData = {input : {USERID : vm.user.USER_ID}};
//		CommonService.exec("soa.entity.user:kickUser", paramData)
//		.then(function(data){
//			vm.isLogin = false;
//		})
	}
    
	/**
	 * show form for reset user password
	 */
	vm.showModalResetPassword = function(){
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'pages/modal/resetPasswordModal.html',
			controller: 'ResetPasswordUserCtrl',
			controllerAs : 'vm',
			size: 'md',
			resolve : {
				"USER_ID" : function () {
					  return vm.user.USER_ID;
				}
			}
		});
		
		modalInstance.result
		.then(
			function(data){
				window.history.back();
				CommonService.showGrowl(CommonService.SUCCESS, data);
			}
		)
	}
	
	//service
	function getUser(){
		/** CommonService.listResource('user/'+$stateParams.userId)
		.then(function(data){
			vm.user = data.user;
			console.log(JSON.stringify(vm.user));
			setIsLoginAndIsLocked();
		}); **/
		
		CommonService.getMenuManual('./dist/json/'+$stateParams.userId+'.json')
		.then(function(data){
			vm.user = data.data;
			setIsLoginAndIsLocked();
		});
	}
	
	/**util**/
	
	/**
	 * determine isLogin and isLocked
	 */
	function setIsLoginAndIsLocked(){
		vm.isLocked = vm.user.USER_FAILED_LOGIN_ATTEMPT >= 3 ? true : false;
		vm.isLogin = vm.user.IS_LOGIN != 0 ? true : false;
	}
	
	
	
}]);


/**MODAL CONTROLLER**/
App.controller('ResetPasswordUserCtrl', function ($uibModalInstance, CommonService, USER_ID){
	var vm = this;
	
	vm.showCurrentPassword = false;
	
	vm.changePassword = function(valid){
		if(valid){
			var paramData = {input : {
					"newPassword" : vm.NEW_PASSWORD,
					"userId" : USER_ID,
					"updateBy" : CommonService.getUsername()
				}
			};
//			CommonService.exec("soa.entity.user:resetPasswordGeneric", paramData)
//			.then(
//				function(data){
//					$uibModalInstance.close('Password Resetted');
//				},
//				function(){
//					$uibModalInstance.close('Failed to reset password');
//				}
//			);
		}
	}

	
	vm.backToIndex = function(){
		dismiss();
	}
	
	function dismiss(){
		$uibModalInstance.dismiss('cancel');
	}
});