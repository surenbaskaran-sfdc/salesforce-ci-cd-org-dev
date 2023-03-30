({
	doInit : function(component, event, helper) {
        
        component.set("v.loadingSpinner",true);
		helper.initMethods(component, event, helper);  
	},
    handleEditRecord: function(component, event, helper) {    
    	component.set("v.editMappingObject",true);   
	},
    onClickDelete: function(component, event, helper) {    
        //console.log('In onClickDelete')       
        //component.set("v.validatingSpinner",true);        
        if(component.get("v.isUsed"))
            helper.LightningToastmessage(component, event, helper,'Object is referred in Mapping Contract, hence it cannot be deleted.','Error');
        else
            component.set("v.deleteMappingObject",true);   
        //helper.checkIsUsedMappingObjectHelper(component, event, helper)        
    },
    handleDeleteMappingObject: function(component, event, helper) {    
    	helper.deleteMappingObjectHelper(component, event, helper)        
        
	},
    closeDeleteModal: function(component, event, helper) {    
    	component.set("v.deleteMappingObject",false);   
	},
    
    handleCancelEditObject: function (component, event, helper) 
    {                
        component.set("v.editMappingObject", event.getParam("isCancelButtonClicked"));
    },
})