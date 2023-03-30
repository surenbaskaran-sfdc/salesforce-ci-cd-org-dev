({
    
    initContractRule : function(component, event, helper) 
    {     
        helper.getContractRuleHelper(component,event,helper);        
        helper.getIntegrationMappingDetailsHelper(component, event, helper);
    },
    getContractRulesList: function(component,event,helper) 
    {
        var action = component.get("c.getChildDataList");
        action.setParams({
            "childObjectName" : 'Contract_Rule__c',
            "parentObjectName" : 'Mapping_Contract__c',
            "recId" : component.get("v.mappingContractDetail.Id")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                for(var i = 0 ; i < storeResponse.length ; i++)
                {
                    if(component.get("v.contractRuleDetail.Id") == storeResponse[i].Id)
                    {
                        storeResponse.splice(i,1);
                        break;
                    }
                }
                component.set("v.allContractRulesList",storeResponse);                 
            }
        });
        $A.enqueueAction(action);
    },
    
    getMappingRulesList: function(component,event,helper) 
    {
        var action = component.get("c.getChildDataList");
        action.setParams({
            "childObjectName" : 'Mapping_Rule__c',
            "parentObjectName" : 'Contract_Rule__c',
            "recId" : component.get("v.recordId")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var mappingRulesList = response.getReturnValue();                
                if(mappingRulesList.length > 0)                
                {
                    component.set("v.isAvailableMappingRules" , true);
                }
                else
                {
                    component.set("v.isAvailableMappingRules" , false);
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    getContractRuleHelper : function(component, event, helper) {
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
                    component.set("v.contractRuleDetail", storeResponse[0]);
                    
                    
                    component.set("v.ownerDetails", storeResponse[0][0]);
                    component.set("v.contractRuleDetail",storeResponse[1][0]); 
                    component.set("v.mappingContractDetail",storeResponse[2][0]);
                    
                    component.set("v.timeZone",storeResponse[4][0].TimeZoneSidKey);
                    
                    helper.getAllObjectsList(component,event,helper);
                    helper.getContractRulesList(component,event,helper);     
                    helper.getMappingRulesList(component,event,helper);     
                    
                }                
            }
        });
        $A.enqueueAction(action);
    },
    getAllObjectsList: function(component, event, helper) 
    {
        var action = component.get("c.getDataList");
        action.setParams({            
            "objectName" : 'Mapping_Object__c',            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                
                if(component.get("v.mappingContractDetail.Source_Datastore__c") == "Salesforce"){
                    var action1 = component.get("c.getChildObjectNames");
                    action1.setParams({            
                        "recId" : component.get("v.mappingContractDetail.Id")           
                    });  
                    action1.setCallback(this, function(response1) {
                        var state1 = response1.getState();
                        if (state1 === "SUCCESS") 
                        {
                            var childMap = response1.getReturnValue();
                            var childNames  = Object.getOwnPropertyNames(childMap);
                            component.set("v.childNamesMap",childMap);
                            var storeResponse = response.getReturnValue();
                            var sapObjects = [], salesforceObjects = [];
                            for(var i = 0 ; i < storeResponse.length ; i++ )
                            {
                                if(storeResponse[i].Active__c){
                                    if(storeResponse[i].Datastore__c != 'Salesforce')
                                    {
                                        sapObjects.push({
                                            'label':storeResponse[i].Name,
                                            'value':storeResponse[i].Name
                                        });
                                        
                                    }
                                    else
                                    {    
                                        if(component.get("v.mappingContractDetail.Job_Type__c") == 'Jobs'){
                                            salesforceObjects.push({
                                                'label':storeResponse[i].Name,
                                                'value':storeResponse[i].Name
                                            });
                                        }
                                        else{
                                            if(childNames.includes(storeResponse[i].Name) || storeResponse[i].Name == component.get("v.mappingContractDetail.Source_Object__c")){
                                                salesforceObjects.push({
                                                    'label':storeResponse[i].Name,
                                                    'value':storeResponse[i].Name
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                            if(sapObjects.length > 0){
                                sapObjects.sort(function(a,b) {
                                    var t1 = a.label == b.label, t2 = a.label < b.label;
                                    return t1? 0: (sapObjects?-1:1)*(t2?1:-1);
                                });
                            }
                            if(salesforceObjects.length > 0){
                                salesforceObjects.sort(function(a,b) {
                                    var t1 = a.label == b.label, t2 = a.label < b.label;
                                    return t1? 0: (salesforceObjects?-1:1)*(t2?1:-1);
                                });
                            }
                            
                            if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce'){
                                component.set("v.sourceObjectsList",sapObjects);
                                component.set("v.targetObjectsList",salesforceObjects);
                            }
                            else
                            {
                                component.set("v.sourceObjectsList",salesforceObjects);
                                component.set("v.targetObjectsList",sapObjects);   
                            }
                            helper.getSourceRecordTypesList(component, event, helper);  
                            if(component.get("v.mappingContractDetail.Source_Datastore__c") == 'Salesforce'){
                                helper.getSourceRecordTypesList(component, event, helper);        
                                
                                if(component.get("v.contractRuleDetail.Source_Object__c")!='')
                                    helper.getExternalIdList(component, event, helper,component.get("v.contractRuleDetail.Source_Object__c"));
                            }
                            if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce'){
                                helper.getSourceRecordTypesList(component, event, helper);        
                                
                                if(component.get("v.contractRuleDetail.Source_Object__c")!='')
                                    helper.getExternalIdList(component, event, helper,component.get("v.contractRuleDetail.Target_Object__c"));
                            }
                        }
                    });
                    $A.enqueueAction(action1); 
                }
                else{
                    
                    var storeResponse = response.getReturnValue();
                    var sapObjects = [], salesforceObjects = [];
                    for(var i = 0 ; i < storeResponse.length ; i++ )
                    {
                        if(storeResponse[i].Active__c){
                            if(storeResponse[i].Datastore__c != 'Salesforce')
                            {
                                sapObjects.push({
                                    'label':storeResponse[i].Name,
                                    'value':storeResponse[i].Name
                                });
                                
                            }
                            else
                            {                        
                                salesforceObjects.push({
                                    'label':storeResponse[i].Name,
                                    'value':storeResponse[i].Name
                                });
                            }
                        }
                    }
                    if(sapObjects.length > 0){
                        sapObjects.sort(function(a,b) {
                            var t1 = a.label == b.label, t2 = a.label < b.label;
                            return t1? 0: (sapObjects?-1:1)*(t2?1:-1);
                        });
                    }
                    if(salesforceObjects.length > 0){
                        salesforceObjects.sort(function(a,b) {
                            var t1 = a.label == b.label, t2 = a.label < b.label;
                            return t1? 0: (salesforceObjects?-1:1)*(t2?1:-1);
                        });
                    }
                    
                    if(component.get("v.mappingContractDetail.Source_Datastore__c") == 'Salesforce'){
                        component.set("v.sourceObjectsList",sapObjects);
                        component.set("v.targetObjectsList",salesforceObjects);
                    }
                    else
                    {
                        component.set("v.sourceObjectsList",salesforceObjects);
                        component.set("v.targetObjectsList",sapObjects);   
                    }
                    helper.getSourceRecordTypesList(component, event, helper);  
                    if(component.get("v.mappingContractDetail.Source_Datastore__c") == 'Salesforce'){
                        helper.getSourceRecordTypesList(component, event, helper);        
                        
                        if(component.get("v.contractRuleDetail.Source_Object__c")!='')
                            helper.getExternalIdList(component, event, helper,component.get("v.contractRuleDetail.Source_Object__c"));
                    }
                    if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce'){
                        helper.getSourceRecordTypesList(component, event, helper);        
                        
                        if(component.get("v.contractRuleDetail.Source_Object__c")!='')
                            helper.getExternalIdList(component, event, helper,component.get("v.contractRuleDetail.Target_Object__c"));
                    }
                    
                }
            }
        });
        $A.enqueueAction(action);    
    },        
    
    onAccordianClickHelper:function (component, event,helper) 
    {        
        if(component.get("v.openSystemInformation"))
        {         
            component.set("v.Systemicon","utility:chevronright");
            component.set("v.openSystemInformation",false);
        }            
        else
        {            
            component.set("v.Systemicon","utility:chevrondown");
            component.set("v.openSystemInformation",true);
        }                 
    },
    getSourceRecordTypesList: function(component, event, helper) 
    {
        
        var objectName = '';
        
        if(component.get("v.mappingContractDetail.Source_Datastore__c") == 'Salesforce'){
            objectName = component.get("v.contractRuleDetail.Source_Object__c");
        }
        else{
            objectName = component.get("v.contractRuleDetail.Target_Object__c");        
        }
        
        if(objectName!='')
        {
            
            var action = component.get("c.getRecordTypeList");
            action.setParams({            
                "objectName" : objectName
            });  
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") 
                {
                    var storeResponse = response.getReturnValue();
                    var recordTypeList = [];
                    for(var i = 0 ; i < storeResponse.length ; i++ )
                    {
                        recordTypeList.push({
                            'label':storeResponse[i],
                            'value':storeResponse[i]
                        });
                    }
                    if(recordTypeList.length > 0){
                        recordTypeList.sort(function(a,b) {
                            var t1 = a.label == b.label, t2 = a.label < b.label;
                            return t1? 0: (recordTypeList?-1:1)*(t2?1:-1);
                        });
                    }
                    component.set("v.sourceObjectRecordTypeList",recordTypeList);
                    component.set("v.loadingSpinner",false);
                }
            });
            $A.enqueueAction(action);  
            
        }
    },
    
    getExternalIdList: function(component, event, helper,objectName) 
    {
        var objectName = '';
        
        objectName = component.get("v.contractRuleDetail.Source_Object__c");
        
        if(objectName!='')
        {
            
            var action = component.get("c.getDataListWithConditions");
            action.setParams({            
                "objectName" : 'Mapping_Object_Field__c',
                "dataStoreValue": component.get("v.mappingContractDetail.Source_Datastore__c"),
                "sourceObjectName" : objectName
            });  
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") 
                {
                    var storeResponse = response.getReturnValue();
                    var recordTypeList = [];
                    for(var i = 0 ; i < storeResponse.length ; i++ )
                    {
                        recordTypeList.push({
                            'label':storeResponse[i].Name,
                            'value':storeResponse[i].Name
                        });
                    }
                    if(recordTypeList.length > 0){
                        recordTypeList.sort(function(a,b) {
                            var t1 = a.label == b.label, t2 = a.label < b.label;
                            return t1? 0: (recordTypeList?-1:1)*(t2?1:-1);
                        });
                    }
                    component.set("v.externalIdList",recordTypeList);
                    if(component.get("v.isEditPage") != false){
                        component.set("v.contractRuleDetail.External_Id__c","");
                        component.set("v.contractRuleDetail.Source_Record_Type__c","");
                    }
                    
                    component.set("v.loadingSpinner",false);
                }
            });
            $A.enqueueAction(action);  
            
        }
    },
    
    validateContractRuleData: function(component, event, helper) 
    {
        //var emptyFieldsStr = '';
        var contractRuleDetail = component.get("v.contractRuleDetail");
        var emptyFieldsSet = new Set();
        component.set("v.objectNameError" , "");
        component.set("v.sourceObjectError" , "");
        component.set("v.targetObjectError" , "");
        component.set("v.externalIdError" , "");
        component.set("v.isErrorFound", false);
        if(contractRuleDetail.Name == undefined ||contractRuleDetail.Name == null || contractRuleDetail.Name.trim() == ''){            
            component.set("v.objectNameError" , " slds-has-error ");
            emptyFieldsSet.add('Contract Rule Name');
        }
        if(contractRuleDetail.Source_Object__c == null || contractRuleDetail.Source_Object__c == ''){            
            emptyFieldsSet.add('Source object');
            component.set("v.sourceObjectError" , " slds-has-error ");
        }
        if(contractRuleDetail.Target_Object__c == null || contractRuleDetail.Target_Object__c == ''){            
            emptyFieldsSet.add('Target object');
            component.set("v.targetObjectError" , " slds-has-error ");
        }
        if(contractRuleDetail.External_Id__c == null || contractRuleDetail.External_Id__c == ''){            
            emptyFieldsSet.add('External Id');
            component.set("v.externalIdError" , " slds-has-error ");
        }
        
        var errorArr = Array.from(emptyFieldsSet);
        if(emptyFieldsSet.size>0){
            var errorFieldsStr = '';
            for (let item of errorArr) {
                errorFieldsStr = errorFieldsStr + item;
                errorFieldsStr = errorFieldsStr + ', ';
            }
            
            component.set("v.isErrorFound","true");
            helper.LightningToastmessage(component, event, helper,'These required fields must be completed: ' + errorFieldsStr.substring(0,errorFieldsStr.length - 2),"Error");            
            return true;
        }
        
        if(emptyFieldsSet.size == 0){            
            var allContractRulesList = component.get("v.allContractRulesList");
            for(var i = 0 ; i < allContractRulesList.length ; i++)
            {
                if((allContractRulesList[i].Source_Object__c == contractRuleDetail.Source_Object__c )
                   && (allContractRulesList[i].Target_Object__c == contractRuleDetail.Target_Object__c )
                   && (allContractRulesList[i].Source_Record_Type__c == contractRuleDetail.Source_Record_Type__c ))
                {                    
                    component.set("v.isErrorFound", true);
                    
                    if(contractRuleDetail.Source_Record_Type__c == '' || contractRuleDetail.Source_Record_Type__c == null)                    
                        helper.LightningToastmessage(component, event, helper,"Contract Rule with same Source Object, Target Object is already present. Try again with different values!","Error");
                    else{
                        helper.LightningToastmessage(component, event, helper,"Contract Rule with same Source Object, Target Object and Record Type is already present. Try again with different values!","Error");                        
                        component.set("v.recordTypeError" , " slds-has-error ");
                    }
                    component.set("v.sourceObjectError" , " slds-has-error ");
                    component.set("v.targetObjectError" , " slds-has-error ");  
                    return true;
                }
            }                
        }
        if(!component.get("v.isErrorFound"))
        {            
            if( parseInt((contractRuleDetail.Name.trim()).length) > 80){
                component.set("v.isErrorFound", true);
                component.set("v.objectNameError" , " slds-has-error ");                
                helper.LightningToastmessage(component, event, helper,"Contract Rule name must not exceed 80 characters","Error");                               
                return true;
            }
        }
        
        return false;
    },
    
    saveContractRuleHelper: function(component, event, helper) 
    {
        var contractRuleDetail = component.get("v.contractRuleDetail");
        contractRuleDetail.Name = contractRuleDetail.Name.trim();
        contractRuleDetail.Mapping_Contract__c = component.get("v.mappingContractDetail.Id");
        
        if(component.get("v.mappingContractDetail.Source_Datastore__c") == "Salesforce"){
            contractRuleDetail.Child_Field_Token__c = component.get("v.childNamesMap")[contractRuleDetail.Source_Object__c];
        }
        else{
            contractRuleDetail.Child_Field_Token__c = "";
        }
        
        var action = component.get("c.saveContractRuleData");
        action.setParams({ 
            "ruleDetail": contractRuleDetail
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS") {
                if(a.getReturnValue()!=null)
                {
                    
                    //$A.get('e.force:refreshView').fire();                    
                    helper.LightningToastmessage(component, event, helper,"Contract Rule updated successfully.","Success");
                    component.set("v.isEditPage",false);
                    
                    
                    component.set("v.objectNameError" , "");
                    component.set("v.sourceObjectError" , "");
                    component.set("v.targetObjectError" , "");
                    component.set("v.externalIdError" , "");     
                    
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": component.get("v.recordId"),
                        "slideDevName": "related"
                    });
                    navEvt.fire();
                    //helper.initContractRule(component, event, helper);
                }
                else
                {
                    component.set('v.isErrorFound',true);
                    component.set("v.objectNameError","slds-has-error");
                    helper.LightningToastmessage(component, event, helper,"Contract Rule with same name is already present. Try again with different name!","Error");                    
                }
            }
        });
        $A.enqueueAction(action)
    },
    
    getIntegrationMappingDetailsHelper : function(component, event, helper) {
        
        var action = component.get("c.getIntegrationMappingDetails");
        action.setParams({
            "objectName": 'Mapping_Contract__c',            
            "recId": component.get("v.contractRuleDetail.Mapping_Contract__c")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                if(storeResponse.length>0)
                {                    
                    component.set("v.mappingContractDetails",storeResponse[0][0]);
                    component.set("v.integrationMappingList",storeResponse[1]);
                    var integrationMappingList = component.get("v.integrationMappingList");
                    for(var i = 0 ; i < integrationMappingList.length ; i++)
                    {
                        if(integrationMappingList[i].Contract_Rule__c == component.get("v.contractRuleDetail.Name")
                           && integrationMappingList[i].Mapping_Contract__c == component.get("v.mappingContractDetails.Name"))
                        {                            
                            component.set("v.isNameDisabled",true);
                            break;
                        }
                    }
                    
                }      
                //component.set("v.loadingSpinner",false);
                
            }
        });
        $A.enqueueAction(action);
    },  
    
    LightningToastmessage : function(component, event, helper,message,toasttype) 
    {  
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({            
            "type":toasttype,            
            "message": message
        });
        toastEvent.fire();
    },
})