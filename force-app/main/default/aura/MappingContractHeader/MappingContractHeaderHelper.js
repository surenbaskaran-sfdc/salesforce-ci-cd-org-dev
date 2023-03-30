({
    
    handleDeleteMappingContract : function(component, event, helper) {
        component.set("v.deleteContractFlag",false);         
        var action = component.get('c.deleteMappingContractDetail');        
        action.setParams({ 
            "mappingContractDetail" : component.get("v.contractinfo")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();            
            if (state === "SUCCESS") 
            {            
                var toastEvent = $A.get("e.force:showToast");            
                toastEvent.setParams({
                    message: 'Mapping Contract deleted successfully.',                     
                    type: 'SUCCESS',
                    "mode":"pester"    
                });
                toastEvent.fire();                
                var homeEvent = $A.get("e.force:navigateToObjectHome");
                homeEvent.setParams({
                    "scope": "Mapping_Contract__c"
                });
                homeEvent.fire();               
            } else if (state === "ERROR"){
                var error = "Unknown error";
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        var toastEvent = $A.get("e.force:showToast");            
                        toastEvent.setParams({
                            message:errors[0].message,                     
                            type: 'Error',
                            "mode":"pester"    
                        });
                        toastEvent.fire(); 
                    }
                }
            }
        })
        $A.enqueueAction(action);
    },
    handleSaveMappingContract : function(component,event)
    {        
        var action = component.get("c.updateMappingContract");
        action.setParams({            
            "mappingContractDetail" : component.get("v.contractinfo")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var mappingContract = response.getReturnValue();
                
                component.set("v.contractinfo", mappingContract);
                $A.get('e.force:refreshView').fire();
                var msg = '';
                
                if(component.get("v.contractinfo.Active__c"))
                    msg = msg + 'Mapping Contract has been activated successfully.';
                else
                    msg = msg + 'Mapping Contract has been deactivated successfully.';
                
                var navEvt = $A.get("e.force:navigateToSObject");
                navEvt.setParams({
                    "recordId": component.get('v.contractinfo.Id') ,                    
                });
                navEvt.fire();
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({                    
                    "message":msg,
                    "type": 'success',
                    "duration":' 5000',
                    "mode":"dismissible"
                });
                toastEvent.fire();
                
                component.set("v.loadingSpinner",false);
                
            }
        });
        $A.enqueueAction(action);    
    },
    escapeEventHelper: function (component, event, helper) {
        //console.log('Inn')
        window.addEventListener("keydown", function (event) {
            var kcode = event.code;
            if (kcode == 'Escape') {                
                component.set("v.editMappingContract",false);
                component.set("v.deleteContractFlag",false);
                component.set("v.deactivateContractFlag",false);                 
            }
        }, true);
    },
})