'use strict';

App.controller('ViewDetailController', ['$http', '$q','$window', '$state', 'CommonService', '$stateParams', '$rootScope', '$uibModal', '$localStorage',
				function($http, $q, $window, $state, CommonService, $stateParams, $rootScope, $uibModal, $localStorage) {
	
	var vm = this;
	
	/*--- Variables ---*/
	var param = $stateParams.dataFromMntr;
	console.log("nodeCode : "+param.header.nodecode);
	console.log("taskId : "+param.header.taskId);
	var TaxOnly = false;
	//var urlBefore = $stateParams.urlBefore;
	//var dataInputBefore = $stateParams.dataInputBefore;
	//var wfTask = {};
	
	vm.viewDtl = {};
	vm.view = {};
	vm.viewDtlDoc = [];
	vm.adaBA = false;
	vm.adaRF = false;
	vm.adaKwi = false;
	vm.adaFP = false;
	vm.adaRK = false;
	vm.adaBPP = false;
	vm.total = {};
	vm.dvcLines = [];
	vm.dataForTCApp = [];
	vm.fromDCVtrk = false;
	vm.TCOnly = false;
	vm.dataId = null;
	vm.roleUser = $rootScope.userProfile.userRole;
	vm.totalSetelahAdj =0;
	vm.privs 		= param.detail.privs.refId1;
	vm.privAdminSales = param.detail.privAdminSales.refId1;
	vm.privAdminTC = param.detail.privAdminTC.refId1;
	vm.privAdminTAX = param.detail.privAdminTAX.refId1;
	vm.privAdminPromo = param.detail.privAdminPromo.refId1;
	vm.privAdminAP = param.detail.privAdminAP.refId1;
	vm.privTC 		= param.detail.privTC;
	vm.privTaxItem	= param.detail.privTaxItem;
	
	/*--- Function-function ---*/
	init();
	
	vm.back = function() {		
		if(vm.fromDCVtrk) {
			window.close();
		} else {
			$state.go('home.staticDashboard');
		}
	}
	
	vm.clickOnData = function(item) {
		localStorage.setItem('dataFromMntr', JSON.stringify(param));
		var url = $state.href('home.view-detail', {dataFromMntr: param});
		window.open(url,'_blank');
	}
	
	vm.clickOnDcvAdjust = function(item) {
		vm.dataId = item.id;
	}
	
	vm.linkReport = function() {
		var lempar = {
				dcvhId : param.header.dcvhId
		}
		
		CommonService.doPost('/getUrlLinkExternal', lempar) 
		.then(
			function(data){
				window.open(data.urlExt,'_blank');
			});
	}
	
	vm.viewKwitansi = function() {
		var dataKwitansi = null;
		var lempar = {
			dcvhId : param.header.dcvhId
		}
		
		CommonService.doPost('/getDataKwitansi', lempar)
		.then(function(data){
				dataKwitansi = data;
				param.descKwitansi = dataKwitansi.desc;
				showModalKwitansi(param.header.company, dataKwitansi.jumlah, dataKwitansi.terbilang, dataKwitansi.desc, dataKwitansi.materai, param.header.custName);
			});
	}
	
	vm.download = function(file, toFile) {
		var lempar = {
			fileOriginal : file ,
			custCode     : param.header.custCode
		}
		
		CommonService.doPost('/getDownloadData', lempar)
		.then(function(data){
				var dataIn = "";  
				var blob=b64toBlob(data.byte,"application/octet-stream")
			    var link=document.createElement('a');
			    link.href=window.URL.createObjectURL(blob);
			    link.download=toFile;
			    link.click();
			});
	}
	
	const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
		  const byteCharacters = atob(b64Data);
		  const byteArrays = [];

		  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		    const slice = byteCharacters.slice(offset, offset + sliceSize);

		    const byteNumbers = new Array(slice.length);
		    for (let i = 0; i < slice.length; i++) {
		      byteNumbers[i] = slice.charCodeAt(i);
		    }

		    const byteArray = new Uint8Array(byteNumbers);
		    byteArrays.push(byteArray);
		  }

		  const blob = new Blob(byteArrays, {type: contentType});
		  return blob;
	}
	
	vm.openTcApproval = function() {
		if(vm.dataForTCApp.length == 0) {
			CommonService.modalAlert('warning', 'Silahkan pilih no line PC untuk lanjut')
	        .then(function() {});
		} else {
			$state.go('home.tc-approval', {dataFromViewDetail: vm.dataForTCApp[0], dataForBackViewDetail: param})
		}
	}
	
	vm.actionTc = function() {
		getWfTaskByTaskIdAndNoDcv(param.header.noDcv,param.header.taskId,'home.action-tc');
		//getWfTaskByNoDcv(param.header.noDcv, 'home.action-tc');
		//$state.go('home.action-tc', {dataFromViewDetail: param})
	}
	
	vm.actionDist = function() {
		//getWfTaskByNoDcv(param.header.noDcv, 'home.action-dist');
		getWfTaskByTaskIdAndNoDcv(param.header.noDcv,param.header.taskId,'home.action-dist');
		//$state.go('home.action-dist', {dataFromViewDetail: param})
	}
	
	vm.actionSales = function() {
		getWfTaskByTaskIdAndNoDcv(param.header.noDcv,param.header.taskId,'home.action-sales');
		
		//getWfTaskByNoDcv(param.header.noDcv, 'home.action-sales');
		//$state.go('home.action-sales', {dataFromViewDetail: param})
	}
	
	vm.actionAR = function() {
		getWfTaskByTaskIdAndNoDcv(param.header.noDcv,param.header.taskId,'home.action-ar');

		//getWfTaskByNoDcv(param.header.noDcv, 'home.action-ar');
		//$state.go('home.action-ar', {dataFromViewDetail: param})
	}
	
	vm.actionAP = function() {
		getWfTaskByTaskIdAndNoDcv(param.header.noDcv,param.header.taskId,'home.action-ap');

	//	getWfTaskByNoDcv(param.header.noDcv, 'home.action-ap');
		//$state.go('home.action-ap', {dataFromViewDetail: param})
	}
	
	vm.actionPromo = function() {
		//getWfTaskByNoDcv(param.header.noDcv, 'home.action-promo');
		getWfTaskByTaskIdAndNoDcv(param.header.noDcv,param.header.taskId,'home.action-promo');

		//$state.go('home.action-promo', {dataFromViewDetail: param})
	}
	
	vm.actionTax = function() {
		//getWfTaskByNoDcv(param.header.noDcv, 'home.action-tax');
		getWfTaskByTaskIdAndNoDcv(param.header.noDcv,param.header.taskId,'home.action-tax');

		//$state.go('home.action-tax', {dataFromViewDetail: param})
	}
	
	vm.rollBack = function() {
		$state.go('home.rollbackList', {dataFromViewDetail: param})
	}
	
	vm.addAdjustment = function() {
		showModalAdjustment(
				vm.viewDtl.lookupAdj,vm.viewDtl.dcvId,param.header.noDcv,param);
	}
	
	vm.deleteAdjustment = function(data) {
		deleteModalAdjustment(data);
		
	}
	
	function getWfTaskByNoDcv(noDcv, url) {
		//console.log(noDcv+' '+url);
		CommonService.doPost('/wftask/getWfTaskByNoDcv', noDcv)
		.then(
			function(data){
				param.wfTask = data;				
				$state.go(url, {dataFromViewDetail: param})
			});
	}
	
	function getWfTaskByTaskIdAndNoDcv(noDcv, taskId, url) {
		var lempar = {
			pTaskId : taskId,
			pDcvNo : noDcv
		}
		
		CommonService.doPost('/wftask/getWfTaskByIdAndNoDcv', lempar) 
		.then(
			function(data){
				param.wfTask = data;				
				$state.go(url, {dataFromViewDetail: param})
			});
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

		//Mapping data header
		if(param == null || param == undefined) {
			param=JSON.parse(localStorage.getItem('dataFromMntr'));
			vm.fromDCVtrk = true;
			localStorage.removeItem('dataFromMntr');
		}
		mappingData(param);
		
		var prmWfTask = {
			pTaskId : param.header.taskId,
			pDcvNo : param.header.noDcv
		}
		
		CommonService.doPost('/wftask/getWfTaskByIdAndNoDcv', prmWfTask) 
		.then(function(data){
				param.wfTask = data;				
			});
		
		CommonService.getMenuManual('./dist/json/dataDCVLines.json')
		.then(function(data){
			console.log("Data get manual : ",data);
			vm.total = data.data.grand_total;
			vm.dvcLines = param.detail.dcv_lines;
			console.log("Data vm.dvcLines : ",vm.dvcLines);
			
			// Format data to Rupiah
			for (var i = 0; i < vm.dvcLines.length; i++) {
				vm.dvcLines[i].qyt = vm.dvcLines[i].qyt != null ? formatRupiah(vm.dvcLines[i].qyt.toString().replace('.',',')) : null;
				vm.dvcLines[i].valExc = vm.dvcLines[i].valExc != null ? formatRupiah(vm.dvcLines[i].valExc.toString().replace('.',',')) : null;
				vm.dvcLines[i].appvValExc = vm.dvcLines[i].appvValExc != null ? formatRupiah(vm.dvcLines[i].appvValExc.toString().replace('.',',')) : null;
				vm.dvcLines[i].selisih = vm.dvcLines[i].selisih != null ? formatRupiah(vm.dvcLines[i].selisih.toString().replace('.',',')) : null;
				vm.dvcLines[i].ppnVal = vm.dvcLines[i].ppnVal != null ? formatRupiah(vm.dvcLines[i].ppnVal.toString().replace('.',',')) : null;
				vm.dvcLines[i].totalValAppvInc = vm.dvcLines[i].totalValAppvInc != null ? formatRupiah(vm.dvcLines[i].totalValAppvInc.toString().replace('.',',')) : null;
				vm.dvcLines[i].pphVal = vm.dvcLines[i].pphVal != null ? formatRupiah(vm.dvcLines[i].pphVal.toString().replace('.',',')) : null;
			}
			
			var table = $('#viewDetail').DataTable({
				"data" : vm.dvcLines,
				"columns": [
					{ "data": "noLinePC" },
					{ "data": "prodClassDesc" },
					{ "data": "prodBrandDesc" },
					{ "data": "prodExtDesc" },
					{ "data": "prodPackDesc" },
					{ "data": "prodVariantDesc" },
					{ "data": "prodItemDesc" },
					{ "data": "custCode" },
					{ "data": "qyt"},
					{ "data": "uom" },
					{ "data": "valExc"},
					{ "data": "appvValExc"},
					{ "data": "selisih"},
					{ "data": "catatanTC",
						"render": function (data, type, row) {
							var hasil = data;
							if( vm.privTC == "TCAPPV_BTN" && row.appvValExc != null ) {
								hasil = '<i><u><a ui-sref="#" id="catatanTC" role="button">'+data+'</a></u></i>'
							}
							return hasil
						}
					},
					{ "data": "ppnCode" },
					{ "data": "ppnVal"},
					{ "data": "totalValAppvInc"}, //total_val
					{ "data": "pphCode",
						"render": function (data, type, row) {
							var hasil = data;
							if(vm.privTaxItem == "TAX_ITEM" && row.appvValExc != null) {
								hasil = '<i><u><a ui-sref="#" id="nama_pph" role="button">'+data+'</a></u></i>'
							}
							return hasil;
						}
					},
					{ "data": "pphVal"},
					{ "data": "totalValAppvInc"}
				],
				"rowCallback": function( row, data, index ) {
			        $('td', row).css('font-size', '12px');
				},
				"footerCallback": function ( row, data, start, end, display ) {
					var api = this.api(), data;
					
					// Format number from Rupiah
					for (var i = 0; i < data.length; i++) {
						data[i].appvQty = data[i].appvQty != null ?  parseFloat(replaceCount(data[i].appvQty)) : null;
						data[i].appvValExc = data[i].appvValExc != null ? parseFloat(replaceCount(data[i].appvValExc)) : null;
						data[i].selisih = data[i].selisih != null ? parseFloat(replaceCount(data[i].selisih)) : null;
						data[i].ppnVal = data[i].ppnVal != null ? parseFloat(replaceCount(data[i].ppnVal)) : null;
						data[i].totalValAppvInc = data[i].totalValAppvInc != null ? parseFloat(replaceCount(data[i].totalValAppvInc)) : null;
						data[i].pphVal = data[i].pphVal != null ? parseFloat(replaceCount(data[i].pphVal)) : null;
					}
					
					console.log("Data total view detail : ",data);
					angular.forEach(data, function(value){
						param.header.totalAppvQty += value.appvQty;
						param.header.totalAppvValExcl += value.appvValExc;
						param.header.totalSelisih += value.selisih;
						param.header.totalPpnVal += value.ppnVal;
						param.header.grandTotalAppvValExcl += value.totalValAppvInc;
						param.header.totalPphVal += value.pphVal;
						param.header.totalAppvNet += value.totalValAppvInc;
					});
					
					$( api.column( 0 ).footer() ).html('Grand_Total_:');
					$( api.column( 11 ).footer() ).html( formatRupiah(param.header.totalAppvValExcl.toString().replace('.',',')) );
					$( api.column( 12 ).footer() ).html( formatRupiah(param.header.totalSelisih.toString().replace('.',',')) );
					$( api.column( 15 ).footer() ).html( formatRupiah(param.header.totalPpnVal.toString().replace('.',',')) );
					$( api.column( 16 ).footer() ).html( formatRupiah(param.header.grandTotalAppvValExcl.toString().replace('.',',')) );
					$( api.column( 18 ).footer() ).html( formatRupiah(param.header.totalPphVal.toString().replace('.',',')) );
					$( api.column( 19 ).footer() ).html( formatRupiah(param.header.totalAppvNet.toString().replace('.',',')) );
					vm.totalSetelahAdj = param.header.totalAppvValExcl - parseFloat(vm.viewDtl.dcv_adjustTotal,10)
				},
				"paging": false,
				"searching": false,
				"info": false,
				"sort": false,
				"scrollX": '100%'
			});
			
			console.log("privTC  : " + vm.privTC);
			if(vm.privTC == "TCAPPV_BTN") {
				vm.TCOnly = true;
				
				$('#viewDetail tbody ').on( 'click', 'tr', function () {
			        if ( $(this).hasClass('selected') ) {
			            $(this).removeClass('selected');
			            vm.dataForTCfApp = [];
			        }
			        else {
			            table.$('tr.selected').removeClass('selected');
			            vm.dataForTCApp = [];
			            $(this).addClass('selected');      
			            vm.dataForTCApp.push(table.row( $(this) ).data());
			        }
			    });
			}
			
			if(vm.privTC == "TCAPPV_BTN") {
				TaxOnly = true;
				$('#viewDetail tbody ').on('click', 'tr td:nth-child(14)', function () {
					var data = table.row( $(this).parents('tr') ).data();
					if(data.appvValExc != null){
						updateCatatan(vm.dvcLines, data, param.header.noDcv, param);
					}
				});
			}
			
			if(vm.privTaxItem == "TAX_ITEM") {
				TaxOnly = true;
				$('#viewDetail tbody ').on('click', 'tr td:nth-child(18)', function () {
					var data = table.row( $(this).parents('tr') ).data();
					if(data.appvValExc != null){
						updatePPH(vm.dvcLines, data, param.header.noDcv, param);
					}
				});
			}
			
		});

	}
	
	function mappingData(param) {
		vm.viewDtl = {
				noDCV		: param.header.noDcv,
				dcvId       : param.header.dcvhId,
				kodeDist	: param.header.custCode +' - '+ param.header.custName,
				region		: param.detail.masterCustomer.regionName +' | '+ param.detail.masterCustomer.areaName +' | '+ param.detail.masterCustomer.locationName,
				last		: param.header.lasStep,
				current		: param.header.currentStep,
				attach		: param.detail.attchment,
				dcv_adjust  : param.detail.dcvAdjustment,
				lookupAdj   : param.detail.lookupAdj,
				dcv_adjustTotal : param.detail.totalAdjustmentValue,
				dokumen		: param.detail.dokumen_pendukung
		}
		
		angular.forEach(vm.viewDtl.dokumen, function(value){
			//var concatDoc = value.noPO.concat("-").concat(value.noGR).concat("-").concat(value.noInvoiceAP).concat("-").concat(value.noPayment);
			var concatDoc = value;
			vm.viewDtlDoc.push(concatDoc);
		});
		
		angular.forEach(vm.viewDtl.attach, function(value){
			if(value.docType == 'BA') {
				vm.adaBA = true;
				vm.viewDtl.attach.berita_acara = value.downloadAddr;
				vm.view.berita_acara = value.description;
			}
			if(value.docType == 'RF') {
				vm.adaRF = true;
				vm.viewDtl.attach.rekap_faktur = value.downloadAddr;
				vm.view.rekap_faktur = value.description;
			}
			if(value.docType == 'KW') {
				vm.adaKwi = true;
				vm.viewDtl.attach.kwitansi = value.downloadAddr;
				vm.view.kwitansi = value.description;
			}
			if(value.docType == 'FP') {
				vm.adaFP = true;
				vm.viewDtl.attach.faktur_pajak = value.downloadAddr;
				vm.view.faktur_pajak = value.description;
			}
			if(value.docType == 'RK') {
				vm.adaRK = true;
				vm.viewDtl.attach.resi_kwitansi = value.downloadAddr;
				vm.view.resi_kwitansi = value.description;
			}
			if(value.docType == 'BP') {
				vm.adaBPP = true;
				vm.viewDtl.attach.bukti_pph = value.downloadAddr;
				vm.view.bukti_pph = value.description;
			}
		});
		param.header.totalAppvQty = 0;
		param.header.totalAppvValExcl = 0;
		param.header.totalSelisih = 0;
		param.header.totalPpnVal = 0;
		param.header.grandTotalAppvValExcl = 0;
		param.header.totalPphVal = 0;
		param.header.totalAppvNet = 0;
		
		CommonService.downloadFileAddr("/downloadFileAddr", param.header.custCode).then(
			function(result){
				vm.downloadUrl = result.data.alamat;
			}
		);
	}
	
	function terbilang(nominal) {
		var kalimat="";
	    var angka   = new Array('0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0');
	    var kata    = new Array('','Satu','Dua','Tiga','Empat','Lima','Enam','Tujuh','Delapan','Sembilan');
	    var tingkat = new Array('','Ribu','Juta','Milyar','Triliun');
	    var panjang_bilangan = nominal.length;
	    
	    /* pengujian panjang bilangan */
	    if(panjang_bilangan > 15){
	        kalimat = "Diluar Batas";
	    }else{
	        /* mengambil angka-angka yang ada dalam bilangan, dimasukkan ke dalam array */
	        for(i = 1; i <= panjang_bilangan; i++) {
	            angka[i] = nominal.substr(-(i),1);
	        }
	         
	        var i = 1;
	        var j = 0;
	         
	        /* mulai proses iterasi terhadap array angka */
	        while(i <= panjang_bilangan){
	            var subkalimat = "";
	            var kata1 = "";
	            var kata2 = "";
	            var kata3 = "";
	             
	            /* untuk Ratusan */
	            if(angka[i+2] != "0"){
	                if(angka[i+2] == "1"){
	                    kata1 = "Seratus";
	                }else{
	                    kata1 = kata[angka[i+2]] + " Ratus";
	                }
	            }
	             
	            /* untuk Puluhan atau Belasan */
	            if(angka[i+1] != "0"){
	                if(angka[i+1] == "1"){
	                    if(angka[i] == "0"){
	                        kata2 = "Sepuluh";
	                    }else if(angka[i] == "1"){
	                        kata2 = "Sebelas";
	                    }else{
	                        kata2 = kata[angka[i]] + " Belas";
	                    }
	                }else{
	                    kata2 = kata[angka[i+1]] + " Puluh";
	                }
	            }
	             
	            /* untuk Satuan */
	            if (angka[i] != "0"){
	                if (angka[i+1] != "1"){
	                    kata3 = kata[angka[i]];
	                }
	            }
	             
	            /* pengujian angka apakah tidak nol semua, lalu ditambahkan tingkat */
	            if ((angka[i] != "0") || (angka[i+1] != "0") || (angka[i+2] != "0")){
	                subkalimat = kata1+" "+kata2+" "+kata3+" "+tingkat[j]+" ";
	            }
	             
	            /* gabungkan variabe sub kalimat (untuk Satu blok 3 angka) ke variabel kalimat */
	            kalimat = subkalimat + kalimat;
	            i = i + 3;
	            j = j + 1;
	        }
	         
	        /* mengganti Satu Ribu jadi Seribu jika diperlukan */
	        if ((angka[5] == "0") && (angka[6] == "0")){
	            kalimat = kalimat.replace("Satu Ribu","Seribu");
	        }
	    }
	    
	    return kalimat;
	}
	
	function updateCatatan(detail, dataTableDetail, noDcv, param) {
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'pages/dcv/updateCatatanTC.html',
//			templateUrl: 'pages/dcv/updatePPH.html',
			controller: 'UpdateCatatanCtrl',
			controllerAs : 'vm',
			size: 'sm',
			resolve : {
				detail : function(){
	        		return detail;
	        	},
	        	dataTableDetail : function(){
	        		return dataTableDetail;
	        	},
	        	noDcv : function(){
	        		return noDcv;
	        	},
	        	param : function(){
	        		return param;
	        	}
			}
		});
	}
	
	function updatePPH(detail, dataTableDetail, noDcv, param) {
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'pages/dcv/updatePPH.html',
			controller: 'UpdatePPHCtrl',
			controllerAs : 'vm',
			size: 'sm',
			resolve : {
				detail : function(){
	        		return detail;
	        	},
	        	dataTableDetail : function(){
	        		return dataTableDetail;
	        	},
	        	noDcv : function(){
	        		return noDcv;
	        	},
	        	param : function(){
	        		return param;
	        	}
			}
		});
		
		modalInstance.result
		.then(
			function(detail){
				//console.log(JSON.stringify(detail));
//				window.history.back();
//				CommonService.showGrowl(CommonService.SUCCESS, detail);
			}
		)
	}
	
	function showModalKwitansi(nama, jumlah, terbilang, description , materai, penerima) {
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'pages/modal/modalKwitansi1.html',
			controller: 'ModalKwitansiCtrl',
			controllerAs : 'vm',
			size: 'lg',
			resolve : {
				nama : function(){
	        		return nama;
	        	},
	        	jumlah : function(){
	        		return jumlah;
	        	},
	        	terbilang : function(){
	        		return terbilang;
	        	},
	        	description : function(){
	        		return description;
	        	},materai : function(){
	        		return materai;
	        	},penerima : function(){
	        		return penerima;
	        	}
			}
		});
		
		modalInstance.result;
	}
	
	function deleteModalAdjustment(data){
		var dcvId = data.id;

		CommonService.modalAlert('confirmation', 
				'Akan delete untuk dcv adjustment id: '+data.id)
		.then(function(result) {
			var lempar =  {
					adjId : data.id
			}
		CommonService.doPost('/deleteDcvAdjustment', lempar)
		.then(
			function(data){
				if (data.id != undefined) {
					
					var pramm = {
							noDcv 	: param.header.noDcv,
							roleCode: $rootScope.userProfile.userRole 
					};
					CommonService.doPost('/getDcvBodyListForViewDetail', pramm)
					.then(function(data){
						var dataConcat = {
								header	: param.header,
								detail	: data
						}
						localStorage.setItem('dataFromMntr', JSON.stringify(param));
						$state.go('home.view-detail', {dataFromMntr: dataConcat});
						
					});
				} else {
					CommonService.modalAlert('Gagal','Data DCV Adjustment tidak ter-hapus');
				}
				
			});
		
		
		});
	}
	
	function showModalAdjustment(lookup,dcvId,noDcv,param) {
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'pages/dcv/dcvAdjustment.html',
			controller: 'ModalDcvAdjustmentCtrl',
			controllerAs : 'vm',
			size: 'lg',
			resolve : {
				lookup : function(){
					return lookup;
				},
				dcvId : function(){
					return dcvId;
				},
				noDcv : function(){
					return noDcv;
				},
				param : function(){
					return param;
				}
		
			}
			
		});
		
	}
}]);

