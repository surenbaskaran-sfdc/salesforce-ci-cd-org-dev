@isTest(SeeAllData = false)
public class Createlogs_Test {
 public static testmethod void testCreateLogData()
    {
      String jsonString =   '{"Object" : "Account","Mapping Contract":"Account Mapping Contract","req_datetime" : "2022-03-09 17:27:47","data" : { "Account" : [ {'+
        '"SAP Name" : "Integration Test PB","SAP Description" : "CAESF00153", "SAPId" : null } ]}}';
  
        String ResponseData ='{"status" : "400","req_datetime" : "2022-04-25 00:30:15","message" : "Mapping Rules Not Found","data" : {"Account" : [ {"SalesforceId" : "","error" : "No Mapping Rules available for this combination. Please Contact Adminstrator"'+
            '} ]}';
        CreateLogs.getUniqueId(jsonString,'test');
        CreateLogs.getUniquieValChild(jsonString,'test','Account');
        CreateLogs.getRecId(jsonString);
        //CreateLogs.responseLogCreation(jsonString);
}
}