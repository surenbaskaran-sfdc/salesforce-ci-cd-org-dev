({
	doInit: function(component, event, helper) 
    {        
        component.set("v.loadingSpinner",true);        
        helper.escapeEventHelper(component, event, helper);
        helper.getMappingObjectDetails(component, event, helper);
        helper.getMappingObjectFieldsList(component, event, helper);        
    },  
    handleRowAction: function (component, event, helper) 
    {           
        helper.handleRowActionHelper(component, event, helper);
    },   
    closeDeleteModal: function (component, event, helper) 
    {        
        helper.closeDeleteModalHelper(component, event, helper);        
    },   
    onClickAddFields: function (component, event, helper) 
    {
        //alert('In add')
        component.set("v.actionType",'Add');
        component.set("v.isSaveClicked",false);
        component.set("v.isAddNewField", true);
    },
    onClickEditFields: function (component, event, helper) 
    {
        //alert('In add')
        
        component.set("v.actionType",'Edit');
        component.set("v.isSaveClicked",false);
        component.set("v.isAddNewField", true);
    },
    handleDeleteObjectField: function (component, event, helper) 
    {                
        component.set("v.loadingSpinner",true);
        component.set('v.onDeleteClick',false);
        helper.handleDeleteObjectFieldHelper(component, event, helper);
    },
    handleCancelEvent: function (component, event, helper) 
    {        
        component.set("v.isAddNewField", event.getParam("isCancelButtonClicked"));        
    },
    closeObjectCreateModal: function (component, event, helper) 
    {        
        
        helper.closeObjectCreateModalHelper(component, event, helper);        
    },
    OnClickSaveRecord: function (component, event, helper) 
    {
        //console.log('In OnClickSaveRecord')                   
        component.set("v.isSaveClicked",true);
        component.find("newobjectField").startValidation();
        
    },
    handleErrorEvent: function (component, event, helper) 
    {        
        if(event.getParam("isErrorFound"))
            component.set("v.isSaveClicked",false);
        component.set("v.isErrorFound", event.getParam("isErrorFound"));
        component.set("v.errorText", event.getParam("errorMessage"));        
    },
    handleSaveObjectFields: function (component, event, helper) 
    {        
        component.set("v.isErrorFound", false);
        component.set("v.errorText", "");
                
        if(event.getParam("type") == "Create"){
            helper.handleSaveObjectFieldsHelper(component, event, helper);
        }
        else if(event.getParam("type") == "Edit" )
        {            
            component.set("v.editObjectField",false);
            helper.getMappingObjectFieldsList(component, event, helper); 
        }
    },
    handleCancelEditObjectFields: function (component, event, helper) 
    {      
        //console.log('Inn handleCancelEditObjectFields')
        component.set("v.isErrorFound", false);
        component.set("v.errorText", "");        
        component.set("v.editObjectField", false);           
    },
    handleSaveEditObjectField: function (component, event, helper) 
    {                      
        component.set("v.editObjectField",false);
    }
    
})