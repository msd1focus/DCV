'use strict';

App.controller('NewDCVFormTermController', ['CommonService', '$state', '$log', '$stateParams', '$rootScope', function(CommonService, $state, $log, $stateParams, $rootScope) {
	var vm = this;
	
	/*--- Variables ---*/
	vm.formAdd = $stateParams.dataFromAdd;
	vm.display = {};
	vm.dataToDetail = {};
	vm.doc = {};
	vm.showBtnSyarat2 = false;
	
	/*--- Function-function ---*/
	init();
	
	vm.backToAdd = function() {
		CommonService.modalAlert('confirmation', 'Proses batal tidak bisa di-Undo, yakin untuk melakukan pembatalan?')
        .then(function(result) {
        	$state.go('home.newDCVForm-add');                     
		});
	}
	
	vm.fileEnabled = function(file, kodeSyarat) {
		if(file.name != undefined && kodeSyarat == 3) {
			vm.syarat3 = true;
		} else if(file.name != undefined && kodeSyarat == 2) {
			vm.syarat2 = true;
		} else {
			vm.syarat2 = false;
			vm.syarat3 = false;
		}
	}
	
	vm.goToDetail = function() {
		if(vm.syarat1 && vm.syarat2 && vm.syarat3) {
			//console.log(JSON.stringify(vm.doc.file.name));
			var lanjut = false;
			if(vm.formAdd.syarat1 == 2 && vm.doc2.file == undefined) {
				CommonService.modalAlert('warning', 'File Berita Acara belum terupload')
		        .then(function(result) {
		        	lanjut = false;
		        });
			} else {
				if(vm.doc.file != undefined) {
					lanjut = true;
				} else {
					CommonService.modalAlert('warning', 'File faktur belum terupload')
			        .then(function(result) {});
				}
			}
			
			if(lanjut) {
				nextStepToDetail();
			}
		} else {
			CommonService.modalAlert('warning', 'Syarat dan ketentuan harus di cek semua')
	        .then(function(result) {});
		}
	}
	
	function nextStepToDetail() {
		CommonService.doPost('/findDetailForNewDCVSP', vm.formAdd.propId)
  		.then(
  			function(data){
  				//console.log("Data Form Term : ",data);
  				vm.dataToDetail = {
  					propId		: vm.formAdd.propId,
  					propNo		: vm.formAdd.propNo,
					noPC 	 	: vm.formAdd.noPC,
					keyPC	  	: vm.formAdd.keyPC,
					dcvDateFrom : vm.formAdd.dcvDateFrom,
					dcvDateTo	: vm.formAdd.dcvDateTo,
					kategoriPC	: vm.formAdd.kategoriPC,
					tipePC		: vm.formAdd.tipePC,
					periodPCFrom: vm.formAdd.periodPCFrom,
					periodPCTo	: vm.formAdd.periodPCTo,
					term1		: vm.formAdd.term1,
					term2		: vm.formAdd.term2,
					syarat1		: vm.formAdd.syarat1,
					syarat2		: vm.formAdd.syarat2,
					syarat3		: vm.syarat3,
					custCode	: vm.formAdd.modifiedBy,
					modifiedBy	: vm.formAdd.modifiedBy,
					company		: vm.formAdd.company,
					location	: vm.formAdd.location,
					region		: vm.formAdd.region,
					area		: vm.formAdd.area,
					custName	: vm.formAdd.custName,
					dataDetail	: data
				}
  				
  				// Reset root scope before set document
  				$rootScope.docTerm = undefined;
  				$rootScope.doc2Term = undefined;
  				
  				// Set document in root scope
  				$rootScope.docTerm = vm.doc.file;
  				if(vm.doc2 != undefined) {
  					$rootScope.doc2Term = vm.doc2.file;
  				}
  				
				$state.go('home.newDCVForm-detail', {dataFromTerm: vm.dataToDetail});
  			}
		);
	}
	
	function init() {
		
		var tglPCFrom	= new Date(vm.formAdd.periodPCFrom);
		var tglPCTo		= new Date(vm.formAdd.periodPCTo);
	/*	var tglDcvDateFrom = new Date(vm.formAdd.dcvDateFrom);
		var tglDcvDateTo = new Date(vm.formAdd.dcvDateTo);*/
		vm.display		= {
			noPC		: vm.formAdd.noPC,
			keyPC		: vm.formAdd.keyPC,
			/*dcvDateFrom	: CommonService.parsingDateOnlyInd(tglDcvDateFrom),
			dcvDateTo	: CommonService.parsingDateOnlyInd(tglDcvDateTo),*/
			kategoriPC	: vm.formAdd.kategoriPC,
			tipePC		: vm.formAdd.tipePC,
			periodPCFrom: CommonService.parsingDateOnlyInd(tglPCFrom),
			periodPCTo	: CommonService.parsingDateOnlyInd(tglPCTo),
			//syarat1		: vm.formAdd.term1.desc,
			//syarat2		: vm.formAdd.term2.desc
		}
		
		if(vm.formAdd.syarat1 != undefined) {
			vm.syarat1 	= true;
		} else {
			vm.syarat1 	= false;
			CommonService.modalAlert('warning', 'Distributor belum melaporkan STM Periode XXXX, Claim DCV tidak dapat dilanjutkan')
	        .then(function(result) {});
		}
		
		if(vm.formAdd.syarat2 == 3) {
			vm.syarat2 	= true;
			vm.showBtnSyarat2 = true;
		} else {
			vm.syarat2 	= false;
		}
	}
}]);
