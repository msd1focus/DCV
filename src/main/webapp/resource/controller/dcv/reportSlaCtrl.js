'use strict';

App.controller('ReportSlaController', ['CommonService', '$state', '$stateParams', '$rootScope', function(CommonService, $state, $stateParams, $rootScope) {
	var vm = this;
	
	/*--- Variables ---*/
	vm.sla 			= {};
	vm.sladist 		= {};
	vm.prmFormula 	= [];
	vm.prmPeriode 	= [];
	vm.prmLayout	= [];
	vm.prmDevisi	= [];
	vm.roleUser     = $rootScope.userProfile.userRole;
	vm.dateOptions 	= CommonService.generalDateOptions;
	vm.popup 		= {};
	var dataRegion	= [];
	var availableTags = [
	      "ActionScript",
	      "AppleScript",
	      "Asp",
	      "BASIC",
	      "C",
	      "C++",
	      "Clojure",
	      "COBOL",
	      "ColdFusion",
	      "Erlang",
	      "Fortran",
	      "Groovy",
	      "Haskell",
	      "Java",
	      "JavaScript",
	      "Lisp",
	      "Perl",
	      "PHP",
	      "Python",
	      "Ruby",
	      "Scala",
	      "Scheme"
	    ];
	
	/*--- Function-function ---*/
	init();
	
	vm.open = function(numberOrder) {
		CommonService.openDatePicker(numberOrder, vm.popup);
	}
	
	vm.submitInter = function() {		
		
		if(typeof vm.sla.distributorstart === "undefined" || vm.sla.distributorstart == ""){
			Swal.fire({
				icon: 'warning',
				html: '<p>Distributor Start tidak boleh kosong</p>'
			})
		}else if(typeof vm.sla.distributorend === "undefined" || vm.sla.distributorend == ""){
			Swal.fire({
				icon: 'warning',
				html: '<p>Distributor End tidak boleh kosong</p>'
			})
		}else if(typeof vm.sla.jenisformula === "undefined"){
			Swal.fire({
				icon: 'warning',
				html: '<p>Jenis Formula tidak boleh kosong</p>'
			})
		}else if(typeof vm.periodestart === "undefined"){
			Swal.fire({
				icon: 'warning',
				html: '<p>Periode tidak boleh kosong</p>'
			})
		}else if(typeof vm.sla.jenisperiode === "undefined"){
			Swal.fire({
				icon: 'warning',
				html: '<p>Jenis Periode tidak boleh kosong</p>'
			})
		}else if(typeof vm.sla.layout === "undefined"){
			Swal.fire({
				icon: 'warning',
				html: '<p>Layout tidak boleh kosong</p>'
			})
		}else if(typeof vm.sla.devisi === "undefined"){
			Swal.fire({
				icon: 'warning',
				html: '<p>Devisi tidak boleh kosong</p>'
			})
		}else{
			var today = new Date(vm.periodestart);
			var mm = String(today.getMonth() + 1).padStart(2, '0');
			var yyyy = today.getFullYear();
			
			var param = {
					region				: vm.sla.region,
					area				: vm.sla.area,
					location			: vm.sla.location,
					distributorstart	: vm.sla.distributorstart,
					distributorend		: vm.sla.distributorend,
					jenisformula 		: vm.sla.jenisformula.PARAM_VALUE,
					jenisperiode		: vm.sla.jenisperiode.PARAM_VALUE,
					periodestart		: yyyy+mm,
					//periodeend			: vm.sla.periodeend,
					layout				: vm.sla.layout.PARAM_VALUE,
					devisi				: vm.sla.devisi.PARAM_VALUE
			}

			CommonService.doPost('/getUrlLinkReportSla', param) 
			.then(
				function(data){
					window.open(data.urlExt,'_blank');
				}
			);
		}
	}
	
	vm.submitDist = function(){
		
		if(typeof vm.periodestartdist === "undefined"){
			Swal.fire({
				icon: 'warning',
				html: '<p>Periode tidak boleh kosong</p>'
			})
		}else{
			var today = new Date(vm.periodestartdist);
			var mm = String(today.getMonth() + 1).padStart(2, '0');
			var yyyy = today.getFullYear();
			//vm.sladist.periodestartdist = yyyy+mm;
			var param = {
					distributorstart	: $rootScope.userProfile.userName,
					distributorend		: $rootScope.userProfile.userName,
					jenisformula 		: "Distributor",
					jenisperiode		: "Pelunasan",
					periodestartdist	: yyyy+mm,
					layout				: "Detail",
					devisi				: $rootScope.userProfile.userDivision
			}

			CommonService.doPost('/getUrlLinkReportSla', param) 
			.then(
				function(data){
					window.open(data.urlExt,'_blank');
				}
			);
		}
	}
	
	vm.region = function(){
		$("input[id=region]" ).autocomplete({
			source: availableTags
		});
	}
	
	function mappingJenisFormula() {
		vm.prmFormula = [
			{ "PARAM_NAME": "Focus", "PARAM_VALUE": "Focus" },
			{ "PARAM_NAME": "Distributor", "PARAM_VALUE": "Distributor" }
		]
	}
	
	function mappingJenisPeriode() {
		vm.prmPeriode = [
			{ "PARAM_NAME": "Keterlambatan", "PARAM_VALUE": "Keterlambatan" },
			{ "PARAM_NAME": "Pelunasan", "PARAM_VALUE": "Pelunasan" }
		]
	}
	
	function mappingLayout() {
		vm.prmLayout = [
			{ "PARAM_NAME": "Ringkas", "PARAM_VALUE": "Ringkas" },
			{ "PARAM_NAME": "Detail", "PARAM_VALUE": "Detail" }
		]
	}
	
	function mappingDevisi() {
		vm.prmDevisi = [
			{ "PARAM_NAME": "Food", "PARAM_VALUE": "Food" },
			{ "PARAM_NAME": "Non Food", "PARAM_VALUE": "NonFood" },
			{ "PARAM_NAME": "All", "PARAM_VALUE": "All" }
		]
	}
	
	function init() {
		mappingJenisFormula();
		mappingJenisPeriode();
		mappingLayout();
		mappingDevisi();
		if(vm.roleUser == 'ROLE_DISTRIBUTOR'){
			$('#internalSla').hide();
		}else{
			$(	'#distSla').hide();
		}
		
		$('#area').css('cursor', 'pointer');
		$('#location').css('cursor', 'pointer');
		
		CommonService.doPost('/getRegion')
		.then(function(data){
			$('#region').autocomplete({
				source: data.record
			}).on('blur', function(){
				
				if($('#region').val() != "" && $('#region').val().length > 5){
					$('#area').prop( "disabled", false );
					var region = $(this).val();
					CommonService.doPost('/getArea', region).then(function(data){
						$('#area').autocomplete({
							source: data.record
						}).on('blur', function(){
							
							if($('#area').val() != "" && $('#area').val().length > 5){
								$('#location').prop( "disabled", false );
								var param = {
										region : $('#region').val(),
										area : $(this).val()
								}
								
								CommonService.doPost('/getLocation', param).then(function(data){
									$('#location').autocomplete({
										source: data.record
									})
								});
							}else{
								$('#location').prop( "disabled", true );
							}
							
						});
					});
				}else{
					$('#area').prop( "disabled", true );
				}
			});
		});
		
		CommonService.doPost('/getDistributorSla').then(function(data){
			$('#distributor_start').autocomplete({
				source: data.record
			});
			$('#distributor_end').autocomplete({
				source: data.record
			});
		});
		
		
	}
	
}]);