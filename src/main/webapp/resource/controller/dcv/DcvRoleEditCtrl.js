'use strict';

App.controller('DcvRoleEditController', ['CommonService', '$state', '$stateParams', '$rootScope', '$scope', function(CommonService, $state, $stateParams, $rootScope, $scope) {
	
	var vm = this;
	
	/*--- Variables ---*/
	var param = $stateParams.dataEdit;
	
	/*--- Function-function ---*/
	init();
	
	vm.back = function() {
		$state.go('home.dcv-role');
	}
	
	vm.edit = function() {
		if(vm.rolecode == undefined || vm.rolecode == ''){
			Swal.fire({
				icon: 'warning',
				html: '<p>Harap masukan role code</p>',
			})
		}else if(vm.keterangan == undefined || vm.keterangan == ''){
			Swal.fire({
				icon: 'warning',
				html: '<p>Harap masukan keterangan</p>',
			})
		}else if(vm.bagian == undefined || vm.bagian == ''){
			Swal.fire({
				icon: 'warning',
				title: '<p>Harap masukan bagian</p>',
			})
		}else{
			CommonService.modalAlert('confirmation', 'Yakin menyimpan perubahan ?')
	        .then(function() {
	        	var paramEdit = {
	        			roleCode : vm.rolecode,
	        			roleName : vm.keterangan,
	        			bagian : vm.bagian
	        	}
	        	CommonService.doPost('/updateRole', paramEdit)
	        	.then(function(){
	        		$state.go('home.dcv-role');
	        	});
	        });
		}
	}
	
	function init() {
		$scope.bagians = ["AP", "Distributor", "Promo", "Sales", "TC", "Tax"];
		vm.rolecode = param.roleCode;
		vm.keterangan = param.roleName;
		vm.bagian = param.bagian;
	}
}]);