public class MappingContractTriggerHandler {
    
    /*public static void checkDuplicateMappingContract(List<Mapping_Contract__c> newMappingContractsList,List<Mapping_Contract__c> oldMappingContractsList, String type){
        //system.debug('In checkDuplicateMappingContract');
        
        Mapping_Contract__c newMappingContractDetail = new Mapping_Contract__c();
        newMappingContractDetail = newMappingContractsList[0];        
        //system.debug(' newMappingContractDetail.Id ::: ' +  newMappingContractDetail.Id);
        if(newMappingContractDetail.Name != '')
        {
            for(Mapping_Contract__c mappingContract : [SELECT Id, Name , Target_Datastore__c, Source_Datastore__c ,Active__c, End_point_URL__c
                                                       FROM Mapping_Contract__c])
            {
                //system.debug('newMappingContractDetail.Name ::: ' + newMappingContractDetail.Name);
                //system.debug('mappingContract.Name ::: ' + mappingContract.Name);
                if(mappingContract.Id != newMappingContractDetail.Id)
                {                    
                    if( newMappingContractDetail.Name == mappingContract.Name ) 
                    {
                        //system.debug('Mapping Contract with same name is already present. Try again with different name!');
                        newMappingContractDetail.addError('Mapping Contract with same name is already present. Try again with different name!');
                        (newMappingContractDetail.Name).addError('Complete this field.');
                        break;
                    }
                }
            }*/                        
            /*if(type == 'Update')
            {
                Mapping_Contract__c oldMappingContractDetail = new Mapping_Contract__c();
                oldMappingContractDetail = oldMappingContractsList[0];  
                if(newMappingContractDetail.Source_Datastore__c != oldMappingContractDetail.Source_Datastore__c)
                {
                    if( (SFConnectController.getChildDataList('Contract_Rule__c', 'Mapping_Contract__c',newMappingContractDetail.Id)).size() > 0)
                    {
                        //system.debug('Mapping Contract with same name is already present. Try again with different name!');
                        newMappingContractDetail.addError('Cannot change Source Datastore. Contract Rules present for this Mapping Contract.');
                        (newMappingContractDetail.Source_Datastore__c).addError('Complete this field.');
                    }
                }                
                if(newMappingContractDetail.Target_Datastore__c != oldMappingContractDetail.Target_Datastore__c )
                {
                    if( (SFConnectController.getChildDataList('Contract_Rule__c', 'Mapping_Contract__c',newMappingContractDetail.Id)).size() > 0)
                    {
                        //system.debug('Mapping Contract with same name is already present. Try again with different name!');
                        newMappingContractDetail.addError('Cannot change Target Datastore. Contract Rules present for this Mapping Contract.');
                        (newMappingContractDetail.Target_Datastore__c).addError('Complete this field.');
                    }
                }                
                if(newMappingContractDetail.Source_Datastore__c != oldMappingContractDetail.Source_Datastore__c 
                   && newMappingContractDetail.Target_Datastore__c != oldMappingContractDetail.Target_Datastore__c )
                {
                    if( (SFConnectController.getChildDataList('Contract_Rule__c', 'Mapping_Contract__c',newMappingContractDetail.Id)).size() > 0)
                    {
                        //system.debug('Mapping Contract with same name is already present. Try again with different name!');
                        newMappingContractDetail.addError('Cannot change Source and Target Datastore. Contract Rules present for this Mapping Contract.');
                        (newMappingContractDetail.Source_Datastore__c).addError('Complete this field.');
                        (newMappingContractDetail.Target_Datastore__c).addError('Complete this field.');
                    }
                }                                
            }
*/
        //}
        
        
    //}
   
}