({
    initMappingContract : function(component, event, helper) 
    {     
        //console.log('In initMappingContract')
        var mappingContractDetail = component.get("v.mappingContractDetail");
        component.set("v.mappingContractNameError" , "");
        component.set("v.mappingContractSourceDatastoreError" , "");
        component.set("v.mappingContractTargetDatastoreError" , "");
        component.set("v.mappingContractEndPointURLError" , "");
        component.set("v.jobTypeError" , "");
        component.set("v.sourceObjectError" , "");
        component.set("v.namedCredentialError","");
        
        mappingContractDetail.Name = '';
        mappingContractDetail.Active__c = true;
        mappingContractDetail.Description__c = '';
        mappingContractDetail.End_point_URL__c = '';
        mappingContractDetail.Source_Datastore__c = '';
        mappingContractDetail.Target_Datastore__c = '';                   
        mappingContractDetail.Named_Credential__c = '';
        mappingContractDetail.Job_Type__c = '';
        mappingContractDetail.Source_Object__c = '';
        component.set("v.mappingContractDetail", mappingContractDetail);
        
        component.set("v.isErrorFound" , "false");
        component.set("v.errorText" , ""); 
        helper.getMappingContractDetails(component,event,helper);
        
        //component.set("v.mappingContractDetail.Active__c",true);
        
    },
    escapeEventHelper: function (component, event, helper) {
        
        document.addEventListener("keydown", function (event) {
            var kcode = event.code;
            if (kcode == 'Escape') {
                helper.closeSettingsModalHelper(component, event, helper); 
                //event.preventDefault();
                //event.stopImmediatePropagation();                                
            }
        });                
    },
    getMappingContractDetails: function(component,event,helper) 
    {
        //console.log('recordId ::: ' , component.get("v.recordId"))
        var action = component.get("c.getNewMappingContractDetailsList");
        action.setParams({            
            "objectName" : 'Mapping_Contract__c',            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var resultList = response.getReturnValue();         
                console.log(resultList) 
                
                //console.log('resultList 0 ::: ' , JSON.stringify(resultList[0])) 
                //console.log('resultList 1 ::: ' , JSON.stringify(resultList[1])) 
                //console.log('resultList 2 ::: ' , JSON.stringify(resultList[2]))                                                                 
                
                var sourceDatastoreDataList = resultList[0];
                var sourceDatastoreList = [];
                for(var item of sourceDatastoreDataList)
                {
                    var pickListValue = JSON.parse(item.Name);
                    
                    sourceDatastoreList.push({
                        'label' : pickListValue.label,
                        'value' : pickListValue.value,
                    })
                }
                //console.log('sourceDatastoreList ::: ' , JSON.stringify(sourceDatastoreList))
                component.set("v.sourceDatastoreList" , sourceDatastoreList);
                
                //console.log('targetDatastoreList ::: ' , JSON.stringify(sourceDatastoreList))
                component.set("v.targetDatastoreList" , sourceDatastoreList);
                component.set("v.allMappingContractDetailsList" , resultList[2]);                
                var namedCredentialDataList=resultList[3];
                var namedCredentialList = [];
                for(var item of namedCredentialDataList)
                {
                    namedCredentialList.push({
                        'label' : item.MasterLabel,
                        'value' : item.DeveloperName,
                    })
                }
                
                component.set("v.namedCredentialList" , namedCredentialList);
                
                var picklistValuesMap = JSON.parse(resultList[4][0].Description__c);
                component.set("v.sourceObjectOptionsMap",picklistValuesMap);
                
                
                component.set("v.loadingSpinner",false);
                
                window.setTimeout(
                    $A.getCallback(function() {
                        if(component.find("mappingContractName")!= undefined){
                            component.find("mappingContractName").focus();
                        }
                    }), 1
                );
                
            }
        });
        $A.enqueueAction(action);
    },
    handleValidateMappingContract:function (component, event,helper) 
    {
        var mappingContractDetail = component.get("v.mappingContractDetail");
        //console.log('mappingContractDetail ::: ' , mappingContractDetail)
        component.set("v.mappingContractNameError" , "");
        component.set("v.mappingContractSourceDatastoreError" , "");
        component.set("v.mappingContractTargetDatastoreError" , "");
        component.set("v.mappingContractEndPointURLError" , "");
        component.set("v.jobTypeError" , "");
        component.set("v.sourceObjectError" , "");
        component.set("v.namedCredentialError","");
        var emptyFieldsStr = '';        
        var urlValid = true;
        var errorFieldsSet = new Set();         
        if(mappingContractDetail.Name == undefined ||mappingContractDetail.Name == null || mappingContractDetail.Name.trim() == ''){            
            errorFieldsSet.add('Mapping Contract Name');
            component.set("v.mappingContractNameError" , " slds-has-error ");
        }
        
        if(mappingContractDetail.Source_Datastore__c == null || mappingContractDetail.Source_Datastore__c == ''){
            errorFieldsSet.add('Source Datastore');            
            component.set("v.mappingContractSourceDatastoreError" , " slds-has-error ");
        }
        if(mappingContractDetail.Target_Datastore__c == null || mappingContractDetail.Target_Datastore__c == ''){
            errorFieldsSet.add('Target Datastore');            
            component.set("v.mappingContractTargetDatastoreError" , " slds-has-error ");
        }
        
        if(mappingContractDetail.Job_Type__c == undefined ||mappingContractDetail.Job_Type__c == null || mappingContractDetail.Job_Type__c.trim() == ''){
            errorFieldsSet.add('Job Type');            
            component.set("v.jobTypeError" , "slds-has-error");
        } 
        
        if(mappingContractDetail.End_point_URL__c == undefined ||mappingContractDetail.End_point_URL__c == null || mappingContractDetail.End_point_URL__c.trim() == ''){
            errorFieldsSet.add('End Point URL');            
            component.set("v.mappingContractEndPointURLError" , "slds-has-error");
        }  
        
        if(mappingContractDetail.Job_Type__c == 'Realtime Sync'){
            if(mappingContractDetail.Source_Object__c == undefined ||mappingContractDetail.Source_Object__c == null || mappingContractDetail.Source_Object__c.trim() == ''){
                errorFieldsSet.add('Source Object');            
                component.set("v.sourceObjectError" , "slds-has-error");
            } 
        }
        
        if(mappingContractDetail.Source_Datastore__c == 'Salesforce'){
            if(mappingContractDetail.Named_Credential__c == undefined ||mappingContractDetail.Named_Credential__c == null || mappingContractDetail.Named_Credential__c.trim() == ''){
                errorFieldsSet.add('Named Credential');            
                component.set("v.namedCredentialError" , "slds-has-error");
            } 
        }
        
        var errorArr = Array.from(errorFieldsSet);//.sort();
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
            component.set("v.isErrorFound","true");            
            var erroMessage = 'These required fields must be completed: ' + errorFieldsStr.substring(0,errorFieldsStr.length - 2);
            helper.handleValidateMappingContractHelper(component,event,helper,erroMessage,true);
            return component.get("v.isErrorFound");
        }        
        
        var sameDatastore = false;
        if(errorFieldsSet.size == 0){
            
            
            //console.log('(mappingContractDetail.Source_Datastore__c).trim() != null ::: ' +((mappingContractDetail.Source_Datastore__c).trim() != null));
            //console.log('(mappingContractDetail.Source_Datastore__c).trim() !=  ::: ' +((mappingContractDetail.Source_Datastore__c).trim() != ''));
            //console.log('(mappingContractDetail.Target_Datastore__c).trim() != null ::: ' +((mappingContractDetail.Target_Datastore__c).trim() != null));
            //console.log('(mappingContractDetail.Target_Datastore__c).trim() != :::' + ((mappingContractDetail.Target_Datastore__c).trim() != ''));
            
            
            if((mappingContractDetail.Source_Datastore__c).trim() != null && (mappingContractDetail.Source_Datastore__c).trim() != ''
               && (mappingContractDetail.Target_Datastore__c).trim() != null && (mappingContractDetail.Target_Datastore__c).trim() != '')
            {
                //console.log('mappingContractDetail.Source_Datastore__c :::',mappingContractDetail.Source_Datastore__c)
                //console.log('mappingContractDetail.Target_Datastore__c :::',mappingContractDetail.Target_Datastore__c)
                if((mappingContractDetail.Source_Datastore__c).trim() == (mappingContractDetail.Target_Datastore__c).trim())
                {
                    sameDatastore = true;                
                    errorFieldsSet.add('Source Datastore');            
                    component.set("v.mappingContractSourceDatastoreError" , " slds-has-error ");
                    errorFieldsSet.add('Target Datastore');            
                    component.set("v.mappingContractTargetDatastoreError" , " slds-has-error ");
                    component.set("v.isErrorFound","true");
                    var erroMessage = 'Source and Target Datastore cannot be the same.'
                    helper.handleValidateMappingContractHelper(component,event,helper,erroMessage,true);
                    return component.get("v.isErrorFound");
                }
            }
            if(!sameDatastore && (mappingContractDetail.Target_Datastore__c != null && mappingContractDetail.Target_Datastore__c != '' )
               && (mappingContractDetail.Source_Datastore__c != null && mappingContractDetail.Source_Datastore__c != ''))
            {            
                component.set("v.mappingContractSourceDatastoreError" , "");                         
                component.set("v.mappingContractTargetDatastoreError" , "");
            }                                    
        }
        
        
        //ensure salesforce is selected as a datastore.
        var isSalesforceSelected = false;
        if(!sameDatastore){
            if((mappingContractDetail.Source_Datastore__c).trim() != null && (mappingContractDetail.Source_Datastore__c).trim() != ''
               && (mappingContractDetail.Target_Datastore__c).trim() != null && (mappingContractDetail.Target_Datastore__c).trim() != '')
            {
                if((mappingContractDetail.Source_Datastore__c).trim() != 'Salesforce' && (mappingContractDetail.Target_Datastore__c).trim() != 'Salesforce')
                {
                    isSalesforceSelected = true;                
                    errorFieldsSet.add('Source Datastore');            
                    component.set("v.mappingContractSourceDatastoreError" , " slds-has-error ");
                    errorFieldsSet.add('Target Datastore');            
                    component.set("v.mappingContractTargetDatastoreError" , " slds-has-error ");
                    component.set("v.isErrorFound","true");
                    var erroMessage = 'Salesforce should be selected as any one of the datastore.'
                    helper.handleValidateMappingContractHelper(component,event,helper,erroMessage,true);
                    return component.get("v.isErrorFound");
                }
            }
        }
        
        
        if(!isSalesforceSelected)
        {
            if(!helper.urlvalidation(component, event, helper,mappingContractDetail.End_point_URL__c))
            {
                errorFieldsSet.add('End Point URL');
                component.set("v.mappingContractEndPointURLError" , "slds-has-error");
                urlValid = false;
                component.set("v.isErrorFound","true");
                var erroMessage = 'Invalid End Point URL. (Eg : https://www.salesforce.com).';
                helper.handleValidateMappingContractHelper(component,event,helper,erroMessage,true);
                return component.get("v.isErrorFound");
            }
            /*else
            {
                component.set("v.mappingContractEndPointURLError" , "");
            }*/
            
        }
        
        if(urlValid){
            var duplicateName = false;
            var allMappingContractDetailsList = component.get("v.allMappingContractDetailsList");
            //console.log('allMappingContractDetailsList ::: ' , allMappingContractDetailsList)
            for(var i = 0 ; i < allMappingContractDetailsList.length ; i++)
            {
                if((allMappingContractDetailsList[i].Name).toLowerCase().trim() ==  (mappingContractDetail.Name).toLowerCase().trim()
                   && mappingContractDetail.Id != allMappingContractDetailsList[i].Id)
                {
                    errorFieldsSet.add('Mapping Contract Name');
                    duplicateName = true;
                    component.set("v.mappingContractNameError" , " slds-has-error ");
                    component.set("v.isErrorFound","true");
                    var erroMessage = 'Mapping Contract with same name is already present. Try again with different name.'
                    helper.handleValidateMappingContractHelper(component,event,helper,erroMessage,true);
                    return component.get("v.isErrorFound");
                    break;
                }
            }
        }
        
        
    },
    
    handleValidateMappingContractHelper:function (component, event,helper, errorMsg , isErrorFound) {
        
        if(isErrorFound){
            var finalErrorMsg = '';
            
            finalErrorMsg = errorMsg;
            /*if(duplicateName){
                finalErrorMsg = finalErrorMsg + '\n Mapping Contract with same name is already present. Try again with different name.'
            }
            
            if(sameDatastore){
                finalErrorMsg = finalErrorMsg + '\n Source and Target Datastore cannot be the same.'
            }
            
            if(!urlValid)
            {
                finalErrorMsg = finalErrorMsg + '\n Invalid End Point URL.'
            }
            */
            component.set("v.isErrorFound",true);
            component.set("v.errorText",finalErrorMsg);
        }
        
    },
    
    
    saveMappingContract : function(component,event,helper){   
        var mappingContractDetail =  component.get("v.mappingContractDetail");
        mappingContractDetail.Name = mappingContractDetail.Name.trim();
        mappingContractDetail.End_point_URL__c = mappingContractDetail.End_point_URL__c.trim();
        var action = component.get("c.saveMappingContractDetails");
        action.setParams({ 
            "MappingContract":mappingContractDetail
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            //console.log('state ::: ' + state)
            if (state === "SUCCESS") {                 
                
                /*component.set("v.isEditPage",false);
                //helper.initMappingContract(component, event, helper);
                component.set("v.mappingContractNameError" , "");
                component.set("v.mappingContractSourceDatastoreError" , "");
                component.set("v.mappingContractTargetDatastoreError" , "");
                component.set("v.mappingContractEndPointURLError" , "");
                
                mappingContractDetail.Name = '';
                mappingContractDetail.Active__c = true;
                mappingContractDetail.Description__c = '';
                mappingContractDetail.End_point_URL__c = '';
                mappingContractDetail.Source_Datastore__c = '';
                mappingContractDetail.Target_Datastore__c = '';                   
                                
                component.set("v.mappingContractDetail", mappingContractDetail);
                
                component.set("v.isErrorFound" , "false");
                component.set("v.errorText" , "");  
                component.set("v.loadingSpinner",false);
                */
                helper.LightningToastmessage(component, event, helper,"Mapping Contract created successfully.","Success");                
                var navEvt = $A.get("e.force:navigateToSObject");
                navEvt.setParams({
                    "recordId": a.getReturnValue()                 
                });
                navEvt.fire(); 
                
                
            }
        });
        $A.enqueueAction(action)  
    },
    urlvalidation : function(component,event,helper,msg){ 
        var validity = component.find("urlField").get("v.validity");
        return validity.valid
        /*var isValid=true;
        var regForUrl;
        var urlFound=msg;
        var url=urlFound.toLowerCase();
        var start=url.indexOf(".");
        var end=url.lastIndexOf(".");
        var suburl=url.substring(start,url.length);
        var finalIndex=suburl.indexOf("/");
        var afterSlashUrl=suburl.substring(finalIndex,url.length);
        if(!suburl.includes("/")){
            regForUrl =/^((ftp|http|https):\/\/)(?:(www+\.)?)(?:([a-zA-Z0-9\-]+\.))+[a-z]{2,3}$/;
        }
        else{
            regForUrl =/^((ftp|http|https):\/\/)(?:(www+\.)?)(?:([a-zA-Z0-9-]+\.))+([a-z]{2,3}\/)+(?:[\w\-\.\_\__\~\:\/\?\#\@\!\$\,\;\*\$\(\)\&\=\+\:\%]?)+$/;
        }
        
        if(url.includes("wwww")){
            
            isValid=false;
        }
        else if((url.includes("www.")))
        {
            if (!regForUrl.test(url)||(start==end)){
                
                isValid=false;
            }
        }
            else if(url.includes("ww.")||url.includes("w."))
            {
                
                
                isValid=false;
            }
                else if(!regForUrl.test(url))
                {
                    
                    isValid=false;
                }        
        return isValid;*/
    },
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
                "scope": "Mapping_Contract__c"
            });
            homeEvent.fire();
            
            event.preventDefault();
            event.stopImmediatePropagation();
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
    
})