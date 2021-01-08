	'use strict';

App.factory('DynamicFormService', ['CommonService', 'TemplateService', '$state', function(CommonService, TemplateService, $state){
	
	var service = {};
	
	/**crate form based on formField.FIELD_TYPE
	 * every form is pushed to each arr based on its type
	 */
	function createForm(formField, isTracking, vm, scopeName){
		switch(formField.FIELD_TYPE){
		
			case TemplateService.TEXT :
				vm.texts.push(formField);
				return createText(formField, isTracking, vm, scopeName);
				
			case TemplateService.NUMBER :
				vm.numbers.push(formField);
				return createNumber(formField, vm, scopeName);
				
			
			case TemplateService.DATE :
				vm.dates.push(formField);
				return createDate(formField, isTracking, vm, scopeName);
				
			
			case TemplateService.SELECT :
				vm.selects.push(formField);
				return createSelect(formField, vm, scopeName);
				
			
			case TemplateService.CHECKBOX :
				vm.checkboxs.push(formField);
				return createCheckBox(formField, vm, scopeName);
				
				
			case TemplateService.LABEL :
				vm.labels.push(formField);
				return createLabelValue(formField, vm);
				
				
			case TemplateService.HIDDEN :
				vm.hiddens.push(formField);
				return createHidden(formField, vm);
				
			case TemplateService.LINK :
				return createLink(formField, isTracking, vm, scopeName);
				
			case TemplateService.LIST :
				return createList(formField, vm, scopeName);
				
			case TemplateService.FORM :
				return createFormField(formField, vm, CommonService.APPROVE);
				
			case TemplateService.FORMEDIT :
				return createFormField(formField, vm, CommonService.EDIT);
				
			case TemplateService.SELECTWFT :
				var formFieldFreeText = {FIELD_NAME : formField.FIELD_NAME+TemplateService.$text};
				vm.texts.push(formFieldFreeText);
				vm.selects.push(formField);
				return createSelectWithFreeText(formField, vm, scopeName);
				
		}
	}
	
	/**create text field**/
	function createText(formField, isTracking, vm, scopeName){
		if(isTracking){
			vm.textsModel[formField.FIELD_NAME] = TemplateService.getValueFormTracking(vm.form, formField.FIELD_NAME, 0);
		}
		else{
			vm.textsModel[formField.FIELD_NAME] = TemplateService.getValueForm(vm.form, formField.FIELD_NAME);
		}
		return TemplateService.createText(formField, scopeName);
	}
	
	/**create number field**/
	function createNumber(formField, vm, scopeName){
		vm.numbersModel[formField.FIELD_NAME] = TemplateService.getValueForm(vm.form, formField.FIELD_NAME);
		return TemplateService.createNumber(formField, scopeName);
	}
	
	/**create date field**/
	function createDate(formField, isTracking, vm, scopeName){
		var valueDate = undefined;
		if(isTracking){
			valueDate = TemplateService.getValueFormTracking(vm.form, formField.FIELD_NAME, 0);
		}
		else{
			valueDate = TemplateService.getValueForm(vm.form, formField.FIELD_NAME);
		}
		var minDate = TemplateService.getValueForm(vm.form, formField.FIELD_NAME);
		vm.datesModel[formField.FIELD_NAME] = new Date(valueDate);
		vm.maxDate[formField.FIELD_NAME] = new Date(valueDate);
		vm.minDate[formField.FIELD_NAME] = new Date(valueDate);
		return TemplateService.createDate(formField, scopeName);
	}
	
	/**create select field**/
	function createSelect(formField, vm, scopeName){
		if(formField.FIELD_OPTIONS != ""
			&& formField.FIELD_OPTIONS != undefined){
			vm.options[formField.FIELD_NAME] = JSON.parse(formField.FIELD_OPTIONS);
		}
		else{
			var fieldRefs = formField.FIELD_REF.split(";");
			var paramData = {TABLE_NAME : fieldRefs[0],
				FIELD_ID : fieldRefs[1], 
				LABEL : fieldRefs[2]}
			CommonService.listResource('fieldRef', paramData)
			.then(function(data){
				vm.options[formField.FIELD_NAME] = data.dynamicList;
			});
		}
		
		vm.selectsModel[formField.FIELD_NAME] = {id : "", label : ""};
		return TemplateService.createSelect(formField, scopeName);
	}
	
	/**create checkbox field**/
	function createCheckBox(formField, vm, scopeName){
		vm.checkboxModel[formField.FIELD_NAME] = TemplateService.getValueForm(vm.form, formField.FIELD_NAME);
		return TemplateService.createCheckBox(formField, scopeName);
	}
	
	/**create label for value**/
	function createLabelValue(formField, vm){
		vm.labelModel[formField.FIELD_NAME] = TemplateService.getValueForm(vm.form, formField.FIELD_NAME);
		return TemplateService.createLabelValue(formField);
	}
	
	/**create hidden field**/
	function createHidden(formField, vm){
		var valueHidden = TemplateService.getValueForm(vm.form, formField.FIELD_NAME);
		vm.hiddenModel[formField.FIELD_NAME] = valueHidden;
		return TemplateService.createHidden(valueHidden);
	}
	
	/**create link field**/
	function createLink(formField, isTracking, vm, scopeName){
		if(isTracking){
			vm.linkModel[formField.FIELD_NAME] = {
					'value': TemplateService.getValueFormTracking(vm.form, formField.FIELD_NAME, 0),
					'link': TemplateService.getValueFormTracking(vm.form, formField.FIELD_NAME + '.$link', 0)
				};
		}
		else{
			var a = TemplateService.getValueForm(vm.form, formField.FIELD_NAME);
			var b = TemplateService.getValueForm(vm.form, formField.FIELD_NAME + '.$link');
			vm.linkModel[formField.FIELD_NAME] = {'value': a,
				'link': b};
		}
		return TemplateService.createLink(formField, vm.linkModel[formField.FIELD_NAME], scopeName);
	}
	
	/**create list type**/
	function createList(formField, vm, scopeName){
		var html = "";
		var valueList = TemplateService.getValueForm(vm.form, formField.FIELD_NAME);	//extract value from vm.form based on field_name
		if(valueList != undefined){
			var list = valueList.list;
			if(valueList.selectable=="true"){
				vm.lists[formField.FIELD_NAME] = [];	//init array
				vm.selectedLists[formField.FIELD_NAME] = [];
				vm.listTemp[formField.FIELD_NAME] = list;
			}
			if(CommonService.isListNotEmpty(list)){
				for(var i = 0; i<list.length; i++){
					var obj = list[i];
					if(valueList.selectable=="true"){
						html += TemplateService.createCheckBoxList(formField.FIELD_NAME, i, obj.LABEL, scopeName);
					}else{
						html += TemplateService.createRegularLabel(obj.LABEL);
					}
					html += "<br />";
				}
			}
			return html;
		}
		return "";
	}
	
	/**create for field**/
	function createFormField(formField, vm, state){
		var origState = TemplateService.getValueForm(vm.form, formField.FIELD_NAME);
		//get real state
		var realState = $state.get(origState.STATE);
		var name = realState.name.substring(5);	//real state is always prefixed by home. so we must cut it
		var newName = 'home.approval-form.'+name;	//for approval will registered with home.approval-form.
		var newState = $state.get(newName);
		if(CommonService.isEmpty(newState)){	//registered new state if hasn't registered
			$stateProviderRef
				.state(newName, {
					url: realState.url,
					templateUrl: realState.templateUrl,
					controller : realState.controller,
					controllerAs : realState.controllerAs,
					resolve : realState.resolve
					}
				)
		}
		var param = origState.PARAM;
		if(CommonService.isNotEmpty(param)){
			for (var key in param) {
				var obj = param[key];
				vm.stateParams[key] = obj
			}
		}
		
		var element = origState.ENTITY;
		vm.stateParams.APPROVALDATA = vm.form[element];
		vm.stateParams.STATE = state;
		
		$state.go(newName, vm.stateParams);
		return "<div ui-view></div>";
	}
	
	/**create select with free text
	 * in end of data is always exist 99 that notify that that is an other
	 * **/
	function createSelectWithFreeText(formField, vm, scopeName){
		if(formField.FIELD_OPTIONS != ""
			&& formField.FIELD_OPTIONS != undefined){
			vm.options[formField.FIELD_NAME] = JSON.parse(formField.FIELD_OPTIONS);
		}
		else{
			var fieldRefs = formField.FIELD_REF.split(";");
			var paramData = {TABLE_NAME : fieldRefs[0],
				FIELD_ID : fieldRefs[1], 
				LABEL : fieldRefs[2]}
			CommonService.listResource('fieldRef', paramData)
			.then(function(data){
				vm.options[formField.FIELD_NAME] = data.dynamicList;
				data.dynamicList.push({'id' : fieldRefs[3], 'label' : TemplateService.OTHER});
			});
		}
		
		vm.selectsModel[formField.FIELD_NAME] = {id : "", label : ""};
		return TemplateService.createSelectWithFreeText(formField, scopeName);
	}
	
	/**create comparator form if field is tracked**/
	function createForm2(formField, isTracking, vm, scopeName){
		if(TemplateService.isTracking(vm.form, formField)){
			var val = TemplateService.getValueFormTracking(vm.form, formField.FIELD_NAME, 1); //get second value in index 1
			switch(formField.FIELD_TYPE){
				
				case TemplateService.TEXT :
					return TemplateService.createRegularText(val, true);
					
				case TemplateService.DATE :
					return TemplateService.createRegularText(val, true);
					
				case TemplateService.NUMBER :
					//return createNumber(formField);
					break;
				
				case TemplateService.SELECT :
					
					//return createSelect(formField);
					break;
				
				case TemplateService.CHECKBOX :
					
					//return createCheckBox(formField);
					break;
					
				case TemplateService.LABEL :
					return createRegularLabel(val);
					
				case TemplateService.HIDDEN :
					return TemplateService.createHidden(val);
					
				case TemplateService.LINK :
					var model = {'value': TemplateService.getValueFormTracking(vm.form, formField.FIELD_NAME, 1),
						'link': TemplateService.getValueFormTracking(vm.form, formField.FIELD_NAME + '.$link', 1)
					};
					return TemplateService.createLink(formField, model, scopeName); 
			}
		}
		else{
			return TemplateService.createEmptyLabel();
		}
	}
	
	/**create button back**/
	function createBackToIndex(scopeName){
		return TemplateService.createBackToIndex(scopeName);
	}
	
	/**create button cancel in modal**/
	function createBackToIndexModal(scopeName){
		return TemplateService.createBackToIndexModal(scopeName);
	}
	
	/**create button field**/
	function createButton(formField, scopeName){
		return TemplateService.createButton(formField, scopeName);
	}
	
	function createButtonFunction(formField, scopeName, fn){
		return TemplateService.createButtonFunction(formField, scopeName, fn);
	}
	
	/**invoked when action type is button, this function need serviceName**/
	function requestButton(serviceName, paramData, vm){
//		CommonService.execResponse(serviceName , paramData)
//		.then(function(response){
//			constructResponse(response, vm);
//		});
	}
	
	/**construct button**/
	function constructResponse(response, vm){
		var data = response.data.output;
		if(data.action != undefined 
			&& data.action == "redirect"){
			$state.go(data.view, data.params);
		}
		else{
			service.backToIndex(vm.backPage);
		}
	}
	
	/**download function**/
	function download(paramData){
		CommonService.downloadGeneral(paramData.input.action, paramData)
		.then(function(downloadData) {
			if(downloadData.data != undefined){
				var file = new Blob([downloadData.data]);
				var fileName = "task";
				if(downloadData.filename != undefined){
					fileName = downloadData.filename;
				}
				saveAs(file, fileName);
			}
		});
	}
	
	/**invoke for action button**/
	function requestAction(paramData, vm){
//		CommonService.execResponse("soa.entity.form:doAction", paramData)
//		.then(function(response){
//			constructResponse(response, vm);
//		});
	}
	
	
	/**all below is public field**/
	
	/**create dynamic form
	 * scope name is a name that will be write in template
	 * **/
	service.createDynamicForm = function(vm, scopeName){
		var htmlCode = "";
		if(CommonService.isListNotEmpty(vm.formList)){
			for(var i=0;i<vm.formList.length;i++){
				var formField = vm.formList[i];
				if(TemplateService.BUTTON == formField.FIELD_TYPE
					|| TemplateService.ACTION == formField.FIELD_TYPE
					|| TemplateService.MODAL == formField.FIELD_TYPE
					|| TemplateService.DOWNLOAD == formField.FIELD_TYPE
					|| TemplateService.ACTIONFN == formField.FIELD_TYPE){
					vm.buttons.push(formField);
				}else{
					var isTracking = TemplateService.isTracking(vm.form, formField);
					htmlCode += TemplateService.openDiv("row form-group");
					//if tracking is true then create two form
					if(isTracking){
						htmlCode += TemplateService.createLabel(formField);
						
						//create mark to differentiate the value if value different
						if(TemplateService.isValueTrackingDifferent(vm.form, formField.FIELD_NAME)){
							htmlCode += TemplateService.openDiv("col-lg-5 has-error");
						}
						else{
							htmlCode += TemplateService.openDiv("col-lg-5");
						}
						htmlCode += createForm(formField, isTracking, vm, scopeName);
						htmlCode += TemplateService.closeDiv();
						
						htmlCode += TemplateService.openDiv("col-lg-5");
						htmlCode += createForm2(formField, isTracking, vm, scopeName);
						htmlCode += TemplateService.closeDiv();
					}
					else if(formField.FIELD_TYPE == TemplateService.FORM 
							|| formField.FIELD_TYPE == TemplateService.FORMEDIT){
						htmlCode += TemplateService.openDiv("col-lg-12");
						htmlCode += createForm(formField, isTracking, vm, scopeName);
						htmlCode += TemplateService.closeDiv();
					}
					else{
						htmlCode += TemplateService.createLabel(formField);
						htmlCode += TemplateService.openDiv("col-lg-10");
						htmlCode += createForm(formField, isTracking, vm, scopeName);
						htmlCode += TemplateService.closeDiv();
					}
					htmlCode += TemplateService.closeDiv();
				}
			}
		}
		return htmlCode;
	} 
	
	/**create dynamic button**/
	service.createDynamicButton = function(vm, scopeName, isModal){
		var htmlButton = "";
		if(!isModal){
			htmlButton += createBackToIndex(scopeName);
		}
		else{
			htmlButton +=  createBackToIndexModal(scopeName);
		}
		if(CommonService.isListNotEmpty(vm.buttons)){
			for(var i=0;i<vm.buttons.length;i++){
				var but = vm.buttons[i];
				if(but.FIELD_TYPE != TemplateService.ACTIONFN){
					htmlButton += createButton(but, scopeName);
				}
				else{
					htmlButton += createButtonFunction(but, scopeName, TemplateService.getValueForm(vm.form, but.FIELD_NAME));
				}
			}
		}
		return htmlButton;
	}
	
	
	/**below code is button or click function for template**/
	
	/**back to previous page**/
	service.backToIndex = function(num){
		if(CommonService.isNotEmpty(num)){
			window.history.go(num);
		}else{
			window.history.back();
		}
	}
	
	/**manage check uncheck**/
	service.selectCheckList = function(state, fieldName, index, vm){
		CommonService.checkUncheckBox(vm.selectedLists[fieldName], state, vm.listTemp[fieldName][index]);
	}
	
	service.isRequired = function(fieldIsRequired){
		return (fieldIsRequired == '1' ? true : false);
	}
	
	/**submit process**/
	service.saveFormProcess = function(invalid, action, vm){
//        if (invalid == false) { TODO how to ignore error in nested form
			var fields = {};
			
			service.populateSaveField(fields, vm);
			
			var actions = action.split(";");
			var actionType = actions[1];
			var serviceName = actions[0];
			var paramData = {input : {"form": fields, 
				"action" : serviceName, 
				"CTX_ID" : vm.task.TASK_CTX_ID, 
				"username" : CommonService.getUsername(),
				"TASK_ORDER" : vm.task.TASK_ORDER,
				"ENTRY_ID" : vm.task.CTX_DOC_ENTRY_ID,
				"DOC_ID" : vm.task.CTX_DOC_ID
				}};
				
			switch(actionType){
				case TemplateService.BUTTON :
					requestButton(serviceName, paramData, vm);
					break;
				case TemplateService.MODAL :
					TemplateService.openModal(vm.stateParams.formId, serviceName, vm.task, vm);
					break;
				case TemplateService.DOWNLOAD :
					download(paramData);
					break;
				default :
					requestAction(paramData, vm);
					break;
			}	
//		}
    }
	
	/**populate fields that will be send**/
	service.populateSaveField = function(fields, vm){
		
		//text
		for(var i=0;i<vm.texts.length;i++){
			var formField = vm.texts[i];
			fields[formField.FIELD_NAME] = vm.textsModel[formField.FIELD_NAME];
		}
		
		//number
		for(var i=0;i<vm.numbers.length;i++){
			var formField = vm.numbers[i];
			fields[formField.FIELD_NAME] = vm.numbersModel[formField.FIELD_NAME];
		}
		
		//date
		for(var i=0;i<vm.dates.length;i++){
			var formField = vm.dates[i];
			fields[formField.FIELD_NAME] = vm.datesModel[formField.FIELD_NAME];
		}
		
		//select
		for(var i=0;i<vm.selects.length;i++){
			var formField = vm.selects[i];
			fields[formField.FIELD_NAME] = vm.selectsModel[formField.FIELD_NAME];
		}				
		
		//hidden
		for(var i=0;i<vm.hiddens.length;i++){
			var formField = vm.hiddens[i];
			fields[formField.FIELD_NAME] = vm.hiddenModel[formField.FIELD_NAME];
		}		
		
		//label
		for(var i=0;i<vm.labels.length;i++){
			var formField = vm.labels[i];
			fields[formField.FIELD_NAME] = vm.labelModel[formField.FIELD_NAME];
		}
		
		//checkbox
		for(var i=0;i<vm.checkboxs.length;i++){
			var formField = vm.checkboxs[i];
			fields[formField.FIELD_NAME] = vm.checkboxModel[formField.FIELD_NAME];
		}
		
		//list
		for(var key in vm.selectedLists){
			var selectedArr = vm.selectedLists[key];
			fields[key] = {list : selectedArr, selectable : "true"};
		}
	}
	
	/**clear notes**/
	service.clearNotes = function(vm){
		var paramData = {input : {"CTX_ID" : vm.task.TASK_CTX_ID, "action" : "clearNotes"}};
		requestAction(paramData, vm);
	}
	
	/**approveFromParent**/
	service.doActionFromParent = function(vm, elementName, element, action){
		var fields = {};
		service.populateSaveField(fields, vm);
    	fields[elementName] = element;
    	var paramData = {input : {"form": fields, 
			"action" : action, 
			"CTX_ID" : vm.task.TASK_CTX_ID, 
			"username" : CommonService.getUsername()
			}
    	};
//    	CommonService.execResponse(CommonService.DOACTIONTASK, paramData)
//		.then(function(response){
//			window.history.go(vm.backPage);
//		});
	}
	
	return service;
	
}]);
