@isTest
public class SyncRecord_Test {

    public static testmethod void testExecuteContractRule()
    {           
        //system.debug('In testGetChildDataList');
        Test.startTest();
        Account a = new Account(Name='test');
        insert a;
        Opportunity oppData = new Opportunity(Name='test',CloseDate=system.today()+2, AccountId=a.Id, StageName='Prospecting');
        insert oppData;
        
        system.debug('oppData:'+oppData);
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'Salesforce',
                                                                                                      Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');                
        Id savedIdMC = SFConnectController.saveMappingContractDetails(testMappingContract);
        Mapping_Contract__c testMappingContract1 = new Mapping_Contract__c(Name = 'Opportunity Mapping Contract' , Active__c = true, Source_Datastore__c = 'Salesforce',
                                                                                                      Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');                
        insert testMappingContract1;
        Integration_Mapping__c testIntegrationMapping = new Integration_Mapping__c(Name = 'Account Mapping' , Source_Datastore__c = 'SAP',
                                                                                                               Target_Datastore__c = 'Salesforce',Source_Object__c = 'Account',Target_Object__c = 'SAP Account',
                                                                                                               Button__c= 'Test',Contract_Rule__c = 'Account Mapping', Mapping_Contract__c = 'Account Mapping Contract');
        insert testIntegrationMapping;
        Integration_Mapping__c testIntegrationMapping1 = new Integration_Mapping__c(Name = 'Opportunity Mapping' , Source_Datastore__c = 'SAP',
                                                                                                               Target_Datastore__c = 'Salesforce',Source_Object__c = 'Opportunity',Target_Object__c = 'SAP Account',
                                                                                                               Button__c= 'Test',Contract_Rule__c = 'Account Mapping', Mapping_Contract__c = 'Opportunity Mapping Contract');
        insert testIntegrationMapping1;
        
        system.assertNotEquals(savedIdMC, null);  
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='Account',
                                                                                              Target_Object__c= 'SAP Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);        
        Id savedIdCR1 = SFConnectController.saveContractRuleData(testContractRules);
        system.assertNotEquals(savedIdCR1, null); 
        /*Contract_Rule__c testContractRulesnew = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='Opportunity',
                                                                                              Target_Object__c= 'SAP Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract1.Id); 
        insert testContractRulesnew;*/
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
        Test.stopTest();         
        SyncRecord.executeContractRule('Account',a.Id);
        SyncRecord.executeContractRule('Account',oppData.Id);
        SyncRecord.executeContractRule('test','test');
         SyncRecord.executeContractRule('Opportunity',oppData.Id);
        SyncRecord.executeContractRule('Opportunity',a.Id);
        SyncRecord.sleep();
    }
    public static testmethod void testExecuteContractRule1()
    {           
        Test.startTest();
        Mapping_Object__c testMappingObject = new Mapping_Object__c(Name = 'Account' , Active__c = true, Datastore__c = 'Salesforce');
        INSERT testMappingObject;
        Mapping_Object_Field__c testMappingObjectFields = new Mapping_Object_Field__c(Name = 'Id' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        INSERT testMappingObjectFields; 
        Mapping_Object_Field__c testMappingObjectFields1 = new Mapping_Object_Field__c(Name = 'Description' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        INSERT testMappingObjectFields1;
        Mapping_Object_Field__c testMappingObjectFields2 = new Mapping_Object_Field__c(Name = 'ParentId' , Datatype__c = 'REFERENCE' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        
        Mapping_Object__c testSAPMappingObject = new Mapping_Object__c(Name = 'SAP Account' , Active__c = true, Datastore__c = 'SAP');
        INSERT testSAPMappingObject;
        Mapping_Object_Field__c testSAPMappingObjectFields = new Mapping_Object_Field__c(Name = 'SAPId' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);
        INSERT testSAPMappingObjectFields;
		Mapping_Object_Field__c testSAPMappingObjectFields1 = new Mapping_Object_Field__c(Name = 'SAP Description' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);
        INSERT testSAPMappingObjectFields1;                
        Mapping_Object_Field__c testSAPMappingObjectFields2 = new Mapping_Object_Field__c(Name = 'SAPParentId' , Datatype__c = 'REFERENCE' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);
        
        List<Mapping_Object_Field__c> mappingObjectFields = new List<Mapping_Object_Field__c>();
        List<Mapping_Object_Field__c> deleteObjectFields = new List<Mapping_Object_Field__c>();
        mappingObjectFields.add(testSAPMappingObjectFields2);
        
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'Salesforce',
                                                                                                      Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');
        INSERT testMappingContract;
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='Account',
                                                                                              Target_Object__c= 'SAP Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);
        INSERT testContractRules;
        
        List<Mapping_Rule__c> mappingRuleList = new List<Mapping_Rule__c>();
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'Id', Target_Field__c = 'SAPId',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'Description', Target_Field__c = 'SAP Description',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));
        INSERT mappingRuleList;
        
        Account a = new Account(Name='test');
        insert a;
        Account b = new Account(Name='test', Description='Test');
        insert b;
        Opportunity oppData = new Opportunity(Name='test',CloseDate=system.today()+2, AccountId=a.Id, StageName='Prospecting');
        insert oppData;
        
        Test.stopTest();         
        SyncRecord.executeContractRule('Account', a.Id);
        SyncRecord.executeContractRule('Account', b.Id);
        SyncRecord.executeContractRule('Opportunity',oppData.Id);
        /*SyncRecord.executeContractRule('Account',a.Id);
        SyncRecord.executeContractRule('Account',oppData.Id);
        SyncRecord.executeContractRule('test','test');
         SyncRecord.executeContractRule('Opportunity',oppData.Id);
        SyncRecord.executeContractRule('Opportunity',a.Id);*/
        SyncRecord.sleep();
    }
        public static testmethod void testExecuteContractRule2()
    {           
        Test.startTest();
         Mapping_Object__c testMappingObject = new Mapping_Object__c(Name = 'Account' , Active__c = true, Datastore__c = 'Salesforce');
        INSERT testMappingObject;
        Mapping_Object_Field__c testMappingObjectFields = new Mapping_Object_Field__c(Name = 'Id' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        INSERT testMappingObjectFields; 
        Mapping_Object_Field__c testMappingObjectFields1 = new Mapping_Object_Field__c(Name = 'Description' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        INSERT testMappingObjectFields1;
       
        Mapping_Object_Field__c testMappingObjectFields2 = new Mapping_Object_Field__c(Name = 'ParentId' , Datatype__c = 'REFERENCE' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        Mapping_Object_Field__c testMappingObjectFields3 = new Mapping_Object_Field__c(Name = 'Tradestyle' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        Mapping_Object_Field__c testMappingObjectFields4 = new Mapping_Object_Field__c(Name = 'Site' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);        
        Mapping_Object_Field__c testMappingObjectFields5 = new Mapping_Object_Field__c(Name = 'Type' , Description__c = 'Test',Object__c = testMappingObject.Id);        
        
        Mapping_Object__c testSAPMappingObject = new Mapping_Object__c(Name = 'SAP Account' , Active__c = true, Datastore__c = 'SAP');
        INSERT testSAPMappingObject;
        Mapping_Object_Field__c testSAPMappingObjectFields = new Mapping_Object_Field__c(Name = 'SAPId' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);
        INSERT testSAPMappingObjectFields;
		Mapping_Object_Field__c testSAPMappingObjectFields1 = new Mapping_Object_Field__c(Name = 'SAP Description' , Datatype__c = 'Text Area' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);
        INSERT testSAPMappingObjectFields1;   
         Mapping_Object_Field__c testSAPMappingObjectFields7 = new Mapping_Object_Field__c(Name = 'Account Owner' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);
        INSERT testSAPMappingObjectFields7;
        Mapping_Object_Field__c testSAPMappingObjectFields2 = new Mapping_Object_Field__c(Name = 'SAPParentId' , Datatype__c = 'REFERENCE' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);
		Mapping_Object_Field__c testSAPMappingObjectFields3 = new Mapping_Object_Field__c(Name = 'SAP Tradestyle' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);        
        Mapping_Object_Field__c testSAPMappingObjectFields4 = new Mapping_Object_Field__c(Name = 'SAP Site' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);        
        Mapping_Object_Field__c testSAPMappingObjectFields5 = new Mapping_Object_Field__c(Name = 'SAP Type' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);        
        
        List<Mapping_Object_Field__c> mappingObjectFields = new List<Mapping_Object_Field__c>();
        List<Mapping_Object_Field__c> deleteObjectFields = new List<Mapping_Object_Field__c>();
        mappingObjectFields.add(testSAPMappingObjectFields2);
        
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'Salesforce',
                                                                                                      Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');
        INSERT testMappingContract;
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='Account',
                                                                                              Target_Object__c= 'SAP Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);
        INSERT testContractRules;
        
        List<Mapping_Rule__c> mappingRuleList = new List<Mapping_Rule__c>();
         mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'Name', Target_Field__c = 'SAP Name',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'Id', Target_Field__c = 'SAPId',
                                                              Rule_Order__c = 1,Mandatory__c = false, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Text Area Split', 
                                                              Transformation_Value__c = '<Description*<1**8*13*>*<2**8*13*>*<3**8*13*>*<4**8*13*>>', 
                                                              Source_Object_Fields__c = '["Description"]',
                                                              Target_Field__c = 'SAP Description',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = false,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FieldName":"Description","TextAreaSplitList":[{"lineno":1,"linenoError":"","preValue":"","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":""},{"lineno":2,"linenoError":"","preValue":"","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":""},{"lineno":3,"linenoError":"","preValue":"","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":""},{"lineno":4,"linenoError":"","preValue":"","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":""}]}'));                
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Text Split', 
                                                              Transformation_Value__c = '<Tradestyle**2*5*>',
                                                              Source_Object_Fields__c = '["Tradestyle"]',
                                                              Target_Field__c = 'SAP Tradestyle',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = false,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FieldName":"Tradestyle","PreValue":"","PostValue":"","StartPosition":"2","EndPosition":"5"}'));        
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Default', 
                                                              Transformation_Value__c = 'https://login.salesforce.com', 
                                                              Source_Object_Fields__c = '["Site"]',
                                                              Target_Field__c = 'SAP Site',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'If-Else', 
                                                              Transformation_Value__c = 'IF{("Type" EQUALS  "Active")}  THEN{("Customer")} ELSE IF{("Type" EQUALS  "Inactive")}  THEN{("Prospect")} ELSE{("")}', 
                                                              Source_Object_Fields__c = '["undefined","Type"]',
                                                              Target_Field__c = 'SAP Type',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = false,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FilterConditions":[[{"No":1,"andCondition":true,"orCondition":false,"customCondition":false,"customConditionError":"","opencustom":false,"customformula":"","field":"Type","fieldpresent":true,"fieldtype":"Text","operator":"EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Active","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"Customer","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"}],[{"No":1,"andCondition":true,"orCondition":false,"customCondition":false,"customConditionError":"","opencustom":false,"customformula":"","field":"SAP Type","fieldpresent":true,"fieldtype":"Text","operator":"EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Inactive","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"Prospect","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"}]],"MappingObjectField":"undefined","ElseValue":"#Direct","ReturnType":"Text"}'));        
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Object Reference', 
                                                              Transformation_Value__c = 'Object of (Account) Fields (Account.Parent.Id)',
                                                              Source_Object_Fields__c = '["ParentId"]',
                                                              Target_Field__c = 'SAPParentId',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"DisplayValue":"Object of (Account) Fields (Account.Parent.Id) ","Object":"Account","LookupField":"Account.Parent.Id","FilterType":"AND","FilterConditions":[],"CustomValue":""}'));        
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Object Reference', 
                                                              Transformation_Value__c = 'Object of (Account) Fields (Account.Parent.OwnerId)',
                                                              Source_Object_Fields__c = '["Parent"]',
                                                              Target_Field__c = 'Account owner',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"DisplayValue":"Object of (Account) Fields (Account.Parent.OwnerId) ","Object":"Account","LookupField":"Account.Parent.OwnerId","FilterType":"AND","FilterConditions":[],"CustomValue":""}'));        

        INSERT mappingRuleList;
        
        Account a = new Account(Name='test');
        insert a;
        Account b = new Account(Name='test', Description='Test');
        insert b;
        Opportunity oppData = new Opportunity(Name='test',CloseDate=system.today()+2, AccountId=a.Id, StageName='Prospecting');
        insert oppData;
        
        Test.stopTest();         
        SyncRecord.executeContractRule('Account', a.Id);
        SyncRecord.executeContractRule('Account', b.Id);
        SyncRecord.executeContractRule('Opportunity',oppData.Id);
        /*SyncRecord.executeContractRule('Account',a.Id);
        SyncRecord.executeContractRule('Account',oppData.Id);
        SyncRecord.executeContractRule('test','test');
         SyncRecord.executeContractRule('Opportunity',oppData.Id);
        SyncRecord.executeContractRule('Opportunity',a.Id);*/
        SyncRecord.sleep();
    }
    public static testmethod void testExecuteContractRule3()
    {           
        Test.startTest();
         Mapping_Object__c testMappingObject = new Mapping_Object__c(Name = 'Account' , Active__c = true, Datastore__c = 'Salesforce');
        INSERT testMappingObject;
        Mapping_Object_Field__c testMappingObjectFields = new Mapping_Object_Field__c(Name = 'Id' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        INSERT testMappingObjectFields; 
        Mapping_Object_Field__c testMappingObjectFields1 = new Mapping_Object_Field__c(Name = 'Description' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        INSERT testMappingObjectFields1;
       
        Mapping_Object_Field__c testMappingObjectFields2 = new Mapping_Object_Field__c(Name = 'ParentId' , Datatype__c = 'REFERENCE' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        Mapping_Object_Field__c testMappingObjectFields3 = new Mapping_Object_Field__c(Name = 'Tradestyle' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        Mapping_Object_Field__c testMappingObjectFields4 = new Mapping_Object_Field__c(Name = 'Site' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);        
        Mapping_Object_Field__c testMappingObjectFields5 = new Mapping_Object_Field__c(Name = 'Type' , Description__c = 'Test',Object__c = testMappingObject.Id);        
        
        Mapping_Object__c testSAPMappingObject = new Mapping_Object__c(Name = 'SAP Account' , Active__c = true, Datastore__c = 'SAP');
        INSERT testSAPMappingObject;
        Mapping_Object_Field__c testSAPMappingObjectFields = new Mapping_Object_Field__c(Name = 'SAPId' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);
        INSERT testSAPMappingObjectFields;
		Mapping_Object_Field__c testSAPMappingObjectFields1 = new Mapping_Object_Field__c(Name = 'SAP Description' , Datatype__c = 'Text Area' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);
        INSERT testSAPMappingObjectFields1;   
         Mapping_Object_Field__c testSAPMappingObjectFields7 = new Mapping_Object_Field__c(Name = 'Account Owner' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);
        INSERT testSAPMappingObjectFields7;
        Mapping_Object_Field__c testSAPMappingObjectFields2 = new Mapping_Object_Field__c(Name = 'SAPParentId' , Datatype__c = 'REFERENCE' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);
		Mapping_Object_Field__c testSAPMappingObjectFields3 = new Mapping_Object_Field__c(Name = 'SAP Tradestyle' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);        
        Mapping_Object_Field__c testSAPMappingObjectFields4 = new Mapping_Object_Field__c(Name = 'SAP Site' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);        
        Mapping_Object_Field__c testSAPMappingObjectFields5 = new Mapping_Object_Field__c(Name = 'SAP Type' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);        
        
        List<Mapping_Object_Field__c> mappingObjectFields = new List<Mapping_Object_Field__c>();
        List<Mapping_Object_Field__c> deleteObjectFields = new List<Mapping_Object_Field__c>();
        mappingObjectFields.add(testSAPMappingObjectFields2);
        
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'Salesforce',
                                                                                                      Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');
        INSERT testMappingContract;
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='Account',
                                                                                              Target_Object__c= 'SAP Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);
        INSERT testContractRules;
        
        List<Mapping_Rule__c> mappingRuleList = new List<Mapping_Rule__c>();
         mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'Name', Target_Field__c = 'SAP Name',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'Id', Target_Field__c = 'SAPId',
                                                              Rule_Order__c = 1,Mandatory__c = false, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Text Area Split', 
                                                              Transformation_Value__c = '<Description*<1**8*13*>*<2**8*13*>*<3**8*13*>*<4**8*13*>>', 
                                                              Source_Object_Fields__c = '["Description"]',
                                                              Target_Field__c = 'SAP Description',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = false,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FieldName":"Description","TextAreaSplitList":[{"lineno":1,"linenoError":"","preValue":"","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":""},{"lineno":2,"linenoError":"","preValue":"","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":""},{"lineno":3,"linenoError":"","preValue":"","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":""},{"lineno":4,"linenoError":"","preValue":"","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":""}]}'));                
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Text Split', 
                                                              Transformation_Value__c = '<Tradestyle**2*5*>',
                                                              Source_Object_Fields__c = '["Tradestyle"]',
                                                              Target_Field__c = 'SAP Tradestyle',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = false,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FieldName":"Tradestyle","PreValue":"","PostValue":"","StartPosition":"2","EndPosition":"5"}'));        
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Default', 
                                                              Transformation_Value__c = 'https://login.salesforce.com', 
                                                              Source_Object_Fields__c = '["Site"]',
                                                              Target_Field__c = 'SAP Site',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'If-Else', 
                                                              Transformation_Value__c = 'IF{("Type" CONTAINS "Prospect") AND ("Type" EQUALS "Prospect") AND ("Type" ENDS WITH "Prospect") AND ("Type" GREATER THAN "0") AND ("Type" GREATER THAN EQUAL "0") AND ("Type" IS NULL "False") AND ("Type" LESSER THAN "10") AND ("Type" LESSER THAN EQUAL "10") AND ("Type" NOT EQUALS "Prospect") AND ("Type" STARTS WITH  "Prospect")}  THEN{("inactive")} ELSE IF{(("Type" CONTAINS  "Customer")OR("Type" EQUALS  "Customer")OR("Type" ENDS WITH  "Customer")OR("Type" STARTS WITH  "Customer"))AND("Type" IS NULL  "False")} THEN{("active")} ELSE{("")}', 
                                                              Source_Object_Fields__c = '["undefined","Type"]',
                                                              Target_Field__c = 'SAP Type',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = false,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FilterConditions":[[{"No":1,"andCondition":true,"orCondition":false,"customCondition":false,"customConditionError":"","opencustom":false,"customformula":"","field":"Type","fieldpresent":true,"fieldtype":"Text","operator":"CONTAINS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Prospect","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"inactive","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":2,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Type","fieldpresent":true,"fieldtype":"Text","operator":"EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Prospect","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":3,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Type","fieldpresent":true,"fieldtype":"Text","operator":"ENDS WITH","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Prospect","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":4,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Type","fieldpresent":true,"fieldtype":"Text","operator":"GREATER THAN","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"0","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":5,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Type","fieldpresent":true,"fieldtype":"Text","operator":"GREATER THAN EQUAL","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"0","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":6,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Type","fieldpresent":true,"fieldtype":"Text","operator":"IS NULL","type":"Boolean","isNullOperator":true,"isTypepresent":true,"isString":false,"isNumber":false,"isBoolean":true,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"False","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":7,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Type","fieldpresent":true,"fieldtype":"Text","operator":"LESSER THAN","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"10","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":8,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Type","fieldpresent":true,"fieldtype":"Text","operator":"LESSER THAN EQUAL","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"10","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":9,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Type","fieldpresent":true,"fieldtype":"Text","operator":"NOT EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Prospect","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":10,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Type","fieldpresent":true,"fieldtype":"Text","operator":"STARTS WITH","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Prospect","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"}],[{"No":1,"andCondition":false,"orCondition":false,"customCondition":true,"customConditionError":"","opencustom":true,"customformula":"(1OR2OR3OR4)AND5","field":"Type","fieldpresent":true,"fieldtype":"Text","operator":"CONTAINS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Customer","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"active","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":2,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Type","fieldpresent":true,"fieldtype":"Text","operator":"EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Customer","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":3,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Type","fieldpresent":true,"fieldtype":"Text","operator":"ENDS WITH","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Customer","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":4,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Type","fieldpresent":true,"fieldtype":"Text","operator":"STARTS WITH","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Customer","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":5,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Type","fieldpresent":true,"fieldtype":"Text","operator":"IS NULL","type":"Boolean","isNullOperator":true,"isTypepresent":true,"isString":false,"isNumber":false,"isBoolean":true,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"False","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"}]],"MappingObjectField":"undefined","ElseValue":"#Direct","ReturnType":"Text"}'));        
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Object Reference', 
                                                              Transformation_Value__c = 'Object of (Account) Fields (Account.Parent.Parent.Parent.Id) Filter Condition (Account.Name Contains test, Account.Name Ends with test, Account.Name Equals test, Account.Name Not Equals test, Account.Name Starts with Account.Name)',
                                                              Source_Object_Fields__c = '["ParentId"]',
                                                              Target_Field__c = 'SAPParentId',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"DisplayValue":"Object of (Account) Fields (Account.Parent.Parent.Parent.Id) Filter Condition (Account.Name Contains test, Account.Name Ends with test, Account.Name Equals test, Account.Name Not Equals test, Account.Name Starts with Account.Name) ","Object":"Account","LookupField":"Account.Parent.Parent.Parent.Id","FilterType":"AND","FilterConditions":[{"Field":"Account.Name","FieldError":"","isFieldDisabled":false,"FieldDataType":"string","Operator":"Contains","OperatorSymbol":"","OperatorError":"","isOperatorDisabled":false,"Type":"direct","TypeError":"","isTypeDisabled":false,"Value":"test","ValueError":"","isValueDisabled":false,"isOperatorError":""},{"Field":"Account.Name","FieldError":"","isFieldDisabled":false,"FieldDataType":"string","Operator":"Ends with","OperatorSymbol":"","OperatorError":"","isOperatorDisabled":false,"Type":"direct","TypeError":"","isTypeDisabled":false,"Value":"test","ValueError":"","isValueDisabled":false,"isOperatorError":""},{"Field":"Account.Name","FieldError":"","isFieldDisabled":false,"FieldDataType":"string","Operator":"Equals","OperatorSymbol":"","OperatorError":"","isOperatorDisabled":false,"Type":"direct","TypeError":"","isTypeDisabled":false,"Value":"test","ValueError":"","isValueDisabled":false,"isOperatorError":""},{"Field":"Account.Name","FieldError":"","isFieldDisabled":false,"FieldDataType":"string","Operator":"Not Equals","OperatorSymbol":"!=","OperatorError":"","isOperatorDisabled":false,"Type":"direct","TypeError":"","isTypeDisabled":false,"Value":"test","ValueError":"","isValueDisabled":false,"isOperatorError":""},{"Field":"Account.Name","FieldError":"","isFieldDisabled":false,"FieldDataType":"string","Operator":"Starts with","OperatorSymbol":"LIKE","OperatorError":"","isOperatorDisabled":false,"Type":"reference","TypeError":"","isTypeDisabled":false,"Value":"Account.Name","ValueError":"","isValueDisabled":false,"isOperatorError":""}],"CustomValue":""}'));        
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Object Reference', 
                                                              Transformation_Value__c = 'Object of (Account) Fields (Account.Parent.OwnerId)',
                                                              Source_Object_Fields__c = '["Parent"]',
                                                              Target_Field__c = 'Account owner',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"DisplayValue":"Object of (Account) Fields (Account.Parent.OwnerId) ","Object":"Account","LookupField":"Account.Parent.OwnerId","FilterType":"AND","FilterConditions":[],"CustomValue":""}'));        

        INSERT mappingRuleList;
        
        Account a = new Account(Name='test');
        insert a;
        Account b = new Account(Name='test', Description='Test');
        insert b;
        Opportunity oppData = new Opportunity(Name='test',CloseDate=system.today()+2, AccountId=a.Id, StageName='Prospecting');
        insert oppData;
        
        Test.stopTest();         
        SyncRecord.executeContractRule('Account', a.Id);
        SyncRecord.executeContractRule('Account', b.Id);
        SyncRecord.executeContractRule('Opportunity',oppData.Id);
        /*SyncRecord.executeContractRule('Account',a.Id);
        SyncRecord.executeContractRule('Account',oppData.Id);
        SyncRecord.executeContractRule('test','test');
         SyncRecord.executeContractRule('Opportunity',oppData.Id);
        SyncRecord.executeContractRule('Opportunity',a.Id);*/
        SyncRecord.sleep();
    }
}