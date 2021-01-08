'use strict';

App.controller('LogoutController', ['CommonService', '$state', '$cookies', 'HttpServices','LogServices', 'PoolingService', 'SessionService', '$rootScope',
		function(CommonService, $state, $cookies, HttpServices,LogServices, PoolingService, SessionService, $rootScope) {
	var vm = this;
	
	var token = $cookies.get(CommonService.TOKEN);
	if(CommonService.isNotEmpty(token)){
		logout();
	} else{
		PoolingService.stopPooling();
		SessionService.stopSession();
		sessionStorage.userProfile = "";
		CommonService.resetRecents();
		$rootScope.userProfile = undefined;
		$rootScope.authenticated = false;
		
		$state.go('login');
	}
	
	function logout(){
		//add Rochiyat
		LogServices.log("Logout","logout");
		HttpServices.logout()
		.then(
			function(data){
				$state.go('login');
			}
		);
	}
    
}]);
