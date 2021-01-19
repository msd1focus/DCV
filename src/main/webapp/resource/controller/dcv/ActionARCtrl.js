'use strict';

App.controller('ActionARController', ['CommonService', '$state', '$stateParams', '$rootScope', function(CommonService, $state, $stateParams, $rootScope) {
	var vm = this;
	
	/*--- Variables ---*/
	var param = $stateParams.dataFromViewDetail;
	var paramSelectAction = 'AR';
	var stateActionWf = param.wfTask.nodeCode;
	
	vm.userName = $rootScope.userProfile.userName;
	vm.listAksi = [];
	vm.arAcc = {
			last	: param.header.lasStep,
			current	: param.header.currentStep,
			action	: undefined,
			noteAcc	: undefined
	}
	
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
	
	vm.submit = function() {
		var lanjut = false;
		if(vm.arAcc.action == undefined) {
			CommonService.modalAlert('warning', 'Action belum dipilih')
	        .then(function(result) {});
		} else {
			
				lanjut = true;
			
		}
		
		if(lanjut) {
			//alert("Simpan ke DBOrcl dan Lanjut ke tahap berikutnya");
			submit2Server(vm.arAcc);
			
		}
	}
	
	function init() {
		if(typeof stateActionWf === "undefined"){
			document.getElementById("goOn").disabled = true;
		}else{
			if(stateActionWf.includes(paramSelectAction)) {
				document.getElementById("goOn").disabled = false;
			} else {
				document.getElementById("goOn").disabled = true;
			}
		}
		
//		var lempar = {
//				noDcv		: param.header.noDcv,
//				nodeCode	: stateActionWf,
//				bagian		: $rootScope.userProfile.role.bagian
//		}
//		CommonService.doPost('/findActionListByDcvAndBagianAndNodeCode', lempar)
//		.then(
//			function(data){
//				vm.listAksi = data;
//			}
//		);
		
		var prm = {
				pDcvNo : param.header.noDcv,
				pUser : vm.userName
		}
		CommonService.doPost('/actionlist/getActionList', prm)
		.then(
			function(data){
				console.log("Try Action List : ", data);
				vm.listAksi =  data;
			}
		);
		
	}
	
	function submit2Server(data) {
		var lempar = {
				pTaskId: param.wfTask.id,
				pActionId: data.action.pilihan,
				pUser: vm.userName,
				pNote: data.noteAcc
		}
		CommonService.doPost('/wftask/updateWFTaskFromAction', lempar)
		.then(
			function(data){
				console.log("YG DIPILIH = "+JSON.stringify(data.code));
				console.log("YG DIPILIH = "+JSON.stringify(data.message));
				if (data.code == 0){
					CommonService.modalAlert('Sukses',data.message);
					vm.back();
				} else {
					CommonService.modalAlert('Validasi',data.message);
					vm.back();
				}
			});
	}
}]);