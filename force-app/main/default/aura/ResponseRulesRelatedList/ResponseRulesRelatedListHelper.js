({  
    initContractRule : function(component, event, helper) 
    {     
        //console.log('In initfunc')
        
        helper.escapeEventHelper(component,event,helper);
        helper.getContractRuleDetailsHelper(component,event,helper);
        helper.getMappingRulesDetailsHelper(component,event,helper);
        
        //helper.getDefaultMappingRuleValue(component,event,helper);          
    },
    handleGetMappingFieldsDetails: function(component,event,helper) 
    {        
        //console.log('In handleGetMappingFieldsDetails')
        var action = component.get("c.getMappingObjectAndFieldsDetails");
        action.setParams({
            "objectName": component.get("v.contractRuleDetail.Source_Object__c"),
            "dataStore": component.get("v.mappingContractDetail.Source_Datastore__c"),
            "type":'All'
            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();            
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                //console.log('storeResponse targetfield::: '+ JSON.stringify(storeResponse))                    
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
            "childObjectName" : "Response_Rule__c",
            "parentObjectName": 'Contract_Rule__c',
            "recId": component.get("v.recordId")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var responseRulesList = response.getReturnValue();                      
                //if(storeResponse.length>0)
                //{                                        
                //console.log('responseRulesList ::: ' ,JSON.stringify(responseRulesList)); 
                
                if(responseRulesList.length > 0){
                    responseRulesList.sort(function(a,b) {
                        var t1 = a.Rule_Order__c == b.Rule_Order__c, t2 = a.Rule_Order__c < b.Rule_Order__c;
                        return t1? 0: (responseRulesList?-1:1)*(t2?1:-1);
                    });
                }
                
                
                component.set("v.responseRulesList",responseRulesList);                                         
                
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
            'Name': 'Direct',
            'NameError': '',            
            'Source_Field__c': '',
            'SourceFieldError': '',
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
        //console.log(JSON.stringify(defaultTableDataTemp))
        component.set("v.responseRulesList",defaultTableDataTemp);
    },
    handleAddRowHelper : function(component, event, helper) 
    {
        var defaultTableDataTemp = component.get("v.responseRulesList");
        defaultTableDataTemp.push({      
            'Id' : '',
            'Name': 'Direct',
            'NameError': '',            
            'Source_Field__c': '',
            'SourceFieldError': '',
            'Target_Field__c': '',   
            'TargetFieldError': '', 
            'Dev_value__c': '',
            'Contract_Rule__c':'',
            'transformationTypeError': ' label-hidden',
            'transformationValueError': 'slds-align_absolute-center label-hidden',
            'targetFieldError': 'slds-align_absolute-center label-hidden',                     
            'Mandatory__c': false,    
            'Allowed_for_update__c': false,    
        });
        //console.log(JSON.stringify(defaultTableDataTemp))
        component.set("v.responseRulesList",defaultTableDataTemp);
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
                helper.handleGetMappingFieldsDetails(component, event, helper);
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
                    
                    component.set("v.sourceFieldOptions",mappingObjectFieldsList);                                        
                    component.set("v.loadingSpinner",false);
                }                                                   
            }
        });
        $A.enqueueAction(action);                
    },
    handleTransformationTypeChangeHelper: function(component,event,helper) 
    {
        var responseRulesList = component.get("v.responseRulesList");
        var selectedItem = event.currentTarget;
        var index = selectedItem.dataset.value;
        //console.log('index ::: ' , index)
        component.set("v.transformationType",responseRulesList[index].Name);        
                
        responseRulesList[index].NameError = '';
        responseRulesList[index].Source_Field__c = '';
        responseRulesList[index].Target_Field__c = '';
        responseRulesList[index].Dev_value__c = '';
        /*responseRulesList[index].transformationTypeError = ' label-hidden';
        responseRulesList[index].transformationValueError = 'slds-align_absolute-center label-hidden';
        responseRulesList[index].targetFieldError = 'slds-align_absolute-center label-hidden';*/
        responseRulesList[index].Mandatory__c = false;
        responseRulesList[index].Allowed_for_update__c = false;
        component.set("v.responseRulesList", responseRulesList);
    },        
    closeDeleteModalHelper: function (component, event, helper) 
    {                
        component.set('v.onDeleteClick',false);
    },    
    
    onclickSaveTransformationValueHelper: function(component, event, helper,message,toasttype) 
    {
        //console.log('In onclickSaveTransformationValueHelper')  
        var transformationType = component.get("v.transformationType");
        var responseRulesList = component.get("v.responseRulesList");        
        //console.log('mappingRuleIndex ::: ' , component.get("v.mappingRuleIndex"))
        switch (transformationType)
        {            
            case 'Direct':
                //console.log('In Direct')                
                component.find("direct").validateTransformationValue();                
                break;            
                
        }
        
    },
        
    
    handleTargetFieldChangeHelper : function(component, event, helper,type){
        //console.log('In handleTargetFieldChangeHelper')
        var responseRulesList = component.get("v.responseRulesList");
        //console.log("responseRulesList ::: " + responseRulesList)
        var errorFound = true;
        for(var i = 0 ; i< responseRulesList.length ; i++)
        {
            //console.log("responseRulesList i ::: " + responseRulesList[i])
            for(var j = i+1 ; j< responseRulesList.length ; j++)
            {
                //console.log('123 ::: '+responseRulesList[i].Target_Field__c +' : '+responseRulesList[j].Target_Field__c)
                if(((responseRulesList[i].Target_Field__c == responseRulesList[j].Target_Field__c) 
                   &&(responseRulesList[i].Target_Field__c !='' && responseRulesList[j].Target_Field__c !=''))
                    && (responseRulesList[i].Source_Field__c == responseRulesList[j].Source_Field__c) 
                   &&(responseRulesList[i].Source_Field__c !='' && responseRulesList[j].Source_Field__c !=''))
                {
                    errorFound = false;
                    responseRulesList[j].TargetFieldError = 'slds-has-error';   
                    responseRulesList[i].TargetFieldError = 'slds-has-error';   
                    responseRulesList[j].SourceFieldError = 'slds-has-error';   
                    responseRulesList[i].SourceFieldError = 'slds-has-error';   
                }  
                
                if(((responseRulesList[i].Target_Field__c == responseRulesList[j].Target_Field__c) 
                   &&(responseRulesList[i].Target_Field__c !='' && responseRulesList[j].Target_Field__c !='')))
                {
                    errorFound = false;
                    responseRulesList[j].TargetFieldError = 'slds-has-error';   
                    responseRulesList[i].TargetFieldError = 'slds-has-error';                         
                }  
            }            
        }
        component.set("v.responseRulesList" , responseRulesList);
        //console.log('errorFound ::: ' , errorFound)
        return errorFound;
    },
    
    validateMappingRuleListHelper : function(component, event, helper){
        //console.log('In validateMappingRuleListHelper')
        var responseRulesList = component.get("v.responseRulesList");
        var errorFieldsSet = new Set();         
        for(var i = 0 ; i< responseRulesList.length ; i++)
        {
            //console.log('map rule ::: ' , responseRulesList[i])
            //console.log('map rule .Name ::: ' , responseRulesList[i].Name)
              
            if(responseRulesList[i].Source_Field__c == '')
            {                                                       
                responseRulesList[i].SourceFieldError = 'slds-has-error';                
                errorFieldsSet.add('Source field');
            }
            else{            
                responseRulesList[i].SourceFieldError = '';
            }
            
            if(responseRulesList[i].Target_Field__c == '')
            {                                                       
                responseRulesList[i].TargetFieldError = 'slds-has-error';                
                errorFieldsSet.add('Target field');
            }
            else{            
                responseRulesList[i].TargetFieldError = '';
            }
        }
        component.set("v.showfooter", true);   
        //console.log(JSON.stringify(responseRulesList))
        component.set("v.loadingSpinner",false);
        component.set("v.responseRulesList" , responseRulesList);
        
        var duplicateError = '';
        if(!helper.handleTargetFieldChangeHelper(component, event, helper))
        {
            errorFieldsSet.add('Target field');
            duplicateError = 'Duplicate target field found.';
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
        var responseRulesList = component.get("v.responseRulesList");
        var finalMappingRuleList = [];
        for( var i = 0 ; i < responseRulesList.length ; i++ )
        {
            var mappingRule ; 
            var index = i;
            var transformationType = responseRulesList[i].Name;
            //console.log('transformationType ::: ' , transformationType)
            var sourceFieldsList = new Set();            
            switch (transformationType)
            {                
                case 'Direct':
                    //console.log('In direct')
                    //console.log('direct ::: ' , responseRulesList[index].Source_Field__c)
                    sourceFieldsList.add(responseRulesList[index].Source_Field__c);
                    //console.log('direct ::: ' , responseRulesList[index].Source_Field__c)
                    break;                
                default :
                    break;
            }            
            //console.log('After switch')
            //console.log('sourceFieldsList ::: ' , sourceFieldsList)
            //console.log('sourceFieldsList 1::: ' , JSON.stringify( Array.from(sourceFieldsList)));
            responseRulesList[i].Source_Object_Fields__c = JSON.stringify(Array.from(sourceFieldsList));
            
            //console.log('Source fields ::: ' , responseRulesList[index].Source_Object_Fields__c);
            
            if(responseRulesList[i].Id!='')
            {
                mappingRule = {
                    Id : responseRulesList[i].Id, 
                    Name : responseRulesList[i].Name, 
                    Source_Field__c : responseRulesList[i].Source_Field__c, 
                    Target_Field__c : responseRulesList[i].Target_Field__c, 
                    Dev_value__c : responseRulesList[i].Dev_value__c, 
                    Mandatory__c : responseRulesList[i].Mandatory__c,                                    
                    Contract_Rule__c:component.get("v.contractRuleDetail.Id"),
                    Source_Object_Fields__c : responseRulesList[index].Source_Object_Fields__c,
                    Rule_Order__c:index
                };
            }
            else
            {
                mappingRule = {                
                    Name : responseRulesList[i].Name, 
                    Source_Field__c : responseRulesList[i].Source_Field__c, 
                    Target_Field__c : responseRulesList[i].Target_Field__c, 
                    Dev_value__c : responseRulesList[i].Dev_value__c, 
                    Mandatory__c : responseRulesList[i].Mandatory__c,                 
                    Allowed_for_update__c : responseRulesList[i].Allowed_for_update__c, 
                    Contract_Rule__c:component.get("v.contractRuleDetail.Id"),
                    Source_Object_Fields__c : responseRulesList[index].Source_Object_Fields__c,
                    Rule_Order__c:index
                };
            }
            finalMappingRuleList.push(mappingRule);
            //console.log('In mappingRule ::: ' , mappingRule)
        }
        var checks = component.get("c.saveResponseRules");
        checks.setParams({ 
            "responseRulesList": finalMappingRuleList
        });
        checks.setCallback(this, function(a1) {
            var status = a1.getState();
            //console.log('status ::: ' , status)
            if (status === "SUCCESS"){                    
                helper.LightningToastmessage(component, event, helper,'Response Rules created successfully.','Success') 
                
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
        var responseRulesList = component.get("v.responseRulesList");
        var responseRuleDetail = component.get("v.responseRuleDetail");
        //console.log('responseRuleDetail ::: ' , responseRuleDetail)
        if(responseRuleDetail.Id == '' )
        {
            responseRulesList.splice(index, 1);
            component.set("v.responseRulesList" , responseRulesList);
        }
        else{
            //console.log('responseRuleDetail123 ::: ' , responseRuleDetail)
            var checks = component.get("c.deleteResponseRules");
            checks.setParams({ 
                "responseRule": responseRuleDetail
            });
            checks.setCallback(this, function(a1) {
                var status = a1.getState();
                //console.log('status ::: ' , status)
                if (status === "SUCCESS"){                                                            
                    helper.LightningToastmessage(component, event, helper,'Response Rule deleted successfully.','Success');
                    component.set("v.loadingSpinner",true);
                    helper.initContractRule(component, event, helper);                    
                    var appEvent = $A.get("e.c:triggerInitTabsEvent");
                    appEvent.setParams({
                        "recId" : component.get("v.contractRuleDetail.Id"),
                        "ObjectName" : "Response_Rule__c"
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