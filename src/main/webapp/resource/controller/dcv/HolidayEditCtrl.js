'use strict';

App.controller('HolidayEditController', ['CommonService', '$state', '$stateParams', '$rootScope', function(CommonService, $state, $stateParams, $rootScope) {
	
	var vm = this;
	
	/*--- Variables ---*/
	var param = $stateParams.dataEdit;
	vm.popup = {};
	
	/*--- Function-function ---*/
	init();
	
	vm.back = function() {
		$state.go('home.holiday');
	}
	
	vm.open = function(numberOrder) {
		CommonService.openDatePicker(numberOrder, vm.popup);		
	}
	
	vm.edit = function() {
		if(vm.tglLibur == undefined || vm.tglLibur == ''){
			Swal.fire({
				icon: 'warning',
				title: 'Harap masukan tanggal',
			})
		}else if(vm.keterangan == undefined || vm.keterangan == ''){
			Swal.fire({
				icon: 'warning',
				title: 'Harap masukan keterangan',
			})
		}else{
			CommonService.modalAlert('confirmation', 'Yakin menyimpan perubahan ?')
	        .then(function() {
	        	
	        	var paramEdit = {
	        			id : param.id,
	        			tglLibur : vm.tglLibur,
	        			keterangan : vm.keterangan
	        	}
	        	CommonService.doPost('/updateHoliday', paramEdit)
	        	.then(function(){
	        		$state.go('home.holiday');
	        	});
	        });
		}
	}
	
	function init() {
		vm.tglLibur = param.tglLibur;
		vm.keterangan = param.keterangan;
	}
}]);