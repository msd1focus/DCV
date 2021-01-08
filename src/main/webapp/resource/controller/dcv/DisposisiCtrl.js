'use strict';

App.controller('DisposisiController', ['$window', '$state', '$scope', 'CommonService','$rootScope', '$uibModal',
				function($window, $state, $scope, CommonService, $rootScope, $uibModal) {
	var vm = this;
	
	/*--- Variables ---*/
	var indexPrint = 1;
	var fullName = $rootScope.userProfile.fullName;
	var userBagian = $rootScope.userProfile.role.bagian;
	var userName = $rootScope.userProfile.userName;
	var dataPrint = [];
	
	vm.dataDetail = null;
	vm.formatDate = CommonService.formatDate;
	vm.dateOptions = CommonService.generalDateOptions;
	vm.popup = {};
	vm.selectedParam = {};
	vm.dataDetail = null;
	
	
	/*--- Function-function ---*/
	init();
	
	vm.open = function(numberOrder) {
		CommonService.openDatePicker(numberOrder, vm.popup);
	}
	
	vm.loadSelected = function() {
		vm.dataDetail = null
		if (userBagian != "Distributor"){
			vm.selectedParam = {
					disposisi	: vm.PARAM.PARAM_VALUE,
					start	: vm.selectedDate,
					end	: vm.selectedDate2
			}
		} else {
			vm.selectedParam = {
					custCode : userName ,
					disposisi	: vm.PARAM.PARAM_VALUE,
					start	: vm.selectedDate,
					end	: vm.selectedDate2
			}
		}
		console.log("data yg dikirm --> " +JSON.stringify(vm.selectedParam));
		CommonService.doPost('/getDisposisiData', vm.selectedParam)
		.then(
			function(data){
				console.log("data yg tampil --> " +JSON.stringify(data));
				vm.dataDetail = data;
				dataPrint = data;
			});
		
	
	}
	
	vm.print = function(tableID) {
		//var cobaData = [];
		var tglReport = CommonService.parsingDateOnlyInd(vm.selectedDate);
		var filename = "disposisi_"+fullName+"_"+tglReport+".xlsx";
		
		
		//console.log(JSON.stringify(cobaData));
		
		var xlsHeader = [
			"No.DCV",
			"Kode Customer",
			"Name Customer",
			"Region",
			"Area",
			"Location",
			"No.PC",
			"DCV Value",
			"DCV Value Approved",
			"Tgl Action TC",
			"Disposisi",
			"Flag Open Disposisi",
			"Tgl Open Disposisi",
			"No Invoice AP",
			"Tgl Invoice AP"
			];
 
        /* XLS Rows Data */
        var xlsRows = dataPrint;
        
        //Export Excel with JavaScript
        CommonService.exportJSONToExcel(xlsHeader, xlsRows, filename);
        CommonService.modalAlert('infomation', "File "+filename+" ada di folder Downloads")
        .then(function(result) {});
	}
	
	function getParam() {
		CommonService.getMenuManual('./dist/json/param2.json')
		.then(function(data){
			vm.paramList = data.data;
		});
	}
	
	function init() {
		getParam();
		
		/*CommonService.doPost('/loginDCV', vm.userLogin) 
		.then(
			function(data){
				CommonService.getMenuManual('./dist/json/dataDisposisi.json')
				.then(function(data){
					vm.dataDetail = data.data;
					
					vm.table = $('#disposisi').DataTable({
						"data" : data.data,
						"columns": [
							{ "data": "No_DCV", "title": "No.DCV" },
						    { "data": "Kode_Customer" },
						    { "data": "Name_Customer" },
						    { "data": "Region" },
						    { "data": "Area" },
						    { "data": "Location" },
						    { "data": "No_PC" },
						    { "data": "DCV_Value" },
						    { "data": "DCV_Value_Approved" },
						    { "data": "Tgl_action_TC" },
						    { "data": "Disposisi" },
						    { "data": "Flag_open_disposisi" },
						    { "data": "Tgl_open_disposisi" },
						    { "data": "No_invoice_AP" },
						    { "data": "Tgl_invoice_AP" }
						],
						"rowCallback": function( row, data, index ) {
					        $('td', row).css('font-size', '12px');
						},
						"paging": false,
						"searching": false,
						"info": true,
						"sort": true,
						"scrollY": '200px',
						"scrollX": '100%'
					});
				});
			}
		);*/
	}
}]);