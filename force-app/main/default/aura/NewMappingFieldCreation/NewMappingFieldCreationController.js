({
    doInit: function(component, event, helper) 
    {        
        //console.log('In donit')     
        component.set("v.loadingSpinner",true);
        helper.initMethod(component, event, helper);
    },  
    handleRefreshValue: function(component, event, helper) 
    {        
        component.set("v.mappingFieldsList",[]);
        //component.set("v.storedFieldsList",[]);
    },
    handleAddRow: function(component, event, helper) 
    {
        //console.log('In handleAddRow')
        helper.addNewRowInDataList(component, event, helper);        
    },
    
    handleDataTypeChange: function(component, event, helper) 
    {        
        var mappingFieldsList = component.get("v.mappingFieldsList");
        var selectedItem = event.currentTarget; 
        var index = selectedItem.dataset.value;
        if( mappingFieldsList[index].Datatype__c != '' )
            mappingFieldsList[index].valueTypeError = 'label-hidden';
        
        component.set("v.mappingFieldsList",mappingFieldsList);
    },
    
    closeObjectCreateModal: function(component, event, helper) 
    {
        //console.log('In closeObjectCreateModal')
        var cmpEvent = component.getEvent("cmpEvent");
        cmpEvent.setParams({
            "isCancelButtonClicked" : "true" 
        });
        cmpEvent.fire();
    },
    
    handleValueChange: function(component, event, helper) 
    {        
        var mappingObjectDetails = component.get("v.mappingObjectDetails");
        var selectedItem;
        var index;
        if(mappingObjectDetails.Datastore__c == 'Salesforce'){
            selectedItem = event.currentTarget; 
            index = selectedItem.dataset.value;
        }
        else
        {
            index = event.getSource().get("v.name");
        }
        //console.log('Index ::: ' + index)
        
        var mappingFieldsList = component.get("v.mappingFieldsList");
        var mappingFieldsMap = component.get("v.mappingFieldsMap");
        var mappingField = mappingFieldsList[index];
        //console.log('mappingFieldsList ::: ' + JSON.stringify(mappingFieldsList))
        //console.log('mappingField.Name',mappingFieldsMap.has(mappingField.Name))
        var duplicateField = '';
        if(mappingField.Name != ''){
            if(mappingFieldsMap.has( (mappingField.Name).toLowerCase() ))
            {           
                /*
                //console.log('mappingField.Name ::: ' + mappingField.Name)
                mappingField.valueError = mappingField.valueError + ' slds-has-error';
                mappingFieldsList[index] = mappingField;
                duplicateField = duplicateField + mappingField.Name;
                component.set("v.mappingFieldsList" , mappingFieldsList);
                component.set("v.isErrorFound",true);
                component.set("v.errorMessage","This field already present in this object : " + duplicateField);            
                component.set("v.mappingFieldsMap",mappingFieldsMap);
                helper.showErrorMessage(component, event, helper);
                */
            }
            else
            {
                mappingField.valueError = 'slds-align_absolute-center';            
                mappingFieldsList[index] = mappingField;
                component.set("v.mappingFieldsList" , mappingFieldsList);
                mappingFieldsMap.set((mappingField.Name).toLowerCase() , (mappingField.Name).toLowerCase());
                component.set("v.mappingFieldsMap",mappingFieldsMap);
            }
        }
        
    },
    handleSaveValidation: function(component, event, helper) 
    {
        //alert('In')
        if(helper.validateObjectFieldsList(component, event, helper))
        {
            //console.log('Inside')
            var triggerSaveEvent = component.getEvent("triggerSaveEvent");
            triggerSaveEvent.setParams({
                "isSaveTriggered" : "true" ,
                "type" : "Create"
            });
            triggerSaveEvent.fire();
        }
        else
        {
            helper.showErrorMessage(component, event, helper);
        }        
    },
    handleDeleteField: function(component, event, helper) 
    {                        
        var selectedItem = event.currentTarget; 
        var index = selectedItem.dataset.value;
        var mappingFieldsList = component.get("v.mappingFieldsList");
        var mappingField = mappingFieldsList[index];
        var deletedFildsList = [];
        if(component.get("v.deletedFildsList").length != 0){
            deletedFildsList = component.get("v.deletedFildsList");
        }
        var isUsed = false;
        if(component.get("v.actionType") != 'Add'){
            
            var mappingFiledIsUsed = false;
            if(mappingField.Is_Used__c != undefined && mappingField.Is_Used__c != null && mappingField.Is_Used__c !=''){
                mappingFiledIsUsed = mappingField.Is_Used__c;
            }
            
            var usedMappingObjectFieldsList = component.get("v.usedMappingObjectFieldsList");
            for(var i = 0 ; i < usedMappingObjectFieldsList.length ; i++)
            {
                var usedFieldsNameList = (usedMappingObjectFieldsList[i]).split('#*~*#') ;
                if(usedFieldsNameList[0] == mappingField.Name && mappingFiledIsUsed)
                {
                    isUsed = true;
                    component.set("v.isErrorFound",true);                                
                    if(usedFieldsNameList[1] == 'Contract Rule'){
                        component.set("v.errorMessage",'This Field is referred in Contract Rule, hence it cannot be deleted.');
                        helper.showErrorMessage(component, event, helper);
                        //helper.LightningToastmessage(component, event, helper,'Cannot delete this Object Field. It is being used in a Contract Rule.','Error');
                    }
                    else if(usedFieldsNameList[1] == 'Mapping Rule')
                    {
                        component.set("v.errorMessage",'This Field is referred in Mapping Rule, hence it cannot be deleted.');
                        helper.showErrorMessage(component, event, helper);
                        //helper.LightningToastmessage(component, event, helper,'Cannot delete this Object Field. It is being used in a Mapping Rule.','Error');
                    }
                    else if(usedFieldsNameList[1] == 'Response Rule'){
                        component.set("v.errorMessage",'This Field is referred in Response Rule, hence it cannot be deleted.');
                        helper.showErrorMessage(component, event, helper);
                        //helper.LightningToastmessage(component, event, helper,'Cannot delete this Object Field. It is being used in a Response Rule.','Error');
                    }
                    break;
                }
            }
        }
        if(!isUsed)
        {   
            if(mappingField.Id != null && mappingField.Id != ''){
                deletedFildsList.push(mappingField);
                component.set("v.deletedFildsList",deletedFildsList);
            }
            mappingFieldsList.splice(index,1); 
        }
        if(mappingFieldsList.length == 0)            {            
            mappingFieldsList = helper.getDefaultRowData(component, event, helper);  
        }        
                
        //console.log('deletedFildsList ::: ' , component.get("v.deletedFildsList"))
        component.set("v.mappingFieldsList",mappingFieldsList);
        //console.log('mappingFieldsList ::: ' , component.get("v.mappingFieldsList"))
    }
})