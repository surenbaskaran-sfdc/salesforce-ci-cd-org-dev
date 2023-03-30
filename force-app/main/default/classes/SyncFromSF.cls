/*********************************************************************************************************************************************************************************************************
Company 					: HTC Global Services
Developer 					: Arunkumar V K
Description					: sync from salesforce
Related Aura Components   	: 
Related Apex Controllers  	: 
Created Date		  		: May 05, 2021
Last Modified Date	  		: May 07, 2021
**********************************************************************************************************************************************************************************************************/


public class SyncFromSF {
    Public static boolean isSuccess = false;
    
    public static boolean initiateSync(String objectName,String callingType,List<sObject> recordList,String mappingContractId,String contractRuleId,String externalId){
        
        System.debug('2 objectName'+objectName);
        System.debug('3 callingType'+callingType);
        System.debug('4 recordList'+recordList);
        String  requestJsonData;
        list<String> responseJSONDataList = new list<String>();
        String responseJSONData;
        try{
            Mapping_Contract__c mappingContractData=[Select Name,Source_Datastore__c,Target_Datastore__c FROM Mapping_Contract__c WHERE Id=:mappingContractId];
            System.debug('mappingContractData'+mappingContractData.Name);
            System.debug('ContractRuleData'+contractRuleId);
            //Calling 'GenerateRequest' class to generate request JSON data
            requestJsonData = GenerateRequest.createRequest(recordList, callingType, objectName,contractRuleId,externalId); 
            System.debug('4 requestJsonData'+requestJsonData);
            System.debug('GenerateRequest.isJsonValid in batch ::: ' + GenerateRequest.isJsonValid);
            if(GenerateRequest.mandatoryFields.size()>0)
            {
                String responseData = '';Boolean isSuccess = false;responseData = GenerateResponse.createMandatoryMissingResponse(isSuccess, objectName,GenerateRequest.mandatoryFields,GenerateRequest.mandatoryFieldsUniqueList);
                CreateLogs.createSFToExternalLog(system.now(), requestJsonData, responseData, callingType, objectName,false,recordList[0].Id,mappingContractData.Source_Datastore__c,mappingContractData.Target_Datastore__c);
                
            }
            else
            {
                if(GenerateRequest.isJsonValid == true)
                {
                    String namedCredential = [SELECT Named_Credential__c from Mapping_Contract__c where Id =: mappingContractId].Named_Credential__c;
                    responseJSONDataList = CalloutExternalSystem.dataUpload(requestJsonData,callingType,GenerateRequest.EndPointURL,namedCredential);
                       
                    if(responseJSONDataList[1] == '200'){
                        isSuccess = true;
                    }
                    responseJSONData = responseJSONDataList[2];
                    System.debug('isSuccess before'+isSuccess);
                    isSuccess=ResponseRuleExecution.updateResponseData(responseJSONData,contractRuleId,objectName,recordList);
                    System.debug('isSuccess after'+isSuccess);
                    CreateLogs.createSFToExternalLog(system.now(), requestJsonData, responseJSONData, callingType, objectName,isSuccess,recordList[0].Id,mappingContractData.Source_Datastore__c,mappingContractData.Target_Datastore__c);
                                        
                }
                else 
                {
                    System.debug('JSON data creation failed');
                    String resJSONData = requestJsonData;
                    if(!GenerateRequest.isErrorFound)
                        resJSONData = 'Internal error : Could not sync with External System, Please contact your system administrator for more clarity';
                    
                    System.debug('resJSONData ::: ' + resJSONData);
                    
                    CreateLogs.createSFToExternalLog(system.now(), requestJsonData, resJSONData, callingType, objectName,false,recordList[0].Id,mappingContractData.Source_Datastore__c,mappingContractData.Target_Datastore__c);
                }
            }            
            return isSuccess;
        }
        catch(Exception e) {            responseJSONData = 'Internal error : Could not sync with External System, Please contact your system administrator for more clarity. Error : ' + e.getMessage();
            CreateLogs.createSFToExternalLog(system.now(), requestJsonData, responseJSONData,callingType, objectName, isSuccess,'','','');
            return isSuccess;    
        } 
    }   
}