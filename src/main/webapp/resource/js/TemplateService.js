'use strict';

App.factory('TemplateService', ['CommonService', '$uibModal',function(CommonService, $uibModal){
	
	var HIDDEN = "hidden";
	var TEXT = 'text';
	var NUMBER = "number";
	var DATE = "date";
	var BUTTON = 'button';
	var SELECT = 'select';
	var SELECTWFT = 'selectWithFreeText';
	var CHECKBOX = "checkbox";
	var LABEL = "label";
	var ACTION = "action";
	var ACTIONFN = "actionFn";
	var BUTTONFIELD = "buttonField";
	var LINK = "link";
	var MODAL = "modal";
	var DOWNLOAD = "download";
	var LIST = "list";
	var FORM = "form";
	var FORMEDIT = "formEdit";
	var OTHER = "OTHER";
	var $text = "$text";
	
	function returnUndefinedIfNull(data){
		if(data==undefined){
			return undefined;
		}
		else{
			return data;
		}
	}
	
	/**get value from form object, get by fieldname**/
	function getValueForm(form, fieldName){
		if(form != undefined){
			return returnUndefinedIfNull(form[fieldName]);
		}else{
			return undefined;
		}
	}
	
	function getValueFormTracking(form, fieldName, idx){
		var arr = getValueForm(form, fieldName);
		return arr[idx];
	}
	
	function isValueTrackingDifferent(form, fieldName){
		var arr = getValueForm(form, fieldName);
		if(angular.isArray(arr)){
			var v1=arr[0];
			var v2=arr[1];
			return (v1!=v2);
		}
		return false;
	}
	
	function isReadOnly(value){
		if(value=="1" 
			|| value==1){
			return true;
		}
		else{
			return false;
		}
	}
	
	return {
		HIDDEN : HIDDEN,
		TEXT : TEXT,
		NUMBER : NUMBER,
		DATE : DATE,
		BUTTON : BUTTON,
		SELECT : SELECT,
		CHECKBOX : CHECKBOX,
		LABEL : LABEL,
		ACTION : ACTION,
		ACTIONFN : ACTIONFN,
		BUTTONFIELD : BUTTONFIELD,
		MODAL : MODAL,
		LINK : LINK,
		DOWNLOAD : DOWNLOAD,
		LIST : LIST,
		FORM : FORM,
		FORMEDIT : FORMEDIT,
		OTHER : OTHER,
		SELECTWFT : SELECTWFT, 
		$text : $text,
		
		createButton : function (formField, scopeName) {
			return "<button type='button' class='btn btn-primary pull-center' "+
				"ng-click='"+scopeName+".saveFormProcess(formProcess.$invalid, &quot;"+formField.FIELD_ACTION+";"+formField.FIELD_TYPE+"&quot; ,&quot;"+ formField.FIELD_LABEL +"&quot; )'"
				+" ng-disabled='"+scopeName+".disabled."+formField.FIELD_NAME+"'>"+
				formField.FIELD_LABEL+"</button> &nbsp;";
		},
		
		/**
		 * create button that was contain function
		 * fn is object
		 */
		createButtonFunction : function(formField, scopeName, fn){
			return "<button type='button' class='btn btn-primary pull-center' "+
				"ng-click='vm."+fn.FUNCTION_NAME+"(&quot;"+formField.FIELD_ACTION+"&quot;) 'ng-disabled='"+scopeName+".disabled."+formField.FIELD_NAME+"'>"+
				formField.FIELD_LABEL+"</button> &nbsp;";
		},
		
		openDiv : function(vClass){
			return "<div class='"+vClass+"'>";
		},
		
		closeDiv : function(){
			return "</div>";
		},
		
		openH1 : function(vClass){
			return "<h1 class='"+vClass+"'>";
		},
		
		closeH1 : function(){
			return "</h1>";
		},
		
		openTd : function(){
			return "<td>";
		},
		
		closeTd : function(){
			return "</td>";
		},
		
		openCloseTd : function(value, style){
			return "<td style='"+style+"'>"+value+"</td>"
		},
		
		createTableWithNgRepeat : createTableWithNgRepeat,
		
		/**create label for type hidden, label**/
		createLabel : function (formField){
			if(HIDDEN == formField.FIELD_TYPE){
				return "<label class='col-lg-2' ng-hide='true'>"+formField.FIELD_LABEL+"</label>";
			}
			else if(LABEL == formField.FIELD_TYPE){
				return "<label class='col-lg-2'></label>";
			}
			else{
				return "<label class='col-lg-2'>"+formField.FIELD_LABEL+"</label>";
			}
		},
		
		createRegularLabel : function(val){
			return "<label>"+val+"</label>";
		},
		
		createText : function(formField, scopeName){
			return "<input type='text' class='form-control' name='"+formField.FIELD_NAME+"'" +
			"ng-model='"+scopeName+".textsModel."+formField.FIELD_NAME+"' ng-readonly='"+isReadOnly(formField.FIELD_IS_READONLY)+"' "+
			"ng-disabled='"+scopeName+".disabled."+formField.FIELD_NAME+"' ng-trim='false' />";
		},
		
		createRegularText : function(value, readonly){
			return "<input type='text' class='form-control' value='"+value+"' readonly='"+readonly+"' />";
		},
		
		createLink : function(formField, model, scopeName){
			if(model.link){
				return "<a ui-sref='"+model.link.view + "({{"+scopeName+".linkModel."+formField.FIELD_NAME+".link.params}})'>" + model.value + "</a>";
			}
			else{
				return "<a>"+model.value+"</a>";
			}
		},
		
		createNumber : function(formField, scopeName){
			return "<input type='number' class='form-control' name='"+formField.FIELD_NAME+"'" +
			"ng-model='"+scopeName+".numbersModel."+formField.FIELD_NAME+"' ng-readonly='"+isReadOnly(formField.FIELD_IS_READONLY)+"' "+
			"ng-disabled='"+scopeName+".disabled."+formField.FIELD_NAME+"' />";
		},
		
		createDate : function(formField, maxDate, minDate, scopeName){
			var disabled = "";
			if(isReadOnly(formField.FIELD_IS_READONLY)){
				disabled = "disabled";
			}
			
			return "<md-datepicker ng-model='"+scopeName+".datesModel."+formField.FIELD_NAME+"' md-min-date='"+scopeName+".datesModel."+formField.FIELD_NAME+"'" 
				+" md-max-date='' "+disabled+" />";
		},
		
		createRegularDate : function(value){
			return "<label>"+value+"<label/>";
		},
		
		createCheckBox : function(formField, scopeName){
			return "<input type='checkbox' ng-model='"+scopeName+".checkboxModel."+formField.FIELD_NAME+"' ng-readonly='"+isReadOnly(formField.FIELD_IS_READONLY)+"'"
				+" ng-disabled='"+scopeName+".disabled."+formField.FIELD_NAME+"' />";
		},
		
		/**
		 * require vm.selectCheckList method to be implemented
		 */
		createCheckBoxList : function(fieldname, index, label, scopeName){
			return "<input ng-model='"+scopeName+".lists."+fieldname+"["+index+"]' type='checkbox'" 
				+ " ng-click='"+scopeName+".selectCheckList("+scopeName+".lists."+fieldname+"["+index+"], &quot;"+fieldname+"&quot;,"+index+")' />"
				+ " "+this.createRegularLabel(label);
		},
		
		createSelect : function(formField, scopeName){
			return "<select name='"+formField.FIELD_NAME+"' class='form-control' ng-model='"+scopeName+".selectsModel."+formField.FIELD_NAME+"'"
				+" ng-options = 'fieldType.label for fieldType in "+scopeName+".options."+formField.FIELD_NAME+" track by fieldType.id'"
				+" ng-readonly='"+isReadOnly(formField.FIELD_IS_READONLY)+"'"
				+" ng-disabled='"+scopeName+".disabled."+formField.FIELD_NAME+"' />";
		},
		
		/**show text if select is selects other**/
		createSelectWithFreeText : function(formField, scopeName){
			var html = this.createSelect(formField, scopeName);
			html += "<div ng-show='"+scopeName+".selectsModel."+formField.FIELD_NAME+".label == &quot;"+this.OTHER+"&quot;'>"
					+" "+this.createFreeText(formField, scopeName)
					+" </div>";
			return html;
		},
		
		/**create text for freetext**/
		createFreeText : function(formField, scopeName){
			return "<input type='text' class='form-control' name='"+formField.FIELD_NAME+$text+"'" +
			"ng-model='"+scopeName+".textsModel."+formField.FIELD_NAME+$text+"' "+"' ng-trim='false' />";
		},
		
		createBackToIndex : function(scopeName){
			return "<button type='button' class='btn btn-info pull-center' ng-click='"+scopeName+".backToIndex()'>" +
					"<span class='fa fa-chevron-left'></span>&nbsp;<span> Back</span>"+
					"</button> &nbsp;";
		},
		
		createBackToIndexModal : function(scopeName){
			return "<button class='btn btn-warning' type='button' ng-click='"+scopeName+".cancel()'>Cancel</button>&nbsp;"
		},
		
		createEmptyLabel : function(){
			return "<br />";
		},
		
		getValueForm : getValueForm,
		
		getValueFormTracking : getValueFormTracking,
		
		isValueTrackingDifferent : isValueTrackingDifferent,
		
		createHidden : function(valueHidden){
			return "<label ng-hide='true'>"+valueHidden+"</label>";
		},
		
		createLabelValue : function(formField){
			var value = getValueForm(formField);
			if(CommonService.isEmpty(value)){
				value = "";
			}
			return "<label ng-trim='false'>"+value+"</label>";
		},
		
		openModal : function(formId, parentModal, task, parent){
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'pages/modal/dynamicModal.html',
				controller: 'DynamicModalController',
				controllerAs: '$ctrl',
				size: 'lg',
				resolve: {items: function () {
		          var paramData = {FORM_ID : formId, PARENT_MODAL : parentModal, task : task, parent:parent};
				  return paramData;
				}}
			});
			modalInstance.result.then(function(response) {
				return response;
			});
		},
		
		isTracking : function(form, formField){
			var arr = getValueForm(form, formField.FIELD_NAME);
			return (formField.FIELD_TRACKING_MODE=="1" && angular.isArray(arr));
		},
	};
	
	/**
	* crate dynamic table you must provide class, column, model, and implementBody
	*/
	function createTableWithNgRepeat(vClass, vColumn, vmModel, implementTbody){
		var table = "";
		
		table += "<table class='"+vClass+"'>";
			//table header
			table += "<thead>";
				table += "<tr>";
					if(CommonService.isListNotEmpty(vColumn)){
						for(var i = 0 ; i<vColumn.length; i++){ 
							table += createTh(vColumn[i]);
						}
					}
				table += "</tr>";
			table += "</thead>";
			
			//table body
			table += "<tbody>";
				table += "<tr ng-if='"+vmModel+" == undefined || "+vmModel+".length < 1'><td colspan='"+vColumn.length+"'>No Record Found</td></tr>"
				table += implementTbody;
			table += "</tbody>";
			
		table += "</table>";
		
		return table;
	}
	
	function createTh(value){
		return "<th>"+value+"</th>";
	}
	
}]);



