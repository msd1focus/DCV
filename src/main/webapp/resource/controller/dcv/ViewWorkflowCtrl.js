'use strict';

App.controller('ViewWorkflowController', ['$window', '$state', 'CommonService', 'DTOptionsBuilder', '$stateParams', '$timeout',
				function($window, $state, CommonService, DTOptionsBuilder, $stateParams,$timeout) {
	
	var vm = this;
	
	/*--- Variables ---*/
	var param = $stateParams.dataFromDetail;
	var urlBefore = $stateParams.urlBefore;
	vm.viewWf = {};
	
	/*--- Function-function ---*/
	$timeout(function() {
		init();
	}, 10);
	
	vm.back = function() {
		$state.go(urlBefore);
	}
	
	function init() {
		//Mapping data header
		vm.viewWf = {
				noPC	: param.header.noDcv,
				kodeDist: param.header.custCode +' | '+ param.header.custName,
				region	: param.header.region +' | '+ param.header.area +' | '+ param.header.location,
				last	: param.header.lasStep,
				current	: param.header.currentStep,
				total_DCV: param.detail.totalDcv,
				total_pay: param.detail.totalPayment,
				sisa	: param.detail.sisa
		}
		console.log("param.detail : ",param.detail);
		
		//Table 1
		$('#workflow').DataTable({
			 "data": param.detail.flagA,
			 "columns": [
				 { "data": "no" },
				 { "data": "tahapan" },
				 { "data": "username" },
				 { "data": "jmlTargetSla" },
				 { "data": "targetDateStr" },
				 { "data": "proDateDay" },
				 { "data": "proDate" },
				 { "data": "proDateHour" },
				 { "data": "note",
					/* "render": function (data, type, row) {
						 return '<textarea id="prodVariant" cols="20" style="border: none" disabled>'+data+'</textarea>'
					 }*/
				 },
				 { "data": "durationDays" },
				 { "data": "durationHours" },
				 { "data": "durationMinutes" },
				 { "data": "durationSeconds" }
			],
			"paging": false,
			"searching": false,
			"info": false,
			"sort": false,
			"scrollX": true,
			"autoWidth" : true,
			"responsive": true,
			"rowCallback": function( row, data, index ) {
			  if(parseFloat(data.processDate) > parseFloat(data.targetDate)){
				  $('td', row).css('color', '#dd4b39');
			  }
		        $('td', row).css('font-size', '12px');
			}
		});		
		
		// Total table 1
		CommonService.doPost('/getPaymentSummary', param.header.noDcv)
		.then(function(data){
			$('label[id=totDCV]').text(data.dataPay.totalDcv);
			$('label[id=totPay]').text(data.dataPay.totalPayment);
			$('label[id=totSisa]').text(data.dataPay.nilaiSisa);
			if(data.dataPay.nilaiSisa == 0 && data.dataPay.totalDcv > 0){
				$('label[id=prosesComp]').text("DCV PROCESS - COMPLETED DONE");
			}else{
				$('label[id=prosesComp]').text("");
			}
		});
		
		// Table 2
		$('#paymentEbsHistFix').DataTable({
			 "data": param.detail.flagC,
			 "columns": [
				 { "data": "no" },
				 { "data": "tahapan" },
				 { "data": "username" },
				 { "data": "jmlTargetSla" },
				 { "data": "targetDateStr" },
				 { "data": "proDateDay" },
				 { "data": "proDate" },
				 { "data": "proDateHour" },
				 { "data": "note"},
				 { "data": "durationDays" },
				 { "data": "durationHours" },
				 { "data": "durationMinutes" },
				 { "data": "durationSeconds" }
			],
			"paging": false,
			"searching": false,
			"info": false,
			"sort": false,
			"scrollX": true,
			"autoWidth" : true,
			"fnInitComplete": function(oSettings) {
                        $( window ).resize();
             },
			"fnDrawCallback": function(oSettings) {
			      $( window ).trigger('resize');
			 },
			"rowCallback": function( row, data, index ) {
			  if(parseFloat(data.processDate) > parseFloat(data.targetDate)){
				  $('td', row).css('color', '#dd4b39');
			  }
		        $('td', row).css('font-size', '12px');
			}
		});
		
		// Footer table 2
		$('label[id=flagD10]').text(param.detail.flagD[0].note);
		$('label[id=flagD11]').text(param.detail.flagD[0].durationDays);
		$('label[id=flagD12]').text(param.detail.flagD[0].durationHours);
		$('label[id=flagD13]').text(param.detail.flagD[0].durationMinutes);
		$('label[id=flagD14]').text(param.detail.flagD[0].durationSeconds);
		
		$('label[id=flagD20]').text(param.detail.flagD[1].note);
		$('label[id=flagD21]').text(param.detail.flagD[1].durationDays);
		$('label[id=flagD22]').text(param.detail.flagD[1].durationHours);
		$('label[id=flagD23]').text(param.detail.flagD[1].durationMinutes);
		$('label[id=flagD24]').text(param.detail.flagD[1].durationSeconds);
		
//		CommonService.doPost('/getPaymentEbsHist', param.header.noDcv)
//		.then(function(data){
//			console.log("ebs hist : ", data);
//			$('#paymentEbsHist').DataTable({
//				 "data": data,
//				 "columns": [
//					 { "data": "no" },
//					 { "data": "step" },
//					 { "data": "username" },
//					 { "data": "slaHari" },
//					 { "data": "formatTargetDate" },
//					 { "data": "hari" },
//					 { "data": "formatTanggal" },
//					 { "data": "jam" },
//					 { "data": "catatan" },
//					 { "data": "jmlHari"},
//					 { "data": "jmlJam" },
//					 { "data": "jmlMenit" },
//					 { "data": "jmlDetik" }
//				],
//				"paging": false,
//				"searching": false,
//				"info": false,
//				"sort": false,
//				"rowCallback": function( row, data, index ) {
//				  if(parseFloat(data.processDate) > parseFloat(data.targetDate)){
//					  $('td', row).css('color', '#dd4b39');
//				  }
//			        $('td', row).css('font-size', '12px');
//				}
//			});
//		});
	}
}]);
