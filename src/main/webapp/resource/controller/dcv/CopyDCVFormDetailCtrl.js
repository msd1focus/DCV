'use strict';

App.controller('CopyDCVFormDetailController', ['$http', '$q', 'CommonService', '$state', '$log', '$stateParams', '$scope', 'DTColumnBuilder', 'DTOptionsBuilder', '$uibModal', '$window','$timeout', '$location', '$localStorage', '$rootScope',
				function($http, $q, CommonService, $state, $log, $stateParams, $scope, DTColumnBuilder, DTOptionsBuilder, $uibModal, $window,$timeout, $location, $localStorage, $rootScope) {
	
	var vm = this;
	
	/*--- Variables ---*/
	var param = $stateParams.dataFromInput;
	vm.formTerm = $stateParams.dataFromInput;
	vm.formTerm.doc = $rootScope.docTerm;
	vm.formTerm.doc2 = $rootScope.doc2Term;
	var dataAfterView = $stateParams.dataAfterView;
	/*console.log("data setelah view detail = "+JSON.stringify(dataAfterView));*/
	var dataPO = [];
	
	vm.input = true;
	vm.dataDetail = null;
	vm.checkbox = {};
	vm.dcvQty = {};
	vm.satuan = {};
	vm.dcvValueExcl = {};
	vm.notes = {};
	vm.prepareDataToServer = [];
	vm.userName = $rootScope.userProfile.userName;
	
	/*//Dummy data for Submit
	vm.dataFromCopy = {
			  noPC: "n01190003-1",
			  noKeyPC: "3124",
			  selectedDate: "2019-10-06T17:00:00.000Z",
			  selectedDate2: "2019-10-30T17:00:00.000Z",
			  katPC: "12343124",
			  tipePC: "955643124",
			  selectedDate3: "2019-10-06T17:00:00.000Z",
			  selectedDate4: "2019-10-30T17:00:00.000Z"
			};*/
	
	//Initiate for Angular-DataTable
	
	$timeout(function() {
		vm.dtOptions = DTOptionsBuilder.newOptions()
					.withOption('paging', false)
					.withPaginationType('simple_numbers')
					.withOption('searching', false)
					.withOption('lengthMenu', [[5], [5]])
					.withDisplayLength(5)
        			.withOption('scrollY', '350px')
				    .withOption('scrollX', '100%')
					.withOption('responsive', true)
				    .withFixedColumns({
			    		leftColumns: 0,
			            rightColumns: 4
			        });
	}, 100);
	
	
	
	/*--- Function-function ---*/
	init();
	
	vm.back = function() {
		$state.go('home.copyDCVForm-add');
	}
	
	vm.editMember = function(index,data) {
		//console.log("index checkbox:" + index)
		if(vm.checkbox[index]) {
			console.log("data dari ceklis> "+JSON.stringify(data));
			vm.prepareDataToServer[index] = data ;
			inputOnOff(index, false);
		} else {
			vm.prepareDataToServer.splice(index, 1);
			resetDataInput(index);
			inputOnOff(index, true);			
		}
		
		//console.log("data dari cekli masuk ke array temp> "+JSON.stringify(vm.prepareDataToServer));
	}
	
	vm.submitData = function(){
		var lanjut = false;
		
		
		getDataInput_from_clone();
		console.log("data yang masuk di submit = > ",vm.prepareDataToServer);
		if(vm.prepareDataToServer.length > 0) {
			
			/*validasi satuan*/
			var data = vm.prepareDataToServer;
			console.log("data after convert to save : ", data);
				for (var i = 0; i < data.length; i++) {
						if (data[i] != null) {
							if (data[i].satuan == "") {
									lanjut = false;
									break;
							} else {
									lanjut = true;
							}
						}
						else {
							continue;
						}
				}
			
		
			/*=================================*/
		} else {
			CommonService.modalAlert('warning', 'List input tidak boleh kosong')
	        .then(function(result) {});
		}
		
		if(lanjut) {
			lanjutSimpan();
		} else {
			CommonService.modalAlert('warning', 'Masih ada data yang kosong atau Satuan tidak terdaftar')
	        .then(function(result) {});
		}
	}
	
	function lanjutSimpan() {
		//mappingDataToSave(param.dcvReq, vm.prepareDataToServer);
		//console.log("data akhir yg akan di save" + vm.dataToSave);
		CommonService.modalAlert('confirmation', 
				'Akan Submit untuk PC no: '+param.dcvReq.noPC+' periode '+CommonService.formatDate(new Date(param.dcvReq.periodPCFrom))+', PC dengan periode yng sama tidak akan bisa di-submit lagi')
		.then(function(result) {
			mappingDataToSave(param.dcvReq, vm.prepareDataToServer);
			
		    CommonService.doPost('/saveNewDCV', vm.dataToSave)
		    .then(function(result){
		    	CommonService.modalAlert('Sukses', 
    			'DCV dengan : '+result+' sudah dikirim, Selanjutya PC no. '+param.dcvReq.noPC+' tidak bisa klaim untuk periode yang sama')
    			.then(function(result) {
    			    CommonService.createResource('agent', vm)
    			    .then(function(result){
    			    	$state.go('home.copyDCVForm-add');
    			    });                       
    			});
		    });
		});
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
		console.log("test input : ",input);
		var point = input.replaceAll(".",""),
			result = point.replace(",",".");
		return result;
	}
	
	function init() {
		if(param.listDetail.length > 0) {
			for(var i=0; i<param.listDetail.length; i++){
				param.listDetail[i].qty = formatRupiah(param.listDetail[i].qty);
				param.listDetail[i].valueExt = formatRupiah(param.listDetail[i].valueExt);
			}
			console.log("param detail : ", param.listDetail);
			vm.dataDetail = param.listDetail;
		}
		
		CommonService.doPost('/getSatuan')
	    .then(function(result){
	    	dataPO = result;
	    });
	
		
		
		
		
	}
	
	function resetDataInput(index) {
		/* this function with JQuery cause fixed Columns only do with clone style wrapper, 
		 * if there is have an idea with JavaScript Please share */
		$('.DTFC_Cloned tr[data-dt-row='+index+'] input[id=dcvQty]').val("");
		$('.DTFC_Cloned tr[data-dt-row='+index+'] select[id=satuan]').empty();
		$('.DTFC_Cloned tr[data-dt-row='+index+'] input[id=dcvValueExcl]').val("");
		$('.DTFC_Cloned tr[data-dt-row='+index+'] input[id=notes]').val("");
		
	}
	
	function getDataInput_from_clone() {
		
		vm.dcvQty = $('.DTFC_Cloned input[id=dcvQty]').map(function() {
			  return this.value;
		}).get();
		
		
		vm.satuan = $('.DTFC_Cloned select[id=satuan]').map(function() {
			  return this.value;
		}).get();
		
		
		
		vm.dcvValueExcl = $('.DTFC_Cloned input[id=dcvValueExcl]').map(function() {
			  return this.value;
		}).get();
		
		vm.notes = $('.DTFC_Cloned input[id=notes]').map(function() {
			  return this.value;
		}).get();
		
		for(var i=0; i<vm.prepareDataToServer.length; i++) {
			if(vm.prepareDataToServer[i] != null){	
			if(vm.satuan[i] != "none") {
				vm.prepareDataToServer[i].satuan = vm.satuan[i];
			} else {
				vm.prepareDataToServer[i].satuan = "";
			}
			
			// Get data from clone & convert to number
			vm.prepareDataToServer[i].dcvQty = parseFloat(replaceCount(vm.dcvQty[i]));
			vm.prepareDataToServer[i].dcvValueExcl = parseFloat(replaceCount(vm.dcvValueExcl[i]));
			vm.prepareDataToServer[i].qty = parseFloat(replaceCount(vm.prepareDataToServer[i].qty));
			vm.prepareDataToServer[i].valueExt = parseFloat(replaceCount(vm.prepareDataToServer[i].valueExt));
			vm.prepareDataToServer[i].notes = vm.notes[i];
			}
		}
		
		console.log("DATA TRKAHIR YG AKAN DI KIRIM :"+JSON.stringify(vm.prepareDataToServer));
	}
	
	function inputOnOff(index, value){
		/* this function with JQuery cause fixed Columns only do with clone style wrapper, 
		 * if there is have an idea with JavaScript Please share */
		$('.DTFC_Cloned tr[data-dt-row='+index+'] input[id=dcvQty]').prop('disabled', value);
		$('.DTFC_Cloned tr[data-dt-row='+index+'] select[id=satuan]').prop('disabled', value);
		$('.DTFC_Cloned tr[data-dt-row='+index+'] input[id=dcvValueExcl]').prop('disabled', value);
		$('.DTFC_Cloned tr[data-dt-row='+index+'] input[id=notes]').prop('disabled', value);
		
		
		/*$('.DTFC_Cloned tr[data-dt-row='+index+'] input[id=satuan]').autocomplete({
	      source: dataPO
	    })*/
		
		if (value  == false) {
			// get data
			
			var lempar = {
					ppid : vm.dataDetail[index].promoProdId 
			}
			
			 CommonService.doPost('/getUomByPpId', lempar)
			    .then(function(result){
			    	//console.log("data yang dapat dari SP UOM = "+JSON.stringify(result));
			    	dataPO = result;
			    	
			    	if(vm.dataDetail[index].satuan == "")  // saat data kosong udh ok
			    	{
			    		console.log("data belum ada")
			    		$('.DTFC_Cloned tr[data-dt-row='+index+'] select[id=satuan]').empty();
			    		console.log("masuk saat belum ada :" +vm.dataDetail[index].satuan);
			    		$('.DTFC_Cloned tr[data-dt-row='+index+'] select[id=satuan]').append($('<option>', {
							value: "none",
							text: '--Pilih--'
						}));
			    		angular.forEach(dataPO, function(value, key){
							$('.DTFC_Cloned tr[data-dt-row='+index+'] select[id=satuan]').append($('<option>', { 
								value: value,
								text : value 
							}));
						});
			    	
			    		
			    	} 
			    	else {                        // bagian saat data nya udh pernah di isi yg belum 
			    		$('.DTFC_Cloned tr[data-dt-row='+index+'] select[id=satuan]').empty();
			    		
			    		/*console.log("masuk saat sudah ada :" +vm.dataDetail[index].satuan);   
			    		$('.DTFC_Cloned tr[data-dt-row='+index+'] select[id=satuan]').append($('<option>', {
							value: "none",
							text: '--Pilih--'
						}));*/
				    	
			    		console.log("data sudah ada")
			    		angular.forEach(dataPO, function(value, key){
			    			if(vm.dataDetail[index].satuan == value){
			    				$('.DTFC_Cloned tr[data-dt-row='+index+'] select[id=satuan]').append($('<option>', { 
			    					value: value,
			    					text : value 
			    				}));
			    			} 
						});
			    		angular.forEach(dataPO, function(value, key){
			    			if(vm.dataDetail[index].satuan != value){
			    				$('.DTFC_Cloned tr[data-dt-row='+index+'] select[id=satuan]').append($('<option>', { 
			    					value: value,
			    					text : value 
			    				}));
			    			} 
						});
			    	}
			    	
					
			    	
			    });                       
			
			
		}
		
		console.log("data satuan"+vm.dataDetail[index].satuan);
	}
	
	function mappingDataToSave(head, detail) {
		var dataDetail = [];
		var uploadedDok = [];
		
		angular.forEach(detail,function(value){
			//:TODO mapping detail from input
			if (value != null){
				var dtl = {
						promoProdId		: value.promoProdId,
						prodVariantDesc : value.productVariantDesc,
						prodVariant		: value.productVariant,
						prodItemDesc	: value.productItemDesc,
						prodItem		: value.productItem,
						prodClass		: value.productClass,
						prodClassDesc 	: value.productClassDesc,
						prodBrand		: value.productBrand,
						prodBrandDesc	: value.productBrandDesc,
						prodExt			: value.productExt,
						prodExtDesc		: value.productExtDesc,
						prodPack		: value.productPack,
						prodPackDesc	: value.productPackDesc,
						pcLine          : value.noLinePc,
						qyt			: value.dcvQty,
						uom			: value.satuan,
						valExc		: value.dcvValueExcl,
						catatanDist : value.notes,
						modifiedBy	: vm.userName
					}		
					dataDetail.push(dtl);
			}
			
		});
		
		if(head.dcvDokumenDetail.length > 0) {
			angular.forEach(head.dcvDokumenDetail, function(value){
				var mapDok = {
					docType		: value.docType,
					docDate		: value.docDate,
					uploadTime	: value.uploadTime,
					description	: value.description,
					downloadAddr: value.downloadAddr,
					modifiedBy	: vm.userName
				}
				uploadedDok.push(mapDok);
				var uploadUrl = "/uploadFileToServer";
				var file = mapDok.downloadAddr;
				CommonService.uploadFileToServer(file, uploadUrl, mapDok.description, mapDok.modifiedBy);
			});
		}
		
		vm.dataToSave = {
			custCode		: head.custCode,
			custName		: head.custName,
			noPC			: head.noPC,
			keyPC			: head.keyPC,
			noPPId			: head.noPPId,
			noPP			: head.noPP,
		/*	periodDCVFrom	: head.periodDCVFrom,
			periodDCVTo		: head.periodDCVTo,*/
			kategoriPC		: head.kategoriPC,
			tipePC			: head.tipePC,
			periodPCFrom	: head.periodPCFrom,
			periodPCTo		: head.periodPCTo,
			modifiedBy		: vm.userName,
			company			: head.company,
			location		: head.location,
			region			: head.region,
			area			: head.area,
			copyFrom		: head.dcvhId,
			dcvRequestDetail: dataDetail,
			dcvDokumenDetail: uploadedDok
		}
		
		console.log("MAPPING TO SAVE = "+JSON.stringify(vm.dataToSave));
		
		
	}
	
	/*Modal Caller*/
	vm.dcvTrk = function() {
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'pages/dcv/dcvTerkaitModal.html',
			controller: 'DcvTerkaitCtrl',
			controllerAs : 'vm',
			size: 'sm',
			resolve : {
			}
		});
		
		modalInstance.result
		.then(
			function(dataConcat){
				//console.log(JSON.stringify(dataConcat));
				//getDataInput_from_clone();
				//$state.go('home.view-detail', {dataFromMntr: dataConcat, urlBefore:'home.copyDCVForm-detail', dataInputBefore: vm.prepareDataToServer});
				
				localStorage.setItem('dataFromMntr', JSON.stringify(dataConcat));
				var url = $state.href('home.view-detail', {dataFromMntr: dataConcat});
				window.open(url,'_blank');
			}
		)
	}
}]);

/**MODAL CONTROLLER**/
App.controller('DcvTerkaitCtrl', function ($uibModalInstance, CommonService){
	var vm = this;
	
	CommonService.getMenuManual('./dist/json/dataTable.json')
	.then(function(data){
		vm.dcvList = data.data;
	});
	
	vm.clickOnData = function(target) {
		//console.log(JSON.stringify(data));
		//TODO: search data for monitoring-view detail form, from dcv-terkait
		//This data still dummy
		var dataConcat = {};
		CommonService.getMenuManual('./dist/json/dataViewDetail.json')
		.then(function(data){
			var param = target[0];
			dataConcat = {
					no_DCV		: param.No_DCV,
					kodeDist	: param.Kode_Customer,
					namaDist	: param.Name_Customer,
					region		: param.Region,
					area		: param.Area,
					lokasi		: param.Location,
					last_act	: param.Last_Action,
					current_act	: param.Current_Action,
					detail		: data.data
			}
			
			$uibModalInstance.close(dataConcat);
			dismiss();
		});
	}
	
	function dismiss(){
		$uibModalInstance.dismiss('cancel');
	}
});