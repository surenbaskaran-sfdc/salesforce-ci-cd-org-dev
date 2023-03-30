({
    doInitHelper: function (component, event, helper) {
        var action = component.get("c.getContractRuleRecord");
        action.setParams({ recordId: component.get("v.templateId") });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var contractRuleRecords = response.getReturnValue();
                
                if(contractRuleRecords.length == 0){
                    component.set("v.hasAccess",false);
                    this.removeSpinner(component, event, helper)
                }
                else{
                    component.set("v.hasAccess",true);
                    this.getFieldNames(component, event, helper, contractRuleRecords[1]);
                    var contractRuleRecord = contractRuleRecords[0];
                    if (contractRuleRecord.Conditions__c != null && contractRuleRecord.Conditions__c != undefined && contractRuleRecord.Conditions__c != "") {
                        component.set("v.conditions", JSON.parse(contractRuleRecord.Conditions__c));
                    }
                    else {
                        var conditions = {
                            "andCondition": false,
                            "andConditionStyle": "",
                            "orCondition": false,
                            "orConditionStyle": "",
                            "customCondition": false,
                            "customConditionStyle": "",
                            "customFormula": "",
                            "customFormulaStyle": "",
                            "conditions": []
                        };
                        component.set("v.conditions", conditions)
                        contractRuleRecord.Conditions__c = conditions;
                    }
                    component.set("v.contractRuleRecord", contractRuleRecord);
                }
            }
        });
        $A.enqueueAction(action);
    },
    escapeEventHelper: function (component, event, helper) {
        window.addEventListener("keydown", function (event) {
            var kcode = event.code;
            if (kcode == 'Escape') {
                helper.onPressKeyboardKey(component, event, helper);
            }
        }, true);
    },
    onPressKeyboardKey: function (component, event, helper) {
        var keyValue = event.which;
        if (keyValue == 27) {
            component.set("v.isDeleteLabel", false);
        }
    },
    getFieldNames: function (component, event, helper, record) {
        var fieldNamesSorted = [];
        var fieldType = {};
        var response = JSON.parse(record.Conditions__c);
        var fieldNamesString = response.objectFields;
        var allPicklistvalues = response.allPicklistValues;
        var finalList = [];
        for (var key in allPicklistvalues) {
            if (allPicklistvalues.hasOwnProperty(key)) {
                finalList.push({ 'label': key, 'value': allPicklistvalues[key] });
            }
        }
        component.set("v.allPickList", finalList)
        
        console.log({allPicklistvalues});
        
        var fieldNamesStringLength = fieldNamesString.length;
        for (var i = 0; i < fieldNamesStringLength; i++) {
            var nameString = fieldNamesString[i];
            var nameList = nameString.split("-");
            fieldNamesSorted.push({
                "label": nameList[0],
                "value": nameList[1]
            })
            fieldType[nameList[1]] = nameList[2];
        }
        fieldNamesSorted.sort(function (a, b) {
            var nameA = a.label, nameB = b.label
            if (nameA < nameB)
                return -1
                if (nameA > nameB)
                    return 1
                    return 0
        })
        component.set("v.fieldNames", fieldNamesSorted);
        component.set("v.fieldType", fieldType);
        this.removeSpinner(component, event, helper)
    },
    
    handleRadioSelect: function (component, event, helper) {
        helper.showFooter(component, event, helper);
        var conditions = component.get("v.conditions");
        var selected = event.getSource().get("v.value");
        conditions.andConditionStyle = "";
        conditions.orConditionStyle = "";
        conditions.customConditionStyle = "";
        conditions.customFormulaStyle = "";
        if (selected == "All") {
            conditions.andCondition = true;
            conditions.orCondition = false;
            conditions.customCondition = false;
            conditions.customFormula = "";
        }
        if (selected == "Any") {
            conditions.andCondition = false;
            conditions.orCondition = true;
            conditions.customCondition = false;
            conditions.customFormula = "";
        }
        if (selected == "Custom") {
            conditions.andCondition = false;
            conditions.orCondition = false;
            conditions.customCondition = true;
            conditions.customFormula = "";
        }
        component.set("v.conditions", conditions);
    },
    
    handleFieldChange: function (component, event, helper) {
        helper.showFooter(component, event, helper);
        var index = event.getSource().get("v.name");
        var conditionsObject = component.get("v.conditions");
        var conditions = conditionsObject.conditions;
        if (conditions[index].field != null
            && conditions[index].field != undefined
            && conditions[index].field != '') {
            conditions[index].fieldType = component.get("v.fieldType")[conditions[index].field];
            conditions[index].operatorDisabled = false;
        }
        else {
            conditions[index].fieldType = "text";
            conditions[index].operatorDisabled = true;
        }
        conditions[index].operator = "";
        conditions[index].fieldStyle = 'label-hidden';
        conditions[index].value = '';
        conditions[index].operatorType = "text";
        conditions[index].valueDisabled = true;
        conditionsObject.conditions = conditions;
        component.set("v.conditions", conditionsObject);
    },
    
    handleOperatorChange: function (component, event, helper) {
        helper.showFooter(component, event, helper);
        var index = event.getSource().get("v.name");
        var conditionsObject = component.get("v.conditions");
        var conditions = conditionsObject.conditions;
        if (conditions[index].operator != "" && conditions[index].operator != null && conditions[index].operator != undefined) {
            conditions[index].valueDisabled = false;
            if (conditions[index].fieldType == 'boolean' || conditions[index].operator == "IS NULL") {
                conditions[index].operatorType = 'boolean';
            }
            else if (conditions[index].fieldType == "time") {
                conditions[index].operatorType = 'time';
            }
                else if (conditions[index].fieldType == 'date') {
                    conditions[index].operatorType = 'date';
                }
                    else if (conditions[index].fieldType == 'datetime') {
                        conditions[index].operatorType = 'date';
                    }
                        else if (conditions[index].fieldType == 'picklist' && (conditions[index].operator == 'EQUALS' || conditions[index].operator == 'NOT EQUALS')) {
                            conditions[index].operatorType = 'picklist';
                        }
                            else {
                                conditions[index].operatorType = 'text';
                            }
        }
        else {
            conditions[index].operatorType = 'text';
            conditions[index].valueDisabled = true;
        }
        conditions[index].operatorStyle = 'label-hidden';
        conditions[index].value = '';
        conditionsObject.conditions = conditions;
        component.set("v.conditions", conditionsObject);
    },
    handlePicklistChangeHelper: function (component, event, helper) {
        helper.showFooter(component, event, helper);
    },
    handleAddRowOperation: function (component, event, helper) {
        helper.showFooter(component, event, helper);
        var conditionsObject = component.get("v.conditions");
        var conditions = conditionsObject.conditions;
        conditions.push({
            "field": "",
            "fieldStyle": "label-hidden",
            "fieldType": "text",
            "operator": "",
            "operatorStyle": "label-hidden",
            "operatorType": "text",
            "operatorDisabled": true,
            "value": "",
            "valueStyle": "label-hidden",
            "valueDisabled": true
        });
        conditionsObject.conditions = conditions;
        component.set("v.conditions", conditionsObject);
    },
    
    handleDeleteRowOperation: function (component, event, helper, index) {
        helper.showFooter(component, event, helper);
        var conditionsObject = component.get("v.conditions");
        var conditions = conditionsObject.conditions;
        conditions.splice(index, 1);
        if (conditions.length == 0) {
            conditionsObject.andCondition = false;
            conditionsObject.orCondition = false;
            conditionsObject.customCondition = false;
            conditionsObject.andConditionStyle = "";
            conditionsObject.orConditionStyle = "";
            conditionsObject.customConditionStyle = "";
            conditionsObject.customFormula = "";
            conditionsObject.customFormulaStyle = "";
        }
        conditionsObject.conditions = conditions;
        component.set("v.conditions", conditionsObject);
    },
    
    handleValidation: function (component, event, helper) {
        helper.handleStyleReset(component, event, helper);
        var errorFlag = true;
        var conditionsObject = component.get("v.conditions");
        var conditions = conditionsObject.conditions;
        var conditionsLength = conditions.length;
        if (conditionsLength > 1) {
            if (!conditionsObject.andCondition && !conditionsObject.orCondition && !conditionsObject.customCondition) {
                conditionsObject.andConditionStyle = "slds-has-error";
                conditionsObject.orConditionStyle = "slds-has-error";
                conditionsObject.customConditionStyle = "slds-has-error";
                errorFlag = false;
            }
        }
        if (conditionsObject.customCondition) {
            if (conditionsObject.customFormula == undefined || conditionsObject.customFormula == null || conditionsObject.customFormula.trim() == "") {
                conditionsObject.customFormulaStyle = "slds-has-error";
                errorFlag = false;
            }
            else {
                //validate custom condition
                var result, str, res, res1, res2, res3, domCntr = 0, cntr = 0;
                var logical_List = [];
                var _parenthesis = [];
                var isNumber = /[\d\.]+/;
                var _space = /\s/g;
                var isValidSet = true;
                var isSplChars = false;
                result = String(conditionsObject.customFormula).trim();
                conditionsObject.customFormula = conditionsObject.customFormula.trim();
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
                    }
                    else {
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
                        if (parseInt(logical_List[s].chars) > parseInt(conditionsObject.conditions.length)) {
                            isValidSet = false;
                        }
                        else if (parseInt(logical_List[s].chars) == 0) {
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
                        conditionsObject.customFormulaStyle = 'slds-has-error';
                    }
                    
                    //unexpected characters
                    if (result.match(/[a-z]/i)) {
                        conditionsObject.customFormulaStyle = 'slds-has-error';
                    }
                    
                    //unavailable set in expression
                    if (!isValidSet) {
                        conditionsObject.customFormulaStyle = 'slds-has-error';
                    }
                    
                    //space not allowed
                    if (_space.test(result)) {
                        conditionsObject.customFormulaStyle = 'slds-has-error';
                    }
                    
                    //unbalanced parenthesis
                    if (cntr != 0) {
                        conditionsObject.customFormulaStyle = 'slds-has-error';
                    }
                    
                    //starts with 
                    if (result.startsWith('+') || result.startsWith('*')) {
                        conditionsObject.customFormulaStyle = 'slds-has-error';
                    }
                    
                    //ends with
                    else if (result.endsWith('+') || result.endsWith('*') || result.endsWith('!')) {
                        conditionsObject.customFormulaStyle = 'slds-has-error';
                    }
                    
                    //Empty parenthesis
                    if (logical_List[q].chars == "(") {
                        if ((q + 1) < logical_List.length) {
                            if (logical_List[q + 1].chars == ')') {
                                conditionsObject.customFormulaStyle = 'slds-has-error';
                            }
                        }
                    }
                    
                    //NOT Validation
                    if (logical_List[q].chars == "!") {
                        if ((q + 1) < logical_List.length) {
                            if (logical_List[q + 1].chars != '(') {
                                conditionsObject.customFormulaStyle = 'slds-has-error';
                            }
                        }
                        if (logical_List[q].chars == '!') {
                            if (q != 0) {
                                if (logical_List[q - 1].chars != '*' && logical_List[q - 1].chars != '+' && logical_List[q - 1].chars != '(') {
                                    conditionsObject.customFormulaStyle = 'slds-has-error';
                                }
                            }
                        }
                    }
                    
                    //Consequetive Operators
                    if ((q + 1) < logical_List.length) {
                        if (logical_List[q].chars == '+' || logical_List[q].chars == '*' || logical_List[q].chars == '!') {
                            if (logical_List[q + 1].chars == '+' || logical_List[q + 1].chars == '*') {
                                conditionsObject.customFormulaStyle = 'slds-has-error';
                            }
                        }
                        else if (logical_List[q].chars != '+' && logical_List[q].chars != '*' && logical_List[q].chars != '!' && logical_List[q].chars != '(' && logical_List[q].chars != ')') {
                            if (logical_List[q + 1].chars != '+' && logical_List[q + 1].chars != '*' && logical_List[q + 1].chars != '!' && logical_List[q + 1].chars != '(' && logical_List[q + 1].chars != ')') {
                                conditionsObject.customFormulaStyle = 'slds-has-error';
                            }
                        }
                    }
                    
                    //validation at open parenthesis
                    if (logical_List[q].chars == '(') {
                        if ((q + 1) < logical_List.length) {
                            if (logical_List[q + 1].chars == '*' || logical_List[q + 1].chars == '+') {
                                conditionsObject.customFormulaStyle = 'slds-has-error';
                            }
                        }
                        if (q != 0) {
                            if (logical_List[q - 1].chars != '*' && logical_List[q - 1].chars != '+' && logical_List[q - 1].chars != '!' && logical_List[q - 1].chars != '(') {
                                conditionsObject.customFormulaStyle = 'slds-has-error';
                            }
                        }
                    }
                    
                    //valdation at close parenthesis
                    if (logical_List[q].chars == ')') {
                        if ((q + 1) < logical_List.length) {
                            if (logical_List[q + 1].chars != '*' && logical_List[q + 1].chars != '+' && logical_List[q + 1].chars != ')') {
                                conditionsObject.customFormulaStyle = 'slds-has-error';
                            }
                        }
                        if (q != 0) {
                            if (logical_List[q - 1].chars == '*' || logical_List[q - 1].chars == '+') {
                                conditionsObject.customFormulaStyle = 'slds-has-error';
                            }
                        }
                    }
                    
                    //manage preference at *
                    if (logical_List[q].chars == '*') {
                        if ((q + 2) < logical_List.length) {
                            if (logical_List[q + 2].chars == '+') {
                                conditionsObject.customFormulaStyle = 'slds-has-error';
                            }
                        }
                    }
                    
                    //manage preference at +
                    if (logical_List[q].chars == '+') {
                        if ((q + 2) < logical_List.length) {
                            if (logical_List[q + 2].chars == '*') {
                                conditionsObject.customFormulaStyle = 'slds-has-error';
                            }
                        }
                    }
                    
                    //manage preference in parenthesis add
                    if (logical_List[q].chars == '*') {
                        if ((q + 5) < logical_List.length) {
                            if (logical_List[q + 5].chars == '+' && logical_List[q + 1].chars == '!') {
                                conditionsObject.customFormulaStyle = 'slds-has-error';
                            }
                        }
                    }
                    
                    if (logical_List[q].chars == '+') {
                        if ((q + 5) < logical_List.length) {
                            if (logical_List[q + 5].chars == '*' && logical_List[q + 1].chars == '!') {
                                conditionsObject.customFormulaStyle = 'slds-has-error';
                            }
                        }
                    }
                    //manage preference in nested operation
                    if (domCntr > 1) {
                        //errorFlag = false;
                        conditionsObject.customFormulaStyle = 'slds-has-error';
                    }
                }
                //end
            }
        }
        for (var i = 0; i < conditionsLength; i++) {
            if (conditions[i].field == undefined || conditions[i].field == null || conditions[i].field == "") {
                errorFlag = false;
                conditions[i].fieldStyle = "label-hidden slds-has-error";
            }
            if (conditions[i].operator == undefined || conditions[i].operator == null || conditions[i].operator == "") {
                errorFlag = false;
                conditions[i].operatorStyle = "label-hidden slds-has-error";
            }
            if (conditions[i].value == undefined || conditions[i].value == null || conditions[i].value.trim() == "") {
                errorFlag = false;
                conditions[i].valueStyle = "label-hidden slds-has-error";
            }
        }
        conditionsObject.conditions = conditions;
        component.set("v.conditions", conditionsObject);
        if (conditionsObject.customFormulaStyle != "") {
            return [errorFlag, false];
        }
        else {
            return [errorFlag, true]
        }
    },
    
    handleDuplicateValidation: function (component, event, helper) {
        //helper.handleStyleReset(component, event, helper);
        var duplicateFlag = true;
        var conditionsObject = component.get("v.conditions");
        var conditions = conditionsObject.conditions;
        var conditionsLength = conditions.length;
        for (var i = 0; i < conditionsLength; i++) {
            var condition1 = conditions[i];
            for (var j = i + 1; j < conditionsLength; j++) {
                var condition2 = conditions[j];
                if ((condition1.field == condition2.field) && (condition1.operator == condition2.operator) && (condition1.value == condition2.value)) {
                    duplicateFlag = false;
                    conditions[i].fieldStyle = "label-hidden slds-has-error";
                    conditions[i].operatorStyle = "label-hidden slds-has-error";
                    conditions[i].valueStyle = "label-hidden slds-has-error";
                    conditions[j].fieldStyle = "label-hidden slds-has-error";
                    conditions[j].operatorStyle = "label-hidden slds-has-error";
                    conditions[j].valueStyle = "label-hidden slds-has-error";
                }
            }
        }
        conditionsObject.conditions = conditions;
        component.set("v.conditions", conditionsObject);
        return duplicateFlag;
    },
    
    handleStyleReset: function (component, event, helper) {
        var conditionsObject = component.get("v.conditions");
        var conditions = conditionsObject.conditions;
        var conditionsLength = conditions.length;
        conditionsObject.andConditionStyle = "";
        conditionsObject.orConditionStyle = "";
        conditionsObject.customConditionStyle = "";
        conditionsObject.customFormulaStyle = "";
        for (var i = 0; i < conditionsLength; i++) {
            conditions[i].fieldStyle = "label-hidden";
            conditions[i].operatorStyle = "label-hidden";
            conditions[i].valueStyle = "label-hidden";
            if(conditions[i].value != undefined && conditions[i].value != null){
                conditions[i].value = conditions[i].value.trim();
            }
        }
        conditionsObject.conditions = conditions;
        component.set("v.conditions", conditionsObject);
    },
    
    handleCancelOperation: function (component, event, helper) {
        helper.hideFooter(component, event, helper);
        this.addSpinner(component, event, helper)
        component.set("v.conditions",{})
        this.doInitHelper(component, event, helper);
    },
    
    handleSaveOperation: function (component, event, helper) {
        helper.hideFooter(component, event, helper);
        this.addSpinner(component, event, helper)
        var finalConditionString = "";
        var conditionsObject = component.get("v.conditions");
        var conditions = conditionsObject.conditions;
        if (conditions.length != 0) {
            finalConditionString = JSON.stringify(component.get("v.conditions"));
        }
        var contractRuleRecord = component.get("v.contractRuleRecord");
        contractRuleRecord.Conditions__c = finalConditionString;
        var action = component.get("c.saveNOPTemplatesRecord");
        action.setParams({ record: contractRuleRecord });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                helper.handleReload(component, event, helper,contractRuleRecord);
                //this.doInitHelper(component, event, helper);
                this.removeSpinner(component, event, helper);
                this.showToastMessage(component, event, helper, "Success", "Conditions saved successfully.");
            }
        });
        $A.enqueueAction(action);
    },
    
    handleReload : function(component,event,helper,contractRuleRecord){
        if (contractRuleRecord.Conditions__c != null && contractRuleRecord.Conditions__c != undefined && contractRuleRecord.Conditions__c != "") {
            //do nothing
            //component.set("v.conditions", JSON.parse(contractRuleRecord.Conditions__c));
        }
        else {
            var conditions = {
                "andCondition": false,
                "andConditionStyle": "",
                "orCondition": false,
                "orConditionStyle": "",
                "customCondition": false,
                "customConditionStyle": "",
                "customFormula": "",
                "customFormulaStyle": "",
                "conditions": []
            };
            component.set("v.conditions", conditions)
            contractRuleRecord.Conditions__c = conditions;
        }
        component.set("v.contractRuleRecord", contractRuleRecord);
    },
    
    handleCustomFromulaChange: function (component, event, helper) {
        var conditions = component.get("v.conditions");
        conditions.customFormulaStyle = "";
        component.set("v.conditions", conditions);
        helper.showFooter(component, event, helper);
    },
    
    handleValueChange: function (component, event, helper) {
        var index = event.getSource().get("v.name");
        var conditions = component.get("v.conditions");
        conditions.conditions[index].valueStyle = "label-hidden";
        component.set("v.conditions", conditions);
        helper.showFooter(component, event, helper);
    },
    
    addSpinner: function (component, event, helper) {
        var spinner = component.find("uSpinnerContainer");
        $A.util.removeClass(spinner, "slds-hide");
    },
    
    removeSpinner: function (component, event, helper) {
        var spinner = component.find("uSpinnerContainer");
        $A.util.addClass(spinner, "slds-hide");
    },
    
    showToastMessage: function (component, event, helper, type, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": type,
            "type": type,
            "message": message
        });
        toastEvent.fire();
    },
    
    showFooter: function (component, event, helper) {
        component.set("v.showCancelSaveButton", true);
    },
    
    hideFooter: function (component, event, helper) {
        component.set("v.showCancelSaveButton", false);
    },
    
})