/*********************************************************************************************************************************************************************************************************
Company 					: HTC Global Services
Developer 					: Arunkumar V K
Description					: To create logs
Related Aura Components   	: 
Related Apex Controllers  	: 
Created Date		  		: May 06, 2021
Last Modified Date	  		: May 07, 2021
**********************************************************************************************************************************************************************************************************/
public class CreateLogs {
    
    public static String SFrecordId = '';
    Public static MappingRuleTransformations mappingTransformationObj = new MappingRuleTransformations();
    Public static boolean isResponseSuccess = false;
    
    public static void createSFToExternalLog(Datetime req_dateTime, String requestJSONData, String responseJSONData,String opertaion,String Obj,Boolean isSuccess, String SFrecordId,String sourceDatastore,String targetDatastore)
    {
        System.debug('In Createlog createSFToExternalLog' );               
        system.debug('SFrecordId ::: ' + SFrecordId);
        createLogs(req_dateTime, requestJSONData, responseJSONData, opertaion, Obj, isSuccess ,sourceDatastore,targetDatastore,SFrecordId);
        System.debug('after insert log');
    }   
    /*public static void createExternalToSFLog(Datetime req_dateTime, String requestJSONData, String responseJSONData,String opertaion,String Obj,Boolean isSuccess)
    {
        System.debug('In Createlog createSAP ToSFLog');        
        //Log_2__c log2 = new Log_2__c(Request_Datetime__c = req_dateTime,Request_Data__c = requestJSONData,Operation__c = opertaion,Object__c = Obj,Response_Data__c = responseJSONData,Status__c = isSuccess);
        //INSERT log2;  
        SFrecordId = getRecId(requestJSONData);      
        system.debug('SFrecordId ::: ' + SFrecordId);
        // Uncomment when needed... 
        createLogs(req_dateTime, requestJSONData, responseJSONData, opertaion, Obj, isSuccess,'SAP','Salesforce',SFrecordId);
        System.debug('after insert log');
    }*/
    
    Public static void createLogs(Datetime req_dateTime, String requestJSONData, String responseJSONData,
                                  String opertaion,String Obj,Boolean isSuccess,String sourceDatastore, String targetDatastore, String recId)
    {
        if(opertaion=='POST'){
            opertaion='CREATE';
        }
        if(opertaion=='PATCH'){
            opertaion='UPDATE';
        }
        if(opertaion=='PUT'){
            opertaion='UPSERT';
        }
        System.debug('In createLogs');  
        system.debug('recId ::: ' + recId);
        Integration_log__c log = new Integration_log__c(Request_Datetime__c = req_dateTime,Request_Data__c = requestJSONData,Operation__c = opertaion, 
                                                        Object__c = Obj,Response_Data__c = responseJSONData,IsSuccess__c = isSuccess, 
                                                        Source_Datastore__c = sourceDatastore, Target_Datastore__c = targetDatastore , Record_Id_Split__c = recId, Response_Date_time__c = system.now());
        
        INSERT log;
        
        //List<Integration_log__c> logs = mappingTransformationObj.getDataList('Integration_log__c', log.Id);
        
        
        System.debug('after insert log '+log.Id);
    }
    
    
	
    
	
    public static List<Map<String, Object>> getDataMap(Map<String, Object> dataNode){
        List<Map<String, Object>> MapList = new List<Map<String, Object>>();
        String obj = '';
        for(String data : dataNode.keySet())
        {
            obj = JSON.serialize(dataNode.get(data));
        }
        //system.debug(' obj ::: ' + obj);
        List<Object> ObjectData = (List<Object>)JSON.deserializeUntyped(obj);
        //system.debug(' ObjectData ::: ' + ObjectData);
        for(Object o : ObjectData)
        {         
            Map<String, Object> objMap = (Map<String, Object>)o;
            MapList.add(objMap);
        }
        return MapList;
    }
    
