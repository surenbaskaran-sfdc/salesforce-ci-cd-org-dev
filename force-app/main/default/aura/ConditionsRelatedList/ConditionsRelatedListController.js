({
    doInit: function (component, event, helper) {
        helper.doInitHelper(component, event, helper);
        helper.escapeEventHelper(component, event, helper);
    },
    onRadioSelect: function (component, event, helper) { 
        helper.handleRadioSelect(component, event, helper);
    },
    onCustomFormulaChange: function (component, event, helper) {
        helper.handleCustomFromulaChange(component, event, helper);
    },
    onValueChange: function (component, event, helper) {
        helper.handleValueChange(component, event, helper);
    },
    onFieldChange: function (component, event, helper) {
        helper.handleFieldChange(component, event, helper);
    },
    onOperatorChange: function (component, event, helper) {
        helper.handleOperatorChange(component, event, helper);
    },
    onClickAddRowButton: function (component, event, helper) {
        helper.handleAddRowOperation(component, event, helper);
    },
    onClickDeleteButton: function (component, event, helper) {
        var selectedItem = event.currentTarget;
        var index = selectedItem.dataset.id;
        component.set("v.deleteIndex", index);
        component.set("v.isDeleteLabel", true);
    },
    closeDelLabel: function (component, event, helper) {
        component.set("v.isDeleteLabel", false);
    },
    handleDeleteLabel: function (component, event, helper) {
        component.set("v.isDeleteLabel", false);
        helper.handleDeleteRowOperation(component, event, helper, component.get("v.deleteIndex"));
    },
    onClickCancelButton: function (component, event, helper) {
        helper.handleCancelOperation(component, event, helper);
    },
    onClickSaveButton: function (component, event, helper) {
        var validationResult = helper.handleValidation(component, event, helper);
        if (validationResult[0]) {
            if (validationResult[1]) {
                if (helper.handleDuplicateValidation(component, event, helper)) {
                    helper.handleSaveOperation(component, event, helper);
                }
                else {
                    helper.showToastMessage(component, event, helper, "Error", "Duplicate entries found.")
                }
            }
            else {
                helper.showToastMessage(component, event, helper, "Error", "Please check the custom formula.")
            }
        }
        else {
            helper.showToastMessage(component, event, helper, "Error", "Please fill all the required fields.")
        }
    },
})