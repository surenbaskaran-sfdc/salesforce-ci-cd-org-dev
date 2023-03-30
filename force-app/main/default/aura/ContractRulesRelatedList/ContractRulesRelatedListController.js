({
	doInit: function(component, event, helper) 
    {        
        component.set("v.loadingSpinner",true);
        helper.escapeEventHelper(component,event,helper);
        helper.createColumnsForContractRules(component, event, helper);
        helper.columnsWithActions(component, event, helper);
        helper.getContractRulesList(component, event, helper);        
        helper.getIntegrationMappingDetailsHelper(component, event, helper);        
    },  
    handleRowAction: function (component, event, helper) 
    {           
        helper.handleRowActionHelper(component, event, helper);
    },   
    closeDeleteModal: function (component, event, helper) 
    {        
        helper.closeDeleteModalHelper(component, event, helper);        
    },   
    onClickAddRules: function (component, event, helper) 
    {        
        component.set("v.isAddNewRule", true);
    },    
    onClickReorderContractRules: function (component, event, helper) 
    {        
        component.set("v.isReorderContractRule", true);
    },
    
    handleDeleteContractRule: function (component, event, helper) 
    {                
        component.set("v.loadingSpinner",true);
        helper.handleDeleteContractRuleHelper(component, event, helper);
    },
    handleCancelEvent: function (component, event, helper) 
    {        
        component.set("v.isAddNewField", event.getParam("isCancelButtonClicked"));
    },
    handleCancelReorderContractRules: function (component, event, helper) 
    {                
        component.set("v.isReorderContractRule", event.getParam("isCancelButtonClicked"));
    },
    
    handleCancelEditContractRules: function (component, event, helper) 
    {                
        component.set("v.editContractRule", event.getParam("isCancelButtonClicked"));
    },
    closeObjectCreateModal: function (component, event, helper) 
    {        
        component.set("v.isErrorFound", false);
        component.set("v.errorText", "");  
        component.set("v.isAddNewField", false);
    },
    OnClickSaveReorder: function (component, event, helper) 
    {
           /* var appEvent = $A.get("e.c:saveEvent");
            appEvent.setParams({
                "isSaveButtonClicked": "true"
            });
            appEvent.fire();      */  
        
        component.find("newobjectField").startValidation();
        
    },
    handleErrorEvent: function (component, event, helper) 
    {        
        component.set("v.isErrorFound", event.getParam("isErrorFound"));
        component.set("v.errorText", event.getParam("errorMessage"));        
    },
    handleSaveContractRule: function (component, event, helper) 
    {        
        component.set("v.isErrorFound", false);
        component.set("v.errorText", "");            
        if(event.getParam("type") == "Create")
        {            
            component.set("v.isAddNewRule",false);            
            helper.getContractRulesList(component, event, helper);        
        }
        else if(event.getParam("type") == "Edit" )
        {            
            component.set("v.editContractRule",false);
            helper.getContractRulesList(component, event, helper); 
        }
        else if(event.getParam("type") == "Reorder" )
        {            
            component.set("v.isReorderContractRule",false);
            helper.getContractRulesList(component, event, helper); 
        }        
    },
    handleCancelCreateContractRules: function (component, event, helper) 
    {              
        component.set("v.isErrorFound", false);
        component.set("v.errorText", "");        
        component.set("v.isAddNewRule", false);
    },
    
    
})