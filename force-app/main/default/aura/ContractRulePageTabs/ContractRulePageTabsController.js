({    
	doInit: function(component, event, helper) 
    {        
        component.set("v.selectedTab","Detail");    
        component.set("v.currentTab","Detail");         
    }, 
	handleNavigateTab: function (component, event, helper) {
        //If the current Input Tab is in edit Mode  user is not allowed to navigate to any tab 
        //var isNavigate = component.get("v.isNavigateToOtherTabNames")        
        if(component.get("v.currentTab") == 'Detail')
        {
            var isEditPage = component.find("contractRuleDetail").get("v.isEditPage");             
            if (isEditPage == true) {
                component.set("v.selectedTab", 'Detail');
                component.set("v.currentTab", 'Detail');
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": "Error",                
                    "message": "There are unsaved changes. Please save the tab before leaving."
                });
                toastEvent.fire();
            }
            else
            {                
                component.set("v.currentTab", component.get("v.selectedTab"));
            }
        }
        else if(component.get("v.currentTab") == 'MappingRules')
        {
            var showfooter = component.find("mappingRulesRelatedList").get("v.showfooter");                    
            if (showfooter == true) {
                component.set("v.selectedTab", 'MappingRules');
                component.set("v.currentTab", 'MappingRules');
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": "Error",                
                    "message": "There are unsaved changes. Please save the tab before leaving."
                });
                toastEvent.fire();
            }
            else
            {                
                component.set("v.currentTab", component.get("v.selectedTab"));
            }
        }        
        else if(component.get("v.currentTab") == 'ResponseRules')
        {
            var showfooter = component.find("responseRulesRelatedList").get("v.showfooter");                    
            if (showfooter == true) {
                component.set("v.selectedTab", 'ResponseRules');
                component.set("v.currentTab", 'ResponseRules');
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": "Error",                
                    "message": "There are unsaved changes. Please save the tab before leaving."
                });
                toastEvent.fire();
            }
            else
            {                
                component.set("v.currentTab", component.get("v.selectedTab"));
            }
        }
        else if(component.get("v.currentTab") == 'conditions')
        {
            var showfooter = component.find("ConditionsRelatedList").get("v.showCancelSaveButton");                    
            if (showfooter == true) {
                component.set("v.selectedTab", 'conditions');
                component.set("v.currentTab", 'conditions');
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": "Error",                
                    "message": "There are unsaved changes. Please save the tab before leaving."
                });
                toastEvent.fire();
            }
            else
            {                
                component.set("v.currentTab", component.get("v.selectedTab"));
            }
        }
    }, 
})