    public static String getRecId(String reqData){
        Object resJsonData = (Object)JSON.deserializeUntyped(reqData);
        Map<String, Object> dataNode = (Map<String, Object>)((Map<String, Object>)resJsonData).get('data'); 
        system.debug('dataNode ::: ' + dataNode); 
        List<Map<String, Object>> MapList = CreateLogs.getDataMap(dataNode);
        String ResponseBody = '';
        String recId = '';
        for(Map<String, Object> objectMap : MapList)
        {
            recId = String.valueOf(objectMap.get('SalesforceId'));
            ResponseBody = Json.serialize(objectMap);
        }
        return recId;
    }
    
    public static String getUniqueId(String reqData , String uniqueKey){
       // system.debug('request 114 ::: ' + reqData);
        Object resJsonData = (Object)JSON.deserializeUntyped(reqData);
        //system.debug('request after');
        Map<String, Object> dataNode = (Map<String, Object>)((Map<String, Object>)resJsonData).get('data'); 
        system.debug('dataNode ::: ' + dataNode); 
        List<Map<String, Object>> MapList = CreateLogs.getDataMap(dataNode);
        String ResponseBody = '';
        String recId = '';
        for(Map<String, Object> objectMap : MapList)
        {
            recId = String.valueOf(objectMap.get(uniqueKey));
            ResponseBody = Json.serialize(objectMap);
        }
        return recId;
    }
    
    
    public static String getUniquieValChild(String reqData , String uniqueKey , String childObjName){
        Object resJsonData = (Object)JSON.deserializeUntyped(reqData);
        Map<String, Object> dataNode = (Map<String, Object>)((Map<String, Object>)resJsonData).get('data'); 
        system.debug('dataNode ::: ' + dataNode); 
        List<Map<String, Object>> MapList = CreateLogs.getDataMap(dataNode);
        
        return null;
    }
    
    public static String responseLogCreation(String responseJson){
       // List<Map<String, Object>> MapList = new List<Map<String, Object>>();
            Object resJsonData = (Object)JSON.deserializeUntyped(responseJson);String res_datetime = (String)((Map<String, Object>)resJsonData).get('res_datetime');
            String Status = (String)((Map<String, Object>)resJsonData).get('Status');String message = (String)((Map<String, Object>)resJsonData).get('message');
        	system.debug('zzzzz Status ::: ' + Status );
            Map<String, Object> dataNode = (Map<String, Object>)((Map<String, Object>)resJsonData).get('data'); 
        	system.debug('zzzzz dataNode ::: ' + dataNode);
        	List<Map<String, Object>> MapList = getDataMap(dataNode);String ResponseBody = '';String recId = '';
            for(Map<String, Object> objectMap : MapList){recId = String.valueOf(objectMap.get('SalesforceId'));ResponseBody = Json.serialize(objectMap);}
            system.debug('zzzzz recId ::: ' + recId);
            
            if(Status == '200'){
                system.debug('zzzzz Success');
                Integration_log__c log = [select Id,Name,Request_Datetime__c,Response_Data__c, Object__c, lastmodifiedDate, IsSuccess__c, Source_Datastore__c,Target_Datastore__c , Record_Id_Split__c from Integration_log__c where Record_Id_Split__c = :recId ORDER BY lastmodifiedDate DESC limit 1 ];
                   if(log != null){log.Response_Data__c = ResponseBody;log.IsSuccess__c = true;log.Response_Date_time__c = system.now();update log;isResponseSuccess = true;       } 
            }else{
                Integration_log__c log = [select Id,Name,Request_Datetime__c,Response_Data__c, Object__c, lastmodifiedDate, IsSuccess__c, Source_Datastore__c,Target_Datastore__c , Record_Id_Split__c from Integration_log__c where Record_Id_Split__c = :recId ORDER BY lastmodifiedDate DESC limit 1 ];
                system.debug('zzzzz log :: ' + log);
                if(log != null){log.Response_Data__c = ResponseBody;log.IsSuccess__c = false;log.Response_Date_time__c = system.now();update log;isResponseSuccess = false;      
                  
                    
               } 
            }
        System.debug('zzzzz response over');
        return recId;
    }
}