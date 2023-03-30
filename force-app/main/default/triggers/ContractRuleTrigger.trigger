trigger ContractRuleTrigger on Contract_Rule__c (before delete) 
{
    if(trigger.isBefore && trigger.isDelete)
    {
        //check contract rule referred in Integration Mapping
        List<Contract_Rule__c> unreferredContractRules =  new List<Contract_Rule__c>();
        List<Integration_Mapping__c> integrationMappingList = SFConnectController.getDataList('Integration_Mapping__c',null);
        for(Contract_Rule__c record : Trigger.old){
            for(Integration_Mapping__c im : integrationMappingList)
            {
                if(im.Contract_Rule__c == record.Name ){record.addError('Cannot delete this Contract rule. It is being used in a Integration Mapping.');}
                else{unreferredContractRules.add(record); }
            }
        }
        //update the contract rule order if record is deleted
        
        //deleted Record
        Contract_Rule__c contractRuleDetail = new Contract_Rule__c();
        for(Integer i=0;i<1;i++){
            contractRuleDetail = Trigger.old[i];
        }
        //Initializing object Names
        String childObjectName = 'Contract_Rule__c', parentObjectName = 'Mapping_Contract__c' ;
        //getting all the field Names of the child object
        String allFieldApi = SFConnectController.getAllFieldsOfObject(childObjectName);
        //query formation
        String refValue = parentObjectName + ' = \'' + contractRuleDetail.Mapping_Contract__c + '\'';
        //querying the contract rule records
        List<Contract_Rule__c> mappingContractRulesList = Database.query('Select ' + allFieldApi + ' From '+ childObjectName +' where ' + refValue + 'ORDER BY Rule_Order__c');
        //get the rule order of the contractrule deleted
        Decimal ruleOrder = contractRuleDetail.Rule_Order__c;
        //loop and update the rule order of the existing contract rules
        for(Integer i = Integer.valueOf(ruleOrder)-1 ; i < mappingContractRulesList.size(); i++ )        
        {
            mappingContractRulesList[i].Rule_Order__c = mappingContractRulesList[i].Rule_Order__c - 1  ;
        }
        UPSERT mappingContractRulesList;
    }
}