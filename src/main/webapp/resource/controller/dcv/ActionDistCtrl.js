'use strict';

App.controller('ActionDistributorController', ['CommonService', '$state', '$stateParams', '$rootScope', function(CommonService, $state, $stateParams, $rootScope) {
	var vm = this;
	
	/*--- Variables ---*/
	var param = $stateParams.dataFromViewDetail;
	var stateActionWf = param.wfTask.nodeCode;
	var lanjutUpdate = false;
	var paramSelectAction = 'D';
	
	vm.userName = $rootScope.userProfile.userName;
	vm.formatDate = CommonService.formatDate;
	vm.dateOptions = CommonService.generalDateOptions;
	vm.popup = {};
	vm.listAksi = [];
	vm.jenisDoc = [];	
	vm.fileDesc = null;
	vm.fileuploadtime = null;
	vm.distAcc = {
			last	: param.header.lasStep,
			current	: param.header.currentStep,
			jenis	: undefined,
			file	: undefined,
			tgl		: undefined,
			no		: undefined,
			action	: undefined,
			noteAcc	: undefined
	}
	
	/*--- Function-function ---*/
	init();
	
	vm.open = function(numberOrder) {
		CommonService.openDatePicker(numberOrder, vm.popup);
	}
	
	vm.back = function(){
		var prmDcvList = {
			from : param.paramDcvListAfterAction.from,
			pBagian : param.paramDcvListAfterAction.pBagian,
			pJenis : param.paramDcvListAfterAction.pJenis,
			pPeriode1 : param.paramDcvListAfterAction.pPeriode1,
			pPeriode2 : param.paramDcvListAfterAction.pPeriode2,
			pUserName : param.paramDcvListAfterAction.pUserName,
			noDcv : param.header.noDcv,
			custCode: param.header.custCode,
			roleCode: $rootScope.userProfile.userRole
		}
		CommonService.doPost('/getHeaderBodyListAfterAction', prmDcvList)
		.then(function(data){
			param.header.currentStep = data.header[0].currentStep;
			param.header.lasStep = data.header[0].lasStep;
			param.header.taskId = data.header[0].taskId;
			param.header.nodecode = data.header[0].nodecode;
			param.detail.attchment = data.body.attchment;
			param.detail.lookupAdj = data.body.lookupAdj;
			param.detail.dokumen_pendukung = data.body.dokumen_pendukung;
			$state.go('home.view-detail', {dataFromMntr: param});
		});
	}
	
	vm.update = function() {
		lanjutUpdate = false;
		if(vm.distAcc.jenis == undefined) {
			CommonService.modalAlert('warning', 'Jenis dokumen belum dipilih')
	        .then(function(result) {});
		} else if( (vm.distAcc.file == undefined || vm.distAcc.file == '') && vm.fileDesc == "" ) {
			CommonService.modalAlert('warning', 'Wajib attach dokumen '+vm.distAcc.jenis.PARAM_NAME)
	        .then(function(result) {});
		}else if(vm.distAcc.tgl == undefined || vm.distAcc.tgl == ''){
			CommonService.modalAlert('warning', 'Tanggal tidak boleh kosong')
	        .then(function(result) {});
		}else if(vm.distAcc.no == undefined || vm.distAcc.no == ''){
			CommonService.modalAlert('warning', 'No Dokumen tidak boleh kosong')
	        .then(function(result) {});
		}else if(vm.distAcc.tgl == undefined || vm.distAcc.no == undefined) {
//			if(!contains(vm.distAcc.jenis.PARAM_VALUE, ['BA','RF','KW','FP','RK'])){
//				CommonService.modalAlert('warning', 'No.Dokumen & Tgl Dokumen '+vm.distAcc.jenis.PARAM_NAME+' wajib diisi')
//		        .then(function(result) {});
//			} else {
//				lanjutUpdate = true;
//			}
		} else {
			
			 var jenisDokumen = vm.distAcc.jenis.docCode;
			
			if(jenisDokumen == 'FP'){
				 var noDokumen =  vm.distAcc.no;
				 if(noDokumen.length != 19){
					CommonService.modalAlert('warning', 'Nomor Faktur Pajak Kurang !')
	        		.then(function(result) {});
				 }else{
					lanjutUpdate = true;
				}
			}else{
				lanjutUpdate = true;
			}
			
		}
		
		if(lanjutUpdate) {
			//console.log(JSON.stringify(vm.distAcc));
			var defUploadTime = CommonService.parsingDateIndForUpload(new Date());
			var filedescname = null;
			var fileuptime = null;
			if( vm.fileDesc != "" && (vm.distAcc.file == undefined || vm.distAcc.file == "") ){
				filedescname = vm.fileDesc;
				fileuptime = vm.fileuploadtime;
			}else{
				filedescname = vm.distAcc.file.name;
				fileuptime = defUploadTime;
			}
			
			var mapDok = {
				docNo		: vm.distAcc.no,
				docType		: vm.distAcc.jenis.docCode,
				//docDate		: vm.distAcc.file.lastModifiedDate,
				docDate		: vm.distAcc.tgl,
				uploadTime	: new Date(),
				//description	: vm.distAcc.file.name,
				description	: filedescname,
				//downloadAddr: defUploadTime +"_"+ vm.distAcc.file.name,
				downloadAddr: fileuptime+"_"+ filedescname,
				modifiedBy	: vm.userName,
				uploadBy	: vm.userName,
				dcvhId		: param.header.dcvhId
			}
			//console.log(JSON.stringify(mapDok));
	        
			CommonService.doPost('/savingDcvDoc', mapDok)
		    .then(function(result){
		    	CommonService.modalAlert('Sukses','DCV Dokumen telah ter-update').then(function(result) {
		    		//For Upload File 
		    		if( vm.distAcc.file == undefined || vm.distAcc.file == ""){
		    			// nothing
		    		}else{
		    			var file = vm.distAcc.file;
						var uploadUrl = "/uploadFileToServer";
				        CommonService.uploadFileToServer(file, uploadUrl, fileuptime +"_"+ file.name, param.header.custCode);
		    		}
			        vm.back();
		    	});
		    });
		}
	}
	
	vm.changeNo=function(){

		  var jenisDokumen = vm.distAcc.jenis;
		  var noDokumen =  vm.distAcc.no;

		  if(jenisDokumen != undefined){
			
			 if(jenisDokumen.docCode == 'FP'){
				
				var parsedValue = noDokumen.toString()
					.replace(/[^0-9.\-]/g, '')
		            .replace(/[^\dA-Za-z]/g, '')
		            .replace(/-$/, '');
					
					if(parsedValue.length  > 3){
						
						parsedValue = [parsedValue.slice(0, 3), '.', parsedValue.slice(3)].join('');
					}
					
					if(parsedValue.length  > 7){
						
						parsedValue = [parsedValue.slice(0, 7), '-', parsedValue.slice(7)].join('');
					}
					
					if(parsedValue.length  > 10){
						
						parsedValue = [parsedValue.slice(0, 10), '.', parsedValue.slice(10)].join('');
					}
				
				if(parsedValue.length  < 20){
					
					vm.distAcc.no = parsedValue;
				 }else{

					parsedValue = parsedValue.slice(0, -1);
					vm.distAcc.no = parsedValue;
				}
			  }
		  }
		  
    }
	
	vm.submit = function() {
		if(vm.distAcc.action == undefined) {
			CommonService.modalAlert('warning', 'Action belum dipilih').then(function() {});
		}else{
			var paramTask = {
				nodeId : vm.distAcc.action.nodeId,
				pilihan : vm.distAcc.action.pilihan
			}
			CommonService.doPost('/wfroute/getReturnTask', paramTask)
			.then(function(data){
				console.log("Return Task : "+ data.returnTask);
				if(data.returnTask == "Y" && (vm.distAcc.noteAcc == undefined || vm.distAcc.noteAcc == "")){
					CommonService.modalAlert('warning', 'Note tidak boleh kosong');
				}else if(data.returnTask == "Y"){
					CommonService.modalAlert('confirmation', 'Proses akan '+data.desc+', anda yakin?')
			        .then(function() { 
			        	submit2Server(vm.distAcc, data.returnTask);
			        });
				}else{
					submit2Server(vm.distAcc, data.returnTask);
				}
			});
		} 		
	}
	
	// On Change Jenis Dokumen
	$('#selectParamIdJenis').on('change', function () {
		
		// Dcv doc list
		var paramDocList = {
				dcvhId : param.header.dcvhId,
				docType : $(this).children("option:selected").val()
		}
		CommonService.doPost('/getDcvDocList', paramDocList)
		.then(
			function(data){
				// Set parameter in field html
				if(data[0] != undefined){
					vm.distAcc.tgl = data[0].docDate;
					vm.distAcc.no = data[0].docNo;
					vm.fileDesc = data[0].description;
					vm.fileuploadtime = CommonService.parsingDateIndForUpload(new Date(data[0].uploadTime));
					$('#readyFileUpload').val(data[0].description);
					$('#hiddenReadyFile').show();
				}else{
					vm.distAcc.tgl = "";
					vm.distAcc.no = "";
					vm.fileDesc = "";
					$('#hiddenReadyFile').hide();
					$('#readyFileUpload').val("");
				}
			}
		);
	});
	
	function init() {
//		var lempar = {
//				noDcv		: param.header.noDcv,
//				nodeCode	: stateActionWf,
//				bagian		: $rootScope.userProfile.role.bagian
//		}
//		CommonService.doPost('/findActionListByDcvAndBagianAndNodeCode', lempar)
//		.then(
//			function(data){
//				vm.listAksi = data;
//				//console.log(JSON.stringify(data));
//				mappingJenisDoc(stateActionWf);
//			}
//		);
		// upload doc list
		
		
		
		var paramDoc = {
				pTaskId : param.wfTask.id,
				pBagian : param.paramDcvListAfterAction.pBagian
		}
		CommonService.doPost('/getUploadDocList', paramDoc)
		.then(
			function(data){
				vm.jenisDoc = data.docList;
			}
		);
		
		var prm = {
				pDcvNo : param.header.noDcv,
				pUser : vm.userName,
				pBagian : param.paramDcvListAfterAction.pBagian
		}
		CommonService.doPost('/actionlist/getActionList', prm)
		.then(
			function(data){
				vm.listAksi =  data;
				mappingJenisDoc(stateActionWf);
			}
		);
		
		//Real Condition with DB 
		/*stateActionWf = 'D2';*/
		//console.log("State Action WF : ", stateActionWf);
		//console.log("Param Select Action : ", paramSelectAction);
		
		if(typeof stateActionWf === "undefined"){
			document.getElementById("update").disabled = true;
			document.getElementById("goOn").disabled = true;
		}else{
			if(stateActionWf.includes(paramSelectAction)) {
				document.getElementById("update").disabled = false;
				document.getElementById("goOn").disabled = false;
			} else {
				document.getElementById("update").disabled = true;
				document.getElementById("goOn").disabled = true;
			}
		}
	}
	
	function mappingJenisDoc(nodeCode) {
		// update show all 
		/*vm.jenisDoc = [
			{ "PARAM_NAME": "Berita Acara", "PARAM_VALUE": "BA" },
			{ "PARAM_NAME": "Rekap Faktur", "PARAM_VALUE": "RF" },
			{ "PARAM_NAME": "Kwitansi", "PARAM_VALUE": "KW" },
			{ "PARAM_NAME": "Faktur Pajak", "PARAM_VALUE": "FP" },
			{ "PARAM_NAME": "No.Resi Kwitansi", "PARAM_VALUE": "RK" }
		]*/
		vm.disclaimer = "Rekap Faktur/Berita Acara/Kwitansi/Faktur Pajak/No.Resi Kwitansi"
		
		/*if(nodeCode == 'D1') {
			vm.jenisDoc = [
				{ "PARAM_NAME": "Rekap Faktur", "PARAM_VALUE": "RF" },
				{ "PARAM_NAME": "Berita Acara", "PARAM_VALUE": "BA" }
			]
			vm.disclaimer = "Rekap Faktur/Berita Acara"
		}
		
		if(nodeCode == 'D2') {
			vm.jenisDoc = [
				{ "PARAM_NAME": "Kwitansi", "PARAM_VALUE": "KW" },
				{ "PARAM_NAME": "Faktur Pajak", "PARAM_VALUE": "FP" }
			]
			vm.disclaimer = "seri Faktur Pajak/Kwitansi"
		}
		
		if(nodeCode == 'D3') {
			vm.jenisDoc = [
				{ "PARAM_NAME": "No.Resi Kwitansi", "PARAM_VALUE": "RK" }
			]
			vm.disclaimer = "Resi Kwitansi"
		}*/
	}
	
	function contains(target, pattern){
	    var value = 0;
	    pattern.forEach(function(word){
	      value = value + target.includes(word);
	    });
	    return (value === 1)
	}
	
	function submit2Server(data, returnTask) {	
		var lempar = {
				pTaskId: param.wfTask.id,
				pActionId: data.action.pilihan,
				pUser: vm.userName,
				pNote: data.noteAcc
		}
		
		CommonService.doPost('/wftask/updateWFTaskFromAction', lempar)
		.then(function(dataresult){
			if (dataresult.code == 0){
				CommonService.modalAlert('Sukses',dataresult.message).then(function(){
					if(returnTask == "Y"){
						$state.go('home.staticDashboard');
					}else{
						vm.back();
					}
				});
			} else {
				CommonService.modalAlert('Validasi',dataresult.message).then(function(){
					vm.back();
				});
			}
			
		});
	}
}]);