/*******************************************************MODAL***********************************************/

App.controller('DynamicModalController', function ($uibModalInstance, items, CommonService, TemplateService, DynamicFormService, $stateParams) {
  	var $ctrl = this;
  	
  	/**attribute to create dynamic form**/
	$ctrl.formId = {};
    $ctrl.valueForm = {};
	$ctrl.eventSrc = {};
	$ctrl.htmlCode = "";
	$ctrl.htmlButton = "";
	$ctrl.formList = {};
	$ctrl.options = {};
	$ctrl.selectsModel = {};
	$ctrl.textsModel = {};
	$ctrl.numbersModel = {};
	$ctrl.datesModel = {};
	$ctrl.hiddenModel = {};
	$ctrl.labelModel = {};
	$ctrl.checkboxModel = {};
	$ctrl.task = items.task;
	$ctrl.form = {};
    $ctrl.errorDetailList = {};
	$ctrl.maxDate = {};
	$ctrl.minDate = {};
	$ctrl.linkModel = {};
	$ctrl.selectedLists = {}; //will be used as key map
	$ctrl.lists = {};
	$ctrl.listTemp = {}; //used to store list temporary
	/**arrays to be containded by data based on its type**/
	$ctrl.buttons = [];
	$ctrl.texts = [];
	$ctrl.numbers = [];
	$ctrl.dates = [];
	$ctrl.selects = [];
	$ctrl.checkboxs = [];
	$ctrl.hiddens = [];
	$ctrl.labels = [];
	/**other**/
	$ctrl.stateParams = $stateParams;	//optional it was used if there is an fieldtype form
	$ctrl.backPage = undefined;	//it was used if there is an fieldtype form
	/**function that will be used by dynamic form**/
	$ctrl.selectCheckList = function(state, fieldName, index){
		DynamicFormService.selectCheckList(state, fieldName, index, $ctrl);
	}
	$ctrl.backToIndex = function(){
		DynamicFormService.backToIndex($ctrl.backPage);
	}
	$ctrl.saveFormProcess = function(invalid, action){
		mergeFieldsWithParent();
		DynamicFormService.saveFormProcess(invalid, action, $ctrl);
		cancel();
	}
	/******************************************/
	
	function mergeFieldsWithParent(){
		var parent = items.parent;
		mergeDetailModel(parent.texts, $ctrl.texts, parent.textsModel, $ctrl.textsModel);
		mergeDetailModel(parent.numbers, $ctrl.numbers, parent.numbersModel, $ctrl.numbersModel);
		mergeDetailModel(parent.dates, $ctrl.dates, parent.datesModel, $ctrl.datesModel);
		mergeDetailModel(parent.selects, $ctrl.selects, parent.selectsModel, $ctrl.selectsModel);
		mergeDetailModel(parent.hiddens, $ctrl.hiddens, parent.hiddenModel, $ctrl.hiddenModel);
		mergeDetailModel(parent.labels, $ctrl.labels, parent.labelModel, $ctrl.labelModel);
		mergeDetailModel(parent.checkboxs, $ctrl.checkboxs, parent.checkboxModel, $ctrl.checkboxModel);
		if(parent.selectedLists){
			for(var key in parent.selectedLists){
				$ctrl.selectedLists[key] = parent.selectedLists[key];
			}
		}
	}
	
	function mergeDetailModel(arrModels, arrModelsChild, parentModels, models){
		if(arrModels){
			for(var i=0;i<arrModels.length;i++){
				var formField = arrModels[i];
				models[formField.FIELD_NAME]= parentModels[formField.FIELD_NAME];
				arrModelsChild.push(formField);
			}
		}
		
	}
	
	loadData();
	
	/**button**/
	$ctrl.cancel = function () {
		cancel();
	};
	
	/**service**/
	function loadData(){
		var paramData = {input : {FORM_ID : items.FORM_ID, PARENT_MODAL : items.PARENT_MODAL}};
//		CommonService.exec("soa.entity.form:doGetModal", paramData)
//		.then(function(data){
//			$ctrl.formList = data.output.formList;
//			
//			/**construct dynamic form**/
//			$ctrl.htmlCode = DynamicFormService.createDynamicForm($ctrl, "$ctrl");
//			$ctrl.htmlButton = DynamicFormService.createDynamicButton($ctrl, "$ctrl", true);
//			/**end**/
//			
//		});
	}
	  
	/**UTIL**/
	function cancel(){
		$uibModalInstance.dismiss('cancel');
	}
	
	function isReadOnly(value){
		if(value=="1" 
			|| value==1){
			return true;
		}
		else{
			return false;
		}
	}
	
});