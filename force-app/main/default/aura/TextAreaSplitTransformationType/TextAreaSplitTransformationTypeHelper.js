({
	initContractRule : function(component, event, helper) 
    {     
        //console.log('In initfunc')
        helper.getDefaultTextAreaSplitValue(component, event, helper);   
        helper.handleGetMappingFieldsDetails(component, event, helper);         
    },
    handleGetMappingFieldsDetails: function(component,event,helper) 
    {
        //console.log('In handleGetMappingFieldsDetails')
        var dataType = '';
        if(component.get("v.mappingContractDetail.Source_Datastore__c") != 'Salesforce')
            dataType = dataType + "Text Area";
        else
            dataType = dataType + "TEXTAREA";
        var action = component.get("c.getMappingObjectAndFieldsDetails");
        action.setParams({
            "objectName": component.get("v.contractRuleDetail.Source_Object__c"),
            "dataStore": component.get("v.mappingContractDetail.Source_Datastore__c"),
            "type":dataType
            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                //console.log('Source object values ::: '+ JSON.stringify(storeResponse))                    
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
                    
                    component.set("v.textAreaSplitFieldOptions",mappingObjectFieldsList);                                        
                    component.set("v.loadingSpinner",false);   
                    //console.log('Dev value :::: ', component.get("v.mappingRuleDetail.Dev_value__c"))
                    if(component.get("v.mappingRuleDetail.Dev_value__c") != '' && component.get("v.mappingRuleDetail.Dev_value__c") != undefined )
                    {
                        var devValue = JSON.parse(component.get("v.mappingRuleDetail.Dev_value__c"));
                        //console.log('devValue ::: ' , devValue)
                        component.set("v.textAreaSplitFieldData",devValue.FieldName);
                        component.set("v.textAreaSplitList",devValue.TextAreaSplitList);                        
                    }
                }  
                
                window.setTimeout(
                    $A.getCallback(function() {
                        if(component.find("textAreaSplit")!= undefined){
                            component.find("textAreaSplit").focus();
                        }
                    }), 1
                );
                
            }
        });
        $A.enqueueAction(action);                
    },
    
    getDefaultTextAreaSplitValue : function(component, event, helper) 
	{
        //console.log('In getDefaultTextAreaSplitValue')
        var defaultTableDataTemp = [];
        defaultTableDataTemp.push({    
            'lineno': '',
            'linenoError': '',
            'preValue':'',
            'startPosition': '',
            'startPositionError': '',
            'startPositionErrorMsg': '',
            'endPosition': '',
            'endPositionError': '',
            'endPositionErrorMsg': '',
            'postValue':''           
        });
        //console.log(JSON.stringify(defaultTableDataTemp))
        component.set("v.textAreaSplitList",defaultTableDataTemp);
    },
    handleAddTextAreaSplitValueHelper : function(component, event, helper) 
    {
        //console.log('In handleAddTextAreaSplitValueHelper')
        var defaultTableDataTemp = component.get("v.textAreaSplitList");
        defaultTableDataTemp.push({      
            'lineno': '',
            'linenoError': '',
            'preValue':'',
            'startPosition': '',
            'startPositionError': '',
            'startPositionErrorMsg': '',
            'endPosition': '',
            'endPositionError': '',
            'endPositionErrorMsg': '',
            'postValue':''   
        });
        //console.log(JSON.stringify(defaultTableDataTemp))
        component.set("v.textAreaSplitList",defaultTableDataTemp);
    },
    
    handleDeleteRowHelper : function(component, event, helper) {
        var textAreaSplitList = component.get("v.textAreaSplitList");
        var selectedItem = event.currentTarget;
        var index = selectedItem.dataset.value;
        if(textAreaSplitList.length >1)
        {
            textAreaSplitList.splice(index, 1);
            component.set("v.textAreaSplitList", textAreaSplitList);
        }
        else
        {     
            component.set("v.isErrorFound",true)
            component.set("v.errorText",'Transformation should have atleast one row of transformation value.')
            var errorEvent = component.getEvent("errorEvent");            
            errorEvent.setParams({
                "isErrorFound": component.get("v.isErrorFound"),
                "errorMessage": component.get("v.errorText")
            });
            errorEvent.fire();
        }
    },
    handleValidateTransformationValueHelper : function(component, event, helper) {
        //console.log('In handleValidateTransformationValueHelper')
        
        var textAreaSplitList = component.get("v.textAreaSplitList");
        
        for(var i = 0 ; i < textAreaSplitList.length ; i ++)
        {
            textAreaSplitList[i].linenoError = '';
            textAreaSplitList[i].startPositionError = '';
            textAreaSplitList[i].endPositionError = '';
        }        
        component.set("v.isErrorFound","false");
        component.set("v.errorText",'');
        component.set("v.textAreaSplitList",textAreaSplitList);
        
        var errorFieldsSet = new Set();         
        //console.log(component.get("v.textAreaSplitFieldData"))
        if(component.get("v.textAreaSplitFieldData") == '' ){
            component.set("v.textAreaSplitFieldDataError",'slds-has-error');
            component.set("v.isErrorFound","true");
            errorFieldsSet.add('Field Name');
        }
                        
        for(var i = 0 ; i < textAreaSplitList.length ; i ++)
        {
            
            //console.log(textAreaSplitList[i])
            //alert(typeof textAreaSplitList[i].lineno +'---------'+textAreaSplitList[i].lineno)
            if(textAreaSplitList[i].lineno == undefined || textAreaSplitList[i].lineno == null || textAreaSplitList[i].lineno.length == 0  )
            {            
                errorFieldsSet.add('Line number');
                textAreaSplitList[i].linenoError = 'slds-has-error';
            }            
            else
            {                
                textAreaSplitList[i].linenoError = '';
            }
            if(textAreaSplitList[i].startPosition == undefined || textAreaSplitList[i].startPosition == null || textAreaSplitList[i].startPosition.length == 0 )
            {
                errorFieldsSet.add('Start position');
                
                textAreaSplitList[i].startPositionError = 'slds-has-error';
            }            
            else
            {
                textAreaSplitList[i].startPositionError = '';
            }
            if(textAreaSplitList[i].endPosition == undefined || textAreaSplitList[i].endPosition == null || textAreaSplitList[i].endPosition.length == 0 )
            {
                errorFieldsSet.add('End position');
                textAreaSplitList[i].endPositionError = 'slds-has-error';
            } 
            else
            {
                textAreaSplitList[i].endPositionError = '';
            }                                        
        }
        component.set("v.textAreaSplitList" , textAreaSplitList);
        
        var errorArr = Array.from(errorFieldsSet);//.sort();
        var isValidValueGiven= true;        
        if(errorFieldsSet.size>0)
        {
            var errorFieldsStr = '';
            for (let item of errorArr) {
                //console.log(item)
                errorFieldsStr = errorFieldsStr + item;
                errorFieldsStr = errorFieldsStr + ', ';
            }
            //console.log('errorFieldsStr ::: ' , errorFieldsStr)
            //console.log('finale ::: ' , errorFieldsStr.substring(0,errorFieldsStr.length - 2))
            var finalError = 'These required fields must be completed: ' + errorFieldsStr.substring(0,errorFieldsStr.length - 2) + '.';
            
            component.set("v.isErrorFound","true");
            component.set("v.errorText",finalError);
            helper.showErrorMessageHelper(component, event, helper); 
        } 
        if(errorFieldsSet.size < 1 && component.get("v.isErrorFound") == "false")
        {
            
            for(var i = 0 ; i < textAreaSplitList.length ; i ++)
            {
                if(parseInt(textAreaSplitList[i].lineno) < 0)
                {                    
                    textAreaSplitList[i].linenoError = 'slds-has-error';
                    isValidValueGiven= false;
                }            
                else
                {
                    textAreaSplitList[i].linenoError = '';
                }
                if(parseInt(textAreaSplitList[i].startPosition) < 0)
                {                    
                    textAreaSplitList[i].startPositionError = 'slds-has-error';
                    isValidValueGiven= false;
                }            
                else
                {
                    textAreaSplitList[i].startPositionError = '';
                }
                if(parseInt(textAreaSplitList[i].endPosition) < 0 )
                {
                    textAreaSplitList[i].endPositionError = 'slds-has-error';
                    isValidValueGiven= false;
                } 
                else
                {
                    textAreaSplitList[i].endPositionError = '';
                }
            }
            component.set("v.textAreaSplitList" , textAreaSplitList);
            
            var invalidErrorMsg = '';
            if(!isValidValueGiven)
            {
                invalidErrorMsg = 'Invalid values provided. Please provide values greater than or equal to 0.';
                var finalError = invalidErrorMsg;                
                component.set("v.isErrorFound","true");
                component.set("v.errorText",finalError);
                helper.showErrorMessageHelper(component, event, helper);  
            }
        }
        if(isValidValueGiven && component.get("v.isErrorFound") == "false")
        {
            //console.log('Innn')
            
            component.set("v.isErrorFound","false");
            component.set("v.errorText",'');
            var isGreaterErrorFound = false;
            var greaterValueError = '';
            for(var i = 0 ; i < textAreaSplitList.length ; i ++)
            {                
                if(parseInt(textAreaSplitList[i].startPosition) > parseInt(textAreaSplitList[i].endPosition)
                  || parseInt(textAreaSplitList[i].startPosition) == parseInt(textAreaSplitList[i].endPosition))
                {
                    textAreaSplitList[i].startPositionError = 'slds-has-error';                
                    textAreaSplitList[i].endPositionError = 'slds-has-error';
                    isGreaterErrorFound = true;
                    
                }
                else if((textAreaSplitList[i].startPosition != '' &&  parseInt(textAreaSplitList[i].startPosition) > 0)
                        ||(textAreaSplitList[i].endPosition != '' && parseInt(textAreaSplitList[i].endPosition) > 0))
                {
                    textAreaSplitList[i].startPositionError = '';
                    textAreaSplitList[i].endPositionError = '';
                }
            }
            component.set("v.textAreaSplitList" , textAreaSplitList);
            if(isGreaterErrorFound)
            {
                greaterValueError = 'Start Position should not greater than or equal to End Position.';
                var finalError = greaterValueError;                
                component.set("v.isErrorFound","true");
                component.set("v.errorText",finalError);
                helper.showErrorMessageHelper(component, event, helper); 
            }
        }
        
        var isReadyToSave = component.get("v.isErrorFound");
        if(isReadyToSave == "false" && isValidValueGiven == true) 
        {
            component.set("v.isErrorFound","false");
            //console.log('Inside')            
            helper.createTextAreaSplitData(component, event, helper);
            var triggerSaveEvent = component.getEvent("triggerSaveEvent");
            triggerSaveEvent.setParams({
                "isSaveTriggered" : "true" ,
                "type" : "Text Area Split"
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
    
    createTextAreaSplitData: function(component, event, helper,message) {
        //console.log('In createTextAreaSplitData')
        
        var displayData = '<';
        var fieldName = component.get("v.textAreaSplitFieldData");
        var textAreaSplitList = component.get("v.textAreaSplitList");
			
        displayData = displayData + fieldName ;
        
		for(var i = 0 ; i < textAreaSplitList.length ; i++)
        {
            console.log('textAreaSplitList[i] ::: ' , textAreaSplitList[i])
           
            textAreaSplitList[i].lineno = parseInt(textAreaSplitList[i].lineno)
            textAreaSplitList[i].startPosition = parseInt(textAreaSplitList[i].startPosition)
            textAreaSplitList[i].endPosition = parseInt(textAreaSplitList[i].endPosition)
            var listVal = '<'
            listVal = listVal + parseInt(textAreaSplitList[i].lineno) + '*'+ textAreaSplitList[i].preValue +'*' + parseInt(textAreaSplitList[i].startPosition) + '*' + parseInt(textAreaSplitList[i].endPosition) + '*' + textAreaSplitList[i].postValue +'>';
            displayData = displayData +'*'+ listVal;
        }
        displayData = displayData +'>';
        console.log('displayData ::: ' , displayData)
        
        var devValue = '';
        devValue = devValue + '{\"FieldName\":\"'+fieldName +'\",';
        devValue = devValue + '\"TextAreaSplitList\":'+JSON.stringify(textAreaSplitList) +'}';        
        //console.log('devValue ::: ' , devValue)
        //console.log('devValue ::: ' , JSON.parse(devValue));
        component.set("v.DevValue" , devValue);
        component.set("v.DisplayValue" , displayData);
    },
})