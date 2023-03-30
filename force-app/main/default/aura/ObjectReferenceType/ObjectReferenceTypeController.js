({   
    doInit: function(component, event, helper) {                        
        //console.log('In doinit')
        component.set("v.loadingSpinner",true);
        if(component.get("v.mappingContractDetail.Source_Datastore__c") == 'Salesforce')
            component.set("v.selectedObjectValue",component.get("v.contractRuleDetail.Source_Object__c"));
        else
            component.set("v.selectedObjectValue",component.get("v.contractRuleDetail.Target_Object__c"));
        //console.log('selectedObjectValue ::: ' , component.get("v.selectedObjectValue"));
        helper.initMethods(component, event, helper);         
    },
    onChangeSourceFieldValue: function(component, event, helper) {        
        if(component.get("v.mappingObjectFieldValue")!='')
            component.set("v.mappingObjectFieldError",'');    
    },
    
    onChangeReturnFieldValue: function(component, event, helper) {        
        if(component.get("v.returnField")!='')
            component.set("v.returnFieldError",'');    
    },
    handleObjectNameChange: function(component, event, helper) {        
        if(component.get("v.objectName") !=''){
            component.set("v.isDisabledSalesforceField",false);
            component.set("v.isDisabledReturnField",true);
            
            component.set("v.mappingObjectFieldValue",'');
            component.set("v.salesforceField",'');
            component.set("v.returnField",'');    
            component.set("v.objectReferenceConditionsList",[]);    
            
            
            helper.handleObjectNameChangeHelper(component, event, helper);
        }
        else
        {
            component.set("v.isDisabledSalesforceField",true);
            component.set("v.isDisabledReturnField",true);
            
            component.set("v.mappingObjectFieldValue",'');
            component.set("v.salesforceField",'');
            component.set("v.returnField",'');    
            component.set("v.objectReferenceConditionsList",[]);
        }
    },    
        
    handleRadioButtonChange: function(component, event, helper) {
        helper.handleRadioButtonChangeHelper(component, event, helper);
    },
    
    onChangeSelectKeyField: function (component, event, helper) 
    {
        //console.log('In onChangeSelectKeyField')
        //console.log('selectedKeyField ::: ', component.get("v.selectedKeyField"))
        helper.handleKeyFieldUpdate(component, event, helper);
        
    },
    
    getSelectedFields : function(component, event, helper){
        //Get selected Fields List on button click 
        var selectedValues = component.get("v.selectedFieldsList");
        //console.log('Selectd Fields-' + selectedValues);
    },        
    
    //used
    handleCustomeConditionChange: function(component, event, helper) {
        helper.handleCustomeConditionChangeHelper(component, event, helper);
    },
    //used
    onChangeField: function(component, event, helper) {
        //console.log('selectedObjectLookupValue ::: ',component.get("v.selectedObjectLookupValue"))
        if(component.get("v.selectedObjectLookupValue") != '' && component.get("v.selectedObjectLookupValue") != undefined  )
        {
            helper.onChangeFieldHelper(component, event, helper);
        }
        else
        {
            //console.log('In else')
            //console.log(component.get("v.mappingContractDetail.Source_Datastore__c"))
            component.set("v.selectedObjectLookupValueError",'slds-has-error')
            if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce'){
                component.set("v.isErrorFound",true)
                component.set("v.errorText", 'These required fields must be completed to select field : Mapped Target Field');
            }
            else
            {
                component.set("v.isErrorFound",true)
                component.set("v.errorText", 'These required fields must be completed to select field : Lookup field');
            }
        }
    },        
    //used
    onChangeOperator: function(component, event, helper) {
        helper.onChangeOperatorHelper(component, event, helper);
    },
    //used
    onChangeType: function(component, event, helper) {
        helper.onChangeTypeHelper(component, event, helper);
    },
    //used
    onChangeValue: function(component, event, helper) {
        helper.onChangeValueHelper(component, event, helper);
    },
    //used
    removeRule: function(component, event, helper) {
        helper.removeFilterRule(component, event, helper);
    },
    //used
    addRule: function(component, event, helper) {
        helper.addFilterRule(component, event, helper);
    },
    
    //used
    validateExpression: function(component, event, helper) {
        helper.validateExpressionHelper(component, event, helper);
    },
    handleValidateTransformationValue: function(component, event, helper) {
        helper.handleValidateTransformationValue(component, event, helper);
    },
    
    //used
    onChangeLookup: function(component, event, helper) {
        helper.getResultantType(component, event, helper);
    },
    insertField : function(component,event,helper){
        helper.oninsertField(component,event,helper);
    },
    handleCloseFieldSelector : function(component,event,helper){
        helper.closeFieldSelector(component,event,helper);
    },
    
    closeTransformationTypeModals: function(component,event,helper){        
        var triggerCancelEvent = component.getEvent("triggerCancelEvent");
        triggerCancelEvent.setParams({
            "isCancelButtonClicked" : "true" ,
            "type" : "Object Reference"
        });
        triggerCancelEvent.fire();
    },
    onPressKey: function (component, event, helper) {
        helper.onPressKeyboardKey(component, event, helper);
    },
    
    
    
    
    
})