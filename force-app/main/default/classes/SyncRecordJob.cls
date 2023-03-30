/*********************************************************************************************************************************************************************************************************
Company 					: HTC Global Services
Developer 					: Arunkumar V K
Description					: Record sync job
Related Aura Components   	:  
Related Apex Controllers  	: 
Created Date		  		: June 08, 2021
Last Modified Date	  		: June 08, 2021
**********************************************************************************************************************************************************************************************************/


global class SyncRecordJob {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    global static void executeContractRule(String mappingContractId,String operationType){
        try{
            Mapping_Contract__c mappingContractData=[Select Name,Source_Datastore__c,Target_Datastore__c FROM Mapping_Contract__c WHERE Id=:mappingContractId];
            List<Contract_Rule__c> contractRuleList=[SELECT Conditions__c,External_Id__c,Source_Object__c,Source_Record_Type__c,Target_Object__c,Mapping_Contract__c,Child_Field_Token__c FROM Contract_Rule__c WHERE Mapping_Contract__c=:mappingContractId ORDER BY Rule_Order__c];
            
            if(contractRuleList.size()>0){
                for(Integer i=0;i<contractRuleList.size();i++){
                    Contract_Rule__c contractRule=contractRuleList[i];
                    String objectName=contractRule.Source_Object__c;
                    String recordType=contractRule.Source_Record_Type__c;
                    //GenerateQuery
                    MappingRuleTransformations obj = new MappingRuleTransformations();
                    String allFieldApi = obj.getAllFieldsOfObject(objectName);
                    String query='Select ' + allFieldApi + ' From '+ objectName ;
                    //check record type exist for object
                    //fetch all recordtype
                    List<RecordType> allrecordTypeList = [SELECT Id, Name,DeveloperName FROM RecordType WHERE sObjectType=:objectName];
                    Boolean isExecute=false;
                    if(allrecordTypeList.size()>0){
                        //check for current recordtype
                        List<RecordType> matchingrecordTypeList = [SELECT Id, Name,DeveloperName FROM RecordType WHERE sObjectType=:objectName AND Name=:recordType];
                        if(matchingrecordTypeList.size()>0){
                        	query=query+' WHERE RecordTypeId'+' = \'' +matchingrecordTypeList[0].Id+ '\'';
                            isExecute=true;
                        }
                        else{
                            if(!(recordType!=null&&recordType!='')){
                                query=query+' WHERE RecordTypeId'+' = \'' + '\'';
                                isExecute=true;
                            }
                        }
                    }
                    else{
                        if(!(recordType!=null&&recordType!='')){
                            isExecute=true;
                        }
                    }
                    if(isExecute=true){
                        SyncRecordBatch b = new SyncRecordBatch(query,mappingContractId,contractRule.Id,objectName,operationType,contractRule.External_Id__c,contractRule.Conditions__c);
                        Database.executeBatch(b,2000);
                    }
                }
            }
            else{
                //if no contract rule found
                System.debug('No contract rule found');
                String reqJSONData = ''; 
                String resJSONData = 'Internal error : Could not sync with External System - No Contract Rule Found, Please contact your system administrator for more clarity';
                System.debug('resJSONData ::: ' + resJSONData); 
                CreateLogs.createSFToExternalLog(system.now(), reqJSONData, resJSONData, '', '',false,'',mappingContractData.Source_Datastore__c,mappingContractData.Target_Datastore__c);
            }
            
            
        }
        catch(Exception e){ 
            //if any error found
            System.debug('Error found');
            String reqJSONData = ''; 
            String resJSONData ='Internal error : Could not sync with External System - '+ e.getMessage()+', Please contact your system administrator for more clarity';
            
            System.debug('resJSONData ::: ' + resJSONData);
            
            CreateLogs.createSFToExternalLog(system.now(), reqJSONData, resJSONData, '', '',false,'','','');
        }
    }
    
    

    
}