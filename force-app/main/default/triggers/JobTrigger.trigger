trigger JobTrigger on Job__c (before delete, before update) {
    if (Trigger.isBefore) {
        if (Trigger.isDelete) {
            List <Job__c> records = trigger.old;
            for(Job__c record :  records){
                if(record.Active__c){
                    record.addError('Active job can\'t be deleted. Deactivate and Try again.');
                }
            }
        }
        if (Trigger.isUpdate) {
            List <Job__c> records = trigger.old;
            List <Job__c> newRecords = trigger.new;
            for(Integer i=0;i<records.size();i++){
                if( (records[i].Name != newRecords[i].Name || records[i].Mapping_Contract__c != newRecords[i].Mapping_Contract__c || records[i].Type__c != newRecords[i].Type__c ) && records[i].Active__c){
                    newRecords[i].addError('Job cannot be Updated. Deactivate and Try again.');
                }
            }
        }
    }
}