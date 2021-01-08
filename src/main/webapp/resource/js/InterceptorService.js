'user strict';

App.factory('my401Detector', function($q, $injector){
    return  {
    	responseError: function(response) {
            if(response.status === 403) {
            	
            	var PoolingService = $injector.get('PoolingService');
            	var SessionService = $injector.get('SessionService');
            	var CommonService = $injector.get('CommonService');
            	var $rootScope = $injector.get('$rootScope');
            	var $state = $injector.get('$state');
            	var Idle = $injector.get('Idle');
            	
            	PoolingService.stopPooling();
				SessionService.stopSession();
				sessionStorage.userProfile = "";
				CommonService.resetRecents();
				$rootScope.userProfile = undefined;
				$rootScope.authenticated = false;
				Idle.unwatch();
				
				$state.go('login');
            	
                return $q.reject(response);
            }
            return response;
        }
    }
});

App.config(['$httpProvider',function($httpProvider) {
    $httpProvider.interceptors.push('my401Detector');
}]); 