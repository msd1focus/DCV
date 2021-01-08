'use strict';

App.controller('HomeController', ['CommonService', '$state', '$rootScope', 'PoolingService','$cookies', 'SessionService', 'HttpServices', '$localStorage',
	function(CommonService, $state, $rootScope, PoolingService, $cookies, SessionService, HttpServices, $localStorage) {
	var vm = this;
	
	$(document).ready(function(){
		$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
			event.preventDefault(); 
			event.stopPropagation(); 
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});
	});
	
	vm.dcvUser = false;
	vm.userProfile = CommonService.getUserProfile();
	if(vm.userProfile.jenisUser == "DCV") {
		vm.dcvUser = true;
	}
	vm.windowHeight = document.body.clientHeight;
	
	vm.menuList = CommonService.getMenuByUser();
	//console.log("Menu : "+JSON.stringify(vm.menuList));
	
	vm.dataPooling = undefined; //PoolingService.data;
	//PoolingService.runPooling();
	
	/**run session checker**/
	SessionService.updateSession(CommonService.getUsername());
	
	/**idle**/
	HttpServices.startUiSession();
	
	/**button**/
	vm.back = function(){
		vm.cacheSearch();
		window.history.back();
	}
	
	vm.recent = function(){
		$state.go('home.recent');
	}
	
	vm.logout = function(){
		$state.go('logout');
	}
	
	vm.resetNotificationTask = function(domain){
//		if(PoolingService.data.response.TOTAL != undefined
//			&& PoolingService.data.response.TOTAL > 0){
//			var paramData = {input : {USERNAME : vm.userProfile.username}};
//			CommonService.exec('soa.entity.pooling:updateLastSync', paramData)
//			.then(function(r/**response**/){
//				PoolingService.data.response.TOTAL = 0;
//				$state.go('home.task-list',{DOMAIN : domain});
//			});
//		}
	}
	
	vm.resetTrueNotification = function(domain){
//		if(PoolingService.data.response.TOTAL_NOTIFICATION != undefined
//			&& PoolingService.data.response.TOTAL_NOTIFICATION > 0){
//			var paramData = {input : {USERNAME : vm.userProfile.username}};
//			CommonService.exec('soa.entity.pooling:updateLastSyncNotification', paramData)
//			.then(function(r/**response**/){
//				PoolingService.data.response.TOTAL_NOTIFICATION = 0;
//				$state.go('home.notification-list',{DOMAIN : domain});
//			});
//		}
	}
	
	vm.refresh = function(){
		$state.reload();
	}
	
	vm.cacheSearch = function() {
		
	}
	
}]);
