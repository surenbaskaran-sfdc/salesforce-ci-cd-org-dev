({
    init : function(component, event, helper) {
        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
            "type": "Success",
            "message": "Job Deactivated Successfully."
        });
        resultsToast.fire();
        var action = component.get("c.deleteJob");
        action.setParams({ recordId : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            $A.get("e.force:closeQuickAction").fire();
            var state = response.getState();
            if (state === "SUCCESS") {
                window.setTimeout(
                    $A.getCallback(function() {
                        window.location.reload();
                    }), 1500
                );
            }
        });
        $A.enqueueAction(action);
    }
})