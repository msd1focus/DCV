'use strict';

App.controller('RoleAddController', ['CommonService', '$state', '$stateParams', 'TemplateService', 'ivhTreeviewBfs',
		function(CommonService, $state, $stateParams, TemplateService, ivhTreeviewBfs) {
	var vm = this;
	vm.role = {};
    vm.viewOnly = false;
	vm.checkedMenu = [];
	vm.roleMenuList = [];
	vm.tree_data = [];
	
	vm.menuHtml = "";
	vm.roleStepHtml = "";
	vm.selectedList = [];
	vm.checkedStepId = [];
	var allStep = [];
	var indexStep = 0;
	vm.edit = false;
	
	if(CommonService.isNotEmpty($stateParams.ROLE_ID)){
		
		if ($stateParams.dataRole != undefined) {
			vm.role = $stateParams.dataRole;
			constructCheckedMenu();
		}
		else{
			getMenu($stateParams.ROLE_ID);
		}
			
		if($stateParams.STATE == CommonService.VIEWONLY){
			vm.viewOnly = true;
		}
		
		if($stateParams.STATE == CommonService.EDIT){
			vm.edit = true;
		}
		
		constructRoleMenu();
	}
	
	/**BUTTON**/
	vm.backToIndex = function() {
		backToIndex();
	}
	/*
	vm.saveRole = function(invalid) {
		var paramData = {role : vm.role};
		if (invalid == false) {
			showConfirmation()
			.then(function(result) {
                if (vm.role.ROLE_ID != undefined) {
					vm.role.CTL_UPD_BY = CommonService.getUsername();
                    CommonService.createResource('role/' + vm.role.ROLE_ID, paramData)
				    .then(function(result){
					   backToIndex();
				    });
                } else {
					vm.role.CTL_INS_BY = CommonService.getUsername();
                    CommonService.createResource('role', paramData)
                    .then(function(result){
					   backToIndex();
					});
				    
                }
			});
		}
	}
	*/
	
	//edit Rochiyat 
	vm.saveRole = function(invalid) {
		var paramData = {role : vm.role};
		if (invalid == false) {
			showConfirmation()
			.then(function(result) {
                if (vm.role.ROLE_ID != undefined) {
					vm.role.CTL_UPD_BY = CommonService.getUsername();
                    CommonService.createResource('role/' + vm.role.ROLE_ID, paramData)
				    .then(function(result){
					   backToIndex();
				    });
                } else {
                	if(vm.role.ROLE_NAME != undefined && vm.role.ROLE_DESC != undefined){
                		//check special characters
                		if(CommonService.isSpeChars(vm.role.ROLE_NAME))
                			CommonService.modalAlert("WARNING", "Title Must not contain special characters");
                		else if(CommonService.isSpeChars(vm.role.ROLE_DESC))
                			CommonService.modalAlert("WARNING", "Description Must not contain special characters");
                		else{
                			vm.role.CTL_INS_BY = CommonService.getUsername();
                    		CommonService.createResource('role', paramData)
                    		.then(function(result){
                    			backToIndex();
                    		});
                		}
                		
                	} else
                		CommonService.modalAlert('Error', 'Title and Description Required!');
                }
			});
		}
	}
	
	vm.updateMenu = function(){
		showConfirmation()
		.then(function(result){
			var selectedMenu = getSelectedMenu();
			var paramData = {input : {roleId : vm.role.ROLE_ID, menus : selectedMenu}};
//			CommonService.exec("soa.entity.role:doUpdateRoleMenu", paramData)
//			.then(function(result){
//				backToIndex();
//			});
		});
	}
	
	function getSelectedMenu(){
		var selectedNodes = [];
		ivhTreeviewBfs(vm.roleMenuList, function(node) {
			//check in selected first
			if(node.SELECTED) {
				selectedNodes.push(node.ID);
			}//check if the child is selected
			else if(node.__ivhTreeviewIndeterminate){
				selectedNodes.push(node.ID);
			}
		  
		})
		return selectedNodes;
	}
	
	vm.updateRoleStep = function(){
		var paramData = {input : {ROLE_ID : vm.role.ROLE_ID, steps : vm.checkedStepId}};
		showConfirmation()
		.then(function(result){
//			CommonService.exec("soa.entity.role:doUpdateRoleStep", paramData)
//			.then(function(result){
//				backToIndex();
//			});
		})
	}
	
	function showConfirmation(){
		return CommonService.modalAlert('confirmation', 'Are you sure want to submit this data?');
	}
	
	/**SERVICE**/
	function getMenu(roleId){
		CommonService.listResource('role/'+roleId)
		.then(function(data){
			vm.role = data.dataRole;
			constructCheckedMenu();
		});
	}
	
	function constructRoleMenu(){
		var paramData = {input : {ROLE_ID : $stateParams.ROLE_ID}};
//			CommonService.exec("soa.entity.role:constructRoleMenu", paramData)
//			.then(function(data){
//				vm.roleMenuList = data.output.roleMenuList;
//				constructRoleStep();
//			});
	}
	
	function constructRoleStep(){
		var paramData = {input : {ROLE_ID : $stateParams.ROLE_ID}};
//			CommonService.exec("soa.entity.role:constructRoleStep", paramData)
//			.then(function(data){
//				vm.roleStepList = data.output.roleStepList
//				vm.roleStepHtml = createGenericTable(["Action","Step"], "vm.roleStepList", implementStepTbody(vm.roleStepList));
//			});
	}
	
	/**util**/
	
	function constructCheckedMenu(){
		if(CommonService.isListNotEmpty(vm.role.MENU_IDS)){
			vm.checkedMenu = vm.role.MENU_IDS;
		}
	}
	
	function createGenericTable(columns, vmModel, implementTbody){
		var body = "";
		body += TemplateService.openDiv("table-responsive");
			body += TemplateService.createTableWithNgRepeat("table table-striped table-hover", columns, vmModel, implementTbody);
		body += TemplateService.closeDiv();
		return body;
	}
	
	function implementStepTbody(list){
		var table = "";
		if(CommonService.isListNotEmpty(list)){
			for(var i=0;i<list.length;i++){
				var step = list[i];
//				allStep[indexStep++] = step;
				table += constructStep(step, 0);
			}
		}
		return table;
	}
	
	function constructStep(step, paddingLeft){
		var table = "";
		if(!step.CTX_STEP_ID){
			table += "<tr>"+TemplateService.openCloseTd("") + TemplateService.openCloseTd("<b>"+step.PROCESS_LABEL+"</b>")+"</tr>";
			if(CommonService.isListNotEmpty(step.children)){
				for(var i=0; i<step.children.length; i++){
					var stepChildren = step.children[i];
					allStep[indexStep] = stepChildren;
					table += constructStep(stepChildren, paddingLeft+2);	//recursive method
					indexStep++;
				}
			}
		}
		else{
			table += createRowStep(step, paddingLeft, indexStep);
		}
		return table;
	}
	
	function createRowStep(step, paddingLeft, index){
		var i = checkPaddingLeft(paddingLeft);
		vm.checkedStepId.push(step);
		if(step.SELECTED == "1"){
			vm.selectedList[index] = true;
		}
		return "<tr>"
			+ TemplateService.openCloseTd("<input type='checkbox' ng-model='vm.selectedList["+index+"]' type='checkbox'"
			+ " ng-click='$event.stopPropagation(); vm.selectStep(vm.selectedList["+index+"], "+index+")' />","padding-left:"+i+"em")
			+ TemplateService.openCloseTd(step.STEP_LABEL + " " + step.TYPE, "padding-left:"+i+"em")
			+ "</tr>"
	}
	
	vm.selectStep = function(state, index){
		var step = allStep[index];
		step.SELECTED = chooseSelected(state);
		//CommonService.checkUncheckBox(vm.checkedStepId, state, step);
	}
	
	/*
	vm.checkSpeCharts = function(name, description){
		if(CommonService.isSpeChars(name))
			CommonService.modalAlert("Error", "Title Must not contain special characters");
		if(CommonService.isSpeChars(description))
			CommonService.modalAlert(WARNING, "Description Must not contain special characters");
	}
	*/
	
	function backToIndex(){
		window.history.back();
	}
	
	function checkPaddingLeft(paddingLeft){
		return (paddingLeft != undefined && paddingLeft > 0 ? paddingLeft : 0);
	}
	
	function chooseSelected(state){
		return state ? "1" : "0";
	}
	
}]);
