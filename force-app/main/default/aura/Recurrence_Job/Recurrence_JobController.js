({
    doinit : function(component, event, helper) {
        helper.getCurrentJob(component,event,helper);
    },
    handleCancel : function(component,event,helper){
        helper.handleCancelOperation(component,event,helper);
    },
    handleScheduleChange : function(component,event,helper){
        helper.openFooter(component,event,helper); 
    },
    onScheduleTypeChange : function(component,event,helper){
        helper.openFooter(component,event,helper); 
        helper.resetScheduledValues(component,event,helper);
    },
    handleSave : function(component,event,helper){
        helper.handleSaveOperation(component,event,helper);
    }
})