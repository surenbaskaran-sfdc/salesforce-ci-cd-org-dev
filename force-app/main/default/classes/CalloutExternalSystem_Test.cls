@isTest
public class CalloutExternalSystem_Test {

 public static testmethod void testExecutedataUpload()
    {   

         Account a = new Account(Name='test');
        insert a;
        Opportunity oppData = new Opportunity(Name='test',CloseDate=system.today()+2, AccountId=a.Id, StageName='Prospecting');
        insert oppData;
        
        Test.startTest();    
        
        Account instance = new Account();
		instance.id = a.Id;
		instance.name = a.Name;
		String myJSON = JSON.serialize(instance);
        CalloutExternalSystem.dataUpload(myJSON,'POST','https://sfconnector-dev-ed.lightning.force.com','');
         CalloutExternalSystem.dataUpload(myJSON,'POST','','');
      Test.stopTest();     
}
}