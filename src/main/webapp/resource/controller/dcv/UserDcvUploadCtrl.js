'use strict';

App.controller('UserDCVUploadController', ['CommonService', '$state', '$stateParams', '$rootScope', function(CommonService, $state, $stateParams, $rootScope) {
	var vm = this;
	
	/*--- Variables ---*/
	vm.userName = $rootScope.userProfile.userName;
	
	
	/*--- Function-function ---*/
	vm.back = function() {
		$state.go('home.user');
	}
	
	vm.submit = function() {
		var uploadUrl = "/uploadFileToServer";
        CommonService.uploadFileToServer(vm.doc.file, uploadUrl, CommonService.parsingDateInd(new Date()) +"_"+ vm.doc.file.name, vm.userName).then(
      			function(data){
      				console.log(JSON.stringify(data))
      				var hasil = data.data;
      				CommonService.modalAlert('Sukses',hasil.message).then(function(result) {
      					$state.go('home.user');
      				});
      			});
	}
}]);