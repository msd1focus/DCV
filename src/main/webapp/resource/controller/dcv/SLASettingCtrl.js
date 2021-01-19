'use strict';

App.controller('SLASettingController', ['$window', '$state', '$scope', 'CommonService', '$uibModal', 'DTOptionsBuilder', 'DTColumnDefBuilder',
	function($window, $state, $scope, CommonService, $uibModal, DTOptionsBuilder, DTColumnDefBuilder) {
	var vm = this;
	
	/*--- Variables ---*/
	vm.dataDetail = null;
	
	//Initiate for Angular-DataTable
	vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('paging', false)
			.withOption('searching', false)
			.withOption('scrollY', '500px')
		    .withOption('scrollCollapse', true)
		    .withOption('sort', false)
//		    .withOption('columnDefs', [
//		    	{ className: "hidden_column_data_table", "targets": [1] },
//		    	{ className: "hidden_column_data_table", "targets": [5] }
//		    ])
		    
    /*--- Function-function ---*/
	init();
	
	vm.edit = function() {
		$state.go('home.sla-setting-edit');
	}
	
	vm.simpan = function(data) {
		CommonService.modalAlert('confirmation', 'Yakin menyimpan perubahan ?')
        .then(function() {
        	CommonService.doPost('/wfnode/updateWfNode', data).then(function(result){
        		
        		$state.go('home.sla-setting');
        	});
        });
	}
	
	vm.back = function() {
		$state.go('home.sla-setting');
	}
	
	function init() {
//		CommonService.getMenuManual('./dist/json/dataSLA.json')
//		.then(function(data){
//			vm.dataDetail = data.data;
//		});
		
		CommonService.doPost('/wfnode/getWfNode')
		.then(
			function(data){
				console.log(data);
				vm.dataDetail = data;
			}
		);
	}
}]);