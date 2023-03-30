({ 
    //used
    firstaddRecord: function(component, event, helper) {        
            var mastertablelist = [];
            var fieldsetList = component.get("v.tableList");
            var length = fieldsetList.length + 1;
            fieldsetList.push({
                'No': length,
                'andCondition': true,
                'orCondition': false,
                'customCondition': false,
                'customConditionError': '',
                'opencustom': false,
                'customformula': '',
                'field': '',
                'fieldpresent': false,
                'fieldtype': 'Text',
                'operator': '',
                'type': '',
                'isNullOperator': false,
                'isTypepresent': false,
                'isString': true,
                'isNumber': false,
                'isBoolean': false,
                'isCurrency': false,
                'isDate': false,
                'isDatetime': false,
                'isTime': false,
                'isVariables': false,
                'isReference': false,
                'value': '',
                'thenoptionvalue': 'Direct',
                'thenDirect': true,
                'thenvalue': '',
                'thenReferece': false,
                'thenvariables': false,                
                'fieldError': '',
                'operatorError': '',
                'typeError': '',
                'valueError': '',
                'thenError': 'label-hidden',
                'thenValueError': 'label-hidden'
                
            });
        //'comboList': [],
            component.set("v.tableList", fieldsetList);
            mastertablelist.push(component.get("v.tableList"));
            component.set('v.masterTableList', mastertablelist);
            component.set("v.tableList", [])
        
    },
    
    getMappingObjectFields: function(component, event, helper) 
    {
        var action = component.get("c.getMappingObjectAndFieldsDetails");
        action.setParams({
            "objectName": component.get("v.contractRuleDetail.Source_Object__c"),
            "dataStore": component.get("v.mappingContractDetail.Source_Datastore__c"),
            "type" : 'All'
            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                if(storeResponse.length>0)
                {
                    component.set("v.mappingObjectDetails",storeResponse[0]);
                    
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
                    
                    component.set("v.mappingObjectFieldsList",mappingObjectFieldsList);  
                    var tempObjectFieldsList = [];
                    tempObjectFieldsList.push({'label' : '--None--','value' : ''});  
                    component.set("v.headerOptions",mappingObjectFieldsList);
                    component.set("v.headerValueOptions",mappingObjectFieldsList);
                    component.set("v.thenAndElseOptions",mappingObjectFieldsList);
                    tempObjectFieldsList.push(...mappingObjectFieldsList);
                    component.set("v.objectFieldsList",tempObjectFieldsList);                      
                    
                    if(component.get("v.mappingRuleDetail.Dev_value__c") != undefined 
                       && component.get("v.mappingRuleDetail.Dev_value__c") != "" )
                    {
                     	helper.setValues(component, event, helper);
                    }
                    else
                        component.set("v.loadingSpinner",false);                                                                                
                }
                
                window.setTimeout(
                    $A.getCallback(function() {
                        if(component.find("mappingObjectField")!= undefined){
                            component.find("mappingObjectField").focus();
                        }
                    }), 1
                );
                
            }
        });
        $A.enqueueAction(action);
        
    },
    
    setValues: function(component, event, helper) 
    {             
        if(component.get("v.mappingRuleDetail.Dev_value__c") != undefined 
           && component.get("v.mappingRuleDetail.Dev_value__c") != "" )
        {
            var devValue = JSON.parse(component.get("v.mappingRuleDetail.Dev_value__c"));
            
            component.set("v.masterTableList", devValue.FilterConditions);            
            component.set("v.mappingObjectFieldValue",devValue.MappingObjectField);  
                                    
            
            var elseDataList = (devValue.ElseValue).split('#');
            
            component.set("v.elseoptionvalue",elseDataList[1]);                                    
            component.set("v.elsevalue",elseDataList[0]);      
            component.set("v.loadingSpinner",false);  
            
        }
    },
	/*
    handleGetMappingFields: function(component, event, helper)
    {                
        console.log("In handleGetMappingFields")     
        console.log("contractRuleId ::: ", component.get("v.contactruleid"))                        
        var action = component.get("c.getMappingFields"); 
        action.setParams({ contractRuleId : component.get("v.contactruleid") }); 
        action.setCallback(this, function(response) {  
            var state = response.getState();                                    
            console.log('state ::: ' , state);
            if (state == "SUCCESS") {
                var fieldsList = response.getReturnValue();
                var objectFieldsList = [];
                for(var i = 0 ; i < fieldsList.length ; i++)
                {
                    console.log('fieldsList[i] ::: ',fieldsList[i])
                    objectFieldsList.push({
                        'label' : fieldsList[i],
                        'value' : fieldsList[i]
                                              });                                               
                }
                console.log('objectFieldsList ::: ' , objectFieldsList);
				objectFieldsList.sort(function(a, b) {
                    var nameA = a.label,
                        nameB = b.label
                    if (nameA < nameB)
                        return -1
                        if (nameA > nameB)
                            return 1
                            return 0
                });
                var tempObjectFieldsList = [];
                tempObjectFieldsList.push({'label' : '--None--','value' : '--None--'});  
                component.set("v.headerOptions",objectFieldsList);
                component.set("v.thenAndElseOptions",objectFieldsList);
                tempObjectFieldsList.push(...objectFieldsList);
                component.set("v.objectFieldsList",tempObjectFieldsList);  
                
                console.log('objectFieldsList 123  ::: ' + JSON.stringify(objectFieldsList));
                console.log('devValue ::: ',component.get("v.devValue"))
                if(component.get("v.devValue") != undefined && component.get("v.devValue") != "")
                {
                    console.log('in if')
                    var devValue = JSON.parse(component.get("v.devValue"));                    
                    var elseValues = (devValue.ElseValue).split('#');
                    component.set("v.elseoptionvalue",elseValues[1]);  
                    component.set("v.elsevalue",elseValues[0]);  
                    component.set("v.objectFieldsValue",devValue.SAPField);
                    component.set("v.returnTypeValue",devValue.ReturnType);                    
                    component.set("v.masterTableList", JSON.parse(JSON.stringify(devValue.FilterConditions))); 
                    component.set("v.tableList", [])
                }
                
            }
        });
        $A.enqueueAction(action);
    },
    
    //used
    getAllHeaderData: function(component, event, helper) {
        var action = component.get("c.getAllFormulaForIfElse");
        action.setParams({
            recordId: component.get("v.templateId")
        })
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var allFormulas = response.getReturnValue();
                var formulaDetailsList = allFormulas[0];
                var formulaDetailsListLength = formulaDetailsList.length;
                component.set("v.formulaDetailsList", formulaDetailsList);
                var setHeader = component.get("v.SetHeader");
                var headerList = [];
                for (var i = 0; i < formulaDetailsListLength; i++) {
                    var headerValue = JSON.parse(formulaDetailsList[i].Formula_Data__c);
                    if (setHeader == 'Detail') {
                        if (formulaDetailsList[i].Section_Row_Number__c == component.get("v.SetIndex") && formulaDetailsList[i].Name == setHeader &&
                            formulaDetailsList[i].Section__c == component.get("v.SetSection")) {
                            //do nothing
                        } else {
                            if (formulaDetailsList[i].Name == "Header" || formulaDetailsList[i].Name == "Detail") {
                                if (headerValue.label != "") {
                                    headerList.push({
                                        'label': headerValue.label,
                                        'value': headerValue.Name
                                    });
                                }
                            }
                        }
                    } else if (setHeader == 'Header') {
                        if (formulaDetailsList[i].Section_Row_Number__c == component.get("v.SetIndex") && formulaDetailsList[i].Name == setHeader &&
                            formulaDetailsList[i].Section__c == component.get("v.SetSection")) {
                            //do nothing
                        } else {
                            if (formulaDetailsList[i].Name == "Header") {
                                if (headerValue.label != "") {
                                    headerList.push({
                                        'label': headerValue.label,
                                        'value': headerValue.Name
                                    });
                                }
                            }
                        }
                    } else if (setHeader == 'Footer') {
                        if (formulaDetailsList[i].Section_Row_Number__c == component.get("v.SetIndex") && formulaDetailsList[i].Name == setHeader &&
                            formulaDetailsList[i].Section__c == component.get("v.SetSection")) {
                            //do nothing
                        } else {
                            if (formulaDetailsList[i].Name == 'Header' || formulaDetailsList[i].Name == 'Footer' || (formulaDetailsList[i].Name == 'Detail Summary')) {
                                if (headerValue.label != "") {
                                    headerList.push({
                                        'label': headerValue.label,
                                        'value': headerValue.Name
                                    });
                                }
                            }
                        }
                    }
                }
                headerList.sort(function(a, b) {
                    var nameA = a.label,
                        nameB = b.label
                    if (nameA < nameB)
                        return -1
                    if (nameA > nameB)
                        return 1
                    return 0
                });
                component.set("v.headerOptions", headerList);
                this.getInitialIFElseValues(component, event);
                this.refreshThenAndElseValues(component, event, helper)
                if (setHeader == 'Detail') {
                    component.set("v.headerFieldsSubHeader", helper.getSubHeaderFieldReferenceList(component, event, helper, allFormulas[1]));
                    var subHeaderString = component.get("v.subHeaderString");
                    if (subHeaderString != "" && subHeaderString != null && subHeaderString != undefined) {
                        var subHeaderList = subHeaderString.split("-#**#-");
                        component.set("v.subHeaderType", subHeaderList[0]);
                        if (component.get("v.subHeaderType") == "IfElse") {
                            var subHeaderIfELseValue = JSON.parse(subHeaderList[1]);
                            component.set("v.IfCondition", JSON.parse(subHeaderIfELseValue[0]));
                            var elseValue = subHeaderIfELseValue[1];
                            var elseValueList = elseValue.split("#");
                            component.set("v.elseType", elseValueList[1]);
                            component.set("v.subelseValue", elseValueList[0]);
                        } else {
                            component.set("v.subHeaderValue", subHeaderList[1])
                        }
                    }
                }
            }
        });
        $A.enqueueAction(action);

    },
    */
    //used
    /*getSubHeaderFieldReferenceList: function(component, event, helper, formulaDetailsList) {
        var headerFieldsSubHeader = [];
        var formulaDetailsListLength = formulaDetailsList.length;
        for (let i = 0; i < formulaDetailsListLength; i++) {
            if (formulaDetailsList[i].Name == 'Header') {
                let headerValue = JSON.parse(formulaDetailsList[i].Formula_Data__c);
                if (headerValue.label != "") {
                    headerFieldsSubHeader.push({
                        'label': headerValue.label,
                        'value': headerValue.Name
                    });
                }
            }
        }
        headerFieldsSubHeader.sort(function(a, b) {
            var nameA = a.label,
                nameB = b.label
            if (nameA < nameB) //sort string ascending
                return -1
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        })
        return headerFieldsSubHeader;
    },*/
    //used
    getInitialIFElseValues: function(component, event,helper) {
        
        var existingData = component.get("v.devValue");
        if ( existingData != undefined && existingData != '') {
            
            var existingDataList = JSON.parse(existingData);
            var one = JSON.parse(existingDataList[0]);
            var elseList = (existingDataList[1]).split("#");
            var returnList = (existingDataList[2]);
            var roundoffList = (existingDataList[3]).split(",");
            component.set("v.masterTableList", one);
            component.set("v.roundOffType", roundoffList[0])
            component.set("v.decimalPlace", roundoffList[1])
            var headerList = component.get("v.headerOptions");
            var headerListLength = headerList.length;
            var masterdata = one;
            var oneLength = one.length;
            for (let i = 0; i < oneLength; i++) {
                var tablelist = masterdata[i];
                var tablelistLength = tablelist.length;
                for (let j = 0; j < tablelistLength; j++) {
                    var updatedHeaderList = [];
                    var fieldValue = tablelist[j].field;
                    for (let k = 0; k < headerListLength; k++) {
                        if (headerList[k].value != fieldValue) {
                            updatedHeaderList.push(headerList[k]);
                        }
                    }
                    updatedHeaderList.sort(function(a, b) {
                        var nameA = a.label,
                            nameB = b.label
                        if (nameA < nameB) //sort string ascending
                            return -1
                        if (nameA > nameB)
                            return 1
                        return 0 //default return value (no sorting)
                    });
                    //tablelist[j].comboList = updatedHeaderList;
                    tablelist[j].value = tablelist[j].value;
                }
                masterdata[i] = tablelist;
            }
            component.set("v.masterTableList", masterdata)
            component.set("v.elseoptionvalue", elseList[1]);
            if (elseList[1] == "Field Reference") {
                component.set("v.isreference", true);
                component.set("v.isVariables", false);
                component.set("v.isDirect", false);
            } else if (elseList[1] == "Variables") {
                component.set("v.isreference", false);
                component.set("v.isVariables", true);
                component.set("v.isDirect", false);
            } else {
                component.set("v.isreference", false);
                component.set("v.isVariables", false);
                component.set("v.isDirect", true);
            }
            component.set("v.elsevalue", elseList[0]);
            component.set("v.returnTypeValue", returnList)
            component.set("v.oldDataType", returnList);
        }
    },
    //used
    refreshThenAndElseValues: function(component, event, helper) {
        var returnType = component.get("v.returnTypeValue");
        var formulaDetailsList = component.get("v.formulaDetailsList");
        var formulaDetailsListLength = formulaDetailsList.length;
        var headerList = [];
        var setHeader = component.get("v.SetHeader");
        for (var i = 0; i < formulaDetailsListLength; i++) {
            var headerValue = JSON.parse(formulaDetailsList[i].Formula_Data__c);
            var formulareturnType = '';
            if (formulaDetailsList[i].Name == 'Detail Summary') {
                if (returnType != 'Text') {
                    formulareturnType = returnType;
                } else {
                    formulareturnType = 'Text';
                }
            } else {
                formulareturnType = helper.getFormulaReturnDataType(component, event, helper, headerValue);
            }
            if (formulareturnType == returnType || returnType == "Text") {
                if (setHeader == 'Detail') {
                    if (formulaDetailsList[i].Section_Row_Number__c == component.get("v.SetIndex") && formulaDetailsList[i].Name == setHeader &&
                        formulaDetailsList[i].Section__c == component.get("v.SetSection")) {
                        //do nothing
                    } else {
                        if (formulaDetailsList[i].Name == "Header" || formulaDetailsList[i].Name == "Detail") {
                            if (headerValue.label != "") {
                                headerList.push({
                                    'label': headerValue.label,
                                    'value': headerValue.Name
                                });
                            }
                        }
                    }
                } else if (setHeader == 'Header') {
                    if (formulaDetailsList[i].Section_Row_Number__c == component.get("v.SetIndex") && formulaDetailsList[i].Name == setHeader &&
                        formulaDetailsList[i].Section__c == component.get("v.SetSection")) {
                        //do nothing
                    } else {
                        if (formulaDetailsList[i].Name == "Header") {
                            if (headerValue.label != "") {
                                headerList.push({
                                    'label': headerValue.label,
                                    'value': headerValue.Name
                                });
                            }
                        }
                    }
                } else if (setHeader == 'Footer') {
                    if (formulaDetailsList[i].Section_Row_Number__c == component.get("v.SetIndex") && formulaDetailsList[i].Name == setHeader &&
                        formulaDetailsList[i].Section__c == component.get("v.SetSection")) {
                        //do nothing
                    } else {
                        if (formulaDetailsList[i].Name == 'Header' || formulaDetailsList[i].Name == 'Footer' || (formulaDetailsList[i].Name == 'Detail Summary')) {
                            if (headerValue.label != "") {
                                headerList.push({
                                    'label': headerValue.label,
                                    'value': headerValue.Name
                                });
                            }
                        }
                    }
                }
            }
        }
        headerList.sort(function(a, b) {
            var nameA = a.label,
                nameB = b.label
            if (nameA < nameB) //sort string ascending
                return -1
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        });
        component.set("v.thenAndElseOptions", headerList);
    },
    //used
    getFormulaReturnDataType: function(component, event, helper, headerValue) {
        switch (headerValue.valueType) {            
            case "If Else":
                let IfElseValue = JSON.parse(headerValue.devValue);
                return IfElseValue[2];
                break;

            default:
                break;
        }
    },
    //used
    showToastMessage: function(component, event, helper, type, message) {
        var toastEvent = $A.get("e.force:showToast");
        if (type == "success") {
            toastEvent.setParams({                
                "type": "Success",
                "message": message
            });
        } 
        else if (type == "error") 
        {
            var errorFieldsSet = component.get("v.errorFieldsSet");
            
            if(errorFieldsSet.size>0){
                var errorFieldsStr = '';
                for (let item of errorArr) {
                    errorFieldsStr = errorFieldsStr + item;
                    errorFieldsStr = errorFieldsStr + ', ';
                }
                component.set("v.isErrorFound","true");
                
                var finalErrorMsg = '';
                
                finalErrorMsg = 'These required fields must be completed: ' + errorFieldsStr.substring(0,errorFieldsStr.length - 2);                
                component.set("v.errorText",finalErrorMsg);
                
                var errorEvent = component.getEvent("errorEvent");            
                errorEvent.setParams({
                    "isErrorFound": component.get("v.isErrorFound"),
                    "errorMessage": component.get("v.errorText")
                });
                errorEvent.fire();
                
            }                        
            /*
            toastEvent.setParams({
                "title": "Error",
                "type": "Error",
                "message": message
            });
            */
        }
        toastEvent.fire();
    },
    //used
    addIterationRow: function(component, event, helper) {
        var secIndex = event.currentTarget.dataset.id;
        //Adding Row
        var mastertablelistdata = component.get('v.masterTableList');
        var mastertemp = [];
        var fieldsetList = [];
        var length = fieldsetList.length + 1;
        fieldsetList.push({
            'No': length,
            'andCondition': true,
            'orCondition': false,
            'customCondition': false,
            'customConditionError': '',
            'opencustom': false,
            'customformula': '',
            'field': '',
            'fieldpresent': false,
            'fieldtype': 'Text',
            'operator': '',
            'type': '',
            'isNullOperator': false,
            'isTypepresent': false,
            'isString': true,
            'isNumber': false,
            'isBoolean': false,
            'isCurrency': false,
            'isDate': false,
            'isDatetime': false,
            'isTime': false,
            'isVariables': false,
            'isReference': false,
            'value': '',
            'thenoptionvalue': 'Direct',
            'thenDirect': true,
            'thenvalue': '',
            'thenReferece': false,
            'thenvariables': false,            
            'fieldError': '',
            'operatorError': '',
            'typeError': '',
            'valueError': '',
            'thenError': 'label-hidden',
            'thenValueError': 'label-hidden'
        });
        //'comboList': [],
        var itrvl = parseInt(secIndex);
        for (var i = 0; i <= itrvl; i++) {
            mastertemp.push(mastertablelistdata[i]);
        }
        mastertemp.push(fieldsetList);
        var itrval = parseInt(secIndex) + 1;
        var mastertablelistdataLength = mastertablelistdata.length;
        for (var j = itrval; j < mastertablelistdataLength; j++) {
            mastertemp.push(mastertablelistdata[j]);
        }
        component.set('v.masterTableList', mastertemp);
    },
    //used
    addRecord: function(component, event) {
        var secIndex = event.currentTarget.dataset.id;
        var mastertablelist = component.get("v.masterTableList");
        var fieldsetList = component.get("v.tableList");
        fieldsetList = mastertablelist[secIndex];
        var length = fieldsetList.length + 1;
        fieldsetList.push({
            'No': length,
            'andCondition': true,
            'orCondition': '',
            'customCondition': '',
            'customConditionError': '',
            'opencustom': false,
            'customformula': '',
            'field': '',
            'fieldpresent': false,
            'fieldtype': 'Text',
            'operator': '',
            'type': '',
            'isNullOperator': false,
            'isTypepresent': false,
            'isString': true,
            'isNumber': false,
            'isBoolean': false,
            'isCurrency': false,
            'isDate': false,
            'isDatetime': false,
            'isTime': false,
            'isVariables': false,
            'isReference': false,
            'value': '',
            'thenoptionvalue': 'Direct',
            'thenDirect': true,
            'thenvalue': '',
            'thenReferece': false,
            'thenvariables': false,            
            'fieldError': '',
            'operatorError': '',
            'typeError': '',
            'valueError': '',
            'thenError': 'label-hidden',
            'thenValueError': 'label-hidden'

        });
        //'comboList': [],
        component.set("v.tableList", fieldsetList)
        mastertablelist[secIndex] = component.get('v.tableList');
        component.set('v.masterTableList', mastertablelist);
        component.set("v.tableList", [])
    },
    //used
    validateIfElse: function(component, event, helper) {
        
        var errorFieldsSet = new Set();
        /*
        if(component.get("v.mappingObjectFieldValue") == '')
            component.set("v.mappingObjectFieldValueError",'slds-has-error');
        else
            component.set("v.mappingObjectFieldValueError",'');
        */
        var isValidExp = true;
        var errorFlag = true;
        var mainList = component.get("v.masterTableList");
        var dataTypeErrorFlag = true;
        for (let p = 0; p < mainList.length; p++) {
            var tempList = mainList[p];
            for (let l = 0; l < tempList.length; l++) {
                tempList[l].customConditionError = '';
                tempList[l].fieldError = '';
                tempList[l].operatorError = '';
                tempList[l].typeError = '';
                tempList[l].valueError = '';
                tempList[l].thenError = 'label-hidden';
                tempList[l].thenValueError = 'label-hidden';
            }
        }
        component.set("v.masterTableList", mainList)

        for (let i = 0; i < mainList.length; i++) {
            var tempList = mainList[i];
            for (let j = 0; j < tempList.length; j++) {
                if (j == 0) {
                    if (tempList[j].customCondition == true) {
                        if ((tempList[j].customformula == '' || tempList[j].customformula == null || tempList[j].customformula == undefined)) {
                            errorFlag = false;
                            errorFieldsSet.add('Custom Condition');
                            tempList[j].customConditionError = 'slds-has-error';
                        } else {
                            var result, str, res, res1, res2, res3, domCntr = 0,
                                cntr = 0;
                            var logical_List = [];
                            var _parenthesis = [];
                            var isNumber = /[\d\.]+/;
                            var _space = /\s/g;
                            var isValidSet = true;
                            var isSplChars = false;
                            result = String(tempList[j].customformula);

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
                                    if (parseInt(logical_List[s].chars) > parseInt(tempList.length)) {
                                        isValidSet = false;
                                    } else if (parseInt(logical_List[s].chars) == 0) {
                                        isValidSet = false;
                                    }
                                }
                                if ((s + 1) < logical_List.length) {
                                    if ((logical_List[s].chars == '*' || logical_List[s].chars == '+') && logical_List[s + 1].chars == '(') {
                                        res = true;
                                    }
                                    if (logical_List[s].chars == ')' && (logical_List[s + 1].chars == '+' || logical_List[s + 1].chars == '*')) {
                                        res1 = true;
                                    }
                                }
                                if ((s + 2) < logical_List.length) {
                                    if ((logical_List[s].chars == '*' || logical_List[s].chars == '+') && logical_List[s + 1].chars == '!' && logical_List[s + 2].chars == '(') {
                                        res2 = true;
                                    }
                                    if (logical_List[s].chars == ')' && (logical_List[s + 1].chars == '+' || logical_List[s + 1].chars == '*')) {
                                        res3 = true;
                                    }
                                }
                            }

                            for (var e = 0; e < _parenthesis.length; e++) {
                                if (_parenthesis[e].val == '+' || _parenthesis[e].val == '*') {
                                    domCntr++;
                                }
                            }

                            for (var q = 0; q < logical_List.length; q++) {

                                if (isSplChars) {
                                    isValidExp = false;
                                    tempList[j].customConditionError = 'slds-has-error';
                                }

                                //unexpected characters
                                if (result.match(/[a-z]/i)) {
                                    isValidExp = false;
                                    errorFieldsSet.add('Custom Condition');
                                    tempList[j].customConditionError = 'slds-has-error';
                                }

                                //unavailable set in expression
                                if (!isValidSet) {
                                    isValidExp = false;
                                    errorFieldsSet.add('Custom Condition');
                                    tempList[j].customConditionError = 'slds-has-error';
                                }

                                //space not allowed
                                if (_space.test(result)) {
                                    isValidExp = false;
                                    errorFieldsSet.add('Custom Condition');
                                    tempList[j].customConditionError = 'slds-has-error';
                                }

                                //unbalanced parenthesis
                                if (cntr != 0) {
                                    isValidExp = false;
                                    errorFieldsSet.add('Custom Condition');
                                    tempList[j].customConditionError = 'slds-has-error';
                                }

                                //starts with 
                                if (result.startsWith('+') || result.startsWith('*')) {
                                    isValidExp = false;
                                    errorFieldsSet.add('Custom Condition');
                                    tempList[j].customConditionError = 'slds-has-error';
                                }

                                //ends with
                                else if (result.endsWith('+') || result.endsWith('*') || result.endsWith('!')) {
                                    isValidExp = false;
                                    errorFieldsSet.add('Custom Condition');
                                    tempList[j].customConditionError = 'slds-has-error';
                                }

                                //Empty parenthesis
                                if (logical_List[q].chars == "(") {
                                    if ((q + 1) < logical_List.length) {
                                        if (logical_List[q + 1].chars == ')') {
                                            isValidExp = false;
                                            errorFieldsSet.add('Custom Condition');
                                            tempList[j].customConditionError = 'slds-has-error';
                                        }
                                    }
                                }

                                //NOT Validation
                                if (logical_List[q].chars == "!") {
                                    if ((q + 1) < logical_List.length) {
                                        if (logical_List[q + 1].chars != '(') {
                                            isValidExp = false;
                                            errorFieldsSet.add('Custom Condition');
                                            tempList[j].customConditionError = 'slds-has-error';
                                        }
                                    }
                                    if (logical_List[q].chars == '!') {
                                        if (q != 0) {
                                            if (logical_List[q - 1].chars != '*' && logical_List[q - 1].chars != '+' && logical_List[q - 1].chars != '(') {
                                                isValidExp = false;
                                                errorFieldsSet.add('Custom Condition');
                                                tempList[j].customConditionError = 'slds-has-error';
                                            }
                                        }
                                    }
                                }

                                //Consequetive Operators
                                if ((q + 1) < logical_List.length) {
                                    if (logical_List[q].chars == '+' || logical_List[q].chars == '*' || logical_List[q].chars == '!') {
                                        if (logical_List[q + 1].chars == '+' || logical_List[q + 1].chars == '*') {
                                            isValidExp = false;
                                            errorFieldsSet.add('Custom Condition');
                                            tempList[j].customConditionError = 'slds-has-error';
                                        }
                                    } else if (logical_List[q].chars != '+' && logical_List[q].chars != '*' && logical_List[q].chars != '!' && logical_List[q].chars != '(' && logical_List[q].chars != ')') {
                                        if (logical_List[q + 1].chars != '+' && logical_List[q + 1].chars != '*' && logical_List[q + 1].chars != '!' && logical_List[q + 1].chars != '(' && logical_List[q + 1].chars != ')') {
                                            isValidExp = false;
                                            errorFieldsSet.add('Custom Condition');
                                            tempList[j].customConditionError = 'slds-has-error';
                                        }
                                    }
                                }

                                //validation at open parenthesis
                                if (logical_List[q].chars == '(') {
                                    if ((q + 1) < logical_List.length) {
                                        if (logical_List[q + 1].chars == '*' || logical_List[q + 1].chars == '+') {
                                            isValidExp = false;
                                            errorFieldsSet.add('Custom Condition');
                                            tempList[j].customConditionError = 'slds-has-error';
                                        }
                                    }
                                    if (q != 0) {
                                        if (logical_List[q - 1].chars != '*' && logical_List[q - 1].chars != '+' && logical_List[q - 1].chars != '!' && logical_List[q - 1].chars != '(') {
                                            isValidExp = false;
                                            errorFieldsSet.add('Custom Condition');
                                            tempList[j].customConditionError = 'slds-has-error';
                                        }
                                    }
                                }

                                //valdation at close parenthesis
                                if (logical_List[q].chars == ')') {
                                    if ((q + 1) < logical_List.length) {
                                        if (logical_List[q + 1].chars != '*' && logical_List[q + 1].chars != '+' && logical_List[q + 1].chars != ')') {
                                            isValidExp = false;
                                            errorFieldsSet.add('Custom Condition');
                                            tempList[j].customConditionError = 'slds-has-error';
                                        }
                                    }
                                    if (q != 0) {
                                        if (logical_List[q - 1].chars == '*' || logical_List[q - 1].chars == '+') {
                                            isValidExp = false;
                                            errorFieldsSet.add('Custom Condition');
                                            tempList[j].customConditionError = 'slds-has-error';
                                        }
                                    }
                                }

                                //manage preference at *
                                if (logical_List[q].chars == '*') {
                                    if ((q + 2) < logical_List.length) {
                                        if (logical_List[q + 2].chars == '+') {
                                            isValidExp = false;
                                            errorFieldsSet.add('Custom Condition');
                                            tempList[j].customConditionError = 'slds-has-error';
                                        }
                                    }
                                }

                                //manage preference at +
                                if (logical_List[q].chars == '+') {
                                    if ((q + 2) < logical_List.length) {
                                        if (logical_List[q + 2].chars == '*') {
                                            isValidExp = false;
                                            errorFieldsSet.add('Custom Condition');
                                            tempList[j].customConditionError = 'slds-has-error';
                                        }
                                    }
                                }

                                //manage preference in parenthesis add
                                if (logical_List[q].chars == '*') {
                                    if ((q + 5) < logical_List.length) {
                                        if (logical_List[q + 5].chars == '+' && logical_List[q + 1].chars == '!') {
                                            isValidExp = false;
                                            errorFieldsSet.add('Custom Condition');
                                            tempList[j].customConditionError = 'slds-has-error';
                                        }
                                    }
                                }

                                if (logical_List[q].chars == '+') {
                                    if ((q + 5) < logical_List.length) {
                                        if (logical_List[q + 5].chars == '*' && logical_List[q + 1].chars == '!') {
                                            isValidExp = false;
                                            errorFieldsSet.add('Custom Condition');
                                            tempList[j].customConditionError = 'slds-has-error';
                                        }
                                    }
                                }

                                //manage preference in nested operation
                                if (domCntr > 1) {
                                    isValidExp = false;
                                    errorFieldsSet.add('Custom Condition');
                                    tempList[j].customConditionError = 'slds-has-error';
                                }

                            }
                        }
                    }
                }

                //custom condition checking over
                if (tempList[j].field == '' || tempList[j].field == null) {
                    errorFlag = false;
                    errorFieldsSet.add('Field');
                    tempList[j].fieldError = 'slds-has-error';
                }
                if (tempList[j].operator == '' || tempList[j].operator == null) {
                    errorFlag = false;
                    errorFieldsSet.add('Operator');
                    tempList[j].operatorError = 'slds-has-error';
                }
                if (tempList[j].type == '' || tempList[j].type == null) {
                    errorFlag = false;
                    errorFieldsSet.add('Type');
                    tempList[j].typeError = 'slds-has-error';
                }
                if (tempList[j].value.trim() == '' || tempList[j].value.trim() == null) {
                    errorFlag = false;
                    errorFieldsSet.add('Value');
                    tempList[j].valueError = 'slds-has-error';
                }
                /*if (j == 0) {
                    //validate then
                    if (tempList[j].thenoptionvalue != 'Direct') {
                        if (tempList[j].thenvalue == undefined || tempList[j].thenvalue == null || tempList[j].thenvalue == '') {
                            errorFlag = false;
                            errorFieldsSet.add('Then Value');
                            tempList[j].thenValueError = 'label-hidden slds-has-error';
                        }
                    }
                    else 
                    {
                        if (tempList[j].thenvalue == undefined || tempList[j].thenvalue == null || tempList[j].thenvalue == '') {
                            //if (component.get("v.returnTypeValue") != 'Text') {
                                if (isNaN(tempList[j].thenvalue.trim()) || String(tempList[j].thenvalue.trim()).includes('e') || String(tempList[j].thenvalue.trim()).includes('E')) {
                                    //dataTypeErrorFlag = false;
                                    errorFieldsSet.add('Then Value');
                                    tempList[j].thenValueError = 'label-hidden slds-has-error';
                                }
                            //}
                        }
                    }
                    //end
                }
                */
            }
            mainList[i] = tempList;
        }
        component.set("v.masterTableList", mainList)
        var elseValueFlag = true;
        /*if (component.get("v.elseoptionvalue") != 'Direct') {
            if (component.get("v.elsevalue") == '' || component.get("v.elsevalue") == undefined || component.get("v.elsevalue") == null) {
                elseValueFlag = false;
                errorFieldsSet.add('Else Value');
                //component.set("v.elseValueStyle", 'label-hidden');
                component.set("v.elseValueStyle", 'label-hidden slds-has-error');
            }
        } else {            
            if (component.get("v.elsevalue").trim() != undefined || component.get("v.elsevalue").trim() != null ){//|| component.get("v.elsevalue").trim() != '') {
                //if (component.get("v.returnTypeValue") != 'Text') {
                    //if (isNaN(component.get("v.elsevalue").trim()) || String(component.get("v.elsevalue").trim()).includes('e') || String(component.get("v.elsevalue").trim()).includes('E')) {
                        //dataTypeErrorFlag = false;                
                        //component.set("v.elseValueStyle", 'label-hidden');
                        errorFieldsSet.add('Else Value');
                        component.set("v.elseValueStyle", 'label-hidden slds-has-error');
                    //}
                //}
           }
        }
        */
        
        /*var customFlag = false;
        var requiredFlag = false;
        if (component.get("v.SetHeader") == "Detail" && component.get("v.subHeaderType") != "") 
        {
            component.set("v.subHeaderStyle", "label-hidden");
            if (component.get("v.subHeaderType") == "Direct" || component.get("v.subHeaderType") == "Reference") {
                if (component.get("v.subHeaderValue") == "" || component.get("v.subHeaderValue") == null || component.get("v.subHeaderValue") == undefined) {
                    component.set("v.subHeaderStyle", "label-hidden slds-has-error");
                    requiredFlag = true;
                } else {
                    var subHeaderString = component.get("v.subHeaderType") + "-#**#-" + component.get("v.subHeaderValue");
                    component.set("v.subHeaderString", subHeaderString)
                }
            } else {
                var ifelseData = component.find('IfElseSubHeader').handleValidation()
                if (ifelseData != undefined) {
                    requiredFlag = ifelseData.required;
                    customFlag = ifelseData.custom;
                }
                if (!requiredFlag && !customFlag) {
                    var tempIfElse = [];
                    tempIfElse.push(JSON.stringify(component.find("IfElseSubHeader").get("v.masterTableList")));
                    tempIfElse.push(component.find("IfElseSubHeader").get("v.elsevalue") + '#' + component.find("IfElseSubHeader").get("v.elseoptionvalue"));
                    component.set("v.subHeaderString", component.get("v.subHeaderType") + "-#**#-" + JSON.stringify(tempIfElse))
                }
            }
        }*/
        //|| requiredFlag || customFlag
       

        if (!isValidExp || !errorFlag || !elseValueFlag || !dataTypeErrorFlag) 
        {
            /*if (!isValidExp ) {
                //component.set("v.errorFieldsSet",errorFieldsSet);                
                //helper.showToastMessage(component, event, helper, 'error', 'Custom formula is empty or incorrect.')
                
            } else */
            if (!isValidExp || !errorFlag || !elseValueFlag ) {
                //component.set("v.errorFieldsSet",errorFieldsSet);
                //helper.showToastMessage(component, event, helper, 'error', 'Please fill all the required fields.')
                
                
                //var errorFieldsSet = component.get("v.errorFieldsSet");
                var errorArr = Array.from(errorFieldsSet);//.sort();
                if(errorFieldsSet.size>0)
                {
                    var errorFieldsStr = '';
                    for (let item of errorArr) {
                        errorFieldsStr = errorFieldsStr + item;
                        errorFieldsStr = errorFieldsStr + ', ';
                    }
                    component.set("v.isErrorFound","true");
                    var finalErrorMsg = '';
                    if(errorArr.includes("Custom Condition") && errorFieldsSet.size == 1)
                        finalErrorMsg = 'Custom condition is empty or invalid, Please provide valid condition.';
                    else
                        finalErrorMsg = 'These required fields must be completed: ' + errorFieldsStr.substring(0,errorFieldsStr.length - 2) + '.';
                    
                    component.set("v.errorText",finalErrorMsg);
                    
                    var errorEvent = component.getEvent("errorEvent");            
                    errorEvent.setParams({
                        "isErrorFound": component.get("v.isErrorFound"),
                        "errorMessage": component.get("v.errorText")
                    });
                    errorEvent.fire();
                    
                }
            }
            
            
            return false;
        } else {
            return true;
        }
    },
    
    //used
    setIfElseValueHelper: function (component, event, helper) {        
        var ifElseCollection = component.get("v.masterTableList");
        var ifElseCollectionCopy = component.get("v.masterTableList");
        var elseValue = component.get("v.elsevalue");
        var subHeader = component.get("v.subHeaderString");
        var elseValueCopy = component.get("v.elsevalue");
        var elseValueOption = component.get("v.elseoptionvalue");
        var roundoffType = component.get("v.roundOffType")
        var decimalPlace = component.get("v.decimalPlace")
        var returntype = component.get("v.returnTypeValue");
        var format;
        var devValueContent;
        for (let b = 0; b < ifElseCollection.length; b++) {
            let data = [];
            data = ifElseCollection[b];
            for (let c = 0; c < data.length; c++) {
                let temp = data[c].value;
                if (temp != '') {
                    data[c].value = temp.trim();
                }
                let temps = data[c].thenvalue
                if (temps != '') {
                    data[c].thenvalue = temps.trim();
                }
            }
            ifElseCollection[b] = data;
        }
        if (elseValue != '') {
            elseValueCopy = elseValue.trim();
        }
        var format = '';
        for (var i = 0; i < ifElseCollection.length; i++) {
            var data = ifElseCollection[i];
            if (i == 0) {
                format = format + 'IF{'
            }
            else {
                format = format + 'ELSE IF{'
            }
            for (var j = 0; j < data.length; j++) {
                if (data[0].andCondition == true) {
                    if (j == (data.length - 1)) {
                        format = format + '(\"' + data[j].field + '\" ' + data[j].operator + '  \"' + data[j].value + '\")} ';
                    }
                    else {
                        format = format + '(\"' + data[j].field + '\" ' + data[j].operator + ' \"' + data[j].value + '\") AND ';
                    }
                }
                if (data[0].orCondition == true) {
                    if (j == (data.length - 1)) {
                        format = format + '(\"' + data[j].field + '\" ' + data[j].operator + '  \"' + data[j].value + '\")} ';
                    }
                    else {
                        format = format + '(\"' + data[j].field + '\" ' + data[j].operator + ' \"' + data[j].value + '\") OR ';
                    }
                }
                if (data[0].customCondition == true) {
                    var formula = data[0].customformula;
                    var expression = formula.trim();
                    var splitexpression = expression.split("");
                    var result = '';
                    var word = '';
                    for (var p = 0; p < splitexpression.length; p++) {
                        if (!isNaN(splitexpression[p])) {
                            if (!isNaN(splitexpression[p + 1])) {
                                word = word + splitexpression[p];
                                continue;
                            }
                            else {
                                word = word + splitexpression[p];
                            }
                        }
                        if (isNaN(splitexpression[p])) {
                            if (isNaN(splitexpression[p + 1])) {
                                word = word + splitexpression[p];
                                continue;
                            }
                            else {
                                word = word + splitexpression[p];
                            }
                        }
                        if (!isNaN(word)) {
                            var ind = parseInt(word) - 1
                            word = '(\"' + data[ind].field + '\" ' + data[ind].operator + '  \"' + data[ind].value + '\")';
                            result = result + word;
                            word = '';
                        }
                        else {
                            result = result + word;
                            word = '';
                        }
                    }
                    format = format + result + '}';
                    break;
                }
            }
            format = format + ' THEN{(\"' + data[0].thenvalue + '\")} ';
        }
        var elsestring = 'ELSE{(\"' + elseValueCopy + '\")} ';
        var ReturnString =''; //'RETURN AS{(\"' + returntype.trim() + '")}'
        format = format + elsestring + ReturnString;
        
        component.set("v.ifElseFormat",format);
        component.set("v.ifElseDisplayValue",format);
        var tempIfElse = [];
        
        var devValue ;
        devValue = '{'+'\"FilterConditions\"'+':'+JSON.stringify(ifElseCollection)+',';        
        devValue = devValue+'\"MappingObjectField\"'+':'+'\"'+component.get("v.mappingObjectFieldValue")+'\",';
        devValue = devValue+'\"ElseValue\"'+':'+'\"'+elseValueCopy + '#' + elseValueOption+'\",';
        devValue = devValue+'\"ReturnType\"'+':'+'\"'+returntype+'\"}';                
                        
        devValueContent = devValue;
        component.set("v.ifElseDevValue",devValueContent);
        return devValueContent;
    },
    
})