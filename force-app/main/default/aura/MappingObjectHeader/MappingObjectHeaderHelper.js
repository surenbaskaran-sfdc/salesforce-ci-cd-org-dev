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
                    //console.log('allObjectsList ::: '+ JSON.stringify(component.get("v.allObjectsList")))
                    //console.log('dataStorePicklistValues ::: '+component.get("v.dataStorePicklistValues"))
                }
                helper.getMappingObjectDetailsHelper(component, event, helper);
                
               
            }
        });
        $A.enqueueAction(action);
        */
        
        
    },
    
    escapeEventHelper: function (component, event, helper) {        
        window.addEventListener("keydown", $A.getCallback(function (event) {
            //console.log('event.code ::: ' , event.code)
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
		//console.log('In getMappingObjectDetailsHelper')
        var action = component.get("c.getDataList");
        action.setParams({
            "objectName": 'Mapping_Object__c',
            "recId": component.get("v.recordId")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                if(storeResponse.length>0)
                {
                    component.set("v.mappingObjectDetail", storeResponse[0]);
                    //console.log('mappingObjectDetail ::: ' +JSON.stringify( storeResponse))
                    helper.checkIsUsedMappingObjectHelper(component, event, helper);
                }      
                component.set("v.loadingSpinner",false);
                
            }
        });
        $A.enqueueAction(action);
	},
    
    checkIsUsedMappingObjectHelper : function(component, event, helper) {
        //console.log('In checkIsUsedMappingObjectHelper')
        var action = component.get("c.checkIsUsedMappingObject");
        action.setParams({
            "objectName": component.get("v.mappingObjectDetail.Name"),
            "dataStore": component.get("v.mappingObjectDetail.Datastore__c")            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var isUsed = response.getReturnValue();
                //console.log('isUsed ::: ' , isUsed)
                component.set("v.isUsed",response.getReturnValue());
                //component.set("v.isDisabled",response.getReturnValue());
                component.set("v.loadingSpinner",false);
            }
        });
        $A.enqueueAction(action);
    },    
    deleteMappingObjectHelper: function(component, event, helper) {
		//console.log('In deleteMappingObjectHelper')
        var action = component.get("c.deleteMappingObject");
        action.setParams({
            "mappingObjectDetail": component.get("v.mappingObjectDetail")            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                helper.LightningToastmessage(component, event, helper,'Object deleted successfully.','Success');
                component.set("v.validatingSpinner",false);
                var homeEvent = $A.get("e.force:navigateToObjectHome");
                homeEvent.setParams({
                    "scope": "Mapping_Object__c"
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