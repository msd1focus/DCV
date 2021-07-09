'use strict';

App.controller('DaftarPcController', ['$window', '$state', '$scope', '$filter', 'CommonService', 'DTColumnDefBuilder', 'DTOptionsBuilder', 'DTColumnBuilder', '$uibModal', '$rootScope', '$stateParams',
				function($window, $state, $scope, $filter, CommonService, DTColumnDefBuilder, DTOptionsBuilder, DTColumnBuilder, $uibModal, $rootScope, $localStorage) {
	
	var vm = this;
	
	/*--- Variables --- */
	var table = null;
	vm.userName = $rootScope.userProfile.userName;
	vm.userType = $rootScope.userProfile.userType;
	vm.userDivision = $rootScope.userProfile.role.bagian;
	
	vm.periode = new Date();
	
	vm.popup = {};
	
	function init() {
		vm.paramList = [
						  {
						    "PARAM_NAME": "PC Baru",
						    "PARAM_VALUE": "1"
						  },
						  {
						    "PARAM_NAME": "PC Sudah Klaim",
						    "PARAM_VALUE": "2"
						  },
						  {
						    "PARAM_NAME": "PC Belum Klaim",
						    "PARAM_VALUE": "3"
						  }
						];
		
	}
	
	/*--- Function-function ---*/
	init();
	
	vm.open = function(numberOrder) {
		CommonService.openDatePicker(numberOrder, vm.popup);		
	}

	function loadDataTable() {
		
		/*var yesterday = '';
		
		CommonService.doGET('/holiday/getYesterday')
		.then(function(data){
			
			yesterday = data.keterangan;
			console.log(data.keterangan);	*/
			
			var new_row = $("<tr class='search-header'/>");
			$('#dataTableListPc thead th').each(function(i) {
			  	
			  var title = $(this).text();
			  var new_th = $('<th style="' + $(this).attr('style') + '" />');
	
				if(i!=0){
					  if(i==2) {
						 $(new_th).append('<input type="text" name="searchTxt" id="tglDistribusi" ng-keyup="vm.buttonSearch()" class="form-control pull-center input-sm" size="15" placeholder="' + 
								  title + '" data-index="'+i+'"/>');
					  } else {
						  $(new_th).append('<input type="text" name="searchTxt" ng-keyup="vm.buttonSearch()" class="form-control pull-center input-sm" size="15" placeholder="' + 
								  title + '" data-index="'+i+'"/>');
					  }
				  }else{
					 $(new_th).append('<span></span>');
				  }
			 
			  $(new_row).append(new_th);
			});
			$('#dataTableListPc thead').prepend(new_row);
			
			var targetURL ='/daftarpc/getList';
			var url = CommonService.translateUrl(targetURL);
			
			table = $('table#dataTableListPc').DataTable({
	            ajax: {
	                contentType: 'application/json',
	                url: url,
	                type: 'POST',
	                data: function (d) {
						
						var jenisPc;
						if(vm.PARAM != undefined){
							jenisPc = vm.PARAM.PARAM_NAME;
						}else{
							jenisPc = "ALL PC";
						}
						
						var dto = {}
						var tgl = $("#tglDistribusi").val();
						d.columns[2].search.value = tgl;
						
						if(vm.periode != undefined ){
							if(vm.periode != '' ){
								dto.periode = $filter('date')(new Date(vm.periode),'yyyyMM');;
							}
						}

						dto.dataSearch =d;
						//dto.jenisPc = jenisPc;
						dto.userName = vm.userName;/*"S0037";*/
						dto.userType = vm.userType;
						
						console.log(dto);
	                    return JSON.stringify(dto);
	                }
	            },
	            serverSide: true,
				"processing": true,
	 			"lengthChange" : true,
				"sDom"		 : 'lrtip',
				"scrollX": true,
				"paging"	: true,
				"order": [[ 1, "asc" ]],
				"searching": true,
				/*"fixedColumns" : {
		            "leftColumns": 1,
		            "rightColumns": 0
		        },*/
	            columns: [
	                { "data": null,
					  "orderable": false, "targets": [0],
						  "render": function (data, type, row) {
					          return '<div >' +
					          			'<button type="button" value="'+data.proposalId+'"  class="mr btn btn-primary btn-xs report" data-toggle="tooltip" title="Detail"><i class="fa fa-book"></i></button>' +
					          		  '</div>'
				        	}
								
					},
	                {
	                    data: 'noPc'
	                },
	                { "data": 'distributedDate',
					  "className": "text-center", 
						  "render": function (data) {
							
								if(data == null){
									return ""
								}else{
									return moment(data).format('DD-MM-YYYY');
								}
					       }  	
					},
					{ "data": 'periodeStart',
					  "className": "text-center",
						  "render": function (data) {
					         return moment(data).format('DD-MM-YYYY');
				        	}
					},
					{ "data": 'periodeEnd',
					  "className": "text-center", 
						  "render": function (data) {
					         return moment(data).format('DD-MM-YYYY');
				        	}
					},
					{
	                    data: 'proposalType'
	                },
					{
	                    data: 'discountType'
	                },
					{
	                    data: 'claim',
						"className": "text-center"
	                },
					{
	                    data: 'mekanismePenagihan'
	                },
					{
	                    data: 'progPromo'
	                },
					{
	                    data: 'status',
						"className": "text-center"
	                }
	               
	            ],
				
	        });
	
			var input_filter_timeout;
			var that;
			
			// Filter event handler
			$(table.table().container() ).on( 'keyup', 'thead input', function (e) { 
		         that = this
				 if(e.keyCode != 13) {
					table
				      .column($(that).parent().index() + ':visible')
				      .search(that.value);
				  }
			});
			
			$('#dataTableListPc tbody').on( 'click', '.report', function () {
				
				var item = table.row( $(this).parents('tr') ).data();
				var dataConcat = {};
				
				var lempar = {
						ppId : this.value
				}
				
				CommonService.doPost('/daftarpc/report', lempar) 
				.then(
					function(data){
						window.open(data.urlExt,'_blank');
					});
		    } );
			
		/*});*/
		
	}
	
	loadDataTable();
	
	vm.buttonSearch = function() {
		table.ajax.reload();
	}
	
	
	
}]);
