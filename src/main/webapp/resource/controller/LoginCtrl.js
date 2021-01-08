'use strict';

App.controller('LoginController', ['CommonService', '$state', '$rootScope', '$cookies', '$localStorage','LogServices',
		function(CommonService, $state, $rootScope, $cookies, $localStorage, LogServices) {
	
	var vm = this;
	vm.userLogin = {};
	vm.validLogin = false;
	vm.message = "";
	vm.userProfile = {};
	vm.keepSign = true;
	
	vm.callback = function() {
		if ($rootScope.authenticated) {
    		vm.error = false;
    		goToWelcome();
		} 
		else {
	     	vm.error = true;
	     	$state.go('login');
		}
	}
	
	checkSession();
	
	/**TODO FIX IT**/
	function checkSession(){
		var token = $cookies.get(CommonService.TOKEN);
		if(CommonService.isNotEmpty(token)){
			goToWelcome();
		}
	}
	
	function authenticate (callback) {
		CommonService.doPost('/loginDCV', vm.userLogin)
		.then(
			function(data){
				if (data != undefined 
						&& data.userProfile != undefined){
					console.log(JSON.stringify(data.userProfile));
					populateValidData(data);
					remindExpirePassword(data);
					//add Rochiyat
					LogServices.log("Login","login")
				} else {
					vm.message = "UserName atau Password tidak sesuai";
					//alert("UserName atau Password tidak sesuai");
					populateInvalidData();
				}
				callback && callback();
				
			},
			function(){
				vm.message = "There was an error while login";
				populateInvalidData();
				callback && callback();
			}
		);
    }

	/**button**/
	vm.submitFormLogin = function (invalid) {
		if(!invalid){
			authenticate(vm.callback);
		}else{
			vm.message = "There was an error while login";
		}
    };
    
    function populateValidData(data){
    	CommonService.populateValidData(data.userProfile);
		vm.validLogin = true;
    }
    
    function populateInvalidData(){
    	vm.validLogin = false;
		$rootScope.authenticated = false;
    }
    
    function goToWelcome(){
    	$state.go('home.staticDashboard');
    	//$state.go('home.user');
    }
    
    /**show growl if password is lessthan 7 days**/
    function remindExpirePassword(data){
    	var expire = data.userProfile.expiredPassword;
    	if(expire>0
    			&& expire<=7){
    		var dayMessage = expire>0 ? expire+" days" : expire+" day";
    		var message = "Your Password Will Expire in "+ dayMessage;
    		CommonService.showGrowl(CommonService.WARNING, message)
    	}
    }
    
    
}]);