/**MODAL CONTROLLER FOR UPDATE CATATAN TC**/
App.controller('UpdateCatatanCtrl', function ($state, $uibModalInstance, $rootScope, CommonService, detail, dataTableDetail, noDcv, param){
	var vm = this;
	
	vm.saveTo = function() {
		if(typeof vm.catatan === "undefined" || vm.catatan == ""){
			CommonService.modalAlert('Peringatan!','Catatan TC Tidak Boleh Kosong');
		}else{
			var parameter = {
					dcvhId : dataTableDetail.dcvhId,
					dcvlId : dataTableDetail.dcvlId,
					catatan: vm.catatan
			}
			CommonService.doPost('/updateCatatanPPH', parameter)
			.then(
				function(data){
					var pramm = {
							noDcv 	: noDcv,
							roleCode: $rootScope.userProfile.userRole,
							custCode: param.header.custCode
					};
					CommonService.doPost('/getDcvBodyListForViewDetail', pramm)
					.then(function(data){
						
						var prmDcvList = {
							from : param.paramDcvListAfterAction.from,
							pBagian : param.paramDcvListAfterAction.pBagian,
							pJenis : param.paramDcvListAfterAction.pJenis,
							pPeriode1 : param.paramDcvListAfterAction.pPeriode1,
							pPeriode2 : param.paramDcvListAfterAction.pPeriode2,
							pUserName : param.paramDcvListAfterAction.pUserName,
							noDcv : param.header.noDcv
						}
						CommonService.doPost('/getDcvListAfterAction', prmDcvList)
						.then(function(data1){
							var dataConcat = {
								header	: data1[0],
								detail	: data,
								paramDcvListAfterAction : param.paramDcvListAfterAction
							}
							localStorage.setItem('dataFromMntr', JSON.stringify(param));
							dismiss(); 
							$state.go('home.view-detail', {dataFromMntr: dataConcat});
						});

					});
			});
		}
		$uibModalInstance.close(detail);
	}
	
	vm.backToIndex = function(){
		dismiss();
	}
	
	function dismiss(){
		$uibModalInstance.dismiss('cancel');
	}
});


