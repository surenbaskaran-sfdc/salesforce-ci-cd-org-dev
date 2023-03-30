({  
    getContractRulesList: function(component,event,helper) 
    {
        var action = component.get("c.getChildDataList");
        action.setParams({
            "childObjectName" : 'Contract_Rule__c',
            "parentObjectName" : 'Mapping_Contract__c',
            "recId" : component.get("v.recordId")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                if(storeResponse.length!=0){
                    storeResponse.sort(function(a,b) {
                        var t1 = a.Rule_Order__c == b.Rule_Order__c, t2 = a.Rule_Order__c < b.Rule_Order__c;
                        return t1? 0: (storeResponse?-1:1)*(t2?1:-1);
                    });
                }
                
                storeResponse.forEach(function(record){  
                    record.linkName = '/'+record.Id;                    
                });
                
                component.set("v.contractRulesList",storeResponse); 
                component.set("v.loadingSpinner",false);                
            }
        });
        $A.enqueueAction(action);
    }, 
    escapeEventHelper: function (component, event, helper) {
        window.addEventListener("keydown", $A.getCallback(function (event) {
            if (event.code == 'Escape') {                
                helper.onPressKeyboardKey(component, event, helper);
            }
        }, true));
    },
    
    onPressKeyboardKey: function (component, event, helper) {
        var keyValue = event.which;          
        if (keyValue == 27) {
            if(component.get("v.editContractRule"))
            {
                component.set("v.editContractRule", false);
                component.set("v.isErrorFound", false);
                component.set("v.errorText", ''); 
            }
            if(component.get("v.isAddNewRule"))
            {
                component.set("v.isAddNewRule", false);
                component.set("v.isErrorFound", false);
                component.set("v.errorText", ''); 
            }
            if(component.get("v.isReorderContractRule"))
            {
                component.set("v.isReorderContractRule", false);
                component.set("v.isErrorFound", false);
                component.set("v.errorText", ''); 
            }
            if(component.get("v.onDeleteClick"))
            {
                component.set("v.onDeleteClick", false);
                component.set("v.isErrorFound", false);
                component.set("v.errorText", ''); 
            }
        }
    },
    getIntegrationMappingDetailsHelper : function(component, event, helper) {
        
        var action = component.get("c.getIntegrationMappingDetails");
        action.setParams({
            "objectName": 'Mapping_Contract__c',            
            "recId": component.get("v.recordId")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                if(storeResponse.length>0)
                {                    
                    component.set("v.mappingContractDetails",storeResponse[0][0]);
                    component.set("v.integrationMappingList",storeResponse[1]);
                }      
                component.set("v.loadingSpinner",false);
                
            }
        });
        $A.enqueueAction(action);
    },  
    getMappingContractList: function (component, event, helper) {
        var action = component.get("c.getDataList");
        action.setParams({            
            "objectName" : 'Mapping_Contract__c',  
            "recId" : component.get("v.recordId")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                component.set("v.mappingContractDetails",storeResponse[0]);
                
            }
        });
        $A.enqueueAction(action);
        
    },
    
    columnsWithActions: function (component, event, helper) {
        var customActions = [
            { label: 'Edit', name: 'edit' },
            { label: 'Delete', name: 'delete' }
        ];      
        
        var columns = component.get('v.columns');
        var columnsWithActions = [];
        columnsWithActions.push(...columns);
        columnsWithActions.push({ type: 'action', typeAttributes: { rowActions: customActions } });
        component.set('v.columns',  columnsWithActions);
    }, 
       
    createColumnsForContractRules : function(component,event,helper) {
        component.set('v.columns', [
            //fixedWidth: 314,
            {label: 'Contract Rule Name', fieldName: 'linkName', type: 'url',             
             typeAttributes: {label: { fieldName: 'Name'},
                               
                              tooltip: { fieldName: 'Name' }, 
                              target: '_self'}
            },            
            {label: 'Rule Order', fieldName: 'Rule_Order__c', type: 'text'},
            {label: 'Source Object', fieldName: 'Source_Object__c', type: 'text'},
            {label: 'Target Object', fieldName: 'Target_Object__c', type: 'text'} ,
            {label: 'Record Type', fieldName: 'Source_Record_Type__c', type: 'text'} 
        ]);
        
        /*{label: 'Contract Rule', fieldName: 'linkName', type: 'url',
             typeAttributes: {label: { fieldName: 'Name'},
                              tooltip: { fieldName: 'Name' },  
                              target: '_self'}}, */
    },
    handleRowActionHelper: function (component, event, helper) 
    {       
        var action = event.getParam('action');  
        var rows = event.getParam('row');
        var rows = JSON.parse(JSON.stringify(event.getParam('row')));                        
        switch (action.name) 
        {           
            case 'delete':
                var integrationMappingList = component.get("v.integrationMappingList");
                var isUsedFlag = false;                
                for(var item in integrationMappingList)
                {
                    if(component.get("v.mappingContractDetails.Name") == integrationMappingList[item]['Mapping_Contract__c']
                       &&rows['Name'] == integrationMappingList[item]['Contract_Rule__c']
                      )
                    {
                        var toastEvent = $A.get("e.force:showToast");            
                        toastEvent.setParams({
                            message: 'Cannot delete this Mapping Contract. It is being used in a Integration Mapping.',
                            type: 'ERROR',
                            "mode":"pester"    
                        });
                        toastEvent.fire();
                        isUsedFlag = true;
                        break;
                    }
                }                
                if(!isUsedFlag){   
                    component.set('v.onDeleteClick',true);         
                    component.set('v.recordToDelete',rows);  
                }
                break;
            case 'edit':                
                component.set("v.tempContractRuleDetail",JSON.parse(JSON.stringify(rows)));
                component.set("v.contractRuleDetail",rows);
                component.set("v.editContractRule",true);
                break;
            default:
                break;
        }        
    },
    closeDeleteModalHelper: function (component, event, helper) 
    {                
        component.set('v.onDeleteClick',false);
    },
    handleDeleteContractRuleHelper: function (component, event, helper) 
    {
        var action = component.get("c.deleteContractRule");
        action.setParams({            
            "contractRuleDetail" : component.get("v.recordToDelete")            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var evt =  $A.get("e.c:MappingContractRefreshEvent"); 
				evt.fire();
                
                var storeResponse = response.getReturnValue();                
                helper.LightningToastmessage(component, event, helper,"Contract Rule deleted successfully.","Success");
                component.set("v.loadingSpinner",false);
                $A.get('e.force:refreshView').fire();                                    
                component.set('v.onDeleteClick',false);
                helper.getContractRulesList(component, event, helper); 
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