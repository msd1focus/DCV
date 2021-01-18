'use strict';

App.controller('ActionSalesController', ['CommonService', '$state', '$stateParams', '$rootScope', function(CommonService, $state, $stateParams, $rootScope) {
	var vm = this;
	
	/*--- Variables ---*/
	var param = $stateParams.dataFromViewDetail;
	//var paramSelectAction = 'SL1';
	//var stateActionWf = param.wfTask.nodeCode;
	
	vm.userName = $rootScope.userProfile.userName;
	vm.listAksi = [];
	vm.salesAcc = {
			last	: param.header.lasStep,
			current	: param.header.currentStep,
			action	: undefined,
			noteAcc	: undefined
	};
	
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
	
	// Submit Action Sales
	vm.submit = function() {
		
		if(vm.salesAcc.action == undefined) {
			CommonService.modalAlert('warning', 'Action belum dipilih !');
		} else {
			var paramTask = {
				nodeId : vm.salesAcc.action.nodeId,
				pilihan : vm.salesAcc.action.pilihan
			}
			CommonService.doPost('/wfroute/getReturnTask', paramTask)
			.then(function(data){
				console.log("Return Task : "+ data.returnTask);
				if(data.returnTask == "Y" && (vm.salesAcc.noteAcc == undefined || vm.salesAcc.noteAcc == "")){
					CommonService.modalAlert('warning', 'Note tidak boleh kosong');
				}else if(data.returnTask == "Y"){
					CommonService.modalAlert('confirmation', 'Proses akan '+data.desc+', anda yakin?')
			        .then(function() { 
			        	submit2Server(vm.salesAcc);
			        });
				}else{
					submit2Server(vm.salesAcc);
				}
			});
		}
	}
	
	function init() {
		var bagian = param.paramDcvListAfterAction.pBagian != "Admin" ? param.paramDcvListAfterAction.pBagian : "Sales" ;
		var prm = {
				pDcvNo : param.header.noDcv,
				pUser : vm.userName,
				pBagian : bagian
		}
		CommonService.doPost('/getActionList', prm)
		.then(
			function(data){
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
		CommonService.doPost('/updateWFTaskFromAction', lempar)
		.then(
			function(data){
				//console.log('Result after update WF_TASK : ',data);
				if (data.code == 0){
					CommonService.modalAlert('Sukses',data.message).then(function() {
						vm.back();
					});
				} else {
					CommonService.modalAlert('Validasi',data.message).then(function() {
						vm.back();
					});
				}
			}
		);
	}
	
}]);