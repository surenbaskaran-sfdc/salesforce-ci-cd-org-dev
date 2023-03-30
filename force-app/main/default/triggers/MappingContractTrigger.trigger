trigger MappingContractTrigger on Mapping_Contract__c (before Delete) {
    if(trigger.isBefore && trigger.isDelete){
        List<Mapping_Contract__c> oldMappingContractDetail = Trigger.old;
        List<Integration_Mapping__c> integrationMappingList = SFConnectController.getDataList('Integration_Mapping__c',null);
        List<Job__c> jobList = SFConnectController.getDataList('Job__c',null);
        for(Mapping_Contract__c record : oldMappingContractDetail){
            if(record.Active__c){
                record.addError('Mapping Contract is Active, hence it cannot be deleted.');
            }
        }
    }
}