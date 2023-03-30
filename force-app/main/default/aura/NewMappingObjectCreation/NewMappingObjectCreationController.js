({
    doInit : function(component, event, helper) {
        //console.log('In doinit')        
        component.set("v.loadingSpinner",true);
        helper.initCreateMappingObject(component, event, helper);
    },       
    handlePageChange : function(component, event, helper) {
        //console.log("pageReference attribute change");
        component.set("v.loadingSpinner",true);        
		helper.initCreateMappingObject(component, event, helper);
         
    },
    handleOnchangeDatastore : function(component, event, helper)
    {
        //console.log('Datastore__c'+component.get("v.mappingObjectDetail.Datastore__c"))        
        if(component.get("v.mappingObjectDetail.Datastore__c") != '')
        {
            component.set("v.isDisabled",false);      
            component.set("v.DatastoreError",'');      
            
        }
        else{
            component.set("v.isDisabled",true);
        }
        component.set("v.objectName","");
        component.set("v.mappingObjectDetail.Name",'');                
    },
    
    handleOnchangeObjectName : function(component, event, helper)
    {
        //console.log('Name'+component.get("v.mappingObjectDetail.Name"))        
        if(component.get("v.mappingObjectDetail.Name") != '')
        {            
            component.set("v.objectError",'');                  
        }                        
    },
    OnClickSaveRecord : function(component, event, helper) 
    {
        //component.set("v.loadingSpinner",true);
        var isError = helper.validateMappingObjectData(component, event, helper);                
        if(!isError)
        {            
            component.set("v.loadingSpinner",true);
            helper.saveMappingObjectData(component, event, helper);
        }
        else
        {            
            //component.set("v.loadingSpinner",false);
        }
    },       
    closeObjectCreateModal : function(component, event, helper)
    {
        helper.closeSettingsModalHelper(component, event, helper);
    },
})