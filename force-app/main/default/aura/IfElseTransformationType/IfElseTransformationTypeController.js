({ 
    //used
    doInit: function(component, event, helper) {        
        component.set("v.loadingSpinner",true);
        helper.firstaddRecord(component, event, helper); 
        helper.getMappingObjectFields(component, event, helper);        
        //helper.handleGetMappingFields(component, event, helper);         
    },
    //used
    handleValue: function(component, event, helper) {
        if (component.get("v.childFields").length == 0 && !component.get("v.isUsedInMapping")) {
            if (component.get("v.returnTypeValue") == 'Currency') {
                if ((component.get("v.decimalPlace") != '' && component.get("v.decimalPlace") != null &&
                        component.get("v.decimalPlace") != undefined) && Number(component.get("v.decimalPlace") > 4)) {
                    component.set("v.decimalPlace", '4')
                }
            }
            var mainList = component.get("v.masterTableList");
            var mainListLength = mainList.length;
            for (let p = 0; p < mainListLength; p++) {
                var tempList = mainList[p];
                var tempListLength = tempList.length;
                for (let l = 0; l < tempListLength; l++) {
                    if (tempList[l].thenoptionvalue != 'Direct') {
                        tempList[l].thenvalue = ''
                    }
                }
            }
            component.set("v.masterTableList", mainList)
            if (component.get("v.elseoptionvalue") != 'Direct') {
                component.set("v.elsevalue", '')
            }
            helper.refreshThenAndElseValues(component, event, helper);
        } else {
            component.set("v.returnTypeValue", component.get("v.oldDataType"));
            if (component.get("v.childFields").length != 0 && component.get("v.isUsedInMapping")) {
                helper.showToastMessage(component, event, helper, "error", "Data type cannot be changed. Formula referred in mapping and another formula -  " + component.get("v.childFieldsText") + '.');
            } else if (component.get("v.childFields").length != 0) {
                helper.showToastMessage(component, event, helper, "error", "Data type cannot be changed. Formula referred in another formula -  " + component.get("v.childFieldsText") + '.');
            } else if (component.get("v.isUsedInMapping")) {
                helper.showToastMessage(component, event, helper, "error", "Data type cannot be changed. Formula referred in mapping.");
            }
        }
    },
    //used
    deleteif: function(component, event, helper) {
        var secIndex = event.currentTarget.dataset.id;
        var masterdata = component.get('v.masterTableList');
        if (masterdata.length > 1) {
            masterdata.splice(secIndex, 1);
        } else {
            var tablelist = [];
            tablelist = masterdata[secIndex];
            var tablelistLength = tablelist.length;
            for (var i = 0; i < tablelistLength; i++) {
                tablelist[i].No = i + 1
                tablelist[i].andCondition = true
                tablelist[i].orCondition = false
                tablelist[i].customCondition = false
                tablelist[i].opencustom = false
                tablelist[i].customformula = ''
                tablelist[i].field = ''
                tablelist[i].fieldpresent = false
                tablelist[i].fieldtype = 'Text'
                tablelist[i].operator = ''
                tablelist[i].type = ''
                tablelist[i].isTypepresent = false
                tablelist[i].isString = true
                tablelist[i].isNumber = false
                tablelist[i].isBoolean = false
                tablelist[i].isCurrency = false
                tablelist[i].isDate = false
                tablelist[i].isDatetime = false
                tablelist[i].isTime = false
                tablelist[i].isVariables = false
                tablelist[i].isReference = false
                tablelist[i].value = ''
                tablelist[i].thenoptionvalue = 'Direct'
                tablelist[i].thenDirect = true
                tablelist[i].thenvalue = ''
                tablelist[i].thenReferece = false
                tablelist[i].thenvariables = false
                masterdata[secIndex] = tablelist;
            }
        }
        component.set('v.masterTableList', masterdata);
    },
    //used
    elsedecisionchange: function(component, event, helper) {
        helper.addIterationRow(component, event, helper)
    },
    //used
    checkBoolean: function(component, event, helper) {
        var selectedItem = event.currentTarget;
        var name = selectedItem.dataset.value;
        var secIndex = event.currentTarget.dataset.id;
        var masterdata = component.get('v.masterTableList');
        var tablelist = component.get('v.tableList');
        tablelist = masterdata[secIndex];
        tablelist[0].customConditionError = '';
        if (name == "All") {
            tablelist[0].orCondition = false;
            tablelist[0].customCondition = false;
            tablelist[0].opencustom = false;
            tablelist[0].andCondition = true;
            tablelist[0].customformula = "";            

        } else if (name == "Any") {

            tablelist[0].customCondition = false;
            tablelist[0].opencustom = false;
            tablelist[0].andCondition = false;
            tablelist[0].orCondition = true;
            tablelist[0].customformula = "";			

        } else if (name == "Custom") {
            tablelist[0].andCondition = false;
            tablelist[0].orCondition = false;
            tablelist[0].customCondition = true;
            tablelist[0].opencustom = true;
        }
        component.set('v.tableList', tablelist)
        masterdata[secIndex] = component.get('v.tableList');
        component.set('v.masterTableList', masterdata);
        component.set("v.tableList", [])
    },
    //used
    onHeaderChange: function(component, event, helper) {
        var secIndex = event.currentTarget.dataset.id;
        var selectedItem = event.currentTarget;
        var index = selectedItem.dataset.value;
        component.set('v.master', secIndex)
        component.set('v.child', index)
        var masterdata = component.get('v.masterTableList');
        var tablelist = component.get('v.tableList');
        tablelist = masterdata[secIndex];
        var fieldValue = tablelist[index].field;
        tablelist[index].fieldpresent = true;
        tablelist[index].fieldError = '';
        
        tablelist[index].operator = '';
        tablelist[index].type = '';
		tablelist[index].value = '';        
        
        var headerList = component.get("v.headerOptions");
        var headerListLength = headerList.length;
        var updatedHeaderList = [];
        for (var i = 0; i < headerListLength; i++) {
            if (headerList[i].value != fieldValue) {
                updatedHeaderList.push(headerList[i]);
            }
        }
        
        component.set("v.headerValueOptions",updatedHeaderList);
        
        //tablelist[index].comboList = updatedHeaderList;
        component.set('v.tableList', tablelist)
        masterdata[secIndex] = component.get('v.tableList');
        component.set('v.masterTableList', masterdata);
        component.set('v.master', '');
        component.set('v.child', '');
    },
    //used
    onOperatorChange: function(component, event, helper) {
        var secIndex = event.currentTarget.dataset.id;
        var selectedItem = event.currentTarget;
        var index = selectedItem.dataset.value;
        var selectedValue = selectedItem.dataset.record;
        var masterdata = component.get('v.masterTableList');
        var tablelist = component.get('v.tableList');
        tablelist = masterdata[secIndex];
        tablelist[index].operatorError = 'label-hidden'
        if (selectedValue == "IS NULL") {
            tablelist[index].isNullOperator = true
            tablelist[index].isBoolean = true
            tablelist[index].isTime = false
            tablelist[index].isDatetime = false
            tablelist[index].isString = false
            tablelist[index].isDate = false
            tablelist[index].isCurrency = false
            tablelist[index].isVariables = false
            tablelist[index].isReference = false
            tablelist[index].isNumber = false
            tablelist[index].type = ''
            tablelist[index].isTypepresent = false
            tablelist[index].value = ''
        } else {
            tablelist[index].isNullOperator = false
            tablelist[index].isBoolean = false
            tablelist[index].isTime = false
            tablelist[index].isDatetime = false
            tablelist[index].isString = true
            tablelist[index].isDate = false
            tablelist[index].isCurrency = false
            tablelist[index].isVariables = false
            tablelist[index].isReference = false
            tablelist[index].isNumber = false
            tablelist[index].type = ''
            tablelist[index].isTypepresent = false
            tablelist[index].value = ''
        }
        component.set('v.tableList', tablelist)
        masterdata[secIndex] = component.get('v.tableList');
        component.set('v.masterTableList', masterdata);
        component.set("v.tableList", [])
    },
    //used
    onTypeChange: function(component, event, helper) {
        var secIndex = event.currentTarget.dataset.id;
        var selectedItem = event.currentTarget;
        var index = selectedItem.dataset.value;
        var masterdata = component.get('v.masterTableList');
        var tablelist = component.get('v.tableList');
        tablelist = masterdata[secIndex];
        var type = tablelist[index].type;
        tablelist[index].typeError = 'label-hidden'
        tablelist[index].valueError = 'label-hidden'
        if (type == 'Time') {
            tablelist[index].isTime = true
            tablelist[index].isDatetime = false
            tablelist[index].isDate = false
            tablelist[index].isCurrency = false
            tablelist[index].isBoolean = false
            tablelist[index].isString = false
            tablelist[index].isVariables = false
            tablelist[index].isReference = false
            tablelist[index].isNumber = false
            tablelist[index].isTypepresent = true
            tablelist[index].value = ''
        } else if (type == 'Datetime') {
            tablelist[index].isDatetime = true
            tablelist[index].isTime = false
            tablelist[index].isDate = false
            tablelist[index].isCurrency = false
            tablelist[index].isBoolean = false
            tablelist[index].isString = false
            tablelist[index].isVariables = false
            tablelist[index].isReference = false
            tablelist[index].isNumber = false
            tablelist[index].isTypepresent = true
            tablelist[index].value = ''
        } else if (type == 'Date') {

            tablelist[index].isDate = true
            tablelist[index].isTime = false
            tablelist[index].isDatetime = false
            tablelist[index].isCurrency = false
            tablelist[index].isBoolean = false
            tablelist[index].isString = false
            tablelist[index].isVariables = false
            tablelist[index].isReference = false
            tablelist[index].isNumber = false
            tablelist[index].isTypepresent = true
            tablelist[index].value = ''

        } else if (type == 'Currency') {
            tablelist[index].isCurrency = true
            tablelist[index].isTime = false
            tablelist[index].isDatetime = false
            tablelist[index].isDate = false
            tablelist[index].isBoolean = false
            tablelist[index].isString = false
            tablelist[index].isVariables = false
            tablelist[index].isReference = false
            tablelist[index].isNumber = false
            tablelist[index].isTypepresent = true
            tablelist[index].value = ''

        } else if (type == 'Boolean') {

            tablelist[index].isBoolean = true
            tablelist[index].isTime = false
            tablelist[index].isDatetime = false
            tablelist[index].isString = false
            tablelist[index].isDate = false
            tablelist[index].isCurrency = false
            tablelist[index].isVariables = false
            tablelist[index].isReference = false
            tablelist[index].isNumber = false
            tablelist[index].isTypepresent = true
            tablelist[index].value = ''

        } else if (type == 'Field Reference') {
            tablelist[index].isReference = true
            tablelist[index].isTime = false
            tablelist[index].isDatetime = false
            tablelist[index].isNumber = false
            tablelist[index].isDate = false
            tablelist[index].isCurrency = false
            tablelist[index].isString = false
            tablelist[index].isBoolean = false
            tablelist[index].isVariables = false
            tablelist[index].isTypepresent = true
            tablelist[index].value = ''

        } else if (type == 'Direct') {

            tablelist[index].isString = true
            tablelist[index].isTime = false
            tablelist[index].isDatetime = false
            tablelist[index].isCurrency = false
            tablelist[index].isDate = false
            tablelist[index].isBoolean = false
            tablelist[index].isVariables = false
            tablelist[index].isReference = false
            tablelist[index].isNumber = false
            tablelist[index].isTypepresent = true
            tablelist[index].value = ''
        } else if (type == 'Number') {
            tablelist[index].isNumber = true
            tablelist[index].isTime = false
            tablelist[index].isDatetime = false
            tablelist[index].isCurrency = false
            tablelist[index].isString = false
            tablelist[index].isBoolean = false
            tablelist[index].isVariables = false
            tablelist[index].isReference = false
            tablelist[index].isDate = false
            tablelist[index].isTypepresent = true
            tablelist[index].value = ''
        }
        component.set('v.tableList', tablelist)
        masterdata[secIndex] = component.get('v.tableList');
        component.set('v.masterTableList', masterdata);
        component.set("v.tableList", [])

    },
    //used
    removeTableRow: function(component, event, helper) {
        var secIndex = event.currentTarget.dataset.id;
        var selectedItem = event.currentTarget;
        var index = selectedItem.dataset.value;
        var masterdata = component.get('v.masterTableList');
        var tablelist = component.get('v.tableList');
        tablelist = masterdata[secIndex];
        var tablelistLength = tablelist.length;
        if (tablelistLength > 1) {
            if (index == 0) {
                var pos = parseInt(index) + 1;
                tablelist[pos].andCondition = tablelist[index].andCondition
                tablelist[pos].orCondition = tablelist[index].orCondition
                tablelist[pos].customCondition = tablelist[index].customCondition
                tablelist[pos].opencustom = tablelist[index].opencustom
                tablelist[pos].customformula = tablelist[index].customformula
                tablelist[pos].thenoptionvalue = tablelist[index].thenoptionvalue
                tablelist[pos].thenDirect = tablelist[index].thenDirect
                tablelist[pos].thenvalue = tablelist[index].thenvalue
                tablelist[pos].thenReferece = tablelist[index].thenReferece
                tablelist[pos].thenvariables = tablelist[index].thenvariables
            }
            for (var i = parseInt(index); i < tablelistLength; i++) {
                tablelist[i].No = parseInt(tablelist[i].No) - 1;
            }
            tablelist.splice(index, 1);
            component.set('v.tableList', tablelist)
            masterdata[secIndex] = component.get('v.tableList');
            component.set('v.masterTableList', masterdata);
            component.set("v.tableList", [])
        } else {
            tablelist[index].field = '';
            tablelist[index].fieldpresent = false;
            tablelist[index].fieldtype = 'Text'
            tablelist[index].operator = ''
            tablelist[index].type = ''
            tablelist[index].isNullOperator = false
            tablelist[index].isTypepresent = false
            tablelist[index].isString = true
            tablelist[index].isNumber = false
            tablelist[index].isBoolean = false
            tablelist[index].isCurrency = false
            tablelist[index].isDate = false
            tablelist[index].isDatetime = false
            tablelist[index].isTime = false
            tablelist[index].isVariables = false
            tablelist[index].isReference = false
            tablelist[index].value = ''
            component.set('v.tableList', tablelist)
            masterdata[secIndex] = component.get('v.tableList');
            component.set('v.masterTableList', masterdata);
            component.set("v.tableList", [])
        }
    },
    //used
    addRow: function(component, event, helper) {
        helper.addRecord(component, event);
    },
    //used
    thenSelection: function(component, event, helper) {
        var secIndex = event.currentTarget.dataset.id;
        var masterdata = component.get('v.masterTableList');
        var tablelist = component.get('v.tableList');
        tablelist = masterdata[secIndex];
        var thenoption = tablelist[0].thenoptionvalue;
        tablelist[0].thenValueError = "label-hidden"
        if (thenoption == 'Direct') {

            tablelist[0].thenReferece = false;
            tablelist[0].thenvariables = false;
            tablelist[0].thenDirect = true;
            tablelist[0].thenvalue = '';

        } else if (thenoption == 'Field Reference') {
            tablelist[0].thenvariables = false;
            tablelist[0].thenDirect = false;
            tablelist[0].thenReferece = true;
            tablelist[0].thenvalue = '';

        }
        component.set('v.tableList', tablelist)
        masterdata[secIndex] = component.get('v.tableList');
        component.set('v.masterTableList', masterdata);
        component.set("v.tableList", [])
    },
    //used
    onThenValueChange: function(component, event, helper) {
        var secIndex = event.currentTarget.dataset.id;
        var masterdata = component.get('v.masterTableList');
        var tablelist = component.get('v.tableList');
        tablelist = masterdata[secIndex];
        tablelist[0].thenValueError = "label-hidden"
        component.set('v.tableList', tablelist)
        masterdata[secIndex] = component.get('v.tableList');
        component.set('v.masterTableList', masterdata);
        component.set("v.tableList", [])
    },
    //used
    elsedoactionchange: function(component, event, helper) {
        component.set("v.elseValueStyle", 'label-hidden')
        var elseoptionvalue = component.get("v.elseoptionvalue");
        if (elseoptionvalue == 'Direct') {

            component.set("v.isreference", false);
            component.set("v.isVariables", false);
            component.set("v.isDirect", true);
            component.set("v.elsevalue", '');
        } else if (elseoptionvalue == 'Field Reference') {
            component.set("v.isDirect", false);
            component.set("v.isVariables", false);
            component.set("v.isreference", true);
            component.set("v.elsevalue", '');
        }
    },
    //used
    onElseValueChange: function(component, event, helper) {
        component.set("v.elseValueStyle", 'label-hidden')
    },
    //used
    onChangeSubHeaderType: function(component, event, helper) {
        var subHeaderType = component.get("v.subHeaderType");
        component.set("v.subHeaderValue", "")
        component.set("v.subHeaderStyle", "label-hidden");
        component.set("v.subHeaderString", "")
        component.set("v.elseType", 'Direct');
        component.set("v.subelseValue", '');
    },
    //used
    handleValidation: function(component, event, helper) {
        if (event.getParam("type") == 'If-Else') 
        {
            if (helper.validateIfElse(component, event, helper)) 
            {
                var devValue = helper.setIfElseValueHelper(component, event, helper);
                var appEvent = component.getEvent('saveTransformationEvent');
                appEvent.setParams({
                    "type": "If-Else", 
                    "Selectedvalue": component.get("v.ifElseFormat"),
                    "DevValueContent" : devValue                    
                });
                appEvent.fire();
            }
        }
    },
    
    handleValidateTransformationValue: function(component, event, helper) {
        if (helper.validateIfElse(component, event, helper)) 
        {
            var devValue = helper.setIfElseValueHelper(component, event, helper);
            var triggerSaveEvent = component.getEvent("triggerSaveEvent");
            triggerSaveEvent.setParams({
                "isSaveTriggered" : "true" ,
                "type" : "Object Reference"
            });
            triggerSaveEvent.fire();
        }
    },
    
})