({
	initIntegrationMapping : function(component, event, helper) 
    {     
        //console.log('In initMappingContract')
        var integrationMappingDetail = component.get("v.integrationMappingDetail");
        component.set("v.mappingContractNameError" , "");
        component.set("v.mappingContractSourceDatastoreError" , "");
        component.set("v.mappingContractTargetDatastoreError" , "");
        component.set("v.mappingContractEndPointURLError" , "");
        
        integrationMappingDetail.Name = '';
        integrationMappingDetail.Mapping_Contract__c = '';
        //integrationMappingDetail.Contract_Rule__c = '';        
        integrationMappingDetail.Record_Type__c = '';
        integrationMappingDetail.Source_Datastore__c = 'Salesforce';
        //integrationMappingDetail.Target_Datastore__c = '';
        integrationMappingDetail.Source_Object__c = '';        
        //integrationMappingDetail.Target_Object__c = '';
        integrationMappingDetail.Button__c = '';        
        
        component.set("v.integrationMappingDetail", integrationMappingDetail);
        
        component.set("v.isErrorFound" , "false");
        component.set("v.errorText" , "");             
        
        helper.getAllRequiredDataMap(component, event, helper);  
        
        component.set("v.loadingSpinner",false);   
        //component.set("v.mappingContractDetail.Active__c",true);
                
    },
    getAllRequiredDataMap : function(component, event, helper) 
    { 
        //console.log('In getAllRequiredDataMap')
        var action = component.get("c.createNewIntegrationMapping");  
        action.setParams({      
            'objectName':'Integration_Mapping__c',
            'recId':null,            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var resultList = response.getReturnValue();         
                console.log(resultList)                 
                
                for ( var key in resultList ) 
                {
                    //console.log('Key ::: ' + key);
                    switch (key){
                        case 'TargetDatasore':                            
                            //console.log(resultList[key]);
                            var targetDatastorePickListValues = resultList[key];
                            var targetDatastoreList = [];
                            
                            for(var i=0 ; i< targetDatastorePickListValues.length; i++)
                            {
                                //console.log('1 ::: ' , targetDatastorePickListValues[i])
                                //console.log('2 ::: ' , targetDatastorePickListValues[i]['Target_Datastore__c'])
                                //console.log('targetDatastorePickListValues ::: ' , JSON.parse((targetDatastorePickListValues[i])['Target_Datastore__c']))
                                var pickListValue = JSON.parse((targetDatastorePickListValues[i])['Target_Datastore__c']);
                                targetDatastoreList.push({   
                                    'label':pickListValue.label,
                                    'value':pickListValue.label
                                });
                            }                                                          
                            //console.log('targetDatastoreList ::: ' + targetDatastoreList);
                            component.set("v.targetDatastoreList", targetDatastoreList);
                            break;
                        case 'Objects':                            
                            //console.log(resultList[key]);
                            component.set("v.allObjectList",resultList[key])
                            var sourceObjectList = component.get("v.sourceObjectList");                            
                            for(var value in resultList[key])
                            {
                                //console.log('value 1 ::: ' + resultList[key][value])
                                //console.log('value 2 ::: ' + resultList[key][value]['Datastore__c'])
                                //console.log('Source_Datastore__c ::: ' + component.get("v.integrationMappingDetail.Source_Datastore__c"))
                                if(resultList[key][value]['Datastore__c'] == component.get("v.integrationMappingDetail.Source_Datastore__c"))
                                {
                                    //console.log('value 3 ::: ' + resultList[key][value]['Name'])
                                    sourceObjectList.push({   
                                        'label':resultList[key][value]['Name'],
                                        'value':resultList[key][value]['Name']
                                    });
                                }                                
                            }
                            component.set("v.sourceObjectList",sourceObjectList);                            
                            break;
                        case 'Buttons':                            
                            //console.log(resultList[key]);
                            component.set("v.allButtonsList",resultList[key])
                            break;
                        case 'MappingContracts':                            
                            //console.log(resultList[key]);
                            component.set("v.allMCandCRList",resultList[key])                            
                            break;       
                        case 'IntegrationMappinglist':                            
                            //console.log(resultList[key]);
                            component.set("v.IntegrationMappingsList",resultList[key])                            
                            break;   
                            
                    }
                }                
                window.setTimeout(
                    $A.getCallback(function() {
                        //console.log('mappingName ::: ',component.find("mappingName"))
                        var mapping = component.find("mappingName");
                        if ($A.util.isArray(mapping)) {
                            for(var i=0;i<mapping.length;i++){
                                mapping[i].focus();
                            }
        				}
                        else{
                            component.find("mappingName").focus();
                        }
                        /*if(component.find("mappingName")!= undefined)
                        {
                            component.find("mappingName").focus();
                        }*/
                    }), 1
                );
            }
        });
        $A.enqueueAction(action);
    },
    
    /*onChangeTargetDatastoreHelper : function(component, event, helper) 
    {              
        var allObjectList = component.get("v.allObjectList")
   		console.log('allObjectList',allObjectList)
        var targetObjectList = [];
        for(var value in allObjectList)
        {
            console.log('value 1 ::: ' + allObjectList[value])
            console.log('value 2 ::: ' + allObjectList[value]['Datastore__c'])
            //console.log('Target_Datastore__c ::: ' + component.get("v.integrationMappingDetail.Target_Datastore__c"))
            if(allObjectList[value]['Datastore__c'] == component.get("v.integrationMappingDetail.Target_Datastore__c"))
            {
                //console.log('value 3 ::: ' + allObjectList[value]['Name'])
                targetObjectList.push({   
                    'label':allObjectList[value]['Name'],
                    'value':allObjectList[value]['Name']
                });
            }                                
        }
        component.set("v.targetObjectList",targetObjectList);    
    },*/
    onChangeSourceObjectHelper: function(component, event, helper) 
    {
       // console.log('In onChangeSourceObjectHelper')
        var allButtonsList = component.get("v.allButtonsList");
        var buttonsList= [];
        for(var value in allButtonsList)
        {
            //console.log('value 1 ::: ' + allButtonsList[value])
            //console.log('value 2 ::: ' + allButtonsList[value]['PageOrSobjectType'])
            //console.log('Source_Object__c ::: ' + component.get("v.integrationMappingDetail.Source_Object__c"))
            if(allButtonsList[value]['PageOrSobjectType'] == component.get("v.integrationMappingDetail.Source_Object__c"))
            {
                console.log('value 3 ::: ' + allButtonsList[value]['Name'])
                buttonsList.push({   
                    'label':allButtonsList[value]['Name'],
                    'value':allButtonsList[value]['Name']
                });
            }                                
        }
        buttonsList.push({   
                    'label':'On Save',
                    'value':'On Save'
                }); 
        //console.log('buttonsList ::: ' + buttonsList)
        component.set("v.buttonsList",buttonsList); 
        component.set("v.nonQuickActionListSize",buttonsList.length);        
        helper.getQuickAcitionsListHelper(component, event, helper);
        
    },
    getQuickAcitionsListHelper: function(component, event, helper) 
    {
        //console.log('In getQuickAcitionsListHelper')
        var action = component.get("c.getQuickActionsList");  
        action.setParams({      
            'objectName':component.get("v.integrationMappingDetail.Source_Object__c")                      
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                //console.log('Result ::: ' + response.getReturnValue());
                var Result = response.getReturnValue();
                var buttonsList= component.get("v.buttonsList");
                
                for(var value in Result)
                {
                    var actionNameSplitList = (Result[value]).split('.');
                    //console.log('actionNameSplitList ::: '+ actionNameSplitList)
                    if(actionNameSplitList.length == 2 && 
                       actionNameSplitList[0] == component.get("v.integrationMappingDetail.Source_Object__c") )
                    {
                        //console.log('actionNameSplitList[1] ::: '+ actionNameSplitList[1])
                        var labelName=actionNameSplitList[1];
                        if(labelName.includes('-')){
                            labelName=labelName.split('-')[1];
                        }
                        
                        buttonsList.push({   
                            'label':labelName,
                            'value':actionNameSplitList[1]
                        });
                    }
                    
                }
                
                //console.log('buttonsList ::: ' + buttonsList)
                component.set("v.buttonsList",buttonsList); 
            }
        });
        $A.enqueueAction(action);
                
    },
    onChangeTargetObjectHelper: function(component, event, helper) 
    {
        //console.log('In onChangeTargetObjectHelper')
        var allMCandCRList = component.get("v.allMCandCRList");
        
        var mappingContractsSet = new Set();
        var mappingContractsList = component.get("v.mappingContractsList");
        mappingContractsList = [];
        
        for(var value in allMCandCRList)
        {
               if((component.get("v.integrationMappingDetail.Source_Object__c") != '' && component.get("v.integrationMappingDetail.Source_Object__c") != null))
            {
                if(allMCandCRList[value]['Source_Object__c'] == component.get("v.integrationMappingDetail.Source_Object__c") )
                {
                    //console.log('In if')
                    //console.log('value 5 ::: ' + allMCandCRList[value]['Mapping_Contract__r']['Name'])
                    mappingContractsSet.add(allMCandCRList[value]['Mapping_Contract__r']['Name']);
                    //console.log('mappingContractsSet ::: ' + mappingContractsSet)
                }
            }
        }
        //console.log('mappingContractsSet ::: ' + mappingContractsSet)
        var mappingContractsArr = Array.from(mappingContractsSet);
        //console.log('mappingContractsArr ::: ' + mappingContractsArr)
        for(let val of mappingContractsArr){
            //console.log(val)
            mappingContractsList.push({   
                'label':val,
                'value':val
            });
        }        
        //console.log('mappingContractsList ::: ' + mappingContractsList)            
        component.set("v.mappingContractsList",mappingContractsList); 
        
    },
    /*onChangeMappingContractHelper: function(component, event, helper) 
    {                 
        //console.log('In onChangeMappingContractHelper')
        var allMCandCRList = component.get("v.allMCandCRList");
        var mappingContractName = component.get("v.integrationMappingDetail.Mapping_Contract__c");
        var contractRulesSet = new Set();
        var contractRulesList = component.get("v.contractRulesList");
        contractRulesList = [];
        
        for(var value in allMCandCRList)
        {
            //console.log('value 1 ::: ' + value);
            //console.log('value 2 ::: ' + component.get("v.integrationMappingDetail.Mapping_Contract__c"));
            //console.log('value 3 ::: ' + allMCandCRList[value] );
            //console.log('value 4 ::: ' + allMCandCRList[value]['Mapping_Contract__r']['Name'] );
            if(allMCandCRList[value]['Mapping_Contract__r']['Name'] == component.get("v.integrationMappingDetail.Mapping_Contract__c"))
            {
                if(allMCandCRList[value]['Source_Object__c'] == component.get("v.integrationMappingDetail.Source_Object__c") && allMCandCRList[value]['Target_Object__c'] == component.get("v.integrationMappingDetail.Target_Object__c")){
                    contractRulesSet.add(allMCandCRList[value]['Name']);
                    //console.log('contractRulesSet ::: ' + contractRulesSet)
                }
            }
        }
        //console.log('contractRulesSet ::: ' + contractRulesSet)
        var contractRulesArr = Array.from(contractRulesSet);
        //console.log('contractRulesArr ::: ' + contractRulesArr)
        for(let val of contractRulesArr){
            //console.log(val)
            contractRulesList.push({   
                'label':val,
                'value':val
            });
        }     
        //console.log('contractRulesList ::: ' + contractRulesList)            
        component.set("v.contractRulesList",contractRulesList); 
    },*/
    closeSettingsModalHelper : function(component, event, helper) 
    {                     
        //console.log('In closeSettingsModalHelper')  
        /*
        var mappingContractDetail =  component.get("v.mappingContractDetail");
        mappingContractDetail.Name = '';
        mappingContractDetail.Active__c = true;
        mappingContractDetail.Description__c = '';
        mappingContractDetail.End_point_URL__c = '';
        mappingContractDetail.Source_Datastore__c = '';
        mappingContractDetail.Target_Datastore__c = '';                   
        
        component.set("v.mappingContractDetail", mappingContractDetail);
        
        component.set("v.mappingContractNameError" , "");
        component.set("v.mappingContractSourceDatastoreError" , "");
        component.set("v.mappingContractTargetDatastoreError" , "");
        component.set("v.mappingContractEndPointURLError" , "");
        
        component.set("v.isErrorFound" , "false");
        component.set("v.errorText" , ""); 
        */
        if(component.get("v.callType") == 'Header')
        {            
            var cancelEditEvent = component.getEvent("cancelEditEvent");
            cancelEditEvent.setParams({
                "isCancelButtonClicked" : "false" 
            });
            cancelEditEvent.fire();           
        }
        else
        {            
            var homeEvent = $A.get("e.force:navigateToObjectHome");
            homeEvent.setParams({
                "scope": "Integration_Mapping__c"
            });
            homeEvent.fire();
            
            event.preventDefault();
            event.stopImmediatePropagation();
        }
        
    },
    handleValidateIntegrationMapping: function(component, event, helper) 
    {                   
        component.set("v.isErrorFound","false");   
        component.set("v.errorText",'');
        component.set("v.mappingNameError" , "");
        component.set("v.mappingSourceDatastoreError" , "");
        component.set("v.mappingSourceObjectError" , "");
        component.set("v.mappingContractError" , "");
        component.set("v.mappingButtonError" , "");
        //component.set("v.mappingTargetDatastoreError" , "");

        //component.set("v.mappingTargetObjectError" , "");
        
        //component.set("v.contractRuleError" , "");
        
        var integrationMappingDetail = component.get("v.integrationMappingDetail");
        var emptyFieldsStr = '';                
        var errorFieldsSet = new Set();         
        if(integrationMappingDetail.Name == undefined ||integrationMappingDetail.Name == null || integrationMappingDetail.Name.trim() == ''){            
            errorFieldsSet.add('Mapping Name');
            component.set("v.mappingNameError" , " slds-has-error ");
        }
        if(integrationMappingDetail.Source_Datastore__c == null || integrationMappingDetail.Source_Datastore__c == ''){
            errorFieldsSet.add('Source Datastore');            
            component.set("v.mappingSourceDatastoreError" , " slds-has-error ");
        }
        /*if(integrationMappingDetail.Target_Datastore__c == null || integrationMappingDetail.Target_Datastore__c == ''){
            errorFieldsSet.add('Target Datastore');            
            component.set("v.mappingTargetDatastoreError" , " slds-has-error ");
        }*/
        if(integrationMappingDetail.Source_Object__c == null || integrationMappingDetail.Source_Object__c == ''){
            errorFieldsSet.add('Source Object');            
            component.set("v.mappingSourceObjectError" , "slds-has-error");
        }     
        /*if(integrationMappingDetail.Target_Object__c == null || integrationMappingDetail.Target_Object__c == ''){
            errorFieldsSet.add('Target Object');            
            component.set("v.mappingTargetObjectError" , "slds-has-error");
        } */ 
        if(integrationMappingDetail.Mapping_Contract__c == null || integrationMappingDetail.Mapping_Contract__c == ''){
            errorFieldsSet.add('Mapping Contract');            
            component.set("v.mappingContractError" , "slds-has-error");
        }  
        /*if(integrationMappingDetail.Contract_Rule__c == null || integrationMappingDetail.Contract_Rule__c == ''){
            errorFieldsSet.add('Contract Rule');            
            component.set("v.contractRuleError" , "slds-has-error");
        }*/
        if(integrationMappingDetail.Button__c == null || integrationMappingDetail.Button__c == ''){
            errorFieldsSet.add('Button');            
            component.set("v.mappingButtonError" , "slds-has-error");
        } 
        var cError = false;
        var IntegrationMappingsList = component.get("v.IntegrationMappingsList");
        for(var i = 0 ; i < IntegrationMappingsList.length ; i++ )
        {
            if((IntegrationMappingsList[i].Source_Object__c == integrationMappingDetail.Source_Object__c)
               /*&&(IntegrationMappingsList[i].Button__c == integrationMappingDetail.Button__c)*/ )
            {                
                component.set("v.isErrorFound","true");
                cError = true;   
                //component.set("v.mappingButtonError" , "slds-has-error");
                component.set("v.mappingSourceObjectError" , "slds-has-error");
                //component.set("v.mappingTargetObjectError" , "slds-has-error");
               // component.set("v.mappingContractError" , "slds-has-error");
                //component.set("v.contractRuleError" , "slds-has-error");
            }
        }        
        var errorArr = Array.from(errorFieldsSet);//.sort();
        if(errorFieldsSet.size>0)
        {            
            var errorFieldsStr = '';
            for (let item of errorArr) {
                errorFieldsStr = errorFieldsStr + item;
                errorFieldsStr = errorFieldsStr + ', ';
            }
            component.set("v.isErrorFound","true");            
            var erroMessage = 'These required fields must be completed: ' + errorFieldsStr.substring(0,errorFieldsStr.length - 2) + '.';
            component.set("v.errorText",erroMessage);
            return component.get("v.isErrorFound");
        }   
        if(cError)
        {            
            var erroMessage = 'Integration Mapping for this object already exist. Please Try Again with different values.';
            component.set("v.errorText",erroMessage);
            return cError;
        }        
        for(var i = 0 ; i < IntegrationMappingsList.length ; i++ )
        {
            
            if(IntegrationMappingsList[i].Name == integrationMappingDetail.Name.trim())
            {                
                component.set("v.isErrorFound","true");   
                component.set("v.mappingNameError" , " slds-has-error ");
            }
        }        
        if(component.get("v.isErrorFound") == "true")
        {            
            var erroMessage = 'Integration Mapping with same Name already exist. Please Try Again with different values.';
            component.set("v.errorText",erroMessage);
            return component.get("v.isErrorFound");
        }
    },
    
    saveIntegrationMapping : function(component,event,helper)
    {   
        //console.log('In saveIntegrationMapping')
           
        var integrationMappingDetail =  component.get("v.integrationMappingDetail");
        integrationMappingDetail.Name = integrationMappingDetail.Name.trim();
        //console.log('integrationMappingDetail ::: ' + JSON.stringify(integrationMappingDetail))
        var action = component.get("c.saveIntegrationMappingDetails");
        action.setParams({ 
            "IntegrationMapping":integrationMappingDetail
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            //console.log('state ::: ' + state)
            if (state === "SUCCESS") {     
                //console.log('recordId ::: ' + a.getReturnValue())
                helper.LightningToastmessage(component, event, helper,"Integration Mapping created successfully.","Success");                
                var navEvt = $A.get("e.force:navigateToSObject");
                navEvt.setParams({
                    "recordId": a.getReturnValue()                 
                });
                navEvt.fire(); 
                
                
            }
        });
        $A.enqueueAction(action)  
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