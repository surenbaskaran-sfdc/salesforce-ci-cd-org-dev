/***********************************************************************
Created By   : HTC Global Services
@Authur Name : Aananda
Description  : Mass Delete Functionality for Integration Logs Records.
Dependency   : ClearIntergrationLogs.Vfp
************************************************************************/

public class ClearIntegrationLogsController {
    
    private ApexPages.StandardSetController setController;
    public boolean displayPopup {get; set;}    
    public list<sObject> selectedrecs;
    public list<Integration_log__c> logsListTodelete; 
    public Integer count {get;set;}
    Public date getStartDate{get;set;}
    Public date getEndDate{get;set;}
    Public boolean isCancelled{get;set;}
    public boolean isFormRendered{get;set;}
    //public string callfunc{get;set;}
    public boolean renderConfirmPanel{get;set;}
    public boolean renderDateRangePanel{get;set;}
    public boolean renderConfirmPanelSingle{get;set;}
    public boolean renderDeleteMore{get;set;}
    
    public ClearIntegrationLogsController(ApexPages.StandardSetController setController) {
        this.setController = setController;
        logsListTodelete = new list<Integration_log__c>();
        renderDateRangePanel = true;
        renderConfirmPanel = false;
		isFormRendered = true;     
        renderConfirmPanelSingle = false;
    }
    
    public PageReference clearLogs(){  
        //system.debug('In direct clear');
        selectedrecs = this.setController.getSelected();
        if(selectedrecs.size() > 0)
        {
            delete selectedrecs;
            Schema.DescribeSObjectResult result = Integration_log__c.SObjectType.getDescribe(); 
            PageReference pageRef = new PageReference('/' + result.getKeyPrefix()); 
            pageRef.setRedirect(true); 
            return pageRef;
        }
        return null;  
    }
    
    Public PageReference logsMassDelete(){
        //system.debug('In logsMassDelete');
        isCancelled = true;
        //system.debug('getStartDate ::: ' + getStartDate);
        //system.debug('getEndDate ::: ' + getEndDate);
        if(getStartDate != null  && getEndDate != null){
            if(getStartDate > system.today() || getEndDate > system.today()){
                ApexPages.addmessage(new ApexPages.message(ApexPages.severity.ERROR,' Future dates are not valid, Please provide valid date'));
                isFormRendered = true;
                return null;
            }
            else if( getStartDate >= getEndDate ){
                ApexPages.addmessage(new ApexPages.message(ApexPages.severity.ERROR,' Start Date should be lesser than End Date'));
                isFormRendered = true;
                return null;
            }else{
                datetime strDatetime = convertToDatetime(getStartDate);
                datetime endDatetime = convertToDatetime(getEndDate);
                logsListTodelete = [select Id, Name from Integration_log__c where (CreatedDate > :strDatetime) and (CreatedDate < :endDatetime) ];
                count = logsListTodelete.size();
                //system.debug('count LL::: ' + count);
                if(count > 0){
                    if(count == 1){
                        renderConfirmPanelSingle = true;
                        renderDateRangePanel = false;
                    }else{
                        hideDateRange(); }
                }else{
                    ApexPages.addmessage(new ApexPages.message(ApexPages.severity.ERROR,' No logs exists for the selected interval, Please specify a different range.'));
                }
            }
        }
        else{
            if(getStartDate == null || getEndDate == null){
                if(getStartDate == null && getEndDate == null){
                    ApexPages.addmessage(new ApexPages.message(ApexPages.severity.ERROR,' Please provide values for mandatory fields : Start Date, End Date'));
                    isFormRendered = true;
                }else if(getStartDate == null){
                    ApexPages.addmessage(new ApexPages.message(ApexPages.severity.ERROR,' Please provide value for mandatory field : Start Date'));
                    isFormRendered = true;
                }else if(getEndDate == null){
                    ApexPages.addmessage(new ApexPages.message(ApexPages.severity.ERROR,' Please provide value for mandatory field : End Date'));
                    isFormRendered = true;
                }
            }            
        }
        isCancelled = false;
        return null;
        
    }
    
    public PageReference deleteConfirmation(){
        if(logsListTodelete.size() > 0){
        delete logsListTodelete;
        renderDateRangePanel = true;
            renderConfirmPanelSingle= false;
            renderConfirmPanel = false;
            getStartDate = null; getEndDate= null;
            renderDeleteMore = true;
            
        ApexPages.addmessage(new ApexPages.message(ApexPages.severity.Confirm,'Integration logs cleared successfully.'));
        Schema.DescribeSObjectResult result = Integration_log__c.SObjectType.getDescribe(); 
        PageReference pageRef = new PageReference('/' + result.getKeyPrefix()); 
        pageRef.setRedirect(true); 
        return null; 
        }else{
			ApexPages.addmessage(new ApexPages.message(ApexPages.severity.ERROR,' Internal error, Please contact system administrator'));
            return null;
        }
    }
    
    public datetime convertToDatetime(Date dateInput){
        Integer d = dateInput.day();
        Integer mo = dateInput.month();
        Integer yr = dateInput.year();
        DateTime DT = DateTime.newInstance(yr, mo, d, 23, 59, 59);
        return DT;
    }
    
    public PageReference navToListView(){
        isCancelled = false;
        Schema.DescribeSObjectResult result = Integration_log__c.SObjectType.getDescribe(); 
        PageReference pageRef = new PageReference('/' + result.getKeyPrefix()); 
        pageRef.setRedirect(true); 
        return pageRef;  
    }
    
    public void hideDateRange(){
        renderConfirmPanel = true;
        renderDateRangePanel = false;        
    }
    
    public void closePopup() {        
        displayPopup = false;    
    }     
    
    public void showPopup() {        
        displayPopup = true;    
    }
    
    public PageReference incrementCounter() {
        count++;
        return null;
    }
    
    public Integer getCount() {
        return count;
    }
    
}