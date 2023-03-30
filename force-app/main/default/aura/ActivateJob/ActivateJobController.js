({
    init : function(component, event, helper) {
        var action = component.get("c.getJob");
        action.setParams({ recordId : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            $A.get("e.force:closeQuickAction").fire();
            var resultsToast = $A.get("e.force:showToast");
            resultsToast.setParams({
                "type": "Success",
                "message": "Job Activated Successfully."
            });
            resultsToast.fire();
            window.setTimeout(
                $A.getCallback(function() {
                    window.location.reload();
                }), 1500
            );
            var state = response.getState();
            if (state === "SUCCESS") {   
                var expression = response.getReturnValue().Cron_Expression__c;
                if(expression != undefined && expression != null && expression!=''){
                    var actions = component.get("c.scheduleJob");
                    actions.setParams({ recordId : component.get("v.recordId") });
                    actions.setCallback(this, function(responses) {
                        var states = responses.getState();
                        if (states === "SUCCESS") {
                            
                        }
                    });
                    $A.enqueueAction(actions);
                }
                else{
                    $A.get("e.force:closeQuickAction").fire();
                    var resultsToast = $A.get("e.force:showToast");
                    resultsToast.setParams({
                        "type": "Error",
                        "title": "Activation Failed", 
                        "message": "Recurrence is not configured."
                    });
                    resultsToast.fire();
                }
            }
        });
        $A.enqueueAction(action);        
    }
})