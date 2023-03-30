({
    doInit : function(component, event, helper) {
        component.set("v.loadingSpinner",true);
        helper.initCreateMappingObject(component, event, helper);
        
    },       
     handlePageChange : function(component, event, helper) {
        component.set("v.loadingSpinner",true);        
		helper.initCreateMappingObject(component, event, helper);
         
    },
 
    handleOnchangeDatastore : function(component, event, helper)
    {
        component.set('v.loadingSpinner',true);
        if(component.get("v.mappingObjectDetail.Datastore__c") == '')
        {
            component.set("v.mappingObjectDetail.Name",'');
            component.set("v.isDisabled",true);
        }
        if(component.get("v.mappingObjectDetail.Datastore__c") != '')
        {
            component.set("v.mappingObjectDetail.Name",'');
            component.set("v.isDisabled",false);
        }
        component.set("v.objectName","");
        component.set('v.loadingSpinner',false);
    },
    OnClickSaveRecord : function(component, event, helper) 
    {                        
        var isError = helper.validateMappingObjectData(component, event, helper);                
        if(!isError)
        {            
            helper.saveMappingObjectData(component, event, helper);
        }
    },       
    closeObjectCreateModal : function(component, event, helper)
    {
        helper.closeSettingsModalHelper(component, event, helper);
    },
    onPressKey: function (component, event, helper) {        
        window.addEventListener("keydown", $A.getCallback(function (event) {        
            if (event.code == 'Escape') {                   
                helper.closeSettingsModalHelper(component, event, helper);
            }
        }, true));                
    },
})