public class SyncRecordBatch implements Database.Batchable<sObject>,Database.AllowsCallouts {
    public String query;
    public String mappingContract;
    public String contractRule;
    public String objectName;
    public String operationType;
    public String externalId;
    public String conditions;
    
    public SyncRecordBatch(String query,String mappingContract,String contractRule,String objectName,String operationType,String externalId,String conditions){
        this.query=query;
        this.mappingContract=mappingContract;
        this.contractRule=contractRule;
        this.objectName=objectName;
        this.operationType=operationType;
        this.externalId=externalId;
        this.conditions=conditions;
    }
    public Database.QueryLocator start(Database.BatchableContext BC){
        return Database.getQueryLocator(query);
    }
    
    public void execute(Database.BatchableContext BC, List<sObject> recordList){recordList=DeserializeObject.ProcessCoditions(recordList, conditions);
        if(recordList.size()>0){SyncFromSF.initiateSync(objectName,operationType ,recordList,mappingContract,contractRule,externalId);  }
    }
    
    public void finish(Database.BatchableContext BC){
        //do nothing
    }
}