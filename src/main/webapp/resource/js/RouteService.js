/**util**/
function createMetaDataLink(id, viewName, logAble, sendState, byPass){
	return {id : id, viewName : viewName, logAble : logAble, sendState : sendState, byPass};
}

App.config(['$stateProvider', '$urlRouterProvider', '$uiViewScrollProvider',
		function($stateProvider, $urlRouterProvider, $uiViewScrollProvider){
	
	$stateProviderRef = $stateProvider;
	
	$urlRouterProvider.otherwise("/login");
	$uiViewScrollProvider.useAnchorScroll();
	$stateProvider
	
	/**by pass**/
	.state('login', {
		url: "/login",
		templateUrl: 'pages/login3.html',
		controller : 'LoginController',
		controllerAs : 'vm',
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/LoginCtrl.js');
			}]
		},
		data : createMetaDataLink("login","login", false, false, true)
	})
	
	.state('logout', {
		url: "/logout",
		controller : 'LogoutController',
		controllerAs : 'vm',
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/LogoutCtrl.js');
			}]
		},
		data : createMetaDataLink("logout","logout", false, false, true)
	})
	
	.state('home', {
		abstract : true,
		url: "/home",
		templateUrl: 'pages/dcv/home2.html',
		resolve: {
			parentCtrl: ['$ocLazyLoad','CommonService', '$cookies', '$localStorage', '$rootScope', '$state', '$q', '$timeout', '$http',
			       function ($ocLazyLoad, CommonService, $cookies, $localStorage, $rootScope, $state, $q, $timeout, $http) {
				var token = $cookies.get(CommonService.TOKEN);
//				if(CommonService.isEmpty(token)){
//					$rootScope.authenticated = false;
//					var defer = $q.defer();
//					$timeout(function () {
//						$state.go('login');
//					});
//					return deferred.reject({redirectTo: 'login'});
//				}
//				else{
//					if(CommonService.isEmpty(sessionStorage.userProfile)){
//						var userLogin = {};
//						userLogin.username = $cookies.get(CommonService.USERNAME);
//						return CommonService.doPost('/login', userLogin)
//						.then(
//							function(data){
//								if (data != undefined 
//										&& data.userProfile != undefined
//										&& data.userProfile.isValid == "true"){
//										CommonService.populateValidData(data.userProfile);
//								} else {
//									//redirect to logout to destroy all cookies
//									$rootScope.authenticated = true; //set default to true, it will be false in the logoutCtrl
//									$state.go('logout');
//								}
//								return $ocLazyLoad.load('resource/controller/HomeCtrl.js');
//							},
//							function(){ //if failed
//								$rootScope.authenticated = false;
//								return $ocLazyLoad.load('resource/controller/HomeCtrl.js');
//							}
//						);
//					}
//					else{
//						CommonService.getUserProfile();
						$rootScope.authenticated = true;
						return $ocLazyLoad.load('resource/controller/HomeCtrl.js');
//					}
//				}
			}]
		}
	})
	
	.state('home.param', {
		url: "/param",
		templateUrl: 'pages/dcv/paramList.html',
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/ParamListCtrl.js');
			}]
		},
		data : createMetaDataLink("param","param", false, false, false)
	})
	
	.state('home.param-add', {
		url: "/param-add/:PARAM_ID/:STATE",
		templateUrl: 'pages/paramadd.html',
        params: {
        	dataParam:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/ParamAddCtrl.js');
			}]
		},
		data : createMetaDataLink("param_add","param_add", false, false, true)
	})
	
	.state('home.user', {
		url: "/user",
		templateUrl: 'pages/dcv/userDCVList.html',
		resolve: {
			ctrl: ['parentCtrl','$ocLazyLoad', function (parentCtrl, $ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/UserDCVListCtrl.js');
			}]
		},
		data : createMetaDataLink("user","user", false, false, false)
	})
	
	.state('home.user-add', {
		url: "/user-add",
		templateUrl: 'pages/dcv/userDcvUpload.html',
		resolve: {
			ctrl: ['parentCtrl','$ocLazyLoad', function (parentCtrl, $ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/UserDcvUploadCtrl.js');
			}]
		},
		data : createMetaDataLink("user_add","user_add", false, false, true)
	})
	
	.state('home.user-update', {
		url: "/user-update",
		templateUrl: 'pages/dcv/userDcvUpdate.html',
		params: {
        	dataUserEdit:null
        },
		resolve: {
			ctrl: ['parentCtrl','$ocLazyLoad', function (parentCtrl, $ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/UserDcvUpdateCtrl.js');
			}]
		},
		data : createMetaDataLink("user_add","user_add", false, false, true)
	})
	
	.state('home.user-role', {
		url: "/user-role",
		templateUrl: 'pages/dcv/userRoleList.html',
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/UserRoleListCtrl.js');
			}]
		},
		data : createMetaDataLink("user_role","user_role", false, false, false)
	})
	
	.state('home.user-role-add', {
		url: "/user-role-add/:USER_ID/:STATE",
		templateUrl: 'pages/dcv/userRoleAdd.html',
        params: {
        	dataUserRole:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/UserRoleAddCtrl.js');
			}]
		},
		data : createMetaDataLink("user_role_add","user_role_add", false, false, true)
	})
	
	.state('home.role', {
		url: "/role",
		templateUrl: 'pages/dcv/roleList.html',
		resolve: {
			ctrl: ['parentCtrl', '$ocLazyLoad', function (parentCtrl, $ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/RoleListCtrl.js');
			}]
		},
		data : createMetaDataLink("","", false, false, true, false)
	})
	
	.state('home.role-add', {
		url: "/role-add/:ROLE_ID/:STATE",
		templateUrl: 'pages/dcv/roleAdd.html',
        params: {
        	dataRole:null
        },
		resolve: {
			ctrl: ['parentCtrl','$ocLazyLoad', function (parentCtrl, $ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/RoleAddCtrl.js');
			}]
		},
		data : createMetaDataLink("role_add","role_add", false, false, true)
	})
	
	.state('home.reset-password', {
		url: "/resetPassword",
		templateUrl: 'pages/resetPassword.html',
		controller : "ResetPasswordController",
		controllerAs : 'vm',
		resolve: {
			ctrl: ['parentCtrl','$ocLazyLoad', function (parentCtrl, $ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/ResetPasswordCtrl.js');
			}]
		},
		data : createMetaDataLink("reset_password","reset_password", false, false, true)
	})
	
	//For DCV Static
	.state('home.staticDashboard', {
		url: '/staticDashboard',
		templateUrl: 'pages/dcv/staticDashboard.html',
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/StaticDashboradCtrl.js');
			}]
		},
		data : createMetaDataLink("static-dashboard","static-dashboard", false, false, false)
	})
	
	.state('home.disposisi', {
		url: '/disposisi',
		templateUrl: 'pages/dcv/disposisi.html',
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/DisposisiCtrl.js');
			}]
		},
		data : createMetaDataLink("disposisi","disposisi", false, false, false)
	})
	
	.state('home.view-workflow', {
		url: '/viewWorkflow',
		templateUrl: 'pages/dcv/viewWorkflow.html',
		params: {
        	dataFromDetail:null,
        	urlBefore:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/ViewWorkflowCtrl.js');
			}]
		},
		data : createMetaDataLink("view-workflow","view-workflow", false, false, false)
	})
	
	.state('home.view-detail', {
		url: '/viewDetail',
		templateUrl: 'pages/dcv/viewDetail.html',
		params: {
        	dataFromMntr:null,
        	urlBefore:null,
        	dataInputBefore:null,
        	dataDetailBefore:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/ViewDetailCtrl.js');
			}]
		},
		data : createMetaDataLink("view-detail","view-detail", false, false, false)
	})
	
	.state('home.action-tc', {
		url: '/actionTc',
		templateUrl: 'pages/dcv/actionTc.html',
		params: {
        	dataFromViewDetail:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/ActionTcCtrl.js');
			}]
		},
		data : createMetaDataLink("action-tc","action-tc", false, false, false)
	})
	
	.state('home.action-dist', {
		url: '/actionDistributor',
		templateUrl: 'pages/dcv/actionDist.html',
		params: {
        	dataFromViewDetail:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/ActionDistCtrl.js');
			}]
		},
		data : createMetaDataLink("action-dist","action-dist", false, false, false)
	})
	
	.state('home.action-sales', {
		url: '/actionSales',
		templateUrl: 'pages/dcv/actionSales.html',
		params: {
        	dataFromViewDetail:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/ActionSalesCtrl.js');
			}]
		},
		data : createMetaDataLink("action-sales","action-sales", false, false, false)
	})
	
	.state('home.action-ar', {
		url: '/actionAR',
		templateUrl: 'pages/dcv/actionAR.html',
		params: {
        	dataFromViewDetail:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/ActionARCtrl.js');
			}]
		},
		data : createMetaDataLink("action-ar","action-ar", false, false, false)
	})
	
	.state('home.action-ap', {
		url: '/actionAP',
		templateUrl: 'pages/dcv/actionAP.html',
		params: {
        	dataFromViewDetail:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/ActionAPCtrl.js');
			}]
		},
		data : createMetaDataLink("action-ap","action-ap", false, false, false)
	})
	
	.state('home.action-promo', {
		url: '/actionPromo',
		templateUrl: 'pages/dcv/actionPromo.html',
		params: {
        	dataFromViewDetail:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/ActionPromoCtrl.js');
			}]
		},
		data : createMetaDataLink("action-pr","action-pr", false, false, false)
	})
	
	.state('home.action-tax', {
		url: '/actionTax',
		templateUrl: 'pages/dcv/actionTax.html',
		params: {
        	dataFromViewDetail:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/ActionTaxCtrl.js');
			}]
		},
		data : createMetaDataLink("action-tax","action-tax", false, false, false)
	})
	
	.state('home.rollback', {
		url: '/rollback',
		templateUrl: 'pages/dcv/rollback.html',
		params: {
        	dataFromViewDetail:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/RollbackCtrl.js');
			}]
		},
		data : createMetaDataLink("rollback","rollback", false, false, false)
	})
	
	.state('home.rollbackList', {
		url: '/rollbackList',
		templateUrl: 'pages/dcv/rollbackList.html',
		params: {
        	dataFromViewDetail:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/RollbackCtrl.js');
			}]
		},
		data : createMetaDataLink("rollback","rollback", false, false, false)
	})
	
	.state('home.tc-approval', {
		url: '/tcApproval',
		templateUrl: 'pages/dcv/tcApproval.html',
		params: {
        	dataFromViewDetail:null,
        	dataForBackViewDetail:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/TcApprovalCtrl.js');
			}]
		},
		data : createMetaDataLink("tc-approval","tc-approval", false, false, false)
	})
	
	.state('home.newDCVForm-add',{
		url: '/newDCVForm-add',
		templateUrl: 'pages/dcv/newDCVFormAdd.html',
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/NewDCVFormAddCtrl.js');
			}]
		},
		data : createMetaDataLink("newDCVForm_add","newDCVForm_add", false, false, false)
	})
	
	.state('home.newDCVForm-term',{
		url: '/newDCVForm-term',
		templateUrl: 'pages/dcv/newDCVFormTerm.html',
		params: {
        	dataFromAdd:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/NewDCVFormTermCtrl.js');
			}]
		},
		data : createMetaDataLink("newDCVForm_term","newDCVForm_term", false, false, false)
	})
	
	.state('home.newDCVForm-detail',{
		url: '/newDCVForm-detail',
		templateUrl: 'pages/dcv/newDCVFormDetail.html',
		params: {
        	dataFromTerm:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/NewDCVFormDetailCtrl.js');
			}]
		},
		data : createMetaDataLink("newDCVForm_detail","newDCVForm_detail", false, false, false)
	})
	
	.state('home.copyDCVForm-add',{
		url: '/copyDCVForm-add',
		templateUrl: 'pages/dcv/copyDCVFormAdd.html',
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/CopyDCVFormAddCtrl.js');
			}]
		},
		data : createMetaDataLink("copyDCVForm_add","copyDCVForm_add", false, false, false)
	})
	
	.state('home.copyDCVForm-detail',{
		url: '/copyDCVForm-detail',
		templateUrl: 'pages/dcv/copyDCVFormDetail.html',
		params: {
        	dataFromInput:null,
        	dataAfterView:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/CopyDCVFormDetailCtrl.js');
			}]
		},
		data : createMetaDataLink("copyDCVForm_detail","copyDCVForm_detail", false, false, false)
	})
	
	.state('home.holiday',{
		url: '/holiday',
		templateUrl: 'pages/dcv/holidayList.html',
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/HolidayListCtrl.js');
			}]
		},
		data : createMetaDataLink("holiday","holiday", false, false, false)
	})
	
	.state('home.holiday-add',{
		url: '/holidayadd',
		templateUrl: 'pages/dcv/holidayAdd.html',
		params: {
        	dataAdd:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/HolidayAddCtrl.js');
			}]
		},
		data : createMetaDataLink("holiday-add","holiday-add", false, false, false)
	})
	
	.state('home.holiday-edit',{
		url: '/holidayedit',
		templateUrl: 'pages/dcv/holidayEdit.html',
		params: {
        	dataEdit:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/HolidayEditCtrl.js');
			}]
		},
		data : createMetaDataLink("holiday-edit","holiday-edit", false, false, false)
	})
	
	.state('home.lookupcode',{
		url: '/lookupcode',
		templateUrl: 'pages/dcv/LookupCodeList.html',
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/LookupCodeListCtrl.js');
			}]
		},
		data : createMetaDataLink("lookupcode","lookupcode", false, false, false)
	})
	
	.state('home.dcv-role',{
		url: '/dcvrole',
		templateUrl: 'pages/dcv/dcvRoleList.html',
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/DcvRoleListCtrl.js');
			}]
		},
		data : createMetaDataLink("dcv-role","dcv-role", false, false, false)
	})
	
	.state('home.dcv-role-add',{
		url: '/dcvroleadd',
		templateUrl: 'pages/dcv/dcvRoleAdd.html',
		params: {
        	dataEdit:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/DcvRoleAddCtrl.js');
			}]
		},
		data : createMetaDataLink("dcv-role-add","dcv-role-add", false, false, false)
	})
	
	.state('home.dcv-role-edit',{
		url: '/dcvroleedit',
		templateUrl: 'pages/dcv/dcvRoleEdit.html',
		params: {
        	dataEdit:null
        },
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/DcvRoleEditCtrl.js');
			}]
		},
		data : createMetaDataLink("dcv-role-edit","dcv-role-edit", false, false, false)
	})
	
	.state('home.terima-dokumen',{
		url: '/terimaDokumen',
		templateUrl: 'pages/dcv/terimaDokumen.html',
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/TerimaDokumenCtrl.js');
			}]
		},
		data : createMetaDataLink("terima-dokumen","terima-dokumen", false, false, false)
	})
	
	.state('home.histori-terima-dokumen',{
		url: '/historiTerimaDokumen',
		templateUrl: 'pages/dcv/historiTerimaDok.html',
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/HistoriTerimaDokCtrl.js');
			}]
		},
		data : createMetaDataLink("histori-terima-dokumen","histori-terima-dokumen", false, false, false)
	})
	
	.state('home.sla-setting',{
		url: '/SLASetting',
		templateUrl: 'pages/dcv/SLASetting.html',
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/SLASettingCtrl.js');
			}]
		},
		data : createMetaDataLink("sla-setting","sla-setting", false, false, false)
	})
	
	.state('home.sla-setting-edit',{
		url: '/SLASettingEdit',
		templateUrl: 'pages/dcv/SLASettingEdit.html',
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/SLASettingCtrl.js');
			}]
		},
		data : createMetaDataLink("sla-setting","sla-setting", false, false, false)
	})
	
	.state('home.report-sla',{
		url: '/reportSla',
		templateUrl: 'pages/dcv/reportSla.html',
		resolve: {
			ctrl: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('resource/controller/dcv/reportSlaCtrl.js');
			}]
		},
		data : createMetaDataLink("sla-report","sla-report", false, false, false)
	})
	
}]);