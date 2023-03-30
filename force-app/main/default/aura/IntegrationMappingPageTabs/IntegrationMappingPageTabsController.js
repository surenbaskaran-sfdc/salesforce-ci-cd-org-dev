({
	handleNavigateTab: function (component, event, helper) {
        //If the current Input Tab is in edit Mode  user is not allowed to navigate to any tab 
        //var isNavigate = component.get("v.isNavigateToOtherTabNames")
        /*
        var isEditPage = component.find("mappingContractDetail").get("v.isEditPage");        
        if (isEditPage == true) {
            component.set("v.selectedTab", 'Detail');
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "type": "Error",                
                "message": "There are unsaved changes. Please save the tab before leaving."
            });
            toastEvent.fire();
        }*/
    }, 
})