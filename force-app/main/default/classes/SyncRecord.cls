/*********************************************************************************************************************************************************************************************************
Company 					: HTC Global Services
Developer 					: Arunkumar V K
Description					: Initiate record sync
Related Aura Components   	: 
Related Apex Controllers  	: 
Created Date		  		: May 05, 2021
Last Modified Date	  		: May 13, 2021
**********************************************************************************************************************************************************************************************************/


global class SyncRecord {
    @AuraEnabled
    global static void executeContractRule(String objectName,String recId){
        try{
            //check whether a record with the particular record id exist or not
            MappingRuleTransformations obj = new MappingRuleTransformations();
            List<SObject> recordList = obj.getDataList(objectName, recId);
            if(recordList.size() > 0){
                //find the mapping contract mapped with the object
                List<Integration_Mapping__c> integrationMapping=[SELECT Id,Mapping_Contract__c FROM Integration_Mapping__c WHERE Source_Object__c=:objectName]; 
                if(integrationMapping.size()>0){
                    Mapping_Contract__c mappingContractData=[Select Name,Source_Datastore__c,Target_Datastore__c FROM Mapping_Contract__c WHERE Name=:integrationMapping[0].Mapping_Contract__c];
                    List<Contract_Rule__c> contractRuleList=[SELECT External_Id__c,Source_Object__c,Conditions__c, Source_Record_Type__c,Target_Object__c,Mapping_Contract__c,Child_Field_Token__c FROM Contract_Rule__c WHERE Mapping_Contract__r.Name=:integrationMapping[0].Mapping_Contract__c ORDER BY Rule_Order__c];
                   
                    if(contractRuleList.size()>0){
                        for(Integer i=0;i<contractRuleList.size();i++){
                            Contract_Rule__c contractRule=contractRuleList[i];
                            if(contractRule.Source_Object__c==objectName){
                                SyncRecord.syncSFFuture(contractRule.Source_Object__c,'Id',recordList[0].Id,contractRule.Mapping_Contract__c,contractRule.Id,contractRule.Source_Record_Type__c,contractRule.External_Id__c,contractRule.Conditions__c,false);
                                
                            }
                            else{
                                SyncRecord.syncSFFuture(contractRule.Source_Object__c,contractRule.Child_Field_Token__c,recordList[0].Id,contractRule.Mapping_Contract__c,contractRule.Id,contractRule.Source_Record_Type__c,contractRule.External_Id__c,contractRule.Conditions__c,true);
                            }              
                        }
                    }
                    else{
                        //if no contract rule found
                        System.debug('No contract rule found');
                        String reqJSONData = ''; 
                        String resJSONData = 'Internal error : Could not sync with External System - No Contract Rule Found, Please contact your system administrator for more clarity';
                        System.debug('resJSONData ::: ' + resJSONData); 
                        CreateLogs.createSFToExternalLog(system.now(), reqJSONData, resJSONData, '', objectName,false,recordList[0].Id,mappingContractData.Source_Datastore__c,mappingContractData.Target_Datastore__c);
                    }
                }
                else{
                    //if no integration mapping found
                    System.debug('Integration Mapping Missing');
                    String reqJSONData = ''; 
                    String resJSONData = 'Internal error : Could not sync with External System - Integration Mapping Missing, Please contact your system administrator for more clarity';
                    
                    System.debug('resJSONData ::: ' + resJSONData);
                    
                    CreateLogs.createSFToExternalLog(system.now(), reqJSONData, resJSONData, '', objectName,false,recordList[0].Id,'','');
                }
            }
            else{
                //if no record found
                System.debug('Record not found');
                String reqJSONData = ''; 
                String resJSONData =  'Internal error : Could not sync with External System - Record not found, Please contact your system administrator for more clarity';
                
                System.debug('resJSONData ::: ' + resJSONData);

                CreateLogs.createSFToExternalLog(system.now(), reqJSONData, resJSONData, '', objectName,false,'','','');
            }
        }
        catch(Exception e){ 
            //if any error found
                System.debug('Error found');
                String reqJSONData = ''; 
                String resJSONData ='Internal error : Could not sync with External System - '+ e.getMessage()+', Please contact your system administrator for more clarity';
                
                System.debug('resJSONData ::: ' + resJSONData);
  
                CreateLogs.createSFToExternalLog(system.now(), reqJSONData, resJSONData, '', objectName,false,'','','');
        }
    }
    
    global static void sleep(){
        Long startingTime = System.now().getTime(); 
        Integer delayInMilliseconds = 3000; // Three-second delay
        while (System.now().getTime() - startingTime < delayInMilliseconds)  {
            // Do nothing until desired delay has passed
        } 
    }
    

    global static void syncToSFHandler(String objectName,String fieldName, String recId,String mappingContractId,String contractRuleId,String recordTypeName,String externalId,String conditions,Boolean isSleep)
    {
        if(isSleep){
            SyncRecord.sleep();
        }
        List<SObject> recordList=new List<SObject>();
        MappingRuleTransformations obj = new MappingRuleTransformations();
        
        //fetch all recordtype
        List<RecordType> allrecordTypeList = [SELECT Id, Name,DeveloperName FROM RecordType WHERE sObjectType=:objectName];
        //if record type exist for object
        if(allrecordTypeList.size()>0){
            if(recordTypeName!=null && recordTypeName!=''){
                //check for current recordtype
                List<RecordType> matchingrecordTypeList = [SELECT Id, Name,DeveloperName FROM RecordType WHERE sObjectType=:objectName AND Name=:recordTypeName];
                
                //if record type matches with contract rule record type
                if(matchingrecordTypeList.size()>0){
                    recordList = obj.getRecordDataList(objectName,fieldName,recId,true,matchingrecordTypeList[0].Id);
                }
                //else
                //record type does not match with contract rule record type
                //do nothing
            }
            else{
                recordList = obj.getRecordDataList(objectName,fieldName,recId,true,null);
            }
            
        }
        //if record type does not exist for current object
        else{
            //if no record type is chosen in contract rule
            if(!(recordTypeName!=null && recordTypeName!='')){
                recordList = obj.getRecordDataList(objectName,fieldName,recId,false,null);
            }
            //else
            //do nothing
        }
        recordList=DeserializeObject.ProcessCoditions(recordList,conditions);
        System.debug('recordList--'+recordList);
        //sync with external system        
        if(recordList.size()>0){
            
            //check whether its an create(POST) / update(PATCH) / upsert(PUT) operation
            String operationType;
            Integer insertOperation=0;
            Integer updateOperation=0;
            for(Integer i=0;i<recordList.size();i++){
                if(recordList[i].get(externalId)!=null && String.valueOf(recordList[i].get(externalId))!='' ){
                    updateOperation++;
                }
                else{
                    insertOperation++;
                }
            }
            if(insertOperation!=0&&updateOperation!=0){
                operationType='PUT';
            }
            else{
                if(insertOperation!=0){
                    operationType='POST';
                }
                else{
                    operationType='PATCH';
                }
            }
            SyncFromSF.initiateSync(objectName,operationType ,recordList,mappingContractId,contractRuleId,externalId);
        }
        else{
            Mapping_Contract__c mappingContractData=[Select Id,Name,Source_Datastore__c,Target_Datastore__c FROM Mapping_Contract__c WHERE Id=:mappingContractId];
            String reqJSONData = ''; 
            String resJSONData = 'Internal error : Could not sync with External System - Contract Rule conditions not met, Please contact your system administrator for more clarity';
            System.debug('resJSONData ::: ' + resJSONData); 
            CreateLogs.createSFToExternalLog(system.now(), reqJSONData, resJSONData, '', objectName,false,recId,mappingContractData.Source_Datastore__c,mappingContractData.Target_Datastore__c);
            
        }
    }
    
    @future(callout = true)
    global static void syncSFFuture(String objectName,String fieldName, String recId,String mappingContractId,String contractRuleId,String recordTypeName,String externalId,String conditions,Boolean isSleep)
    {
        
        SyncRecord.syncToSFHandler(objectName,fieldName,recId,mappingContractId,contractRuleId,recordTypeName,externalId,conditions,isSleep);
    }

    
}