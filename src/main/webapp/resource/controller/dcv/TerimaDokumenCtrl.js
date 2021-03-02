'use strict';

App.controller('TerimaDokumenController', ['CommonService', '$state', '$filter', '$log', 'DTColumnBuilder', 'DTOptionsBuilder', '$uibModal', '$window', '$rootScope', '$location',
				function(CommonService, $state, $filter, $log, DTColumnBuilder, DTOptionsBuilder, $uibModal, $window, $rootScope, $location) {
	var vm = this;
	
	/*--- Variables ---*/
	var paramSelectAction = null;
//	var paramSelectAction = [];
	var fullName = $rootScope.userProfile.fullName;
	var itung = 0;
	var table = null;
	
	/*role from user login*/
	vm.roleUser = $rootScope.userProfile.role.roleCode;	
	vm.listAksi = [];
	vm.dataDetail = null;
	vm.adaTolakan = false;
	vm.terbuka = false;
	vm.prepareDataToServer = [];
	
	vm.dtOptions = DTOptionsBuilder.newOptions()
		.withOption('paging', false)
		.withOption('searching', false)
		.withOption('scrollY', '200px')	
	    .withOption('scrollX', '100%')
		    
		    
	/*--- Function-function ---*/
	init();
	
	vm.submit = function() {
		
		var formData = table.rows().data();
		var dataToServer = [];
		for(var i=1; i<=formData.length; i++){
			if( $(".check-box-batch"+i).prop("checked") == true  ){
				var param = {
						pTaskId 	: $(".taskId-"+i).html(),
						pActionId 	: vm.selected.pilihan,
						pUser 		: $rootScope.userProfile.userName,
						pNote 		: $(".note-"+i).val()
				}
				dataToServer.push(param);
			}
		}
		
		console.log("dataToServer : ",dataToServer);
		if(dataToServer.length > 0){
			CommonService.doPost('/saveDocumentBacth', dataToServer)
			.then(function(data){
				console.log("Result submit terima dokumen batch : ", data);
				Swal.fire({
					icon: "success",
					html: "<p><b>Sukses</b> submit : "+data.success+" dokumen</p> <p><b>Gagal</b> submit : "+data.fail+" dokumen</p>"
				});
				vm.cari();
			});
		}else{
			Swal.fire({
				icon: "warning",
				text: "Pilih dokumen yang akan di Submit"
			});
		}
	}
	
	vm.print = function(data) {		
		var xlsHeader = [
			"No DCV",
			"Kode Customer",
			"Nama Customer",
			"Region",
			"Area",
			"Location",
			"No PC",
			"DCV Value Approved",
			"No Kwitansi",
			"No FP",
			"No PO",
			"No GR",
			"Task Id",
			"Note Tolakan"
			];
 
        /* XLS Rows Data */
        var xlsRows = data;
 
        /* File Name */
        var tglReport = CommonService.formatDate(new Date());
        var filename = "Terima Dokumen_"+fullName+"_"+tglReport+".xlsx";
        
        //Export Excel with JavaScript
        CommonService.exportJSONToExcel(xlsHeader, xlsRows, filename);
        Swal.fire({
			icon: "success",
			text: "File "+filename+" ada di folder Downloads"
		});
	}
	
	vm.cari = function() {
		
		var param = {
			actionBagian : vm.selected.bagian,
			nodeCode : vm.selected.nodeId
		}
		
		table.clear().draw();
		CommonService.doPost('/getDocumentBatchList', param)
		.then(function(data){
			var index 		= 0;
			for(var i = 0; i < data.length; i++){
				index++;
				table.row.add([
					'<div><input type="checkbox" class="check-box-batch'+index+'"></div>',
					'<div><input type="text" value="'+data[i].note+'" class="note-'+index+' form-control pull-center input-sm"></div>',
					'<div><label class="control-label-custom">'+data[i].noDcv+'</label></div>',
					'<div><label class="control-label-custom">'+data[i].custCode+'</label></div>',
					'<div><label class="control-label-custom">'+data[i].custName+'</label></div>',
					'<div><label class="control-label-custom">'+data[i].region+'</label></div>',
					'<div><label class="control-label-custom">'+data[i].area+'</label></div>',
					'<div><label class="control-label-custom">'+data[i].location+'</label></div>',
					'<div><label class="control-label-custom">'+data[i].noPc+'</label></div>',
					/*'<div><label class="control-label-custom">'+formatRupiah(data[i].appvVal)+'</label></div>',*/
					'<div style="text-align: right;" ><label class="control-label-custom">'+replaceNbr($filter('currency')(data[i].appvVal,'',2))+'</label></div>',
					'<div><label class="control-label-custom">'+data[i].noKwitansi+'</label></div>',
					'<div><label class="control-label-custom">'+data[i].noFp+'</label></div>',
					'<div><label class="control-label-custom">'+data[i].poNo+'</label></div>',
					'<div><label class="control-label-custom">'+data[i].grNo+'</label></div>',
					'<div><label class="taskId-'+index+' control-label-custom">'+data[i].taskId+'</label></div>'
				]).draw(false);
			}
			
			// For print to excel
			vm.dataDetail = data;
			$('.check-box-batch').attr('checked', false);			
		});
	}
	
//	function resetDataInput(data) {
//		data.note = null;
//	}

	function replaceNbr(number){
		
		var nbr = number.toString().replaceAll(",","-");
		    nbr = nbr.toString().replaceAll(".",",");
			nbr = nbr.toString().replaceAll("-",".");
			
			return nbr;
	}
	
	// Format Number to Rupiah
	function formatRupiah(number){
		var number_string = number.toString().replace(/[^,\d]/g, '').toString(),
		split   		= number_string.split(','),
		sisa     		= split[0].length % 3,
		rupiah     		= split[0].substr(0, sisa),
		ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);

		if(ribuan){
			var separator = sisa ? '.' : '';
			rupiah += separator + ribuan.join('.');
		}
			
		rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
		return  rupiah;
	}
	
	function init() {	
		setTimeout(function(){ 
			table = $('#terimaDok').DataTable({
				"retrieve": true,
				"paging": false,
				"searching": false,
				"info": false,
				"sort": false,
				"scrollX": "100%",
				"columnDefs": [
		            { className: "hidden_column_data_table", "targets": [14] }
		        ]
			});
		},200);
		
		CommonService.doPost('/role/getRole', $rootScope.userProfile.userRole)
		.then(function(data){
			
			CommonService.doPost('/dokumenaction/getDocumentAction', data.bagian)
			.then(
				function(dataDoc){
					vm.listAksi = dataDoc;
					console.log('Data doc : ', vm.listAksi);
				}
			);
		});		
	}
}]);