/**********************************************************************
Created By: HTC Global Services
Created Date: 
Last Modified: 
Modified By:

Description: Genrate JSON response for sobjects using results from database

***********************************************************************/
public class GenerateResponse
{
    Public static Datetime NOW = system.now();
    public static JSONGenerator gen = JSON.createGenerator(true);
    public static String response = '';    
    
    // Create Success/Failure response
    public Static void createStatusResponse(Boolean isSuccess)
    {
        
        if(isSuccess) 
        {
            gen.writeStringField('status', '200');
            gen.writeStringField('res_datetime', String.valueOf(NOW));
            gen.writeStringField('message', 'Request Successful');
        } 
        else
        {
            gen.writeStringField('status', '400');gen.writeStringField('res_datetime', String.valueOf(NOW));gen.writeStringField('message', 'Invalid request');
        } 
    }
    
    // Create error response for create/update operations
    public static String createupdateResponse(Database.saveResult [] insertupdateResultList, List<SObject> dataList, Boolean isSuccess, String ObjectName,String contractRuleId) 
    {
        //fetch response rule for current contract rule
        List<Response_Rule__c> responseRuleList=[SELECT Id,Contract_Rule__c,Dev_value__c,Source_Object_Fields__c,
                                                               Target_Field__c FROM Response_Rule__c WHERE Contract_Rule__c=:contractRuleId];
        
        System.debug('In createUpsertResponse');
        gen.writeStartObject();
        createStatusResponse(isSuccess);
        
        //if(!isSuccess)
        //{
        // Add data node in JSON Response
        gen.writeFieldName('data');
        gen.writeStartObject();
        
        // Add object node in JSON response
        gen.writeFieldName(ObjectName);
        gen.writeStartArray();
        
        // Loop insertupdateResultList, and generate upsert response.
        for (Integer i = 0; i < insertupdateResultList.size(); i ++) 
        {
            System.debug('insertupdateResultList ::: ' + insertupdateResultList [i]);
            
            Database.saveResult ur = insertupdateResultList [i];
            System.debug('ur ::: ' + ur);
            SObject data = dataList[i];  
            System.debug('data ::: ' + data);
            System.debug('ur.isSuccess() ::: ' + ur.isSuccess());
            if(ur.isSuccess()) 
            {
                gen.writeStartObject();
                
                Boolean isIdFound=false;
                for(Integer j=0;j<responseRuleList.size();j++){
                    String targetField=responseRuleList[j].Target_Field__c;String tempsourceField=responseRuleList[j].Source_Object_Fields__c;
                    String sourceField=tempsourceField;
                    if(tempsourceField.startsWith('["') && tempsourceField.endsWith('"]')){sourceField=tempsourceField.substringBetween('"');
                    }
                    if((sourceField).toLowerCase()=='id'){isIdFound=true;
                    }
                    if(String.valueOf(data.get(sourceField)) != null)
                    {
                        gen.writeStringField(targetField, String.valueOf(data.get(sourceField)));                        
                    }
                    else
                    {
                        gen.writeNullField(targetField); 
                    }
                }
                if(!isIdFound){
                    gen.writeStringField('SalesforceId', String.valueOf(data.get('Id')));    
                }
                
                gen.writeEndObject();
            }                
            if(!ur.isSuccess()) 
            {
                System.debug('In not success ::: ');
                gen.writeStartObject();
                System.debug('ur.getErrors() ::: ' + ur.getErrors());
                
                for(Database.Error err :ur.getErrors()) 
                {
                    
                    System.debug('error code ::: ' + err.getStatusCode() + ', Message :::' + err.getMessage());
                    
                    for(Integer k=0;k<responseRuleList.size();k++){
                        String targetField=responseRuleList[k].Target_Field__c;String tempsourceField=responseRuleList[k].Source_Object_Fields__c;
                    String sourceField=tempsourceField;
                    if(tempsourceField.startsWith('["') && tempsourceField.endsWith('"]')){
                        sourceField=tempsourceField.substringBetween('"');
                    }
                        if(String.valueOf(data.get(sourceField)) != null)
                        {
                            gen.writeStringField(targetField, String.valueOf(data.get(sourceField)));                        
                        }
                        else
                        {
                            gen.writeNullField(targetField); 
                        }
                    }
                    String msg = err.getMessage();msg = msg.remove('\'');gen.writeStringField('error', err.getStatusCode() + ' ' + msg);                        
                }
                gen.writeEndObject();
            }
        }
        gen.writeEndArray();
        gen.writeEndObject();
        //}
        gen.writeEndObject();
        
        // Convert JSON data to string
        response = gen.getAsString();
        
        System.debug('response ::: ' + response);
        return response;
    }
    
