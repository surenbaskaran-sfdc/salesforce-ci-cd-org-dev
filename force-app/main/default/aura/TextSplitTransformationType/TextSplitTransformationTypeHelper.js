({
    handleGetMappingFieldsDetails: function(component,event,helper) 
    {
        console.log('In handleGetMappingFieldsDetails')
        var fieldType = '';
        if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce' )
            fieldType = 'TEXT';
        else
            fieldType = 'STRING';
        
        var action = component.get("c.getMappingObjectAndFieldsDetails");
        action.setParams({
            "objectName": component.get("v.contractRuleDetail.Source_Object__c"),
            "dataStore": component.get("v.mappingContractDetail.Source_Datastore__c"),
            "type":fieldType            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                //console.log('storeResponse ::: '+ JSON.stringify(storeResponse))                    
                if(storeResponse.length>0)
                {
                    component.set("v.mappingObjectDetails",storeResponse[0]);
                    //console.log('storeResponse ::: ' , storeResponse)
                    
                    var mappingObjectFieldsList = [];
                    for(var i = 0 ; i < storeResponse[1].length ; i++ )
                    {
                        mappingObjectFieldsList.push(
                            {
                                'label': storeResponse[1][i].Name,
                                'value': storeResponse[1][i].Name
                            }
                        );
                    }
                    
                    if(mappingObjectFieldsList.length > 0){
                        mappingObjectFieldsList.sort(function(a,b) {
                            var t1 = a.label == b.label, t2 = a.label < b.label;
                            return t1? 0: (mappingObjectFieldsList?-1:1)*(t2?1:-1);
                        });
                    }
                    
                    component.set("v.textSplitFieldOptions",mappingObjectFieldsList);                                        
                    component.set("v.loadingSpinner",false);   
                    console.log('Dev value :::: ', component.get("v.mappingRuleDetail.Dev_value__c"))
                    if(component.get("v.mappingRuleDetail.Dev_value__c") != '' && component.get("v.mappingRuleDetail.Dev_value__c") != undefined )
                    {
                        var devValue = JSON.parse(component.get("v.mappingRuleDetail.Dev_value__c"));
                        //console.log('devValue ::: ' , devValue)
                        component.set("v.textSplitFieldData",devValue.FieldName);
                        component.set("v.preValue",devValue.PreValue);
                        component.set("v.postValue",devValue.PostValue);
                        component.set("v.startPosition",devValue.StartPosition);
                        component.set("v.endPosition",devValue.EndPosition);                                                                        
                    }
                }   
                
                window.setTimeout(
                    $A.getCallback(function() {
                        if(component.find("textSplit")!= undefined){
                            component.find("textSplit").focus();
                        }
                    }), 1
                );
                
            }
        });
        $A.enqueueAction(action);                
    },
    handleValidateTransformationValueHelper : function(component, event, helper) {
        //console.log('In handleValidateTransformationValueHelper')
        var isValidStart = true;
        var isValidEnd = true;
        var errorFieldsSet = new Set();         
        component.set("v.startPositionError",'');
        component.set("v.endPositionError",'');
        component.set("v.textSplitFieldDataError",'');
        
        //console.log(component.get("v.textSplitFieldData"))
        if(component.get("v.textSplitFieldData") == '' ){
            component.set("v.textSplitFieldDataError",'slds-has-error');
            component.set("v.isErrorFound","true");
            errorFieldsSet.add('Field Name');
        }
        //console.log(component.get("v.startPosition"))        
        if(component.get("v.startPosition") == '' || component.get("v.startPosition") == null ){
            component.set("v.startPositionError",' slds-has-error ');
            component.set("v.isErrorFound","true");
            errorFieldsSet.add('Start Position');
        }    
        else if(parseInt(component.get("v.startPosition")) <0 /*|| parseInt(component.get("v.startPosition")) >= 100*/)
        {            
            component.set("v.startPositionError",' slds-has-error ');
            component.set("v.isErrorFound","true");            
            isValidStart = false;
        }
        //console.log(component.get("v.endPosition"))
        if(component.get("v.endPosition") == '' || component.get("v.endPosition") == null ){
            component.set("v.endPositionError",'slds-has-error');
            component.set("v.isErrorFound","true");
            errorFieldsSet.add('End Position');
        }    
        else if(/*parseInt(component.get("v.endPosition")) > 100 ||*/ parseInt(component.get("v.endPosition")) < 0)
        {
            component.set("v.endPositionError",'slds-has-error');
            component.set("v.isErrorFound","true");            
            isValidEnd = false;
        }        
        var startPosition = component.get("v.startPosition") ;
        var endPosition = component.get("v.endPosition") ;
        var errorArr = Array.from(errorFieldsSet);        
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
            
            var finalErrorMsg = 'These required fields must be completed: ' + errorFieldsStr.substring(0,errorFieldsStr.length - 2) +'.';
            component.set("v.errorText",finalErrorMsg);   
            
            helper.showErrorMessageHelper(component, event, helper);
        }
        else if(!isValidEnd && isValidStart)
        {
            component.set("v.isErrorFound","true");            
            var finalErrorMsg = 'Invalid End Position Value. Please provide valid value.';            
            component.set("v.endPositionError",'slds-has-error');
            component.set("v.errorText",finalErrorMsg);
            helper.showErrorMessageHelper(component, event, helper);
        }
            else if(!isValidStart && isValidEnd)
            {
                component.set("v.isErrorFound","true");            
                var finalErrorMsg = 'Invalid Start Position Value. Please provide valid value.';
                component.set("v.startPositionError",'slds-has-error');
                component.set("v.errorText",finalErrorMsg);
                helper.showErrorMessageHelper(component, event, helper);
            }
                else if(!isValidStart && !isValidEnd)
                {
                    component.set("v.isErrorFound","true");            
                    var finalErrorMsg = 'Invalid Start Position and End Position Values. Please provide valid values.';
                    component.set("v.startPositionError",'slds-has-error');
                    component.set("v.endPositionError",'slds-has-error');
                    component.set("v.errorText",finalErrorMsg);
                    helper.showErrorMessageHelper(component, event, helper);
                }
                    else if( parseInt(startPosition) > parseInt(endPosition) || parseInt(startPosition) == parseInt(endPosition)){                        
                        component.set("v.isErrorFound","true");            
                        var finalErrorMsg = 'Start Position should not greater than or equal to End Position.';
                        component.set("v.startPositionError",'slds-has-error');
                        component.set("v.endPositionError",'slds-has-error');
                        component.set("v.errorText",finalErrorMsg);
                        helper.showErrorMessageHelper(component, event, helper);
                    }                
                        else
                        {
                            //console.log('Inside')
                            helper.createTextSplitData(component, event, helper);
                            var triggerSaveEvent = component.getEvent("triggerSaveEvent");
                            triggerSaveEvent.setParams({
                                "isSaveTriggered" : "true" ,
                                "type" : "Text Split"
                            });
                            triggerSaveEvent.fire();
                        }
    },
    
    showErrorMessageHelper: function(component, event, helper) {
        var errorEvent = component.getEvent("errorEvent");            
        errorEvent.setParams({
            "isErrorFound": component.get("v.isErrorFound"),
            "errorMessage": component.get("v.errorText")
        });
        errorEvent.fire();
    },
    
    createTextSplitData: function(component, event, helper,message) {
        //console.log('In createTextSplitData')
        
        var displayData = '<';
        var fieldName = component.get("v.textSplitFieldData");
        var preValue = component.get("v.preValue");
        var postValue = component.get("v.postValue");
        var startPosition = parseInt(component.get("v.startPosition"));
        var endPosition = parseInt(component.get("v.endPosition"));
        
        displayData = displayData + fieldName + '*' + preValue +'*' + startPosition + '*' + endPosition + '*' + postValue +'>';
        //console.log('displayData ::: ' , displayData)
        
        var devValue = '';
        devValue = devValue + '{\"FieldName\":\"'+fieldName +'\",';
        devValue = devValue + '\"PreValue\":\"'+preValue +'\",';
        devValue = devValue + '\"PostValue\":\"'+postValue +'\",';
        devValue = devValue + '\"StartPosition\":\"'+startPosition +'\",';
        devValue = devValue + '\"EndPosition\":\"'+endPosition +'\"}';
        //console.log('devValue ::: ' , JSON.parse(devValue));
        component.set("v.DevValue" , devValue);
        component.set("v.DisplayValue" , displayData);
    }      
})