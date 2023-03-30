({
	doInit: function(component, event, helper) 
    {        
        component.set("v.loadingSpinner",true);        
        helper.initContractRule(component, event, helper);        		
    },  
    handleAddRow: function (component, event, helper) 
    {
        component.set("v.showfooter", true);
        helper.handleAddRowHelper(component, event, helper);
    },        
    
    handleTransformationTypeChange: function (component, event, helper) 
    {           
        component.set("v.showfooter", true);
        helper.handleTransformationTypeChangeHelper(component, event, helper);
    },   
    handleTargetFieldChange: function (component, event, helper) 
    {
        component.set("v.showfooter", true);        
        var duplicateError = '';
        
        var responseRulesList = component.get("v.responseRulesList");
        for(var i = 0 ; i < responseRulesList.length ; i++){
            responseRulesList[i].TargetFieldError = '';   
            responseRulesList[i].SourceFieldError = '';
        }
        component.set("v.responseRulesList",responseRulesList);
        
        if(!helper.handleTargetFieldChangeHelper(component, event, helper,'Change'))
        {
			
            duplicateError = 'Duplicate target field found.';
            helper.LightningToastmessage(component, event, helper,duplicateError,'Error') 
        }
        else
        {
            var selectedItem = event.currentTarget;
            var index = selectedItem.dataset.value;   
            var responseRulesList = component.get("v.responseRulesList");
            responseRulesList[index].TargetFieldError = '';   
            component.set("v.responseRulesList",responseRulesList);
        }
        
    },   
    handleOpenTransformationModal: function (component, event, helper) {
        //console.log('In handleOpenTransformationModal') 
        var responseRulesList = component.get("v.responseRulesList");
        var selectedItem = event.currentTarget;
        var index = selectedItem.dataset.value;    
        //console.log('index ::: ' , index)
        component.set("v.mappingRuleIndex",index);
        component.set("v.responseRuleDetail",responseRulesList[index]);
        component.set("v.transformationType",responseRulesList[index].Name);
        //console.log('responseRulesList[index] ::: ' , responseRulesList[index])
        //console.log('responseRulesList[index].Name ::: ' , responseRulesList[index].Name)
        if(responseRulesList[index].Name != ''){
            //console.log('Inn')
            //console.log('Transtype ::: ',component.get("v.transformationType"))
            component.set("v.isOpenTransformationValueModal", true);
            component.set("v.showfooter", true);
        }
        else{            
            helper.LightningToastmessage(component, event, helper,'Transformation Type should not be empty','Error');
        }
    },    
    handleErrorEvent: function (component, event, helper) 
    {        
        //console.log('In errorHandling')
        component.set("v.isErrorFound", event.getParam("isErrorFound"));
        component.set("v.errorText", event.getParam("errorMessage"));        
    },
    closeTransformationTypeModals: function (component, event, helper) 
    {        
        //alert('In')
        component.set("v.isOpenTransformationValueModal", false);
        component.set("v.isErrorFound", false);
        component.set("v.errorText", ''); 
    },   
    
    closeDeleteModal: function (component, event, helper) 
    {        
        helper.closeDeleteModalHelper(component, event, helper);        
    },                             
    closeObjectCreateModal: function (component, event, helper) 
    {        
        component.set("v.isErrorFound", false);
        component.set("v.errorText", "");  
        component.set("v.isAddNewField", false);
    },    
    handleErrorEvent: function (component, event, helper) 
    {        
        component.set("v.isErrorFound", event.getParam("isErrorFound"));
        component.set("v.errorText", event.getParam("errorMessage"));        
    },    
    handleCancelCreateContractRules: function (component, event, helper) 
    {              
        //console.log('Inn handleCancelCreateContractRules')
        component.set("v.isErrorFound", false);
        component.set("v.errorText", "");        
        component.set("v.isAddNewRule", false);
    },
    handleSaveEditObjectField: function (component, event, helper) 
    {              
        
        component.set("v.editObjectField",false);
    },
    
    onclickSaveTransformationValue: function (component, event, helper) 
    {
		//console.log('In onclickSaveTransformationValue')        
        helper.onclickSaveTransformationValueHelper(component, event, helper); 
        
    },
    
    handleSaveTransformationValue: function (component, event, helper) 
    {
		//console.log('In handleSaveTransformationValue')        
        helper.handleSaveTransformationValueHelper(component, event, helper); 
        
    },
    
    onclickCancelMappingRules: function (component, event, helper) 
    {
		//console.log('In onclickCancelMappingRules')        
        component.set("v.showfooter", false);   
        component.set("v.loadingSpinner",true);
        helper.initContractRule(component, event, helper);  
    },
    onclickSaveMappingRules: function (component, event, helper) 
    {
		//console.log('In onclickSaveMappingRules')        
        component.set("v.loadingSpinner",true);
        if(helper.validateMappingRuleListHelper(component, event, helper)){   
            component.set("v.showfooter", false);
            helper.saveMappingRulesList(component, event, helper)}
    },
    handleDeleteLabelPopup: function (component, event, helper) 
    {
        //console.log('In handleDeleteLabelPopup')
        
        var selectedItem = event.currentTarget;
        var index = selectedItem.dataset.value;                    
        //console.log('index ::: ' , index)
        component.set("v.mappingRuleIndex",index);
        var responseRulesList = component.get("v.responseRulesList");
        component.set("v.responseRuleDetail",responseRulesList[index]);
        var responseRuleDetail = component.get("v.responseRuleDetail");
        if((responseRuleDetail.Source_Field__c == '' && responseRuleDetail.Target_Field__c == ''))
        {
            responseRulesList.splice(index, 1);
            component.set("v.responseRulesList" , responseRulesList);
        }
        else
        {
            component.set("v.onDeleteClick",true);
        }
    },
    handleDeleteMappingRule: function (component, event, helper) 
    {
		//console.log('In handleDeleteMappingRule')     
        component.set("v.onDeleteClick",false);
        helper.handleDeleteMappingRuleHelper(component, event, helper)
    },
    handleOnCheckMandatory: function (component, event, helper) 
    {
		//console.log('In handleOnCheckMandatory')             
        component.set("v.showfooter", true);        
    },
    handleOnCheckAllowedForUpdate: function (component, event, helper) 
    {
		//console.log('In handleOnCheckAllowedForUpdate')     
        component.set("v.showfooter", true);        
    },
    onPressKey: function (component, event, helper) {
        helper.onPressKeyboardKey(component, event, helper);
    },
    
})