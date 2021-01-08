'use strict';

App.controller('TCApprovalController', ['CommonService', '$state', '$stateParams',  '$uibModal', '$rootScope', '$log', function(CommonService, $state, $stateParams, $uibModal, $rootScope, $log) {
	var vm = this;
	
	/*--- Variables ---*/
	var param 		= $stateParams.dataFromViewDetail;
	var dataForBack = $stateParams.dataForBackViewDetail;
	var table 		= null;
	//var dataLinePO 	= [];
	//var dataPO 		= [];
	var dataPOList 	= null;
	//var kodeProduct = {};
	var dataForSave = {};
	var grandTotalExc 	= 0;
	var grandTotalQty 	= 0;
	var grandTotalUnit 	= 0;
	var dataSetelahLinePO = {};
	//var tableEmpty	= false;
	
	vm.tcApp = {
			noDCV		: dataForBack.header.noDcv,
			linePC		: param.noLinePC,
			linePCKor	: "kosong",
			flagPCKor	: "kosong",
			kodeDist	: dataForBack.header.custCode +' | '+ dataForBack.header.custName,
			//region		: dataForBack.header.region +' | '+ dataForBack.header.area +' | '+ dataForBack.header.location,
			region		: dataForBack.detail.masterCustomer.regionName +' | '+ dataForBack.detail.masterCustomer.areaName +' | '+ dataForBack.detail.masterCustomer.locationName,
			prodClass	: param.prodClass,
			prodBr		: param.prodBrand,
			prodExt		: param.prodExt,
			prodPack	: param.prodPack
	};
	vm.prepareDataToServer = [];
	vm.hargaSementara2 = [];
	vm.hargaSementara3 = [];
	
	table = $('#tcApproval').DataTable({
		"retrieve": true,
		"paging": false,
		"searching": false,
		"info": false,
		"sort": false,
		"scrollX": "100%",
		"footerCallback": function ( row, data, start, end, display ) {
			var api = this.api(), data;
			$( api.column( 0 ).footer() ).html('Grand Total:');
			$( api.column( 9 ).footer() ).html(grandTotalQty);
			$( api.column( 11 ).footer() ).html(grandTotalUnit);
			$( api.column( 12 ).footer() ).html(grandTotalExc);
		},
		"select": true,
		"columnDefs": [
            { className: "hidden_column_data_table", "targets": [15] },
            { className: "hidden_column_data_table", "targets": [16] },
            { className: "hidden_column_data_table", "targets": [17] },
            { className: "hidden_column_data_table", "targets": [18] },
            { className: "hidden_column_data_table", "targets": [19] },
            { className: "hidden_column_data_table", "targets": [20] },
            { className: "hidden_column_data_table", "targets": [21] },
            { className: "hidden_column_data_table", "targets": [22] },
            { className: "hidden_column_data_table", "targets": [23] }          
        ]
	});
	

	/*--- Function-function ---*/
	init();
	
	vm.back = function() {
		var paramback = {
			noDcv 	: dataForBack.header.noDcv,
			roleCode: $rootScope.userProfile.userRole,
			custCode: dataForBack.header.custCode
		};
		
		CommonService.doPost('/getDcvBodyListForViewDetail', paramback)
		.then(function(data){
			dataForBack.detail = data;
			$state.go('home.view-detail', {dataFromMntr: dataForBack});
		});
	}
	
	vm.tambah = function() {
		var formData = table.rows().data();
		var validadd = true;
		if(formData.length > 1){
			for(var i=1; i<=formData.length; i++){
				if($('#noPo'+i).val() == ""){
					validadd = false;
					break;
				}
			}
		}else if($('#noPo1').val() == ""){
			validadd = false;
		}
		
		if(validadd == true){
			var rowData = [];
			var info = table.page.info();
			var index = info.recordsTotal+1;
			
			rowData.push('<div><label id="no'+index+'" class="control-label-custom">'+index+'</label></div>');
			rowData.push('<div><button type="button" id="delete" class="mr btn btn-danger btn-xs" data-toggle="tooltip" title="Hapus"><i class="fa fa-trash"></i></button></div>');
			rowData.push('<div class="ui-widget" style="display: flex"><input type="text" id="noPo'+index+'" class="form-control pull-center input-sm" size="10" disabled><div style="margin: auto"><button type="button" id="searchPOList" class="mr btn btn-info btn-xs" style="margin-left: 2px"><i class="fa fa-search"></i></button><div></div>');
			rowData.push('<div><label id="poLineId'+index+'" class="control-label-custom"></label></div>');
			rowData.push('<div><label id="pcPengganti'+index+'" control-label-custom"></label></div>');
			rowData.push('<div><label id="pcTambahan'+index+'" control-label-custom"></label></div>');
			rowData.push('<div><label id="kodeProd'+index+'" control-label-custom"></label></div>');
			rowData.push('<div><label id="namaProd'+index+'" control-label-custom"></label></div>');
			rowData.push('<div><label id="flagBudget'+index+'" control-label-custom"></label></div>');
			rowData.push('<div style="display: flex"><input type="text" id="qty'+index+'" class="form-control pull-center input-sm" size="10" disabled="true">'+
						'<div style="margin: auto; display: flex">'+
						'<button type="button" id="editQty'+index+'" class="mr btn btn-warning btn-xs" style="margin-left: 2px; display: none;"><i class="fa fa-edit"></i></button>'+
						'<button type="button" id="saveQty'+index+'" class="mr btn btn-success btn-xs" style="margin-left: 2px; display: none;"><i class="fa fa-save"></i></button>'+
						'</div></div>');
			rowData.push('<div><label id="uom'+index+'" control-label-custom"></label></div>');
			rowData.push('<div><label id="unitPrice'+index+'" control-label-custom"></label></div>');
			rowData.push('<div><input type="text" id="totalPrice'+index+'" class="form-control pull-center input-sm" size="10" disabled="true"></div>');
			rowData.push('<div><input type="text" id="note'+index+'" class="form-control pull-center input-sm" size="10" disabled="true"></div>');
			rowData.push('<div><label id="supplierCode'+index+'" ></label></div>');
			rowData.push('<div><label id="poId'+index+'" ></label></div>');
			rowData.push('<div><label id="poDesc'+index+'" ></label></div>');
			rowData.push('<div><label id="siteCode'+index+'" ></label></div>');
			rowData.push('<div><label id="noPr'+index+'" ></label></div>');
			rowData.push('<div><label id="linePr'+index+'" ></label></div>');
			rowData.push('<div><label id="pcPenggantiPpId'+index+'" ></label></div>');
			rowData.push('<div><label id="pcTambahanPpId'+index+'" ></label></div>');
			rowData.push('<div><label id="poPpn'+index+'" ></label></div>');
			rowData.push('<div><label id="qtyPo'+index+'" ></label></div>');
			table.row.add(rowData).draw( false );
			 
			// Total footer 
			var resultQty	= 0;
			var resultUnit 	= 0;
			var resultTotalP= 0;
			var fromData = table.rows().data();
			for(var i=1; i<=fromData.length; i++){
				resultQty 	= resultQty + parseFloat($("#qty"+i).val() != "" ? $("#qty"+i).val() : "0");
				resultUnit 	= resultUnit + parseFloat( replaceCount($("#unitPrice"+i ).html() != "" ? $("#unitPrice"+i ).html() : "0") );
				resultTotalP= resultTotalP + parseFloat( replaceCount($("#totalPrice"+i ).val() != "" ? $("#totalPrice"+i ).val() : "0") );
			}
			
			$('.dataTables_scrollFootInner th[id=gtQty]').html( formatRupiah(resultQty.toString().replace(".",",")) );
			$('.dataTables_scrollFootInner th[id=gtUntP]').html( formatRupiah(resultUnit.toString().replace(".",",")) );
			$('.dataTables_scrollFootInner th[id=gtTotalPrice]').html( formatRupiah(resultTotalP.toString().replace(".",",")) );
		}else{
			Swal.fire({
				icon : 'warning',
			    text : 'Mohon PO yang kosong diisi terlebih dahulu'
			});
		}
	}
	
	vm.simpan = function() {
		var formData = table.rows().data();
		if(formData.length > 0) {
			for(var i=1; i <= formData.length ; i++){
				// Set data in object
				dataForSave = {
					index			: i,
					dcvhId			: param.dcvhId,
					dcvlId			: param.dcvlId,
					modifiedBy		: $rootScope.userProfile.userName,
					noPo			: $( "#noPo"+i ).val(),
					poLineId		: $( "#poLineId"+i ).html(),
					pcPengganti		: $( "#pcPengganti"+i ).html(),
					pcTambahan 		: $( "#pcTambahan"+i ).html(),
					kodeProd		: $( "#kodeProd"+i ).html(),
					namaProd		: $( "#namaProd"+i ).html(),
					flagBudget		: $( "#flagBudget"+i ).html(),
					qty				: $( "#qty"+i ).val(),
					uom				: $( "#uom"+i ).html(),
					unitPrice		: replaceCount($( "#unitPrice"+i ).html()),
					totalPrice		: replaceCount($( "#totalPrice"+i ).val()),
					note			: $( "#note"+i ).val(),
					supplierCode	: $( "#supplierCode"+i ).html(),
					poId			: $( "#poId"+i ).html(),
					poDesc			: $( "#poDesc"+i ).html(),
					siteCode		: $( "#siteCode"+i ).html(),
					noPr			: $( "#noPr"+i ).html(),
					linePr			: $( "#linePr"+i ).html(),
					pcPenggantiPpId	: $( "#pcPenggantiPpId"+i ).html(),
					pcTambahanPpId	: $( "#pcTambahanPpId"+i ).html(),
					poPpn			: $( "#poPpn"+i ).html(),
					qtyPo			: $( "#qtyPo"+i ).html()
				}
				vm.prepareDataToServer.push(dataForSave);						
			}	
		}else{
			dataForSave = {	dcvhId : param.dcvhId, dcvlId : param.dcvlId }
			vm.prepareDataToServer.push(dataForSave);
		}
		
		Swal.fire({
			  html: "<b>Anda Yakin Menyimpan Data ini ?</b>",
			  icon: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#28a745',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Ok'
			}).then((result) => {
				if (result.value) {
					CommonService.doPost('/savingDcvReqDtlForTcAppv', vm.prepareDataToServer)
					.then(function(){
						Swal.fire(
					      'Tersimpan',
					      'PO anda telah tersimpan.',
					      'success'
					    );
						vm.back();		
					});
				}else{
					dataForSave = {};
					vm.prepareDataToServer = [];
				}
			});
	}
	
	// Show Modal PO List
	function showModalPoList(parameter, index, dataSetelahLinePO, tableTcApproval, paramEx, dataPOList) {
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'pages/modal/modalPoList.html',
			controller: 'ModalPoListCtrl',
			controllerAs : 'vm',
			size: 'lg',
			resolve : {	
				parameter : function(){
	        		return parameter;
	        	},
	        	index : function(){
	        		return index;
	        	},
	        	dataSetelahLinePO : function(){
	        		return dataSetelahLinePO;
	        	},
	        	tableTcApproval : function(){
	        		return tableTcApproval;
	        	},
	        	paramEx : function(){
	        		return paramEx;
	        	},
	        	dataPOList : function(){
	        		return dataPOList;
	        	}
			}
		});		
		modalInstance.result;
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
	
	// Replace for count
	function replaceCount(input){
		var point = input.replaceAll(".",""),
			result = point.replace(",",".");
		return result;
	}
	
	function init() {
		console.log("tc nodeCode",dataForBack.header.nodecode);
		if(dataForBack.header.nodecode != "TC1"){
			$('#simpanTcApproval').prop('disabled', true);
			$('#tambahTcApproval').prop('disabled', true);
		}
		
		setTimeout(function(){ 
		CommonService.doPost('/getTcApprovalById', param.dcvlId)
		.then(function(data){
			var totalQty	= 0;
			var totalUnit 	= 0;
			var totalExc 	= 0;
			var index 		= 0;
			var no 			= 1;
			
			for(var i = 0; i < data.length; i++){
				index++;
				var pcPengganti = data[i].pcPengganti == null ? "" : data[i].pcPengganti;
				var pcTambahan 	= data[i].pcTambahan == null ? "" : data[i].pcTambahan;
				var notes 		= data[i].notes == null ? "" : data[i].notes;
				var flagBudget 	= data[i].flagBudget == null ? "" : data[i].flagBudget;
				var prodCode 	= data[i].prodCode == null ? "" : data[i].prodCode;

				vm.hargaSementara3.push(data[i].qty);
				
				table.row.add([
					'<div><label id="no'+index+'" control-label-custom">'+no+'</label></div>',
					'<div><button type="button" id="delete" class="mr btn btn-danger btn-xs" data-toggle="tooltip" title="Hapus"><i class="fa fa-trash"></i></button></div>',
					'<div class="ui-widget" style="display: flex"><input type="text" id="noPo'+index+'" value="'+data[i].noPo+'" class="form-control pull-center input-sm" size="10" disabled><div style="margin: auto"><button type="button" id="searchPOList" class="mr btn btn-info btn-xs" style="margin-left: 2px"><i class="fa fa-search"></i></button><div></div>',
					'<div><label id="poLineId'+index+'" control-label-custom">'+data[i].poLineId+'</label></div>',
					'<div><label id="pcPengganti'+index+'" control-label-custom">'+pcPengganti+'</label></div>',
					'<div><label id="pcTambahan'+index+'" control-label-custom">'+pcTambahan+'</label></div>',
					'<div><label id="kodeProd'+index+'" control-label-custom">'+prodCode+'</label></div>',
					'<div><label id="namaProd'+index+'" control-label-custom">'+data[i].prodName+'</label></div>',
					'<div><label id="flagBudget'+index+'" control-label-custom">'+flagBudget+'</label></div>',
					'<div><input type="text" id="qty'+index+'" value="'+data[i].qty+'" class="form-control pull-center input-sm" size="10"></div>',
					'<div><label id="uom'+index+'" control-label-custom">'+data[i].uom+'</label></div>',
					'<div><label id="unitPrice'+index+'" control-label-custom">'+formatRupiah(data[i].hargaSatuan.toString().replace('.',','))+'</label></div>',
					'<div><input type="text" id="totalPrice'+index+'" value="'+formatRupiah(data[i].nilaiTotal.toString().replace('.',','))+'" class="form-control pull-center input-sm" size="10" disabled="true"></div>',
					'<div><input type="text" id="note'+index+'" value="'+notes+'" class="form-control pull-center input-sm" size="10" disabled="true"></div>',
					'<div><label id="supplierCode'+index+'">'+data[i].kodeSuplier+'</label></div>',
					'<div><label id="poId'+index+'">'+data[i].poId+'</label></div>',
					'<div><label id="poDesc'+index+'">'+data[i].poDesc+'</label></div>',
					'<div><label id="siteCode'+index+'">'+data[i].kodeSite+'</label></div>',
					'<div><label id="noPr'+index+'">'+data[i].noPr+'</label></div>',
					'<div><label id="linePr'+index+'">'+data[i].linePr+'</label></div>',
					'<div><label id="pcPenggantiPpId'+index+'">'+data[i].pcPenggantiPPId+'</label></div>',
					'<div><label id="pcTambahanPpId'+index+'">'+data[i].pcTambahanPPId+'</label></div>',
					'<div><label id="poPpn'+index+'">'+data[i].poPpn+'</label></div>',
					'<div><label id="qtyPo'+index+'">'+data[i].qtyPo+'</label></div>'
				]).draw(false);
				
				$( "#kodeProd"+index ).prop('disabled', false);
				$( "#note"+index ).prop('disabled', false);
				no++;
				totalQty 	+= parseFloat(data[i].qty);
				totalUnit	+= parseFloat(data[i].hargaSatuan);
				totalExc	+= parseFloat(data[i].nilaiTotal);									
			}
			
			// Get Index Row Data table
			var indexTC	= 0;
			var idxQty 	= 0;
			
			$('#tcApproval tbody').on( 'click', 'tr', function () {
				indexTC	= table.row( this ).index();
				idxQty 	= indexTC+1;
				var fromData = table.rows().data();
				
				// ON KEYUP CHANGE QTY
				$('#tcApproval tbody').on( 'keyup', '#qty'+idxQty, function () {
					
					var resultQty	= 0;
					var resultTotalP= 0;
					var iNum = parseFloat($("#qty"+idxQty).val());
					var qtypo = $("#qtyPo"+idxQty).html();
					
					// Regex only input number and point
					this.value = this.value.replace(/[^0-9.]/g, '');
					
					if(iNum > parseFloat(qtypo)){
						Swal.fire({
						  icon: 'warning',
						  text: 'Nilai QTY Tidak Boleh Lebih Besar dari Nilai Semula'
						});
						$("#qty"+idxQty).val( $("#qtyPo"+idxQty).html());
				    }
					
					// Change value qty cannot be greater than value qty original 
					if(iNum > parseFloat( $( "#qtyPo"+idxQty ).html() )) {
						Swal.fire({
						  icon: 'warning',
						  text: 'Nilai QTY Tidak Boleh Lebih Besar dari Nilai Semula'
						});
						$("#qty"+idxQty).val( $("#qtyPo"+idxQty).html());

						// Total price if qty change
//						var total =  vm.hargaSementara3[indexTC] * replaceCount($("#unitPrice"+idxQty).html());
//						$( "#totalPrice"+idxQty ).val(total);
//						
//						// Total footer
//						for(var i=1; i <= fromData.length; i++){
//							resultQty 	= resultQty + parseFloat( $("#qty"+i ).val() != "" ? $("#qty"+i ).val() : "0");
//							resultTotalP= resultTotalP + parseFloat( $("#totalPrice"+i ).val() != "" ? $("#totalPrice"+i ).val() : "0" );
//						}
//						$('.dataTables_scrollFootInner th[id=gtQty]').html(resultQty);
//						$('.dataTables_scrollFootInner th[id=gtTotalPrice]').html(resultTotalP);
						
					}else{
						
						// Total price if qty change
						var total = iNum * replaceCount($("#unitPrice"+idxQty).html());
						$("#totalPrice"+idxQty).val(formatRupiah(total.toString().replace('.',',')));
						
						// Total footer
						for(var i=1; i<=fromData.length; i++){
							resultQty = resultQty + parseFloat($("#qty"+i).val() != "" ? $("#qty"+i ).val() : "0");
							resultTotalP = resultTotalP + parseFloat($("#totalPrice"+i).val() != "" ? replaceCount($("#totalPrice"+i).val()) : "0" );
						}
						$('.dataTables_scrollFootInner th[id=gtQty]').html(formatRupiah(resultQty.toString().replace('.',',')));
						$('.dataTables_scrollFootInner th[id=gtTotalPrice]').html(formatRupiah(resultTotalP.toString().replace('.',',')));	
					}
										
				});				

			});
			
			// Button search PO List
			$('#tcApproval tbody').on( 'click', '#searchPOList', function () {
				
				setTimeout(function(){ 
					indexTC += 1;
					
					var paramDcvLine 	= { pDcvLine : param.dcvlId };
					var formData 		= table.rows().data();
					var paramEx			= [];
					for(var i=1; i <= formData.length ; i++){
						var ex = {
								pNoDcv		: dataForBack.header.noDcv,
								ppId		: param.promoProdId,
								supplier	: $( "#supplierCode"+i ).html(),
								siteCode	: $( "#siteCode"+i ).html(),
								noPo 		: $( "#noPo"+i ).val(),
								prodCode 	: $( "#kodeProd"+i ).html()
							}
							paramEx.push(ex);
					}
					showModalPoList(paramDcvLine, indexTC, dataSetelahLinePO, table, paramEx, dataPOList);
					
					}, 200);
							
			} );
			
			$('.dataTables_scrollFootInner th[id=gtQty]').html(formatRupiah(totalQty.toString().replace('.',',')));
			$('.dataTables_scrollFootInner th[id=gtUntP]').html(formatRupiah(totalUnit.toString().replace('.',',')));
			$('.dataTables_scrollFootInner th[id=gtTotalPrice]').html(formatRupiah(totalExc.toString().replace('.',',')));
			
		});
		
		}, 200);
		
//		// ON CLICK EDIT QTY
//		$('#tcApproval tbody ').on('focus', 'tr td:nth-child(10)', function () {
//			var index = table.row( this ).index() + 1;
//
//			$('#editQty'+index).on('click', function(){
//
//				var replaceQty = replaceCount($('#qty'+index).val());
//				$('#qty'+index).val(replaceCount($('#qty'+index).val()));
//				
//				$('#qty'+index).prop('disabled', false);
//				$('#editQty'+index).css('display','none');
//				$('#saveQty'+index).css('display','block');
//			});
//			
//			$('#saveQty'+index).on('click', function(){
//				var test = $('#qty'+index).val().toString().replace('.',',');
//				console.log("save qty : "+test);
//				var test2 = formatRupiah(test);
//				console.log("save qty 2 : "+test2);
//				$('#qty'+index).val(test2);
//				
//				$('#qty'+index).prop('disabled', true);
//				$('#saveQty'+index).css('display','none');
//				$('#editQty'+index).css('display','block');
//			});
//		});
		
		// ON CLICK REMOVE BUTTON
		$('#tcApproval tbody ').on('click', 'tr td:nth-child(2)', function () {			
			
			Swal.fire({
			  html: "<b>Anda Yakin Menghapus Data ini ?</b>",
			  icon: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Ok'
			}).then((result) => {
				
			  if (result.value) {
				// Remove row selected
				table.row('.selected').remove().draw( false );
				setTimeout(function(){
					// Get data table after remove row 
					var fromData= table.rows().data();
					var param 	= [];
					for(var i=1; i <= fromData.length+1 ; i++){				
						if($( "#noPo"+i ).val() != null){
							param.push({
								index		: i,
								noPo		: $( "#noPo"+i ).val(),
								poLineId	: $( "#poLineId"+i ).html(),
								pcPengganti	: $( "#pcPengganti"+i ).html(),
								pcTambahan	: $( "#pcTambahan"+i ).html(),
								kodeProd	: $( "#kodeProd"+i ).html(),
								namaProd    : $( "#namaProd"+i ).html(),
								flagBudget	: $( "#flagBudget"+i ).html(),
								qty			: $( "#qty"+i ).val(),
								uom			: $( "#uom"+i ).html(),
								unitPrice	: $( "#unitPrice"+i ).html(),
								totalPrice	: $( "#totalPrice"+i ).val(),
								note		: $( "#note"+i ).val(),
								supplierCode: $( "#supplierCode"+i ).html(),
								poId		: $( "#poId"+i ).html(),
								poDesc		: $( "#poDesc"+i ).html(),
								siteCode	: $( "#siteCode"+i ).html(),
								noPr		: $( "#noPr"+i ).html(),
								linePr		: $( "#linePr"+i ).html(),
								pcPenggantiPpId: $( "#pcPenggantiPpId"+i ).html(),
								pcTambahanPpId: $( "#pcTambahanPpId"+i ).html(),
								poPpn		: $( "#poPpn"+i ).html(),
								qtyPo		: $( "#qtyPo"+i ).html(),
							});
						}
					}
					
					// Clear all remaining data table
					table.clear().draw(false);
					
					// Create remaining data table
					var resultQty 		= 0;
					var resultUnit		= 0;
					var resultExc 		= 0;
					var indx 			= 0;
					var no				= 1;

					for(var i=0; i<param.length; i++){
						indx++;
						// Add data in table
						table.row.add([
							'<div><label id="no'+indx+'" control-label-custom">'+no+'</label></div>',
							'<div><button type="button" id="delete" class="mr btn btn-danger btn-xs" data-toggle="tooltip" title="Hapus"><i class="fa fa-trash"></i></button></div>',
							'<div class="ui-widget" style="display: flex"><input type="text" id="noPo'+indx+'" value="'+param[i].noPo+'" class="form-control pull-center input-sm" size="10" disabled><div style="margin: auto"><button type="button" id="searchPOList" class="mr btn btn-info btn-xs" style="margin-left: 2px"><i class="fa fa-search"></i></button><div></div>',
							'<div><label id="poLineId'+indx+'" control-label-custom">'+param[i].poLineId+'</label></div>',
							'<div><label id="pcPengganti'+indx+'" control-label-custom">'+param[i].pcPengganti+'</label></div>',
							'<div><label id="pcTambahan'+indx+'" control-label-custom">'+param[i].pcTambahan+'</label></div>',
							'<div><label id="kodeProd'+indx+'" control-label-custom">'+param[i].kodeProd+'</label></div>',
							'<div><label id="namaProd'+indx+'" control-label-custom">'+param[i].namaProd+'</label></div>',
							'<div><label id="flagBudget'+indx+'" control-label-custom">'+param[i].flagBudget+'</label></div>',
							'<div><input type="text" id="qty'+indx+'" value="'+param[i].qty+'" class="form-control pull-center input-sm" size="10" disabled="true"></div>',
							'<div><label id="uom'+indx+'" control-label-custom">'+param[i].uom+'</label></div>',
							'<div><label id="unitPrice'+indx+'" control-label-custom">'+param[i].unitPrice+'</label></div>',
							'<div><input type="text" id="totalPrice'+indx+'" value="'+param[i].totalPrice+'" class="form-control pull-center input-sm" size="10" disabled="true"></div>',
							'<div><input type="text" id="note'+indx+'" value="'+param[i].note+'" class="form-control pull-center input-sm" size="10" disabled="true"></div>',
							'<div><label id="supplierCode'+indx+'">'+param[i].supplierCode+'</label></div>',
							'<div><label id="poId'+indx+'">'+param[i].poId+'</label></div>',
							'<div><label id="poDesc'+indx+'">'+param[i].poDesc+'</label></div>',
							'<div><label id="siteCode'+indx+'">'+param[i].siteCode+'</label></div>',
							'<div><label id="noPr'+indx+'">'+param[i].noPr+'</label></div>',
							'<div><label id="linePr'+indx+'">'+param[i].linePr+'</label></div>',
							'<div><label id="pcPenggantiPpId'+indx+'">'+param[i].pcPenggantiPpId+'</label></div>',
							'<div><label id="pcTambahanPpId'+indx+'">'+param[i].pcTambahanPpId+'</label></div>',
							'<div><label id="poPpn'+indx+'">'+param[i].poPpn+'</label></div>',
							'<div><label id="qtyPo'+indx+'">'+param[i].qtyPo+'</label></div>'
						]).draw(false);
						no++;
						$( "#kodeProd"+indx ).prop('disabled', false);
						$( "#qty"+indx ).prop('disabled', false);
						$( "#note"+indx ).prop('disabled', false);
						
						// Sum result total
						resultQty 		+= parseFloat(param[i].qty);
						resultUnit 		+= parseFloat(replaceCount(param[i].unitPrice));
						resultExc 		+= parseFloat(replaceCount(param[i].totalPrice));
					}
					
					// Set result total
					$('.dataTables_scrollFootInner th[id=gtQty]').html(formatRupiah(resultQty.toString().replace(".",",")));
					$('.dataTables_scrollFootInner th[id=gtUntP]').html(formatRupiah(resultUnit.toString().replace(".",",")));
					$('.dataTables_scrollFootInner th[id=gtTotalPrice]').html(formatRupiah(resultExc.toString().replace(".",",")));
								
				}, 200);
			  }
			});
		});
		
	}
}]);

