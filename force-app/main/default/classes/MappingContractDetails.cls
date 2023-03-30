/*********************************************************************************************************************************************************************************************************
Company 					: HTC Global Services
Developer 					: Arunkumar V K
Description					: Fetches the target mapping contract based on the input combination.
Related Aura Components   	: 
Related Apex Controllers  	: 
Created Date		  		: May 05, 2021
Last Modified Date	  		: May 07, 2021
**********************************************************************************************************************************************************************************************************/

public class MappingContractDetails 
{
    // Mapping contract class
    
    // Method to get mapping contracts
    public static List<Mapping_Rule__c> getMappingRules(String contractRule,String type)
    {            
        String contractRuleType=[SELECT Mapping_Contract__r.Job_Type__c FROM Contract_Rule__c WHERE Id=:contractRule].Mapping_Contract__r.Job_Type__c;
        if(contractRuleType=='Jobs'){
            type='Job Update';
        }
        List<Mapping_Rule__c> mappingRuleList = new List<Mapping_Rule__c>();
        if(type == 'PATCH'||type == 'Update'){            
            mappingRuleList = [SELECT Id , Name,Contract_Rule__c, Dev_value__c, Transformation_value__c, 
                               Target_Field__c, Mandatory__c, Allowed_for_update__c, 
                               Contract_Rule__r.Mapping_Contract__r.Source_Datastore__c,
                               Contract_Rule__r.Mapping_Contract__r.Target_Datastore__c,
                               Contract_Rule__r.Mapping_Contract__r.End_point_URL__c,
                               Contract_Rule__r.Source_Object__c,Contract_Rule__r.Target_Object__c
                               FROM Mapping_Rule__c
                               WHERE Contract_Rule__c=:contractRule AND Allowed_for_update__c =true];
            
        }else{            
            mappingRuleList = [SELECT Id , Name,Contract_Rule__c, Dev_value__c, Transformation_value__c, 
                               Target_Field__c, Mandatory__c, Allowed_for_update__c, 
                               Contract_Rule__r.Mapping_Contract__r.Source_Datastore__c,
                               Contract_Rule__r.Mapping_Contract__r.Target_Datastore__c,
                               Contract_Rule__r.Mapping_Contract__r.End_point_URL__c,
                               Contract_Rule__r.Source_Object__c,Contract_Rule__r.Target_Object__c
                               FROM Mapping_Rule__c
                               WHERE Contract_Rule__c=:contractRule];
            
       
        }        
        System.debug('mappingRuleList'+mappingRuleList);
        return mappingRuleList;
    }
    
    // Method to get contract rules
    public static List<SObject> getAllContractRules(String sourceDatastore, String targetDataStore, String targetObjectName)
    {        
        System.debug('In getAllContractRules');
        System.debug(' sourceDatastore'+sourceDatastore);
        System.debug(' targetDataStore'+targetDataStore);
        System.debug(' targetObjectName'+targetObjectName);
        List<Contract_Rule__c> contractRuleList = new List<Contract_Rule__c>();
        contractRuleList = [SELECT Id , Name, External_ID__c, Mapping_Contract__c, Rule_order__c, 
                                                 Source_Object__c, Target_Object__c, 
                                                 Mapping_Contract__r.Source_Datastore__c,
                                                 Mapping_Contract__r.Target_Datastore__c                                          
                                                 FROM Contract_Rule__c
                                                 WHERE Mapping_Contract__r.Source_Datastore__c=:sourceDatastore
                                                 AND Mapping_Contract__r.Target_Datastore__c =: targetDataStore                                                 
                                                 AND Target_Object__c =: targetObjectName
                                                 AND Mapping_Contract__r.Active__c = true];
            
        return contractRuleList;
    }
    
    public static List<SObject> getAllObjectFields(String objectName)
    {        
        return SFConnectController.getDataListWithConditions('Mapping_Object_Field__c','SAP',objectName);
    }
    
}