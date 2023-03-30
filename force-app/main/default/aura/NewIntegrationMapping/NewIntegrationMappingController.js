({
	doInit : function(component, event, helper) {
        //console.log('In doinit')             
        component.set("v.loadingSpinner",true);        
		helper.initIntegrationMapping(component, event, helper);        
    },
    handlePageChange : function(component, event, helper) {
        //console.log("pageReference attribute change");
        
        component.set("v.loadingSpinner",true);       
        
        component.set("v.mappingNameError" , "");
        component.set("v.mappingSourceDatastoreError" , "");
        component.set("v.mappingTargetDatastoreError" , "");
        component.set("v.mappingSourceObjectError" , "");
        component.set("v.mappingTargetObjectError" , "");
        component.set("v.mappingContractError" , "");
        component.set("v.contractRuleError" , "");
        component.set("v.mappingButtonError" , "");
        
        component.set("v.targetDatastoreList" , []);
        component.set("v.sourceDatastoreList" , []);
        component.set("v.sourceObjectList" , []);
        component.set("v.targetObjectList" , []);
        component.set("v.buttonsList" , []);
        component.set("v.mappingContractsList" , []);
        //component.set("v.contractRulesList" , []);        
        
		helper.initIntegrationMapping(component, event, helper);
         
    },
    closeRuleCreateModal : function(component, event, helper)
    {
        helper.closeSettingsModalHelper(component, event, helper);
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
        component.set("v.mappingNameError" , "");
        component.set("v.mappingSourceDatastoreError" , "");
        component.set("v.mappingSourceObjectError" , "");
        component.set("v.mappingContractError" , "");
        component.set("v.mappingButtonError" , "");
        if(component.get("v.integrationMappingDetail.Source_Object__c") != null && component.get("v.integrationMappingDetail.Source_Object__c") != '')
            component.set("v.mappingSourceObjectError" , "");
        
        component.set("v.buttonsList" , []);
        component.set("v.mappingContractsList" , []);
        //component.set("v.contractRulesList" , []);  
        component.set("v.integrationMappingDetail.Mapping_Contract__c",'');
        component.set("v.integrationMappingDetail.Button__c",'');
        helper.onChangeSourceObjectHelper(component, event, helper);
        helper.onChangeTargetObjectHelper(component, event, helper);
    },
    /*onChangeTargetObject: function(component, event, helper)
    {
        if(component.get("v.integrationMappingDetail.Target_Object__c") != null && component.get("v.integrationMappingDetail.Target_Object__c") != '')
            component.set("v.mappingTargetObjectError" , "");
                
        component.set("v.mappingContractsList" , []);
        //component.set("v.contractRulesList" , []);  
        component.set("v.integrationMappingDetail.Mapping_Contract__c",'');      
        helper.onChangeTargetObjectHelper(component, event, helper);
    },*/
    onChangeButton: function(component, event, helper)
    {
        component.set("v.mappingNameError" , "");
        component.set("v.mappingSourceDatastoreError" , "");
        component.set("v.mappingSourceObjectError" , "");
        component.set("v.mappingContractError" , "");
        component.set("v.mappingButtonError" , "");
        if(component.get("v.integrationMappingDetail.Button__c") != null && component.get("v.integrationMappingDetail.Button__c") != '')
            component.set("v.mappingButtonError" , "");        
    },
    onChangeMappingContract: function(component, event, helper)
    {
        component.set("v.mappingNameError" , "");
        component.set("v.mappingSourceDatastoreError" , "");
        component.set("v.mappingSourceObjectError" , "");
        component.set("v.mappingContractError" , "");
        component.set("v.mappingButtonError" , "");
        if(component.get("v.integrationMappingDetail.Mapping_Contract__c") != null && component.get("v.integrationMappingDetail.Mapping_Contract__c") != '')
            component.set("v.mappingContractError" , "");       
        //helper.onChangeMappingContractHelper(component, event, helper);
    },
    /*onChangeContractRule: function(component, event, helper)
    {
        if(component.get("v.integrationMappingDetail.Contract_Rule__c") != null && component.get("v.integrationMappingDetail.Contract_Rule__c") != '')
            component.set("v.contractRuleError" , "");               
    },*/
    /*handleSaveIntegrationMapping: function(component, event, helper)
    {
        helper.handleSaveIntegrationMappingHelper(component, event, helper);
    },*/
    handleSaveIntegrationMapping : function(component, event, helper) {
                
        if(!helper.handleValidateIntegrationMapping(component, event, helper))
        {
            //console.log('Inside')               
            component.set("v.loadingSpinner",true);
            component.set("v.errorText",'');
            component.set("v.isErrorFound","false"); 
            helper.saveIntegrationMapping(component, event, helper);            
        }         
        
	},
    onPressKey: function (component, event, helper) {         
        var keyValue = event.which;
        //console.log('keyValue ::: ' , keyValue)
        if (keyValue == 27) {
            //console.log('In escape key press')            
            helper.closeSettingsModalHelper(component, event, helper); 
        }
        //helper.onPressKeyboardKey(component, event, helper);
    },
})