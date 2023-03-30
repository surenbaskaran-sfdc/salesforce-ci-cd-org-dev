({
    doInit : function(component, event, helper) {
        component.set("v.defaultData", component.get("v.mappingRuleDetail.Transformation_Value__c"));                
    },
    handleValidateTransformationValue : function(component, event, helper) {
        component.set("v.defaultDataError",'');
        if(component.get("v.defaultData") == ''){
            component.set("v.defaultDataError",'slds-has-error');
            component.set("v.isErrorFound","true");
            component.set("v.errorText",'This required field must be completed: Default Value.');
            
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
                "type" : "Default"
            });
            triggerSaveEvent.fire();
        }
    },
})