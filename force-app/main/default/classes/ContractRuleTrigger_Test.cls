@isTest
public class ContractRuleTrigger_Test {
    
public static testmethod void testExecuteContractRuleTrigger()
    {           
        Test.startTest();
        Account a = new Account(Name='test');
        insert a;
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'Salesforce',
                                                                                                      Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');                
        Id savedIdMC = SFConnectController.saveMappingContractDetails(testMappingContract);
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='Account',
                                                                                              Target_Object__c= 'SAP Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);        
        Id savedIdCR1 = SFConnectController.saveContractRuleData(testContractRules);
        List<sobject> testContractRulesList = SFConnectController.getChildDataList('Contract_Rule__c', 'Mapping_Contract__c', testMappingContract.Id);
        system.assertEquals(testContractRulesList.size(), 1);  
        List<List<sObject>> dataList1 = SFConnectController.getMappingContractDetailsList('Mapping_Contract__c',testMappingContract.Id);
        system.assertNotEquals(dataList1.size(), 0); 
        List<List<sObject>> dataList2 = SFConnectController.getNewMappingContractDetailsList('Mapping_Contract__c');
        system.assertNotEquals(dataList2.size(), 0); 
        
        List<List<sObject>> dataList3 = SFConnectController.getMappingContractAndContractRule('Mapping_Contract__c',testMappingContract.Id);
        system.assertNotEquals(dataList3.size(), 0); 
        
        Contract_Rule__c testContractRules1 = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='Account',
                                                                                               Target_Object__c= 'SAP Account', External_Id__c = 'Name',Mapping_Contract__c = testMappingContract.Id);
        Id savedIdCR2 = SFConnectController.saveContractRuleData(testContractRules1);        
        system.assertEquals(savedIdCR2, null);
        
        Contract_Rule__c testContractRules3 = new Contract_Rule__c(Name = 'Account Contract Rule 2' , Rule_Order__c = 2 , Source_Object__c='Account',
                                                                                               Target_Object__c= 'SAP Account', External_Id__c = 'Name',Mapping_Contract__c = testMappingContract.Id);
        Contract_Rule__c testContractRules4 = new Contract_Rule__c(Name = 'Account Contract Rule 3' , Rule_Order__c = 3 , Source_Object__c='Account',
                                                                                               Target_Object__c= 'SAP Account', External_Id__c = 'Name',Mapping_Contract__c = testMappingContract.Id);
        List<Contract_Rule__c> contractRuleList = new List<Contract_Rule__c>();
        contractRuleList.add(testContractRules3);
        SFConnectController.saveContractRuleDataList(contractRuleList); 
        Database.DeleteResult deleteResult = Database.delete(testContractRules, false);
        Test.stopTest();         
        

    }
}