'use strict';

App.factory('CommonService', ['$http', '$rootScope', '$uibModal', 'Config', '$cookies', '$localStorage', 'growl', 'Upload', '$state', '$window',
	function($http, $rootScope, $uibModal, Config, $cookies, $localStorage, growl, Upload, $state, $window){
	var backendAddress = Config.servicePath;
	
	//CONSTANT
	const SUCCESS = "success";
	const INFO = "info";
	const WARNING = "warning";
	const ERROR = "error";
	const INTERNALERROR = "Internal Error";
	const RC_SUCCESS = "00";
	const RC_ERROR = "01";
	const LIMIT_TRASACTION_SWIFT = "swift.transaction.limit";
	const ALERT_TRANSACTION_ALERT = "Diharapkan untuk menyelesaikan transaksi sebelum Pukul.";
	
	/**chekc response message
	 * object parameter must {ResponseMessage : {message:'',rc:''}}
	 * **/
	 function checkResponseMessage(ResponseMessage){
		if(ResponseMessage.rc == RC_SUCCESS){
			return true;
		}
		else{
			alert(ResponseMessage.message);
			return false;
		}
	}
	
	function appendStateData(){
		var data = $state.current.data;
		var current = $state.current;
		if(data != undefined){
			if(!data.sendState){
				return undefined;
			}
		}
		return {STATE : current.name, PARAM : $state.params}
	}
	
	function createFormattedMenu(menus){
		var menuList = [];
		for(var i=0; i<menus.length; i++){
			var menu = menus[i];
			var formattedMenu = parsingMenu(menu);
			menuList.push(formattedMenu);
		}
		return menuList;
	}
	
	/**
	 * separate link with parameter, and parse this state to url
	 */
	function parsingMenu(menu){
		var positionOpen = menu.indexOf('(');
		if(positionOpen > -1){
			var stateName = menu.substring(0,positionOpen);
			var ParamString = menu.substring(positionOpen+1, menu.indexOf(')'));
			var param = JSON.parse(ParamString);
			return $state.href(stateName, param);
		}
		return $state.href(menu);
	}
	
	return {
		EDIT : "edit",
		VIEWONLY : "viewOnly",
		ORDERASC : 0,
		ORDERDESC : 1,
		UPDATED : "updated",
		SAVED : "saved",
		DELETED : "deleted",
		APPROVE : "APPROVE",
		MARQUEENOTAV : "Jisdor Rate Not Available",
		MARQUEENOTAVIND : "Rate Jisdor Belum Tersedia",
		MARQUEE : "Jisdor Rate Today, ",
		MARQUEEIND : "Rate Jisdor Hari ini, ",
		
		//entry type constant
		T_SKNBI_BATCH : "T_SKNBI_BATCH",
		T_SKNBI_DKE : "T_SKNBI_DKE",
		T_SKNBI_BULK_TRANSACTION : "T_SKNBI_BULK_TRANSACTION",
		T_MT101 : "T_MT101",
		T_MT101B : "T_MT101B",
		
		//domain
		SWIFT : "swift",
		SKNBI : "sknbi",
		JISDOR : "jisdor",
		
		//backendService
		DOACTIONTASK : "soa.entity.form:doAction",
		
		//regex
		regNumericOnly : /^[0-9.]*$/,
		
		//contentType Mime
		PDF : "application/pdf",
		XLS : "application/vnd.ms-excel",
		XLSX : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		CSV : "text/csv",
		TXT : "text/plain",
		ZIP : "application/zip",
		
		getExtension : function(type){
			switch(type){
				case this.PDF :
					return ".pdf";
				case this.XLS :
					return ".xls";
			}
		},
		
		//DAYS in ENGLISH
		HARI : ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
		DAYS : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
		
		//COOKIES
		USERNAME : "USERNAME",
		JSESSIONID : "JSESSIONID",
		TOKEN : "TOKEN",
		
		//TASK_TYPE
		TASK : '0',
		APPROVAL : '2',
		
		//RC
		RC_SUCCESS : RC_SUCCESS,
		RC_ERROR : RC_ERROR,
		
		//SYSTEM ROLE
		SPVSKNBI : "SPVSKNBI",
		SPVSKNBIMKR : "SPVSKNBIMKR",
		
		/**path of jasper**/
		DOWNLOADPATH : "/packages/TPSApi/resources/jasper/",
		JISDORPATH : "/packages/TPSApi/resources/jasper/jisdor/",
		
		appendPostData : function(postData){
			if(postData == undefined){
				postData = {};
			}
			postData.$URL = appendStateData();
			return postData;
		},
		
		translateUrl: function(url) {
			//return Config.host + Config.contextPath + ($rootScope.authenticated ? Config.protectedPath : Config.publicPath) + url;
			return Config.host + Config.contextPath + url;
		},
		getResourceUrl: function(resourceType) {
			return this.translateUrl(Config.resourcePath + resourceType);
		},
		
		/**set token to header if login success**/
		doPost : function(targetURL, postData) {
			var url = this.translateUrl(targetURL);
			//console.log("URL = "+url);
			return $http({
				method : "POST", 
				url : url, 
				data : postData, 
				withCredential: true
			})
			.then(function(response){
				return response.data;
            });
		},
		
		doGET : function(targetURL) {
			var url = this.translateUrl(targetURL);
			return $http({
                method: 'GET',
                url: url
            }).then(function(response){
            	return response.data;
            });
		},
		
		/**
		 * for post data it must be wrapped by input object
		 */
        exec : function(serviceName, postData){
			postData = this.appendPostData(postData);
			return $http({
                method: 'POST',
                url: this.translateUrl("/exec?serviceName="+serviceName),
                data: postData,
                headers: {
                    'Content-Type': 'application/json'
                }
				/*,
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }*/
            }).then(function successCallback(response){
            	return response.data;
            },function errorCallback(response){
            	return response.data;
			});
          },
		
		execPooling : function(serviceName, postData){
			postData = this.appendPostData(postData);
			return $http({
                method: 'POST',
                url: this.translateUrl("/exec?serviceName="+serviceName),
                data: postData,
                headers: {
                    'Content-Type': 'application/json'
                },
				ignoreLoadingBar: true
            }).then(function successCallback(response){
            	return response.data;
            },function errorCallback(response){
            	return response.data;
			});
          },
		
		execResponse : function(serviceName, postData){
			postData = this.appendPostData(postData);
			return $http({
                method: 'POST',
                url: this.translateUrl("/exec?serviceName="+serviceName),
                data: postData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function successCallback(response){
            	return response;
            },function errorCallback(response){
            	return response;
			});
          },
		  
        /*listResource : function(resourceType, postData) {
			var url = this.getResourceUrl(resourceType);
			return $http.get(url, postData)
			.then(function(response){
            	return response.data;
            });
		},*/
        
		listResource : function(resourceType, postData) {
			//postData = this.appendPostData(postData);
			var url = this.getResourceUrl(resourceType);
			return $http.get(url, {params : postData})
			.then(function(response){
            	return response.data;
            });
		},
		
		/**it will be deprecated when all method has switched to createResourceNew**/
		createResource : function(resourceType, postData) {
        	var showGrowl = this.showGrowl;
        	var SUCCESS = this.SUCCESS;
			var WARNING = this.WARNING;
			var INTERNALERROR = this.INTERNALERROR;
			
        	var url = this.getResourceUrl(resourceType);
        	postData = this.appendPostData(postData);
			return $http.post(url, postData)
			.then(
				function(response){
					if(response != undefined
							&& response.status != undefined){
						switch (response.status){
							case 200 :
								showGrowl(SUCCESS, SUCCESS);
								break;
							case 500 :
								showGrowl(WARNING, response.statusText);
						}
					}
					
					return response.data;
				},
				function(response){
					showGrowl(WARNING, INTERNALERROR);
					return response;
				}
			);
		},
		
		/**
		 * need output of {ResponseMessage : {message:'',rc:''}}
		 * all handlers to show message is handled in this method
		 * return boolean
		 * see Registration add for example
		 */
		createResourceNew : function(resourceType, postData) {
        	var showGrowl = this.showGrowl;
        	var SUCCESS = this.SUCCESS;
			var WARNING = this.WARNING;
			var INTERNALERROR = this.INTERNALERROR;
			
        	var url = this.getResourceUrl(resourceType);
        	postData = this.appendPostData(postData);
			return $http.post(url, postData)
			.then(
				function(response){
					//check response
					if(response != undefined
							&& response.status != undefined){
						switch (response.status){
							case 200 :
								response.isSuccess = true;
								if(response.data != undefined
										&& response.data.ResponseMessage != undefined){
									response.isSuccess = checkResponseMessage(response.data.ResponseMessage);
									if(!response.isSuccess)return response; //if false return false
								}
								showGrowl(SUCCESS, SUCCESS);
								break;
							case 500 :
								showGrowl(WARNING, response.statusText);
						}
					}
					return response;
				},
				function(response){
					showGrowl(WARNING, INTERNALERROR);
					response.isSuccess = false;
					return response;
				}
			);
		},
		
		/**
		 * delete resource
		 */
        deleteResource : function(resourceType) {
			var url = this.getResourceUrl(resourceType);
			return $http.delete(url)
			.then(function(response){
            	return response.data;
            });
		},
		
		/**delete with parameter included
		 * use it to delete with parameter more than 1
		 * it will generate parameter that is wrapped with 'paramData' object
		 * **/
		deleteResourceWithParameter : function(resourceType, postData) {
			postData = this.appendPostData(postData);
			var url = this.getResourceUrl(resourceType);
			return $http.delete(url, {params : {paramData : postData}})
			.then(function(response){
            	return response.data;
            });
		},
		
		doPOSTJSON : function(targetURL, postData) {
			postData = this.appendPostData(postData);
			return $http.post(backendAddress + targetURL, postData)
			.then(function(response){
            	return response.data;
            });
		},
		
		getMenuManual: function(targetURL){
			return $http({
				method: 'GET',
				url: targetURL
			}).success(function(response){
				return response;
			})
		},
		
		populateValidData : function(userProfile){
			this.setUserProfile(userProfile);
			$localStorage.$default({recents : {} });	//for create recent
	    	$rootScope.authenticated = true;
			$rootScope.userProfile = this.getUserProfile();
//			$rootScope.webservice = data.parameterGlobal;
		},
		
		setUserProfile : function(userProfile){
			var formattedMenus = createFormattedMenu(userProfile.role.menus);
			userProfile.role.menus = formattedMenus;
			sessionStorage.userProfile = JSON.stringify(userProfile); //put user data, menu in sessionStorage
		},
		
		getUserProfile: function() {
			if(sessionStorage.userProfile != undefined
				&& $rootScope.userProfile == undefined){
				$rootScope.userProfile = JSON.parse(sessionStorage.userProfile);
			}
			return $rootScope.userProfile;
		},
		
		getMenuByUser: function() {
			return $rootScope.userProfile.role.menuList;
		},
		
		getDomainWebService: function() {
			return $rootScope.webservice;
		},
		
		getUsername : function(){
			return this.getUserProfile().username;
		},
		
		getUserId : function(){
			return this.getUserProfile().userId;
		},
 		
		getMenus : function(){
			return this.getUserProfile().role.menus;
		},
		
		uploadFileToServer: function(file, uploadUrl, fileName, custCode) {        	
      	  	var formData = new FormData();
      	  	formData.append('file', file);
      	  	formData.append('fileName', fileName);
      	  	formData.append('custCode', custCode);
            return $http.post(this.translateUrl(uploadUrl), formData, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	         }).success(function(data, status, headers, config){
	         	return data;
	         }).error(function(data, status, headers, config){
	         	return data;
	         });
      	},
		
		uploadFileToUrl : function(file){
			file.append('$URL', JSON.stringify(appendStateData()));
			file.append('$username', this.getUsername());
			return $http.post(this.translateUrl("/execMultipart"), file, {
               transformRequest: angular.identity,
               headers: {'Content-Type': undefined}
            }).success(function(data, status, headers, config){
            	return data;
            }).error(function(data, status, headers, config){
            	return data;
            });
         },
         
         uploadFile : function(file){
        	 Upload.upload({
 	            url: 'upload/url', /*harus ditanyakan dan harus ke FTP*/
 	            data: {file: file}
 	        }).then(function (resp) {
 	            console.log('Success ' + resp.config.data.file.name /*+ 'uploaded. Response: ' + resp.data*/);
 	        }, function (resp) {
 	            console.log('Error status: ' /*+ resp.status*/);
 	        }, function (evt) {
 	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
 	            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
 	        });
         },
         
         downloadFileAddr: function(uploadUrl, custCode) {        	
      	  	 var formData = new FormData();
      	  	 formData.append('custCode', custCode);
             return $http.post(this.translateUrl(uploadUrl), formData, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	         }).success(function(data, status, headers, config){
	         	return data;
	         }).error(function(data, status, headers, config){
	         	return data;
	         });
      	 },
         
		informIdModal : function(fieldName, value){
			return $uibModal.open({
				animation: true,
				ariaDescribedBy: 'modal-body',
				ariaLabelledBy: 'modal-title',
				size : 'sm',
				templateUrl : 'pages/modal/informIdModal.html',
				controller : function($uibModalInstance, $scope, fieldName, value){
					$scope.fieldName = fieldName;
					$scope.value = value;
					$scope.close = function(){
						$uibModalInstance.close();
					}
				},
				resolve : {
					fieldName : function(){return fieldName},
					value : function(){return value}
				},
				keyboard : false,
				backdrop : 'static'
			}).result;
		},
		
		/* avalibale tipe value = info, warning, error, confirmation */
        modalAlert : function (tipe, msg) {
        	return $uibModal.open({
        		animation: true,
        		backdrop : 'static',
                templateUrl: 'pages/modal/modalAlert.html',
                controller:function($uibModalInstance, $scope, tipe, msg){
                	$scope.tipe = tipe;
                	$scope.msg = msg;
                	$scope.cancel = function () {
                		$uibModalInstance.dismiss('cancel');
                    };
                	$scope.ok = function () {
                		$uibModalInstance.close('close');
                    };
                },
                resolve: {
                    tipe: function () {
                        return tipe;
                    },
                    msg: function () {
                        return msg;
                    }
                }
            }).result;
        },
        
        informError : function (msg) {
            inform.add(msg, {
                type: 'danger'
            });
            return true;
        },
        
        informClearAll : function () {
            inform.clear();
            return true;
        },
        
        informSuccess : function (msg) {
            inform.add(msg, {
                type: 'success'
            });
            return true;
        },
        
        informSaveSuccess : function (msg) {
            var strMsg = typeof msg == 'undefined' ? 'Data berhasil disimpan!' : msg;
            this.informSuccess(strMsg);
            return true;
        },
		
		
		
		/*parsing dengan format yyyy-MM-dd hh:mm:ss**/
		parsingDate : function(temp){
			if(this.isNotEmpty(temp)){
				return this.paddingDate(temp.getFullYear()) + "-"+
					this.paddingDate(1 + temp.getMonth()) + "-"+
					this.paddingDate(temp.getDate()) + " "+
					this.paddingDate(temp.getHours()) + ":"+
					this.paddingDate(temp.getMinutes()) + ":"+
					this.paddingDate(temp.getSeconds());
			}
			return;
		},
		
		parsingDateInd	: function(temp){
			if(this.isNotEmpty(temp)){
				return this.paddingDate(temp.getDate()) + "-"+
					this.paddingDate(1 + temp.getMonth()) + "-"+
					this.paddingDate(temp.getFullYear()) + " "+
					this.paddingDate(temp.getHours()) + ":"+
					this.paddingDate(temp.getMinutes()) + ":"+
					this.paddingDate(temp.getSeconds());
			}
			return;
		},
		
		parsingDateIndForUpload	: function(temp){
			if(this.isNotEmpty(temp)){
				return this.paddingDate(temp.getDate()) + "-"+
					this.paddingDate(1 + temp.getMonth()) + "-"+
					this.paddingDate(temp.getFullYear()) + "_"+
					this.paddingDate(temp.getHours()) + "_"+
					this.paddingDate(temp.getMinutes()) + "_"+
					this.paddingDate(temp.getSeconds());
			}
			return;
		},
		
		/*parsing dengan format yyyy-MM-dd**/
		parsingDateOnly : function(temp){
			if(this.isNotEmpty(temp)){
				return this.paddingDate(temp.getFullYear()) + "-"+
					this.paddingDate(1 + temp.getMonth()) + "-"+
					this.paddingDate(temp.getDate());
			}
			return;
		},
		
		/*parsing dengan format dd-MM-yyyy**/
		parsingDateOnlyInd : function(temp){
			if(this.isNotEmpty(temp)){
				return this.paddingDate(temp.getDate()) + "-"+
					this.paddingDate(1 + temp.getMonth()) + "-"+
					this.paddingDate(temp.getFullYear());
			}
			return;
		},
		
		/**parsing dengan format HH:mm**/
		parsingTimeOnly : function(temp){
			if(this.isNotEmpty(temp)){
				return this.paddingDate(temp.getHours()) + ":" +
					this.paddingDate(temp.getMinutes());
			}
			return;
		},
		
		/*parsing dengan format dd-MM-yyyy with days**/
		parsingDateWithDay : function(temp){
			if(this.isNotEmpty(temp)){
				return this.paddingDate(this.paddingDate(this.DAYS[temp.getDay()] + ", " +
						temp.getDate() + "-" +
						this.paddingDate(1 + temp.getMonth()) + "-" +
						temp.getFullYear()));
			}
			return;
		},
		
		parsingDateWithDayInd : function(temp){
			if(this.isNotEmpty(temp)){
				return this.paddingDate(this.paddingDate(this.HARI[temp.getDay()] + ", " +
						temp.getDate() + "-" +
						this.paddingDate(1 + temp.getMonth()) + "-" +
						temp.getFullYear()));
			}
			return;
		},
		
		paddingDate : function padStrDate(i) {
			return (i < 10) ? "0" + i : "" + i;
		},
		
		formatDate : "dd/MM/yyyy",
		ngModelOpts : {timezone : '-00:00'},
		//generalDateOptions : {showWeeks : false, ngModelOptions : {timezone : '-00:00'}},
		generalDateOptions : {showWeeks : false},
		
		openDatePicker : function(numberOrder, popup){
			return popup["opened"+numberOrder] = true;
		},
		
		compareDateOnly : function(date1, date2){
			date1.setHours(0,0,0,0);
			date2.setHours(0,0,0,0);
			return date1.getTime() == date2.getTime();
		},
		
		isListEmpty : function(list){
			return (list == undefined || list.length < 1);
		},
		
		isListNotEmpty : function(list){
			return !this.isListEmpty(list);
		},
		
		calculateOffset : function(maxPerpage, pageNumber){
			return ((maxPerpage*pageNumber)-maxPerpage);
		},
		
		returnUndefinedIfNull : function(data){
			if(data==undefined){
				return undefined;
			}
			else{
				return data
			}
		},
		
		isHttpSuccess : function(data){
			if(data!=200){
				return false;
			}
			else{
				return true;
			}
		},
		
		/**for determining order is asc or desc in sort table
		 * 0 is asc 1 is desc
		 * **/
		determiningOrder(sortState){
			return sortState == 0 ? 1 : 0;
		},
		
		constructResponseMessage : function(response){
			if(response != undefined){
				if(this.isHttpSuccess(response.status)){
					return response.statusText;
				}
				else if(response.data.$error != undefined
					&& response.data.$error != ""){
					var errors = response.data.$error.split(":");
					var errorType = errors[0];
					var errorMessage = errors[1];
					return errorMessage;
				}
				else{
					return response.data;
				}
			}
				return response;
		},
		
		isNotEmpty : function(data){
			if(data != undefined
					&& data != ""
					&& data != null){
				return true;
			}
			else{
				return false;
			}
		},
		
		isEmpty : function(data){
			return !this.isNotEmpty(data);
		},
		
		getCurrency : function(list, expectedCurrency){
			if(this.isListNotEmpty(list)){
				for(var i=0; i<list.length; i++){
					var currency = list[i];
					if(currency.CURRENCY_CODE == expectedCurrency
						|| currency.CURRENCY_NAME == expectedCurrency){
						return currency;
					}
				}
			}
		},
		
		createRecent : function(currentState, param){
			if(currentState.data != undefined
				&& currentState.data.logAble != undefined
				&& currentState.data.logAble ==true){
					
				var viewName = currentState.data.viewName;
				var stringParams = JSON.stringify(param);
				var link = currentState.name;
				link += "("+stringParams+")";
				var recent = {link : link, viewName : viewName, date : this.parsingDate(new Date())};
				var id = param[currentState.data.id];
				
				if($localStorage.recents == undefined){//make sure that recents is not undefined
					$localStorage.recents = {};
				}
				
				if(this.isNotEmpty(id)){
					recent.viewName += " (" + id +")";
					$localStorage.recents["$"+currentState.data.id+id] = recent;
				}
				else{
					$localStorage.recents["$"+currentState.data.id] = recent;
				}
			}
		},
		
		/**createRecent : function(link, viewName, date){
			return {link : link, viewName : viewName, date : this.parsingDate(date)};
		},**/
		
		resetRecents : function(){
			$localStorage.$reset({
				recents : {}
			});
		},
		
		checkUncheckBox : function(arr, state, data){
			var idx = arr.indexOf(data);
			if(state && idx == -1){
				arr.push(data);
			}
			else if(!state && idx != -1){
				arr.splice(idx, 1);
			}
		},
		
		checkUncheckAll : function(checkAllState, list, selectedList, checkedList){
			if(!checkAllState){
				if(this.isListNotEmpty(list)){
					for(var i=0; i<list.length;i++){
						if(!selectedList[i]){
							checkedList.push(list[i]);
							selectedList[i] = true;
						}
					}
					checkAllState = true;
				}
			}
			else{
				if(this.isListNotEmpty(list)){
					checkedList = [];
					for(var i=0; i<list.length;i++){	
						selectedList[i] = false;
					}
				}
				checkAllState = false;
			}
		},
		
		getParam : function(paramName, params){
			if(this.isListNotEmpty(params)){
				for(var i=0; i<params.length; i++){
					var param = params[i];
					if(param.PARAM_NAME == paramName){
						return param;
					}
				}
			}
			return undefined;
		},
		
		isNumber : function(value){
			var regex = /^[0-9.]*$/;
			if(regex.test(value)){
				return true;
			}
			return false;
		},
		
		/**
		 * check special characters
		 */
		
		isSpeChars : function(value){
		    var iChars = "~`!#$%^&*+=-[]\\\';,/{}|\":<>?_¡";
//		    +"¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ‘’";

		    for (var i = 0; i < value.length; i++) {
		       if (iChars.indexOf(value.charAt(i)) != -1) {
//		           alert ("File name has special characters ~`!#$%^&*+=-[]\\\';,/{}|\":<>? \nThese are not allowed\n");
		           return true;
		       }
		    }
		    return false;
		},
		
		expandTree : function(scope, treeControl){
			setTimeout(function(){
				scope.$apply(treeControl.expand_all());
			},100);
		},
		
		/**this service is to go to state doc entry detail**/
		goToEntryDetail : function(value, entryId){
			var paramData = {ENTRY_ID : entryId};
			switch(value){
				case this.T_SKNBI_BATCH :
					$state.go('home.doc-entry-details-batch', paramData);
					break;
				case this.T_SKNBI_DKE :
					$state.go('home.doc-entry-details-dke', paramData);
					break;
				case this.T_SKNBI_BULK_TRANSACTION :
					$state.go('home.doc-entry-details-bt', paramData);
					break;
				case this.T_MT101 :
					$state.go('home.doc-entry-details-mt101', paramData);
					break;
				case this.T_MT101B :
					$state.go('home.doc-entry-details-mt101b', paramData);
					break;
			}
		},
		
		createDateTitleIndonesia : function(valueDate){
			var tanggal = valueDate.getDate();
	    	var bulan = this.determineMonthIndonesia(valueDate.getMonth());
	    	var tahun = valueDate.getFullYear();
	    	return tanggal + " " + bulan + " "+ tahun;
		},
		
		determineMonthIndonesia : function(bulan){
			switch(bulan){
	    		case 0 :
	    			return "Januari";
	    		
	    		case 1 :
	    			return "Februari";
	    			
	    		case 2 :
	    			return "Maret";
	    			
	    		case 3 :
	    			return "April";
	    			
	    		case 4 :
	    			return "Mei";
	    			
	    		case 5 :
	    			return "Juni";
	    		
	    		case 6 :
	    			return "Juli";
	    			
	    		case 7 :
	    			return "Agustus";
	    			
	    		case 8 :
	    			return "September";
	    			
	    		case 9 :
	    			return "Oktober";
	    			
	    		case 10 :
	    			return "November";
	    			
	    		case 11 :
	    			return "Desember";
	    	}
		},
		
		SUCCESS : SUCCESS,
		INFO : INFO,
		ERROR : ERROR,
		WARNING : WARNING,
		
		//MESSAGE
		INTERNALERROR : INTERNALERROR,
		
		
		showGrowl : function(type, message){
			var config = {};
			switch(type){
				case SUCCESS :
					growl.success(message, config);
					break;
					
				case INFO :
					growl.info(message, config);
					break;
					
				case WARNING :
					growl.warning(message, config);
					break;
					
				default :
					growl.error(message, config);
					break;
			}
		},
		
		//success 00, otherwise error
		showGrowlReponse : function(response){
			switch(response.rc){
				case RC_SUCCESS :
					this.showGrowl(SUCCESS, response.message);
					return true;
				default :
					this.showGrowl(ERROR, response.message);
					return false;
			}
		},
		
		//validating for transaction alert
		getTransactionParam : function(domain, eventName) {
			var modalAlert = this.modalAlert;
			var now = new Date();
			var startTime = new Date();
			var endTime = new Date();
			
			if(domain == undefined && eventName == undefined) {
				domain = this.SWIFT;
				eventName = LIMIT_TRASACTION_SWIFT;
			}
			var paramData = {input : {DOMAIN : domain, EVENT_NAME : eventName}};
			this.exec("soa.entity.businessEvents."+domain+":getByName", paramData)
			.then(function(data){
				var hasil = data.output.businessEvent;
				if(hasil != undefined){
					var startHour = hasil.EVENT_START_TIME.split(":")[0];
					var startMint = hasil.EVENT_START_TIME.split(":")[1];
					var endHour = hasil.EVENT_END_TIME.split(":")[0];
					var endMint = hasil.EVENT_END_TIME.split(":")[1];
					startTime.setHours(startHour);
					startTime.setMinutes(startMint);
					endTime.setHours(endHour);
					endTime.setMinutes(endMint);
					
					if(now > startTime && now < endTime){
						modalAlert('warning', ALERT_TRANSACTION_ALERT + hasil.EVENT_END_TIME + " WIB")
			            .then(function(result) {});
					}
				}
			});
		},
		
		exportTableToExcel : function(tableID, filename = ''){
		    var downloadLink;
		    var dataType = 'application/vnd.ms-excel';
		    var tableSelect = document.getElementById(tableID);
		    var tableHTML = tableSelect.innerHTML.replace(/ /g, '%20');
		    
		    // Specify file name
		    filename = filename?filename+'.xls':'download.xls';
		    
		    // Create download link element
		    downloadLink = document.createElement("a");
		    
		    document.body.appendChild(downloadLink);
		    
		    if(navigator.msSaveOrOpenBlob){
		        var blob = new Blob(['\ufeff', tableHTML], {
		            type: dataType
		        });
		        navigator.msSaveOrOpenBlob( blob, filename);
		    }else{
		        // Create a link to the file
		        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
		    
		        // Setting the file name
		        downloadLink.download = filename;
		        
		        //triggering the function
		        downloadLink.click();
		    }
		},
		
		exportJSONToExcel : function(xlsHeader, xlsRows, filename){
			var createXLSLFormatObj = [];
			createXLSLFormatObj.push(xlsHeader);
	        $.each(xlsRows, function(index, value) {
	            var innerRowData = [];
	            $.each(value, function(ind, val) {
	 
	                innerRowData.push(val);
	            });
	            createXLSLFormatObj.push(innerRowData);
	        });
	        
	        /* File Name */
	        var filename = filename+".xlsx";
	        /* Sheet Name */
	        var ws_name = filename.substring(0, 20);
	        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
	        /* Add worksheet to workbook */
	        XLSX.utils.book_append_sheet(wb, ws, ws_name);
	        XLSX.writeFile(wb, filename);
		},
		
		formatDate : function(date) {
			var day = date.getDate();
			var monthIndex = date.getMonth()+1;
			var year = date.getFullYear();

			return day + '-' + monthIndex + '-' + year;
		}
		
	};

}]);
