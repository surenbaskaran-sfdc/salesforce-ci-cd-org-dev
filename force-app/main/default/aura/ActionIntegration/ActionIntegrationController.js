({
    init : function(component, event, helper) {        
        var action = component.get("c.makeCalloutFromQuickAction");
        action.setParams({ recordId : component.get("v.recordId"),
                          sObjectName : component.get("v.sObjectName")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log('state',state);
            $A.get("e.force:closeQuickAction").fire();
            if (state === "SUCCESS") {
                console.log("in toast");
                var resultsToast = $A.get("e.force:showToast");
                resultsToast.setParams({
                    "type": "Success",
                    "message": "Sync Initiated Successfully."
                });
                resultsToast.fire();
                
            }
            
        });
        $A.enqueueAction(action);
    }
})