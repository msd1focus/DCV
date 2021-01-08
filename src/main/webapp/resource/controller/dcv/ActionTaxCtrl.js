'use strict';

App.controller('ActionTaxController', ['CommonService', '$state', '$stateParams' , '$rootScope', function(CommonService, $state, $stateParams,  $rootScope) {
	var vm = this;
	
	/*--- Variables ---*/
	var param = $stateParams.dataFromViewDetail;
	var lanjutUpdate = false;
	var stateActionWf = param.wfTask.nodeCode;
	var paramSelectAction = 'TX';
	//param.last_act = 'Verify Kwitansi dan FP valid – Tax';
	
	vm.userName = $rootScope.userProfile.userName;
	vm.formatDate = CommonService.formatDate;
	vm.dateOptions = CommonService.generalDateOptions;
	vm.popup = {};
	vm.listAksi = [];
	vm.fileDesc = null;
	vm.fileuploadtime = null;
	vm.txAcc = {
			last	: param.header.lasStep,
			current	: param.header.currentStep,
			jenis	: undefined,
			file	: undefined,
			tgl		: undefined,
			no		: undefined,
			infoKw	: undefined,
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
		if(vm.txAcc.jenis == undefined) {
			CommonService.modalAlert('warning', 'Jenis dokumen belum dipilih')
	        .then(function(result) {});
		}else if( (vm.txAcc.file == undefined || vm.txAcc.file == '') && vm.fileDesc == "" ) {
			CommonService.modalAlert('warning', 'Wajib attach dokumen '+vm.txAcc.jenis.PARAM_NAME)
	        .then(function(result) {});
		}else if(vm.txAcc.tgl == undefined || vm.txAcc.tgl == ''){
			CommonService.modalAlert('warning', 'Tanggal tidak boleh kosong')
	        .then(function(result) {});
		}else if(vm.txAcc.no == undefined || vm.txAcc.no == ''){
			CommonService.modalAlert('warning', 'No Dokumen tidak boleh kosong')
	        .then(function(result) {});
		}else {
			lanjutUpdate = true;
		}
		
		if(lanjutUpdate) {
			var defUploadTime = CommonService.parsingDateIndForUpload(new Date());
			var filedescname = null;
			var fileuptime = null;
			if( vm.fileDesc != "" && (vm.txAcc.file == undefined || vm.txAcc.file == "") ){
				filedescname = vm.fileDesc;
				fileuptime = vm.fileuploadtime;
			}else{
				filedescname = vm.txAcc.file.name;
				fileuptime = defUploadTime;
			}
			
			var mapDok = {
					docNo		: vm.txAcc.no,
					docType		: vm.txAcc.jenis.docCode,
					//docDate		: vm.txAcc.file.lastModifiedDate,
					docDate		: vm.txAcc.tgl,
					uploadTime	: new Date(),
					//description	: vm.txAcc.file.name,
					description	: filedescname,
					//downloadAddr: defUploadTime +"_"+ vm.txAcc.file.name,
					//downloadAddr: defUploadTime +"_"+ filedescname,
					downloadAddr: fileuptime+"_"+ filedescname,
					modifiedBy	: vm.userName,
					uploadBy	: vm.userName,
					dcvhId		: param.header.dcvhId
				}
			//console.log("mapDox", mapDok);
			CommonService.doPost('/savingDcvDoc', mapDok)
		    .then(function(result){
		    	CommonService.modalAlert('Sukses','DCV Dokumen telah ter-update').then(function(result) {
		    		//For Upload File
		    		if( vm.txAcc.file == undefined || vm.txAcc.file == ""){
		    			// nothing
		    		}else{
		    			var file = vm.txAcc.file;
						var uploadUrl = "/uploadFileToServer";
				        CommonService.uploadFileToServer(file, uploadUrl, fileuptime+"_"+ file.name, param.header.custCode);
		    		}
			        vm.back();
		    	});
		    });
		}
		
	}
	
	vm.submit = function() {
		if(vm.txAcc.action == undefined) {
			CommonService.modalAlert('warning', 'Action belum dipilih')
	        .then(function() {});
		}  else {
			submit2Server(vm.txAcc);
		}
	}
	
	function submit2Server(data) {
		var lempar = {
				pTaskId: param.wfTask.id,
				pActionId: data.action.pilihan,
				pUser: vm.userName,
				pNote: data.noteAcc
		}
		CommonService.doPost('/updateWFTaskFromAction', lempar)
		.then(
			function(data){
				if (data.code == 0){
					CommonService.modalAlert('Sukses',data.message);
					vm.back();
				} else {
					CommonService.modalAlert('Validasi',data.message);
					vm.back();
				}
			});
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
					vm.txAcc.tgl = data[0].docDate;
					vm.txAcc.no = data[0].docNo;
					vm.fileDesc = data[0].description;
					vm.fileuploadtime = CommonService.parsingDateIndForUpload(new Date(data[0].uploadTime));
					$('#readyFileUpload').val(data[0].description);
					$('#hiddenReadyFile').show();
				}else{
					vm.txAcc.tgl = "";
					vm.txAcc.no = "";
					vm.fileDesc = "";
					$('#hiddenReadyFile').hide();
					$('#readyFileUpload').val("");
				}
			}
		);
	});
	
	function init() {
		if(param.last_act == 'Attach Kwitansi dan FP – Distributor') {
			paramSelectAction = 'TX1';
		} else
		if(param.last_act == 'Verify Kwitansi dan FP valid – Tax' ||
				param.last_act == 'Tolak Terima Kwitansi dan FP - Promo') {
			paramSelectAction = 'TX2';
		} else {
			paramSelectAction = 'TX';
		}
		
		// upload doc list
		var bagianDoc = param.paramDcvListAfterAction.pBagian != "Admin" ? param.paramDcvListAfterAction.pBagian : "Tax" ;
		var paramDoc = {
				pTaskId : param.wfTask.id,
				pBagian : bagianDoc,
				dcvhId : param.header.dcvhId
		}
		CommonService.doPost('/getUploadDocList', paramDoc)
		.then(
			function(data){
				vm.jenisDoc = data.docList;
				vm.txAcc.infoKw = data.desc;
			}
		);
		
		// Action list
		var bagianAction = param.paramDcvListAfterAction.pBagian != "Admin" ? param.paramDcvListAfterAction.pBagian : "Tax" ;
		var prm = {
				pDcvNo : param.header.noDcv,
				pUser : vm.userName,
				pBagian : bagianAction
		}
		CommonService.doPost('/getActionList', prm)
		.then(
			function(data){
				vm.listAksi =  data;
			}
		);
		
		// Disable button Update Document
		for(var i=0; i<param.detail.dcv_lines.length; i++){
			if(param.detail.dcv_lines[i].pphVal != null){
				document.getElementById("update").disabled = false;
				break;
			}else{
				document.getElementById("update").disabled = true;
			}
		}
		
		if(typeof stateActionWf === "undefined"){
			//document.getElementById("update").disabled = true;
			document.getElementById("goOn").disabled = true;
		}else{
			if(stateActionWf.includes(paramSelectAction)) {
				//document.getElementById("update").disabled = false;
				document.getElementById("goOn").disabled = false;
			} else {
				//document.getElementById("update").disabled = true;
				document.getElementById("goOn").disabled = true;
			}
		}
		
		// Find vm.txAcc.flag
		for(var i=0; i<param.detail.dcv_lines.length; i++){
			if(param.detail.dcv_lines[i].ppnCode != null ){
				vm.txAcc.flag = param.detail.dcv_lines[i].ppnCode;
				break;
			}
		}
		vm.disclaimer = "Faktur Pajak/Bukti Potong Pph";
	}
}]);