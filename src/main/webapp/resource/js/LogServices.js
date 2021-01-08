'use strict';

/**
 * this service contain http service that is used accross js
 */
App.factory('LogServices', ['CommonService', '$q',
	function(CommonService, $q){
		
		var service = {};
		
		/***************TASK*******************************/
		/**private method, generic method to get step based on stepFlag
		 * return promise
		 * **/
		var generalLog = function(action, menu){
			var deferred = $q.defer();
			var paramData = {"input" : {"USERNAME" : CommonService.getUsername(), 
				"ACTION" : action, 
				"MENU" : menu
				}
			};
//			CommonService.exec("soa.entity.logactivity:logCreateWrapper", paramData)
//			.then(
//				function(data){
//					deferred.resolve(data);
//				},
//				function(data){
//					deferred.reject(error);
//				}
//			);
			return deferred.promise;
		}
		
		service.log = function(action, menu){
			generalLog(action, menu);
		}
		
		service.logSwift = function(domain, action, menu){
			if(domain != undefined
					&& domain == CommonService.SWIFT){
				generalLog(action, menu);
			}
		}
		
		/**return service**/
		return service;
	}
  ]
)