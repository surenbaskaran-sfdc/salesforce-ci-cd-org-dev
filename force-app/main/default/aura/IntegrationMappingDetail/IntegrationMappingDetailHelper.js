({
    initIntegrationMapping : function(component, event, helper) 
    {     
        var integrationMappingDetail = component.get("v.integrationMappingDetail");
        component.set("v.mappingNameError" , "");
        component.set("v.mappingSourceDatastoreError" , "");
        component.set("v.mappingTargetDatastoreError" , "");
        component.set("v.mappingSourceObjectError" , "");
        component.set("v.mappingTargetObjectError" , "");
        component.set("v.mappingButtonError" , "");
        component.set("v.mappingContractError" , "");
        component.set("v.contractRuleError" , "");
        
        integrationMappingDetail.Name = '';
        integrationMappingDetail.Mapping_Contract__c = '';
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
        
        //component.set("v.mappingContractDetail.Active__c",true);
        
    },
    getAllRequiredDataMap : function(component, event, helper) 
    { 
        var action = component.get("c.createNewIntegrationMapping");          
        action.setParams({      
            'objectName':'Integration_Mapping__c',
            'recId' : component.get("v.recordId")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var resultList = response.getReturnValue();         
                console.log(resultList);
                for ( var key in resultList ) 
                {
                    switch (key){
                        case 'TargetDatasore':                            
                            var targetDatastorePickListValues = resultList[key];
                            var targetDatastoreList = [];
                            
                            for(var i=0 ; i< targetDatastorePickListValues.length; i++)
                            {
                                var pickListValue = JSON.parse((targetDatastorePickListValues[i])['Target_Datastore__c']);
                                targetDatastoreList.push({   
                                    'label':pickListValue.label,
                                    'value':pickListValue.label
                                });
                            }                                                          
                            component.set("v.targetDatastoreList", targetDatastoreList);
                            break;
                        case 'Objects':                            
                            component.set("v.allObjectList",resultList[key])
                            var sourceObjectList = component.get("v.sourceObjectList");                            
                            for(var value in resultList[key])
                            {
                                if(resultList[key][value]['Datastore__c'] == component.get("v.integrationMappingDetail.Source_Datastore__c"))
                                {
                                    sourceObjectList.push({   
                                        'label':resultList[key][value]['Name'],
                                        'value':resultList[key][value]['Name']
                                    });
                                }                                
                            }
                            component.set("v.sourceObjectList",sourceObjectList);                            
                            break;
                        case 'Buttons':                            
                            component.set("v.allButtonsList",resultList[key])
                            break;
                        case 'MappingContracts':                            
                            component.set("v.allMCandCRList",resultList[key])                            
                            break;    
                        case 'IntegrationMappings':      
                            component.set("v.integrationMappingDetail",resultList[key][0])     
                            //helper.onChangeTargetDatastoreHelper(component, event, helper);                            
                            helper.onChangeSourceObjectHelper(component, event, helper);                            
                            helper.onChangeTargetObjectHelper(component, event, helper);
                            //helper.onChangeMappingContractHelper(component, event, helper);
                            break;    
                        case 'UserInfo':                            
                            component.set("v.ownerDetails",resultList[key][0])                            
                            break; 
                        case 'timeZone':
                            component.set("v.timeZone",resultList[key][0].TimeZoneSidKey);
                            break;
                        case 'IntegrationMappinglist':
                            component.set("v.allIntegrationMappings",resultList[key]);
                            break
                    }
                }
                //get button label name
                
                component.set("v.loadingSpinner",false);
                window.setTimeout(
                    $A.getCallback(function() {
                        if(component.find("mappingName")!= undefined){
                            component.find("mappingName").focus();
                        }
                    }), 1
                );
            }
        });
        $A.enqueueAction(action);
    },
    
    storeButtonLabelName: function(component, event, helper){
        var existingButtonList=component.get("v.buttonsList");
        console.log('existingButtonList',existingButtonList)
        component.set("v.buttonLabelName","")
        for(var  i=0;i<existingButtonList.length;i++){
            var objectValue=existingButtonList[i]['value'];
            
            if(objectValue==component.get("v.integrationMappingDetail.Button__c")){
                component.set("v.buttonLabelName",existingButtonList[i]['label'])
            }
        }
    },
    
   /* onChangeTargetDatastoreHelper : function(component, event, helper) 
    {              
        var allObjectList = component.get("v.allObjectList")
        var targetObjectList = [];
        for(var value in allObjectList)
        {
            if(allObjectList[value]['Datastore__c'] == component.get("v.integrationMappingDetail.Target_Datastore__c"))
            {
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
        var allButtonsList = component.get("v.allButtonsList");
        var buttonsList= [];
        for(var value in allButtonsList)
        {
            if(allButtonsList[value]['PageOrSobjectType'] == component.get("v.integrationMappingDetail.Source_Object__c"))
            {
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
        component.set("v.buttonsList",buttonsList); 
        helper.getQuickAcitionsListHelper(component, event, helper);
        
    },
    getQuickAcitionsListHelper: function(component, event, helper) 
    {
        var action = component.get("c.getQuickActionsList");  
        action.setParams({      
            'objectName':component.get("v.integrationMappingDetail.Source_Object__c")                      
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var Result = response.getReturnValue();
                var buttonsList= component.get("v.buttonsList");
                
                for(var value in Result)
                {
                    var actionNameSplitList = (Result[value]).split('.');
                    if(actionNameSplitList.length == 2 && actionNameSplitList[0] == component.get("v.integrationMappingDetail.Source_Object__c") )
                    {
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
                
                component.set("v.buttonsList",buttonsList); 
                helper.storeButtonLabelName(component,event,helper);
            }
        });
        $A.enqueueAction(action);
        
    },
    onChangeTargetObjectHelper: function(component, event, helper) 
    {
        var allMCandCRList = component.get("v.allMCandCRList");
        
        var mappingContractsSet = new Set();
        var mappingContractsList = component.get("v.mappingContractsList");
        mappingContractsList = [];
        
        for(var value in allMCandCRList)
        {
            if((component.get("v.integrationMappingDetail.Source_Object__c") != '' && component.get("v.integrationMappingDetail.Source_Object__c") != null)
               && (component.get("v.integrationMappingDetail.Source_Datastore__c") != '' && component.get("v.integrationMappingDetail.Source_Datastore__c") != null)
              )
            {
                if(allMCandCRList[value]['Source_Object__c'] == component.get("v.integrationMappingDetail.Source_Object__c")
                   &&allMCandCRList[value]['Mapping_Contract__r']['Source_Datastore__c'] == component.get("v.integrationMappingDetail.Source_Datastore__c")
                  )
                {
                    mappingContractsSet.add(allMCandCRList[value]['Mapping_Contract__r']['Name']);
                }
            }
        }
        var mappingContractsArr = Array.from(mappingContractsSet);
        for(let val of mappingContractsArr){
            mappingContractsList.push({   
                'label':val,
                'value':val
            });
        }        
        component.set("v.mappingContractsList",mappingContractsList); 
        
    },
    /*onChangeMappingContractHelper: function(component, event, helper) 
    {                 
        var allMCandCRList = component.get("v.allMCandCRList");        
        var contractRulesSet = new Set();
        var contractRulesList = component.get("v.contractRulesList");
        contractRulesList = [];
        
        for(var value in allMCandCRList)
        {
            if(allMCandCRList[value]['Mapping_Contract__r']['Name'] == component.get("v.integrationMappingDetail.Mapping_Contract__c"))
            {
                if(allMCandCRList[value]['Source_Object__c'] == component.get("v.integrationMappingDetail.Source_Object__c") 
                   && allMCandCRList[value]['Target_Object__c'] == component.get("v.integrationMappingDetail.Target_Object__c")){
                    
                    contractRulesSet.add(allMCandCRList[value]['Name']);}
            }
        }
        var contractRulesArr = Array.from(contractRulesSet);
        for(let val of contractRulesArr){
            contractRulesList.push({   
                'label':val,
                'value':val
            });
        }     
        component.set("v.contractRulesList",contractRulesList); 
    },*/
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
    LightningToastmessage : function(component, event, helper,message,toasttype) 
    {  
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({            
            "type":toasttype,            
            "message": message
        });
        toastEvent.fire();
    },
    handleValidateIntegrationMapping: function(component, event, helper) 
    {                   
        component.set("v.isErrorFound","false");
        component.set("v.mappingNameError" , "");
        component.set("v.mappingSourceDatastoreError" , "");
        //component.set("v.mappingTargetDatastoreError" , "");
        component.set("v.mappingSourceObjectError" , "");
        //component.set("v.mappingTargetObjectError" , "");
        component.set("v.mappingContractError" , "");
        //component.set("v.contractRuleError" , "");
        component.set("v.mappingButtonError" , "");
        
        var integrationMappingDetail = component.get("v.integrationMappingDetail");
        var emptyFieldsStr = '';                
        var errorFieldsSet = new Set();  
        
        if(integrationMappingDetail.Name == undefined || integrationMappingDetail.Name == null || integrationMappingDetail.Name.trim() == ''){            
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
        var IntegrationMappingsList = component.get("v.allIntegrationMappings");
        for(var i = 0 ; i < IntegrationMappingsList.length ; i++ )
        {
            if((IntegrationMappingsList[i].Id != component.get("v.recordId"))
               &&(IntegrationMappingsList[i].Source_Object__c == integrationMappingDetail.Source_Object__c)
               /*&&(IntegrationMappingsList[i].Button__c == integrationMappingDetail.Button__c) */
               )
            {                
                cError = true;
				//component.set("v.isErrorFound","true");   
                //component.set("v.mappingButtonError" , "slds-has-error");
                component.set("v.mappingSourceObjectError" , "slds-has-error");
				//component.set("v.mappingTargetObjectError" , "slds-has-error");
                //component.set("v.mappingContractError" , "slds-has-error");
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
            var erroMessage = 'These required fields must be completed: ' + errorFieldsStr.substring(0,errorFieldsStr.length - 2);            
            component.set("v.errorText",erroMessage);
            helper.LightningToastmessage(component, event, helper,erroMessage,"Error");  
            return component.get("v.isErrorFound");
        } 
        
        if(cError)
        {            
            var erroMessage = 'Integration Mapping for this object already exist. Please Try Again with different values.';
            component.set("v.errorText",erroMessage);
            helper.LightningToastmessage(component, event, helper,erroMessage,"Error");  
            return cError;
        }        
        for(var i = 0 ; i < IntegrationMappingsList.length ; i++ )
        {
            if((IntegrationMappingsList[i].Id != component.get("v.recordId")) && (IntegrationMappingsList[i].Name == integrationMappingDetail.Name.trim()))
            {                
                component.set("v.isErrorFound","true");   
                component.set("v.mappingNameError" , " slds-has-error ");
            }
        }        
        if(component.get("v.isErrorFound") == "true")
        {            
            var erroMessage = 'Integration Mapping with same Name already exist. Please Try Again with different values.';
            component.set("v.errorText",erroMessage);
            helper.LightningToastmessage(component, event, helper,erroMessage,"Error");                
            return component.get("v.isErrorFound");
        }
    },
    
    saveIntegrationMapping : function(component,event,helper)
    {   
        
        var integrationMappingDetail =  component.get("v.integrationMappingDetail");
        integrationMappingDetail.Name = integrationMappingDetail.Name.trim();
        var action = component.get("c.saveIntegrationMappingDetails");
        action.setParams({ 
            "IntegrationMapping":integrationMappingDetail
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS") {     
                helper.LightningToastmessage(component, event, helper,"Integration Mapping updated successfully.","Success");                
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