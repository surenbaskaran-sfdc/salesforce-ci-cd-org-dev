({
	initMethods : function(component, event, helper) {
        helper.escapeEventHelper(component, event, helper);  
        
        helper.getContractRuleDetailsHelper(component, event, helper);        
    },
    
    escapeEventHelper: function (component, event, helper) {        
        window.addEventListener("keydown", $A.getCallback(function (event) {
            if (event.code == 'Escape') {                
                helper.onPressKeyboardKey(component, event, helper);
            }
        }, true));
    },
    onPressKeyboardKey: function(component, event, helper) {        
        component.set("v.editContractRule",false);
        component.set("v.onDeleteClick",false);
    },
    
    
    getContractRuleDetailsHelper : function(component, event, helper) {
        
        var action = component.get("c.getDataList");
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
                    //helper.checkIsUsedMappingObjectHelper(component, event, helper);
                }      
                //component.set("v.loadingSpinner",false);
                helper.getIntegrationMappingDetailsHelper(component, event, helper);
                
            }
        });
        $A.enqueueAction(action);
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
                    component.set("v.mappingContractsList",storeResponse[0]);
                    component.set("v.integrationMappingList",storeResponse[1]);
                }      
                component.set("v.loadingSpinner",false);
                
            }
        });
        $A.enqueueAction(action);
    },  
    handleDeleteContractRuleHelper: function (component, event, helper) 
    {
        var action = component.get("c.deleteContractRule");
        action.setParams({            
            "contractRuleDetail" : component.get("v.recordToDelete")            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();                
                helper.LightningToastmessage(component, event, helper,"Contract Rule deleted successfully.","Success");                
                
                var navEvt = $A.get("e.force:navigateToSObject");
                navEvt.setParams({
                    "recordId": component.get("v.recordToDelete.Mapping_Contract__c"),                    
                });
                navEvt.fire();
                component.destroy();
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