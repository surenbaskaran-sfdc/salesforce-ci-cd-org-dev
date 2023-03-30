@isTest(SeeAllData = false)
public class SyncRecordExternal_Test {
 public static testmethod void testSyncRecordExternal()
    {
        System.debug('In testProductSync');
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGeneratorIntegration());
        //Test.startTest();        
        createMappingDetails();
        String jsonString =   '{"Object" : "Account","Mapping Contract":"Account Mapping Contract","req_datetime" : "2022-03-09 17:27:47","data" : { "Account" : [ {'+
        '"SAP Name" : "Integration Test PB","SAP Description" : "CAESF00153", "SAPId" : null } ]}}';
        
        RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();             
        req.requestURI = '/services/apexrest/RecordSync/';
        req.httpMethod = 'POST';
        req.requestBody  = Blob.valueof(jsonString);
        RestContext.request = req;
        RestContext.response= res;
        SyncRecordExternal.syncExternalRecordInsert();         
        
        //Object resJsonData = (Object)JSON.deserializeUntyped((res.responseBody).toString());
        //String status = (String)((Map<String, Object>)resJsonData).get('status'); 
        //System.assertEquals('200', status);                        
       // Test.stopTest(); 
    }
     public static testmethod void testSyncRecordExternalMandatoryFieldError()
    {
        System.debug('In testProductSync');
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGeneratorIntegration());
        //Test.startTest();        
        createMappingDetails();
        String jsonString =   '{"Object" : "Account","Mapping Contract":"Account Mapping Contract","req_datetime" : "2022-03-09 17:27:47","data" : { "Account" : [ {'+
        '"SAP Name" : "Integration Test PB", "SAPId" : null } ]}}';
        
        RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();             
        req.requestURI = '/services/apexrest/RecordSync/';
        req.httpMethod = 'POST';
        req.requestBody  = Blob.valueof(jsonString);
        RestContext.request = req;
        RestContext.response= res;
        SyncRecordExternal.syncExternalRecordInsert();         
        SyncRecordExternal.syncExternalRecordUpdate();
        SyncRecordExternal.syncExternalRecordUpsert();
        //Object resJsonData = (Object)JSON.deserializeUntyped((res.responseBody).toString());
        //String status = (String)((Map<String, Object>)resJsonData).get('status'); 
        //System.assertEquals('200', status);                        
       // Test.stopTest(); 
    }
    public static testmethod void testSyncRecordExternalNoMappingContract()
    {
        System.debug('In testProductSync');
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGeneratorIntegration());
        //Test.startTest();        
        createMappingDetails();
        String jsonString =   '{"Object" : "Account","req_datetime" : "2022-03-09 17:27:47","data" : { "Account" : [ {'+
        '"SAP Name" : "Integration Test PB","SAP Description" : "CAESF00153", "SAPId" : null } ]}}';
        
        RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();             
        req.requestURI = '/services/apexrest/RecordSync/';
        req.httpMethod = 'PATCH';
        req.requestBody  = Blob.valueof(jsonString);
        RestContext.request = req;
        RestContext.response= res;
        SyncRecordExternal.syncExternalRecordUpdate();         
        
        //Object resJsonData = (Object)JSON.deserializeUntyped((res.responseBody).toString());
        //String status = (String)((Map<String, Object>)resJsonData).get('status'); 
        //System.assertEquals('200', status);                        
       // Test.stopTest(); 
    }
    public static testmethod void testSyncRecordExternalMappingContractError()
    {
        System.debug('In testProductSync');
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGeneratorIntegration());
        //Test.startTest();        
        createMappingDetails1();
        String jsonString =   '{"Object" : "Account","Mapping Contract":"Account Mapping Contract","req_datetime" : "2022-03-09 17:27:47","data" : { "Account" : [ {'+
        '"SAP Name" : "Integration Test PB","SAP Description" : "CAESF00153", "SAPId" : null } ]}}';
        
        RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();             
        req.requestURI = '/services/apexrest/RecordSync/';
        req.httpMethod = 'POST';
        req.requestBody  = Blob.valueof(jsonString);
        RestContext.request = req;
        RestContext.response= res;
        SyncRecordExternal.syncExternalRecordInsert();         
        
        //Object resJsonData = (Object)JSON.deserializeUntyped((res.responseBody).toString());
        //String status = (String)((Map<String, Object>)resJsonData).get('status'); 
        //System.assertEquals('200', status);                        
       // Test.stopTest(); 
    }
    public static testmethod void testSyncRecordExternalTargetObjectError()
    {
        System.debug('In testProductSync');
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGeneratorIntegration());
        //Test.startTest();        
        createMappingDetails2();
        String jsonString =   '{"Object" : "Account","Mapping Contract":"Account Mapping Contract","req_datetime" : "2022-03-09 17:27:47","data" : { "Account" : [ {'+
        '"SAP Name" : "Integration Test PB","SAP Description" : "CAESF00153", "SAPId" : null } ]}}';
        
        RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();             
        req.requestURI = '/services/apexrest/RecordSync/';
        req.httpMethod = 'POST';
        req.requestBody  = Blob.valueof(jsonString);
        RestContext.request = req;
        RestContext.response= res;
        SyncRecordExternal.syncExternalRecordInsert();         
        
        //Object resJsonData = (Object)JSON.deserializeUntyped((res.responseBody).toString());
        //String status = (String)((Map<String, Object>)resJsonData).get('status'); 
        //System.assertEquals('200', status);                        
       // Test.stopTest(); 
    }
    /*public static testmethod void testSyncRecordExternalException()
    {
        System.debug('In testProductSync');
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGeneratorIntegration());
        //Test.startTest();        
        createMappingDetails2();
        String jsonString =   '';
        
        RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();             
        req.requestURI = '/services/apexrest/RecordSync/';
        req.httpMethod = 'POST';
        req.requestBody  = Blob.valueof(jsonString);
        RestContext.request = req;
        RestContext.response= res;
        SyncRecordExternal.syncExternalRecordInsert();         
        
        //Object resJsonData = (Object)JSON.deserializeUntyped((res.responseBody).toString());
        //String status = (String)((Map<String, Object>)resJsonData).get('status'); 
        //System.assertEquals('200', status);                        
       // Test.stopTest(); 
    }*/
     public static testmethod void testSyncRecordExternalUpdate()
    {
        System.debug('In testProductSync');
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGeneratorIntegration());
        //Test.startTest();
        Account a = new Account(Name='Integration Test PB');
        insert a;        
        createMappingDetails3();
        String jsonString =   '{"Object" : "Account","Account Mapping Contract":"Account Mapping Contract","req_datetime" : "2022-03-09 17:27:47","data" : { "Account" : [ {'+
            '"SAP Name" : "Integration Test PB","SAP Description" : "CAESF00153", "SalesforceId" : "AB1233" } ]}}';
        
        RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();             
        req.requestURI = '/services/apexrest/RecordSync/';
        req.httpMethod = 'PATCH';
        req.requestBody  = Blob.valueof(jsonString);
        RestContext.request = req;
        RestContext.response= res;
        SyncRecordExternal.syncExternalRecordUpdate();         
        
        //Object resJsonData = (Object)JSON.deserializeUntyped((res.responseBody).toString());
        //String status = (String)((Map<String, Object>)resJsonData).get('status'); 
        //System.assertEquals('200', status);                        
       // Test.stopTest(); 
    }
     public static testmethod void testSyncRecordExternalUpsert()
    {
        System.debug('In testProductSync');
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGeneratorIntegration());
        //Test.startTest();
        Account a = new Account(Name='Integration Test PB');
        insert a;        
        createMappingDetails3();
        String jsonString =   '{"Object" : "Account","Mapping Contract":"Account Mapping Contract","req_datetime" : "2022-03-09 17:27:47","data" : { "Account" : [ {'+
        '"SAP Name" : "Integration Test PB","SAP Description" : "CAESF00153", "SAPId" : "AB1234" } ]}}';
        
        RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();             
        req.requestURI = '/services/apexrest/RecordSync/';
        req.httpMethod = 'PUT';
        req.requestBody  = Blob.valueof(jsonString);
        RestContext.request = req;
        RestContext.response= res;
        SyncRecordExternal.syncExternalRecordUpsert();         
        
        //Object resJsonData = (Object)JSON.deserializeUntyped((res.responseBody).toString());
        //String status = (String)((Map<String, Object>)resJsonData).get('status'); 
        //System.assertEquals('200', status);                        
       // Test.stopTest(); 
    }
    public static testmethod void testSyncRecordExternalTransformations()
    {
        System.debug('In testProductSync');
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGeneratorIntegration());
        //Test.startTest();        
        createMappingDetails4();
        String jsonString =   '{"Object" : "Account","Mapping Contract":"Account Mapping Contract","req_datetime" : "2022-03-09 17:27:47","data" : { "Account" : [ {'+
        '"SAP Name" : "Integration Test PB","SAP Description" : "Test Contract Rule for Text Area Split", "SAP Tradestyle" : "Test Contract Rule for Text Area", "SAP Type" : "Inactive", "SAP Site" : "Test", "SAPId" : null } ]}}';
        
        RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();             
        req.requestURI = '/services/apexrest/RecordSync/';
        req.httpMethod = 'POST';
        req.requestBody  = Blob.valueof(jsonString);
        RestContext.request = req;
        RestContext.response= res;
        SyncRecordExternal.syncExternalRecordInsert();         
        
        //Object resJsonData = (Object)JSON.deserializeUntyped((res.responseBody).toString());
        //String status = (String)((Map<String, Object>)resJsonData).get('status'); 
        //System.assertEquals('200', status);                        
       // Test.stopTest(); 
    }
    public static testmethod void testSyncRecordExternalTransformationsWithConditions()
    {
        System.debug('In testProductSync');
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGeneratorIntegration());
        //Test.startTest();        
        createMappingDetails5();
        String jsonString =   '{"Object" : "Account","Mapping Contract":"Account Mapping Contract","req_datetime" : "2022-03-09 17:27:47","data" : { "Account" : [ {'+
        '"SAP Name" : "Integration Test PB","SAP Description" : "Test Contract Rule for Text Area Split", "SAP Tradestyle" : "Test Contract Rule for Text Area", "SAP Type" : "Inactive", "SAP Site" : "Test", "SAPId" : null } ]}}';
        
        RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();             
        req.requestURI = '/services/apexrest/RecordSync/';
        req.httpMethod = 'POST';
        req.requestBody  = Blob.valueof(jsonString);
        RestContext.request = req;
        RestContext.response= res;
        SyncRecordExternal.syncExternalRecordInsert();         
        
        //Object resJsonData = (Object)JSON.deserializeUntyped((res.responseBody).toString());
        //String status = (String)((Map<String, Object>)resJsonData).get('status'); 
        //System.assertEquals('200', status);                        
       // Test.stopTest(); 
    }
        public static testmethod void testSyncRecordExternalTransformationsWithConditions1()
    {
        System.debug('In testProductSync');
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGeneratorIntegration());
        //Test.startTest();        
        createMappingDetails5();
        String jsonString =   '{"Object" : "Account","Mapping Contract":"Account Mapping Contract","req_datetime" : "2022-03-09 17:27:47","data" : { "Account" : [ {'+
        '"SAP Name" : "Integration Test PB","SAP Description" : "Test Contract Rule for Text Area Split", "SAP Tradestyle" : "Test Contract Rule for Text Area", "SAP Type" : "Active", "SAP Site" : "Test", "SAPId" : null } ]}}';
        
        RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();             
        req.requestURI = '/services/apexrest/RecordSync/';
        req.httpMethod = 'POST';
        req.requestBody  = Blob.valueof(jsonString);
        RestContext.request = req;
        RestContext.response= res;
        SyncRecordExternal.syncExternalRecordInsert();         
        
        //Object resJsonData = (Object)JSON.deserializeUntyped((res.responseBody).toString());
        //String status = (String)((Map<String, Object>)resJsonData).get('status'); 
        //System.assertEquals('200', status);                        
       // Test.stopTest(); 
    }
    public static void createMappingDetails()
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
        
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'SAP',
                                                                                                      Target_Datastore__c = 'Salesforce' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');
        INSERT testMappingContract;
       
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='SAP Account',
                                                                                              Target_Object__c= 'Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);
        INSERT testContractRules;
        
        List<Mapping_Rule__c> mappingRuleList = new List<Mapping_Rule__c>();
         mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'SAP Name', Target_Field__c = 'Name',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'SAPId', Target_Field__c = 'Id',
                                                              Rule_Order__c = 1,Mandatory__c = false, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'SAP Description', Target_Field__c = 'Description',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));
        INSERT mappingRuleList;
        
        Test.stopTest();
    }
    public static void createMappingDetails1()
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
        
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'SAP',
                                                                                                      Target_Datastore__c = 'Salesforce' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');
        INSERT testMappingContract;
       
        /*Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='SAP Account',
                                                                                              Target_Object__c= 'Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);
        INSERT testContractRules;
        
        List<Mapping_Rule__c> mappingRuleList = new List<Mapping_Rule__c>();
         mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'SAP Name', Target_Field__c = 'Name',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'SAPId', Target_Field__c = 'Id',
                                                              Rule_Order__c = 1,Mandatory__c = false, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'SAP Description', Target_Field__c = 'Description',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));
        INSERT mappingRuleList;*/
        
        Test.stopTest();
    }
     public static void createMappingDetails2()
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
       
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='SAP Account',
                                                                                              Target_Object__c= 'Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);
        INSERT testContractRules;
        
        List<Mapping_Rule__c> mappingRuleList = new List<Mapping_Rule__c>();
         mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'SAP Name', Target_Field__c = 'Name',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'SAPId', Target_Field__c = 'Id',
                                                              Rule_Order__c = 1,Mandatory__c = false, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'SAP Description', Target_Field__c = 'Description',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));
        INSERT mappingRuleList;
        
        Test.stopTest();
    }
    public static void createMappingDetails3()
    {
        Test.startTest();
        Mapping_Object__c testMappingObject = new Mapping_Object__c(Name = 'Account' , Active__c = true, Datastore__c = 'Salesforce');
        INSERT testMappingObject;
        Mapping_Object_Field__c testMappingObjectFields = new Mapping_Object_Field__c(Name = 'SAP_ID__c' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        INSERT testMappingObjectFields; 
        Mapping_Object_Field__c testMappingObjectFields1 = new Mapping_Object_Field__c(Name = 'Description' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        INSERT testMappingObjectFields1;
        Mapping_Object_Field__c testMappingObjectFields2 = new Mapping_Object_Field__c(Name = 'ParentId' , Datatype__c = 'REFERENCE' ,Description__c = 'Test',Object__c = testMappingObject.Id);
        
        Mapping_Object__c testSAPMappingObject = new Mapping_Object__c(Name = 'SAP Account' , Active__c = true, Datastore__c = 'SAP');
        INSERT testSAPMappingObject;
        Mapping_Object_Field__c testSAPMappingObjectFields = new Mapping_Object_Field__c(Name = 'SalesforceId' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);
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
       
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='SAP Account',
                                                                                              Target_Object__c= 'Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);
        INSERT testContractRules;
        
        List<Mapping_Rule__c> mappingRuleList = new List<Mapping_Rule__c>();
         mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'SAP Name', Target_Field__c = 'Name',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'SalesforceId', Target_Field__c = 'SAP_ID__c',
                                                              Rule_Order__c = 1,Mandatory__c = false, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'SAP Description', Target_Field__c = 'Description',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));
        INSERT mappingRuleList;
        
        Test.stopTest();
    }
    public static void createMappingDetails4()
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
        Mapping_Object_Field__c testSAPMappingObjectFields2 = new Mapping_Object_Field__c(Name = 'SAPParentId' , Datatype__c = 'REFERENCE' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);
		Mapping_Object_Field__c testSAPMappingObjectFields3 = new Mapping_Object_Field__c(Name = 'SAP Tradestyle' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);        
        Mapping_Object_Field__c testSAPMappingObjectFields4 = new Mapping_Object_Field__c(Name = 'SAP Site' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);        
        Mapping_Object_Field__c testSAPMappingObjectFields5 = new Mapping_Object_Field__c(Name = 'SAP Type' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);        
        
        List<Mapping_Object_Field__c> mappingObjectFields = new List<Mapping_Object_Field__c>();
        List<Mapping_Object_Field__c> deleteObjectFields = new List<Mapping_Object_Field__c>();
        mappingObjectFields.add(testSAPMappingObjectFields2);
        
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'SAP',
                                                                                                      Target_Datastore__c = 'Salesforce' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');
        INSERT testMappingContract;
       
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='SAP Account',
                                                                                              Target_Object__c= 'Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);
        INSERT testContractRules;
        
        List<Mapping_Rule__c> mappingRuleList = new List<Mapping_Rule__c>();
         mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'SAP Name', Target_Field__c = 'Name',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'SAPId', Target_Field__c = 'Id',
                                                              Rule_Order__c = 1,Mandatory__c = false, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Text Area Split', 
                                                              Transformation_Value__c = '<SAP Description*<1**8*13*>*<2**8*13*>*<3**8*13*>*<4**8*13*>>', 
                                                              Source_Object_Fields__c = '["SAP Description"]',
                                                              Target_Field__c = 'Description',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = false,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FieldName":"SAP Description","TextAreaSplitList":[{"lineno":1,"linenoError":"","preValue":"","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":""},{"lineno":2,"linenoError":"","preValue":"","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":""},{"lineno":3,"linenoError":"","preValue":"","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":""},{"lineno":4,"linenoError":"","preValue":"","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":""}]}'));                
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Text Split', 
                                                              Transformation_Value__c = '<SAP Tradestyle**2*5*>',
                                                              Source_Object_Fields__c = '["SAP Tradestyle"]',
                                                              Target_Field__c = 'Tradestyle',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = false,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FieldName":"SAP Tradestyle","PreValue":"","PostValue":"","StartPosition":"2","EndPosition":"5"}'));        
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Default', 
                                                              Transformation_Value__c = 'https://login.salesforce.com', 
                                                              Source_Object_Fields__c = '["SAP Site"]',
                                                              Target_Field__c = 'Site',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'If-Else', 
                                                              Transformation_Value__c = 'IF{("SAP Type" EQUALS  "Active")}  THEN{("Customer")} ELSE IF{("SAP Type" EQUALS  "Inactive")}  THEN{("Prospect")} ELSE{("")}', 
                                                              Source_Object_Fields__c = '["undefined","SAP Type"]',
                                                              Target_Field__c = 'Type',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = false,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FilterConditions":[[{"No":1,"andCondition":true,"orCondition":false,"customCondition":false,"customConditionError":"","opencustom":false,"customformula":"","field":"SAP Type","fieldpresent":true,"fieldtype":"Text","operator":"EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Active","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"Customer","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"}],[{"No":1,"andCondition":true,"orCondition":false,"customCondition":false,"customConditionError":"","opencustom":false,"customformula":"","field":"SAP Type","fieldpresent":true,"fieldtype":"Text","operator":"EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Inactive","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"Prospect","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"}]],"MappingObjectField":"undefined","ElseValue":"#Direct","ReturnType":"Text"}'));        
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Object Reference', 
                                                              Transformation_Value__c = 'Object of (Account) Fields (Account.Parent.Id ,Id)',
                                                              Source_Object_Fields__c = '["Parent Account ID","Parent"]',
                                                              Target_Field__c = 'ParentId',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"DisplayValue":"Object of (Account) Fields (Account.Parent.Id ,Id) ","Object":"Account","LookupField":"Account.Parent.Id","MappingObjectField":"Parent Account ID","ReturnField":"Id","FilterType":"AND","FilterConditions":[],"CustomValue":""}'));        
        INSERT mappingRuleList;
        
        Test.stopTest();
    }
    public static void createMappingDetails5()
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
        Mapping_Object_Field__c testSAPMappingObjectFields2 = new Mapping_Object_Field__c(Name = 'SAPParentId' , Datatype__c = 'REFERENCE' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);
		Mapping_Object_Field__c testSAPMappingObjectFields3 = new Mapping_Object_Field__c(Name = 'SAP Tradestyle' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);        
        Mapping_Object_Field__c testSAPMappingObjectFields4 = new Mapping_Object_Field__c(Name = 'SAP Site' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);        
        Mapping_Object_Field__c testSAPMappingObjectFields5 = new Mapping_Object_Field__c(Name = 'SAP Type' , Datatype__c = 'Text' ,Description__c = 'Test',Object__c = testSAPMappingObject.Id);        
        
        List<Mapping_Object_Field__c> mappingObjectFields = new List<Mapping_Object_Field__c>();
        List<Mapping_Object_Field__c> deleteObjectFields = new List<Mapping_Object_Field__c>();
        mappingObjectFields.add(testSAPMappingObjectFields2);
        
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'SAP',
                                                                                                      Target_Datastore__c = 'Salesforce' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');
        INSERT testMappingContract;
       
        Contract_Rule__c testContractRules = new Contract_Rule__c(Name = 'Account Contract Rule' , Rule_Order__c = 1 , Source_Object__c='SAP Account',
                                                                                              Target_Object__c= 'Account', External_Id__c = 'Id',Mapping_Contract__c = testMappingContract.Id);
        INSERT testContractRules;
        
        List<Mapping_Rule__c> mappingRuleList = new List<Mapping_Rule__c>();
         mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'SAP Name', Target_Field__c = 'Name',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'SAPId', Target_Field__c = 'Id',
                                                              Rule_Order__c = 1,Mandatory__c = false, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Text Area Split', 
                                                              Transformation_Value__c = '<SAP Description*<1**8*13*>*<2**8*13*>*<3**8*13*>*<4**8*13*>>', 
                                                              Source_Object_Fields__c = '["SAP Description"]',
                                                              Target_Field__c = 'Description',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = false,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FieldName":"SAP Description","TextAreaSplitList":[{"lineno":1,"linenoError":"","preValue":"","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":""},{"lineno":2,"linenoError":"","preValue":"","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":""},{"lineno":3,"linenoError":"","preValue":"","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":""},{"lineno":4,"linenoError":"","preValue":"","startPosition":8,"startPositionError":"","startPositionErrorMsg":"","endPosition":13,"endPositionError":"","endPositionErrorMsg":"","postValue":""}]}'));                
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Text Split', 
                                                              Transformation_Value__c = '<SAP Tradestyle**2*5*>',
                                                              Source_Object_Fields__c = '["SAP Tradestyle"]',
                                                              Target_Field__c = 'Tradestyle',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = false,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FieldName":"SAP Tradestyle","PreValue":"","PostValue":"","StartPosition":"2","EndPosition":"5"}'));        
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Default', 
                                                              Transformation_Value__c = 'https://login.salesforce.com', 
                                                              Source_Object_Fields__c = '["SAP Site"]',
                                                              Target_Field__c = 'Site',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'If-Else', 
                                                              Transformation_Value__c = 'IF{("SAP Type" EQUALS "Active") OR ("SAP Type" CONTAINS "Active") OR ("SAP Type" STARTS WITH "Active") OR ("SAP Type" ENDS WITH "Active") OR ("Website" IS NULL  "False")}  THEN{("Customer")} ELSE IF{("SAP Type" EQUALS  "Inactive")AND(("SAP Type" CONTAINS  "Inactive")OR("SAP Type" STARTS WITH  "Inactive")OR("Description" IS NULL  "True")OR("SAP Type" GREATER THAN  "0")OR("SAP Type" LESSER THAN  "10")OR("SAP Type" LESSER THAN EQUAL  "10")OR("SAP Type" GREATER THAN EQUAL  "0")} THEN{("Prospect")} ELSE{("")}', 
                                                              Source_Object_Fields__c = '["undefined","SAP Type"]',
                                                              Target_Field__c = 'Type',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = false,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"FilterConditions":[[{"No":1,"andCondition":false,"orCondition":true,"customCondition":false,"customConditionError":"","opencustom":false,"customformula":"","field":"SAP Type","fieldpresent":true,"fieldtype":"Text","operator":"EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Active","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"Customer","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":2,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"SAP Type","fieldpresent":true,"fieldtype":"Text","operator":"CONTAINS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Active","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":3,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"SAP Type","fieldpresent":true,"fieldtype":"Text","operator":"STARTS WITH","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Active","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":4,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"SAP Type","fieldpresent":true,"fieldtype":"Text","operator":"ENDS WITH","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Active","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":5,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Website","fieldpresent":true,"fieldtype":"Text","operator":"IS NULL","type":"Boolean","isNullOperator":true,"isTypepresent":true,"isString":false,"isNumber":false,"isBoolean":true,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"False","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"}],[{"No":1,"andCondition":false,"orCondition":false,"customCondition":true,"customConditionError":"","opencustom":true,"customformula":"1AND(2OR3OR4OR5OR6OR7OR8)","field":"SAP Type","fieldpresent":true,"fieldtype":"Text","operator":"EQUALS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Inactive","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"Prospect","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":2,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"SAP Type","fieldpresent":true,"fieldtype":"Text","operator":"CONTAINS","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Inactive","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":3,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"SAP Type","fieldpresent":true,"fieldtype":"Text","operator":"STARTS WITH","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"Inactive","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":4,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"Description","fieldpresent":true,"fieldtype":"Text","operator":"IS NULL","type":"Boolean","isNullOperator":true,"isTypepresent":true,"isString":false,"isNumber":false,"isBoolean":true,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"True","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":5,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"SAP Type","fieldpresent":true,"fieldtype":"Text","operator":"GREATER THAN","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"0","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":6,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"SAP Type","fieldpresent":true,"fieldtype":"Text","operator":"LESSER THAN","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"10","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":7,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"SAP Type","fieldpresent":true,"fieldtype":"Text","operator":"LESSER THAN EQUAL","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"10","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"},{"No":8,"andCondition":true,"orCondition":"","customCondition":"","customConditionError":"","opencustom":false,"customformula":"","field":"SAP Type","fieldpresent":true,"fieldtype":"Text","operator":"GREATER THAN EQUAL","type":"Direct","isNullOperator":false,"isTypepresent":true,"isString":true,"isNumber":false,"isBoolean":false,"isCurrency":false,"isDate":false,"isDatetime":false,"isTime":false,"isVariables":false,"isReference":false,"value":"0","thenoptionvalue":"Direct","thenDirect":true,"thenvalue":"","thenReferece":false,"thenvariables":false,"fieldError":"","operatorError":"","typeError":"","valueError":"","thenError":"label-hidden","thenValueError":"label-hidden"}]],"MappingObjectField":"undefined","ElseValue":"#Direct","ReturnType":"Text"}"}"}}'));        
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Object Reference', 
                                                              Transformation_Value__c = 'Object of (Account) Fields (Account.Parent.Id ,Id) Filter Condition (Account.Name Contains Test, Account.Name Starts with Account.Description)',
                                                              Source_Object_Fields__c = '["Parent Account ID","Parent"]',
                                                              Target_Field__c = 'ParentId',
                                                              Rule_Order__c = 1,
                                                              Mandatory__c = true,
                                                              Allowed_for_update__c = true, 
                                                              Contract_Rule__c = testContractRules.Id,
                                                              Dev_value__c = '{"DisplayValue":"Object of (Account) Fields (Account.Parent.Id ,Id) Filter Condition (Account.Name Contains Test, Account.Name Starts with Account.Description) ","Object":"Account","LookupField":"Account.Parent.Id","MappingObjectField":"Parent Account ID","ReturnField":"Id","FilterType":"OR","FilterConditions":[{"Field":"Account.Name","FieldError":"","isFieldDisabled":false,"FieldDataType":"string","Operator":"Contains","OperatorSymbol":"","OperatorError":"","isOperatorDisabled":false,"Type":"direct","TypeError":"","isTypeDisabled":false,"Value":"Test","ValueError":"","isValueDisabled":false,"isOperatorError":""},{"Field":"Account.Name","FieldError":"","isFieldDisabled":false,"FieldDataType":"string","Operator":"Starts with","OperatorSymbol":"LIKE","OperatorError":"","isOperatorDisabled":false,"Type":"reference","TypeError":"","isTypeDisabled":false,"Value":"Account.Description","ValueError":"","isValueDisabled":false,"isOperatorError":""}],"CustomValue":""}'));        
        INSERT mappingRuleList;
        
        Test.stopTest();
    }
}