/**MODAL CONTROLLER FOR UPDATE PPH**/
App.controller('UpdatePPHCtrl', function ($state, $uibModalInstance, $rootScope, CommonService, detail, dataTableDetail, noDcv, param){
	var vm = this;
	
	/*--- Variables ---*/
	vm.pph = {};
	vm.jenisPPH = [];
	
	/*--- Function-function ---*/	
	CommonService.doPost('/getAllPPHList')
	.then(
		function(data){
			vm.jenisPPH = data;
	});
	
	vm.selectPph = function(){
		vm.pph.cal 	= (parseFloat(dataTableDetail.appvValExc) * parseFloat(vm.pph.name.persentase))/100;
	}
	
	vm.saveTo = function() { 
		//console.log(vm.pph.nilai);
		if(typeof vm.pph.nilai === "undefined" || vm.pph.nilai == ""){
			CommonService.modalAlert('Peringatan!','Nilai PPH Tidak Boleh Kosong');
		}else{
			var parameter = {
					dcvhId : dataTableDetail.dcvhId,
					dcvlId : dataTableDetail.dcvlId,
					pphCode: vm.pph.name.kodePPH,
					pphVal : vm.pph.nilai
			}
			CommonService.doPost('/updateCatatanPPH', parameter)
			.then(
				function(data){
					var pramm = {
							noDcv 	: noDcv,
							roleCode: $rootScope.userProfile.userRole,
							custCode: param.header.custCode
					};
					CommonService.doPost('/getDcvBodyListForViewDetail', pramm)
					.then(function(data){
						
						var prmDcvList = {
							from : param.paramDcvListAfterAction.from,
							pBagian : param.paramDcvListAfterAction.pBagian,
							pJenis : param.paramDcvListAfterAction.pJenis,
							pPeriode1 : param.paramDcvListAfterAction.pPeriode1,
							pPeriode2 : param.paramDcvListAfterAction.pPeriode2,
							pUserName : param.paramDcvListAfterAction.pUserName,
							noDcv : param.header.noDcv
						}
						CommonService.doPost('/getDcvListAfterAction', prmDcvList)
						.then(function(data1){
							var dataConcat = {
								header	: data1[0],
								detail	: data,
								paramDcvListAfterAction : param.paramDcvListAfterAction
							}
							localStorage.setItem('dataFromMntr', JSON.stringify(param));
							dismiss();
							$state.go('home.view-detail', {dataFromMntr: dataConcat});
						});

					});
			});
		}
		$uibModalInstance.close(detail);

	}
	
	vm.backToIndex = function(){
		dismiss();
	}
	
	function dismiss(){
		$uibModalInstance.dismiss('cancel');
	}
});

