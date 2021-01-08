'use strict';

var $stateProviderRef = null;

var App = angular.module('myApp',['ui.router', 'oc.lazyLoad', 'ui.bootstrap', 'ngCookies', 'treeGrid', 'chart.js',
	'ngMaterial', 'ngStorage', 'angular-growl', 'ngAnimate', 'angular-loading-bar', 'mwl.calendar', 'ngFileUpload', 
	'ivh.treeview', 'ngIdle', 'ng-currency', 'datatables', 'datatables.columnfilter', 'datatables.fixedcolumns']);

App.config(['$stateProvider', '$httpProvider', '$locationProvider', '$urlRouterProvider', '$controllerProvider', 
		'$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'ivhTreeviewOptionsProvider',
         function ($stateProvider, $httpProvider, $locationProvider, $urlRouterProvider, $controllerProvider, 
        		 $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, ivhTreeviewOptionsProvider){
	
	App.controller = $controllerProvider.register;
    App.directive = $compileProvider.directive;
    App.filter = $filterProvider.register;
    App.factory = $provide.factory;
    App.service = $provide.service;
    App.constant = $provide.constant;
    App.value = $provide.value;
    
    /**ivh.treeview tree view**/
    ivhTreeviewOptionsProvider.set({
    	twistieCollapsedTpl: '<span class="icon-plus  glyphicon glyphicon-plus  fa fa-plus"></span>',
  	  	twistieExpandedTpl: '<span class="icon-minus glyphicon glyphicon-minus fa fa-minus"></span>',
  	  	twistieLeafTpl: ''
    });
    
}]);

/**ng-idle**/
App.config(['KeepaliveProvider', 'IdleProvider', function(KeepaliveProvider, IdleProvider) {
  IdleProvider.idle(5);	// in seconds will be overrided with parameter
  IdleProvider.timeout(0);	// in seconds disable it
  KeepaliveProvider.interval(10);	//in seconds not used
}]);

App.run(function($rootScope, $urlRouter, $localStorage, CommonService, $state, HttpServices){
	
	//create recent
	$rootScope.$on('$stateChangeSuccess', 
		function(event, toState, toParams, fromState, fromParams, options){
			CommonService.createRecent(toState, toParams);
		}
	)
	
	/**
	 * fired when the transition begins.
	 */
	$rootScope.$on('$stateChangeStart',
		function(event, toState, toParams, fromState, fromParams, options){
			if(toState.data != undefined
				&& !toState.data.byPass){
				var toLink = $state.href(toState.name, toParams);
				var menus = CommonService.getMenus();
				if(menus.indexOf(toLink) < 0){
					event.preventDefault();
				}
				//tambahan search untuk report agar saat klik detail bisa (klik back) bisa balik ke tampilan hasil search
				switch (toState.data.id) {
					case 'report_sknbi_trx_retur':
						
						break;
					case 'report-sknbi-trx':
						
						break;
						
					case 'report_sknbi_trx_gagal':
						
						break;
	
					default:
						break;
				}
					
			}
		}
	)
	
	/**
	 * start invokes logout when idle
	 */
	$rootScope.$on('IdleStart', function() {
		HttpServices.logout()
		.then(
			function(data){
				$state.go('login');
			}
		);
    });
	
});
