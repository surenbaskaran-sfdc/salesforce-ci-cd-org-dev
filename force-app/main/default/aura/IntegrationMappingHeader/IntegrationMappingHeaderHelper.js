({
	initMethods : function(component, event, helper) {
        helper.escapeEventHelper(component, event, helper);  
        
        helper.getMappingObjectDetailsHelper(component, event, helper);
        /*
        var action = component.get("c.getMappingObjectDetails");
        action.setParams({});  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                if(storeResponse.length>0)
                {
                    component.set("v.ownerDetails", storeResponse[0][0]);
                    component.set("v.allObjectsList",storeResponse[1]);    
                    component.set("v.dataStorePicklistValues",storeResponse[2]);                        
                    console.log('allObjectsList ::: '+ JSON.stringify(component.get("v.allObjectsList")))
                    console.log('dataStorePicklistValues ::: '+component.get("v.dataStorePicklistValues"))
                }
                helper.getMappingObjectDetailsHelper(component, event, helper);
                
               
            }
        });
        $A.enqueueAction(action);
        */
        
        
    },
    
    escapeEventHelper: function (component, event, helper) {        
        window.addEventListener("keydown", $A.getCallback(function (event) {
            if (event.code == 'Escape') {                
                helper.onPressKeyboardKey(component, event, helper);
            }
        }, true));
    },
    onPressKeyboardKey: function(component, event, helper) {        
        component.set("v.editMappingObject",false);
        component.set("v.deleteMappingObject",false);
    },
    
    
    getMappingObjectDetailsHelper : function(component, event, helper) {
        var action = component.get("c.getDataList");
        action.setParams({
            "objectName": 'Integration_Mapping__c',
            "recId": component.get("v.recordId")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                if(storeResponse.length>0)
                {
                    component.set("v.integrationMappingDetail", storeResponse[0]);
                    //helper.checkIsUsedMappingObjectHelper(component, event, helper);
                }      
                component.set("v.loadingSpinner",false);
                
            }
        });
        $A.enqueueAction(action);
	},
    
    checkIsUsedMappingObjectHelper : function(component, event, helper) {
        var action = component.get("c.checkIsUsedMappingObject");
        action.setParams({
            "objectName": component.get("v.mappingObjectDetail.Name")            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var isUsed = response.getReturnValue();
                component.set("v.isUsed",response.getReturnValue());
                //component.set("v.isDisabled",response.getReturnValue());
                component.set("v.loadingSpinner",false);
            }
        });
        $A.enqueueAction(action);
    },    
    deleteMappingObjectHelper: function(component, event, helper) {
        var action = component.get("c.deleteIntegrationMapping");
        action.setParams({
            "mappingDetail": component.get("v.integrationMappingDetail")            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                helper.LightningToastmessage(component, event, helper,'Integration Mapping deleted successfully.','Success');
                component.set("v.validatingSpinner",false);
                var homeEvent = $A.get("e.force:navigateToObjectHome");
                homeEvent.setParams({
                    "scope": "Integration_Mapping__c"
                });
                homeEvent.fire();                                    
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