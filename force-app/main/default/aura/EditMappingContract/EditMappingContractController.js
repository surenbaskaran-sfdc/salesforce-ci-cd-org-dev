({
	doInit : function(component, event, helper) {
        component.set("v.loadingSpinner",true);
        component.set("v.callType", component.get("v.callingFrom"));
		helper.initMappingContract(component, event, helper);
        //if(component.get("v.callingFrom") != 'Header')
            //helper.editEscapeEventHelper(component, event, helper);        
    },
    handlePageChange : function(component, event, helper) {
        component.set("v.loadingSpinner",true);        
        component.set("v.callType", component.get("v.callingFrom"));
        component.set("v.isErrorFound", false);
        component.set("v.errorText", "");
        component.set("v.mappingContractNameError" , "");
        component.set("v.mappingContractSourceDatastoreError" , "");
        component.set("v.mappingContractTargetDatastoreError" , "");
        component.set("v.mappingContractEndPointURLError" , "");
        component.set("v.namedCredentialError","");
        component.set("v.jobTypeError" , "");
        component.set("v.sourceObjectError" , "");
		helper.initMappingContract(component, event, helper);
         
    },
 
    handleSaveMappingContract : function(component, event, helper) {
        if(!helper.handleValidateMappingContract(component, event, helper))
        {
            //alert('In save')
            helper.saveMappingContract(component, event, helper);            
        }  
	},
    onChangeSourceDatastore: function(component, event, helper) {
        var mappingContractDetail = component.get("v.mappingContractDetail");
        if(mappingContractDetail.Source_Datastore__c != null || mappingContractDetail.Source_Datastore__c != ''){            
            component.set("v.mappingContractSourceDatastoreError" , "");
            component.set("v.sourceObjectOptions", component.get("v.sourceObjectOptionsMap")[mappingContractDetail.Source_Datastore__c]);
        }
        else{
            mappingContractDetail.Source_Object__c = '';
            mappingContractDetail.Named_Credential__c = '';
            component.set("v.sourceObjectError" , "");
            component.set("v.mappingContractDetail",mappingContractDetail);
        }
    },
    onChangeTargetDatastore: function(component, event, helper) {
        var mappingContractDetail = component.get("v.mappingContractDetail");
        if(mappingContractDetail.Target_Datastore__c != null || mappingContractDetail.Target_Datastore__c != ''){                     
            component.set("v.mappingContractTargetDatastoreError" , "");
        }
    },
    closeRuleCreateModal : function(component, event, helper)
    {
        helper.closeSettingsModalHelper(component, event, helper);
    },
    onPressKey: function (component, event, helper) {         
        var keyValue = event.which;
        if (keyValue == 27) {
            helper.closeSettingsModalHelper(component, event, helper); 
        }
        //helper.onPressKeyboardKey(component, event, helper);
    },
})