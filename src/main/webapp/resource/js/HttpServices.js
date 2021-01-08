'use strict';

/**
 * this service contain http service that is used accross js
 */
App.factory('HttpServices', ['CommonService', '$q', 'PoolingService', 'SessionService', '$rootScope', '$state', '$localStorage', '$cookies', 'Idle',
	function(CommonService, $q, PoolingService, SessionService, $rootScope, $state, $localStorage, $cookies, Idle){
		
		var service = {};
		var error = 'ERROR';
		
		/***************TASK*******************************/
		/**private method, generic method to get step based on stepFlag
		 * return promise
		 * **/
		var getStepGeneral = function(paramData, stepFlag){
			paramData.input.STEP_FLAG = stepFlag;
			var deferred = $q.defer();
//			CommonService.exec("soa.entity.task:getStep", paramData)
//			.then(
//				function(data){
//					deferred.resolve(data);
//				},
//				function(data){
//					deferred.reject(error)
//				}
//			)
			
			return deferred.promise;
		}
		
		
		/**get step for notification
		 * return promise
		 * **/
		service.getStepNotification = function(paramData){
			return getStepGeneral(paramData, '10'); //10 is step_flag for notification
		}
		
		/**get step for task
		 * return promise
		 * **/
		service.getStepTask = function(paramData){
			return getStepGeneral(paramData, '2'); //2 is step_flag for task
		}
		
		/**get task**/
		service.getTask = function(taskCtxId, formId, taskOrder, domain){
			var deferred = $q.defer();
			var paramData = {input : {taskCtxId : taskCtxId, 
				formId : formId, 
				taskOrder : taskOrder,
				USERNAME : CommonService.getUsername(),
				DOMAIN : domain}
			};
//			CommonService.exec("soa.entity.task:doGet", paramData)
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
		
		service.loadDataTask = function(formId, ctxId) {
			var deferred = $q.defer();
			var paramData = {FORM_ID : formId, 
				CTX_ID : ctxId};
			CommonService.listResource('form', paramData)
			.then(
				function(data){
					deferred.resolve(data);
				},
				function(){
					deferred.reject(error);
				}
			);
			return deferred.promise;
		}
		
		/**lock unlock task**/
		
		/**construct state to determine where the state go**/
		function constructState(task, domain){
			$state.go('home.task-form', {taskData : task, taskCtxId : task.TASK_CTX_ID, 
				formId:task.STEP_FORM_ID , taskOrder : task.TASK_ORDER, 
				dataDocId : task.CTX_DOC_ID, docEntryId : task.CTX_DOC_ENTRY_ID,
				DOMAIN : domain}
			);
		}
		
		function mainLockUnlockTask(serviceName, task, username){
			var deferred = $q.defer();
			var paramData = {input : {LockParam : {userName : username, ctxId : task.TASK_CTX_ID}}};
//			CommonService.exec(serviceName, paramData)
//			.then(
//				function(data){
//					return deferred.resolve(data);
//				},
//				function(data){
//					alert("SERVER ERROR");
//					return deferred.reject(error);
//				}
//			);
			return deferred.promise;
		}
		
		service.unlockTask = function(serviceName, task, username){
			return mainLockUnlockTask(serviceName, task, username)
		}
		
		service.viewTask = function(serviceName, task, username, domain){
			mainLockUnlockTask(serviceName, task, username)
			.then(
				function(data){
					if(CommonService.RC_SUCCESS == data.output.ResponseCode){
						constructState(task, domain);
					}else{
						alert(data.output.ResponseMessage);
					}
				}
			)
		}
		
		/*******************PARAM**********************/
		/**
		 * get param based on group
		 * private method
		 */
		var getGeneralParam = function(paramData){
			var deferred = $q.defer();
//			CommonService.exec("soa.entity.admParameter:getByParamGroup", paramData)
//			.then(
//				function(data){
//					deferred.resolve(data.output.paramList);
//				},
//				function(data){
//					deferred.reject(error);
//				}
//			);
			
			return deferred.promise;
		}
		
		/**get task status parameter**/
		service.getTaskStatusParam = function(){
			var paramData = {input : {PARAM_GROUP : "TaskStatus"}};
			return getGeneralParam(paramData);
		}
		
		/**get status registration**/
		service.getRegistrationStatusParam = function(){
			var paramData = {input : {PARAM_GROUP : "RegistrationStatus"}};
			return getGeneralParam(paramData);
		}
		
		/**get entry status parameter**/
		service.getEntryStatusParam = function(){
			var paramData = {input : {PARAM_GROUP : "EntryStatus"}};
			return getGeneralParam(paramData);
		}
		
		/**get parameter group**/
		service.getParameterGroup = function(paramGroup){
			var paramData = {input : {PARAM_GROUP : paramGroup}};
			return getGeneralParam(paramData);
		}
		
		/**get parameter**/
		service.getParameter = function(paramGroup, paramName){
			var paramData = {input : {
				PARAM_GROUP : paramGroup,
				PARAM_NAME : paramName
			}};
			
			var deferred = $q.defer();
//			CommonService.exec("soa.entity.admParameter:getParameter", paramData)
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
		
		/******************************REPORT******************************************/
		/**download report
		 * filePath is string path where the jasper are
		 * contentType is the content type in mime format
		 * filename is the name for the file
		 * if any paramForReport is used for parameter for jasper report
		 * **/
		service.downloadReport = function(filePath, contentType, filename, paramForReport){
			var paramData = {"filePath" : filePath, 
					"contentType" : contentType};
			CommonService.downloadGeneral("soa.entity.report:createReport", paramData, paramForReport)
			.then(function(downloadData){
				 var file = new Blob([downloadData.data]);
	             saveAs(file, filename);
			});
		}
		
		/**
		 * create param for reporttrx and reporttrxsknbigagaldebet
		 */
		service.createParamReportTrx = function(tanggal, status, noSi, norekNasabah, amountTertagih, namaBiller, bankBiller){
			
			var paramData = {"TANGGAL" : tanggal, 
	    			"STATUS" : status,
	    			"NO_SI" : noSi,
	    			"NOREK_NASABAH" : norekNasabah,
	    			"AMOUNT_TERTAGIH" : amountTertagih,
	    			"NAMA_BILLER" : namaBiller,
	    			"BANK_BILLER" : bankBiller
	    		};
	    	
	    	return {input : {"paramData" : paramData}};
	    	
		}
		
		
		/*******************************LOGOUT******************************************/
		/**
		 * clear cookies and other, turnof timer
		 */
		service.logout = function(){
			var deferred = $q.defer();
			var token = $cookies.get(CommonService.TOKEN);
			if(token){
				CommonService.doPost('/logout')
				.then(
					function(data){
						if(data.STATUS == '00'){
							PoolingService.stopPooling();
							SessionService.stopSession();
							sessionStorage.userProfile = "";
							CommonService.resetRecents();
							$rootScope.userProfile = undefined;
							$rootScope.authenticated = false;
							Idle.unwatch();
						}
						deferred.resolve(data);
					},
					function(data){
						deferred.reject(error);
					}
				);
			}
			return deferred.promise; 
		}
		
		/**running session in UI
		 * stopping session is available in logout, and app.on
		 * **/
		service.startUiSession = function(){
			service.getParameter("SECURITY_CONFIG", "SESSION_TIMEOUT")
			.then(
				function(data){
					if(data != undefined
							&& data.output != undefined
							&& data.output.PARAM_VALUE != undefined){
						var sessionTimeout = parseInt(data.output.PARAM_VALUE);
						if(!Idle.running()){
							Idle.setIdle(sessionTimeout);
							Idle.watch();
						}
					}
				}
			)
		}
		
		/*********************************************REGISTRATION*********************************************/
		service.checkStatus = function(registrationId, serviceName){
			var deferred = $q.defer();
			var paramData = {input : {id : registrationId}};
//			CommonService.exec(serviceName, paramData)
//			.then(
//				function(data){
//					var status = undefined;
//					if(data.output.ResponseCode == CommonService.RC_SUCCESS){
//						status = CommonService.RC_SUCCESS;
//					}
//					else{
//						alert(data.output.ResponseMessage);
//						status = CommonService.RC_ERROR;
//					}
//					deferred.resolve(status);
//				},
//				function(data){
//					alert('System Error');
//					deferred.reject(error);
//				}
//			);
			return deferred.promise;
		}
		
		/**return service**/
		return service;
	}
  ]
)