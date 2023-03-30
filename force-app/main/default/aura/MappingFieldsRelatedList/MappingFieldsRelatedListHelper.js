({
    getMappingObjectDetails: function(component,event,helper) {
        //console.log(component.get("v.recordId"))
        var action = component.get("c.getDataList");
        action.setParams({            
            "objectName" : 'Mapping_Object__c',
            "recId" : component.get("v.recordId")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                component.set("v.mappingObjectDetails",storeResponse[0])
                //console.log('storeResponse ::: ' + JSON.stringify(storeResponse))
                //console.log('storeResponse ::: ' + JSON.stringify(storeResponse[0]))
                if(storeResponse[0].Datastore__c != 'Salesforce'){
                    helper.createColumnForSAPDataTable(component, event, helper);}
                else{
                    helper.createColumnForSalesforceDataTable(component, event, helper);}
                
                //console.log('After taking columns')
                helper.columnsWithActions(component, event, helper);
                
                helper.getMappingRulesList(component, event, helper);
            }
        });
        $A.enqueueAction(action);
    },
    
    escapeEventHelper: function (component, event, helper) {    
        //console.log('In~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        window.addEventListener("keydown", $A.getCallback(function (event) {
            //console.log('event.code 223 ::: ' , event.code)
            if (event.code == 'Escape') {                
                helper.closeObjectCreateModalHelper(component, event, helper);
                helper.closeDeleteModalHelper(component, event, helper);
                
            }
        }, true));
    },
    
    closeObjectCreateModalHelper: function (component, event, helper) {
        component.set("v.isErrorFound", false);
        component.set("v.errorText", "");  
        component.set("v.isAddNewField", false);    
        helper.getMappingObjectFieldsList(component, event, helper);
    },
    
    columnsWithActions: function (component, event, helper) {
        //console.log('In columnsWithActions');        
        /*var customActions = [
            { label: 'Edit', name: 'edit' },
            { label: 'Delete', name: 'delete' }
        ];      
        
        var columns = component.get('v.columns');
        var columnsWithActions = [];
        columnsWithActions.push(...columns);
        columnsWithActions.push({ type: 'action', typeAttributes: { rowActions: customActions } });
        component.set('v.columns',  columnsWithActions);
        //console.log(JSON.stringify(columnsWithActions));
        */
    }, 
    getMappingObjectFieldsList: function(component,event,helper) {
        //console.log(component.get("v.recordId"))
        var action = component.get("c.getChildDataList");
        action.setParams({
            "childObjectName" : 'Mapping_Object_Field__c',
            "parentObjectName" : 'Object__c',
            "recId" : component.get("v.recordId")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                //console.log(JSON.stringify(storeResponse))
                if(storeResponse.length!=0){
                    //console.log(storeResponse.length)
                    storeResponse.sort(function(a,b) {
                        var t1 = a.Name == b.Name, t2 = a.Name < b.Name;
                        return t1? 0: (storeResponse?-1:1)*(t2?1:-1);
                    });
                }
                component.set("v.mappingObjectFieldsList",storeResponse);                                
                component.set("v.loadingSpinner",false);				
                if(component.get("v.mappingObjectFieldsList").length == 0){
                    component.set("v.isDisabledEdit",true);}
                else{
                    component.set("v.isDisabledEdit",false);}
                
            }
        });
        $A.enqueueAction(action);
    },
    
    
    getMappingRulesList: function(component,event,helper) {
        //console.log(component.get("v.recordId"))
        //console.log( 'mappingObjectDetails ::: ', component.get("v.mappingObjectDetails.Name"))
        var action = component.get("c.checkIsUsedMappingObjectFields");
        action.setParams({            
            "objectName" : component.get("v.mappingObjectDetails.Name"),            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var resultList = response.getReturnValue();
                //console.log('resultList 22:::'+ JSON.stringify(resultList));                    
                
                //console.log('resultList[0] :::' , JSON.stringify(resultList[0]))
                //console.log('resultList[1] :::' , JSON.stringify(resultList[1]))                
                //console.log('resultList[2] :::' , JSON.stringify(resultList[2]))
                
                component.set("v.mappingContractsList",resultList[0]);
                component.set("v.contractRulesList",resultList[1]);
                component.set("v.mappingRulesList",resultList[2]);
                component.set("v.responseRulesList",resultList[3]);
                //console.log('contractRulesList ::: ' , component.get("v.contractRulesList"))
                //console.log('mappingRulesList ::: ' , component.get("v.mappingRulesList"))
                helper.CheckIsUsedInMappingContracts(component, event, helper);
                component.set("v.loadingSpinner",false);
            }
        });
        $A.enqueueAction(action);
    },
    
    CheckIsUsedInMappingContracts : function(component,event,helper) {
        var contractRulesList = component.get("v.contractRulesList");
        var mappingRulesList = component.get("v.mappingRulesList");
        var mappingContractsList = component.get("v.mappingContractsList");        
        var mappingObjectDetails = component.get("v.mappingObjectDetails");
        var mappingObjectFieldsList = component.get("v.mappingObjectFieldsList");
        var responseRulesList = component.get("v.responseRulesList");
        //console.log('mappingContractsList ::: ' , mappingContractsList)
        //console.log('contractRulesList ::: ' , contractRulesList)
        //console.log('mappingRulesList ::: ' , mappingRulesList)
        //console.log('responseRulesList ::: ' , responseRulesList)
        //console.log('mappingObjectDetails ::: ' , mappingObjectDetails)
        //console.log('mappingObjectFieldsList ::: ' , mappingObjectFieldsList)
        var usedMappingObjectFieldsList = [];
        var isSourceChecked = false;
        for(var i = 0 ; i < mappingContractsList.length && !isSourceChecked; i++)
        {
            //if(mappingContractsList[i].Source_Datastore__c == mappingObjectDetails.Datastore__c ){
            isSourceChecked = true;
            for(var j = 0 ; j < contractRulesList.length ; j++)
            {
                if(contractRulesList[j].Source_Object__c == mappingObjectDetails.Name)
                {
                    for(var k = 0 ; k < mappingObjectFieldsList.length ; k++)
                    {
                        if(mappingObjectFieldsList[k].Name == contractRulesList[j].External_Id__c)
                        {
                            usedMappingObjectFieldsList.push(mappingObjectFieldsList[k].Name+ '#*~*#Contract Rule');                                
                        }
                        for(var l = 0 ; l < mappingRulesList.length ; l++)
                        {
                            if(mappingRulesList[l].Source_Object_Fields__c != null && mappingRulesList[l].Source_Object_Fields__c != undefined)
                            {
                                var sourceFieldsList = JSON.parse(mappingRulesList[l].Source_Object_Fields__c);
                                for(var m = 0 ; m < sourceFieldsList.length ; m++ )
                                {
                                    if(sourceFieldsList[m] == mappingObjectFieldsList[k].Name)
                                    {
                                        usedMappingObjectFieldsList.push(mappingObjectFieldsList[k].Name+ '#*~*#Mapping Rule');
                                        break;
                                    }
                                } 
                            }
                        }
                        for(var r=0;r<responseRulesList.length;r++)
                        {
                            if(responseRulesList[r].Source_Object_Fields__c != null && responseRulesList[r].Source_Object_Fields__c != undefined)
                            {
                                var sourceFieldsList = JSON.parse(responseRulesList[r].Source_Object_Fields__c);
                                for(var m = 0 ; m < sourceFieldsList.length ; m++ )
                                {
                                    if(sourceFieldsList[m] == mappingObjectFieldsList[k].Name)
                                    {
                                        usedMappingObjectFieldsList.push(mappingObjectFieldsList[k].Name+ '#*~*#Response Rule');
                                        break;
                                    }
                                } 
                            }
                        }
                    }                                                                        
                }
                else if(contractRulesList[j].Target_Object__c == mappingObjectDetails.Name)
                {
                    for(var k = 0 ; k < mappingObjectFieldsList.length ; k++)
                    {
                        for(var l = 0 ; l < mappingRulesList.length ; l++)
                        {
                            if(mappingObjectFieldsList[k].Name == mappingRulesList[l].Target_Field__c)
                            {                                    
                                usedMappingObjectFieldsList.push(mappingObjectFieldsList[k].Name+ '#*~*#Mapping Rule');
                                break;
                            }
                        } 
                        for(var r=0;r<responseRulesList.length;r++)
                        {
                            if(mappingObjectFieldsList[k].Name == responseRulesList[r].Target_Field__c)
                            {                                    
                                usedMappingObjectFieldsList.push(mappingObjectFieldsList[k].Name+ '#*~*#Response Rule');
                                break;
                            }
                        }
                    }
                }
            }
            /*}            
            else if(mappingContractsList[i].Target_Datastore__c == mappingObjectDetails.Datastore__c)
            {
                for(var j = 0 ; j < contractRulesList.length ; j++)
                {
                    if(contractRulesList[j].Target_Object__c == mappingObjectDetails.Name)
                    {
                        for(var k = 0 ; k < mappingObjectFieldsList.length ; k++)
                        {
                            for(var l = 0 ; l < mappingRulesList.length ; l++)
                            {
                                if(mappingObjectFieldsList[k].Name == mappingRulesList[l].Target_Field__c)
                                {                                    
                                    usedMappingObjectFieldsList.push(mappingObjectFieldsList[k].Name);
                                    break;
                                }
                            }                            
                        }
                    }
                }
            }*/           
        }
        console.log('usedMappingObjectFieldsList ::: ' , usedMappingObjectFieldsList)
        component.set("v.usedMappingObjectFieldsList" , usedMappingObjectFieldsList);
    },
    
    createColumnForSAPDataTable : function(component,event,helper) {
        //console.log('In createColumnForSAPDataTable')
        component.set('v.columns', [
            {label: 'Field Name', fieldName: 'Name', type: 'text', fixedWidth: 394,},            
            {label: 'Description', fieldName: 'Description__c', type: 'text', fixedWidth: 390,},
            {label: 'Data Type', fieldName: 'Datatype__c', type: 'text', fixedWidth: 390,},
            
            {label: '', type: 'button', initialWidth: 75,               
             typeAttributes:
             {
                 iconName: 'utility:delete',      
                 iconAlternativeText: 'Delete',
                 iconPosition: 'center' ,
                 variant: {fieldName: 'variantValue'},
                 title: 'Delete Field', name: 'delete',                                                    
                 disabled: {fieldName: 'actionDisabled'}, 
                 class: 'btn_next'}
            },
            
        ]);
            
            /*{ label: 'Delete', fieldName: 'DeleteField', type: 'button', sortable: true, 
             cellAttributes: { 
                 label: { fieldName: 'actionLabel'}, 
                 variant: {fieldName: 'variantValue'},
                 iconName: 'utility:delete', 
                 iconAlternativeText: 'Delete Field',
                 title: 'Delete Field', name: 'delete', 
                 iconPosition: 'center' ,
                 disabled: {fieldName: 'actionDisabled'}, 
                 class: 'btn_next'}                        
            }, */
            
            },
            createColumnForSalesforceDataTable : function(component,event,helper) {
            //console.log('In createColumnForSalesforceDataTable')
            component.set('v.columns', [
            {label: 'Field Name', fieldName: 'Name', type: 'text', fixedWidth: 587,},            
            {label: 'Description', fieldName: 'Description__c', type: 'text', fixedWidth: 587,},
            {label: '', type: 'button', initialWidth: 75, typeAttributes:
            { label: { fieldName: 'actionLabel'}, 
            title: 'Click to Delete', name: 'delete', 
            iconName: 'utility:delete', 
            disabled: {fieldName: 'actionDisabled'}, 
            class: 'btn_next'}},]);
    },
    handleRowActionHelper: function (component, event, helper) 
    {    
        var selectedItem = event.currentTarget;
        var index = selectedItem.dataset.value;
        var mappingObjectFieldsList = component.get("v.mappingObjectFieldsList");        
        var rows = mappingObjectFieldsList[index];
        var isUsed = false;
        var usedMappingObjectFieldsList = component.get("v.usedMappingObjectFieldsList");
        for(var i = 0 ; i < usedMappingObjectFieldsList.length ; i++)
        {
            var usedFieldsNameList = (usedMappingObjectFieldsList[i]).split('#*~*#') ;
            if(usedFieldsNameList[0] == rows.Name)
            {
                isUsed = true;
                if(usedFieldsNameList[1] == 'Contract Rule'){
                    helper.LightningToastmessage(component, event, helper,'This Field is referred in Contract Rule, hence it cannot be deleted.','Error');
                }else if(usedFieldsNameList[1] == 'Mapping Rule'){
                    helper.LightningToastmessage(component, event, helper,'This Field is referred in Mapping Rule, hence it cannot be deleted.','Error');
                }else if(usedFieldsNameList[1] == 'Response Rule'){
                    helper.LightningToastmessage(component, event, helper,'This Field is referred in Response Rule, hence it cannot be deleted.','Error');
                }
                break;
            }
        }
        if(!isUsed){
            component.set('v.onDeleteClick',true);
            component.set('v.recordIdToDelete',rows.Id);   
        }
        
        /*
        var action = event.getParam('action');  
        var rows = event.getParam('row');
        //var rows = JSON.parse(JSON.stringify(event.getParam('row')));                        
        //console.log('rows ::: ' , rows);
        //console.log('action.name ::: ',action.name)
        switch (action.name) 
        {           
            case 'delete':
                var isUsed = false;
                var usedMappingObjectFieldsList = component.get("v.usedMappingObjectFieldsList");
                for(var i = 0 ; i < usedMappingObjectFieldsList.length ; i++)
                {
                    var usedFieldsNameList = (usedMappingObjectFieldsList[i]).split('#*~*#') ;
                    
                    if(usedFieldsNameList[0] == rows.Name)
                    {
                        isUsed = true;
                        if(usedFieldsNameList[1] == 'Contract Rule')
                            helper.LightningToastmessage(component, event, helper,'Cannot delete this Object Field. It is being used in a Contract Rule.','Error');
                        else
                            helper.LightningToastmessage(component, event, helper,'Cannot delete this Object Field. It is being used in a Mapping Rule.','Error');
                        break;
                    }
                }
                if(!isUsed){
                    component.set('v.onDeleteClick',true);
                    component.set('v.recordIdToDelete',rows.Id);   
                }
                break;
            case 'edit':
                
                var isUsed = false;
                var usedMappingObjectFieldsList = component.get("v.usedMappingObjectFieldsList");
                for(var i = 0 ; i < usedMappingObjectFieldsList.length ; i++)
                {
                    var usedFieldsNameList = (usedMappingObjectFieldsList[i]).split('#*~*#') ;
                    if(usedFieldsNameList[0] == rows.Name)
                    {
                        isUsed = true;                        
                        break;
                    }
                }
                component.set("v.isUsedInMappingContract",isUsed);
                component.set("v.mappingObjectFieldDetail",rows);
                component.set("v.editObjectField",true);
                break;
            default:
                break;
        } 
        
        */
    },
    closeDeleteModalHelper: function (component, event, helper) 
    {                
        component.set('v.onDeleteClick',false);
    },
    handleDeleteObjectFieldHelper: function (component, event, helper) 
    {
        //console.log(component.get("v.recordIdToDelete"))
        var action = component.get("c.deleteMappingObjectField");
        action.setParams({            
            "objectName" : 'Mapping_Object_Field__c',
            "recId" : component.get("v.recordIdToDelete")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            //console.log('state ::: ' + state)
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();                
                helper.LightningToastmessage(component, event, helper,"Field deleted successfully.","Success");
                component.set("v.loadingSpinner",false);
                $A.get('e.force:refreshView').fire();                                    
                component.set('v.onDeleteClick',false);
                helper.getMappingObjectFieldsList(component, event, helper); 
                var appEvent = $A.get("e.c:triggerInitTabsEvent");
                appEvent.setParams({
                    "recId" : component.get("v.mappingObjectDetails.Id"),
                    "ObjectName" : "Mapping_Object__c"
                });
                appEvent.fire();
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
    
    handleSaveObjectFieldsHelper: function (component, event, helper) 
    {
        //console.log('In handleSaveObjectFieldsHelper')
        
        var mappingObjectList =  component.find("newobjectField").get("v.mappingFieldsList");
        var deletedFildsList =  component.find("newobjectField").get("v.deletedFildsList");
        //console.log('mappingObjectList ::: ' , mappingObjectList)
        
        var finalMappingObjectFieldsList = [];//component.get("v.finalMappingObjectFieldsList");
        for(var i= 0 ; i < mappingObjectList.length ; i++)
        {
            //console.log('i ::: ' , i)
            //console.log('mappingObjectList [i] ::: ' + JSON.stringify(mappingObjectList[i]))
            
            var temp = {
                'Id':mappingObjectList[i].Id,
                'Name':mappingObjectList[i].Name ,
                'Description__c' : mappingObjectList[i].Description__c ,
                'Datatype__c' : mappingObjectList[i].Datatype__c ,
                'Object__c' : component.get("v.mappingObjectDetails.Id")
            };
            
            if(temp.Id == undefined || temp.Id == null || temp.Id == ''){
                delete temp.Id;
            }
            finalMappingObjectFieldsList.push(temp);
        }
        
        var finalDeleteMappingObjectFieldsList = [];//component.get("v.finalDeleteMappingObjectFieldsList");
        for(var i= 0 ; i < deletedFildsList.length ; i++)
        {
            //console.log('i ::: ' , i)
            //console.log('deletedFildsList [i] ::: ' + JSON.stringify(deletedFildsList[i]))
            
            var temp = {
                'Id':deletedFildsList[i].Id,
                'Name':deletedFildsList[i].Name ,
                'Description__c' : deletedFildsList[i].Description__c ,
                'Datatype__c' : deletedFildsList[i].Datatype__c ,                
            };
            if(temp.Id == undefined || temp.Id == null || temp.Id == ''){
                delete temp.Id;
            }
            finalDeleteMappingObjectFieldsList.push(temp);
        }
        
        //for(var i= 0 ; i < finalMappingObjectFieldsList.length ; i++)
        //console.log('finalMappingObjectFieldsList ::: ' ,JSON.stringify(finalMappingObjectFieldsList[i]));
        
        //for(var i= 0 ; i < finalDeleteMappingObjectFieldsList.length ; i++)
        //console.log('finalDeleteMappingObjectFieldsList ::: ' ,JSON.stringify(finalDeleteMappingObjectFieldsList[i]));
        
        var action = component.get("c.saveanddeleteMappingObjectFieldsList");
        action.setParams({
            "mappingObjectFields" : finalMappingObjectFieldsList,
            "deleteList" : finalDeleteMappingObjectFieldsList            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            //console.log('state ::: ' + state)
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();                
                if(component.get("v.actionType") == 'Add'){
                    helper.LightningToastmessage(component, event, helper,"Fields created successfully.","Success");
                }
                else
                {
                    helper.LightningToastmessage(component, event, helper,"Fields updated successfully.","Success");
                }
                component.set("v.loadingSpinner",true);
                //$A.get('e.force:refreshView').fire();
                component.set('v.isAddNewField',false);
                helper.getMappingObjectFieldsList(component, event, helper); 
                var appEvent = $A.get("e.c:triggerInitTabsEvent");
                appEvent.setParams({
                    "recId" : component.get("v.mappingObjectDetails.Id"),
                    "ObjectName" : "Mapping_Object__c"
                });
                appEvent.fire();
            }
        });
        $A.enqueueAction(action);
        
    },
    
})