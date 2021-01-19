'use strict';

App.controller('HistoriTerimaDokumenController', ['$window', '$state', '$scope', 'CommonService','$rootScope', '$uibModal',
				function($window, $state, $scope, CommonService, $rootScope, $uibModal) {
	var vm = this;
	
	/*--- Variables ---*/
	var paramSelectAction = [];
	var dataPrint = [];
	var table = null;
	vm.dataDetail = null;
	var fullName = $rootScope.userProfile.fullName;
	console.log("data yang masuk di submit = > "+JSON.stringify($rootScope.userProfile));
	console.log("bagian = > "+JSON.stringify($rootScope.userProfile.role.bagian));
	var userBagian = $rootScope.userProfile.role.bagian;
	
	
	vm.formatDate = CommonService.formatDate;
	vm.dateOptions = CommonService.generalDateOptions;
	vm.popup = {};
	vm.selectedParam = {};
	vm.adaTolakan = false;
	
	/*--- Function-function ---*/
	init();
	
	vm.open = function(numberOrder) {
		CommonService.openDatePicker(numberOrder, vm.popup);
	}
	
	vm.loadSelected = function() {
		vm.dataDetail = null;
		if(vm.selectedAction != undefined && vm.selectedDate != undefined) {
			
			
			vm.selectedParam = {
				tglProses	: vm.selectedDate,
				node        : vm.selectedAction.nodeId,
				pilihan     : vm.selectedAction.pilihan,
				bagian      : vm.selectedAction.bagian
			}
			
			CommonService.doPost('/searchDocHistoryBySp', vm.selectedParam)
			.then(
				function(data){
					//console.log("data yang di dapat dari sp:" +JSON.stringify(data));
					for(var i=0; i<data.length; i++){
						if(data[i].appvVal != null){
							data[i].appvVal = formatRupiah(data[i].appvVal);
						}
					}
					vm.dataDetail = data;
					//cari(data);
					dataPrint = data;
					
				}
			);
		} else {
			CommonService.modalAlert('warning', 'Data belum lengkap')
	        .then(function(result) {});
		}
	}
	
	vm.print = function() {
		if(dataPrint.length > 0) {
			/* XLS Head Columns */
	        var xlsHeader = ["No DCV",
				"Kode Customer",
				"Nama Customer",
				"Region",
				"Area",
				"Location",
				"No PC",
				"DCV Value Approved",
				"No Kwitansi",
				"No FP",
				"No PO",
				"No GR",
				"Task Id",
				"Note Tolakan"];
	 
	        /* XLS Rows Data */
	        var xlsRows = dataPrint;
	 
	        /* File Name */
	        var tglReport = CommonService.parsingDateOnlyInd(vm.selectedDate);
	        var filename = "historiTerimaDok_"+fullName+"_"+tglReport+".xlsx";
	        
	        //Export Excel with JavaScript
	        CommonService.exportJSONToExcel(xlsHeader, xlsRows, filename);
	        CommonService.modalAlert('infomation', "File "+filename+" ada di folder Downloads")
	        .then(function(result) {});
		} else {
			CommonService.modalAlert('warning', 'Tidak dapat diprint karena data kosong')
	        .then(function(result) {});
		}
	}
	
	// Format Number to Rupiah
	function formatRupiah(number){
		var number_string = number.toString().replace(/[^,\d]/g, '').toString(),
		split   		= number_string.split(','),
		sisa     		= split[0].length % 3,
		rupiah     		= split[0].substr(0, sisa),
		ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);

		if(ribuan){
			var separator = sisa ? '.' : '';
			rupiah += separator + ribuan.join('.');
		}
			
		rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
		return  rupiah;
	}
	
	// Replace for count
	function replaceCount(input){
		var point = input.replaceAll(".",""),
			result = point.replace(",",".");
		return result;
	}
	
	function init() {
		
		CommonService.doPost('/dokumenaction/getListActionDocBatch', userBagian)
		.then(
			function(data){
				vm.listAksi = data;
			}
		);
	}
	
	/*function cari(paramData) {
		
					table = $('#historiTerimaDok').DataTable({
						"retrieve": true,
						"data" : paramData,
						"columns": [
							{ "data": "noDcv" },
						    { "data": "custCode" },
						    { "data": "custName" },
						    { "data": "region" },
						    { "data": "area" },
						    { "data": "location" },
						    { "data": "noPc" },
						    { "data": "appvVal" },
						    { "data": "noKwitansi" },
						    { "data": "noFp" },
						    { "data": "poNo" },
						    { "data": "grNo" },
						    { "data": "note" }
						],
						"rowCallback": function( row, data, index ) {
					        $('td', row).css('font-size', '12px');
						},
						"paging": false,
						"searching": false,
						"info": true,
						"sort": false,
						"scrollX": "100%",
						"scrollY": "200px"
					});
					
					//table.columns(12).visible(param.tolakan);
				
	}*/
}]);