({
    doInit : function(component, event, helper) {
        component.set("v.loadingSpinner",true);                         
        helper.handleGetMappingFieldsDetails(component, event, helper);         
        
    },
    onChangeDirectField: function(component, event, helper) {        
        if(component.get("v.directData") != '' || component.get("v.directData") != null )
        {            
            component.set("v.directDataError",'');            
        }
    },
    handleValidateTransformationValue : function(component, event, helper) {
        component.set("v.directDataError",'');
        if(component.get("v.directData") == '' || component.get("v.directData") == null ){
            component.set("v.directDataError",'slds-has-error');
            component.set("v.isErrorFound","true");
            component.set("v.errorText",'This required field must be completed: Direct Value.');
            
            var errorEvent = component.getEvent("errorEvent");            
            errorEvent.setParams({
                "isErrorFound": component.get("v.isErrorFound"),
                "errorMessage": component.get("v.errorText")
            });
            errorEvent.fire();
            
        }
        else
        {
            var triggerSaveEvent = component.getEvent("triggerSaveEvent");
            triggerSaveEvent.setParams({
                "isSaveTriggered" : "true" ,
                "type" : "Direct"
            });
            triggerSaveEvent.fire();
        }
    },
})