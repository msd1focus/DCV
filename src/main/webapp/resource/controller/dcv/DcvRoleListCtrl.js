'use strict';

App.controller('DcvRoleListController', ['$window', '$state', '$scope', 'CommonService', '$uibModal', 'DTOptionsBuilder', 'DTColumnDefBuilder',
				function($window, $state, $scope, CommonService, $uibModal, DTOptionsBuilder, DTColumnDefBuilder) {
	var vm = this;
	
	/*--- Variables ---*/
	vm.popup = {};
	
	var table = null;
	
	/*--- Function-function ---*/
	init();
	
	vm.add = function() {
		$state.go('home.dcv-role-add');
	}
	
	function init() {		
		CommonService.doGET('/getDcvRole')
		.then(function(data){

			table = $('#dcvRole').DataTable({
				"data" : data,
				"columns": [
					{ "data": "roleCode" },
					{ "data": "roleName" },
					{ "data": "bagian" },
					{ "data": "bagian",
						"render": function (data, type, row) {
							console.log();
							data = '<button class="btn btn-warning btn-sm pull-center"><span class="glyphicon glyphicon-pencil"></span></button>';
							return data;
						}
					},
					{ "data": "keterangan",
						"render": function (data, type, row) {
							data = '<button class="btn btn-danger btn-sm pull-center"><span class="glyphicon glyphicon-trash"></span></button>';
							return data;
						}
					}
				],
				"searching": false,
				"sort": false,
				"paging": true,
				"info": true,
				"columnDefs": [
					{ className: "column-data-table-10", "targets": [3] },
		            { className: "column-data-table-10", "targets": [4] }
		        ]
			});

			$('#dcvRole tbody ').on('click', 'tr td:nth-child(4)', function () {
				var data = table.row( $(this).parents('tr') ).data();
				$state.go('home.dcv-role-edit', {dataEdit : data} );
			});
			
			$('#dcvRole tbody ').on('click', 'tr td:nth-child(5)', function () {
				var data = table.row( $(this).parents('tr') ).data();
				CommonService.modalAlert('confirmation', 'Yakin menghapus data ini ?')
		        .then(function() {
		        	var paramDelete = {
		        			roleCode : data.roleCode
		        	}
		        	CommonService.doPost('/deleteRole', paramDelete)
		        	.then(function(){
		        		$window.location.reload();
		        	});
		        });
			});
		});
		
	}
}]);