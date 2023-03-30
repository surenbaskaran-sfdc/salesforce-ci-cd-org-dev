({
	doInit : function(component, event, helper) {
        component.set("v.loadingSpinner",true);        
        component.set("v.Systemicon","utility:chevrondown");
		helper.initIntegrationMapping(component, event, helper);        
    },
    /*onChangeTargetDatastore: function(component, event, helper)
    {
        if(component.get("v.integrationMappingDetail.Target_Datastore__c") != null && component.get("v.integrationMappingDetail.Target_Datastore__c") != '')
            component.set("v.mappingTargetDatastoreError" , "");
        helper.onChangeTargetDatastoreHelper(component, event, helper);
        helper.onChangeTargetObjectHelper(component, event, helper);
    },*/
    onChangeSourceObject: function(component, event, helper)
    {
        if(component.get("v.integrationMappingDetail.Source_Object__c") != null && component.get("v.integrationMappingDetail.Source_Object__c") != '')
            component.set("v.mappingSourceObjectError" , "");
        
        component.set("v.buttonsList" , []);
        component.set("v.mappingContractsList" , []);
        component.set("v.contractRulesList" , []);  
        component.set("v.integrationMappingDetail.Mapping_Contract__c",'');
        //component.set("v.integrationMappingDetail.Contract_Rule__c",'');
        component.set("v.integrationMappingDetail.Button__c",'');
        helper.onChangeSourceObjectHelper(component, event, helper);
        helper.onChangeTargetObjectHelper(component, event, helper);
    },
    /*onChangeTargetObject: function(component, event, helper)
    {
        if(component.get("v.integrationMappingDetail.Target_Object__c") != null && component.get("v.integrationMappingDetail.Target_Object__c") != '')
            component.set("v.mappingTargetObjectError" , "");
                
        component.set("v.mappingContractsList" , []);
        component.set("v.contractRulesList" , []);  
        component.set("v.integrationMappingDetail.Mapping_Contract__c",'');
        component.set("v.integrationMappingDetail.Contract_Rule__c",'');        
        helper.onChangeTargetObjectHelper(component, event, helper);
    },*/
    onChangeButton: function(component, event, helper)
    {
        if(component.get("v.integrationMappingDetail.Button__c") != null && component.get("v.integrationMappingDetail.Button__c") != '')
            component.set("v.mappingButtonError" , "");        
    },
    onChangeMappingContract: function(component, event, helper)
    {
        if(component.get("v.integrationMappingDetail.Mapping_Contract__c") != null && component.get("v.integrationMappingDetail.Mapping_Contract__c") != '')
            component.set("v.mappingContractError" , "");   
        helper.onChangeMappingContractHelper(component, event, helper);
    },
    
    changeEditLayout: function(component, event, helper) {
        component.set("v.isEditPage",true);        
    },
    
     onAccordianClick:function (component, event,helper) 
    {        
        
        helper.onAccordianClickHelper(component, event, helper);             
    },    
    clickCancel: function(component, event, helper) {
        component.set("v.isEditPage",false);
        component.set("v.loadingSpinner",true);  
        helper.initIntegrationMapping(component, event, helper);
    },    
    handleSaveIntegrationMapping : function(component, event, helper) {
        
        if(!helper.handleValidateIntegrationMapping(component, event, helper))
        {
            component.set("v.loadingSpinner",true);
            component.set("v.errorText",'');
            component.set("v.isErrorFound","false"); 
            helper.saveIntegrationMapping(component, event, helper);            
        }         
        
    },
})