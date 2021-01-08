'use strict';

App.controller('RollbackController', ['CommonService', '$state', '$stateParams', '$rootScope', function(CommonService, $state, $stateParams, $rootScope) {
	var vm = this;
	
	/*--- Variables ---*/
	var param = $stateParams.dataFromViewDetail;
	var user = $rootScope.userProfile.userName;
	var role = $rootScope.userProfile.role.roleCode;
	var moreReq = true;
	
	vm.showReject = false;
	vm.showApprove = false;
	vm.no_PC = param.no_PC;
	vm.rbAcc = {
		last	: param.last_act,
		current	: param.current_act,
		flag	: undefined,
		note	: undefined,
		sla		: undefined,
		action	: undefined,
		noteAcc	: undefined
	};
	vm.bebanSla = [
		{ "PARAM_NAME": "Distributor", "PARAM_VALUE": "DISTRIBUTOR" },
		{ "PARAM_NAME": "TC", "PARAM_VALUE": "TC" },
		{ "PARAM_NAME": "Sales", "PARAM_VALUE": "SALES" },
		{ "PARAM_NAME": "Tax", "PARAM_VALUE": "TAX" },
		{ "PARAM_NAME": "Promo", "PARAM_VALUE": "PROMO" },
		{ "PARAM_NAME": "AP", "PARAM_VALUE": "AP" },
		{ "PARAM_NAME": "AR", "PARAM_VALUE": "AR" }
	];
	
	/*--- Function-function ---*/
	init();
	
	vm.back = function(){
		/*window.history.back();*/
		$state.go('home.view-detail', {dataFromMntr: param});
	}
	
	vm.submit = function(){
		/*if(vm.rbAcc.note == undefined || vm.rbAcc.note == "") {
			CommonService.modalAlert('warning', 'Alasan Rollback tidak boleh kosong')
	        .then(function(result) {});
		} else if(vm.rbAcc.sla == undefined) { 
			CommonService.modalAlert('warning', 'Beban SLA belum dipilih')
	        .then(function(result) {});
		} else {
			alert("Simpan ke DBOrcl");
			vm.back();
		}*/
		$state.go('home.rollbackList', {dataFromViewDetail: param});
	} 
	
	vm.save = function(){
		vm.alasan = $('#acctRb input[id=reason]').map(function() {
			  return this.value;
		}).get();
		vm.catatan = $('#acctRb input[id=note]').map(function() {
			  return this.value;
		}).get();
		console.log("Alasan = "+vm.alasan[0]);
		console.log("Catatan = "+vm.catatan[0]);
	}
	
	vm.request = function(){
		var rowData = [];
		var table = $('#acctRb').DataTable({
			"retrieve": true,
			"paging": false,
			"searching": false,
			"info": false,
			"sort": false,
			"scrollX": "100%"
		});
		var info = table.page.info();
		var today = new Date(vm.selectedDate);           
        var formattedtoday = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
		
		rowData.push("RB-no.DCV-no."+info.recordsTotal+1);
		rowData.push(formattedtoday);
		rowData.push(user);
		rowData.push('<div><input type="text" id="reason" class="form-control pull-center input-sm" size="10"></div>');
		rowData.push(formattedtoday);
		rowData.push(user);
		rowData.push('<div><input type="text" id="note" class="form-control pull-center input-sm" size="5"></div>');
		rowData.push("Status");
		
		table.row.add(rowData).draw( false );
	}
	
	function init(){
		if(role != "DISTRIBUTOR_ROLE") {
			vm.showReject = true;
			vm.showApprove = true;
		}
	}
}]);