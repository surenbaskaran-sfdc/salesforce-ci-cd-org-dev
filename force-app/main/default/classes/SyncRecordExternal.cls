/*********************************************************************************************************************************************************************************************************
Company 					: HTC Global Services
Developer 					: Arunkumar V K
Description					: record sync external
Related Aura Components   	:  
Related Apex Controllers  	: 
Created Date		  		: June 09, 2021
Last Modified Date	  		: June 09, 2021
**********************************************************************************************************************************************************************************************************/

@RestResource(urlMapping='/RecordSync/*')
global with sharing class SyncRecordExternal {
    
    global static string requestData = '' , responseData = '', type = '';
    global static List<sObject> recordsList = new List<sObject>();
    global static RestRequest req = RestContext.request;
    global static RestResponse res = Restcontext.response;    
    global static Boolean isSuccess = true;
    global static String mappingContractName;
    global static String targetObject;
    global static String externalId;
    
    
    @HttpPost
    global static void syncExternalRecordInsert() 
    {
        SyncRecordExternal.syncRecordHandler('Create');
        
    }
    @HttpPatch
    global static void syncExternalRecordUpdate() 
    {
        SyncRecordExternal.syncRecordHandler('Update');
        
    }
    @HttpPut
    global static void syncExternalRecordUpsert() 
    {
        SyncRecordExternal.syncRecordHandler('Upsert');
        
    }
    
    global static void syncRecordHandler(String type) 
    {
        requestData = (req.requestBody).tostring();   
        try {            
            Object reqJsonData = (Object)JSON.deserializeUntyped(requestData);
            String req_datetime = (String)((Map<String, Object>)reqJsonData).get('req_datetime');
            mappingContractName = (String)((Map<String, Object>)reqJsonData).get('Mapping Contract');
           
            targetObject = (String)((Map<String, Object>)reqJsonData).get('Object');
            //fetch Mapping Contract
            List<Mapping_Contract__c> mappingContractList=[Select Name,Source_Datastore__c,Target_Datastore__c,Source_Object__c FROM Mapping_Contract__c WHERE Name=:mappingContractName];
            if(mappingContractList.size()>0){
                if(mappingContractList[0].Target_Datastore__c=='Salesforce'){
                    List<Contract_Rule__c> contractRuleList = MappingContractDetails.getAllContractRules(mappingContractList[0].Source_Datastore__c,mappingContractList[0].Target_Datastore__c, targetObject);        
                    if(contractRuleList.size()>0){
                        externalId=contractRuleList[0].External_ID__c;
                        Map<String, Object> resData = (Map<String, Object>)((Map<String, Object>)reqJsonData).get('data'); 
                        // Deserialize received JSONdata and get accounts list
                        System.debug('requestData'+requestData);
                        recordsList = DeserializeObject.getsObjectList(requestData , type,mappingContractList[0],contractRuleList[0],targetObject,externalId);
                        
                        System.debug('recordsList'+recordsList);
                        if(DeserializeObject.recordsWithMandatoryFields.size()>0)
                        {                    
                            Boolean isSuccess = false;
                            String uniqueVal = CreateLogs.getUniqueId(requestData, externalId);
                            responseData = GenerateResponse.errorResponse(targetObject,externalId, uniqueVal, String.join(DeserializeObject.recordsWithMandatoryFields, ',') , 'Invalid Request');
                            CreateLogs.createSFToExternalLog(system.now(), requestData, responseData, type, targetObject,isSuccess,'',mappingContractList[0].Source_Datastore__c,mappingContractList[0].Target_Datastore__c);
                            //CreateLogs.createSAPToSFLog(system.now(), requestData, responseData,DeserializeObject.dmlOperationType , 'Account', isSuccess);
                        }
                        else
                        {
                            
                            // Set save point for rollback
                            Savepoint sp = Database.setSavepoint();
                            Database.SaveResult[] insertupdateResultList ;
                            
                            Database.upsertResult [] upsertResultList ;
                            // Insert/Update/Upsert deserialized data
                            if(type=='Create'){
                                insertupdateResultList = Database.insert(recordsList, false);
                            }
                            if(type=='Update'){
                                insertupdateResultList = Database.update(recordsList, false);
                            }
                            if(type=='Upsert'){
                                upsertResultList = Database.upsert(recordsList, false);
                            }
                            if(type=='Create'||type=='Update'){                        
                                // Check all insert / update
                                for(Database.saveResult ur :insertupdateResultList)
                                    if(!ur.isSuccess())
                                    isSuccess = false;
                            }
                            if(type=='Upsert'){
                                // Check all created or updated correctly
                                for(Database.upsertResult ur :upsertResultList)
                                    if(!ur.isSuccess())
                                    isSuccess = false;
                            }
                            // If any error accured rollback the DML operations
                            if(isSuccess == false)
                                Database.rollback(sp);        
                            List<String> recordIdList = new List<String>();
                            for( sObject rec : recordsList)
                            {
                                if(rec.Id != null)
                                    recordIdList.add(rec.Id);
                            }
                            System.debug('recordIdList'+recordIdList);
                            if(recordIdList.size()>0){
                                System.debug('inn~~~~~~~~~~~~~~~');
                                MappingRuleTransformations mapObj = new MappingRuleTransformations();
                                String fieldsStr = mapObj.getAllFieldsOfObject(targetObject);            
                                String query = 'SELECT ' + fieldsStr + ' FROM '+targetObject+' WHERE Id IN : recordIdList';
                                
                                recordsList = Database.query(query);
                                system.debug(' recordsList For Int Null :::' + recordsList);
                            }
                            
                            
                            System.debug('isSuccess ::: ' + isSuccess);
                            // Generate Response for create/ update products 
                            if(type=='Create'||type=='Update'){  
                                responseData = GenerateResponse.createupdateResponse(insertupdateResultList, recordsList,  isSuccess, targetObject,contractRuleList[0].Id);
                            }
                            if(type=='Upsert'){  
                                responseData = GenerateResponse.upsertResponse(upsertResultList, recordsList,  isSuccess, targetObject,contractRuleList[0].Id);
                            }
                            
                            
                            // Create Log
                            CreateLogs.createSFToExternalLog(system.now(), requestData, responseData, type, targetObject,isSuccess,recordsList[0].Id,mappingContractList[0].Source_Datastore__c,mappingContractList[0].Target_Datastore__c);
                        }
                    }
                    else{
                        //target datastore is not salesforce
                        responseData ='Internal error : Could not sync with Salesforce - No contract rule found, Please contact your system administrator for more clarity';
                        System.debug('responseData ::: ' + responseData);
                        CreateLogs.createSFToExternalLog(system.now(), requestData, responseData, '', '',false,'',mappingContractList[0].Source_Datastore__c,mappingContractList[0].Target_Datastore__c);
                    }
                }
                else{
                    //target datastore is not salesforce
                    responseData ='Internal error : Could not sync with Salesforce - Target Datastore is not Salesforce, Please contact your system administrator for more clarity';
                    System.debug('responseData ::: ' + responseData);
                    CreateLogs.createSFToExternalLog(system.now(), requestData, responseData,  type, targetObject,false,'',mappingContractList[0].Source_Datastore__c,mappingContractList[0].Target_Datastore__c);
                }
            }
            else{
                //if no mapping contract with name found
                responseData ='Internal error : Could not sync with Salesforce - No Mapping contract with specified name found, Please contact your system administrator for more clarity';
                System.debug('responseData ::: ' + responseData);
                CreateLogs.createSFToExternalLog(system.now(), requestData, responseData, type, targetObject,false,'','','');
            }
            
            
        }catch(Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            String msg = e.getMessage();
            msg = msg.remove('\'');
            responseData = GenerateResponse.errorResponse(targetObject, externalId, CreateLogs.getUniqueId(requestData, externalId), msg, 'Invalid Request');
            
             CreateLogs.createSFToExternalLog(system.now(), requestData, responseData, type, targetObject,false,'','','');
            //CreateLogs.createSAPToSFLog(system.now(), requestData, responseData,DeserializeObject.dmlOperationType , 'Account', false);
        }
        res.responseBody = Blob.valueOf(responseData);
        
    }

}