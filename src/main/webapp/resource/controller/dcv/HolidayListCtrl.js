'use strict';

App.controller('HolidayListController', ['$window', '$state', '$scope', '$rootScope', 'CommonService', '$uibModal', 'DTOptionsBuilder', 'DTColumnDefBuilder',
				function($window, $state, $scope, $rootScope, CommonService, $uibModal, DTOptionsBuilder, DTColumnDefBuilder) {
	var vm = this;
	
	/*--- Variables ---*/
	vm.popup = {};
	console.log($rootScope.userProfile);
	var table = null;
	
	/*--- Function-function ---*/
	init();
	
	vm.add = function() {
		if($rootScope.userProfile.role.bagian != "Distributor"){
			$state.go('home.holiday-add');
		}
	}
	
	function init() {		
		
		if($rootScope.userProfile.role.bagian == "Distributor"){
			$("#div-submit-holiday").hide();
			$("#aksi-white").css("color","white");
		}
		
		CommonService.doGET('/hariLibur/All')
		.then(function(data){

			table = $('#holiday').DataTable({
				"data" : data,
				"columns": [
					{ "data": "id" },
					{ "data": "tglLibur",
						"render": function (data, type, row) {
							// Format date
							var today = new Date(data);
							var dd = String(today.getDate()).padStart(2, '0');
							var mm = String(today.getMonth() + 1).padStart(2, '0');
							var yyyy = today.getFullYear();
							var result = dd+"-"+mm+"-"+yyyy;
							
							return result;
						}
					},
					{ "data": "keterangan" },
					{ "data": "keterangan",
						"render": function (data, type, row) {
							if($rootScope.userProfile.role.bagian == "Distributor"){
								data = '<button class="btn btn-warning btn-sm pull-center" style="display:none"><span class="glyphicon glyphicon-pencil"></span></button>';
							}else{
								data = '<button class="btn btn-warning btn-sm pull-center"><span class="glyphicon glyphicon-pencil"></span></button>';
							}
							return data;
						}
					},
					{ "data": "keterangan",
						"render": function (data, type, row) {
							if($rootScope.userProfile.role.bagian == "Distributor"){
								data = '<button class="btn btn-danger btn-sm pull-center" style="display:none"><span class="glyphicon glyphicon-trash"></span></button>';
							}else{
								data = '<button class="btn btn-danger btn-sm pull-center"><span class="glyphicon glyphicon-trash"></span></button>';
							}
							return data;
						}
					}
				],
				"searching": false,
				"sort": false,
				"paging": false,
				"info": true,
				"columnDefs": [
					{ className: "hidden_column_data_table", "targets": [0] },
					{ className: "column-data-table-10", "targets": [3] },
		            { className: "column-data-table-10", "targets": [4] }
		        ]
			});
			
			$('#holiday tbody ').on('click', 'tr td:nth-child(4)', function () {
				var data = table.row( $(this).parents('tr') ).data();
				if($rootScope.userProfile.role.bagian != "Distributor"){
					$state.go('home.holiday-edit', {dataEdit : data} );
				}
			});
			
			$('#holiday tbody ').on('click', 'tr td:nth-child(5)', function () {
				var data = table.row( $(this).parents('tr') ).data();
				if($rootScope.userProfile.role.bagian != "Distributor"){
					CommonService.modalAlert('confirmation', 'Yakin menghapus data ini ?')
			        .then(function() {
			        	var paramDelete = {
			        			id : data.id
			        	}
			        	CommonService.doPost('/deleteHoliday', paramDelete)
			        	.then(function(){
			        		$window.location.reload();
			        	});
			        });
				}
			});
		});
		
	}
}]);