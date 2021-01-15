'use strict';

App.controller('LookupCodeController', ['$window', '$state', '$scope', '$rootScope', 'CommonService', '$uibModal', 'DTOptionsBuilder', 'DTColumnDefBuilder',
function($window, $state, $scope, $rootScope, CommonService, $uibModal, DTOptionsBuilder, DTColumnDefBuilder) {
	var vm = this;
	
	/*--- Function-Load Data Start---*/
	init();
	
	function init() {		
		
		if($rootScope.userProfile.role.bagian == "Distributor"){
			$("#div-submit-lookupCode").hide();
			$("#aksi-white").css("color","white");
		}
		
		CommonService.doGET('/getListLookupCode')
		.then(function(data){
			
			console.log(data);
			vm.lookupCodeList = data;
		});
		
	}
	/*--- Function-Load Data End---*/
	
	
	/*Function Edit Strat*/
	vm.editLookupCode = function (dataLookupCode) {
        console.log(dataLookupCode);

		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'pages/modal/modalEditLookupCode.html',
			controller: 'ModalEditLookupCodeCtrl',
			controllerAs : 'vm',
			size: 'lg',
			resolve : {
				dataLookupCode : function(){
	        		return dataLookupCode;
	        	},
	        	
			}
			
		});
		
		modalInstance.result.then(function () {
             init();
        });
    };

	/*Function Edit End*/

	/**MODAL CONTROLLER FOR EDIT LOOKUP CODE**/
	App.controller('ModalEditLookupCodeCtrl', function ($scope,$uibModalInstance, CommonService, dataLookupCode){
		var vm = this;
		
		vm.dataLookupCode = dataLookupCode;
		
		/*Validasi Input Start*/
		$scope.validate =  function (){
			$scope.status = true;
			
			if(vm.dataLookupCode.value == '' || vm.dataLookupCode.value == undefined){
				$scope.status = false;
				$scope.lookupCodeValueError = true;
			}else{
				$scope.lookupCodeValueError = false;
			}
			
			if(vm.dataLookupCode.desc == '' || vm.dataLookupCode.desc == undefined){
				$scope.status = false;
				$scope.lookupCodeDescError = true;
			}else{
				$scope.lookupCodeDescError = false;
			}
			
			return $scope.status;
		}
		/*Validasi Input End*/
		
		/*Proses Save Start*/
		$scope.save = function () {
		     
			if($scope.validate()){
				
				CommonService.doPost('/saveLookupCode', vm.dataLookupCode)
				.then(
					function(data){
						
						$uibModalInstance.close(vm.dataLookupCode);
						
				});
			}
		}
		
		$scope.cancelModal = function () {
		     $uibModalInstance.close(vm.dataLookupCode);
		}
		/*Proses Save End*/
	});
	
}]);