global class ScheduleMappingContract implements Schedulable{
    public String mappingContractId;
    public String operationType;
    public ScheduleMappingContract(String contractId, String type){
        mappingContractId = contractId;
        operationType = type;
    }
    global void execute(SchedulableContext ctx) {SyncRecordJob.executeContractRule(mappingContractId, operationType);}
}