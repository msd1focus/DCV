'use strict';

App.controller('StaticDashboardController', ['$window', '$state', '$scope', 'CommonService', 'DTColumnDefBuilder', 'DTOptionsBuilder', 'DTColumnBuilder', '$uibModal', '$rootScope', '$stateParams',
				function($window, $state, $scope, CommonService, DTColumnDefBuilder, DTOptionsBuilder, DTColumnBuilder, $uibModal, $rootScope, $localStorage) {
	
	var vm = this;
	
	/*--- Variables ---*/
	var table = null;
	vm.dataDetail = null;
	vm.formatDate = CommonService.formatDate;
	vm.dateOptions = CommonService.generalDateOptions;
	vm.popup = {};
	vm.userName = $rootScope.userProfile.userName;
	vm.userDivision = $rootScope.userProfile.role.bagian;
	vm.selectedParam = {};
	vm.PARAM = {};
	vm.paramDcvListViewDetail = {};
	
	
	/*--- Function-function ---*/
	init();
	
	vm.loadSelected = function() {
		var listOfSearch = [];
		
		for(var i=0; i<20; i++){
			listOfSearch[i] = document.getElementsByName("searchTxt")[i].value;
		}
		
		vm.selectedParam = {
			pBagian		: vm.userDivision,
			pUserName	: vm.userName,
			pJenis		: vm.PARAM,
			pPeriode1	: vm.selectedDate,
			pPeriode2	: vm.selectedDate2,
			from		: null
			//searchList	: listOfSearch
		}
		
		localStorage.setItem('paramDataForMntr', JSON.stringify(vm.selectedParam));
		$window.location.reload();
	}
	
	vm.open = function(numberOrder) {
		CommonService.openDatePicker(numberOrder, vm.popup);
	}
	
	vm.reset = function() {
		$window.location.reload();
	}
	
	vm.eksportXLS = function(distributor, basicfilter, perSubmitStart, perSubmitEnd, bagian) {
		//TODO: buat fungsi untuk mapping param ke server untuk data excel
		//alert("Fungsi Eksport XLS belum Aktif");		
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'pages/dcv/exportToExcelModal.html',
			controller: 'ExportToExcelCtrl',
			controllerAs : 'vm',
			size: 'md',
			resolve : {
				distributor : function(){
//					return distributor = $rootScope.userProfile.userType;
					return distributor = $rootScope.userProfile.userName;
				},
				basicfilter : function(){
					return basicfilter = vm.PARAM.PARAM_NAME;
				},
				perSubmitStart : function(){
	        		return perSubmitStart = vm.selectedDate;
	        	},
	        	perSubmitEnd : function(){
	        		return perSubmitEnd = vm.selectedDate2;
	        	},
	        	bagian : function(){
	        		return bagian = vm.userDivision;
	        	}
			}
		});
		
		modalInstance.result
		.then(
			function(data){
				window.history.back();
				CommonService.showGrowl(CommonService.SUCCESS, data);
			}
		)
	}
	
	function getParam() {
		CommonService.getMenuManual('./dist/json/param.json')
		.then(function(data){
			vm.paramList = data.data;
		});
	}
	
	function dataDetail(param) {
		var new_row = $("<tr class='search-header'/>");
		$('#example thead th').each(function(i) {
		  var title = $(this).text();
		  var new_th = $('<th style="' + $(this).attr('style') + '" />');
		  if(i==0) {
			  $(new_th).append('<span></span>');
		  } else {
			  $(new_th).append('<input type="text" name="searchTxt" class="form-control pull-right input-sm" size="7" placeholder="' + 
					  title + '" data-index="'+i+'"/>');
		  }
		 
		  $(new_row).append(new_th);
		});
		$('#example thead').prepend(new_row);
		
		CommonService.doGET('/serverDate') /*harus dihapus jika sudah ke DB*/
		.then(
			function(data){
				if(param.pPeriode1 == null) {
					param.pPeriode1 = data[0];
					vm.selectedParam.from = 1;
				};
				if(param.pPeriode2 == null) {
					param.pPeriode2 = data[1];
					vm.selectedParam.from = 1;
				};
				
				CommonService.doPost('/getDcvList', param)
				.then(function(data){
					vm.dataDetail = data;
					vm.paramDcvListViewDetail = param;
					table = $('#example').DataTable({
						  "data" : data,
						  "columns": [
							{ "data": null, 
							  "render": function (data, type, row) {
						          return '<div>' +
						          			'<button type="button" id="detail" class="mr btn btn-primary btn-xs" data-toggle="tooltip" title="Detail"><i class="fa fa-eye"></i></button>' +
						          			'&nbsp;' +
						          			'<button type="button" id="workflow" class="mr btn btn-success btn-xs" data-toggle="tooltip" title="Workflow"><i class="fa fa-info-circle"></i></button>' +
						          		  '</div>'
					        	}
								
							},
						    { "data": "noDcv" },
//						    { "data": "periodDCVFromString" },
//						    { "data": "periodDCVToString" },
						    { "data": "submitTimeString" },
						    { "data": "custCode" },
						    { "data": "custName" },
						    { "data": "region" },
						    { "data": "area" },
						    { "data": "location" },
						    { "data": "noPC" },
						    { "data": "periodPCFromString" },
						    { "data": "periodPCToString" },
						    { "data": "kategoriPC" },
						    { "data": "tipePC" },
						    { "data": "value",
						      "render": $.fn.dataTable.render.number( '.', '', 0, '' )
						    },
						    { "data": "appvValue", 
						      "render": $.fn.dataTable.render.number( '.', '', 0, '' )	
						    },
						    { "data": "returnTask" },
						    { "data": "noFaktur" },
						    { "data": "lasStep" },
						    { "data": "currentStep" }
						  ],
						  "rowCallback": function( row, data, index ) {
							  $('td', row).css('font-size', '12px');
							  //add color
							  if(parseFloat(data.sla) >= 50){
								  $('td', row).css('color', '#dd4b39');
							  }						      
						      //add padding-top in row 0
						      if(parseFloat(index) == 0){
						    	  $('td', row).css('padding-top', '30px');  
						      }
							},
						  "lengthMenu"	 : [[5, 10], [5, 10]],
						  "displayLength": 5,
						  "lengthChange" : false,
						  "sDom"		 : 'lrtip',
						  "paging"		 : false,
						  "scrollY"		 : '270px',
					      "scrollX"		 : '300px'
					});
					// Filter event handler
					$( table.table().container() ).on( 'keyup', 'thead input', function () {
					  table
					    .column( $(this).data('index') )
					    .search( this.value )
					    .draw();
					});
					// Button event handler
					$('#example tbody').on( 'click', '#detail', function () {
						var item = table.row( $(this).parents('tr') ).data();
						var dataConcat = {};
						var param = {
								noDcv 	: item.noDcv,
								roleCode: $rootScope.userProfile.userRole,
								custCode: item.custCode
						};
						
						//TODO: search data to back end
						CommonService.doPost('/getDcvBodyListForViewDetail', param)
						.then(function(data){
							dataConcat = {
									header	: item,
									detail	: data,
									paramDcvListAfterAction : vm.paramDcvListViewDetail
							}
							$state.go('home.view-detail', {dataFromMntr: dataConcat, urlBefore:'home.staticDashboard'});
						})
				    } );
					$('#example tbody').on( 'click', '#workflow', function () {
						var item = table.row( $(this).parents('tr') ).data();
						var dataConcat = {};
						var paramWorkFlow = {
								pbagian : vm.userDivision,
								pNoDcv  : item.noDcv
						};
												
						CommonService.doPost('/getDcvBodyListForViewWorflow2', paramWorkFlow)
						.then(function(data){
							dataConcat = {
									header	: item,
									detail	: data
							}
							//console.log(JSON.stringify(dataConcat));
							$state.go('home.view-workflow', {dataFromDetail: dataConcat, urlBefore: 'home.staticDashboard'});
						})
						
						//TODO: search data to back end
//						CommonService.doPost('/getDcvBodyListForViewWorflow', item.noDcv)
//						.then(function(data){
//							dataConcat = {
//									header	: item,
//									detail	: data
//							}
//							//console.log(JSON.stringify(dataConcat));
//							//$state.go('home.view-workflow', {dataFromDetail: dataConcat, urlBefore: 'home.staticDashboard'});
//						})
				    } );
				
				});
			}
		);
	}
	
	function init() {
		getParam();
		
		vm.selectedParam = JSON.parse(localStorage.getItem('paramDataForMntr'));
		//console.log(JSON.stringify(vm.selectedParam));
		if(vm.selectedParam == undefined) {
			vm.selectedDate = new Date(new Date().setMonth(new Date().getMonth()-6));
			vm.selectedDate2 = new Date();
			vm.selectedParam = {
				pBagian		: vm.userDivision,
				pUserName	: vm.userName,
				pJenis		: {
							    "PARAM_NAME": "DCV All",
							    "PARAM_VALUE": "1"
							  },
				pPeriode1	: vm.selectedDate,
				pPeriode2	: vm.selectedDate2,
				from		: null
			};
		} else {
			vm.selectedDate = new Date(vm.selectedParam.pPeriode1);
			vm.selectedDate2 = new Date(vm.selectedParam.pPeriode2);
		}
		vm.PARAM = vm.selectedParam.pJenis;
		
		dataDetail(vm.selectedParam);
		localStorage.removeItem('paramDataForMntr');
		
	}
	
}]);


