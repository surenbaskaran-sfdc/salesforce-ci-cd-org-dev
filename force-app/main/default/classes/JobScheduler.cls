public class JobScheduler {
    @AuraEnabled
    public static void scheduleJob(Id recordId)
    {
        Job__c scheduledJob = [Select Id, Name,Cron_Expression__c,Active__c,Type__c,Mapping_Contract__c From Job__c where Id=:recordId];
        ScheduleMappingContract scheduler = new ScheduleMappingContract(scheduledJob.Mapping_Contract__c,scheduledJob.Type__c);
        String jobID = System.schedule(scheduledJob.Name, scheduledJob.Cron_Expression__c, scheduler);
        scheduledJob.Active__c = true;
        update scheduledJob;
    }
    @AuraEnabled
    public static void deleteJob(Id recordId)
    {
        Job__c scheduledJob = [Select Id, Name, Active__c From Job__c where Id=:recordId];
        Id detailId = [SELECT Id FROM CronJobDetail WHERE Name=: scheduledJob.Name][0].Id;
        if (detailId != null) {
            Id jobId = [SELECT Id from CronTrigger WHERE CronJobDetailId = :detailId][0].Id;
            System.abortJob(jobId);
            scheduledJob.Active__c = false;
            update scheduledJob;
        }
    }
    @AuraEnabled
    public static Job__c getJob (Id recordId){
        return [Select 
                Id, 
                Job_Type__c, 
                Time__c, 
                Day__c, 
                minutes__c,
                Start_Date__c,
                End_Date__c,
                Cron_Expression__c
                From 
                Job__c 
                Where Id=: recordId];
    }
}