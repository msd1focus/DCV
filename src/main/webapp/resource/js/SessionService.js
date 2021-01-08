'user strict';

App.factory('SessionService', ['CommonService', '$timeout', 'Idle', 
		function(CommonService, $timeout, Idle){
	
	var service = {};
	var promise = undefined;
	var called = 0;
	var userId = undefined;
	
	/**
	 * service pooler
	 * for the first time it will set the promise only
	 * and for the second and later it will execute the real service and setPromise again
	 */
	var poller = function(){
		if(called > 0){
			var paramData = {input : {USERNAME : userId}};
//			CommonService.execPooling("tps.api.priv.login:updateSession", paramData);
		}
		called++;
		promise = $timeout(poller, (25 * 60 * 1000));	//25 minutes
	}
	
	/**
	 * public service to update session
	 * this service is only invoked once when home controller is loaded
	 * **/
	service.updateSession = function(userIdParam){
		userId = userIdParam;
		poller();
	}
	
	/**public service to stop session**/
	service.stopSession = function(){
		$timeout.cancel(promise);
		userId = undefined;
		called = 0;
	}
	
	return service;
	
}]);