({
	doInit: function(component, event, helper) 
    {                
        component.set("v.loadingSpinner",true);        
        helper.initContractRule(component, event, helper);        		
    },  
    handleOnchangeFieldName: function(component, event, helper) 
    {                        
        if(component.get("v.textAreaSplitFieldData") != '')
            component.set("v.textAreaSplitFieldDataError",'');
    },  
    handleAddTextAreaSplitValue: function(component, event, helper) 
    {                        
        helper.handleAddTextAreaSplitValueHelper(component, event, helper);        		
    },  
    handleDeleteRow: function(component, event, helper) {
        helper.handleDeleteRowHelper(component, event, helper);        		
    },
    handleValidateTransformationValue : function(component, event, helper) {
        //console.log('In handleValidateTransformationValue')
        helper.handleValidateTransformationValueHelper(component, event, helper);
    },
})