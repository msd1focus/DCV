'use strict';

App.controller('DcvRoleAddController', ['CommonService', '$state', '$stateParams', '$rootScope', '$scope', function(CommonService, $state, $stateParams, $rootScope, $scope) {
	
	var vm = this;
	
	/*--- Function-function ---*/
	init();
	
	vm.back = function() {
		$state.go('home.dcv-role');
	}
	
	vm.submit = function() {
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
				html: '<p>Harap masukan bagian</p>',
			})
		}else{
			CommonService.modalAlert('confirmation', 'Yakin menyimpan data ini ?')
	        .then(function() {
	        	
	        	var paramAdd = {
	        			roleCode : vm.rolecode,
	        			roleName : vm.keterangan,
	        			roleType : "WF",
	        			bagian : vm.bagian
	        	}
	        	console.log(paramAdd);
	        	CommonService.doPost('/saveRole', paramAdd)
	        	.then(function(result){
	        		if(result.result == "OK"){
	        			$state.go('home.dcv-role');
	        		}else{
	        			Swal.fire({
	        				icon: 'warning',
	        				html: '<p>Role Code sudah digunakan</p>',
	        			})
	        		}	        		
	        	});
	        });

		}
	}
	
	function init() {
		$scope.bagians = ["AP", "Distributor", "Promo", "Sales", "TC", "Tax"];
	}
}]);