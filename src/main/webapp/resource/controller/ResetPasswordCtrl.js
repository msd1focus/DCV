'use strict';

App.controller('ResetPasswordController', ['CommonService', '$state', function(CommonService, $state) {
	var vm = this;
	
	vm.showCurrentPassword = true;
	
	/**button**/
	/**invoked when back button is clicked**/
	vm.backToIndex = function(){
		window.history.back();
	}
	
	/**invoked when change button is clicked**/
	vm.changePassword = function(valid){
		if(valid){
			var paramData = {input : {
					"currentPassword" : vm.CURRENT_PASSWORD,
					"newPassword" : vm.NEW_PASSWORD,
					"userId" : CommonService.getUserId(),
					"updateBy" : CommonService.getUsername()
					}
				};
//			CommonService.exec("soa.entity.user:resetPassword", paramData)
//			.then(
//				function(data){
//					var isSuccess = CommonService.showGrowlReponse(data.output.response);
//					if(isSuccess)window.history.back();
//				},
//				function(data){
//					CommonService.showGrowl(CommonService.ERROR, CommonService.INTERNALERROR);
//				}
//			);
			
		}
	}
	
	/**util**/
	function clearText(){
		vm.CURRENT_PASSWORD = undefined;
		vm.NEW_PASSWORD = undefined;
		vm.NEW_PASSWORD_RETYPE = undefined;
	}
	
}]);
