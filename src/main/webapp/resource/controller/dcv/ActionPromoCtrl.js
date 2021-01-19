'use strict';

App.controller('ActionPromoController', ['CommonService', '$state', '$stateParams', '$rootScope', function(CommonService, $state, $stateParams, $rootScope) {
	var vm = this;
	
	/*--- Variables ---*/
	vm.dataClick = false;
	var param = $stateParams.dataFromViewDetail;
	//var stateActionWf = param.wfTask.nodeCode;
	//var paramSelectAction = "PR";
	//var lanjutUpdate = false;
	
	vm.userName = $rootScope.userProfile.userName;
	vm.listAksi = [];
	vm.prAcc = {
			last	: param.header.lasStep,
			current	: param.header.currentStep,
			noGr	: undefined,
			tglGr	: undefined,
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
	
	vm.generate = function(){
		var lempar = {
				dcvNo : param.header.noDcv
		}
		
		CommonService.doPost('/generateGr', lempar)
		.then(function(data){
			console.log("data hasil gr = "+JSON.stringify(data));
			if (data.grStatus == undefined){
				vm.prAcc.noGr = data.grNo;
				vm.prAcc.tglGr = data.dateNow;	
				vm.dataClick = true;
			} else {
				CommonService.modalAlert('Validasi',data.grStatus);	
			}
		});
		//lanjutUpdate = true;
	}
	
	vm.submit = function(){
		if(vm.prAcc.action == undefined) {
			CommonService.modalAlert('warning', 'Action belum dipilih')
	        .then(function(result) {});
		} else if( vm.prAcc.action.pilihan == 2 && (vm.prAcc.noteAcc == undefined || vm.prAcc.noteAcc == "") ){
			// Note can't null or empty 
			CommonService.modalAlert('warning', 'Note tidak boleh kosong');
		}else if(vm.prAcc.action.pilihan == 2){
			// Alert Confirmation if terminate
			CommonService.modalAlert('confirmation', 'Anda yakin akan menolak DCV ini ?')
	        .then(function() { 
	        	submit2Server(vm.prAcc);
	        });
		}else {
			submit2Server(vm.prAcc);
		}
		
	}
	
	function init() {
		var bagian = param.paramDcvListAfterAction.pBagian != "Admin" ? param.paramDcvListAfterAction.pBagian : "Promo" ; 
		var prm = {
				pDcvNo : param.header.noDcv,
				pUser : vm.userName,
				pBagian : bagian
		}
		CommonService.doPost('/actionlist/getActionList', prm)
		.then(
			function(data){
				vm.listAksi =  data;
			}
		);
		
		var dataInfoGR = {
				dcvhId : param.header.dcvhId
		}
		CommonService.doPost('/dokumenrealisasi/getGRbyDcvhId', dataInfoGR)
		.then(
			function(data){
				if(data.docNo != null ) {
					vm.dataClick = true;
					vm.prAcc.noGr = data.docNo,
					vm.prAcc.tglGr = data.docDtString	
				} else {
					vm.dataClick = false;
					vm.prAcc.noGr = "",
					vm.prAcc.tglGr = ""	
				}
				
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
			function(dataresult){
				if (dataresult.code == 0){
					CommonService.modalAlert('Sukses',dataresult.message).then(function(){
						if(data.action.pilihan == 2){
							$state.go('home.staticDashboard');
						}else{
							vm.back();
						}
					});
				} else {
					CommonService.modalAlert('Validasi',dataresult.message);
					vm.back();
				}
			});
	}
}]);