@isTest
public class JobSchedulerAndSyncRecordJob_Test {
    
    public static testmethod void testCreateJob()
    {
        Test.startTest();
        Mapping_Contract__c testMappingContract = new Mapping_Contract__c(Name = 'Account Mapping Contract' , Active__c = true, Source_Datastore__c = 'Salesforce',
                                                                                                      Job_Type__c='Jobs',Named_Credential__c='OAuth_2_0',Target_Datastore__c = 'SAP' , End_point_URL__c = 'https://sfconnector-dev-ed.lightning.force.com');
        INSERT testMappingContract;
        Job__c createScheduledJobs = new Job__c(Name='Test DK',Type__c ='POST', Description__c='To Run a Job',Active__c=true,Mapping_Contract__c=testMappingContract.Id,
                                                                           Cron_Expression__c='0 0 0 * * ?');
        
        INSERT createScheduledJobs;
        JobScheduler.scheduleJob(createScheduledJobs.Id);
        JobScheduler.getJob(createScheduledJobs.Id);
        JobScheduler.deleteJob(createScheduledJobs.Id);
        Test.stopTest();
    }  
    public static testmethod void testSyncRecordJobSAPtoSF()
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
        SyncRecordJob.executeContractRule(testMappingContract.Id,'POST');
        Test.stopTest();
    }
    public static testmethod void testSyncRecordJobSFtoSAP()
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
         mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'Name', Target_Field__c = 'SAP Name',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'Id', Target_Field__c = 'SAPId',
                                                              Rule_Order__c = 1,Mandatory__c = false, Contract_Rule__c = testContractRules.Id));
        mappingRuleList.add(new Mapping_Rule__c(Name = 'Direct', Transformation_Value__c = 'Description', Target_Field__c = 'SAP Description',
                                                              Rule_Order__c = 1,Mandatory__c = true, Contract_Rule__c = testContractRules.Id));
        INSERT mappingRuleList;
        SyncRecordJob.executeContractRule(testMappingContract.Id,'POST');
        Test.stopTest();
    }
     public static testmethod void testSyncRecordJobSFtoSAPWithoutContractRules()
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
       
        
        SyncRecordJob.executeContractRule(testMappingContract.Id,'POST');
        Test.stopTest();
    }
   
   
}