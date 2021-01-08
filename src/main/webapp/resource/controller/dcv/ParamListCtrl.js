'use strict';

App.controller('ParamListController', ['CommonService', '$state', 'FilterService', function(CommonService, $state, FilterService) {
	var vm = this;
	
	vm.totalItems = 0;
	vm.pageNumber = 1;
    vm.itemPerpage = 25;
	vm.maxSize = 7;
	
	loadData();
	
	//button action
    vm.pageChanged = function() {
		loadData();
	}
	
	vm.addParam = function() {
		$state.go('home.param-add');
	}
	
	vm.editParameter = function(param) {
		$state.go('home.param-add', {PARAM_ID : param.PARAM_ID, dataParam : param});
	}
	
    vm.viewParameter = function(param) {
		$state.go('home.param-add', {PARAM_ID : param.PARAM_ID, STATE : CommonService.VIEWONLY, dataParam : param});
	}
    
	vm.deleteParameter = function(param) {
		CommonService.modalAlert('confirmation', 'Are you sure want to delete this data?')
		.then(function(result) {
			CommonService.deleteResource('admParameter/'+param.PARAM_ID)
			.then(function(result){
				loadData();
			});
		});
	}
	
    /**service**/
	function loadData() {
		var paramData = {min : CommonService.calculateOffset(vm.itemPerpage, vm.pageNumber), 
				max : (vm.itemPerpage * vm.pageNumber)};
		/** CommonService.listResource('admParameter', paramData)
		.then(function(data){
			vm.paramList = data.paramList;
			vm.totalItems = data.TOTAL;
		}); **/
		
		CommonService.getMenuManual('./dist/json/parameter.json')
		.then(function(data){
			vm.paramList = data.data;
			vm.totalItems = 3;
		});
	}
    
	
}]);
