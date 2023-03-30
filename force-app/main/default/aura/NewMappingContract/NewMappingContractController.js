({
	doInit : function(component, event, helper) {
        //console.log('In doinit')             
        component.set("v.loadingSpinner",true);
        //console.log(component.get("v.callingFrom"))
        component.set("v.callType", component.get("v.callingFrom"));
        //console.log('mappingContractDetail ::: ' , component.get("v.mappingContractDetail"))
		helper.initMappingContract(component, event, helper);
        //if(component.get("v.callingFrom") != 'Header')
            //helper.escapeEventHelper(component, event, helper);        
    },       
    handlePageChange : function(component, event, helper) {
        //console.log("pageReference attribute change");
        component.set("v.loadingSpinner",true);
        //console.log(component.get("v.callingFrom"))
        component.set("v.callType", component.get("v.callingFrom"));
        //console.log('mappingContractDetail ::: ' , component.get("v.mappingContractDetail"))
		helper.initMappingContract(component, event, helper);
         
    },
 
    handleSaveMappingContract : function(component, event, helper) {
                
        if(!helper.handleValidateMappingContract(component, event, helper))
        {
            //console.log('Inside')               
            component.set("v.loadingSpinner",true);
            helper.saveMappingContract(component, event, helper);            
        }         
        
	},
    
    onChangeSourceDatastore: function(component, event, helper) {
        var mappingContractDetail = component.get("v.mappingContractDetail");
        //console.log('mappingContractDetail ::: ' , mappingContractDetail)
        if(mappingContractDetail.Source_Datastore__c != null || mappingContractDetail.Source_Datastore__c != ''){            
            component.set("v.mappingContractSourceDatastoreError" , "");
            component.set("v.sourceObjectOptions", component.get("v.sourceObjectOptionsMap")[mappingContractDetail.Source_Datastore__c]);
        }
        else{
            mappingContractDetail.Named_Credential__c = '';
            mappingContractDetail.Source_Object__c = '';
            component.set("v.sourceObjectError" , "");
            component.set("v.mappingContractDetail",mappingContractDetail);
        }
    },
    onChangeTargetDatastore: function(component, event, helper) {
        var mappingContractDetail = component.get("v.mappingContractDetail");
        //console.log('mappingContractDetail ::: ' , mappingContractDetail)
        if(mappingContractDetail.Target_Datastore__c != null || mappingContractDetail.Target_Datastore__c != ''){                     
            component.set("v.mappingContractTargetDatastoreError" , "");
        }
    },
    
    /*onChangeNamedCredential: function(component, event, helper) {
        var mappingContractDetail = component.get("v.mappingContractDetail");
        //console.log('mappingContractDetail ::: ' , mappingContractDetail)
        if(mappingContractDetail.Named_Credential__c != null || mappingContractDetail.Named_Credential__c != ''){            
            component.set("v.mappingContractNamedCredentialError" , "");
        }
    },*/
    
    closeRuleCreateModal : function(component, event, helper)
    {
        helper.closeSettingsModalHelper(component, event, helper);
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