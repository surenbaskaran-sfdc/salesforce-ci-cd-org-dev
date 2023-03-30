({
    initMethod : function(component, event, helper) {
        //console.log('In initMethod')                
                          
        
        if(component.get("v.mappingObjectDetails.Datastore__c") == 'Salesforce'){
            helper.getFieldsList(component, event, helper);              
        }
        else
        {
            helper.getPickListFieldValues(component, event, helper);              
        }
        helper.createFieldsMap(component, event, helper);
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
                    //console.log('storeResponse ::: ' , storeResponse)
                    //console.log('fieldsTypeList ::: ' , fieldsTypeList)
                    //var parsedData = JSON.parse(storeResponse);
                    ////console.log('parsedData ::: ' , parsedData)
                    fieldsTypeList.push({'label': '--None--', 'value': ''});
                    ////console.log('storeResponse.length ::: ',storeResponse.length)
                    for(var i=0 ; i< storeResponse.length; i++)
                    {
                        //console.log('storeResponse ::: ' , JSON.parse(storeResponse[i]))
                        var pickListValue = JSON.parse(storeResponse[i]);
                        fieldsTypeList.push({   
                            'label':pickListValue.label,
                            'value':pickListValue.label
                        });
                    }                
                    if(fieldsTypeList.length!=0){
                        //console.log(fieldsTypeList.length)
                        fieldsTypeList.sort(function(a,b) {
                            var t1 = a.label == b.label, t2 = a.label < b.label;
                            return t1? 0: (fieldsTypeList?-1:1)*(t2?1:-1);
                        });
                    }                                 
                    component.set("v.dataTypeOptions",fieldsTypeList);      
                    
                    if(component.get("v.actionType") == 'Edit'){
                        var defaultTableDataTemp = helper.getDefaultRowData(component, event, helper);           
                        component.set("v.mappingFieldsList", defaultTableDataTemp); 
                        helper.setStoredValues(component, event, helper);      
                    }
                    else
                    {
                        var defaultTableDataTemp = helper.getDefaultRowData(component, event, helper);           
                        component.set("v.mappingFieldsList", defaultTableDataTemp); 
                        component.set("v.loadingSpinner",false);
                    }
                }                
            }
        });
        $A.enqueueAction(action);
    },
    
    setStoredValues : function(component, event, helper) {
        if(component.get("v.actionType") == 'Edit'){
            //console.log('actionType ::: ',component.get("v.actionType"))
            var usedMappingObjectFieldsList = component.get("v.usedMappingObjectFieldsList");
            var storedFieldsList = component.get("v.storedFieldsList");
            for(var i = 0 ; i < usedMappingObjectFieldsList.length ; i++)
            {
                
                for(var j = 0 ; j < storedFieldsList.length ; j++)
                {
                    //console.log('usedMappingObjectFieldsList[i] ::: ' , usedMappingObjectFieldsList[i])
                    var usedFieldValuesList = (usedMappingObjectFieldsList[i]).split('#*~*#');
                    var usedField = '';                    
                    usedField = usedFieldValuesList[0];                    
                    //console.log('usedField ::: ' , usedField)
                    //console.log('storedFieldsList[j].Name ::: ' , storedFieldsList[j].Name)
                    if(usedField == storedFieldsList[j].Name)
                    {
                        storedFieldsList[j].Is_Used__c = true;
                        //break;
                    }
                }
            }
            //console.log('storedFieldsList ::: ' , storedFieldsList)
            component.set("v.mappingFieldsList",storedFieldsList);
            component.set("v.loadingSpinner",false);
            
        }  
    },
    
    
    showErrorMessage : function(component, event, helper) {
        //console.log('In showErrorMessage')                             
        var errorEvent = component.getEvent("errorEvent");
        
        errorEvent.setParams({
            "isErrorFound": component.get("v.isErrorFound"),
            "errorMessage": component.get("v.errorMessage")
        });
        errorEvent.fire();
    },
    
    createFieldsMap: function(component, event, helper) {
        //console.log('In createFieldsMap')  
        var storedFieldsList = component.get("v.storedFieldsList");
        //console.log('storedFieldsList ::: ' + storedFieldsList)
        var fieldsMap = new Map();
        for(var i = 0 ; i < storedFieldsList.length ; i++)
        {
            //console.log('Name ::: ' , storedFieldsList[i].Name)
            fieldsMap.set((storedFieldsList[i].Name).toLowerCase() , (storedFieldsList[i].Name).toLowerCase());
        }
        component.set("v.mappingFieldsMap",fieldsMap);
        //component.set("v.loadingSpinner",false);
    },
    getDefaultRowData : function(component, event, helper) {
        //console.log('In getDefaultRowData')
        var defaultTableDataTemp = [];
        defaultTableDataTemp.push({            
            'Name': '',            
            'Datatype__c': '',
            'Description__c': '',   
            'labelError': '',
            'valueTypeError': '',
            'valueError': '',                     
            'isSaved': false,  
            'isDisabled': false
        });
        return defaultTableDataTemp;
    },
    addNewRowInDataList : function(component, event, helper) {        
        //console.log('In addNewRowInDataList')
        var mappingFieldsList = component.get("v.mappingFieldsList");
        mappingFieldsList.push({            
            'Name': '',            
            'Datatype__c': '',
            'Description__c': '',   
            'labelError': '',
            'valueTypeError': '',
            'valueError': '',                     
            'isSaved': false,  
            'isDisabled': false            
        });
        component.set("v.mappingFieldsList",mappingFieldsList);
    },
    getFieldsList: function(component, event, helper) {          
        //console.log('In getFieldsList')
        var mappingObjectDetails = component.get("v.mappingObjectDetails");        
        var action = component.get("c.getAllFieldsNameList");
        action.setParams({            
            "objectName" : mappingObjectDetails.Name
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();            
            if (state === "SUCCESS") 
            {
                var response = response.getReturnValue();                                
                var fieldsList = [];
                fieldsList.push({'label': '--None--', 'value': ''});
                ////console.log('response.length ::: ',response.length)
                for(var i=0 ; i< response.length; i++)
                {
                    ////console.log('res ::: ' , response[i])
                    fieldsList.push({   
                        'label':response[i],
                        'value':response[i]
                    });
                }                
                if(fieldsList.length!=0){
                    //console.log(fieldsList.length)
                    fieldsList.sort(function(a,b) {
                        var t1 = a.label == b.label, t2 = a.label < b.label;
                        return t1? 0: (fieldsList?-1:1)*(t2?1:-1);
                    });
                }                                 
                component.set("v.salesforceFieldOptions",fieldsList);                
                if(component.get("v.actionType") == 'Edit'){
                    var defaultTableDataTemp = helper.getDefaultRowData(component, event, helper);           
                    component.set("v.mappingFieldsList", defaultTableDataTemp); 
                    helper.setStoredValues(component, event, helper);      
                }
                else
                {
                    var defaultTableDataTemp = helper.getDefaultRowData(component, event, helper);           
                    component.set("v.mappingFieldsList", defaultTableDataTemp); 
                    component.set("v.loadingSpinner",false);
                }
            }
        });
        $A.enqueueAction(action);
    },
    validateObjectFieldsList: function(component, event, helper) {          
        //console.log('In validateObjectFieldsList')        
        
        var mappingFieldsList = component.get("v.mappingFieldsList");  
        
        for(var i=0 ; i < mappingFieldsList.length ; i++)
        {            
            mappingFieldsList[i].valueError = ''; 
            mappingFieldsList[i].valueTypeError = '';
        }
        component.set("v.mappingFieldsList",mappingFieldsList);
              
        var mappingFieldsListTemp = [];
        var mappingObjectDetails = component.get("v.mappingObjectDetails");    
        var mappingFieldsMap = component.get("v.mappingFieldsMap");
        var errorFields = '' , duplicateFields = '';
        var errorFieldsSet = new Set();      
        var isEmptyFieldFound = false, isDuplicateFieldFound = false;
        for(var i=0 ; i < mappingFieldsList.length ; i++)
        {
            var mappingField = mappingFieldsList[i];                                    
            if(mappingObjectDetails.Datastore__c == 'Salesforce'){                
                if( mappingField.Name == undefined || mappingField.Name == null || mappingField.Name.trim() == '' )            
                {
                    mappingField.valueError = mappingField.valueError + ' slds-has-error';                                        
                    isEmptyFieldFound = true;                    
                    errorFieldsSet.add('Field Name');                    
                }
            }
            else if(mappingObjectDetails.Datastore__c != 'Salesforce')
            {                
                if( mappingField.Name == undefined || mappingField.Name == null || mappingField.Name.trim() == '' )            
                {
                    mappingField.valueError = mappingField.valueError + ' slds-has-error';
                    isEmptyFieldFound = true;                    
                    errorFieldsSet.add('Field Name');                    
                }
                if( mappingField.Datatype__c == '' )            
                {
                    mappingField.valueTypeError = mappingField.valueTypeError + ' slds-has-error';
                    isEmptyFieldFound = true;                    
                    errorFieldsSet.add('Data Type');                    
                }
            }                
            //console.log('inside for')
            
            //console.log('mappingField ::: ' + JSON.stringify(mappingField))
            mappingFieldsListTemp.push(mappingField);
        }
        component.set("v.mappingFieldsList",mappingFieldsListTemp);          
        //console.log(Array.from(errorFieldsSet).sort())
        var errorArr = Array.from(errorFieldsSet);//.sort();
        if(errorFieldsSet.size>0){
            var errorFieldsStr = '';
            for (let item of errorArr) {
                //console.log(item)
                errorFieldsStr = errorFieldsStr + item;
                errorFieldsStr = errorFieldsStr + ', ';
            }
            //console.log('errorFieldsStr ::: ' , errorFieldsStr)
            //console.log('finale ::: ' , errorFieldsStr.substring(0,errorFieldsStr.length - 2))
            component.set("v.isErrorFound","true");
            
            var finalErrorMsg = '';
            
            finalErrorMsg = 'These required fields must be completed: ' + errorFieldsStr.substring(0,errorFieldsStr.length - 2) + '.';
            component.set("v.errorMessage",finalErrorMsg);
            return false;
        }
        if(errorFieldsSet.size == 0)
        {
            for(var i=0 ; i < mappingFieldsList.length ; i++)        
            {
                var mappingField_1 = mappingFieldsList[i];   
                //console.log('mappingField 1.Name ::: ' , mappingField_1.Name)
                for(var j = i+1 ; j < mappingFieldsList.length ; j++)        
                {
                    var mappingField_2 = mappingFieldsList[j];   
                    //console.log('mappingField_2.Name ::: ' , mappingField_2.Name)
                    if(((mappingField_1.Name).toLowerCase() == (mappingField_2.Name).toLowerCase())&&
                       (mappingField_1.Name!='')&&(mappingField_2.Name != ''))
                    {
                        
                        mappingField_2.valueError = mappingField_2.valueError + ' slds-has-error';
                        mappingField_2.valueTypeError = mappingField_2.valueTypeError + ' slds-has-error';
                        isDuplicateFieldFound = true;  
                        errorFieldsSet.add(mappingField_2.Name);                        
                    }
                }
                var storedFieldsList = component.get("v.storedFieldsList");
                //console.log('storedFieldsList ::: ' + storedFieldsList)
                if(component.get("v.actionType") != 'Edit')
                {
                    for(var k = 0 ; k < storedFieldsList.length ; k++)        
                    {
                        var mappingField_3 = storedFieldsList[k];   
                        //console.log('mappingField_3.Name ::: ' , mappingField_3.Name)
                        if((mappingField_1.Name).toLowerCase() == (mappingField_3.Name).toLowerCase())
                        {
                            
                            mappingField_1.valueError = mappingField_1.valueError + ' slds-has-error';
                            mappingField_1.valueTypeError = mappingField_1.valueTypeError + ' slds-has-error';
                            isDuplicateFieldFound = true;
                            errorFieldsSet.add(mappingField_1.Name);                            
                        }
                        if(isDuplicateFieldFound)
                            mappingFieldsListTemp[i] = mappingField_1;
                    }
                }
            }
            component.set("v.mappingFieldsList",mappingFieldsListTemp); 
            //console.log(Array.from(errorFieldsSet).sort())
            var errorArr = Array.from(errorFieldsSet);//.sort();
            if(errorFieldsSet.size>0){
                var errorFieldsStr = '';
                for (let item of errorArr) {
                    //console.log(item)
                    errorFieldsStr = errorFieldsStr + item;
                    errorFieldsStr = errorFieldsStr + ', ';
                }
                //console.log('errorFieldsStr ::: ' , errorFieldsStr)
                //console.log('finale ::: ' , errorFieldsStr.substring(0,errorFieldsStr.length - 2))
                component.set("v.isErrorFound","true");
                
                var finalErrorMsg = '';                               
                if(isDuplicateFieldFound)
                {                
                    component.set("v.isErrorFound",true);            
                    component.set("v.errorMessage","Duplicate fields found: " + errorFieldsStr.substring(0,errorFieldsStr.length - 2));
                    return false;
                }                
            }
        }
        //console.log('isDuplicateFieldFound ::: ' , isDuplicateFieldFound)
        component.set("v.mappingFieldsList",mappingFieldsListTemp);                   
        return true;
    }
    
})