/**MODAL CONTROLLER FOR KWITANSI**/
App.controller('ModalKwitansiCtrl', function ($uibModalInstance, CommonService, nama, jumlah, terbilang, description, materai, penerima){
	var vm = this;
	if(nama == 'FDI'){
		vm.nama = 'PT Focus DIstribusi Indonesia';
	}else if(nama == 'FDN'){
		vm.nama = 'PT Focus Distribusi Nusantara';
	}else{
		vm.nama = nama;
	}
	vm.jumlah = jumlah;
	vm.terbilang = terbilang;
	vm.description = description;
	vm.materai = materai;
	vm.penerima = penerima;
	
	vm.backToIndex = function(){
		dismiss();
	}
	
	function dismiss(){
		$uibModalInstance.dismiss('cancel');
	}
});

App.controller('ModalDcvAdjustmentCtrl', function ($state , $uibModalInstance, CommonService,lookup,dcvId,noDcv,param){
	var vm = this;
	
	vm.param = param;
	vm.lookup = lookup;
	vm.dcvId = dcvId;
	vm.noDcv = noDcv;
	var grandTotalValue = 0;
	vm.prepareDataToSave = [];
	vm.dataForSaveAdj = {};
	
	var table = null;
	vm.adjId = null;
	vm.dataAdjust;
	
	/*function - function*/
	init();
	
	vm.saveAdj = function() {
		submit2Server(vm.dcvAdj,dcvId);
	}
	
	vm.backToIndex = function(){
		dismiss();
	}
	
	function dismiss(){
		$uibModalInstance.dismiss('cancel');
	}
	
	function submit2Server(data,dcvId) {
		var lempar = {
			pValue: vm.dcvAdj.value,
			pActionId: vm.dcvAdj.action.value,
			pdcvId: dcvId,
			pNote: vm.dcvAdj.noteAdj
		}
		CommonService.doPost('/savingDcvAdjustment', lempar)
		.then(
			function(data){
				if(data.id != undefined && data.dcvhId != undefined 
						&& data.adjType != undefined && data.nilai != undefined){
					
					var pramm = {
							noDcv 	: vm.noDcv,
							roleCode: $rootScope.userProfile.userRole 
					};
					CommonService.doPost('/getDcvBodyListForViewDetail', pramm)
					.then(function(data){
						var dataConcat = {
								header	: param.header,
								detail	: data
						}
						localStorage.setItem('dataFromMntr', JSON.stringify(param));
						dismiss();
						$state.go('home.view-detail', {dataFromMntr: dataConcat});
						
						//mappingData(param)
					});
				} else {
					CommonService.modalAlert('Gagal','Data DCV Adjustment gagal ter-update');
					dismiss();
				}
				
			});
	}
	
	vm.tambahAdj = function() {
		
		table = $('#dcvAdjustmentTabel').DataTable({
			"retrieve": true,
			"paging": false,
			"searching": false,
			"info": false,
			"sort": false,
			"scrollX": "100%",
			"footerCallback": function ( row, data, start, end, display ) {
				var api = this.api(), data;
				$( api.column( 0 ).footer() ).html('total_adj:');
				$( api.column( 3 ).footer() ).html(grandTotalValue);
				
			},
		});
		
		var rowData = [];
		var info = table.page.info();
		
		var index = info.recordsTotal+1;
		rowData.push('<div><button type="button" id="deleteAdj'+index+'" class="mr btn btn-danger btn-xs" data-toggle="tooltip" title="Hapus"><i class="fa fa-trash"></i></button></div>');
		rowData.push('<div><select id="typeAdj'+index+'" class="form-control input-sm"></select></div>');
		rowData.push('<div><input type="text" id="noteAdj'+index+'" class="form-control pull-center input-sm" size="30"></div>');
		rowData.push('<div><input type="text" id="valueAdj'+index+'" class="form-control pull-center input-sm" size="30"></div>');
		table.row.add(rowData).draw( false );
		
		$("#typeAdj"+index).append($('<option>', {
		    value: 0,
		    text: '--Pilih--'
		}));
		
		angular.forEach(vm.lookup, function(value, key){
		    $("#typeAdj"+index).append($('<option>', { 
		        value: value,
		        text : key 
		    }));
		});
		
		$( "#valueAdj"+index ).on( 'blur', function () {
			vm.prepareDataToSave.splice(index-1, 1);
			var hasilValue = 0;
			var iNum = parseFloat($( "#valueAdj"+index ).val());
			
			for(var i=1; i<=index; i++){
				hasilValue = hasilValue + parseFloat($( "#valueAdj"+i ).val());
			}
			grandTotalValue = hasilValue;
			
			$('.dataTables_scrollFootInner th[id=gtValueAdj]').html(grandTotalValue);
			
			var dataForSaveAdj = {
					index : index,
					dcvhId : vm.dcvId ,
					adjType : $( "#typeAdj"+index ).val(),
					nilai :  $( "#valueAdj"+index ).val(),
					notes :   $( "#noteAdj"+index ).val()
					
			}
			vm.prepareDataToSave.push(dataForSaveAdj);
		});
		
		$( "#deleteAdj"+index ).on('click', function() {
			grandTotalValue = grandTotalValue - parseFloat($( "#valueAdj"+index ).val());
			$('.dataTables_scrollFootInner th[id=gtValueAdj]').html(grandTotalValue);
			
			if(vm.prepareDataToSave.length > 0) {
				for(var i=0; i<vm.prepareDataToSave.length; i++) {
					if($( "#typeAdj"+index ).val() == vm.prepareDataToSave[i].adjType &&
							$( "#valueAdj"+index ).val() == vm.prepareDataToSave[i].nilai &&
							$( "#noteAdj"+index ).val() == vm.prepareDataToSave[i].notes ) {
						vm.prepareDataToSave.splice(i, 1);
					}
				}
			}
			table.row($(this).parents('tr')).remove().draw(false);
		});
	}
	
	vm.simpanAdj = function() {
		//console.log("data yg akan di save:"+ JSON.stringify(vm.prepareDataToSave));
		if(vm.prepareDataToSave.length > 0) {
			CommonService.modalAlert('confirmation', 'Yakin untuk di simpan?')
	        .then(function(result) {
	        	CommonService.doPost('/savingDcvAdjustment', vm.prepareDataToSave)
	    		.then(function(data){
	    			
	    			if(data.id != undefined && data.dcvhId != undefined 
							&& data.adjType != undefined && data.nilai != undefined){
	    				
	    				var pramm = {
								noDcv 	: vm.noDcv,
								roleCode: $rootScope.userProfile.userRole 
						};
						CommonService.doPost('/getDcvBodyListForViewDetail', pramm)
						.then(function(data){
							var dataConcat = {
									header	: param.header,
									detail	: data
							}
							localStorage.setItem('dataFromMntr', JSON.stringify(param));
							dismiss();
							$state.go('home.view-detail', {dataFromMntr: dataConcat});
							
							//mappingData(param)
						});
					} else {
						CommonService.modalAlert('Gagal','Data DCV Adjustment gagal ter-update');
						dismiss();
					}
				
	    		});
	        });
		}
	}
	
	vm.deleteData = function(data) {
		var dcvId = data.id;		
		
		CommonService.modalAlert('confirmation', 
				'Akan delete untuk dcv adjustment id: '+data.id)
		.then(function(result) {
			var lempar =  {
					adjId : data.id ,
					dcvhId : vm.dcvId
			}
		CommonService.doPost('/deleteDcvAdjustment', lempar)
		.then(
			function(data){
				if (data.id != undefined) {
					
					var pramm = {
							noDcv 	: param.header.noDcv,
							roleCode: $rootScope.userProfile.userRole 
					};
					CommonService.doPost('/getDcvBodyListForViewDetail', pramm)
					.then(function(data){
						var dataConcat = {
								header	: param.header,
								detail	: data
						}
						localStorage.setItem('dataFromMntr', JSON.stringify(param));
						dismiss();
						$state.go('home.view-detail', {dataFromMntr: dataConcat});
						
					});
				} else {
					CommonService.modalAlert('Gagal','Data DCV Adjustment tidak ter-hapus');
				}
				
			});
		
		});
	}
	
	function init() {

		vm.dataAdjust = param.detail.dcvAdjustment;
		table = $('#dcvAdjustmentTabel').DataTable({
			"data" : param.detail.dcvAdjustment,
			"columns": [
				{ "data": '<div><button type="button" id="deleteAdj" class="mr btn btn-danger btn-xs" data-toggle="tooltip" title="Hapus"><i class="fa fa-trash"></i></button></div>'},
				{ "data": "adjType" },
				{ "data": "nilai" },
				{ "data": "notes" }
			],
			"retrieve": true,
			"paging": false,
			"searching": false,
			"info": false,
			"sort": false,
			"scrollX": "100%",
		});
		
	}
	
});