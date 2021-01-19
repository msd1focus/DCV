'use strict';

App.controller('ActionAPController', ['CommonService', '$state', '$stateParams', '$rootScope', function(CommonService, $state, $stateParams,$rootScope) {
	var vm = this;
	
	/*--- Variables ---*/
	var param = $stateParams.dataFromViewDetail;
	//var paramSelectAction = 'AP';
	//var lanjutUpdate = false;
	//var stateActionWf = param.wfTask.nodeCode;
	
	vm.userName = $rootScope.userProfile.userName;
	vm.listAksi = [];
	vm.apAcc = {
			last	: param.header.lasStep,
			current	: param.header.currentStep,
			noInv	: undefined,
			tglInv	: undefined,
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
		CommonService.doPost('/generateInvoice', lempar)
		.then(function(data){
			vm.apAcc.noInv = data.resInvoice,
			vm.apAcc.tglInv = data.resDate
		});
	}
	
	vm.submit = function(){
		if(vm.apAcc.action == undefined) {
			Swal.fire({
			  icon: 'warning',
			  html: '<b>Action belum dipilih</b>',
			});
		}else {
			submit2Server(vm.apAcc);
		}
		
//		if(lanjut) {
//			submit2Server(vm.apAcc);
//		} else if(!lanjutUpdate) {
//			CommonService.modalAlert('warning', 'Invoice belum di-Generate')
//	        .then(function(result) {});
//		}
	}
	
	function init() {		
		var bagian = param.paramDcvListAfterAction.pBagian != "Admin" ? param.paramDcvListAfterAction.pBagian : "AP" ; 
		var prm = {
			pDcvNo : param.header.noDcv,
			pUser : vm.userName,
			pBagian : bagian
		}
		
		CommonService.doPost('/actionlist/getActionList', prm)
		.then(
			function(data){
				vm.listAksi =  data;
				//mappingJenisDoc(stateActionWf);
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
				//console.log("YG DIPILIH = "+JSON.stringify(data.code));
				//console.log("YG DIPILIH = "+JSON.stringify(data.message));
				if (data.code == 0){
					Swal.fire({
					  title: 'Sukses',
					  html: '<p>'+data.message+'</p>',
					  icon: 'success',
					  showCancelButton: false,
					  confirmButtonColor: '#3085d6',
					  cancelButtonColor: '#d33',
					  confirmButtonText: 'Oke',
					  allowOutsideClick: false
					}).then((result) => {
					  if (result.isConfirmed) {
						  vm.back();
					  }
					});					
				} else {
					Swal.fire({
					  title: 'Gagal',
					  html: '<p>'+data.message+'</p>',
					  icon: 'warning',
					  showCancelButton: false,
					  confirmButtonColor: '#3085d6',
					  cancelButtonColor: '#d33',
					  confirmButtonText: 'Oke',
					  allowOutsideClick: false
					}).then((result) => {
					  if (result.isConfirmed) {
						  vm.back();
					  }
					});	
				}
			});
	}
}]);