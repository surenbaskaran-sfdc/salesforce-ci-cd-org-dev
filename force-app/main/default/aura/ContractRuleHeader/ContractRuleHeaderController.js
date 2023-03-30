({
	doInit : function(component, event, helper) {
        
        component.set("v.loadingSpinner",true);
		helper.initMethods(component, event, helper);  
        helper.escapeEventHelper(component, event, helper);
	},
    
 
    handleEditRecord: function(component, event, helper) {    
    	component.set("v.editContractRule",true);   
	},
    
    handleCancelEditContractRules: function (component, event, helper) 
    {                
        component.set("v.editContractRule", event.getParam("isCancelButtonClicked"));
    },
    onClickDelete: function(component, event, helper) {    
        
        var integrationMappingList = component.get("v.integrationMappingList");
        var isUsedFlag = false;
        for(var item in integrationMappingList)
        {
            
            if(component.get("v.mappingContractsList")[0]['Name'] == integrationMappingList[item]['Mapping_Contract__c']
              &&component.get("v.contractRuleDetail.Name") == integrationMappingList[item]['Contract_Rule__c']
              )
            {
                var toastEvent = $A.get("e.force:showToast");            
                toastEvent.setParams({
                    message: 'Cannot delete this Mapping Contract. It is being used in a Integration Mapping.',
                    type: 'ERROR',
                    "mode":"pester"    
                });
                toastEvent.fire();
                isUsedFlag = true;
                break;
            }
        }
        if(!isUsedFlag){                                    
            component.set('v.onDeleteClick',true);         
            component.set('v.recordToDelete',component.get("v.contractRuleDetail"));
        }
    },
    handleDeleteContractRule: function (component, event, helper) 
    {                
        component.set("v.loadingSpinner",true);
        helper.handleDeleteContractRuleHelper(component, event, helper);
    },
    closeDeleteModal: function(component, event, helper) {    
    	component.set("v.onDeleteClick",false);   
	},
    
    handleCancelEditObject: function (component, event, helper) 
    {                
        component.set("v.editMappingObject", event.getParam("isCancelButtonClicked"));
    },
})