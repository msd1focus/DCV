'use strict';

App.controller('NewDCVFormAddController', ['CommonService', '$rootScope', '$state', '$timeout', '$q', '$log', function(CommonService, $rootScope, $state, $timeout, $q, $log) {
	var vm = this;
	
	/*--- Variables ---*/
	vm.error = false;
	vm.message = 'All coloumn must be filled';
	vm.formatDate = CommonService.formatDate;
	vm.dateOptions = CommonService.generalDateOptions;
	vm.popup = {};
	vm.dataToTerm = {};
	vm.userName = $rootScope.userProfile.userName;
	vm.fullName	= $rootScope.userProfile.fullName;
	vm.userDivision = $rootScope.userProfile.userDivision;
	vm.userLocation = $rootScope.userProfile.location;
	vm.userRegion = $rootScope.userProfile.region;
	vm.userArea = $rootScope.userProfile.area;
	vm.ngModelOpts = CommonService.ngModelOpts;
	
    
    // autoComplete variables ---
	vm.simulateQuery = false;
    vm.isDisabled    = false;
    vm.states        = [];
    vm.querySearch   = querySearch;
    vm.selectedItemChange = selectedItemChange;
    vm.searchTextChange   = searchTextChange;
    vm.newState = newState;
    
    /*--- Function-function ---*/
    init(); 
    vm.open = function(numberOrder) {
		CommonService.openDatePicker(numberOrder, vm.popup);
	}
	
	vm.nextTerm = function() {
		vm.error = false;
		if(vm.noPC == undefined ||
				vm.noKeyPC == undefined ) {
			vm.error = true;
		} else {
			/*var dataToDB = {
				noPC			: vm.noPC,
				keyPC  			: vm.noKeyPC,
				periodDCVFrom	: vm.selectedDate,
				periodDCVTo		: vm.selectedDate2,
				custCode        : vm.userName
			}*/
			var dataToDB = {
					noPC			: vm.noPC,
					keyPC  			: vm.noKeyPC,
					custCode        : vm.userName
				}
			//console.log(JSON.stringify(dataToDB));
			CommonService.doPost('/findInformationPCByNoPC', dataToDB)
	  		.then(
	  			function(data){
	  				/*if(data.length == 0) {*/
	  				if(data.propId == undefined) {
	  					CommonService.modalAlert('warning', data.message)
	  			        .then(function(result) {});
	  				} else {
	  					vm.dataToTerm = {
	  							propId		: data.propId,
	  							propNo		: data.propNo,
		  						noPC		: data.noPC,
		  						keyPC		: data.keyPC,
								/*dcvDateFrom	: data.periodPCFrom,
								dcvDateTo	: data.periodPCTo,*/
								kategoriPC	: data.kategoriPC,
								tipePC		: data.tipePC,
								periodPCFrom: data.periodPCFrom,
								periodPCTo	: data.periodPCTo,
								term1		: data.term1,
								term2		: data.term2,
								modifiedBy	: vm.userName,
								company		: vm.userDivision,
								location	: vm.userLocation,
								region		: vm.userRegion,
								area		: vm.userArea,
								custName	: vm.fullName
		  					}
		  				$state.go('home.newDCVForm-term', {dataFromAdd: vm.dataToTerm});
	  				}
	  			}
	  		);
		}
	}
	
    function newState(state) {
       alert("This functionality is yet to be implemented!");
    }
    
    function querySearch (query) {
	    var results = query ? vm.states.filter( createFilterFor(query) ) :
	    	vm.states, deferred;
	       
	    if (vm.simulateQuery) {
	       deferred = $q.defer();
	          
	       $timeout(function () { 
	          deferred.resolve( results ); 
	       }, 
	       Math.random() * 1000, false);
	       return deferred.promise;
	    } else {
	       return results;
	    }
	}
    
    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }
    
    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }
     
    function loadStates() {
    	CommonService.doPost('/findNoPCByCustCode', vm.userName)
  		.then(
  			function(data){
  				if(data != undefined) {
  					/*for(var i=0; i<data.length; i++) {
  						vm.states.push({
  							value: data[i],
  							display: data[i]
  						})
  					}*/
  					$('input[id=newDCVFormAdd_noPC]').autocomplete({
  				      source: data
  				    });
  				}
  			}
  		);
     }
     
     //filter function for search query
     function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
           return (state.value.indexOf(lowercaseQuery) === 0);
        };
     }
     
     function init() {
    	 loadStates();
     }
}]);