    // Create error response for create/update operations
    public static String upsertResponse(Database.upsertResult [] upsertResultList, List<SObject> dataList, Boolean isSuccess, String ObjectName,String contractRuleId) 
    {
        //fetch response rule for current contract rule
        List<Response_Rule__c> responseRuleList=[SELECT Id,Contract_Rule__c,Dev_value__c,Source_Object_Fields__c,
                                                               Target_Field__c FROM Response_Rule__c WHERE Contract_Rule__c=:contractRuleId];
        
        System.debug('In createUpsertResponse');
        gen.writeStartObject();createStatusResponse(isSuccess);
        
        //if(!isSuccess)
        //{
        // Add data node in JSON Response
        gen.writeFieldName('data');gen.writeStartObject();
        
        // Add object node in JSON response
        gen.writeFieldName(ObjectName);gen.writeStartArray();
        
        // Loop upsertResultList, and generate upsert response.
        for (Integer i = 0; i < upsertResultList.size(); i ++) 
        {
            System.debug('upsertResultList ::: ' + upsertResultList [i]);
            
            Database.upsertResult ur = upsertResultList [i];
            System.debug('ur ::: ' + ur);
            SObject data = dataList[i];  
            System.debug('data ::: ' + data);
            System.debug('ur.isSuccess() ::: ' + ur.isSuccess());
            if(ur.isSuccess()) 
            {
                gen.writeStartObject();
                System.debug('Salesforce_Id ::: ' + String.valueOf(data.get('Id')));
                
                Boolean isIdFound=false;
                for(Integer j=0;j<responseRuleList.size();j++){
                    String targetField=responseRuleList[j].Target_Field__c;String tempsourceField=responseRuleList[j].Source_Object_Fields__c;
                    String sourceField=tempsourceField;
                    if(tempsourceField.startsWith('["') && tempsourceField.endsWith('"]')){
                        sourceField=tempsourceField.substringBetween('"');
                    }
                    if((sourceField).toLowerCase()=='id'){
                        isIdFound=true;
                    }
                    if(String.valueOf(data.get(sourceField)) != null)
                    {
                        gen.writeStringField(targetField, String.valueOf(data.get(sourceField)));                        
                    }
                    else
                    {
                        gen.writeNullField(targetField); 
                    }
                }
                if(!isIdFound){
                    gen.writeStringField('SalesforceId', String.valueOf(data.get('Id')));    
                }
                
                gen.writeEndObject();
            }                
            if(!ur.isSuccess()) 
            {
                System.debug('In not success ::: ');
                gen.writeStartObject();
                System.debug('ur.getErrors() ::: ' + ur.getErrors());
                
                for(Database.Error err :ur.getErrors()) 
                {
                    
                    System.debug('error code ::: ' + err.getStatusCode() + ', Message :::' + err.getMessage());
                    
                    for(Integer k=0;k<responseRuleList.size();k++){
                        String targetField=responseRuleList[k].Target_Field__c;String tempsourceField=responseRuleList[k].Source_Object_Fields__c;
                    String sourceField=tempsourceField;
                    if(tempsourceField.startsWith('["') && tempsourceField.endsWith('"]')){
                        sourceField=tempsourceField.substringBetween('"');
                    }
                        if(String.valueOf(data.get(sourceField)) != null)
                        {
                            gen.writeStringField(targetField, String.valueOf(data.get(sourceField)));                        
                        }
                        else
                        {
                            gen.writeNullField(targetField); 
                        }
                    }
                    String msg = err.getMessage();msg = msg.remove('\'');gen.writeStringField('error', err.getStatusCode() + ' ' + msg);                        
                }
                gen.writeEndObject();
            }
        }
        gen.writeEndArray();gen.writeEndObject();
        //}
        gen.writeEndObject();
        
        // Convert JSON data to string
        response = gen.getAsString();
        
        System.debug('response ::: ' + response);
        return response;
    }    
    
    public static String createMandatoryMissingResponse(Boolean isSuccess, String ObjectName, List<String> recordsWithMandatoryFields,List<String> recordsWithUniqueList)
    {
        System.debug('In recordsWithUniqueList '+recordsWithUniqueList);
        System.debug('In recordsWithMandatoryFields');
        gen.writeStartObject();createStatusResponse(isSuccess);
        
        // Add data node in JSON Response
        gen.writeFieldName('data');gen.writeStartObject();
        
        // Add object node in JSON response
        gen.writeFieldName(ObjectName);gen.writeStartArray();            
        
        // Loop upsertResultList, and generate upsert response.
        for (Integer i = 0; i < recordsWithMandatoryFields.size(); i ++) 
        {
            gen.writeStartObject();
            if(recordsWithUniqueList[i] != null)
            {
                gen.writeStringField('SalesforceId', recordsWithUniqueList[i]);
            }
            else
            {
                gen.writeNullField('SalesforceId'); //modified   
                
            }
            gen.writeStringField('Error',recordsWithMandatoryFields[i]);gen.writeEndObject();
        }
        
        gen.writeEndArray();gen.writeEndObject();gen.writeEndObject();
        
        // Convert JSON data to string
        response = gen.getAsString();
        
        System.debug('response ::: ' + response);
        return response;
    }
    
    
    
    public static String errorResponse(String ObjectName, String uniqueKey, String uniqueVal, String errorMesg , String message){
        System.debug('In errorResponse');
        
        System.debug('ObjectName ::: ' + ObjectName);
        System.debug('uniqueKey ::: ' + uniqueKey);
        System.debug('uniqueVal ::: ' + uniqueVal);
        System.debug('errorMesg ::: ' + errorMesg);
        System.debug('message ::: ' + message);                
        
        JSONGenerator genErr = JSON.createGenerator(true);
        //genErr.writeStringField('Status', '400');        
        
        genErr.writeStartObject();
        
        genErr.writeStringField('status', '400');        
        genErr.writeStringField('req_datetime',String.valueOf(system.now()));        
        genErr.writeStringField('message', message);  
        
        genErr.writeFieldName('data');    		
        
        genErr.writeStartObject(); 
        
        genErr.writeFieldName(ObjectName);    
        
        genErr.writeStartArray();      
        
        genErr.writeStartObject();  
        
        if(uniqueVal != null)
        {
            genErr.writeStringField(uniqueKey, uniqueVal);
        }
        else
        {
            //genErr.writeStringField(uniqueKey, ''); //modified    
            genErr.writeNullField(uniqueKey);         
        }
        genErr.writeStringField('error',errorMesg);		       
        
        genErr.writeEndObject();
        
        genErr.writeEndArray();
        
        genErr.writeEndObject();
        
        genErr.writeEndObject();
        
        system.debug(genErr.getAsString());
        return genErr.getAsString();
        
        
        //return 'Error found';
    }
}