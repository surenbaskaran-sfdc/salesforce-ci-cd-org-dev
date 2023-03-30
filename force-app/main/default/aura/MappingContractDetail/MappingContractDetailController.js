({
    doInit : function(component, event, helper) {
        component.set("v.loadingSpinner",true);
        component.set("v.Systemicon","utility:chevrondown");
        component.set("v.openSystemInformation",true);
		helper.initMappingContract(component, event, helper);        
    },
    
    handleEvent : function(component,event,helper){
        component.set("v.loadingSpinner",true);
        component.set("v.Systemicon","utility:chevrondown");
        component.set("v.openSystemInformation",true);
        helper.initMappingContract(component, event, helper);
    },
    
    changeEditLayout: function(component, event, helper) {
        component.set("v.isEditPage",true);        
    },
    handleSaveMappingContract : function(component, event, helper) {
        if(!helper.handleValidateMappingContract(component, event, helper))
        {
            //alert('In save')
            helper.saveMappingContract(component, event, helper);            
        }
	},
     onAccordianClick:function (component, event,helper) 
    {        
        helper.onAccordianClickHelper(component, event, helper);             
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
    clickCancel: function(component, event, helper) {
        component.set("v.isEditPage",false);
        component.set("v.mappingContractNameError" , "");
        component.set("v.mappingContractSourceDatastoreError" , "");
        component.set("v.mappingContractTargetDatastoreError" , "");
        component.set("v.mappingContractEndPointURLError" , "");
        component.set("v.namedCredentialError","");
        component.set("v.jobTypeError" , "");
        component.set("v.sourceObjectError" , "");
        component.set("v.loadingSpinner",true);
        helper.initMappingContract(component, event, helper);
    },
})