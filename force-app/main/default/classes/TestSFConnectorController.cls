@isTest(SeeAllData = false)
public class TestSFConnectorController 
{
    public static testmethod void testGetChildDataList()
    {           
        //system.debug('In testGetChildDataList');
        Test.startTest();
        
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'Salesforce',
                                                                                                      Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');                
        Id savedIdMC = SFConnectController.saveMappingContractDetails(testMappingContract);
        system.assertNotEquals(savedIdMC, null);  
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='Account',
                                                                                              Target_Object__c= 'SAP Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);        
        Id savedIdCR1 = SFConnectController.saveContractRuleData(testContractRules);
        system.assertNotEquals(savedIdCR1, null); 
        
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
        SFConnectController.getChildObjectNames(testMappingContract.Id);
        
        Test.stopTest();                
    }
    public static testmethod void testGetDataList()
    {           
        //system.debug('In testGetDataList');
        Test.startTest();
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'Salesforce',
                                                                                                      Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');
        INSERT testMappingContract;
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='Account',
                                                                                              Target_Object__c= 'SAP Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);
        INSERT testContractRules;
        
        List<sobject> mappingContractsList = SFConnectController.getDataList( 'Mapping_Contract__c', testMappingContract.Id);
        List<sobject> allMappingContractsList = SFConnectController.getDataList( 'Mapping_Contract__c', null);
        system.assertEquals(mappingContractsList.size(), 1);                           
        system.assertEquals(allMappingContractsList.size(), 1);         
        
        Mapping_Object__c testMappingObject = new Mapping_Object__c(Name = 'Account' , Active__c = true, Datastore__c = 'Salesforce');
        Id isSaved = SFConnectController.saveMappingObject(testMappingObject);
        system.assertNotEquals(isSaved, null); 
        try{
            DELETE testMappingObject;
        }
        Catch(Exception e)
        {
            //system.debug('Exception ::: ' + e);
        }
        Mapping_Contract__c testUpdateMappingContract = new Mapping_Contract__c();
        testUpdateMappingContract= testMappingContract;
        testUpdateMappingContract.Description__c = 'Test account mapping';        
        testUpdateMappingContract.Active__c = false;        
        system.assertEquals(SFConnectController.updateMappingContract(testUpdateMappingContract), testUpdateMappingContract);         
        SFConnectController.deleteMappingContractDetail(testUpdateMappingContract);        
        Test.stopTest();                
    }
    public static testmethod void testbulkdata()
    {           
        //system.debug('In testgetDataListWithConditions');
        Test.startTest();
        Set<Id> recID = new Set<Id>();
        Account acc = new Account(Name ='test');
        insert acc;
        recID.add(acc.Id);
        SFConnectController testbulk = new SFConnectController();
        testbulk.getBulkDataList('Account',recID);
        GenerateRequest.getallObjects('Account',null);
        Test.stopTest();        
       
    }
    public static testmethod void testgetDataListWithConditions()
    {           
        //system.debug('In testgetDataListWithConditions');
        Test.startTest();
        Mapping_Object__c testMappingObject = new Mapping_Object__c(Name = 'Account' , Active__c = true, Datastore__c = 'Salesforce');
        Id isSaved = SFConnectController.saveMappingObject(testMappingObject);
        system.assertNotEquals(isSaved, null);      
        Mapping_Object_Field__c testMappingObjectFields = new Mapping_Object_Field__c(Name = 'Id' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        INSERT testMappingObjectFields;
        
        List<sobject> mappingObjectFieldsList1 = SFConnectController.getDataListWithConditions('Mapping_Object_Field__c','Salesforce', 'Account');        
        system.assertEquals(mappingObjectFieldsList1.size(), 1);              
        List<sobject> mappingObjectFieldsList2 = SFConnectController.getDataListWithConditions('Mapping_Object_Field__c','', 'Mapping_Object__c');                
        system.assertEquals(mappingObjectFieldsList2.size(), 1);
        
        List<List<String>> resultString = SFConnectController.getMappingObjectDetails();
        system.assertNotEquals(resultString.size(), 0);
        
        Mapping_Object__c testMappingObject1 = new Mapping_Object__c(Name = 'Account' , Active__c = true, Datastore__c = 'Salesforce');
        Id isSavedNull = SFConnectController.saveMappingObject(testMappingObject1);
        system.assertEquals(isSavedNull, null); 
        
        SFConnectController.deleteMappingObject(testMappingObject);
        Boolean isDeleted = SFConnectController.deleteMappingObjectField('Mapping_Object_Field__c',testMappingObjectFields.Id);        
        system.assertEquals(isDeleted, true); 
        Test.stopTest();        
        
    }
    public static testmethod void testGetAllFieldsNameList()
    {           
        //system.debug('In testGetAllFieldsNameList');
        Test.startTest();        
        List<String> fieldNames = SFConnectController.getAllFieldsNameList('Account');
        List<String> refObjectNames = SFConnectController.getAllReferenceObjectNames('Account');
        system.assertNotEquals(fieldNames.size(), 0);
        system.assertNotEquals(refObjectNames.size(), 0);
        Test.stopTest();                
    }
    public static testmethod void testGetMappingObjectFieldsDetails()
    {           
        //system.debug('In testGetAllFieldsNameList');
        Test.startTest();        
        List<List<String>> dataList = SFConnectController.getMappingObjectFieldsDetails('Mapping_Object_Field__c','Datatype__c');
        system.assertNotEquals(dataList.size(), 0);                                           
        Test.stopTest();                
    }
    
    public static testmethod void testCheckIsUsedMappingObject()
    {           
        //system.debug('In testGetAllFieldsNameList');
        Test.startTest();        
        Mapping_Object__c testMappingObject = new Mapping_Object__c(Name = 'Account' , Active__c = true, Datastore__c = 'Salesforce');
        INSERT testMappingObject;
        Mapping_Object_Field__c testMappingObjectFields = new Mapping_Object_Field__c(Name = 'Id' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        INSERT testMappingObjectFields;
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'Salesforce',
                                                                                                      Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');
        INSERT testMappingContract;
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='Account',
                                                                                              Target_Object__c= 'SAP Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);
        INSERT testContractRules;
        Boolean isUsedTrue = SFConnectController.checkIsUsedMappingObject('Account','Salesforce');
        Boolean isUsedFalse = SFConnectController.checkIsUsedMappingObject('Opportunity','SAP');
        List<List<SObject>> dataList = SFConnectController.checkIsUsedMappingObjectFields('','Account',null);
        system.assertEquals(isUsedTrue, true);    
        system.assertEquals(isUsedFalse, false);    
        system.assertNotEquals(dataList.size(), 0);   
        SFConnectController.deleteContractRule(testContractRules);        
        Test.stopTest();                
    }
    
    public static testmethod void testSaveanddeleteMappingObjectFieldsList()
    {           
        //system.debug('In testGetAllFieldsNameList');
        Test.startTest();        
        Mapping_Object__c testMappingObject = new Mapping_Object__c(Name = 'Account' , Active__c = true, Datastore__c = 'SAP');
        INSERT testMappingObject;
        Mapping_Object_Field__c testMappingObjectFields = new Mapping_Object_Field__c(Name = 'Id' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        INSERT testMappingObjectFields;
        Mapping_Object_Field__c testMappingObjectFields1 = new Mapping_Object_Field__c(Name = 'SAPId' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        List<Mapping_Object_Field__c> mappingObjectFields = new List<Mapping_Object_Field__c>();
        List<Mapping_Object_Field__c> deleteObjectFields = new List<Mapping_Object_Field__c>();
        mappingObjectFields.add(testMappingObjectFields1);
        deleteObjectFields.add(testMappingObjectFields);
        Boolean isSaved = SFConnectController.saveanddeleteMappingObjectFieldsList(mappingObjectFields,deleteObjectFields);
        
        Mapping_Object__c testMappingObject1 = new Mapping_Object__c(Name = 'Account' , Active__c = true, Datastore__c = 'Salesforce');
        INSERT testMappingObject1;
        Mapping_Object_Field__c testMappingObjectFields11 = new Mapping_Object_Field__c(Name = 'Id' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject1.Id);
        INSERT testMappingObjectFields11;
        Mapping_Object_Field__c testMappingObjectFields12 = new Mapping_Object_Field__c(Name = 'Name' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject1.Id);
        List<Mapping_Object_Field__c> mappingObjectFields1 = new List<Mapping_Object_Field__c>();
        List<Mapping_Object_Field__c> deleteObjectFields1 = new List<Mapping_Object_Field__c>();
        mappingObjectFields1.add(testMappingObjectFields11);
        deleteObjectFields1.add(testMappingObjectFields1);
        Boolean isSaved1 = SFConnectController.saveanddeleteMappingObjectFieldsList(mappingObjectFields1,deleteObjectFields1);
        
        List<List<sObject>> resultList1 = new List<List<sObject>>();
        resultList1 = SFConnectController.getMappingObjectAndFieldsDetails('Account','Salesforce','All');
        List<List<sObject>> resultList2 = SFConnectController.getMappingObjectAndFieldsDetails('Account','SAP','TEXT');
        List<List<sObject>> resultList3 = SFConnectController.getMappingObjectAndFieldsDetails('Account','Salesforce','STRING');        
        system.assertNotEquals(resultList1.size(), 0);
        
        system.assertNotEquals(resultList2.size(), 0);
        system.assertNotEquals(resultList3.size(), 0);
        
        system.assertEquals(isSaved, true);   
        Test.stopTest();                
    }
    
    public static testmethod void testGetRecordTypeList()
    {           
        //system.debug('In testGetAllFieldsNameList');
        Test.startTest();        
        List<String> dataList = SFConnectController.getRecordTypeList('Order');
        system.assertNotEquals(dataList.size(), 0);                                           
        Test.stopTest();                
    }
    
    public static testmethod void testGetContractRuleDetails()
    {           
        //system.debug('In testGetDataList');
        Test.startTest();
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'Salesforce',
                                                                                                      Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');
        INSERT testMappingContract;
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='Account',
                                                                                              Target_Object__c= 'SAP Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);
        INSERT testContractRules;        
        List<List<sObject>> allDataList = SFConnectController.getContractRuleDetails( 'Contract_Rule__c', testContractRules.Id);                
        system.assertNotEquals(allDataList.size(), 0);                            
        Test.stopTest();                
    }
    public static testmethod void testGetObjectFieldsAndFieldTypes()
    {           
        //system.debug('In testGetAllFieldsNameList');
        Test.startTest();        
        List<List<String>> dataList = SFConnectController.getObjectFieldsAndFieldTypes('Account');
        system.assertNotEquals(dataList.size(), 0);                                           
        Test.stopTest();                
    }
    public static testmethod void testGetFieldsForFieldSelector()
    {           
        //system.debug('In testGetAllFieldsNameList');
        Test.startTest();      
        Mapping_Object__c testMappingObject = new Mapping_Object__c(Name = 'Account' , Active__c = true, Datastore__c = 'Salesforce');
        INSERT testMappingObject;
        Mapping_Object_Field__c testMappingObjectFields = new Mapping_Object_Field__c(Name = 'Id' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        INSERT testMappingObjectFields;        
        Mapping_Object_Field__c testMappingObjectFields1 = new Mapping_Object_Field__c(Name = 'ParentId' , Datatype__c = 'REFERENCE' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        List<Mapping_Object_Field__c> mappingObjectFields = new List<Mapping_Object_Field__c>();
        List<Mapping_Object_Field__c> deleteObjectFields = new List<Mapping_Object_Field__c>();
        mappingObjectFields.add(testMappingObjectFields1);        
        Boolean isSaved = SFConnectController.saveanddeleteMappingObjectFieldsList(mappingObjectFields,deleteObjectFields);
        
        List<String> dataList = SFConnectController.getFieldsForFieldSelector('Account');
        List<String> dataList1 = SFConnectController.getFieldsForFieldSelector('Order');
        system.assertNotEquals(dataList.size(), 0);
        system.assertNotEquals(dataList1.size(), 0);
        Test.stopTest();                
    }
    public static testmethod void testRetriveObjectNames()
    {           
        //system.debug('In testGetAllFieldsNameList');
        Test.startTest();        
        List<String> objectNamesList = new List<String>();
        objectNamesList.add('Account');
        objectNamesList.add('Order');
        Map<String,String> dataList = SFConnectController.retriveObjectNames(objectNamesList);
        system.assertNotEquals(dataList.size(), 0);
        Test.stopTest();                
    }
    
    public static testmethod void testSaveMappingRules()
    {
        //system.debug('In testSaveMappingRules');
        Test.startTest();        
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'Salesforce',
                                                                                                      Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');
        INSERT testMappingContract;
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='Account',
                                                                                              Target_Object__c= 'SAP Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);
        INSERT testContractRules;  
        
        List<Mapping_Rule__c> mappingRuleList = new List<Mapping_Rule__c>();
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'Id', Target_Field__c = 'SalesforceId',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));        
        SFConnectController.saveMappingRules(mappingRuleList);    
        SFConnectController.deleteMappingRules(mappingRuleList[0]);    
        
        List<Response_Rule__c> ResponseRuleList = new List<Response_Rule__c>();
        ResponseRuleList.add(new Response_Rule__c(Name = 'Direct', Source_Field__c = 'SalesforceId', Target_Field__c = 'Id',
                                                                Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));        
        SFConnectController.saveResponseRules(ResponseRuleList);  
        SFConnectController.deleteResponseRules(ResponseRuleList[0]); 
        
        Test.stopTest();                
    }
    
    public static testmethod void testCreateNewIntegrationMapping()
    {           
        //system.debug('In testGetAllFieldsNameList');
        Test.startTest();        
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'Salesforce',
                                                                                                      Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');
        INSERT testMappingContract;
        Integration_Mapping__c testIntegrationMapping = new Integration_Mapping__c(Name = 'Account Mapping' , Source_Datastore__c = 'SAP',
                                                                                                               Target_Datastore__c = 'Salesforce',Source_Object__c = 'Account',Target_Object__c = 'SAP Account',
                                                                                                               Button__c= 'Test',Contract_Rule__c = 'Account Mapping', Mapping_Contract__c = 'Account Mapping Contract');
        Id integrationMappingId = SFConnectController.saveIntegrationMappingDetails(testIntegrationMapping);
        system.assertNotEquals(integrationMappingId, null);                                           
        Map<String,List<sObject>> dataList = SFConnectController.createNewIntegrationMapping('Integration_Mapping__c',null);
        Map<String,List<sObject>> dataList1 = SFConnectController.createNewIntegrationMapping('Integration_Mapping__c',integrationMappingId);
        List<String> buttonsList = SFConnectController.getQuickActionsList('Account');
        List<List<sObject>> integrationMappingsList = SFConnectController.getIntegrationMappingDetails('Mapping_Contract__c',testMappingContract.Id);
        
        system.assertNotEquals(buttonsList.size(), 0);
        system.assertNotEquals(dataList.size(), 0);
        system.assertNotEquals(dataList1.size(), 0);
        
        Mapping_Contract__c testMappingContract2 = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'Salesforce',
                                                                                                       Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');
        Mapping_Contract__c testMappingContract3 = new Mapping_Contract__c(Id = testMappingContract.Id, Name = 'Account Mapping Contract Update' , Active__c = true, Source_Datastore__c = 'Salesforce',
                                                                                                       Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');        
        try{
            INSERT testMappingContract2;            
        }
        Catch (Exception e)
        {
            //system.debug('Exception ::: ' + e);
        }
        try{
            DELETE testMappingContract;            
        }
        Catch (Exception e)
        {
            //system.debug('Exception ::: ' + e);
        }        
        SFConnectController.deleteIntegrationMapping(testIntegrationMapping);
        Test.stopTest();                
    }
    
    public static testmethod List <Integration_log__c> testInsertLogs()
    {
        List <Integration_log__c> lstLogs = new List<Integration_log__c>();
        
        Integration_log__c log1 = new Integration_log__c(Request_Datetime__c = Date.valueOf('2020-10-1 00:00:00'),Request_Data__c = 'requestJSONData1',Operation__c = 'opertaion1', 
                                                                                     Object__c = 'Obj1',Response_Data__c = 'responseJSONData1',IsSuccess__c = true, 
                                                                                     Source_Datastore__c = 'sourceDatastore', Target_Datastore__c = 'targetDatastore' ,
                                                                                     Record_Id_Split__c = 'recId', Response_Date_time__c = system.now());
        Integration_log__c log2 = new Integration_log__c(Request_Datetime__c = Date.valueOf('2020-10-2 00:00:00'),Request_Data__c = 'requestJSONData2',Operation__c = 'opertaion2', 
                                                                                     Object__c = 'Obj2',Response_Data__c = 'responseJSONData2',IsSuccess__c = true, 
                                                                                     Source_Datastore__c = 'sourceDatastore', Target_Datastore__c = 'targetDatastore' ,
                                                                                     Record_Id_Split__c = 'recId', Response_Date_time__c = system.now());
        
        lstLogs.add(log1);
        lstLogs.add(log2);        
        insert lstLogs;
        return lstLogs;
    }
    
    public static testmethod void testLogsMassDelete()
    {
        //system.debug('In testLogsMassDelete');
        Test.startTest();                
        List <Integration_log__c> lstLogs = new List<Integration_log__c>();
        lstLogs = testInsertLogs();        
        ApexPages.StandardSetController sc = new ApexPages.StandardSetController(lstLogs);        
        ClearIntegrationLogsController controller = new ClearIntegrationLogsController(sc);                        
        controller.clearLogs();   
        sc.setSelected(lstLogs);
        controller.clearLogs();         
        lstLogs = testInsertLogs();        
        controller.getStartDate = Date.valueOf('2020-09-30 00:00:00');
        controller.getEndDate = Date.valueOf('2020-10-3 00:00:00');                
        controller.logsMassDelete(); 
        controller.getStartDate = Date.valueOf('2020-09-30 00:00:00');
        controller.getEndDate = Date.valueOf('2030-10-3 00:00:00');                
        controller.logsMassDelete(); 
        
        controller.getEndDate = Date.valueOf('2020-09-30 00:00:00');
        controller.getStartDate = Date.valueOf('2020-10-3 00:00:00');                
        controller.logsMassDelete(); 
        
        controller.getEndDate = Date.valueOf('2020-09-30 00:00:00');
        controller.getStartDate = Date.valueOf('2020-10-10 00:00:00');                
        controller.logsMassDelete(); 
        
        controller.getStartDate = null;
        controller.getEndDate = null;                
        controller.logsMassDelete(); 
        
        controller.getStartDate = Date.valueOf('2020-09-30 00:00:00');
        controller.getEndDate = null;                
        controller.logsMassDelete();
        
        controller.getStartDate = null;
        controller.getEndDate = Date.valueOf('2020-10-3 00:00:00');                
        controller.logsMassDelete();
        controller.deleteConfirmation();
        
        controller.logsListTodelete = lstLogs;
        
        controller.deleteConfirmation();
        controller.navToListView();
        
        controller.hideDateRange();
        controller.closePopup();
        controller.showPopup();
        controller.incrementCounter();
        controller.getCount();
        
        lstLogs = testInsertLogs();
        DELETE lstLogs[0];
        controller.getStartDate = Date.valueOf('2020-09-30 00:00:00');
        controller.getEndDate = Date.valueOf('2020-10-5 00:00:00');                
        controller.logsMassDelete(); 
        
        lstLogs = testInsertLogs();        
        controller.getStartDate = Date.valueOf('2020-09-30 00:00:00');
        controller.getEndDate = Date.valueOf('2020-10-5 00:00:00');                
        controller.logsMassDelete();         
        Test.stopTest();                
    }
    
    //test integration Mapping referred mapping contract deletion
    public static testmethod void testMappingContractDeleteWithIntegrationMapping()
    {
        Test.startTest();
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Delete Contract' , 
                                                                                                      Active__c = false, 
                                                                                                      Source_Datastore__c = 'Salesforce',
                                                                                                      Target_Datastore__c = 'SAP' , 
                                                                                                      End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');
        INSERT testMappingContract;
        
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Delete Contract Rule' , Rule_Order__c = 1 , Source_Object__c='Account',
                                                                                              Target_Object__c= 'SAP Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);
        INSERT testContractRules;
        
        Integration_Mapping__c testIntegrationMapping = new Integration_Mapping__c(Name = 'Account Delete Mapping' , 
                                                                                                               Source_Datastore__c = 'SAP',
                                                                                                               Target_Datastore__c = 'Salesforce',
                                                                                                               Source_Object__c = 'Account',
                                                                                                               Target_Object__c = 'SAP Account',
                                                                                                               Button__c= 'Test',
                                                                                                               Contract_Rule__c = 'Delete Contract Rule', 
                                                                                                               Mapping_Contract__c = 'Delete Contract');
        INSERT testIntegrationMapping;
        try {
            DELETE testMappingContract;
        }catch(Exception e) {
            Boolean expectedExceptionThrown =  e.getMessage().contains('Script-thrown exception') ? true : false;
            System.assertEquals(expectedExceptionThrown, false);
            
            try {
                DELETE testContractRules;
            }catch(Exception ex) {
                Boolean expectedExceptionThrown1 =  ex.getMessage().contains('Script-thrown exception') ? true : false;
                System.assertEquals(expectedExceptionThrown1, false);
            }
        }
        Test.stopTest();	
    }
    
    public static testmethod void testMappingRulesTransformations()
    {           
        //system.debug('In testMappingRulesTransformations');
        Test.startTest();        
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'Salesforce',
                                                                                                      Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');
        INSERT testMappingContract;
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='Account',
                                                                                              Target_Object__c= 'SAP Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);
        INSERT testContractRules;  
        
        List<Mapping_Rule__c> mappingRuleList = new List<Mapping_Rule__c>();
        // 0 - Direct transformation types
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', 
                                                              Transformation_Value__c = 'Id', 
                                                              Target_Field__c = 'SalesforceId',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true, 
                                                              Contract_Rule__c = testContractRules.Id));        
        // 1 - Direct transformation types
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', 
                                                              Transformation_Value__c = 'Name', 
                                                              Target_Field__c = 'ItemName',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id));        
        // 2 - Default transformation types
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Default', 
                                                              Transformation_Value__c = 'https://login.salesforce.com', 
                                                              Target_Field__c = 'DisplayUrl',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id));        
        // 3 - Text Area Split transformation types
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Text Area Split', 
                                                              Transformation_Value__c = '<Description*<1*( 1 : *8*13* : )>*<2*( 2 : *8*13* : )>*<3*( 3 : *8*13* : )>*<4*( 4 : *8*13* : )>>', 
                                                              Target_Field__c = 'Description',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FieldName":"Description","TextAreaSplitList":[{"lineno":1,"linenoError":"","preValue":"( 1 : ","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":" : )"},{"lineno":2,"linenoError":"","preValue":"( 2 : ","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":" : )"},{"lineno":3,"linenoError":"","preValue":"( 3 : ","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":" : )"},{"lineno":4,"linenoError":"","preValue":"( 4 : ","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":" : )"}]}}'));                
        // 4 - Text Split transformation types
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Text Split', 
                                                              Transformation_Value__c = '<ProductCode*Code:(*2*5*)>', 
                                                              Target_Field__c = 'ProductCode',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FieldName":"ProductCode","PreValue":"Code:(","PostValue":")","StartPosition":"2","EndPosition":"5"}'));        
        // 5 - If Else transformation types
        mappingRuleList.add(new Mapping_Rule__c(Name = 'If-Else', 
                                                              Transformation_Value__c = 'IF{("IsActive" EQUALS "true") AND ("IsDeleted" EQUALS "false") AND ("Name" CONTAINS  "Test")}  THEN{("Active")} ELSE{("Inactive")}', 
                                                              Target_Field__c = 'IsActive',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FilterConditions":[[{"No":1,"andCondition":true,"orCondition":false,"customCondition":false,"customConditionError":"","opencustom":false,"customformula":"NOT(1AND(2OR3))","field":"IsActive","fieldpresent":true,"fieldtype":"Text","operator":"EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"true","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"Active","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":2,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"IsDeleted","fieldpresent":true,"fieldtype":"Text","operator":"EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"false","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":3,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Name","fieldpresent":true,"fieldtype":"Text","operator":"CONTAINS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Test","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"}]],"MappingObjectField":"undefined","ElseValue":"Inactive#Direct","ReturnType":"Text"}"}'));        
        // 6 - If Else transformation types
        mappingRuleList.add(new Mapping_Rule__c(Name = 'If-Else', 
                                                              Transformation_Value__c = 'IF{("IsActive" EQUALS "true") OR ("IsDeleted" EQUALS "false") OR ("Name" CONTAINS  "Test")}  THEN{("Active")} ELSE{("Inactive")}', 
                                                              Target_Field__c = 'IsActive',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FilterConditions":[[{"No":1,"andCondition":false,"orCondition":true,"customCondition":false,"customConditionError":"","opencustom":false,"customformula":"NOT(1AND(2OR3))","field":"IsActive","fieldpresent":true,"fieldtype":"Text","operator":"EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"true","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"Active","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":2,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"IsDeleted","fieldpresent":true,"fieldtype":"Text","operator":"EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"false","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":3,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Name","fieldpresent":true,"fieldtype":"Text","operator":"CONTAINS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Test","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"}]],"MappingObjectField":"undefined","ElseValue":"Inactive#Direct","ReturnType":"Text"}"}'));        
        // 7 - If Else transformation types
        mappingRuleList.add(new Mapping_Rule__c(Name = 'If-Else', 
                                                              Transformation_Value__c = 'IF{NOT(("IsActive" EQUALS  "true")AND(("IsDeleted" EQUALS  "false")OR("Name" CONTAINS  "Test")} THEN{("Active")} ELSE{("Inactive")}', 
                                                              Target_Field__c = 'IsActive',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FilterConditions":[[{"No":1,"andCondition":false,"orCondition":false,"customCondition":true,"customConditionError":"","opencustom":true,"customformula":"NOT(1AND(2OR3))","field":"IsActive","fieldpresent":true,"fieldtype":"Text","operator":"EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"true","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"Active","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":2,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"IsDeleted","fieldpresent":true,"fieldtype":"Text","operator":"EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"false","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":3,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Name","fieldpresent":true,"fieldtype":"Text","operator":"CONTAINS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Test","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"}]],"MappingObjectField":"undefined","ElseValue":"Inactive#Direct","ReturnType":"Text"}"}'));        
        
        // 8 - If Else transformation types
        mappingRuleList.add(new Mapping_Rule__c(Name = 'If-Else', 
                                                              Transformation_Value__c = 'IF{NOT(("IsActive" EQUALS  "true")AND(("Description" CONTAINS  "Product")OR("ProductCode" ENDS WITH  "01")} THEN{("Active")} ELSE{("Inactive")}', 
                                                              Target_Field__c = 'IsActive',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FilterConditions":[[{"No":1,"andCondition":false,"orCondition":false,"customCondition":true,"customConditionError":"","opencustom":true,"customformula":"NOT(1AND(2OR3))","field":"IsActive","fieldpresent":true,"fieldtype":"Text","operator":"EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"true","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"Active","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":2,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Description","fieldpresent":true,"fieldtype":"Text","operator":"CONTAINS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Product","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":3,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"ProductCode","fieldpresent":true,"fieldtype":"Text","operator":"ENDS WITH","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"01","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":4,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"QuantityUnitOfMeasure","fieldpresent":true,"fieldtype":"Text","operator":"GREATER THAN","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"02","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":5,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"QuantityUnitOfMeasure","fieldpresent":true,"fieldtype":"Text","operator":"GREATER THAN EQUAL","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"03","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":6,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Name","fieldpresent":true,"fieldtype":"Text","operator":"IS NULL","type":"Boolean","isNullOperator":true,"isTypepresent":true,"isString":false,"isNumber":false,"isBoolean":true,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"False","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":7,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Name","fieldpresent":true,"fieldtype":"Text","operator":"STARTS WITH","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Test","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"}]],"MappingObjectField":"undefined","ElseValue":"Inactive#Direct","ReturnType":"Text"}"}'));        
        // 9 - If Else transformation types
        mappingRuleList.add(new Mapping_Rule__c(Name = 'If-Else', 
                                                              Transformation_Value__c = 'IF{NOT(NOT(("Name" EQUALS  "Test product")AND(("Description" CONTAINS  "Product")OR("ProductCode" ENDS WITH  "01")))AND(NOT(("QuantityUnitOfMeasure" GREATER THAN  "02"))OR("ProductCode" ENDS WITH  "01")} THEN{("Active")} ELSE{("Inactive")}', 
                                                              Target_Field__c = 'IsActive',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FilterConditions":[[{"No":1,"andCondition":false,"orCondition":false,"customCondition":true,"customConditionError":"","opencustom":true,"customformula":"NOT(NOT(1AND(2OR3))AND(NOT(4)OR3))","field":"Name","fieldpresent":true,"fieldtype":"Text","operator":"EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Test product","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"Active","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":2,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Description","fieldpresent":true,"fieldtype":"Text","operator":"CONTAINS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Product","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":3,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"ProductCode","fieldpresent":true,"fieldtype":"Text","operator":"ENDS WITH","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"01","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":4,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"QuantityUnitOfMeasure","fieldpresent":true,"fieldtype":"Text","operator":"GREATER THAN","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"02","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":5,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"QuantityUnitOfMeasure","fieldpresent":true,"fieldtype":"Text","operator":"GREATER THAN EQUAL","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"03","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":6,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Name","fieldpresent":true,"fieldtype":"Text","operator":"IS NULL","type":"Boolean","isNullOperator":true,"isTypepresent":true,"isString":false,"isNumber":false,"isBoolean":true,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"False","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":7,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Name","fieldpresent":true,"fieldtype":"Text","operator":"STARTS WITH","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Test","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":8,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Name","fieldpresent":true,"fieldtype":"Text","operator":"NOT EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Test order","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":9,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"QuantityUnitOfMeasure","fieldpresent":true,"fieldtype":"Text","operator":"IS NULL","type":"Boolean","isNullOperator":true,"isTypepresent":true,"isString":false,"isNumber":false,"isBoolean":true,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"True","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"}]],"MappingObjectField":"undefined","ElseValue":"Inactive#Direct","ReturnType":"Text"}'));        
        
        // 10 - Object Reference transformation types
        /*mappingRuleList.add(new Mapping_Rule__c(Name = 'Object Reference', 
                                                              Transformation_Value__c = 'Object of (Opportunity) Fields (Opportunity.Account.Name) Filter Condition (Opportunity.IsActive Equals true, Opportunity.Name Contains Test)', 
                                                              Target_Field__c = 'Brand__c',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"DisplayValue":"Object of (Opportunity) Fields (Opportunity.Name) Filter Condition (Opportunity.IsActive Equals true, Opportunity.Name Contains Test) ","Object":"Opportunity","LookupField":"Opportunity.Account.Name","FilterType":"AND","FilterConditions":[{"Field":"Opportunity.Account.Name","FieldError":"","isFieldDisabled":false,"FieldDataType":"string","Operator":"Equals","OperatorSymbol":"","OperatorError":"","isOperatorDisabled":false,"Type":"direct","TypeError":"","isTypeDisabled":false,"Value":"test","ValueError":"","isValueDisabled":false,"isOperatorError":""},{"Field":"Opportunity.Account.Name","FieldError":"","isFieldDisabled":false,"FieldDataType":"string","Operator":"Contains","OperatorSymbol":"","OperatorError":"","isOperatorDisabled":false,"Type":"direct","TypeError":"","isTypeDisabled":false,"Value":"test","ValueError":"","isValueDisabled":false,"isOperatorError":""}],"CustomValue":""}'));        
        
        // 11 - Object Reference transformation types
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Object Reference', 
                                                              Transformation_Value__c = 'Object of (Opportunity) Fields (Opportunity.Account.Name) Filter Condition (Opportunity.IsActive Equals true, Opportunity.Name Contains Test)', 
                                                              Target_Field__c = 'Brand__c',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"DisplayValue":"Object of (Opportunity) Fields (Opportunity.Account.Name) Filter Condition (Opportunity.IsActive Equals true, Opportunity.Name Contains Test) ","Object":"Opportunity","LookupField":"Opportunity.Account.Name","FilterType":"OR","FilterConditions":[{"Field":"Opportunity.Account.Name","FieldError":"","isFieldDisabled":false,"FieldDataType":"string","Operator":"Equals","OperatorSymbol":"","OperatorError":"","isOperatorDisabled":false,"Type":"direct","TypeError":"","isTypeDisabled":false,"Value":"test","ValueError":"","isValueDisabled":false,"isOperatorError":""},{"Field":"Opportunity.Account.Name","FieldError":"","isFieldDisabled":false,"FieldDataType":"string","Operator":"Contains","OperatorSymbol":"","OperatorError":"","isOperatorDisabled":false,"Type":"direct","TypeError":"","isTypeDisabled":false,"Value":"test","ValueError":"","isValueDisabled":false,"isOperatorError":""}],"CustomValue":""}'));        
      
        // 12 - Object Reference transformation types
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Object Reference', 
                                                              Transformation_Value__c = 'Object of (Opportunity) Fields (Opportunity.Name) Filter Condition (Opportunity.IsActive Equals Opportunity.IsActive, Opportunity.Name Contains Test)', 
                                                              Target_Field__c = 'Brand__c',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"DisplayValue":"Object of (Opportunity) Fields (Opportunity.Name) Filter Condition (Opportunity.IsActive Equals Opportunity.IsActive, Opportunity.Name Contains Test) ","Object":"Opportunity","LookupField":"Opportunity.Account.Name","FilterType":"CUSTOM","FilterConditions":[{"Field":"Opportunity.Account.Name","FieldError":"","isFieldDisabled":false,"FieldDataType":"string","Operator":"Equals","OperatorSymbol":"","OperatorError":"","isOperatorDisabled":false,"Type":"reference","TypeError":"","isTypeDisabled":false,"Value":"Opportunity.Account.Name","ValueError":"","isValueDisabled":false,"isOperatorError":""},{"Field":"Opportunity.Account.Name","FieldError":"","isFieldDisabled":false,"FieldDataType":"string","Operator":"Contains","OperatorSymbol":"","OperatorError":"","isOperatorDisabled":false,"Type":"reference","TypeError":"","isTypeDisabled":false,"Value":"Opportunity.Account.Name","ValueError":"","isValueDisabled":false,"isOperatorError":""}],"CustomValue":"NOT(1AND2)"}'));        
        
        // 13 - Object Reference transformation types
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Object Reference', 
                                                              Transformation_Value__c = 'Object of (Opportunity) Fields (Opportunity.Name)', 
                                                              Target_Field__c = 'Brand__c',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"DisplayValue":"Object of (Opportunity) Fields (Opportunity.Name) ","Object":"Opportunity","LookupField":"Opportunity.Account.Name","FilterType":"AND","FilterConditions":[],"CustomValue":""}'));        
 
        
        // 14 - Object Reference transformation types
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Object Reference', 
                                                              Transformation_Value__c = 'Object of (Opportunity) Fields (Opportunity.Name ,Id)', 
                                                              Target_Field__c = 'Brand__c',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"DisplayValue":"Object of (Opportunity) Fields (Opportunity.Name ,Id) ","Object":"Opportunity","LookupField":"Opportunity.Account.Name","MappingObjectField":"ItmsGrpNam","ReturnField":"Id","FilterType":"AND","FilterConditions":[],"CustomValue":""}'));        
        
        
        // 15 - Object Reference transformation types
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Object Reference', 
                                                              Transformation_Value__c = 'Object of (Opportunity) Fields (Opportunity.Name ,Id) Filter Condition (Opportunity.Name Contains test)', 
                                                              Target_Field__c = 'Brand__c',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"DisplayValue":"Object of (Opportunity) Fields (Opportunity.Name ,Id) Filter Condition (Opportunity.Name Contains test) ","Object":"Opportunity","LookupField":"Opportunity.Account.Name","MappingObjectField":"ItmsGrpNam","ReturnField":"Id","FilterType":"AND","FilterConditions":[{"Field":"Opportunity.Account.Name","FieldError":"","isFieldDisabled":false,"FieldDataType":"string","Operator":"Contains","OperatorSymbol":"","OperatorError":"","isOperatorDisabled":false,"Type":"direct","TypeError":"","isTypeDisabled":false,"Value":"test","ValueError":"","isValueDisabled":false,"isOperatorError":""}],"CustomValue":""}'));        
        
        
        SFConnectController.saveMappingRules(mappingRuleList);   
        List<Product2> productList = new List<Product2>();
        Brands__c testBrand = new Brands__c(Name = 'Soak');
        Insert testBrand;
        String descriptionData = '';
        descriptionData = 'Line 1 : Test product is specialy made for a premium customer\n';
        descriptionData = 'Line 2 : Test product is specialy made for a premium customer\n';
        descriptionData = 'Line 3 : Test product is specialy made for a premium customer\n';
        descriptionData = 'Line 4 : Test product is specialy made for a premium customer\n';
        descriptionData = 'Line 5 : Test product is specialy made for a premium customer\n';
        descriptionData = 'Line 6 : Test product is specialy made for a premium customer\n';
        Product2 productData = new Product2(Name = 'Test product', 
                                            StockKeepingUnit = 'GC1061',
                                            ProductCode = 'GC1061',
                                            Brand__c = testBrand.Id,
                                            IsActive=true,
                                            Description = descriptionData);
        Insert productData;
        Product2 productData1 = new Product2(Name = 'Test product1', 
                                            StockKeepingUnit = 'GC1062',
                                            ProductCode = 'GC1062',
                                            Brand__c = testBrand.Id,
                                            IsActive=true,
                                            Description = descriptionData);
        
        Product2 productData2 = new Product2(Name = 'Test product2', 
                                            StockKeepingUnit = 'GC1063',
                                            ProductCode = 'GC1063',
                                            Brand__c = testBrand.Id,
                                            IsActive=true,
                                            Description = descriptionData);
        
        Product2 productData3 = new Product2(Name = 'Test product3', 
                                            StockKeepingUnit = 'GC1064',
                                            ProductCode = 'GC1064',
                                            Brand__c = testBrand.Id,
                                            IsActive=true,
                                            Description = descriptionData);
        
        Product2 productData4 = new Product2(Name = 'Test product4', 
                                            StockKeepingUnit = 'GC1065',
                                            ProductCode = 'GC1065',
                                            Brand__c = testBrand.Id,
                                            IsActive=true,
                                            Description = descriptionData);
        
        productList.add(productData1);
        productList.add(productData2);
        productList.add(productData3);
        productList.add(productData4);
        insert productList; 
        Map<String, Object> newProductMap = new Map<String, Object>();
        for(Product2 prod : productList)
        {
          newProductMap.put(prod.Id,prod);  
        }*/
          String descriptionData = '';
        descriptionData = 'Line 1 : Test product is specialy made for a premium customer\n';
        descriptionData = 'Line 2 : Test product is specialy made for a premium customer\n';
        descriptionData = 'Line 3 : Test product is specialy made for a premium customer\n';
        descriptionData = 'Line 4 : Test product is specialy made for a premium customer\n';
        descriptionData = 'Line 5 : Test product is specialy made for a premium customer\n';
        descriptionData = 'Line 6 : Test product is specialy made for a premium customer\n';
        Product2 productData = new Product2(Name = 'Test product', 
                                            StockKeepingUnit = 'GC1061',
                                            ProductCode = 'GC1061',
                                            IsActive=true,
                                            Description = descriptionData);
        Insert productData;
        /*List<Mapping_Rule__c> createMappingRule = MappingRuleTransformations.getMappingRules('Salesforce','SAP', 'Account','SAP Account','','Create');
        List<Mapping_Rule__c> updateMappingRule = MappingRuleTransformations.getMappingRules('Salesforce','SAP', 'Account','SAP Account','','Update');
        List<SObject>  contractRuleList = MappingRuleTransformations.getAllContractRulesSAPtoSF('SAP','Salesforce', 'SAP Account');        
        system.assertNotEquals(createMappingRule.size(), 0);
        system.assertNotEquals(updateMappingRule.size(), 0);
        system.assertEquals(contractRuleList.size(), 0);*/
        
        List<String> objectNameList = new List<String>();
        objectNameList.add('Order');
        //MappingRuleTransformations.getAllRecords(objectNameList);
        
        /*String testDefaultValue = MappingRuleTransformations.getDefaultTransformationValue(productData,mappingRuleList[2]);
        String testDirectValue = MappingRuleTransformations.getDirectTransformationValue(productData,mappingRuleList[1]);
        String testTextAreaSplitValue = MappingRuleTransformations.getTextAreaSplitTransformationValue(productData,mappingRuleList[3]);
        String testTextSplitValue = MappingRuleTransformations.getTextSplitTransformationValue(productData,mappingRuleList[4]);*/
        
        String testIfElseValue1 = MappingRuleTransformations.getIfElseValue(productData,mappingRuleList[5]);
        String testIfElseValue2 = MappingRuleTransformations.getIfElseValue(productData,mappingRuleList[6]);
        String testIfElseValue3 = MappingRuleTransformations.getIfElseValue(productData,mappingRuleList[7]);
        String testIfElseValue4 = MappingRuleTransformations.getIfElseValue(productData,mappingRuleList[8]);
        String testIfElseValue5 = MappingRuleTransformations.getIfElseValue(productData,mappingRuleList[9]); 
        //String testIfElseValue6 = MappingRuleTransformations.getIfElseValue(newProductMap,mappingRuleList[5]); 
        
        MappingRuleTransformations.transformText('ProductCode',mappingRuleList[4].Transformation_Value__c);
        MappingRuleTransformations.transformTextArea('Description',mappingRuleList[3].Transformation_Value__c);
        
        /*getRecordDataList
        getChildDataList
        getAllFieldsOfObject
        getBulkDataList*/
        //create Account
        Account a = new Account(Name='test');
        insert a;
        Opportunity oppData = new Opportunity(Name='test',CloseDate=system.today()+2, AccountId=a.Id, StageName='Prospecting');
        insert oppData;
        
        /*String testObjectRefValue1 = MappingRuleTransformations.getObjectReferenceValueFromSF(oppData,mappingRuleList[10]);        
        String testObjectRefValue2 = MappingRuleTransformations.getObjectReferenceValueFromSF(oppData,mappingRuleList[11]);        
        String testObjectRefValue3 = MappingRuleTransformations.getObjectReferenceValueFromSF(oppData,mappingRuleList[12]);        
        String testObjectRefValue4= MappingRuleTransformations.getObjectReferenceValueFromSF(oppData,mappingRuleList[13]);*/        
        
        //objectNameList = MappingRuleTransformations.getObjectNames(mappingRuleList);        
        //objectNameList.add('Brand__c');
        //MappingRuleTransformations.getAllRecords(objectNameList);
        
        String productRequestData = getRequestString('Product2');
        
        List<Map<String, Object>> productMapList = new List<Map<String, Object>>();
        // Deserialize received JSON data 
        Object reqJsonData = (Object)JSON.deserializeUntyped(productRequestData);                
        String req_datetime = (String)((Map<String, Object>)reqJsonData).get('req_datetime');                        
        Map<String, Object> dataNode = (Map<String, Object>)((Map<String, Object>)reqJsonData).get('data');                        
        String products = '';
        for(String data : dataNode.keySet())
        {
            products = JSON.serialize(dataNode.get(data));
        }                
        List<Object> productObjectData = (List<Object>)JSON.deserializeUntyped(products);
        for(Object product : productObjectData)
        {         
            Map<String, Object> productMap = (Map<String, Object>)product;
            productMapList.add(productMap);                        
        }
        
        /*String testObjectRefValue5 = MappingRuleTransformations.getObjectReferenceValueFromOtherDatastores(productMapList[0],mappingRuleList[13]);        
        String testObjectRefValue6 = MappingRuleTransformations.getObjectReferenceValueFromOtherDatastores(productMapList[0],mappingRuleList[14]);        
        String testObjectRefValue7 = MappingRuleTransformations.getObjectReferenceValueFromOtherDatastores(productMapList[0],mappingRuleList[15]);*/        
        
        /*system.assertEquals(testDirectValue, 'Test product');
        system.assertEquals(testDefaultValue, 'https://login.salesforce.com');
        system.assertNotEquals(testTextAreaSplitValue, '');
        system.assertNotEquals(testTextSplitValue, '');*/
        system.assertNotEquals(testIfElseValue1, '');
        system.assertNotEquals(testIfElseValue2, '');
        system.assertNotEquals(testIfElseValue3, '');
        //system.assertNotEquals(testIfElseValue1, '');
        
        Test.stopTest();   
    }
    public static String getRequestString(String objectName)
    {        
        //system.debug('In getRequestString');  
        Datetime NOW  = system.now();
        JSONGenerator gen = JSON.createGenerator(true);                        
        gen.writeStartObject();
        gen.writeStringField('Object' , objectName );  
        gen.writeStringField('req_datetime',String.valueOf(NOW));  
        gen.writeFieldName('data');            
        gen.writeStartObject();
        gen.writeFieldName(objectName);
        gen.writeStartArray();    
        
        gen.writeStartObject();        
        if(objectName == 'Product2'){
            gen.writeStringField('ItemCode', 'TYUFinalOCT111020202test');
            gen.writeStringField('ItemName', 'test  live');
            gen.writeStringField('ItmsGrpNam', 'Soak');
            gen.writeNullField('U_Sup'); 
            gen.writeStringField('U_Region', 'Region 1');
            gen.writeNullField('U_Range'); 
            gen.writeStringField('U_Pkging', 'Bottle');
            gen.writeNullField('U_Closure');            
        }
        gen.writeEndObject();       
        
        gen.writeEndArray();
        gen.writeEndObject();
        gen.writeEndObject();
        
        String jsonData = gen.getAsString();     
        //system.debug('gen ::: ' + jsonData);        
        return jsonData;
    }
    public static testmethod void jobsTrigger()
    {           
        //system.debug('In testGetChildDataList');
        Test.startTest();
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'Salesforce', Job_Type__c = 'Jobs',
                                                                                                      Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com'); 
        Insert testMappingContract;
        Job__c testJob = new Job__c (Name = 'TestJob', Mapping_Contract__c = testMappingContract.Id, Job_Type__c = 'Insert', Type__c = 'POST', Active__c = true);
        Insert testJob;
        //Delete testJob;
        testJob.Name = 'TestJob1';
        Database.SaveResult updateResult = Database.update(testJob, false);
        Database.DeleteResult deleteResult = Database.delete(testJob, false);
    	Test.stopTest();
        
        System.assert(!updateResult.isSuccess());
        System.assert(updateResult.getErrors().size() > 0);
        System.assertEquals('Job cannot be Updated. Deactivate and Try again.', updateResult.getErrors()[0].getMessage());
        
        System.assert(!deleteResult.isSuccess());
        System.assert(deleteResult.getErrors().size() > 0);
        System.assertEquals('Active job can\'t be deleted. Deactivate and Try again.', deleteResult.getErrors()[0].getMessage());
    }
     public static testmethod void getNewData()
    {           
        //system.debug('In testGetChildDataList');
        Test.startTest();
        MappingRuleTransformations maptrans = new MappingRuleTransformations();
        set<Id> recIds = new set<Id>();
         Account a1 = new Account(Name='test1');
        insert a1;
        Opportunity oppData1 = new Opportunity(Name='test1',CloseDate=system.today()+2, AccountId=a1.Id, StageName='Prospecting');
        insert oppData1;
        Opportunity oppData2 = new Opportunity(Name='test2',CloseDate=system.today()+2, AccountId=a1.Id, StageName='Prospecting');
        insert oppData2;
        recIds.add(oppData1.Id);
        recIds.add(oppData2.Id);
        maptrans.getDataList('Opportunity',oppData1.Id);
        maptrans.getRecordDataList('Opportunity','StageName',oppData1.Id,false,'');
        maptrans.getChildDataList('AccountId','Opportunity',a1.Id);
        maptrans.getBulkDataList('Opportunity',recIds);
        Test.stopTest();
    }
}