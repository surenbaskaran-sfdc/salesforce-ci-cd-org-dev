({
	doInit : function(component, event, helper) {
        
        component.set("v.mappingObjectFieldDetailStr" , JSON.stringify(component.get("v.mappingObjectFieldDetail")))
        component.set("v.Systemicon","utility:chevrondown");
        if(component.get("v.mappingObjectDetail.Datastore__c") == 'Salesforce'){
            helper.getFieldsList(component, event, helper);}
        helper.getPickListFieldValues(component, event, helper);
        helper.escapeEventHelper(component, event, helper);     
    },
    closeObjectFieldEditModal : function(component, event, helper) {
        var cancelEditEvent = component.getEvent("cancelEditEvent");
        cancelEditEvent.setParams({
            "isCancelButtonClicked" : "false" 
        });
        cancelEditEvent.fire();
    },
    onAccordianClick:function (component, event,helper) 
    {                
        helper.onAccordianClickHelper(component, event, helper);             
    } ,
    OnClickSaveRecord:function (component, event,helper) 
    {
        component.set("v.loadingSpinner",true);
        component.set("v.isErrorFound",false);
        component.set("v.errorText",'');
        if(helper.validateMappingObjectFieldData(component, event,helper))
        {
            helper.OnClickSaveRecordHelper(component, event, helper);             
        }
        else
        {
            component.set("v.loadingSpinner",false);            
        }
    } ,
    onPressKey: function (component, event, helper) {
        
        window.addEventListener("keydown", $A.getCallback(function (event) {
            if (event.code == 'Escape') {                
                helper.onPressKeyboardKey(component, event, helper);
            }
        }, true));        
    },
})