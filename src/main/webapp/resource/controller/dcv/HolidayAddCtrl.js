'use strict';

App.controller('HolidayAddController', ['CommonService', '$state', '$stateParams', '$rootScope', function(CommonService, $state, $stateParams, $rootScope) {
	
	var vm = this;
	
	/*--- Variables ---*/
	vm.popup = {};
	
	/*--- Function-function ---*/
	init();
	
	vm.back = function() {
		$state.go('home.holiday');
	}
	
	vm.open = function(numberOrder) {
		CommonService.openDatePicker(numberOrder, vm.popup);		
	}
	
	vm.submit = function() {
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
			CommonService.modalAlert('confirmation', 'Yakin menyimpan data ini ?')
	        .then(function() {
	        	
	        	var paramAdd = {
	        			tglLibur : vm.tglLibur,
	        			keterangan : vm.keterangan
	        	}
	        	CommonService.doPost('/holiday/save', paramAdd)
	        	.then(function(){
	        		$state.go('home.holiday');
	        	});
	        });
		}
	}
	
	function init() {
		
	}
}]);