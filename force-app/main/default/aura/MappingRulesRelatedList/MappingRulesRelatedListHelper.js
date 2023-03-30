({  
    initContractRule : function(component, event, helper) 
    {     
        //console.log('In initfunc')
        
        helper.escapeEventHelper(component,event,helper);
        helper.getContractRuleDetailsHelper(component,event,helper);
        helper.getMappingRulesDetailsHelper(component,event,helper);
        //helper.getDefaultMappingRuleValue(component,event,helper);          
    },
    escapeEventHelper: function (component, event, helper) {
        window.addEventListener("keydown", $A.getCallback(function (event) {
            if (event.code == 'Escape') {                
                helper.onPressKeyboardKey(component, event, helper);
            }
        }, true));
    },
    
    getMappingRulesDetailsHelper: function(component, event, helper) 
    {
        //console.log('In getMappingRulesDetailsHelper')  
        var action = component.get("c.getChildDataList");
        action.setParams({
            "childObjectName" : "Mapping_Rule__c",
            "parentObjectName": 'Contract_Rule__c',
            "recId": component.get("v.recordId")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var mappingRulesList = response.getReturnValue();                      
                //if(storeResponse.length>0)
                //{                                        
                //console.log('mappingRulesList ::: ' ,JSON.stringify(mappingRulesList)); 
                
                if(mappingRulesList.length > 0){
                    mappingRulesList.sort(function(a,b) {
                        var t1 = a.Rule_Order__c == b.Rule_Order__c, t2 = a.Rule_Order__c < b.Rule_Order__c;
                        return t1? 0: (mappingRulesList?-1:1)*(t2?1:-1);
                    });
                }
                
                
                component.set("v.mappingRulesList",mappingRulesList);                                         
                
            }
        });
        $A.enqueueAction(action);
    },
    
    getDefaultMappingRuleValue : function(component, event, helper) 
    {
        //console.log('In getDefaultMappingRuleValue')
        var defaultTableDataTemp = [];
        defaultTableDataTemp.push({    
            'Id' : '',
            'Name': '',
            'NameError': '',            
            'Transformation_Value__c': '',
            'TransformationValueError': '',
            'Target_Field__c': '',   
            'TargetFieldError': '',   
            'Dev_value__c': '',
            'Contract_Rule__c':'',
            'transformationTypeError': '',
            'transformationValueError': 'slds-align_absolute-center label-hidden',
            'targetFieldError': 'slds-align_absolute-center label-hidden',                     
            'Mandatory__c': false,    
            'Allowed_for_update__c': false,    
        });
        component.set("v.mappingRulesList",defaultTableDataTemp);
    },
    handleAddRowHelper : function(component, event, helper) 
    {
        var defaultTableDataTemp = component.get("v.mappingRulesList");
        var rowData = {      
            'Id' : '',
            'Name': '',
            'NameError': '',            
            'Transformation_Value__c': '',
            'TransformationValueError': '',
            'Target_Field__c': '',   
            'TargetFieldError': '', 
            'Dev_value__c': '',
            'Contract_Rule__c':'',
            'transformationTypeError': ' label-hidden',
            'transformationValueError': 'slds-align_absolute-center label-hidden',
            'targetFieldError': 'slds-align_absolute-center label-hidden',                     
            'Mandatory__c': false,    
            'Allowed_for_update__c': false,    
        };
        /*if(component.get("v.mappingContractDetail.Job_Type__c") == 'Jobs'){
            rowData.Allowed_for_update__c = true;
        }*/
        defaultTableDataTemp.push(rowData);
        component.set("v.mappingRulesList",defaultTableDataTemp);
    },
    
    getContractRuleDetailsHelper : function(component, event, helper) {
        //console.log('In getContractRuleHelper')
        var action = component.get("c.getContractRuleDetails");
        action.setParams({
            "objectName": 'Contract_Rule__c',
            "recId": component.get("v.recordId")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();                      
                if(storeResponse.length>0)
                {                                        
                    //console.log('contractRuleDetail ::: ' ,JSON.stringify(storeResponse[1][0]))
                    //console.log('mappingContractDetail ::: ' ,JSON.stringify(storeResponse[2][0]))
                    
                    component.set("v.contractRuleDetail",storeResponse[1][0]); 
                    component.set("v.mappingContractDetail",storeResponse[2][0]);                                         
                    
                }
                helper.getTargetFieldsList(component,event,helper);
            }
        });
        $A.enqueueAction(action);
    },
    getTargetFieldsList: function(component,event,helper) 
    {
        //console.log('In getMappingObjectFields')
        var action = component.get("c.getMappingObjectAndFieldsDetails");
        action.setParams({
            "objectName": component.get("v.contractRuleDetail.Target_Object__c"),
            "dataStore": component.get("v.mappingContractDetail.Target_Datastore__c"),
            "type":"All"
            
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
                    
                    component.set("v.targetFieldOptions",mappingObjectFieldsList);                                        
                    component.set("v.loadingSpinner",false);
                }                                                   
            }
        });
        $A.enqueueAction(action);                
    },
    handleTransformationTypeChangeHelper: function(component,event,helper) 
    {
        var mappingRulesList = component.get("v.mappingRulesList");
        var selectedItem = event.currentTarget;
        var index = selectedItem.dataset.value;
        //console.log('index ::: ' , index)
        component.set("v.transformationType",mappingRulesList[index].Name);        
                
        mappingRulesList[index].NameError = '';
        mappingRulesList[index].Transformation_Value__c = '';
        mappingRulesList[index].Target_Field__c = '';
        mappingRulesList[index].Dev_value__c = '';
        /*mappingRulesList[index].transformationTypeError = ' label-hidden';
        mappingRulesList[index].transformationValueError = 'slds-align_absolute-center label-hidden';
        mappingRulesList[index].targetFieldError = 'slds-align_absolute-center label-hidden';*/
        mappingRulesList[index].Mandatory__c = false;
        mappingRulesList[index].Allowed_for_update__c = false;
        component.set("v.mappingRulesList", mappingRulesList);
    },        
    closeDeleteModalHelper: function (component, event, helper) 
    {                
        component.set('v.onDeleteClick',false);
    },    
    
    onclickSaveTransformationValueHelper: function(component, event, helper,message,toasttype) 
    {
        //console.log('In onclickSaveTransformationValueHelper')  
        var transformationType = component.get("v.transformationType");
        var mappingRulesList = component.get("v.mappingRulesList");        
        //console.log('mappingRuleIndex ::: ' , component.get("v.mappingRuleIndex"))
        switch (transformationType)
        {
            case 'Default':
                //console.log('In default')                
                component.find("default").validateTransformationValue();                
                break;
            case 'Direct':
                //console.log('In Direct')                
                component.find("direct").validateTransformationValue();                
                break;
            case 'If-Else':
                //console.log('In If-Else')                
                component.find("ifelse").validateTransformationValue();                
                break;
            case 'Object Reference':
                //console.log('In Object Reference')                
                component.find("objectreference").validateTransformationValue();                
                break;
            case 'Text Split':
                //console.log('In Text Split')                
                component.find("textsplit").validateTransformationValue();                
                break;
            case 'Text Area Split':
                //console.log('In Text Area Split')                
                component.find("textareasplit").validateTransformationValue();                
                break;
                
        }
        
    },
    
    handleSaveTransformationValueHelper : function(component, event, helper) 
    {  
        //console.log('In handleSaveTransformationValueHelper')        
        var transformationType = component.get("v.transformationType");
        var mappingRulesList = component.get("v.mappingRulesList");        
        var index = component.get("v.mappingRuleIndex");        
        switch (transformationType)
        {
            case 'Default':
                //console.log('In default')                
                var defaultData = component.find("default").get("v.defaultData");                                 
                mappingRulesList[index].Transformation_Value__c = defaultData;
                mappingRulesList[index].TransformationValueError = '';   
                break;
            case 'Direct':
                //console.log('In direct')                
                var directData = component.find("direct").get("v.directData");                                 
                mappingRulesList[index].Transformation_Value__c = directData;  
                mappingRulesList[index].TransformationValueError = '';   
                break;
            case 'If-Else':
                //console.log('In If-Else')   
                var ifElseDisplayValue = component.find("ifelse").get("v.ifElseDisplayValue");
                var ifElseDevValue = component.find("ifelse").get("v.ifElseDevValue");
                mappingRulesList[index].Transformation_Value__c = ifElseDisplayValue; 
                mappingRulesList[index].TransformationValueError = '';   
                mappingRulesList[index].Dev_value__c = ifElseDevValue; 
                break;
            case 'Object Reference':
                //console.log('In Object Reference')                
                var objectReferenceDisplayValue = component.find("objectreference").get("v.objectReferenceDisplayValue");
                var objectReferenceDevValue = component.find("objectreference").get("v.objectReferenceDevValue");
                mappingRulesList[index].Transformation_Value__c = objectReferenceDisplayValue; 
                mappingRulesList[index].TransformationValueError = '';   
                mappingRulesList[index].Dev_value__c = objectReferenceDevValue; 
                break;
            case 'Text Split':
                //console.log('In Text Split')                
                var textSplitDisplayValue = component.find("textsplit").get("v.DisplayValue");
                var textSplitDevValue = component.find("textsplit").get("v.DevValue");
                mappingRulesList[index].Transformation_Value__c = textSplitDisplayValue; 
                mappingRulesList[index].Dev_value__c = textSplitDevValue;
                mappingRulesList[index].TransformationValueError = '';   
                break;
            case 'Text Area Split':
                //console.log('In Text Area Split 1')                
                var textAreaSplitDisplayValue = component.find("textareasplit").get("v.DisplayValue");
                var textAreaSplitDevValue = component.find("textareasplit").get("v.DevValue");
                //console.log('textAreaSplitDisplayValue ::: ' , textAreaSplitDisplayValue)
                //console.log('textAreaSplitDevValue ::: ' , textAreaSplitDevValue)
                mappingRulesList[index].Transformation_Value__c = textAreaSplitDisplayValue; 
                mappingRulesList[index].TransformationValueError = '';   
                mappingRulesList[index].Dev_value__c = textAreaSplitDevValue;                 
                break;
                
        }
        component.set("v.mappingRulesList" , mappingRulesList);
        component.set("v.isOpenTransformationValueModal", false);
        component.set("v.isErrorFound", false);
        component.set("v.errorText", '');
        //console.log('After all')
        
    },
    
    handleTargetFieldChangeHelper : function(component, event, helper,type){
        //console.log('In handleTargetFieldChangeHelper')
        var mappingRulesList = component.get("v.mappingRulesList");
        var errorFound = true;
        for(var i = 0 ; i< mappingRulesList.length ; i++)
        {            
            for(var j = i+1 ; j< mappingRulesList.length ; j++)
            {
                //alert('123 ::: '+mappingRulesList[i].Target_Field__c +' : '+mappingRulesList[j].Target_Field__c)
                if((mappingRulesList[i].Target_Field__c == mappingRulesList[j].Target_Field__c) 
                   &&(mappingRulesList[i].Target_Field__c !='' && mappingRulesList[j].Target_Field__c !=''))
                {
                    errorFound = false;
                    mappingRulesList[j].TargetFieldError = 'slds-has-error';   
                    mappingRulesList[i].TargetFieldError = 'slds-has-error';   
                }
                /*else
                {
                    if(type == 'Change'){
                        alert('Inn')
                    mappingRulesList[j].TargetFieldError = '';   
                    mappingRulesList[i].TargetFieldError = '';   
                    }
                }*/
            }            
        }
        component.set("v.mappingRulesList" , mappingRulesList);
        //console.log('errorFound ::: ' , errorFound)
        return errorFound;
    },
    
    validateMappingRuleListHelper : function(component, event, helper){
        //console.log('In validateMappingRuleListHelper')
        var mappingRulesList = component.get("v.mappingRulesList");
        var errorFieldsSet = new Set();         
        for(var i = 0 ; i< mappingRulesList.length ; i++)
        {
            //console.log('map rule ::: ' , mappingRulesList[i])
            //console.log('map rule .Name ::: ' , mappingRulesList[i].Name)
            if(mappingRulesList[i].Name == '')
            {                
                mappingRulesList[i].NameError = 'slds-has-error';
                errorFieldsSet.add('Transformation type');
            }
            else
                mappingRulesList[i].NameError = '';
            
            if(mappingRulesList[i].Transformation_Value__c == '')
            {                
                mappingRulesList[i].TransformationValueError = 'slds-has-error';   
                errorFieldsSet.add('Transformation value');
            }
            else
                mappingRulesList[i].TransformationValueError = '';
                                            
            if(mappingRulesList[i].Target_Field__c == '')
            {                                                       
                mappingRulesList[i].TargetFieldError = 'slds-has-error';                
                errorFieldsSet.add('Target field');
            }
            else{            
                mappingRulesList[i].TargetFieldError = '';
            }
        }
        component.set("v.showfooter", true);   
        //console.log(JSON.stringify(mappingRulesList))
        component.set("v.loadingSpinner",false);
        component.set("v.mappingRulesList" , mappingRulesList);
        
        var duplicateError = '';
        if(!helper.handleTargetFieldChangeHelper(component, event, helper))
        {
            errorFieldsSet.add('Target field');
            duplicateError = 'Duplicate Target Field Found.';
        }
        
        var errorArr = Array.from(errorFieldsSet);//.sort();
        if(errorFieldsSet.size>0){
            var errorFieldsStr = '';
            for (let item of errorArr) {
                //console.log(item)
                errorFieldsStr = errorFieldsStr + item;
                errorFieldsStr = errorFieldsStr + ', ';
            }
            //console.log('errorFieldsStr ::: ' , errorFieldsStr)
            //console.log('finale ::: ' , errorFieldsStr.substring(0,errorFieldsStr.length - 2))            
            var finalErrorMsg = '';
            if(errorFieldsSet.size == 1)
                finalErrorMsg = 'This required field must be completed: ' + errorFieldsStr.substring(0,errorFieldsStr.length - 2);            
            else
                finalErrorMsg = 'These required fields must be completed: ' + errorFieldsStr.substring(0,errorFieldsStr.length - 2);            
            
            if(duplicateError!='')
            {
                finalErrorMsg = finalErrorMsg + '\n '+duplicateError;
            }
            
            helper.LightningToastmessage(component, event, helper,finalErrorMsg,'Error') 
            return false;
        }
        else
        {
            //console.log('In save')
            return true;
        }
    },
    
    saveMappingRulesList : function(component,event,helper){
        component.set("v.showfooter", false);
        //console.log('In saveMappingRulesList')
        var mappingRulesList = component.get("v.mappingRulesList");
        var finalMappingRuleList = [];
        for( var i = 0 ; i < mappingRulesList.length ; i++ )
        {
            var mappingRule ; 
            var index = i;
            var transformationType = mappingRulesList[i].Name;
            //console.log('transformationType ::: ' , transformationType)
            var sourceFieldsList = new Set();            
            switch (transformationType)
            {                
                case 'Direct':
                    //console.log('In direct')                                    
                    //console.log('direct ::: ' , mappingRulesList[index].Transformation_Value__c)
                    sourceFieldsList.add(mappingRulesList[index].Transformation_Value__c);
                    //console.log('direct ::: ' , mappingRulesList[index].Transformation_Value__c)
                    break;
                case 'If-Else':
                    //console.log('In If-Else')                       
                    var ifElseDevValue = JSON.parse(mappingRulesList[index].Dev_value__c);
                    //console.log('ifElseDevValue ::: ' , ifElseDevValue)
                    var filterConditions = ifElseDevValue.FilterConditions;            
                    //console.log('filterConditions ::: ' , filterConditions)
                    var mappingObjectField = ifElseDevValue.MappingObjectField;
                    //console.log('mappingObjectField ::: ' , mappingObjectField)
                    sourceFieldsList.add(mappingObjectField);                    
                    
                    for(var j = 0 ; j < filterConditions.length ; j++)
                    {
                        for(var k = 0 ; k < filterConditions[j].length ; k++)
                        {
                            //console.log(filterConditions[j][k])
                            //console.log('field ::: ',filterConditions[j][k].field)
                            sourceFieldsList.add(filterConditions[j][k].field);
                            //console.log('isReference ::: ',filterConditions[j][k].isReference)
                            if(filterConditions[j][k].isReference){
                                //console.log('value ::: ',filterConditions[j][k].value)
                                sourceFieldsList.add(filterConditions[j][k].value);                        
                            }
                            //console.log('thenReferece ::: ',filterConditions[j][k].thenReferece)
                            if(filterConditions[j][k].thenReferece){
                                //console.log('thenvalue ::: ',filterConditions[j][k].thenvalue)
                                sourceFieldsList.add(filterConditions[j][k].thenvalue);                                                    
                            }
                        }
                    }
                    //console.log('ifElseDevValue.ElseValue ::: ',ifElseDevValue.ElseValue)
                    var elseValueList = (ifElseDevValue.ElseValue).split('#');
                    //console.log('elseValueList[1] ::: ' , elseValueList[1])
                    if(elseValueList[1] == 'Field Reference'){
                        sourceFieldsList.add(elseValueList[0]);}
                    //console.log('sourceFieldsList ::: ' , sourceFieldsList);
                    
                    break;
                case 'Object Reference':
                    //console.log('In Object Reference')                                    
                    var objectReferenceDevValue = JSON.parse(mappingRulesList[index].Dev_value__c);
                    if(objectReferenceDevValue.MappingObjectField!=null && objectReferenceDevValue.MappingObjectField)
                        sourceFieldsList.add(objectReferenceDevValue.MappingObjectField);
                    
                    var selectedFieldList = (objectReferenceDevValue.LookupField).split('.');
                    var sourceField = '';
                    
                    if(selectedFieldList[1].includes('__r')){
                        //console.log('selectedFieldList[1] ::: ' , selectedFieldList[1])
                        sourceField = (selectedFieldList[1]).replace("__r", "__c");                
                    }
                    else
                        sourceField = selectedFieldList[1];
                    
                    sourceFieldsList.add(sourceField);                        
                    break;
                case 'Text Split':
                    //console.log('In Text Split')                                    
                    var textSplitDevValue = JSON.parse(mappingRulesList[index].Dev_value__c);
                    sourceFieldsList.add(textSplitDevValue.FieldName);
                    break;
                case 'Text Area Split':
                    //console.log('In Text Area Split 1')                                    
                    var textAreaSplitDevValue = JSON.parse(mappingRulesList[index].Dev_value__c);                    
                    //console.log('textAreaSplitDevValue ::: ' , textAreaSplitDevValue);
                    sourceFieldsList.add(textAreaSplitDevValue.FieldName);                    
                    break;
                default :
                    break;
            }            
            //console.log('After switch')
            //console.log('sourceFieldsList ::: ' , sourceFieldsList)
            //console.log('sourceFieldsList 1::: ' , JSON.stringify( Array.from(sourceFieldsList)));
            mappingRulesList[i].Source_Object_Fields__c = JSON.stringify(Array.from(sourceFieldsList));
            
            //console.log('Source fields ::: ' , mappingRulesList[index].Source_Object_Fields__c);
            
            if(mappingRulesList[i].Id!='')
            {
                mappingRule = {
                    Id : mappingRulesList[i].Id, 
                    Name : mappingRulesList[i].Name, 
                    Transformation_Value__c : mappingRulesList[i].Transformation_Value__c, 
                    Source_Field__c : mappingRulesList[i].Source_Field__c, 
                    Target_Field__c : mappingRulesList[i].Target_Field__c, 
                    Dev_value__c : mappingRulesList[i].Dev_value__c, 
                    Mandatory__c : mappingRulesList[i].Mandatory__c,                 
                    Allowed_for_update__c : mappingRulesList[i].Allowed_for_update__c, 
                    Contract_Rule__c:component.get("v.contractRuleDetail.Id"),
                    Source_Object_Fields__c : mappingRulesList[index].Source_Object_Fields__c,
                    Rule_Order__c:index
                };
            }
            else
            {
                mappingRule = {                
                    Name : mappingRulesList[i].Name, 
                    Transformation_Value__c : mappingRulesList[i].Transformation_Value__c, 
                    Source_Field__c : mappingRulesList[i].Source_Field__c, 
                    Target_Field__c : mappingRulesList[i].Target_Field__c, 
                    Dev_value__c : mappingRulesList[i].Dev_value__c, 
                    Mandatory__c : mappingRulesList[i].Mandatory__c,                 
                    Allowed_for_update__c : mappingRulesList[i].Allowed_for_update__c, 
                    Contract_Rule__c:component.get("v.contractRuleDetail.Id"),
                    Source_Object_Fields__c : mappingRulesList[index].Source_Object_Fields__c,
                    Rule_Order__c:index
                };
            }
            finalMappingRuleList.push(mappingRule);
            console.log('In mappingRule ::: ' , finalMappingRuleList)
        }
        var checks = component.get("c.saveMappingRules");
        checks.setParams({ 
            "mappingRulesList": finalMappingRuleList
        });
        checks.setCallback(this, function(a1) {
            var status = a1.getState();
            //console.log('status ::: ' , status)
            if (status === "SUCCESS"){                    
                helper.LightningToastmessage(component, event, helper,'Mapping Rules created successfully.','Success') 
                
                //$A.get('e.force:refreshView').fire();
                component.set("v.showfooter", false);  
                component.set("v.loadingSpinner",true);
                helper.initContractRule(component, event, helper);                                
                var appEvent = $A.get("e.c:triggerInitTabsEvent");
                appEvent.setParams({
                    "recId" : component.get("v.contractRuleDetail.Id"),
                    "ObjectName" : "Contract_Rule__c"
                    });
                appEvent.fire();
            } 
        });
        $A.enqueueAction(checks);          
    },
    
    
    handleDeleteMappingRuleHelper : function(component,event,helper){        
        //console.log('In handleDeleteMappingRuleHelper')
                
        var index = component.get("v.mappingRuleIndex");
        var mappingRulesList = component.get("v.mappingRulesList");
        var mappingRuleDetail = component.get("v.mappingRuleDetail");
        //console.log('mappingRuleDetail ::: ' , mappingRuleDetail)
        if(mappingRuleDetail.Id == '' )
        {
            mappingRulesList.splice(index, 1);
            component.set("v.mappingRulesList" , mappingRulesList);
        }
        else{
            //console.log('mappingRuleDetail ::: ' , mappingRuleDetail)
            var checks = component.get("c.deleteMappingRules");
            checks.setParams({ 
                "mappingRule": mappingRuleDetail
            });
            checks.setCallback(this, function(a1) {
                var status = a1.getState();
                //console.log('status ::: ' , status)
                if (status === "SUCCESS"){                                                            
                    helper.LightningToastmessage(component, event, helper,'Mapping Rule deleted successfully.','Success');
                    component.set("v.loadingSpinner",true);
                    helper.initContractRule(component, event, helper);                    
                    var appEvent = $A.get("e.c:triggerInitTabsEvent");
                    appEvent.setParams({
                        "recId" : component.get("v.contractRuleDetail.Id"),
                        "ObjectName" : "Contract_Rule__c"
                    });
                    appEvent.fire();
                    
                } 
            });
            $A.enqueueAction(checks);     
        }
    },
    
    LightningToastmessage : function(component, event, helper,message,toasttype) 
    {  
        var errorTitle = '';
        if(toasttype == 'Error')
        {
            errorTitle ='Error!';
        }
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({            
            "type":toasttype,            
            "message": message
        });
        toastEvent.fire();
    },
    onPressKeyboardKey: function (component, event, helper) {
        var keyValue = event.which;          
        if (keyValue == 27) {
            if(component.get("v.transformationType") == 'Object Reference')
            {
                //component.find('objectreference').handleEscapeEvent();
                component.set("v.isOpenTransformationValueModal", false);
                component.set("v.isErrorFound", false);
                component.set("v.errorText", ''); 
                component.set('v.onDeleteClick',false);
            }
            else{
                component.set("v.isOpenTransformationValueModal", false);
                component.set("v.isErrorFound", false);
                component.set("v.errorText", ''); 
                component.set('v.onDeleteClick',false);
            }            
        }
    },
})