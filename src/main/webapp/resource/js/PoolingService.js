'user strict';

App.factory('PoolingService', ['CommonService', '$timeout', 'growl', function(CommonService, $timeout, growl){
	var data = {response : {}, 
		lastSyncTask :undefined, 
		lastSyncNotification : undefined,
		username : undefined, 
		calls: 0};
	var promise = undefined;
	var poller = function(){
		switch(data.calls){
			//init in firsttime only
			case 0 :
				var userProfile = CommonService.getUserProfile();
				data.lastSyncTask = userProfile.lastSyncTask;
				data.lastSyncNotification = userProfile.lastSyncNotification;
				data.username = userProfile.username;
				break;
		}
		
		var paramData = {input : {lastSyncTask : data.lastSyncTask, 
			username : data.username, lastSyncNotification : data.lastSyncNotification}};
//		CommonService.execPooling("soa.entity.pooling:checkTask", paramData)
//		.then(function(r){
//			constructDataResponse(r);
//			data.lastSyncTask = CommonService.parsingDate(new Date());
//			data.lastSyncNotification = CommonService.parsingDate(new Date());
//			data.calls++;
//			promise = $timeout(poller, (40 * 1000));
//		});
	};
	
	var stopPoller = function(){
		$timeout.cancel(promise);
		data.response = {};
		data.lastSyncTask = undefined;
		data.username = undefined;
		data.calls = 0;
	}
	
	function constructDataResponse(r /**response**/){
		switch(data.response.TOTAL){
			case undefined :
				data.response = r.output.response;
				break;
				
			default :
				if(r.output != undefined
						&& r.output != null){
					var total = r.output.response.TOTAL;
					var totalNotification = r.output.response.TOTAL_NOTIFICATION;
					data.response.TOTAL += total;
					data.response.TOTAL_NOTIFICATION += totalNotification;
					if(total > 0){
						CommonService.showGrowl(CommonService.SUCCESS, "You Have "+total+" Task");
					}
					if(totalNotification){
						CommonService.showGrowl(CommonService.WARNING, "You Have "+totalNotification+" Notification");
					}
				}
				break;
		}
	}
	
	return{
		data : data,
		runPooling : poller,
		stopPooling : stopPoller,
	};
	
}]);
	