//Modal Controller For Modal PO List
App.controller('ModalPoListCtrl', function ($uibModalInstance, CommonService, parameter, index, dataSetelahLinePO, tableTcApproval, paramEx, dataPOList){
	var vm 				= this;
	var table 			= null;
	var resultPoList 	= {};
	vm.parameter 		= parameter;
	
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
	
	// Replace for count
	function replaceCount(input){
		var point = input.replaceAll(".",""),
			result = point.replace(",",".");
		return result;
	}
	
	CommonService.doPost('/getPoListByIdEx', paramEx).then(function(data){		
		console.log("PO List Started");
		console.log(data);
		if(data[0].noPo == "ERROR"){
			Swal.fire({
			  icon: 'error',
			  html: '<p>'+ data[0].namaProd+'</p>',
			})
		}else{
			table = $('#tablePoList').DataTable({
				"data" : data,
				"columns": [
				  {"data" : "noPo"},
				  {"data" : "poLineId"},
				  {"data" : "kodeProd"},
				  {"data" : "namaProd"},
				  {"data" : "flagBudget"},
				  {"data" : "totalPrice"},
				  {"data" : "supplierCode"},
				  {"data" : "siteCode"}
				],
				"rowCallback": function( row, data, index ) {
			        $('td', row).css('font-size', '12px');
				},
				"lengthMenu"	: [[5, 10], [5, 10]],
				"displayLength"	: 5,
				"lengthChange" 	: false,
				"sDom"		 	: 'lrtip',
				"paging"		: false,
				"searching"		: false,
				"scrollY"		: '270px',
				"scrollX"		: '300px',
				"select"		: true,
				
			});
			
			// Get data from select row table
			$('#tablePoList tbody').on( 'click', 'tr', function () {
				resultPoList = table.row( this ).data();
		    } );
		}
		console.log("PO List End");
	});
	
	vm.submitNoPo = function(){
		if(resultPoList.noPo !=  null){
			sbmtNoPo();
			dismiss();
		}else{
			alert("Please select data");
		}		
	}
	
	function sbmtNoPo(){
		
		$( "#noPo"+index ).val(resultPoList.noPo);
		$( "#poLineId"+index ).html(resultPoList.poLineId);
		$( "#pcPengganti"+index ).html(resultPoList.pcPengganti);
		$( "#pcTambahan"+index ).html(resultPoList.pcTambahan);
		$( "#kodeProd"+index ).html(resultPoList.kodeProd);
		$( "#kodeProd"+index ).prop('disabled', false);
		$( "#namaProd"+index ).html(resultPoList.namaProd);
		$( "#flagBudget"+index ).html(resultPoList.flagBudget);
		$( "#qty"+index ).val(resultPoList.qty);
//		$( "#qty"+index ).val(formatRupiah( resultPoList.qty.toString().replace(".",",") ));
		$( "#uom"+index ).html(resultPoList.uom);
		$( "#unitPrice"+index ).html(formatRupiah(resultPoList.unitPrice));
		$( "#totalPrice"+index ).val(formatRupiah( resultPoList.totalPrice.toString().replace(".",",") ));
		$( "#supplierCode"+index ).html(resultPoList.supplierCode);
		
		// Hidden
		$( "#poId"+index ).html(resultPoList.poId);
		$( "#poDesc"+index ).html(resultPoList.poDesc);
		$( "#siteCode"+index ).html(resultPoList.siteCode);
		$( "#noPr"+index ).html(resultPoList.noPr);
		$( "#linePr"+index ).html(resultPoList.linePr);
		$( "#pcPenggantiPpId"+index ).html(resultPoList.pcPenggantiPpId);
		$( "#pcTambahanPpId"+index ).html(resultPoList.pcTambahanPpId);
		$( "#poPpn"+index ).html(resultPoList.poPpn);
		$( "#qtyPo"+index ).html(resultPoList.qty);
		
		vm.hargaSementara = resultPoList.qty;
		vm.hargaSementara2 = resultPoList.qty;
			
		$( "#qty"+index ).prop('disabled', false);
		$( "#note"+index ).prop('disabled', false);
//		$( "#editQty"+index ).css('display', 'block');
		
		// Total Footer
		var resultQty	= 0;
		var resultUnit	= 0;
		var resultTotalP= 0;
		var fromData = tableTcApproval.rows().data();
		
		for(var i=1; i<=fromData.length; i++){
			resultQty 	= resultQty + parseFloat($("#qty"+i ).val());
			resultUnit 	= resultUnit + parseFloat( replaceCount($("#unitPrice"+i ).html()) );
			resultTotalP= resultTotalP + parseFloat( replaceCount($("#totalPrice"+i ).val()) );
		}
		$('.dataTables_scrollFootInner th[id=gtQty]').html(formatRupiah(resultQty.toString().replace(".",",")));
		$('.dataTables_scrollFootInner th[id=gtUntP]').html(formatRupiah(resultUnit));
		$('.dataTables_scrollFootInner th[id=gtTotalPrice]').html(formatRupiah(resultTotalP.toString().replace(".",",")));
	}
	
	vm.backToIndex = function(){ dismiss();	}	
	function dismiss(){	$uibModalInstance.dismiss('cancel'); }
});