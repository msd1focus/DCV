'use strict';

App.controller('CopyDCVFormAddController', ['CommonService', '$state', '$log', '$stateParams', '$scope', '$rootScope', function(CommonService, $state, $log, $stateParams, $scope, $rootScope) {
	var vm = this;
	
	/*--- Variables ---*/
	vm.dcvReq = {};
	vm.error = false;
	vm.message = null;
	vm.userName = $rootScope.userProfile.userName;
	
	/*--- Function-function ---*/
	vm.nextDetail = function(){
		if(vm.dcvReq.noDCV == undefined || vm.dcvReq.noDCV == "") {
			vm.message = 'All coloumn must be filled';
			vm.error = true;
		} else {
			$("#checkDetail").prop("disabled",true);
			Swal.fire({
			  icon: 'info',
			  title : 'Mohon Tunggu',
			  text: 'Proses cek data DCV',
			  allowOutsideClick: false
			});
			
			vm.dcvReq.custCode = vm.userName;
			CommonService.doPost('/getAllCopyDCVByNoDCV', vm.dcvReq)
	  		.then(
	  			function(data){
	  				console.log(JSON.stringify(data));
	  				if(data.message == 'Pass') {
	  					
	  					Swal.fire({
	  						icon: 'success',
	  						text: 'Data DCV ditemukan',
	  						allowOutsideClick: false
	  					});
	  					vm.error = false;
	  					$state.go('home.copyDCVForm-detail', {dataFromInput : data});
	  				} else {
	  					
	  					Swal.fire({
	  						icon: 'warning',
	  						text: 'Data DCV tidak ditemukan / '+data.message,
	  						allowOutsideClick: false
		  				});
	  					vm.message = data.message;
	  					vm.error = true;
	  					$("#checkDetail").prop("disabled",false);
	  				}
	  			}
	  		);
			
			
			/*if(vm.noPC == "ABC1234") {
				vm.message = 'No DCV tidak ditemukan, atau sudah pernah di copy';
				vm.error = true;
			} else {
				vm.error = false;
				$state.go('home.copyDCVForm-detail', dataFromInput : data);
			}*/
		}
	}
}]);