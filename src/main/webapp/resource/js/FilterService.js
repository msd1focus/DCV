App.factory('FilterService', ['CommonService',function(CommonService){
	
	function isDate(value){
		if(value != undefined
			&& value == 'date'){
			return true;
		}
		return false;
	}
	
	return {
		ADM_DEALER : "ADM_DEALER",
		ADM_PARAM : "ADM_PARAM",
		T_DOC_ENTRY : "T_DOC_ENTRY",
		
		createObject : function(label, value){
			var object = {name : label, id : value};
			return object;
		},
		
		getOperators : function(){
			var operators = [];
			operators.push(this.createObject('CONTAINS', 'CONTAINS'));
			operators.push(this.createObject('NOT CONTAINS', 'NOTCONTAINS'));
			operators.push(this.createObject('EQUAL','='));
			operators.push(this.createObject('NOT EQUAL','!='));
			operators.push(this.createObject('LESS THAN','<'));
			operators.push(this.createObject('LESS THAN OR EQUAL','<='));
			operators.push(this.createObject('GREATER THAN','>'));
			operators.push(this.createObject('GREATER THAN OR EQUAL','>='));
			operators.push(this.createObject('IS NULL','ISNULL'));
			operators.push(this.createObject('IS NOT NULL','ISNOTNULL'));
			operators.push(this.createObject('BETWEEN','BETWEEN'));
			return operators;
		},
		
		removeFilter : function(idx, filters){
			//assign value to index
			if(idx > -1){
				filters.splice(idx, 1);
			}
		},
		
		constructFilterList : function(filters){
			var filterList = [];
			if(CommonService.isListNotEmpty(filters)){
				for(var i=0; i<filters.length; i++){
					var filter = {};
					
					filter["column"] = filters[i].column.SEARCH_COLUMN_VALUE;
					filter["columnType"] = filters[i].column.SEARCH_COLUMN_TYPE;
					filter["operator"] = filters[i].operator.id;
					
					filter["value1"] = filters[i].value1;
					filter["value2"] = filters[i].value2;
					if(isDate(filter.columnType)){
						filter["value1"] = CommonService.parsingDateOnly(filters[i].value1);
						filter["value2"] = CommonService.parsingDateOnly(filters[i].value2); 
					}
					else{
						
					}
					filterList.push(filter);
				}
			}
			return filterList;
		}
		
	};
	
}]);