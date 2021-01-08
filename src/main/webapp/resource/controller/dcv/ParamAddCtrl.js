'use strict';

App.controller('ParamAddController', ['CommonService', '$state', '$stateParams', function(CommonService, $state, $stateParams) {
	var vm = this;
	vm.param = {};
	vm.viewOnly = false;
    
	if($stateParams.PARAM_ID != ""){
		if ($stateParams.dataParam != undefined) {
			vm.param = $stateParams.dataParam;
		}
		else{
			getAdmParam();
		}
		
		if($stateParams.state==CommonService.VIEWONLY){
			vm.viewOnly = true;
		}
	}
	
    //action button
	vm.backToIndex = function() {
        window.history.back();
	}
    /*
	vm.saveParam = function(invalid) {
		if (invalid == false) {
			var admParam = {Param : vm.param};
			CommonService.modalAlert('confirmation', 'Are you sure want to submit this data?')
            .then(function(result) {
                if (vm.param.PARAM_ID != undefined) {
                	vm.param.UPDATE_BY = CommonService.getUsername();
                    CommonService.createResource('admParameter/' + $stateParams.PARAM_ID, admParam)
				    .then(function(result){
                        window.history.back();
				    });
                } else {
                	vm.param.INSERT_BY = CommonService.getUsername();
                    CommonService.createResource('admParameter', admParam)
                    .then(function(result){
                        window.history.back();
				    });
                }
			});
		}
	}
	*/
	
	//edit Rochiyat
	vm.saveParam = function(invalid) {
		if (invalid == false) {
			var admParam = {Param : vm.param};
			CommonService.modalAlert('confirmation', 'Are you sure want to submit this data?')
            .then(function(result) {
            	//validasi required field 
            	if(!((vm.param.PARAM_NAME == undefined || vm.param.PARAM_NAME == '')
            			 && (vm.param.PARAM_VALUE == undefined || vm.param.PARAM_VALUE == '')
            			 && (vm.param.PARAM_GROUP == undefined || vm.param.PARAM_GROUP == ''))){
                 	if(CommonService.isSpeChars(vm.param.PARAM_NAME))
             			CommonService.modalAlert("WARNING", "Param Name Must not Contains Special Characters");
                 	else if(CommonService.isSpeChars(vm.param.PARAM_VALUE))
             			CommonService.modalAlert("WARNING", "Param Value Must not Contains Special Characters");
                 	else if(CommonService.isSpeChars(vm.param.PARAM_GROUP))
             			CommonService.modalAlert("WARNING", "Param Group Must not Contains Special Characters");
                 	else if (vm.param.PARAM_ID != undefined) {
	                	vm.param.UPDATE_BY = CommonService.getUsername();
	                    CommonService.createResource('admParameter/' + $stateParams.PARAM_ID, admParam)
					    .then(function(result){
	                        window.history.back();
					    });
                 	} else {
	                	vm.param.INSERT_BY = CommonService.getUsername();
	                    CommonService.createResource('admParameter', admParam)
	                    .then(function(result){
	                        window.history.back();
					    });
                 	}
            	}else
            		CommonService.modalAlert("WARNING", "All Field Required");
			});
		}
	}
	
	function getAdmParam(){
		CommonService.listResource('admParameter/'+$stateParams.PARAM_ID)
		.then(function(data){
			vm.param  = data.AdmParam;
		});
	}
	
}]);