/**MODAL CONTROLLER**/
App.controller('ExportToExcelCtrl', function ($uibModalInstance, CommonService, distributor, basicfilter, perSubmitStart, perSubmitEnd, bagian){
	var vm = this;
	vm.loopingSort = ['0','1','2','3','4','5','6','7','8'];
	var listOfSearch = [];
	var listColum = [];
	var listOrder = [];
	
	for(var i=0; i<20; i++){
		listOfSearch[i] = document.getElementsByName("searchTxt")[i].value;
	}
	
	CommonService.getMenuManual('./dist/json/paramExportToXls.json')
	.then(function(data){
		vm.sortList = data.data;
	});
	
	CommonService.getMenuManual('./dist/json/paramExportToXls2.json')
	.then(function(data){
		vm.orderList = data.data;
	});
	
	vm.backToIndex = function(){
		dismiss();
	}
	
	vm.print = function(){
		var xlsHeader = [
			"Dcvh Company",
			"Dcvh Cust Code",
			"Dcvh Cust Name",
			"Dcvh Region",
			"Dcvh Area",
			"Dcvh Location",
			"Dcvh No DCV",
			"Dcvh Submit Time",
			"Dcvh No PC",
			"Dcvh Key PC",
			"Dcvh Periode PC Start",
			"Dcvh Periode PC End",
			"Dcvh PC Tipe",
			"Dcvh PC Kategori",
			"Dcvh Value",
			"Dcvh Appv Value",
			"Dcvh DCV Status",
			"Dcvl Prod Class Desc",
			"Dcvl Prod Brand Desc",
			"Dcvl Prod Ext Desc",
			"Dcvl QTY",
			"Dcvl UOM",
			"Dcvl Val Exc",
			"Dcvl Total Val Appv Exc",
			"Dcvl Slisih",
			"Dcvl Catatan TC",
			"Dcvl PPN Val",
			"Dcvl PPH Val",
			"Dcvl Total Val Inc",
			"Prod Code",
			"Prod Name",
			"QTY",
			"Harga Satuan",
			"Nilai Total",
			"Notes"
		];
		
		for(var i=0; i<=8; i++){
			var e = document.getElementById("selectParamColumnId"+i).value;
			var j = document.getElementById("selectParamOrderId"+i).value;
			listColum.push(e);
			listOrder.push(j);
		}
		//console.log("list colum : "+JSON.stringify(listColum));
		//console.log("list Order : "+JSON.stringify(listOrder));
		var paramExcel = {
				dist       : distributor,
				filterype  : basicfilter,
				bagian	   : bagian, 
				periodSubmitStart:  perSubmitStart,
				periodSubmitEnd : perSubmitEnd,
				noDcv : listOfSearch[0],
				periodSubmit : listOfSearch[1],
				custCode : listOfSearch[2],
				namaCustomer : listOfSearch[3],
				region : listOfSearch[4],
				area : listOfSearch[5],
				location: listOfSearch[6],
				noPc : listOfSearch[7],
				periodPcStart : listOfSearch[8],
				periodPcEnd : listOfSearch[9],
				kategoryPc : listOfSearch[10],
				tipePc : listOfSearch[11],
				value : listOfSearch[12],
				apprValue : listOfSearch[13],
				disposisi : listOfSearch[14],
				noSeri : listOfSearch[15],
				lastAction : listOfSearch[16],
				currentAction : listOfSearch[17],
				sortBy1 : document.getElementById("selectParamColumnId").value,
				orderBy1 : document.getElementById("selectParamOrderId").value,
				sortBy2 : listColum[0],
				orderBy2 : listOrder[0],
				sortBy3 : listColum[1],
				orderBy3 : listOrder[1],
				sortBy4 : listColum[2],
				orderBy4 : listOrder[2],
				sortBy5 : listColum[3],
				orderBy5 : listOrder[3],
				sortBy6 : listColum[4],
				orderBy6 : listOrder[4],
				sortBy7 : listColum[5],
				orderBy7 : listOrder[5],
				sortBy8 : listColum[6],
				orderBy8 : listOrder[6],
				sortBy9 : listColum[7],
				orderBy9 : listOrder[7],
				sortBy10 : listColum[8],
				orderBy10 : listOrder[8]
		}
		//console.log("Parameter Export Excel : ",paramExcel);
		//File Name
		var tglReport = CommonService.formatDate(new Date());
		var filename = "Report Excel All Data - "+tglReport+".xlsx";
		CommonService.doPost('/downloadExportExcel', paramExcel)
		.then(function(data){
			//Export Excel with JavaScript
			console.log("Record Size Excel : ", data);
	        CommonService.exportJSONToExcel(xlsHeader, data.data, filename);
	        dismiss();
		});
	}
	
	function dismiss(){
		$uibModalInstance.dismiss('cancel');
	}
});