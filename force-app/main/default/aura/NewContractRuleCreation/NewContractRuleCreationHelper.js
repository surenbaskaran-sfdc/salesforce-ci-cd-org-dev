({
    initCreateMappingObject : function(component, event, helper) 
    {     
        //console.log('In initfunc')
        //console.log('mappingContractDetail ::: ' , JSON.stringify(component.get("v.mappingContractDetail")))
        var allContractRulesList = component.get("v.allContractRulesList");
        var contractRuleDetail = component.get("v.contractRuleDetail") ;
        contractRuleDetail.Rule_Order__c = String(allContractRulesList.length + 1) ;        
        component.set("v.contractRuleDetail", contractRuleDetail);        
        helper.getAllObjectsList(component,event,helper);
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
                var sourceDataStore=component.get("v.mappingContractDetail.Source_Datastore__c");
                var targetDataStore=component.get("v.mappingContractDetail.Target_Datastore__c");
                if(component.get("v.mappingContractDetail.Source_Datastore__c") == "Salesforce"){
                    /** get the Map**/
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
                                        if(storeResponse[i].Datastore__c == targetDataStore)
                                        {
                                            
                                            sapObjects.push({
                                                'label':storeResponse[i].Name,
                                                'value':storeResponse[i].Name
                                            });
                                        }
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
                        }
                    });
                    $A.enqueueAction(action1); 
                    /** end **/
                }
                else{
                    var storeResponse = response.getReturnValue();
                    var sapObjects = [], salesforceObjects = [];
                    for(var i = 0 ; i < storeResponse.length ; i++ )
                    {
                        if(storeResponse[i].Active__c){
                            if(storeResponse[i].Datastore__c != 'Salesforce')
                            {
                                if(storeResponse[i].Datastore__c == sourceDataStore)
                                {
                                    sapObjects.push({
                                        'label':storeResponse[i].Name,
                                        'value':storeResponse[i].Name
                                    });
                                }   
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
                    
                    if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce'){
                        component.set("v.sourceObjectsList",sapObjects);
                        component.set("v.targetObjectsList",salesforceObjects);
                    }
                    else
                    {
                        component.set("v.sourceObjectsList",salesforceObjects);
                        component.set("v.targetObjectsList",sapObjects);   
                    }
                }
            }
        });
        $A.enqueueAction(action);    
    },
    
    closeSettingsModalHelper : function(component, event, helper) 
    {             
        //console.log('In closeSettingsModalHelper')
        var cancelCreatEvent = component.getEvent("cancelCreatEvent");
        cancelCreatEvent.setParams({
            "isCancelButtonClicked" : "false" 
        });
        cancelCreatEvent.fire();
        
    },    

    getSourceRecordTypesList: function(component, event, helper) 
    {
        //console.log('In getSourceRecordTypesList')
        
        var objectName = '';
        //console.log('datastore ::: ' , component.get("v.mappingContractDetail"))
        //console.log('contractRuleDetail ::: ' ,  component.get("v.contractRuleDetail"))
        if(component.get("v.mappingContractDetail.Source_Datastore__c") == 'Salesforce'){
            objectName = component.get("v.contractRuleDetail.Source_Object__c");
        }
        else{
            objectName = component.get("v.contractRuleDetail.Target_Object__c");        
        }
        //console.log('objectName ::: ' , objectName)
        
        if(objectName!='')
        {
            
            var action = component.get("c.getRecordTypeList");
            action.setParams({            
                "objectName" : objectName
            });  
            action.setCallback(this, function(response) {
                var state = response.getState();
                //console.log('state ::: ' , state)
                if (state === "SUCCESS") 
                {
                    var storeResponse = response.getReturnValue();
                    var recordTypeList = [];
                    for(var i = 0 ; i < storeResponse.length ; i++ )
                    {
                        //console.log('storeResponse[i] ::: ' , storeResponse[i])                        
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
                }
            });
            $A.enqueueAction(action);  
            
        }
    },
    
    getExternalIdList: function(component, event, helper) 
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
                //console.log('state ::: ' , state)
                if (state === "SUCCESS") 
                {
                    var storeResponse = response.getReturnValue();
                    var recordTypeList = [];
                    for(var i = 0 ; i < storeResponse.length ; i++ )
                    {
                        //console.log('storeResponse[i] ::: ' , storeResponse[i])                        
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
                    component.set("v.contractRuleDetail.External_Id__c",'')
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
        component.set("v.recordTypeError" , "");
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
        
        //console.log(Array.from(emptyFieldsSet).sort())
        var errorArr = Array.from(emptyFieldsSet);
        if(emptyFieldsSet.size>0){
            var errorFieldsStr = '';
            for (let item of errorArr) {
                //console.log(item)
                errorFieldsStr = errorFieldsStr + item;
                errorFieldsStr = errorFieldsStr + ', ';
            }
            //console.log('errorFieldsStr ::: ' , errorFieldsStr)
            //console.log('finale ::: ' , errorFieldsStr.substring(0,errorFieldsStr.length - 2))
            component.set("v.isErrorFound","true");
            component.set("v.errorText",'These required fields must be completed: ' + errorFieldsStr.substring(0,errorFieldsStr.length - 2));
            return true;
        }
        
        if(emptyFieldsSet.size == 0){            
            var allContractRulesList = component.get("v.allContractRulesList");
            for(var i = 0 ; i < allContractRulesList.length ; i++)
            {
                //console.log('allContractRulesList[i] ::: '+ allContractRulesList[i]);
                var sourceRecType = '';
                if(allContractRulesList[i].Source_Record_Type__c == undefined)
                    sourceRecType = '';
                else
                    sourceRecType = allContractRulesList[i].Source_Record_Type__c ;
                //console.log('1 ::: ' + allContractRulesList[i].Source_Object__c + ', 2 ::: ' + contractRuleDetail.Source_Object__c)
                //console.log('3 ::: ' + allContractRulesList[i].Target_Object__c + ', 4 ::: ' + contractRuleDetail.Target_Object__c)
                //console.log('5 ::: ' + sourceRecType + ', 6 ::: ' + contractRuleDetail.Source_Record_Type__c)
                if((allContractRulesList[i].Source_Object__c == contractRuleDetail.Source_Object__c )
                   && (allContractRulesList[i].Target_Object__c == contractRuleDetail.Target_Object__c )
                   && (sourceRecType == contractRuleDetail.Source_Record_Type__c )
                   
                  )
                {
                    component.set("v.isErrorFound", true)
                    if(contractRuleDetail.Source_Record_Type__c == '' || contractRuleDetail.Source_Record_Type__c == null)
                        component.set("v.errorText", "Contract Rule with same Source Object, Target Object is already present. Try again with different values!");
                    else{
                        component.set("v.errorText", "Contract Rule with same Source Object, Target Object and Record Type is already present. Try again with different values!");
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
                component.set("v.objectNameError" , " slds-has-error ");  
                component.set("v.isErrorFound", true);
                component.set("v.errorText", "Contract Rule name must not exceed 80 characters");                
                return true;
            }
        }
        return false;
    },
    
    saveContractRuleHelper: function(component, event, helper) 
    {
        //console.log('In saveContractRuleData')
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
            //console.log('state ::: ' + state)
            if (state === "SUCCESS") {
                if(a.getReturnValue()!=null)
                {
                    var evt = $A.get("e.c:MappingContractRefreshEvent"); 
					evt.fire();
                    
                    $A.get('e.force:refreshView').fire();  
                    var triggerSaveCRuleEvent = component.getEvent("triggerSaveCRuleEvent");
                    triggerSaveCRuleEvent.setParams({
                        "isSaveTriggered" : "true" ,
                        "type" : "Create"
                    });
                    triggerSaveCRuleEvent.fire();                    
                    
                    helper.LightningToastmessage(component, event, helper,"Contract Rule created successfully.","Success");
                }
                else
                {
                    component.set('v.isErrorFound',true);
                    component.set("v.errorText","Contract rule with same name is already present. Try again with different name!");                    
                    component.set("v.objectNameError","slds-has-error");                    
                }
            }
        });
        $A.enqueueAction(action)
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