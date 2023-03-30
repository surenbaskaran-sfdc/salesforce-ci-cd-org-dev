({
    initCreateMappingObject : function(component, event, helper) 
    {     
        var action = component.get("c.getMappingObjectFieldsDetails");
        action.setParams({
            "objectName":"Mapping_Object__c",
            "fieldName":"Datastore__c"            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                helper.getMappingObjectDetailsHelper(component, event, helper);
                if(storeResponse.length>0)
                {
                    component.set("v.allObjectsList",storeResponse[0]);    
                    component.set("v.dataStorePicklistValues",storeResponse[1]);                        
                    
                    var datastorTypeList = [];
                    for(var i=0 ; i< storeResponse[1].length; i++)
                    {
                        var pickListValue = JSON.parse(storeResponse[1][i]);
                        datastorTypeList.push({   
                            'label':pickListValue.label,
                            'value':pickListValue.label
                        });
                    }                                         
                    component.set("v.dataStorePicklistValues",datastorTypeList); 
                    
                    
                    if(component.get("v.dataStoreName") == '')
                    {
                        component.set("v.isDisabled",true);
                    }
                }                                                   
            }
        });
        $A.enqueueAction(action);
        
        helper.escapeEventHelper(component, event, helper);     
    },
    escapeEventHelper: function (component, event, helper) {        
        window.addEventListener("keydown", $A.getCallback(function (event) {
            if (event.code == 'Escape') {                
                helper.closeSettingsModalHelper(component, event, helper);
            }
        }, true));
    },
    getMappingObjectDetailsHelper : function(component, event, helper) {
        var recordId = '';
        if(component.get("v.callingFrom") == 'Header')
            recordId = component.get("v.mappingObjectRecordId");
        else
            recordId = component.get("v.recordId");
        var action = component.get("c.getDataList");
        action.setParams({
            "objectName": 'Mapping_Object__c',
            "recId": recordId
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();                
                
                if(storeResponse.length>0)
                {
                    component.set("v.mappingObjectDetail", storeResponse[0]);
                    helper.checkIsUsedMappingObjectHelper(component, event, helper);
                }                
                window.setTimeout(
                    $A.getCallback(() =>{
                        if(component.find("dataStore")!= undefined){
                            component.find("dataStore").focus();
                        }
                    }), 1
                );
                
            }
        });
        $A.enqueueAction(action);
    },
    
    checkIsUsedMappingObjectHelper : function(component, event, helper) {
        var action = component.get("c.checkIsUsedMappingObject");
        action.setParams({
            "objectName": component.get("v.mappingObjectDetail.Name")  ,
            "dataStore":component.get("v.mappingObjectDetail.Datastore__c")

        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var isUsed = response.getReturnValue();
                component.set("v.isUsed",response.getReturnValue());
                component.set("v.isDisabled",response.getReturnValue());
                component.set("v.isActiveDisabled",response.getReturnValue());
                helper.getMappingObjectFieldsList(component, event, helper);
            }
        });
        $A.enqueueAction(action);
	},
    getMappingObjectFieldsList: function(component,event,helper) {        
        
        var recordId = '';
        if(component.get("v.callingFrom") == 'Header')
            recordId = component.get("v.mappingObjectRecordId");
        else
            recordId = component.get("v.recordId");
        
        var action = component.get("c.getChildDataList");
        action.setParams({
            "childObjectName" : 'Mapping_Object_Field__c',
            "parentObjectName" : 'Object__c',
            "recId" : recordId
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                if(storeResponse.length > 0){
                    component.set("v.isUsed", true);
                }                
                component.set("v.loadingSpinner",false);
            }
        });
        $A.enqueueAction(action);
    },
    
    
    closeSettingsModalHelper : function(component, event, helper) 
    {     
        //$A.get('e.force:refreshView').fire();                
        if(component.get("v.callingFrom") == 'Header')
        {            
            var cancelEditEvent = component.getEvent("cancelEditEvent");
            cancelEditEvent.setParams({
                "isCancelButtonClicked" : "false" 
            });
            cancelEditEvent.fire();            
        }
        else 
        {
            var homeEvent = $A.get("e.force:navigateToObjectHome");
            homeEvent.setParams({
                "scope": "Mapping_Object__c"
            });
            homeEvent.fire();
        }
    },    
    validateMappingObjectData: function(component, event, helper) 
    {     
        
        component.set("v.objectError","");
        component.set("v.DatastoreError","");
        
        var errorFieldsList = '';
        var isError = false;
        var mappingObjectDetail = component.get("v.mappingObjectDetail");                      
        var dataStoreName = component.get("v.mappingObjectDetail.Datastore__c");        
        var objectName = '';
        /*if(dataStoreName == 'SAP'){
            objectName = document.getElementById("7033:0").value;                
        }
        else
        {*/
            objectName = component.get("v.mappingObjectDetail.Name");
        //}
        if(dataStoreName =='' || dataStoreName == null)
        {
            errorFieldsList = errorFieldsList + 'Datastore';
            component.set("v.DatastoreError","slds-has-error");
            isError = true;
        }
        else
        {
            component.set("v.DatastoreError","");
        }
        
        if(objectName ==undefined || objectName == null || objectName.trim() == '')
        {
            if(errorFieldsList!=''){
                errorFieldsList = errorFieldsList + ', '
            }
            isError = true;
            errorFieldsList = errorFieldsList + 'Object Name';
            component.set("v.objectError","slds-has-error");
            //component.set("v.objectError","lookupField");
        }
        else
        {
            component.set("v.mappingObjectDetail.Name",objectName);
            component.set("v.objectError","");
        }
        
        
        if(errorFieldsList!='')
        {
            isError = true;
            component.set('v.isErrorFound',true);
            component.set("v.errorText","These required fields must be completed: " + errorFieldsList);
        }
        else
        {
            component.set('v.isErrorFound',false);
            component.set("v.errorText","");
        }
        //var description =  document.getElementById("7034:0").value;
        //component.set("v.mappingObjectDetail.Description__c",description);
        //var active =  component.get("v.mappingObjectDetail.Active__c"); 
        //document.getElementById("7035:0").value;        
        //component.set("v.mappingObjectDetail.Active__c",active);
                
        return isError;
    },
    
    saveMappingObjectData: function(component, event, helper) 
    {
        var action = component.get("c.saveMappingObject");
        action.setParams({ 
            "ObjectDetail": component.get("v.mappingObjectDetail")
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS") {
                if(a.getReturnValue()!=null){
                    //$A.get('e.force:refreshView').fire(); 
                    helper.LightningToastmessage(component, event, helper,"Object updated successfully.","Success");
                    if(component.get("v.callingFrom") == 'Header'){                                     
                        var navEvt = $A.get("e.force:navigateToSObject");
                        navEvt.setParams({
                            "recordId": a.getReturnValue(),
                            "slideDevName": "Details"});
                        navEvt.fire();
                    }
                    else
                    {
                        var homeEvent = $A.get("e.force:navigateToObjectHome");
                        homeEvent.setParams({
                            "scope": "Mapping_Object__c"
                        });
                        homeEvent.fire();
                    }
                    
                }
                else{
                    component.set('v.isErrorFound',true);
                    component.set("v.errorText","Object with same name is already present. Try again with different name!");
                    if(component.get("v.mappingObjectDetail.Datastore__c") == 'Salesforce')
                        component.set("v.objectError","slds-has-error");
                    else
                        component.set("v.objectError","lookupField");
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