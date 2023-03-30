({
    doInit : function(component, event, helper) {
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire(); 
        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
            "type": "Success",
            "message": "Sync Initiated Successfully."
        });
        resultsToast.fire();
          
    } 
})