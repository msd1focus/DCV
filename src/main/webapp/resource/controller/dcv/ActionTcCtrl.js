'use strict';

App.controller('ActionTCController', ['CommonService', '$state', '$stateParams', '$rootScope', function(CommonService, $state, $stateParams, $rootScope) {
	var vm = this;
	
	/*--- Variables ---*/
	var param = $stateParams.dataFromViewDetail;
	//var stateActionWf = param.wfTask.nodeCode;
	var lanjutUpdate = false;
	//var paramSelectAction = 'TC';
	
	vm.userName = $rootScope.userProfile.userName;
	vm.listAksi = [];
	vm.tcAcc = {
			pros	: 'PO',
			last	: param.header.lasStep,
			current	: param.header.currentStep,
			flag	: undefined,
			note	: undefined,
			sla		: undefined,
			action	: undefined,
			noteAcc	: undefined
	}
	vm.flagBayar = [
		{ "PARAM_NAME": "Normal", "PARAM_VALUE": "NORMAL" },
		{ "PARAM_NAME": "Dispoisi Hold", "PARAM_VALUE": "HOLD" },
		{ "PARAM_NAME": "Diposisi Bayar", "PARAM_VALUE": "BAYAR" },
	]
	vm.bebanSla = [
		{ "PARAM_NAME": "Distributor", "PARAM_VALUE": "DISTRIBUTOR" },
		{ "PARAM_NAME": "TC", "PARAM_VALUE": "TC" },
		{ "PARAM_NAME": "Sales", "PARAM_VALUE": "SALES" },
		{ "PARAM_NAME": "Tax", "PARAM_VALUE": "TAX" },
		{ "PARAM_NAME": "Promo", "PARAM_VALUE": "PROMO" },
		{ "PARAM_NAME": "AP", "PARAM_VALUE": "AP" },
		{ "PARAM_NAME": "AR", "PARAM_VALUE": "AR" }
	]
	
	/*--- Function-function ---*/
	init();
	
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
		if(vm.tcAcc.flag == undefined) {
			CommonService.modalAlert('warning', 'Flag proses bayar belum dipilih')
	        .then(function(result) {});
		} else if(vm.tcAcc.flag.PARAM_VALUE != "NORMAL") {
			if(vm.tcAcc.note == undefined || vm.tcAcc.note == "") {
				CommonService.modalAlert('warning', 'Note tidak boleh kosong')
		        .then(function(result) {});
			} else if(vm.tcAcc.sla == undefined) {
				CommonService.modalAlert('warning', 'SLA belum dipilih')
		        .then(function(result) {});
			} else {
				lanjutUpdate = true;
			}
		} else {
			lanjutUpdate = true;
		}
		
		if(lanjutUpdate) {
			var dataToSave = null;
			if (vm.tcAcc.flag.PARAM_VALUE == "NORMAL") {
				dataToSave = {
						noDCV		: param.header.noDcv,
						metodeBayar	: vm.tcAcc.pros,
						prosesBayar	: vm.tcAcc.flag.PARAM_VALUE,
						noteBayar	: vm.tcAcc.note,
						actionButton: "TC"
					}
			} else {
				dataToSave = {
						noDCV		: param.header.noDcv,
						metodeBayar	: vm.tcAcc.pros,
						prosesBayar	: vm.tcAcc.flag.PARAM_VALUE,
						noteBayar	: vm.tcAcc.note,
						bebanSla    : vm.tcAcc.sla.PARAM_VALUE,
						actionButton: "TC"
					}
			}
			
			CommonService.doPost('/savingDcvReq', dataToSave)
		    .then(function(result){
		    	CommonService.modalAlert('Sukses','DCV telah ter-update');
		    	vm.back();
		    });
		}
	}
	
	// Submit Action TC
	vm.submit = function() {
		
		if(vm.tcAcc.action == undefined) {
			CommonService.modalAlert('warning', 'Action belum dipilih');
		} else {
			var paramTask = {
				nodeId : vm.tcAcc.action.nodeId,
				pilihan : vm.tcAcc.action.pilihan
			}
			CommonService.doPost('/wfroute/getReturnTask', paramTask)
			.then(function(data){
				console.log("Return Task : "+ data.returnTask);
				if(data.returnTask == "Y" && (vm.tcAcc.noteAcc == undefined || vm.tcAcc.noteAcc == "")){
					CommonService.modalAlert('warning', 'Note tidak boleh kosong');
				}else if(data.returnTask == "Y"){
					CommonService.modalAlert('confirmation', 'Proses akan '+data.desc+', anda yakin?')
			        .then(function() { 
			        	submit2Server(vm.tcAcc, data.returnTask);
			        });
				}else{
					submit2Server(vm.tcAcc, data.returnTask);
				}
			});
		}

	}
	
	function init() {
		//stateActionWf = 'TC1';
		var bagain = param.paramDcvListAfterAction.pBagian != "Admin" ? param.paramDcvListAfterAction.pBagian : "TC" ;
		var prm = {
			pDcvNo : param.header.noDcv,
			pUser : vm.userName,
			pBagian : bagain
		}
		CommonService.doPost('/actionlist/getActionList', prm)
		.then(
			function(data){
				//console.log("Try Action List : ", data);
				vm.listAksi =  data;
			}
		);
		
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
				CommonService.modalAlert('Sukses',dataresult.message).then(function() { 
					if(returnTask == "Y"){
						$state.go('home.staticDashboard');
					}else{
						vm.back();
					}
					vm.back(); 
		        });
			} else {
				CommonService.modalAlert('Validasi',dataresult.message).then(function() {
					vm.back();
				});
			}
		});
	}
}]);