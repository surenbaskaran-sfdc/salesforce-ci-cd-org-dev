({
	doInit : function(component, event, helper) {
        component.set("v.loadingSpinner",true);
        component.set("v.Systemicon","utility:chevrondown");
		helper.initMethods(component, event, helper);             
    },
    handleRefreshComponent: function(component, event, helper) {
        //console.log('Inn')        
        if(event.getParam("ObjectName") == "Mapping_Object__c")
            helper.initMethods(component, event, helper);       
    },
    changeEditLayout: function(component, event, helper) {
        component.set("v.isEditPage",true);
    },
    clickCancel: function(component, event, helper) {
        component.set("v.isEditPage",false);
        component.set("v.loadingSpinner",true);
        helper.initMethods(component, event, helper);
    },
     onAccordianClick:function (component, event,helper) 
    {        
        helper.onAccordianClickHelper(component, event, helper);             
    },
    
    onChangeDatastore:function (component, event,helper) 
    {        
        //console.log('In onChangeDatastore')
        //console.log('Innn' + component.get("v.mappingObjectDetail.Datastore__c"))
        if(component.get("v.mappingObjectDetail.Datastore__c") == ''
           ||component.get("v.mappingObjectDetail.Datastore__c") == null) 
        {
            component.set("v.isDisabledObject",true);
            component.set("v.mappingObjectDetail.Name",'');
        }
        else
        {
            component.set("v.mappingObjectDetail.Name",'');
            component.set("v.isDisabledObject",false);
        }
    },
    
    onClickSaveButton:function (component, event,helper) 
    {
        //console.log('Inn onClickSaveButton')                
        
         var isError = helper.validateMappingObjectData(component, event, helper);                
        if(!isError)
        {            
            helper.onClickSaveHelper(component, event, helper);
        }
    },
})