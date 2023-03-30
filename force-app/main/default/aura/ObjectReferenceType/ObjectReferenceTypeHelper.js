({    
    initMethods: function(component, event, helper) {        
        //console.log('In initializeValues')   
        //console.log('In setValues')
        //console.log('devValue string ::: ', component.get("v.mappingRuleDetail.Dev_value__c"))
        if(component.get("v.mappingRuleDetail.Dev_value__c") != undefined 
           && component.get("v.mappingRuleDetail.Dev_value__c") != "" )
        {
            helper.setValues(component, event, helper);
        }
        else
        {
            helper.getAllReferenceObjectNamesHelper(component, event, helper);                          
        }
    },
    
    getAllReferenceObjectNamesHelper: function(component, event, helper) 
    {
        //console.log('In getAllReferenceObjectNamesHelper')
        var action = component.get("c.getAllReferenceObjectNames");
        if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce'){
            action.setParams({
                "objectName" : component.get("v.contractRuleDetail.Target_Object__c")
            });
        }
        else{
            action.setParams({
                "objectName" : component.get("v.contractRuleDetail.Source_Object__c")
            });  
        }
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                if(storeResponse.length>0)
                {                    
                    component.set("v.allObjectsList",storeResponse);                        
                    //console.log('allObjectsList ::: '+ JSON.stringify(component.get("v.allObjectsList")))                    
                }
                helper.getMappingObjectFields(component, event, helper);        
                
                if(component.get("v.mappingRuleDetail.Dev_value__c") != undefined 
                   && component.get("v.mappingRuleDetail.Dev_value__c") != "" )
                {
                    component.set("v.isDisabledSalesforceField",false);
                    component.set("v.isDisabledReturnField",false);
                }
                else{
                    component.set("v.isDisabledSalesforceField",true);
                    component.set("v.isDisabledReturnField",true);
                }
            }
        });
        $A.enqueueAction(action);
        
    },
    
    getMappingObjectFields: function(component, event, helper) 
    {
        //console.log('In getMappingObjectFields')
        
        var fieldType = '';
        if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce' )
            fieldType = 'REFERENCE';
        else
            fieldType = 'REFERENCE';            
        
        var action = component.get("c.getMappingObjectAndFieldsDetails");
        action.setParams({
            "objectName": component.get("v.contractRuleDetail.Source_Object__c"),
            "dataStore": component.get("v.mappingContractDetail.Source_Datastore__c"),
            "type" : fieldType
            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                //console.log('storeResponse ::: '+ JSON.stringify(storeResponse))                    
                if(storeResponse.length>0)
                {
                    component.set("v.mappingObjectDetails",storeResponse[0]);
                    //console.log('storeResponse ::: ' , storeResponse)
                    
                    var mappingObjectFieldsList = [];
                    for(var i = 0 ; i < storeResponse[1].length ; i++ )
                    {
                        mappingObjectFieldsList.push(
                            {
                                'label': storeResponse[1][i].Name,
                                'value': storeResponse[1][i].Name
                            }
                        );
                    }
                    
                    if(mappingObjectFieldsList.length > 0){
                        mappingObjectFieldsList.sort(function(a,b) {
                            var t1 = a.label == b.label, t2 = a.label < b.label;
                            return t1? 0: (mappingObjectFieldsList?-1:1)*(t2?1:-1);
                        });
                    }
                    //console.log('mappingObjectFieldsList ::: ' , mappingObjectFieldsList)
                    
                    component.set("v.mappingObjectFieldsList",mappingObjectFieldsList);  
                    
                    
                    
                    if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce' ){
                        helper.getTargetMappingObjectFields(component, event, helper);
                        window.setTimeout(
                            $A.getCallback(function() {
                                if(component.find("mappingObjectField")!= undefined){
                                    component.find("mappingObjectField").focus();
                                }
                            }), 1
                        );
                    }
                    else
                    {
                        component.set("v.loadingSpinner",false);
                    }
                }                                                   
            }
        });
        $A.enqueueAction(action);
        
    },
    
    getTargetMappingObjectFields: function(component, event, helper) 
    {
        //console.log('In getTargetMappingObjectFields')
        
        var fieldType = 'REFERENCE';
        
        var action = component.get("c.getMappingObjectAndFieldsDetails");
        action.setParams({
            "objectName": component.get("v.contractRuleDetail.Target_Object__c"),
            "dataStore": component.get("v.mappingContractDetail.Target_Datastore__c"),
            "type" : fieldType
            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                //console.log('storeResponse ::: '+ JSON.stringify(storeResponse))                    
                if(storeResponse.length>0)
                {
                    component.set("v.targetMappingObjectDetails",storeResponse[0]);
                    //console.log('targetMappingObjectDetails ::: ' , storeResponse[0])
                    
                    var targetMappingObjectFieldsList = [];
                    for(var i = 0 ; i < storeResponse[1].length ; i++ )
                    {
                        targetMappingObjectFieldsList.push(
                            {
                                'label': storeResponse[1][i].Name,
                                'value': storeResponse[1][i].Name
                            }
                        );
                    }
                    
                    if(targetMappingObjectFieldsList.length > 0){
                        targetMappingObjectFieldsList.sort(function(a,b) {
                            var t1 = a.label == b.label, t2 = a.label < b.label;
                            return t1? 0: (targetMappingObjectFieldsList?-1:1)*(t2?1:-1);
                        });
                    }
                    //console.log('targetMappingObjectFieldsList ::: ' , targetMappingObjectFieldsList)
                    
                    component.set("v.targetMappingObjectFieldsList",targetMappingObjectFieldsList);  
                    
                    component.set("v.loadingSpinner",false);                                        
                }                                                   
            }
        });
        $A.enqueueAction(action);
        
    }, 
    
    onPressKeyboardKey: function (component, event, helper) {
        var keyValue = event.which;  
        
        if (keyValue == 27) {
            var triggerCancelEvent = component.getEvent("triggerCancelEvent");
            triggerCancelEvent.setParams({
                "isCancelButtonClicked" : "true" ,
                "type" : "Object Reference"
            });
            triggerCancelEvent.fire();           
        }
    },
    handleObjectNameChangeHelper: function(component, event, helper) {        
        
        //console.log('In handleObjectNameChangeHelper')
        var action = component.get("c.getObjectFieldsAndFieldTypes");
        action.setParams({
            "objectName": component.get("v.objectName")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();                
                if(storeResponse.length>0)
                {                    
                    //console.log('storeResponse ::: ' , storeResponse)
                    
                    var salesforceFieldsList = [];
                    for(var i = 0 ; i < storeResponse[0].length ; i++ )
                    {
                        salesforceFieldsList.push(
                            {
                                'label': storeResponse[0][i],
                                'value': storeResponse[0][i]
                            }
                        );
                    }
                    var fieldsAndTypesMap = new Map();                                        
                    for(var i = 0 ; i < storeResponse[1].length ; i++ )
                    {
                        var tempVar = JSON.parse(storeResponse[1][i]);                        
                        fieldsAndTypesMap.set(storeResponse[0][i],tempVar[storeResponse[0][i]]);                                                
                    }
                    component.set("v.fieldsAndTypesMap",fieldsAndTypesMap);
                    //console.log('fieldsAndTypesMap ::: ' , fieldsAndTypesMap.get('Id'))
                    if(salesforceFieldsList.length > 0){
                        salesforceFieldsList.sort(function(a,b) {
                            var t1 = a.label == b.label, t2 = a.label < b.label;
                            return t1? 0: (salesforceFieldsList?-1:1)*(t2?1:-1);
                        });
                    }
                    
                    component.set("v.salesforceFieldsList",salesforceFieldsList);
                    component.set("v.returnFieldsList",salesforceFieldsList);
                    component.set("v.filterConditionFieldsList",salesforceFieldsList);
                    
                }                                                   
            }
        });
        $A.enqueueAction(action);
        
    },
    
    handleRadioButtonChangeHelper: function(component, event, helper) {                
        var selectedRadioButton = event.getSource().get("v.name");                       
        if (selectedRadioButton == "All") {
            component.set("v.isAndCondition", true);
            component.set("v.isOrCondition", false);
            component.set("v.isCustomCondition", false);
            component.set("v.selectedRadioValue", "AND");
            component.set("v.customConditionValue", "");
            component.set("v.customConditionError", "");            
        }
        if (selectedRadioButton == "Any") {
            component.set("v.isAndCondition", false);
            component.set("v.isOrCondition", true);
            component.set("v.isCustomCondition", false);
            component.set("v.selectedRadioValue", "OR");
            component.set("v.customConditionValue", "");
            component.set("v.customConditionError", "");            
        }
        if (selectedRadioButton == "Custom") {
            component.set("v.isAndCondition", false);
            component.set("v.isOrCondition", false);
            component.set("v.isCustomCondition", true);
            component.set("v.selectedRadioValue", "CUSTOM");                
        }        
    },
    
    setValues: function(component, event, helper) 
    {             
        //console.log('In setValues')
        //console.log('devValue string ::: ', component.get("v.mappingRuleDetail.Dev_value__c"))        
        if(component.get("v.mappingRuleDetail.Dev_value__c") != undefined 
           && component.get("v.mappingRuleDetail.Dev_value__c") != "" )
        {
            //console.log('In')
            var devValue = JSON.parse(component.get("v.mappingRuleDetail.Dev_value__c"));
            //console.log('devValue ::: ' , devValue)
            
            helper.getMappingObjectFields(component, event, helper);         
            
            //console.log('devValue MappingObjectField ::: ',devValue.MappingObjectField);
            component.set("v.mappingObjectFieldValue",devValue.MappingObjectField);  
            
            //console.log('devValue LookupField ::: ',devValue.LookupField);
            component.set("v.selectedObjectLookupValue",devValue.LookupField);            
            if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce')
            {
                var selectedLookupList = (component.get("v.selectedObjectLookupValue")).split('.');
                
                var currentObjectNameTemp = selectedLookupList[selectedLookupList.length-2];
                //console.log('currentObjectNameTemp ::: ' , currentObjectNameTemp)
                var currentObjectName = '';
                
                if(currentObjectNameTemp == 'Parent')
                    currentObjectNameTemp =  selectedLookupList[selectedLookupList.length-3];
                //console.log('currentObjectNameTemp 1::: ' , currentObjectNameTemp)
                
                if(currentObjectNameTemp.includes('__r')){
                    //console.log('currentObjectNameTemp ::: ' , currentObjectNameTemp)
                    currentObjectName = currentObjectNameTemp.replace("__r", "__c");                
                }
                else
                    currentObjectName = currentObjectNameTemp;
                
                //console.log('currentObjectName ::: ' , currentObjectName)                
                helper.getReturnFieldNameList(component,event,helper,currentObjectName);
                
                //console.log('devValue ReturnField ::: ',devValue.ReturnField);
                component.set("v.returnField",devValue.ReturnField);                        
            }
            //console.log('devValue FilterType ::: ',devValue.FilterType);
            var filterType = devValue.FilterType;
            switch (filterType)
            {
                case 'AND' :
                    component.set("v.isAndCondition",true);                    
                    break;
                case 'OR' :
                    component.set("v.isOrCondition",true);
                    break;
                case 'CUSTOM':
                    component.set("v.isCustomCondition",true);
                    component.set("v.customConditionValue",devValue.CustomValue);
                    break;
            }
            component.set("v.selectedRadioValue",filterType);
            //console.log('devValue FilterConditions ::: ',devValue.FilterConditions);
            if((devValue.FilterConditions).length>0){
                component.set("v.objectReferenceConditionsList",devValue.FilterConditions);
            }                       
            //console.log(component.get("v.objectReferenceConditionsList"))
        }
    },
    
    getReturnFieldNameList: function(component, event, helper,currentObjectName) 
    {        
        //console.log('In getReturnFieldNameList')        
        var objectNameList = [];
        objectNameList.push(currentObjectName);
        //console.log("objectNameList ::: ",objectNameList)
        var action = component.get("c.getAllFieldsNameList");
        action.setParams({
            "objectName": currentObjectName
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();                        
            if (state === "SUCCESS") 
            {
                var returnFieldsResponse = response.getReturnValue();    
                //console.log('returnFieldsResponse ::: ' , returnFieldsResponse)
                var returnFieldsList = [];
                ////console.log('FieldsList ::: ', returnFieldsResponse[currentObjectName+'-1']);
                //var FieldsList = returnFieldsResponse[currentObjectName]+'-1' ;
                for(var i = 0 ; i < returnFieldsResponse.length ; i++ )
                {
                    //console.log('FieldsList [i] ::: ' , returnFieldsResponse[i]);
                    //var fieldDetailsList = (FieldsList[i]).split('--');
                    returnFieldsList.push({
                        'label':returnFieldsResponse[i],
                        'value':returnFieldsResponse[i]
                    });
                }
                returnFieldsList.sort(function(a,b) {
                    var t1 = a.label == b.label, t2 = a.label < b.label;
                    return t1? 0: (returnFieldsList?-1:1)*(t2?1:-1);
                });
                component.set("v.returnFieldsList",returnFieldsList);
                
            }
        });
        $A.enqueueAction(action);
    },
    
    //used
    addFilterRule: function(component, event, helper) {
        var defaultvalue = false;
        var selectedObject = component.get("v.objectName");
        //console.log('selectedObject ::: ' , selectedObject)
        if (selectedObject == "") {
            defaultvalue = true;
        }
        var objectReferenceConditionsList = component.get("v.objectReferenceConditionsList");
        objectReferenceConditionsList.push({
            'Field': '',  
            'FieldError':'',
            'isFieldDisabled':defaultvalue,
            'FieldDataType':'',
            'Operator': '',
            'OperatorSymbol': '',
            'OperatorError': '',
            'isOperatorDisabled': true,
            'Type': '',
            'TypeError': '',
            'isTypeDisabled': true,            
            'Value': '',
            'ValueError': '',
            'isValueDisabled': true
        });
        //console.log('objectReferenceConditionsList ::: ' , JSON.stringify(objectReferenceConditionsList))
        component.set("v.objectReferenceConditionsList", objectReferenceConditionsList);
    },
    
    //used
    handleCustomeConditionChangeHelper: function(component, event, helper) {
        //console.log('Innn')
        
    },
    //used
    onChangeFieldHelper: function(component, event, helper) {
        //console.log('In onChangeFieldHelper ' )
        
        component.set("v.isLookupValue",false);
        component.set("v.isFieldFilterCondition",true);
        
        var index = event.currentTarget.dataset.id;
        var objectReferenceConditionsList = component.get("v.objectReferenceConditionsList");
        
        component.set("v.selectedFieldFromParent", objectReferenceConditionsList[index].Field);                
        component.set("v.currentDatatype",'');
        
        component.set("v.currentObjectReferenceRow",Number(index));
        component.set("v.openFieldSelector",true);
        
        /*
        var index = event.currentTarget.dataset.value;
        //console.log('index ::: ' , index)
        var objectReferenceConditionsList = component.get("v.objectReferenceConditionsList");
        var selectedFieldName = objectReferenceConditionsList[index].Field;
        objectReferenceConditionsList[index].FieldError = "";
        objectReferenceConditionsList[index].isFieldDisabled =false;
        
        var objectName = component.get("v.objectName");
        //console.log('objectName ::: ' + objectName)
        //console.log('selectedFieldName ::: ' + selectedFieldName)
        if (selectedFieldName != "") 
        {
            //console.log('In if')
            //console.log('selectedFieldName ::: ' , selectedFieldName);
            //console.log('fieldsAndTypesMap ::: ' , component.get("v.fieldsAndTypesMap"))
            var selectedFieldTypeTemp = component.get("v.fieldsAndTypesMap").get(selectedFieldName);
            var selectedFieldType = selectedFieldTypeTemp.toLowerCase();
            //console.log('selectedFieldType ::: ' , selectedFieldType);
            objectReferenceConditionsList[index].FieldDataType = selectedFieldType;            
            objectReferenceConditionsList[index].isOperatorDisabled = false;
            objectReferenceConditionsList[index].isTypeDisabled = true;
            objectReferenceConditionsList[index].isValueDisabled = true;
            objectReferenceConditionsList[index].Type = "";
            objectReferenceConditionsList[index].Operator = "";
            objectReferenceConditionsList[index].Value = "";
            //console.log('objectReferenceConditionsList ::: ' + JSON.stringify(objectReferenceConditionsList));                        
            objectReferenceConditionsList[index].FieldDataType = selectedFieldType;                                    
            //console.log('objectReferenceConditionsList ::: ' + JSON.stringify(objectReferenceConditionsList))
            component.set("v.objectReferenceConditionsList", objectReferenceConditionsList);
            //component.set("v.isdisabled", false);
        }
        else
        {
            //console.log('In else')
            objectReferenceConditionsList[index].FieldDataType = '';            
            objectReferenceConditionsList[index].isOperatorDisabled = true;
            objectReferenceConditionsList[index].isTypeDisabled = true;
            objectReferenceConditionsList[index].isValueDisabled = true;
            objectReferenceConditionsList[index].Type = "";
            objectReferenceConditionsList[index].Operator = "";
            objectReferenceConditionsList[index].Value = "";
            //console.log('objectReferenceConditionsList ::: ' + objectReferenceConditionsList)
            component.set("v.objectReferenceConditionsList", objectReferenceConditionsList);
        }       */ 
    },
    //used
    onChangeOperatorHelper: function(component, event) {
        var index = event.currentTarget.dataset.value;
        var objectReferenceConditionsList = component.get("v.objectReferenceConditionsList");
        objectReferenceConditionsList[index].isOperatorError = "";
        var selectedOperator = objectReferenceConditionsList[index].Operator;
        if (selectedOperator == "") 
        {
            objectReferenceConditionsList[index].isTypeDisabled = true;
            objectReferenceConditionsList[index].isValueDisabled = true;
            objectReferenceConditionsList[index].Type = "";
        } else 
        {
            
            objectReferenceConditionsList[index].OperatorError = "";
            objectReferenceConditionsList[index].Type = "";
            objectReferenceConditionsList[index].isTypeDisabled = false;
        }
        component.set("v.objectReferenceConditionsList", objectReferenceConditionsList);
    },
    //used
    onChangeTypeHelper: function(component, event, helper) {
        var index = event.currentTarget.dataset.value;
        var objectReferenceConditionsList = component.get("v.objectReferenceConditionsList");
        var selectedOperator = objectReferenceConditionsList[index].Type;
        objectReferenceConditionsList[index].TypeError = "";
        if (selectedOperator == "") {
            objectReferenceConditionsList[index].isValueDisabled = true;
            objectReferenceConditionsList[index].Value = "";
        } else {
            objectReferenceConditionsList[index].isValueDisabled = false;
            objectReferenceConditionsList[index].Value = "";
        }
        component.set("v.objectReferenceConditionsList", objectReferenceConditionsList);
    },
    //used
    onChangeValueHelper: function(component, event, helper) {
        //console.log('In onChangeValueHelper')
        var objectReferenceConditionsList = component.get("v.objectReferenceConditionsList");
        var index = event.currentTarget.dataset.value;
        if(objectReferenceConditionsList[index].Type != 'direct'){
            component.set("v.isLookupValue",false);
            component.set("v.isFieldFilterCondition",false);
            component.set("v.isValueFilterCondition",true);        
            
            var objectReferenceConditionsList = component.get("v.objectReferenceConditionsList");
            
            component.set("v.selectedFieldFromParent", objectReferenceConditionsList[index].Value);                
            component.set("v.currentDatatype",'');            
            component.set("v.currentObjectReferenceRow",Number(index));
            component.set("v.openFieldSelector",true);
        }
        
        objectReferenceConditionsList[index].ValueError = "";
        component.set("v.objectReferenceConditionsList", objectReferenceConditionsList);                                
    },
    //used
    removeFilterRule: function(component, event, helper) {
        var modifiedobjectReferenceConditionsList = component.get("v.objectReferenceConditionsList");
        var selectedItem = event.currentTarget;
        var index = selectedItem.dataset.id;
        modifiedobjectReferenceConditionsList.splice(index, 1);
        var finalFilterList = JSON.parse(JSON.stringify(modifiedobjectReferenceConditionsList));
        component.set("v.objectReferenceConditionsList", finalFilterList);
    },
    //used
    validateExpressionHelper: function(component, event, helper) {
        var FormulaType = event.getParam("type");
        var sectionType = event.getParam("section");
        component.set("v.SectionType", sectionType);
        if (FormulaType == 'Object Reference') {
            helper.setObjectReferenceValue(component, event, helper);
        }
    },
    /*
    //used
    setObjectReferenceValue: function(component, event, helper) {
        //console.log('In setObjectReferenceValue')
        
        var sourceObject = component.get("v.selectedObjectValue");                                        
        //console.log('1')
        var filterValues = component.get("v.ObjectReferenceList");
        var radiovalue = component.get("v.radioValue");
        var customValue = component.get("v.customConditionValue").trim();
        var checkFlag = true;
        var checkFlag1 = true;        
        
        //console.log('2')
        if (sourceObject == "") {
            //console.log('22')
            component.set('v.ObjectSelectionError', "slds-has-error");
            checkFlag = false;
        }
        if (component.get("v.selectedKeyField") == "") {
            //console.log('22')
            component.set('v.keySelectionError', "slds-has-error");
            checkFlag = false;
        }
        if (component.get("v.selectedValueField") == "") {
            //console.log('22')
            component.set('v.valueSelectionError', "slds-has-error");
            checkFlag = false;
        }
        if (component.get("v.objectFieldsValue") == "") {
            //console.log('22')
            component.set('v.objectFieldError', "slds-has-error");
            checkFlag = false;
        }
        //console.log('3')
        
        //console.log('4')
        if (!helper.CheckFilterConditionValues(component, event, helper, filterValues)) {
            //console.log('44')
            checkFlag = false;
        }
        //console.log('5')
        if (filterValues.length > 1 && radiovalue == "None") {
            //console.log('55')
            checkFlag = false;
            checkFlag1 = false;
        }
        //console.log('6')
        if (radiovalue == "CUSTOM" && component.get("v.customConditionValue") == "") {
            //console.log('66')
            component.set('v.customConditionValidError', "slds-has-error");
            checkFlag = false;
        }
        
        //console.log('8')
        //console.log('checkFlag ::: ' , checkFlag )
        if (checkFlag  )
        { //&& !requiredFlag
            //console.log('11')
            if (!helper.CheckObjectReferenceFilterValueDuplicate(component, event, helper, filterValues)) 
            {
            	//console.log('12')
                var devValueContent = [];
                if (radiovalue != 'CUSTOM') 
                {
                    //console.log('13')
                    var filterConditions = [];
                    var filterConditionsResults = "";
                    var j = 0;
                    let filterFinalValues = component.get("v.filterFinalValues");
                    var filterFinalValuesLength = filterFinalValues.length;
                    for (var i = 0; i < filterFinalValuesLength; i++) {
                        var filterConditions = [];
                        var temp = filterFinalValues[i].split(".");
                        if (i < 3) {
                            if (temp[1] == 'LIKE') {
                                filterConditions[1] = 'Contains';
                            } else {
                                if (temp[1] == 'LIKES') {
                                    filterConditions[1] = 'Starts With';
                                } else {
                                    if (temp[1] == 'LIKEW') {
                                        filterConditions[1] = 'Ends With';
                                    } else {
                                        filterConditions[1] = temp[1];
                                    }
                                }
                            }
                            j++;
                        }
                        if (i == filterFinalValues.length - 1)
                            filterConditionsResults = filterConditionsResults + "" + temp[0].trim() + ' ' + filterConditions[1] + ' ' + temp[2].trim() + "";
                        else
                            filterConditionsResults = filterConditionsResults + "" + temp[0].trim() + ' ' + filterConditions[1] + ' ' + temp[2].trim() + "" + " " + radiovalue + " ";
                    }
                    var selectedFieldsString = '';
                    var selectedKeyField = component.get("v.selectedKeyField");
                    var selectedValueField = component.get("v.selectedValueField");                    
                    selectedFieldsString = ' ' + selectedKeyField + ' , ' + selectedValueField + ' ' ;                    
                    //console.log('filterValues ::: ' + filterValues)
                    if(filterValues.length > 0)
                    {
                        selectedFieldsString = selectedFieldsString + ' , ';
                        for(var i=0 ;i< filterValues.length ; i++)
                        {
                            //console.log('filterValues [i]::: ' + JSON.stringify(filterValues[i]));
                            selectedFieldsString = selectedFieldsString + filterValues[i].Field;
                            if(i+1 != filterValues.length)
                                selectedFieldsString = selectedFieldsString + ' , ';
                        }
                    }
                    //console.log('selectedFieldsString ::: ' + selectedFieldsString);
                    
                    var DisplayValue = 'ObjectOf' + '(' + sourceObject + ')' + 'Filter Condition' + '(' + filterConditionsResults + ')'  + 'Field' + '(' + selectedFieldsString + ')';
                    //console.log('14 ::: Display value',DisplayValue)
                    
                    
                    var devValue = '';
                    
                    devValue = '{'+'\"DisplayValue\"'+':'+'\"'+DisplayValue+'\",';
                    devValue = devValue+'\"Object\"'+':'+'\"'+sourceObject+'\",';
                    devValue = devValue+'\"Fields\"'+':'+'\"'+selectedFieldsString+'\",';
                    devValue = devValue+'\"SAPField\"'+':'+'\"'+component.get("v.objectFieldsValue")+'\",';
                    devValue = devValue+'\"KeyField\"'+':'+'\"'+component.get("v.selectedKeyField")+'\",';
                    devValue = devValue+'\"ValueField\"'+':'+'\"'+component.get("v.selectedValueField")+'\",';
                    devValue = devValue+'\"FilterType\"'+':'+'\"'+radiovalue+'\",';
                    devValue = devValue+'\"FilterConditions\"'+':'+JSON.stringify(filterValues)+'}';
                    //console.log('devValue if not custom ::: ' + devValue);
                    
                    var appEvent = component.getEvent('saveTransformationEvent');
                    appEvent.setParams({
                        "type": "Object Reference",                        
                        "Selectedvalue": DisplayValue,//component.get("v.objectFieldsValue") ,
                        "DevValueContent": devValue,                        
                    });
                    appEvent.fire();
                } 
                else 
                {
                    //console.log('In custom')
                    
                    if (customValue != "") 
                    {
                        
                        //console.log('111')
                        if (helper.checkObjectReferenceCustomCondition(component, event, helper, customValue, filterValues) == true) {
                            //console.log('222')
                            var customValuereplaced = [];
                            var queryValueCondition = '';
                            var filterConditions = [];
                            var conditionsList = customValue.split(" ");
                            let filterFinalValues = component.get("v.filterFinalValues");
                            for (var i = 0; i < filterFinalValues.length; i++) {
                                var temp = filterFinalValues[i].split(".");
                                if (i < 3) {
                                    if (temp[1] == 'LIKE') {
                                        filterConditions[1] = 'Contains';
                                    } else {
                                        if (temp[1] == 'LIKES') {
                                            filterConditions[1] = 'Starts With';
                                        } else {
                                            if (temp[1] == 'LIKEW') {
                                                filterConditions[1] = 'Ends With';
                                            } else {
                                                filterConditions[1] = temp[1];
                                            }
                                        }
                                    }
                                    j++;
                                }
                                queryValueCondition = queryValueCondition + temp[0].trim() + ' ' + temp[1].trim() + ' ' + temp[2].trim() + '  ';
                            }
                            var selectedFieldsString = '';
                            var selectedKeyField = component.get("v.selectedKeyField");
                            var selectedValueField = component.get("v.selectedValueField");                    
                            selectedFieldsString = ' ' + selectedKeyField + ' , ' + selectedValueField + ' ' ;                    
                            //console.log('filterValues ::: ' + filterValues)
                            if(filterValues.length > 0)
                            {
                                selectedFieldsString = selectedFieldsString + ' , ';
                                for(var i=0 ;i< filterValues.length ; i++)
                                {
                                    //console.log('filterValues [i]::: ' + JSON.stringify(filterValues[i]));
                                    selectedFieldsString = selectedFieldsString + filterValues[i].Field;
                                    if(i+1 != filterValues.length)
                                        selectedFieldsString = selectedFieldsString + ' , ';
                                }
                            }
                            //console.log('selectedFieldsString ::: ' + selectedFieldsString);
                            
                            var DisplayValue = 'ObjectOf' + '(' + sourceObject + ')' + 'Filter Condition' + '(' + queryValueCondition + ')'  + 'Field' + '(' + selectedFieldsString + ')';
                            //console.log('14 ::: Display value',DisplayValue)
                            
                            var devValue = '';
                            
                            devValue = '{'+'"DisplayValue"'+':'+'"'+DisplayValue+'",';
                            devValue = devValue+'"Object"'+':'+'"'+sourceObject+'",';
                            devValue = devValue+'"Fields"'+':'+'"'+selectedFieldsString+'",';
                            devValue = devValue+'\"SAPField\"'+':'+'\"'+component.get("v.objectFieldsValue")+'\",';
                            devValue = devValue+'"KeyField"'+':'+'"'+component.get("v.selectedKeyField")+'",';
                            devValue = devValue+'"ValueField"'+':'+'"'+component.get("v.selectedValueField")+'",';
                            devValue = devValue+'"FilterType"'+':'+'"'+radiovalue+'",';
                            devValue = devValue+'"FilterConditions"'+':'+JSON.stringify(filterValues)+',';
                            devValue = devValue+'"CustomValue"'+':"'+customValue+'"}';
                            //console.log('devValue if custom ::: ' + devValue);
                            
                            var appEvent = component.getEvent('saveTransformationEvent');
                            appEvent.setParams({
                                "type": "Object Reference",                              
                                "Selectedvalue": DisplayValue,//component.get("v.objectFieldsValue"),
                                "DevValueContent": devValue,                                
                            });
                            appEvent.fire();
                        }
                        else 
                        {
                            component.set("v.customConditionValidError", "slds-has-error");
                        }
                    } else {
                        component.set("v.customConditionValidError", "slds-has-error");
                        helper.displayToast(component, event, helper, "error", "Please fill the custom formula");
                    }
                }
            }
            else
            {
                helper.displayToast(component, event, helper, "error", "Duplicate filter conditions.");
            }
        } 
        else
        {
            //console.log('9')
            if (!checkFlag1) 
            {
                component.set("v.filterConditionError", "slds-has-error");
            }
            if (!checkFlag || requiredFlag) 
            {
                helper.displayToast(component, event, helper, "error", 'Please fill all the required fields.');
            }
            else if (customFlag) 
            {
                helper.displayToast(component, event, helper, "error", 'Custom formula is incorrect.');
            }
        }
    },
    */
    //used
    checkObjectReferenceCustomCondition: function(component, event, helper, customValue, filterValues) {
        var result, str, domCntr = 0,
            cntr = 0;
        var logical_List = [];
        var _parenthesis = [];
        var isNumber = /[\d\.]+/;
        var _space = /\s/g;
        var isValidSet = true;
        var isSplChars = false;
        var isValidExp = true;
        result = customValue.trim();
        var letters = new RegExp(/^[0-9a-zA-Z()]+$/);
        if (!letters.test(result)) {
            isSplChars = true;
        }
        result = result.toUpperCase();
        result = result.replace(/AND/g, '*');
        result = result.replace(/OR/g, '+');
        result = result.replace(/NOT/g, '!');
        var _char = '';
        for (var p = 0; p < result.length; p++) {
            if (!isNaN(result[p])) {
                _char = _char + result[p]
            } else {
                logical_List.push({
                    "chars": _char.replace(/ /g, '')
                });
                _char = '';
                logical_List.push({
                    "chars": result[p]
                });
            }
        }
        if (_char != '') {
            logical_List.push({
                "chars": _char
            });
        }
        var key = logical_List.length;
        while (key--) {
            if (logical_List[key].chars == '') {
                logical_List.splice(key, 1);
            }
        }
        //unbalanced parenthesis
        for (var s = 0; s < logical_List.length; s++) {
            if (logical_List[s].chars == '(') {
                cntr++;
            }
            if (logical_List[s].chars == ')') {
                cntr--;
                if (cntr == 0) {
                    if ((s + 1) < logical_List.length) {
                        _parenthesis.push({
                            "val": logical_List[s + 1].chars
                        });
                    }
                }
            }
            if (!isNaN(logical_List[s].chars)) {
                if (parseInt(logical_List[s].chars) > parseInt(filterValues.length)) {
                    isValidSet = false;
                } else if (parseInt(logical_List[s].chars) == 0) {
                    isValidSet = false;
                }
            }
        }
        
        for (var e = 0; e < _parenthesis.length; e++) {
            if (_parenthesis[e].val == '+' || _parenthesis[e].val == '*') {
                domCntr++;
            }
        }
        for (var q = 0; q < logical_List.length; q++) {
            
            //operators
            if (isSplChars) {
                isValidExp = false;
                component.set("v.customConditionError",'slds-has-error');
                component.set("v.isErrorFound","true");    
                return ' Custome condition';                                        
                //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                return false;
                break;
            }
            //unexpected characters
            if (result.match(/[a-z]/i)) {
                isValidExp = false;
                component.set("v.customConditionError",'slds-has-error');
                component.set("v.isErrorFound","true");    
                return ' Custome condition';                                        
                //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                return false;
                break;
            }
            //unavailable set in expression
            if (!isValidSet) {
                isValidExp = false;
                component.set("v.customConditionError",'slds-has-error');
                component.set("v.isErrorFound","true");    
                return ' Custome condition';                                        
                //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                break;
            }
            //space not allowed
            if (_space.test(result)) {
                isValidExp = false;
                component.set("v.customConditionError",'slds-has-error');
                component.set("v.isErrorFound","true");    
                return ' Custome condition';                                        
                //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                break;
            }
            //unbalanced parenthesis
            if (cntr != 0) {
                isValidExp = false;
                component.set("v.customConditionError",'slds-has-error');
                component.set("v.isErrorFound","true");    
                return ' Custome condition';                                        
                //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                break;
            }
            //starts with
            if (result.startsWith('+') || result.startsWith('*')) {
                isValidExp = false;
                component.set("v.customConditionError",'slds-has-error');
                component.set("v.isErrorFound","true");    
                return ' Custome condition';                                        
                //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                break;
            }
            //ends with
            else if (result.endsWith('+') || result.endsWith('*') || result.endsWith('!')) {
                isValidExp = false;
                component.set("v.customConditionError",'slds-has-error');
                component.set("v.isErrorFound","true");    
                return ' Custome condition';                                        
                //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                break;
            }
            //Empty parenthesis
            if (logical_List[q].chars == "(") {
                if ((q + 1) < logical_List.length) {
                    if (logical_List[q + 1].chars == ')') {
                        isValidExp = false;
                        component.set("v.customConditionError",'slds-has-error');
                        component.set("v.isErrorFound","true");    
                        return ' Custome condition';                                        
                        //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                        break;
                    }
                }
            }
            //NOT Validation
            if (logical_List[q].chars == "!") {
                if ((q + 1) < logical_List.length) {
                    if (logical_List[q + 1].chars != '(') {
                        isValidExp = false;
                        component.set("v.customConditionError",'slds-has-error');
                        component.set("v.isErrorFound","true");    
                        return ' Custome condition';                                        
                        //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                        break;
                    }
                }
                if (logical_List[q].chars == '!') {
                    if (q != 0) {
                        if (logical_List[q - 1].chars != '*' && logical_List[q - 1].chars != '+' && logical_List[q - 1].chars != '(') {
                            isValidExp = false;
                            component.set("v.customConditionError",'slds-has-error');
                            component.set("v.isErrorFound","true");    
                            return ' Custome condition';                                        
                            //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                            break;
                        }
                    }
                }
            }
            
            //Consequetive Operators
            if ((q + 1) < logical_List.length) {
                if (logical_List[q].chars == '+' || logical_List[q].chars == '*' || logical_List[q].chars == '!') {
                    if (logical_List[q + 1].chars == '+' || logical_List[q + 1].chars == '*') {
                        isValidExp = false;
                        component.set("v.customConditionError",'slds-has-error');
                        component.set("v.isErrorFound","true");    
                        return ' Custome condition';                                        
                        //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                        break;
                    }
                } else if (logical_List[q].chars != '+' && logical_List[q].chars != '*' && logical_List[q].chars != '!' && logical_List[q].chars != '(' && logical_List[q].chars != ')') {
                    if (logical_List[q + 1].chars != '+' && logical_List[q + 1].chars != '*' && logical_List[q + 1].chars != '!' && logical_List[q + 1].chars != '(' && logical_List[q + 1].chars != ')') {
                        isValidExp = false;
                        component.set("v.customConditionError",'slds-has-error');
                        component.set("v.isErrorFound","true");    
                        return ' Custome condition';                                        
                        //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                        break;
                    }
                }
            }
            
            //validation at open parenthesis
            if (logical_List[q].chars == '(') {
                if ((q + 1) < logical_List.length) {
                    if (logical_List[q + 1].chars == '*' || logical_List[q + 1].chars == '+') {
                        isValidExp = false;
                        component.set("v.customConditionError",'slds-has-error');
                        component.set("v.isErrorFound","true");    
                        return ' Custome condition';                                        
                        //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                        break;
                    }
                }
                if (q != 0) {
                    if (logical_List[q - 1].chars != '*' && logical_List[q - 1].chars != '+' && logical_List[q - 1].chars != '!' && logical_List[q - 1].chars != '(') {
                        isValidExp = false;
                        component.set("v.customConditionError",'slds-has-error');
                        component.set("v.isErrorFound","true");    
                        return ' Custome condition';                                        
                        //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                        break;
                    }
                }
            }
            
            //valdation at close parenthesis
            if (logical_List[q].chars == ')') {
                if ((q + 1) < logical_List.length) {
                    if (logical_List[q + 1].chars != '*' && logical_List[q + 1].chars != '+' && logical_List[q + 1].chars != ')') {
                        isValidExp = false;
                        component.set("v.customConditionError",'slds-has-error');
                        component.set("v.isErrorFound","true");    
                        return ' Custome condition';                                        
                        //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                        break;
                    }
                }
                if (q != 0) {
                    if (logical_List[q - 1].chars == '*' || logical_List[q - 1].chars == '+') {
                        isValidExp = false;
                        component.set("v.customConditionError",'slds-has-error');
                        component.set("v.isErrorFound","true");    
                        return ' Custome condition';                                        
                        //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                        break;
                    }
                }
            }
            
            //manage preference at *
            if (logical_List[q].chars == '*') {
                if ((q + 2) < logical_List.length) {
                    if (logical_List[q + 2].chars == '+') {
                        isValidExp = false;
                        component.set("v.customConditionError",'slds-has-error');
                        component.set("v.isErrorFound","true");    
                        return ' Custome condition';                                        
                        //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                        break;
                    }
                }
            }
            
            //manage preference at +
            if (logical_List[q].chars == '+') {
                if ((q + 2) < logical_List.length) {
                    if (logical_List[q + 2].chars == '*') {
                        isValidExp = false;
                        component.set("v.customConditionError",'slds-has-error');
                        component.set("v.isErrorFound","true");    
                        return ' Custome condition';                
                        
                        //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                        break;
                    }
                }
            }
            
            //manage preference in nested operation
            if (domCntr > 1) {
                isValidExp = false;
                //helper.displayToast(component, event, helper, "error", 'Invalid custom formula.');
                
                component.set("v.customConditionError",'slds-has-error');
                component.set("v.isErrorFound","true");    
                return ' Custome condition';                
                
                break;
            }
        }
        return '';
    },
    //used
    CheckObjectReferenceFilterValueDuplicate: function(component, event, helper, filterValues) {
        //console.log('In CheckObjectReferenceFilterValueDuplicate')
        //console.log('filterValues ::: ' + JSON.stringify(filterValues))
        var filterValuesLength = filterValues.length;
        var result = false;
        //console.log('111')
        for (let i = 0; i < filterValuesLength; i++) 
        {
            if(filterValues[i].Value != undefined && filterValues[i].Value != null)
            {
                filterValues[i].Value = (filterValues[i].Value).trim();
            }
        }
        //console.log('112')
        for (let i = 0; i < filterValuesLength; i++) 
        {
            for (let j = i + 1; j < filterValuesLength; j++) 
            {
                //console.log('filterValues[i] ::: ' + filterValues[i])
                //console.log('filterValues[j] ::: ' + filterValues[j])
                result = _.isEqual(filterValues[i], filterValues[j]);  
                //console.log('result ::: ' , result)
                if (result){
                    filterValues[i].ValueError = 'slds-has-error';
                    filterValues[j].ValueError = 'slds-has-error';                                        
                    break;
                }
            }
            if (result)
                break;
        }
        //console.log('113')
        //console.log('result ::: ' , result)
        //console.log('filterValues ::: ' , filterValues)
        if(result){
            component.set("v.objectReferenceConditionsList",filterValues);
        }
        return result;
    },   
    handleValidateTransformationValue: function(component, event, helper){
        //console.log('In handleValidateTransformationValue')
        var errorFieldsStr = '';        
        let errorFieldsSet = new Set()
        if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce')
        {
            if(component.get("v.mappingObjectFieldValue") == ''){
                component.set("v.mappingObjectFieldError", 'slds-has-error');            
                errorFieldsSet.add('Source Field'); 
            }
            else
            {
                component.set("v.mappingObjectFieldError", '');
            }  
        }
        
        //console.log('selectedObjectLookupValue ::: ',component.get("v.selectedObjectLookupValue"))
        if(component.get("v.selectedObjectLookupValue") == '' ||component.get("v.selectedObjectLookupValue") == undefined){
            component.set("v.selectedObjectLookupValueError", 'slds-has-error');        
            if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce')
                errorFieldsSet.add('Mapped Target Field');            
            else                    
                errorFieldsSet.add('Lookup Field');            
        }
        else
        {
            component.set("v.selectedObjectLookupValueError", '');
        }
        
        if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce')
        {
            if(component.get("v.returnField") == ''){
                component.set("v.returnFieldError", 'slds-has-error');            
                errorFieldsSet.add('Return Field');
            }
            else
            {
                component.set("v.returnFieldError", '');
            }
        }
        
        
        if(component.get("v.objectReferenceConditionsList").length > 0 )
        {
            var objectReferenceConditionsList = component.get("v.objectReferenceConditionsList");
            
            for(var i = 0 ; i < objectReferenceConditionsList.length ; i++ )
            {
                //console.log(JSON.stringify(objectReferenceConditionsList[i]))
                if(objectReferenceConditionsList[i].Field == ''){
                    objectReferenceConditionsList[i].FieldError = 'slds-has-error';                                        
                    errorFieldsSet.add('Field');
                }
                else
                {
                    objectReferenceConditionsList[i].FieldError = '';
                }
                
                if(objectReferenceConditionsList[i].Operator == ''){
                    objectReferenceConditionsList[i].OperatorError = 'slds-has-error';                                      
                    errorFieldsSet.add('Operator');                    
                }else
                {
                    objectReferenceConditionsList[i].OperatorError = '';
                }
                
                if(objectReferenceConditionsList[i].Type == ''){
                    objectReferenceConditionsList[i].TypeError = 'slds-has-error';                    
                    errorFieldsSet.add('Type');                    
                }
                else
                {
                    objectReferenceConditionsList[i].TypeError = '';
                }
                
                if(objectReferenceConditionsList[i].Value == ''){
                    objectReferenceConditionsList[i].ValueError = 'slds-has-error';                    
                    errorFieldsSet.add('Value');                    
                }     
                else
                {
                    objectReferenceConditionsList[i].ValueError = '';
                }
            }                                                            
            component.set("v.objectReferenceConditionsList" , objectReferenceConditionsList);
        }        
        var customErrorFieldsStr = '';
        if(component.get("v.selectedRadioValue")=='CUSTOM')
        {
            if(component.get("v.customConditionValue") == '' || component.get("v.customConditionValue") == undefined){
                errorFieldsSet.add('Custom Condition');
                component.set("v.customConditionError",'slds-has-error');
				customErrorFieldsStr = customErrorFieldsStr+'Custom condition is empty or invalid, Please provide valid condition.';                
            }
            else
            {
                var customError = helper.checkObjectReferenceCustomCondition(component, event, helper, component.get("v.customConditionValue") , component.get("v.objectReferenceConditionsList"));                
                if(customError == ' Custome condition'){
                    errorFieldsSet.add('Custom Condition');
                    component.set("v.customConditionError",'slds-has-error');
                    customErrorFieldsStr = customErrorFieldsStr+'Custom condition is empty or invalid, Please provide valid condition.';
                }
                else                                
                    component.set("v.customConditionError",'');            
            }
            
        }
        var duplicateFilterError = '';
        var isDuplicateFilterCondition = helper.CheckObjectReferenceFilterValueDuplicate(component, event, helper , component.get("v.objectReferenceConditionsList"));
        //console.log('isDuplicateFilterCondition ::: ' , isDuplicateFilterCondition)
        if(isDuplicateFilterCondition)
        {
            //console.log('In dup found')            
            errorFieldsSet.add('Value');                            
            duplicateFilterError = duplicateFilterError + 'Duplicate filter condition found.';
            //console.log('duplicateFilterError ::: ' , duplicateFilterError)
        }
        else
        {
            duplicateFilterError = duplicateFilterError + '';
        }
        var errorArr = Array.from(errorFieldsSet);//.sort();
        if(errorFieldsSet.size>0){
            //console.log('In error msg')
            
            for (let item of errorArr) {
                //console.log(item)
                errorFieldsStr = errorFieldsStr + item;
                errorFieldsStr = errorFieldsStr + ', ';
            }
            //console.log('errorFieldsStr ::: ' , errorFieldsStr)
            //console.log('finale ::: ' , errorFieldsStr.substring(0,errorFieldsStr.length - 2))
            
            var finalErrorMessage = '';            
            if(errorArr.includes("Custom Condition") && errorFieldsSet.size == 1){                
                finalErrorMessage = customErrorFieldsStr;
            }            
            else if(duplicateFilterError != '')
                finalErrorMessage = duplicateFilterError;
            else if(errorFieldsSet.size >=1)
                finalErrorMessage = 'These required fields must be completed: ' + errorFieldsStr.substring(0,errorFieldsStr.length - 2) + '.';
            
            /*
            if(customErrorFieldsStr != '')  {                          
                finalErrorMessage = finalErrorMessage + '\n Error : ' + customErrorFieldsStr;                        
            }
            if(duplicateFilterError != '')
                finalErrorMessage = finalErrorMessage + '\n Error : ' + duplicateFilterError ;
            */
            //console.log('finalErrorMessage ::: ' , finalErrorMessage)
            component.set("v.errorText",finalErrorMessage);            
            component.set("v.isErrorFound","true");            
            
        }
        else
        {
            //console.log('In save')
            helper.createSaveDataObjectReference(component, event, helper);
        }        
    },
    
    createSaveDataObjectReference: function(component, event, helper){
        //console.log('In createSaveDataObjectReference') 
        var objectName = '';
        
        if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce'){
            objectName = component.get("v.contractRuleDetail.Target_Object__c")
        }
        else
        {
            objectName = component.get("v.contractRuleDetail.Source_Object__c")
        }
        
        var objectReferenceDevValue = '';          
        var objectReferenceDisplayValue = '';
        var selectedLookupField = component.get("v.selectedObjectLookupValue");
        if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce'){
            var mappingObjectFieldValue = component.get("v.mappingObjectFieldValue");
            var returnField = component.get("v.returnField");                                        
            
            objectReferenceDisplayValue = objectReferenceDisplayValue + 'Object of (' + objectName + ') ';
            objectReferenceDisplayValue = objectReferenceDisplayValue + 'Fields ('+selectedLookupField+' ,'+ returnField +') ';        
            //console.log('objectReferenceDisplayValue1 ::: ' , objectReferenceDisplayValue)            
        }
        else
        {
            objectReferenceDisplayValue = objectReferenceDisplayValue + 'Object of (' + objectName + ') ';
            objectReferenceDisplayValue = objectReferenceDisplayValue + 'Fields ('+selectedLookupField+') ';        
            //console.log('objectReferenceDisplayValue1 ::: ' , objectReferenceDisplayValue)            
        }
        
        
        var objectReferenceConditionsList = component.get("v.objectReferenceConditionsList");
        var selectedRadioValue = component.get("v.selectedRadioValue");
        if(selectedRadioValue == '')
            selectedRadioValue = 'AND';
        
        var displayValue = '';
        for(var i = 0 ; i < objectReferenceConditionsList.length ; i++)
        {
            //console.log(objectReferenceConditionsList[i])
            displayValue = displayValue + objectReferenceConditionsList[i].Field;
            displayValue = displayValue + ' ' + objectReferenceConditionsList[i].Operator;
            //console.log('Operator ::: ',objectReferenceConditionsList[i].Operator)
            switch (objectReferenceConditionsList[i].Operator)
            {
                case 'Equal':
                    objectReferenceConditionsList[i].OperatorSymbol = '=';
                    break;
                case 'Not Equals':
                    objectReferenceConditionsList[i].OperatorSymbol = '!=';
                    break;
                case 'Greater than':
                    objectReferenceConditionsList[i].OperatorSymbol = '>';
                    break;
                case 'Greater than or equal':
                    objectReferenceConditionsList[i].OperatorSymbol = '>=';
                    break;
                case 'Less than':
                    objectReferenceConditionsList[i].OperatorSymbol = '<';
                    break;
                case 'Less than or equal':
                    objectReferenceConditionsList[i].OperatorSymbol = '<=';
                    break;
                case 'Contains','Ends with','Starts with':
                    objectReferenceConditionsList[i].OperatorSymbol = 'LIKE';
                    break;                    
            }
            
            //console.log(objectReferenceConditionsList[i].Type)
            
            displayValue = displayValue + ' ' + objectReferenceConditionsList[i].Value ;
            
            if((i+1) != objectReferenceConditionsList.length)
                displayValue = displayValue + ', ';
            
            //console.log('displayValue ::: ' , displayValue);
        }
        component.set("v.objectReferenceConditionsList",objectReferenceConditionsList)
        
        if(objectReferenceConditionsList.length>0)
            objectReferenceDisplayValue = objectReferenceDisplayValue + 'Filter Condition (' +displayValue + ') ';
        //console.log('objectReferenceDisplayValue 12336 ::: ' , objectReferenceDisplayValue);
        
        objectReferenceDevValue = '{'+'"DisplayValue"'+':'+'"'+objectReferenceDisplayValue+'",';
        //console.log('objectReferenceDevValue ::: ' , objectReferenceDevValue);
        
        objectReferenceDevValue = objectReferenceDevValue+'"Object"'+':'+'"'+objectName+'",';
        //console.log('objectName ::: ' , objectName);
        
        //console.log('before')
        //console.log('selectedLookupField ::: ' , selectedLookupField);
        //console.log('after')
        objectReferenceDevValue = objectReferenceDevValue+'"LookupField"'+':'+'"'+selectedLookupField+'",';
        //console.log('selectedLookupField ::: ' , selectedLookupField);
        
        if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce'){
            objectReferenceDevValue = objectReferenceDevValue+'\"MappingObjectField\"'+':'+'\"'+mappingObjectFieldValue+'\",';
            //console.log('mappingObjectFieldValue ::: ' , mappingObjectFieldValue);
            objectReferenceDevValue = objectReferenceDevValue+'"ReturnField"'+':'+'"'+returnField+'",';
            //console.log('returnField ::: ' , returnField); 
        }
        
        objectReferenceDevValue = objectReferenceDevValue+'"FilterType"'+':'+'"'+selectedRadioValue+'",';        
        //console.log('selectedRadioValue ::: ' , selectedRadioValue); 
        
        objectReferenceDevValue = objectReferenceDevValue+'"FilterConditions"'+':'+JSON.stringify(component.get("v.objectReferenceConditionsList"))+',';
        //console.log('Conditions ::: ' , JSON.stringify(component.get("v.objectReferenceConditionsList")));
        
        objectReferenceDevValue = objectReferenceDevValue+'"CustomValue"'+':"'+component.get("v.customConditionValue")+'"}';        
        //console.log('customConditionValue ::: ' , component.get("v.customConditionValue"));        
        
        //console.log('devValue if custom ::: ' + objectReferenceDevValue);
        
        //console.log('displayValue ::: ' , displayValue);
        //console.log('objectReferenceDevValue ::: ' , objectReferenceDevValue);
        component.set("v.objectReferenceDisplayValue",objectReferenceDisplayValue);   
        component.set("v.objectReferenceDevValue",objectReferenceDevValue); 
        
        //console.log('Inside')
        var triggerSaveEvent = component.getEvent("triggerSaveEvent");
        triggerSaveEvent.setParams({
            "isSaveTriggered" : "true" ,
            "type" : "Object Reference"
        });
        triggerSaveEvent.fire();
    },
    //used
    getResultantType: function(component, event, helper) {
        component.set("v.selectedObjectLookupValueError", "");
        //component.set("v.currentDatatype",JSON.parse(JSON.stringify(component.get("v.returnType"))))
        component.set("v.isLookupValue",true);
        component.set("v.selectedFieldFromParent", component.get("v.selectedObjectLookupValue"));                
        component.set("v.currentDatatype",'RFERENCE');
        component.set("v.openFieldSelector",true);
    },
    oninsertField : function(component,event,helper){
        //console.log('In oninsertField')
        var params = component.find("objectReferenceTypeFieldSelector").validateComponent();
        if(params.isValid){
            if(component.get("v.isLookupValue")){
                //console.log('params.field ::: ' , params.field)
                component.set("v.selectedObjectLookupValue",params.field);
                component.set("v.selectedObjectLookupValueError",'');
                //console.log('fieldsCollection ::: ' , params.fieldsCollection)
                
                if((params.fieldsCollection).length>0)
                {
                    
                    (params.fieldsCollection).sort(function(a,b) {
                        var t1 = a.value == b.value, t2 = a.value < b.value;
                        return t1? 0: ((params.fieldsCollection)?-1:1)*(t2?1:-1);
                    });
                    component.set("v.returnFieldsList",params.fieldsCollection);
                    component.set("v.isDisabledReturnField",false);                
                }
                
                
            }                    
            else{
                params.dataType = params.dataType.toLowerCase();
                var index = component.get("v.currentObjectReferenceRow");
                var objectReferenceConditionsList = component.get("v.objectReferenceConditionsList");
                if(component.get("v.isFieldFilterCondition"))
                {
                    if(objectReferenceConditionsList[index].Field != params.field)
                    {
                        objectReferenceConditionsList[index].Field = params.field;
                        objectReferenceConditionsList[index].FieldError = "";
                        var selectedFieldName = params.field;                                                     
                        if (selectedFieldName != "") 
                        {
                            //console.log('In if')
                            //console.log('selectedFieldName ::: ' , selectedFieldName);
                            //console.log('fieldsAndTypesMap ::: ' , component.get("v.fieldsAndTypesMap"))
                            //console.log('fieldsCollection ::: ' , params.fieldsCollection)                    
                            var selectedFieldType = (params.dataType).toLowerCase();
                            //console.log('selectedFieldType ::: ' , params.dataType);
                            objectReferenceConditionsList[index].FieldDataType = selectedFieldType;            
                            objectReferenceConditionsList[index].isOperatorDisabled = false;
                            objectReferenceConditionsList[index].isTypeDisabled = true;
                            objectReferenceConditionsList[index].isValueDisabled = true;
                            objectReferenceConditionsList[index].Type = "";
                            objectReferenceConditionsList[index].Operator = "";
                            objectReferenceConditionsList[index].Value = "";
                            //console.log('objectReferenceConditionsList ::: ' + JSON.stringify(objectReferenceConditionsList));                        
                            objectReferenceConditionsList[index].FieldDataType = selectedFieldType;                                    
                            //console.log('objectReferenceConditionsList ::: ' + JSON.stringify(objectReferenceConditionsList))
                            component.set("v.objectReferenceConditionsList", objectReferenceConditionsList);
                            //component.set("v.isdisabled", false);
                        }
                        else
                        {
                            //console.log('In else')
                            objectReferenceConditionsList[index].FieldDataType = '';            
                            objectReferenceConditionsList[index].isOperatorDisabled = true;
                            objectReferenceConditionsList[index].isTypeDisabled = true;
                            objectReferenceConditionsList[index].isValueDisabled = true;
                            objectReferenceConditionsList[index].Type = "";
                            objectReferenceConditionsList[index].Operator = "";
                            objectReferenceConditionsList[index].Value = "";
                            //console.log('objectReferenceConditionsList ::: ' + objectReferenceConditionsList)
                            component.set("v.objectReferenceConditionsList", objectReferenceConditionsList);
                        } 
                    }
                }
                else if(component.get("v.isValueFilterCondition"))
                {
                    if(objectReferenceConditionsList[index].Value != params.field)
                    {
                        objectReferenceConditionsList[index].Value = params.field;
                        objectReferenceConditionsList[index].ValueError = "";
                        component.set("v.objectReferenceConditionsList", objectReferenceConditionsList);
                    }
                }
                /*
                tempList[index].FieldDataType = params.dataType;
                tempList[index].disabled = false;
                tempList[index].disableType = true;
                tempList[index].disableValue = true;
                tempList[index].Type = "";
                tempList[index].Operator = "";
                tempList[index].Value = "";
                    if (params.dataType == 'datetime') {
                        tempList[index].FieldInputType = 'datetime';
                    } else {
                        if (params.dataType == 'integer' || params.dataType == 'double') {
                            tempList[index].FieldInputType = 'number';
                        } else {
                            if (params.dataType == 'date') {
                                tempList[index].FieldInputType = 'date';
                            } else {
                                tempList[index].FieldInputType = 'text';
                            }
                        }
                    }
                    component.set("v.ObjectReferenceList", tempList);
                    component.set("v.isdisabled", false);
                } */
            }
            helper.closeFieldSelector(component,event,helper);
        }
    },    
    
    closeFieldSelector : function(component,event,helper){
        component.set("v.openFieldSelector",false);
        component.set("v.isLookupValue",false);
        component.set("v.currentObjectReferenceRow",'');
        component.set("v.currentDatatype",'');
        //helper.removeSpinner(component,event,helper);
    },
})