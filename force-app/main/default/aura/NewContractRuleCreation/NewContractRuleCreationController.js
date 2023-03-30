({
    doInit : function(component, event, helper) {
        //console.log('In doinit')
        helper.initCreateMappingObject(component, event, helper);
    },       
    
    OnClickSaveRecord : function(component, event, helper) 
    {                        
        var isError = helper.validateContractRuleData(component, event, helper);                
        if(!isError)
        {                 
            helper.saveContractRuleHelper(component, event, helper);
        }
    },
    
    onChangeSourceObjectPickList : function(component, event, helper)
    {        
        if(component.get("v.mappingContractDetail.Source_Datastore__c") == 'Salesforce')
        {
            component.set("v.contractRuleDetail.Source_Record_Type__c",'');
            helper.getSourceRecordTypesList(component, event, helper); 
        }       
        if(component.get("v.contractRuleDetail.Source_Object__c") != ''
           &&component.get("v.contractRuleDetail.Source_Object__c") != undefined  )
        {
            component.set("v.contractRuleDetail.External_Id__c",'');
            component.set("v.sourceObjectError",'');
            
            helper.getExternalIdList(component, event, helper);                
        }
        else
        {
            component.set("v.externalIdList",[]);
            component.set("v.contractRuleDetail.External_Id__c",'');
        }
    },
    onChangeTargetObjectPickList: function(component, event, helper)
    {        
        if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce')
        {
            if(component.get("v.contractRuleDetail.Target_Object__c") != ''
              &&component.get("v.contractRuleDetail.Target_Object__c") != undefined )
            {
                component.set("v.targetObjectError",'');
                component.set("v.contractRuleDetail.Source_Record_Type__c",'');
                helper.getSourceRecordTypesList(component, event, helper);  
            }
            else
            {
                component.set("v.contractRuleDetail.Source_Record_Type__c",'');
            }
        }
        else
        {
            if(component.get("v.contractRuleDetail.Target_Object__c") != ''
              &&component.get("v.contractRuleDetail.Target_Object__c") != undefined  )
            {
                component.set("v.targetObjectError",'');
            }
        }
    },
    onChangeRecordType: function(component, event, helper)
    {     
        if(component.get("v.contractRuleDetail.Source_Record_Type__c") != ''
           &&component.get("v.contractRuleDetail.Source_Record_Type__c") != undefined  )
        {
            component.set("v.recordTypeError",'');
        }
    },
    
    onChangeExternalIdPickList: function(component, event, helper)
    {        
        if(component.get("v.contractRuleDetail.External_Id__c") != ''
           &&component.get("v.contractRuleDetail.External_Id__c") != undefined  )
        {
            component.set("v.externalIdError",'');
        }
    },
    
    closeRuleCreateModal : function(component, event, helper)
    {
        helper.closeSettingsModalHelper(component, event, helper);
    },
})