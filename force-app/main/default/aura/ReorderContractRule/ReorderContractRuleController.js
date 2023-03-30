({
    doInit: function (component, event, helper) {
        //console.log('In doinit')
        //console.log(JSON.stringify(component.get("v.selectedValues")))
        helper.initReorder(component, event, helper);
        //helper.escapeEventHelper(component, event, helper);
    },
    
    OnClickSaveRecord: function (component, event, helper) {        
        component.set("v.spinner",true);
        var items = component.get("v.selectedItems");
        //console.log('items before ::: ' , items)
        for (let j = 0; j < items.length; j++) {
            //console.log('items [j]' , items[j])
            items[j].Rule_Order__c = String(j+1) ; 
        }
        //console.log('items after ::: ' , items)
        component.set("v.selectedItems", items);
        var action = component.get("c.saveContractRuleDataList");
        action.setParams({ 
            "ruleDetailList": items
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            //console.log('state ::: ' + state)
            if (state === "SUCCESS") {
                
                $A.get('e.force:refreshView').fire();
                helper.LightningToastmessage(component, event, helper,"Contract Rules has been reordered successfully.","Success");
                component.set("v.spinner",false);
                var triggerSaveCRuleEvent = component.getEvent("triggerSaveCRuleEvent");
                triggerSaveCRuleEvent.setParams({
                    "isSaveTriggered" : "true" ,
                    "type" : "Reorder"
                });
                triggerSaveCRuleEvent.fire();       
                
            }
        });
        $A.enqueueAction(action)
    },
    handleListClickDestination: function (component, event, helper) {
        helper.handleListClick(component, event, "v.selectedItems", "v.destHighlightedItems", "v.destHighlightedItem");
    },
    handleReorderItemUp: function (component, event, helper) {
        helper.reorderItem(component, "v.selectedItems", "v.destHighlightedItems", "v.destHighlightedItem", 'up');
    },
    handleReorderItemDown: function (component, event, helper) {
        helper.reorderItem(component, "v.selectedItems", "v.destHighlightedItems", "v.destHighlightedItem", 'down');
    },
    handleDragStartFromDestination: function (component, event, helper) {
        helper.handleDragStart(component, event, "v.selectedItems");
    },
    handleOnDragOver: function (component, event, helper) {
        event.preventDefault();
    },
    handleOnDropSelf: function (component, event, helper) {
        
        helper.handleOnDropSelf(component, event);
    },
    handleOnDrop: function (component, event, helper) {
        helper.handleOnDrop(component, event);
    },
    display: function (component, event, helper) {
        helper.toggleHelper(component, event);
    },
    displayOut: function (component, event, helper) {
        helper.toggleHelper(component, event);
    },
    closeRuleReorderModal: function (component, event, helper) {
        var cancelReorderEvent = component.getEvent("cancelReorderEvent");
        cancelReorderEvent.setParams({
            "isCancelButtonClicked" : "false" 
        });
        cancelReorderEvent.fire();
    },
})