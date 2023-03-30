({
    
     doInit : function(component, event, helper) {         
        //console.log('In doinit')
        component.set("v.loadingSpinner",true);                    
        helper.handleGetMappingFieldsDetails(component, event, helper);
    },  
    handleOnchangeFieldName: function(component, event, helper) 
    {                        
        if(component.get("v.textSplitFieldData") != '')
            component.set("v.textSplitFieldDataError",'');
    },  
    handleValidateTransformationValue : function(component, event, helper) {
        //console.log('In handleValidateTransformationValue')
        helper.handleValidateTransformationValueHelper(component, event, helper);
    }    
})