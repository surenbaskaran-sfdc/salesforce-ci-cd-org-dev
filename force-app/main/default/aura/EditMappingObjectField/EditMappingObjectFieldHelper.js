({
    getFieldsList: function(component, event, helper) {          
        var mappingObjectDetail = component.get("v.mappingObjectDetail");        
        var action = component.get("c.getAllFieldsNameList");
        action.setParams({            
            "objectName" : mappingObjectDetail.Name
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();            
            if (state === "SUCCESS") 
            {
                var response = response.getReturnValue();                                
                var fieldsList = [];
                fieldsList.push({'label': '--None--', 'value': ''});
                for(var i=0 ; i< response.length; i++)
                {
                    fieldsList.push({   
                        'label':response[i],
                        'value':response[i]
                    });
                }                
                if(fieldsList.length!=0){
                    fieldsList.sort(function(a,b) {
                        var t1 = a.label == b.label, t2 = a.label < b.label;
                        return t1? 0: (fieldsList?-1:1)*(t2?1:-1);
                    });
                }                                 
                component.set("v.salesforceFieldOptions",fieldsList);                
            }
        });
        $A.enqueueAction(action);
    },
    escapeEventHelper: function (component, event, helper) {        
        window.addEventListener("keydown", $A.getCallback(function (event) {
            if (event.code == 'Escape') {                
                var cancelEditEvent = component.getEvent("cancelEditEvent");
                cancelEditEvent.setParams({
                    "isCancelButtonClicked" : "false" 
                });
                cancelEditEvent.fire();
            }
        }, true));
    },
	getPickListFieldValues : function(component, event, helper) {
        
        var action = component.get("c.getAllPickListValues");
        action.setParams({
            "objectName" : "Mapping_Object_Field__c",
            "fieldName" : "Datatype__c"            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();                
                if(storeResponse.length>0)
                {                    
                    var fieldsTypeList = [];                    
                    fieldsTypeList.push({'label': '--None--', 'value': ''});
                    for(var i=0 ; i< storeResponse.length; i++)
                    {
                        var pickListValue = JSON.parse(storeResponse[i]);
                        fieldsTypeList.push({   
                            'label':pickListValue.label,
                            'value':pickListValue.value
                        });
                    }                
                    if(fieldsTypeList.length!=0){
                        fieldsTypeList.sort(function(a,b) {
                            var t1 = a.label == b.label, t2 = a.label < b.label;
                            return t1? 0: (fieldsTypeList?-1:1)*(t2?1:-1);
                        });
                    }                                 
                    component.set("v.dataTypePicklistValues",fieldsTypeList); 
                    //alert(JSON.stringify(component.get("v.mappingObjectFieldDetail")))
                    
                    //component.set("v.mappingObjectFieldDetail.Datatype__c",'Currency')
                }                
            }
        });
        $A.enqueueAction(action);
    },
    onAccordianClickHelper:function (component, event,helper) 
    {        
        if(component.get("v.openSystemInformation"))
        {         
            component.set("v.Systemicon","utility:chevronright");
            component.set("v.openSystemInformation",false);
        }            
        else
        {            
            component.set("v.Systemicon","utility:chevrondown");
            component.set("v.openSystemInformation",true);
        }                 
    },
    validateMappingObjectFieldData:function (component, event,helper) 
    {      
        var errorFields = '';
        var isDuplicate = false, isEmpty = false
        var mappingObjectFieldDetail = component.get("v.mappingObjectFieldDetail");
        var mappingObjectFieldsList = component.get("v.mappingObjectFieldsList");
        
        var count = 0;
        for(var i = 0 ; i < mappingObjectFieldsList.length ; i++)
        {
            if((mappingObjectFieldDetail.Name).toLowerCase() != ((JSON.parse(component.get("v.mappingObjectFieldDetailStr")).Name).toLowerCase()))
            if((mappingObjectFieldsList[i].Name).toLowerCase() == (mappingObjectFieldDetail.Name).toLowerCase() )
            {
                count++;                
            }
            if(count>1)
            {
                component.set("v.isErrorFound",true);                
                isDuplicate = true;
                if(component.get("v.mappingObjectDetail.Datastore__c") == 'SAP')
                    component.set("v.objectFieldError" ,'slds-has-error');         
                else
                    component.set("v.objectFieldError" ,'slds-has-error');                        
                break;
            }
            if(mappingObjectFieldDetail.Name == undefined || mappingObjectFieldDetail.Name == null || mappingObjectFieldDetail.Name.trim() == '' )
            {
                component.set("v.isErrorFound",true);                
                isEmpty = true;
                errorFields = 'Field Name';
                if(component.get("v.mappingObjectDetail.Datastore__c") == 'SAP')
                    component.set("v.objectFieldError" ,'slds-has-error');         
                else
                    component.set("v.objectFieldError" ,'slds-has-error');         
                break;
            }
        }
        if(component.get("v.mappingObjectDetail.Datastore__c") == 'SAP'){
            if(mappingObjectFieldDetail.Datatype__c == '')
            {
                errorFields = ', Datatype';
                component.set("v.DatastoreError" ,'slds-has-error');   
            }
        }
        if(isDuplicate)
            component.set("v.errorText","These required field is duplicate field : Field Name");
        if(isEmpty){
            if(errorFields!='')
                component.set("v.errorText","These required fields must be completed : " , errorFields);
        }
        
        return (!component.get("v.isErrorFound"));
    },
    OnClickSaveRecordHelper:function (component, event,helper) 
    {      
        var mappingObjectFieldDetail = component.get("v.mappingObjectFieldDetail");
        var finalMappingObjectFieldsList = [];        
        
        finalMappingObjectFieldsList.push({
            'Id':mappingObjectFieldDetail.Id ,
            'Name':mappingObjectFieldDetail.Name ,
            'Description__c' : mappingObjectFieldDetail.Description__c ,
            'Datatype__c' : mappingObjectFieldDetail.Datatype__c ,
            'Object__c' : component.get("v.mappingObjectDetail.Id")
        });
        
        var action = component.get("c.saveMappingObjectFieldsList");
        action.setParams({            
            "mappingObjectFields" : finalMappingObjectFieldsList
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();                
                component.set("v.loadingSpinner",false);
                helper.LightningToastmessage(component, event, helper,"Field saved successfully.","Success");
                
                $A.get('e.force:refreshView').fire();
                
                var triggerSaveEvent = component.getEvent("triggerSaveEvent");
                triggerSaveEvent.setParams({
                    "isSaveTriggered" : "true" ,
                    "type" : "Edit"
                });
                triggerSaveEvent.fire();
                
            }
        });
        $A.enqueueAction(action);       
    },
    LightningToastmessage : function(component, event, helper,message,toasttype) 
    {  
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({            
            "type":toasttype,            
            "message": message
        });
        toastEvent.fire();
    },
})