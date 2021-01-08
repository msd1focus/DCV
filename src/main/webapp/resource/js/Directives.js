/**Directive to create dynamic html**/
App.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
});


/**directive to show loading image when request response http**/
App.directive('loading',   ['$http' ,function ($http)
{
	return {
		restrict: 'A',
		link: function (scope, elm, attrs)
		{
			scope.isLoading = function () {
				return $http.pendingRequests.length > 0;
			};

			scope.$watch(scope.isLoading, function (v)
			{
				if(v){
					elm.show();
				}else{
					elm.hide();
				}
			});
		}
	};
}]);

/**directive to collect value to array in checkbox**/
App.directive('checkList', function() {
  return {
    scope: {
      list: '=checkList',
      value: '@'
    },
    link: function(scope, elem, attrs) {
      var handler = function(setup) {
        var checked = elem.prop('checked');
        var index = scope.list.indexOf(scope.value);

        if (checked && index == -1) {
          if (setup) elem.prop('checked', false);
          else scope.list.push(scope.value);
        } else if (!checked && index != -1) {
          if (setup) elem.prop('checked', true);
          else scope.list.splice(index, 1);
        }
      };

      var setupHandler = handler.bind(null, true);
      var changeHandler = handler.bind(null, false);

      elem.bind('change', function() {
        scope.$apply(changeHandler);
      });
      scope.$watch('list', setupHandler, true);
    }
  };
});

/**directive to limit**/
App.directive('exceedLimit',function($filter){
	return{
		scope:{limit : "=exceedLimit"},
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl){
			
			ctrl.$validators.exceedLimit = function(modelValue, viewValue){
				var input = parseFloat(viewValue);
				var limit = scope.limit;
				if(input>limit){
					return false;
				}
				return true;
			};
		}
	};
});


/**directive to not allow zero**/
App.directive('preventZero', function(CommonService){
	return{
		scope:{enable : "=preventZero"},
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl){
			ctrl.$validators.preventZero = function(modelValue, viewValue){
				if(scope.enable){
					viewValue = parseFloat(viewValue);
					if(viewValue<=0){
						return false;
					}
				}
				return true;
			};
		}
	};
});

/**directive for upload file**/
App.directive('fileModel', ['$parse', function ($parse) {
    return {
       restrict: 'A',
       link: function(scope, element, attrs, ctrl) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;
          
          /*ctrl.$validators.fileModel = function(){
        	  var length = element[0].files[0].size;	
        	  return true;
          	};*/
          
          element.bind('change', function(){
             scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
             });
          });
       }
    };
 }]);

/**directive to determine complexity of password**/
App.directive('complexPassword', function() {
	  return {
	    require: 'ngModel',
	    link: function(scope, elm, attrs, ctrl) {
	      ctrl.$parsers.unshift(function(password) {
	        var hasUpperCase = /[A-Z]/.test(password);
	        var hasLowerCase = /[a-z]/.test(password);
	        var hasNumbers = /\d/.test(password);
	        var hasNonalphas = /\W/.test(password);
	        var hasSpecialChar = /[!@#\$%\^&\*]/.test(password);
	        var characterGroupCount = hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas + hasSpecialChar;

	        if ((password.length >= 8) && (characterGroupCount >= 5)) {
	          ctrl.$setValidity('complexity', true);
	          return password;
	        }
	        else {
	          ctrl.$setValidity('complexity', false);
	          return undefined;
	        }

	      });
	    }
	  }
	});

/**
 * check if 2 value is match
 * matchingText is used as attribute
 * if matching then retur true
 */
App.directive('matchingText', function(CommonService) {
	  return {
	    scope:{comparedValue : "=matchingText"},
		require: 'ngModel',
	    link: function(scope, elm, attrs, ctrl) {
	    	ctrl.$validators.matchingText = function(modelValue, viewValue){
	    		var comparedValue = scope.comparedValue;
	    		if(CommonService.isNotEmpty(comparedValue)
	    				&& CommonService.isNotEmpty(viewValue)){
	    			return comparedValue == viewValue;
	    		}
				return false;
			};
	    }
	  }
	});

/**numeric only**/
App.directive('numericOnly', function() {
	  return {
	    require: 'ngModel',
	    link: function(scope, elm, attrs, ctrl) {
	    	
	      ctrl.$parsers.unshift(function(val) {
	    	var isNumeric = /^[0-9.]*$/.test(val);

	        if (isNumeric) {
	          ctrl.$setValidity('isnumeric', true);
	          return val;
	        }
	        else {
	          ctrl.$setValidity('isnumeric', false);	//it will enabled error to true
	          return undefined;
	        }

	      });
	    }
	  }
	});

/** marquee JisDor **/
App.directive('marqueeDirective', function ($timeout, CommonService) {
	return {
        restrict: 'E',
        templateUrl: 'pages/directiveMarquee.html',
        link: function (scope, elem, attrs) {
        	scope.isi = CommonService.MARQUEENOTAVIND;
        	
        	var paramData = {input : {VALUE_DATE : CommonService.parsingDate(new Date())}};
//        	CommonService.exec("soa.entity.specialrate:getRate", paramData)
//			.then(function(data){
//				if(data.output.RATE1 != undefined){
//					scope.isi = CommonService.MARQUEEIND+CommonService.parsingDateWithDayInd(new Date())+" Rp."+data.output.RATE1;
//				}
//			});
        }
	}
});

/**
 * restrict : Declare how directive can be used in a template as an element, attribute, class, comment, or any combination.
 * 			  If you omit the restrict property the default is A (attribute)
 * 
 * scope	: Create a new scope for this directive rather than inheriting the parent scope.
 * require 	: Require that another directive be present for this directive to function correctly.
 * link 	: Programmatically modify resulting DOM element instances, add event listeners, and set up data binding
 */

/**
	Symbol of binding strategy
	@ : pass this attributes as string, you can also data bind values from enclosing scope by using interpolation {{}} in the atrribute value
	= : data bind this property with a property in you directive's  parent scope 
	& : pass in function from the parent scope to be called later
**/