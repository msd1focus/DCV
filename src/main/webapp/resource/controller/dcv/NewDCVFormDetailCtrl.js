'use strict';

App.controller('NewDCVFormDetailController', ['CommonService', '$state', '$log', '$stateParams', '$scope', 'DTColumnDefBuilder', 'DTOptionsBuilder', '$window', '$uibModal', '$rootScope', '$localStorage', '$location',
			function(CommonService, $state, $log, $stateParams, $scope, DTColumnDefBuilder, DTOptionsBuilder, $window, $uibModal, $rootScope, $localStorage, $location) {
	
	var vm = this;
	
	/*--- Variables ---*/
	var dataPO = [];
	var dataTable = [];
	
	vm.formTerm = $stateParams.dataFromTerm;
	vm.formTerm.doc = $rootScope.docTerm;
	vm.formTerm.doc2 = $rootScope.doc2Term;
	console.log("Data From TERM : ",vm.formTerm);
	console.log("DOC 1 : ",vm.formTerm.doc);
	console.log("DOC 2 : ",vm.formTerm.doc2);
	
	vm.dataDetail = null;
	vm.checkbox = {};
	vm.dcvQty = {};
	vm.satuan = {};
	vm.dcvValueExcl = {};
	vm.notes = {};
	vm.prepareDataToServer = [];
	vm.dataToSave = {};
	vm.indexGeneral = null;
	
	//Initiate for DataTable
	vm.dtOptions = DTOptionsBuilder.newOptions()
					.withOption('paging', false)
					.withPaginationType('simple_numbers')
					.withOption('searching', false)
					.withOption('lengthMenu', [[5], [5]])
					.withDisplayLength(5)
        			.withOption('scrollY', '350px')
				    .withOption('scrollX', '100%')
				    .withOption('scrollCollapse', true)
				    .withOption('columnDefs',[
				    	{ 'className': 'hidden_column_data_table', 'targets': 7 },
				    	{ 'className': 'colum_widh_100', 'targets': 9 },
				    	]);
				    //.withOption('columnDefs' , [{'width': '40%', 'targets' : 2}] )
//				    .withFixedColumns({
//			    		leftColumns: 0,
//			            rightColumns: 4
//			        });
	
	/*--- Function-function ---*/
	init();
	
	vm.back = function() {
		$state.go('home.newDCVForm-term', {dataFromAdd: vm.formTerm});
	}
	
	vm.editMember = function(index, data) {
		if(vm.checkbox[index]) {
//			vm.prepareDataToServer[index] = data ;
			inputOnOff(index, false);
			
			// Regex only input number
			$('.qtyNumberRegex').on('input', function () { 
			    this.value = this.value.replace(/[^0-9]/g, '');
			});
			$('.dcvValueRegex').on('input', function () { 
			    this.value = this.value.replace(/[^0-9]/g, '');
			});
		} else {
//			vm.prepareDataToServer.splice(index, 1);
			resetDataInput(index);
			inputOnOff(index, true);
		}
	}
	
	vm.submitData = function(){
		getDataTable();
		
		console.log("Start validation for submit");
		if(dataTable.length > 0){
			// Validation Satuan
			for(var i=0; i<dataTable.length; i++){
				if(dataTable[i].satuan == ""){
					Swal.fire({
						html: "<b>Masih ada data yang kosong atau Satuan tidak terdaftar</b>",
						icon: "warning"
					});
					break;
				}else{
					console.log("Start validation for SP validate PC");
					var dataValidatePc = {
						noPC			: vm.formTerm.noPC,
						keyPC  			: vm.formTerm.keyPC,
						custCode        : vm.formTerm.modifiedBy
					}
					CommonService.doPost('/findInformationPCByNoPC', dataValidatePc)
			  		.then(function(data){
			  			console.log("Result for SP validate PC", data);
			  			if(data.propId == undefined) {
			  				Swal.fire({
								html: "<b>"+data.message+"</b>",
								icon: "warning"
							});
							console.log("Break Submit, Warning SP");
						} else {
							console.log("Continoue Submit");
							lanjutSimpan();
						}
			  		});
					console.log("End validation for SP validate PC");
				}
			}
		}else{
			Swal.fire({
			  html: "<b>List input tidak boleh kosong</b>",
			  icon: "warning"
			});
		}
		console.log("End validasi for submit");
		
		//var lanjut = false;
//		getDataInput_from_clone();
//		
//		if(vm.prepareDataToServer.length > 0) {
//			/*validasi satuan*/
//			var data = vm.prepareDataToServer;
//			console.log("Data for submit : ",data);
//			for (var i = 0; i < data.length; i++) {
//					if (data[i] != null) {
//						if (data[i].satuan == "") {
//							//lanjut = false;
//							CommonService.modalAlert('warning', 'Masih ada data yang kosong atau Satuan tidak terdaftar')
//					        .then(function() {});
//							break;
//						} else {
//							console.log("Start validation for SP validate PC");
//							var dataValidatePc = {
//									noPC			: vm.formTerm.noPC,
//									keyPC  			: vm.formTerm.keyPC,
//									custCode        : vm.formTerm.modifiedBy
//								}
//							CommonService.doPost('/findInformationPCByNoPC', dataValidatePc)
//					  		.then(function(data){
//					  			console.log("Result for SP validate PC", data);
//					  			if(data.propId == undefined) {
//									CommonService.modalAlert('warning', data.message)
//							        .then(function(result) {});
//									console.log("Break Submit, Warning SP");
//								} else {
//									//lanjut = true;
//									console.log("Continoue Submit");
//									lanjutSimpan();
//								}
//					  		});
//							console.log("End validation for SP validate PC");
//						}
//					} else {
//						continue;
//					}
//			}
//		} else {
//			CommonService.modalAlert('warning', 'List input tidak boleh kosong')
//	        .then(function() {});
//		}
//		
//		if(lanjut) {
//			lanjutSimpan();
//		} else {
//			CommonService.modalAlert('warning', 'Masih ada data yang kosong atau Satuan tidak terdaftar')
//	        .then(function() {});
//		}
	}
	
//	function lanjutSimpan() {
//		CommonService.modalAlert('confirmation', 
//				'Akan Submit untuk PC no: '+vm.formTerm.noPC+' periode '+CommonService.formatDate(new Date(vm.formTerm.periodPCFrom))+', PC dengan periode yng sama tidak akan bisa di-submit lagi')
//		.then(function(result) {
//			mappingDataToSave(vm.formTerm, vm.prepareDataToServer);
//			console.log("Data to save :",vm.dataToSave);
//		    CommonService.doPost('/saveNewDCV', vm.dataToSave)
//		    .then(function(result){
//		    	CommonService.modalAlert('Sukses', 
//    			'DCV dengan : '+result+' sudah dikirim, Selanjutya PC no. '+vm.formTerm.noPC+' tidak bisa klaim untuk periode yang sama')
//    			.then(function(result) {
//    			    CommonService.createResource('agent', vm)
//    			    .then(function(result){
//    			    	$state.go('home.newDCVForm-add');
//    			    });                       
//    			});
//		    });                       
//		});
//	}
	
	function lanjutSimpan() {
		Swal.fire({
			html: "<b>Akan Submit untuk PC no: "+vm.formTerm.noPC+" periode "+CommonService.formatDate(new Date(vm.formTerm.periodPCFrom))+", PC dengan periode yang sama tidak akan bisa di-submit lagi</b>",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#28a745',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Ok',
			allowOutsideClick: false
		}).then((result) => {
			mappingDataToSave(vm.formTerm, dataTable);
			if (result.value) {
				console.log("Data to save :",vm.dataToSave);
				CommonService.doPost('/saveNewDCV', vm.dataToSave).then(function(result){
					Swal.fire({
						icon: "success",
						html: "<b>DCV dengan : "+result+" sudah dikirim, Selanjutya PC no. "+vm.formTerm.noPC+" tidak bisa klaim untuk periode yang sama</b>"
					});
//					CommonService.createResource('agent', vm)
//    			    .then(function(result){
    			    	$state.go('home.newDCVForm-add');
//    			    });  
				});
			}
		});
		
	}
	
	function init() {	
		
		// Alert Product Item
		$('#copyDCV tbody ').on('click', 'tr td:nth-child(13)', function () {
			var table = $('#copyDCV').DataTable();
			var str = vm.dataDetail[table.row( this ).index()].prodItemDesc;
			Swal.fire({
			  html: "<b>"+str.replaceAll(",","<br>")+"</b>",
			  icon: 'info'
			});
		});
		
		
		/*CommonService.getMenuManual('./dist/json/dataDetail.json')
		.then(function(data){
			vm.dataDetail = data.data;
		});*/
		if(vm.formTerm.dataDetail.length > 0) {
			vm.dataDetail = vm.formTerm.dataDetail;
		}
		
		/*CommonService.doPost('/getSatuan')
	    .then(function(result){
	    	dataPO = result;
	    });*/
		
	}
	
	function resetDataInput(index) {
		/* this function with JQuery cause fixed Columns only do with clone style wrapper, 
		 * if there is have an idea with JavaScript Please share */
		$('#dcvQty'+index+'').val("");
		$('#satuan'+index+'').empty();
		$('#dcvValueExcl'+index+'').val("");
		$('#notes'+index+'').val("");
		
//		$('.DTFC_Cloned tr[data-dt-row='+index+'] input[id=dcvQty]').val("");
//		$('.DTFC_Cloned tr[data-dt-row='+index+'] select[id=satuan]').empty();
//		$('.DTFC_Cloned tr[data-dt-row='+index+'] input[id=dcvValueExcl]').val("");
//		$('.DTFC_Cloned tr[data-dt-row='+index+'] input[id=notes]').val("");
		
		/*angular.forEach(dataPO, function(value, key){
			$('.DTFC_Cloned tr[data-dt-row='+index+'] select[id=satuan]').append($('<option>', { 
		        value: value,
		        text : value 
		    }));
		});*/
		
		//
	}
	
	function getDataTable(){
		console.log("Start get data from table");
		var tableCopyDcv = document.getElementById("copyDCV");
		var chks = tableCopyDcv.getElementsByClassName("checkboxClass");
		dataTable = [];
		var j = 0;
		for (var i = 0; i < chks.length; i++) {
            if (chks[i].checked) {
            	dataTable.push(vm.dataDetail[i]);
            	dataTable[j].dcvQty = $('#dcvQty'+i).val();
            	dataTable[j].dcvValueExcl = $('#dcvValueExcl'+i).val();
            	dataTable[j].notes = $('#notes'+i).val();
				if($('#satuan'+i).val() != "none") {
					dataTable[j].satuan = $('#satuan'+i).val();
				} else {
					dataTable[j].satuan = "";
				}
				j++;
            }
        }
		console.log("Data Table : ", dataTable);
		console.log("End get data from table");
	}
	
	function getDataInput_from_clone() {

		/* this function with JQuery cause fixed Columns only do with clone style wrapper, 
		 * if there is have an idea with JavaScript Please share */
		for(var i=0; i<vm.prepareDataToServer.length; i++) {
			if(vm.prepareDataToServer[i] != null){
				vm.prepareDataToServer[i].dcvQty = $('#dcvQty'+i+'').val();
				vm.prepareDataToServer[i].dcvValueExcl = $('#dcvValueExcl'+i+'').val();
				vm.prepareDataToServer[i].notes = $('#notes'+i+'').val();
				if($('#satuan'+i+'').val() != "none") {
					vm.prepareDataToServer[i].satuan = $('#satuan'+i+'').val();
				} else {
					vm.prepareDataToServer[i].satuan = "";
				}
			}
		}
		
//		vm.dcvQty = $('.DTFC_Cloned input[id=dcvQty]').map(function() {
//			  return this.value;
//		}).get();
//		
//		vm.satuan = $('.DTFC_Cloned select[id=satuan]').map(function() {
//			  return this.value;
//		}).get();
//		
//		vm.dcvValueExcl = $('.DTFC_Cloned input[id=dcvValueExcl]').map(function() {
//			  return this.value;
//		}).get();
//		
//		
//		vm.notes = $('.DTFC_Cloned input[id=notes]').map(function() {
//			  return this.value;
//		}).get();
		
		
//		for(var i=0; i<vm.prepareDataToServer.length; i++) {
//			if(vm.prepareDataToServer[i] != null){
//			vm.prepareDataToServer[i].dcvQty = vm.dcvQty[i];
//			if(vm.satuan[i] != "none") {
//				vm.prepareDataToServer[i].satuan = vm.satuan[i];
//			} else {
//				vm.prepareDataToServer[i].satuan = "";
//			}
//			vm.prepareDataToServer[i].dcvValueExcl = vm.dcvValueExcl[i];
//			vm.prepareDataToServer[i].notes = vm.notes[i];
//			}
//		}
		
		/*for(var i=0; i<vm.prepareDataToServer.length; i++) {
			vm.prepareDataToServer[i].dcvQty = vm.dcvQtyPush[i];
			if(dataPO.includes(vm.satuanPush[i])) {
				vm.prepareDataToServer[i].satuan = vm.satuanPush[i];
			} else {
				vm.prepareDataToServer[i].satuan = "";
			}
			if(vm.satuanPush[i] != "none") {
				vm.prepareDataToServer[i].satuan = vm.satuanPush[i];
			} else {
				vm.prepareDataToServer[i].satuan = "";
			}
			//vm.prepareDataToServer[i].satuan = vm.satuanPush[i];
			vm.prepareDataToServer[i].dcvValueExcl = vm.dcvValueExclPush[i];
			vm.prepareDataToServer[i].notes = vm.notesPush[i];
			
		}*/
		
		//console.log("YANG MAU DIKIRIM = > ",vm.prepareDataToServer);
	}
	
	function inputOnOff(index, value){
		/* this function with JQuery cause fixed Columns only do with clone style wrapper, 
		 * if there is have an idea with JavaScript Please share */
		$('#dcvQty'+index+'').prop('disabled', value);
		$('#satuan'+index+'').prop('disabled', value);
		$('#dcvValueExcl'+index+'').prop('disabled', value);
		$('#notes'+index+'').prop('disabled', value);
		
//		$('.DTFC_Cloned tr[data-dt-row='+index+'] input[id=dcvQty]').prop('disabled', value);
//		$('.DTFC_Cloned tr[data-dt-row='+index+'] select[id=satuan]').prop('disabled', value);
//		$('.DTFC_Cloned tr[data-dt-row='+index+'] input[id=dcvValueExcl]').prop('disabled', value);
//		$('.DTFC_Cloned tr[data-dt-row='+index+'] input[id=notes]').prop('disabled', value);
		/*$('.DTFC_Cloned tr[data-dt-row='+index+'] input[id=satuan]').autocomplete({
	      source: dataPO
	    });*/
		
		
		
		if (value  == false) {
			// get data
			var lempar = {
					ppid : vm.dataDetail[index].promoProdId 
			}
			
			 CommonService.doPost('/getUomByPpId', lempar)
			    .then(function(result){
			    	//console.log("data yang dapat dari SP UOM = "+JSON.stringify(result));
			    	dataPO = result;
			    	
			    	$('#satuan'+index+'').append($('<option>', {
						value: "none",
						text: '--Pilih--'
					}));
			    	angular.forEach(dataPO, function(value, key){
						$('#satuan'+index+'').append($('<option>', { 
							value: value,
							text : value 
						}));
					});
//			    	$('.DTFC_Cloned tr[data-dt-row='+index+'] select[id=satuan]').append($('<option>', {
//						value: "none",
//						text: '--Pilih--'
//					}));
//					angular.forEach(dataPO, function(value, key){
//						$('.DTFC_Cloned tr[data-dt-row='+index+'] select[id=satuan]').append($('<option>', { 
//							value: value,
//							text : value 
//						}));
//					});
			    	
			    });                       
		}
		
		console.log("data checked : "+vm.dataDetail[index].prodClassDesc );
		
	}
	
	function mappingDataToSave(head, detail) {
		var dataDetail = [];
		var uploadedDok = [];
		
		angular.forEach(detail,function(value){
			//:TODO mapping detail from input
			if(value != null) {
				var dtl = {
						promoProdId		: value.promoProdId,
						prodVariantDesc : value.prodVariantDesc,
						prodVariant		: value.prodVariant,
						prodItemDesc	: value.prodItemDesc,
						prodItem		: value.prodItem,
						prodClass		: value.prodClass,
						prodClassDesc 	: value.prodClassDesc,
						prodBrand		: value.prodBrand,
						prodBrandDesc	: value.prodBrandDesc,
						prodExt			: value.prodExt,
						prodExtDesc		: value.prodExtDesc,
						prodPack		: value.prodPack,
						prodPackDesc	: value.prodPackDesc,
						pcLine          : value.noLinePC,
						qyt				: value.dcvQty,
						uom				: value.satuan,
						valExc			: value.dcvValueExcl,
						catatanDist 	: value.notes,
						modifiedBy		: head.modifiedBy
				}
			
				dataDetail.push(dtl);
			}
		});
		
		var mapDok = {
			docType		: "RF",
			docDate		: vm.formTerm.doc.lastModifiedDate,
			uploadTime	: new Date(),
			description	: vm.formTerm.doc.name,
			downloadAddr: CommonService.parsingDateIndForUpload(new Date()) +"_"+ vm.formTerm.doc.name,
			modifiedBy	: head.modifiedBy,
			uploadBy	: head.modifiedBy
		}
		uploadedDok.push(mapDok);
		if(vm.formTerm.doc2 != undefined) {
			mapDok = {
				docType		: "BA",
				docDate		: vm.formTerm.doc2.lastModifiedDate,
				uploadTime	: new Date(),
				description	: vm.formTerm.doc2.name,
				downloadAddr: CommonService.parsingDateIndForUpload(new Date()) +"_"+ vm.formTerm.doc2.name,
				modifiedBy	: head.modifiedBy,
				uploadBy	: head.modifiedBy
			}
			uploadedDok.push(mapDok);
		}
		
		vm.dataToSave = {
			custCode		: head.custCode,
			custName		: head.custName,
			noPC			: head.noPC,
			keyPC			: head.keyPC,
			noPPId			: head.propId,
			noPP			: head.propNo,
		/*	periodDCVFrom	: head.dcvDateFrom,
			periodDCVTo		: head.dcvDateTo,*/
			kategoriPC		: head.kategoriPC,
			tipePC			: head.tipePC,
			periodPCFrom	: head.periodPCFrom,
			periodPCTo		: head.periodPCTo,
			modifiedBy		: head.modifiedBy,
			company			: head.company,
			location		: head.location,
			region			: head.region,
			area			: head.area,
			dcvRequestDetail: dataDetail,
			dcvDokumenDetail: uploadedDok
		}
		
		//console.log("MAPPING TO SAVE = "+JSON.stringify(vm.dataToSave));
		
		/* For Upload File */
		var uploadUrl = "/uploadFileToServer";
		var file = vm.formTerm.doc;
		CommonService.uploadFileToServer(file, uploadUrl, CommonService.parsingDateIndForUpload(new Date()) +"_"+ vm.formTerm.doc.name, head.custCode);
		if(vm.formTerm.doc2 != undefined) {
			var file1 = vm.formTerm.doc2;
			CommonService.uploadFileToServer(file1, uploadUrl, CommonService.parsingDateIndForUpload(new Date()) +"_"+ vm.formTerm.doc2.name, head.custCode);
        }
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
				param : function(){
	        		return vm.formTerm.noPC;
	        	}
			}
		});
		
		modalInstance.result
		.then(
			function(dataConcat){
				//console.log(JSON.stringify(dataConcat));
				getDataInput_from_clone();
				//$state.go('home.view-detail', {dataFromMntr: dataConcat, urlBefore:'home.copyDCVForm-detail', dataInputBefore: vm.prepareDataToServer});
				
				localStorage.setItem('dataFromMntr', JSON.stringify(dataConcat));
				var url = $state.href('home.view-detail', {dataFromMntr: dataConcat});
				window.open(url,'_blank');
			}
		)
	}

}]);

/**MODAL CONTROLLER**/
App.controller('DcvTerkaitCtrl', function ($uibModalInstance, CommonService, param){
	var vm = this;
	
	/*CommonService.getMenuManual('./dist/json/dataTable.json')
	.then(function(data){
		vm.dcvList = data.data;
	});*/
	
	CommonService.doPost('/getAllDCVByNoPc', param)
		.then(
			function(data){
				console.log(JSON.stringify(data));
			}
	);
	
	vm.clickOnData = function(target) {
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