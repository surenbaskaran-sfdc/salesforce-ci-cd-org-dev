({
    doInit : function(component, event, helper) {
        component.set("v.loadingSpinner",true);
        var recordId = component.get( "v.recordId" );
        
        var action = component.get("c.getMappingContractAndContractRule");
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
                    component.set("v.contractinfo", storeResponse[0][0]);
                    component.set("v.contractRulesList",storeResponse[1]);
                    component.set("v.integrationMappingList",storeResponse[2]);
                    component.set("v.jobList",storeResponse[3] );
                    component.set("v.label",!storeResponse[0][0].Active__c);
                    if(storeResponse[0][0].Active__c)
                        component.set("v.labelName" , 'Deactivate');
                    else
                        component.set("v.labelName" , 'Activate');
                }
                component.set("v.loadingSpinner",false);
                
            }
        });
        $A.enqueueAction(action);                          
        //helper.escapeEventHelper(component, event, helper);
    },
    handleActivation : function(component,event,helper){
        //component.set("v.loadingSpinner",true);
        if(component.get("v.labelName") == 'Activate'){
            component.set("v.contractinfo.Active__c", true);
            helper.handleSaveMappingContract(component,event,helper);
        }
        else{
            var integrationMappingList = component.get("v.integrationMappingList");
            var isUsedFlag = false;
            for(var item in integrationMappingList)
            {
                if(component.get("v.contractinfo.Name") == integrationMappingList[item]['Mapping_Contract__c'])
                {
                    var toastEvent = $A.get("e.force:showToast");            
                    toastEvent.setParams({
                        message: 'Mapping Contract is referred in Integration Mapping, hence it cannot be deactivated.',
                        type: 'ERROR',
                        "mode":"pester"    
                    });
                    toastEvent.fire();
                    isUsedFlag = true;
                    break;
                }
            }
            
            var jobList = component.get("v.jobList")
            if(jobList.length  > 0){
                var toastEvent = $A.get("e.force:showToast");            
                toastEvent.setParams({
                    message: 'Mapping Contract is referred in Jobs, hence it cannot be deactivated.',
                    type: 'ERROR',
                    "mode":"pester"    
                });
                toastEvent.fire();
                isUsedFlag = true;
            }    
            
            if(!isUsedFlag){
                component.set("v.deactivateContractFlag" , true);
            }
        }           
        helper.escapeEventHelper(component, event, helper);
    },
    handleCancelEditMappingContract: function(component,event,helper){
        component.set("v.editMappingContract",false)
        
    },
    
    handleSaveEditMappingContract: function(component,event,helper){
        alert('Inn')
    },
    
    handleDeactivation : function(component,event,helper){
        
        //component.set("v.mappingContractRecordId",)
        component.set("v.contractinfo.Active__c", false);
        helper.handleSaveMappingContract(component,event,helper);                
    },
    handleEditRecord : function(component){
                
        component.set("v.editMappingContract",true);
        /*
        var editRecordEvent = $A.get("e.force:editRecord");
        editRecordEvent.setParams({
            "recordId": component.get("v.recordId")
        });
        editRecordEvent.fire();        
        */
    },    
    
    
    
    handleDeleteRecord : function(component,event,helper)
    {
        //console.log('in handleDeleteRecord')
        helper.escapeEventHelper(component, event, helper);               
        
        if(!component.get("v.contractinfo.Active__c")){            
            var integrationMappingList = component.get("v.integrationMappingList");
            var isUsedFlag = false;
            for(var item in integrationMappingList)
            {
                //console.log('Mapping contract name ::: '+component.get("v.contractinfo.Name"))
                //console.log('integrationMappingList name ::: '+integrationMappingList[item]['Mapping_Contract__c'])
                if(component.get("v.contractinfo.Name") == integrationMappingList[item]['Mapping_Contract__c'])
                {
                    var toastEvent = $A.get("e.force:showToast");            
                    toastEvent.setParams({
                        message: 'Mapping Contract is referred in Integration Mapping, hence it cannot be deactivated.',
                        type: 'ERROR',
                        "mode":"pester"    
                    });
                    toastEvent.fire();
                    isUsedFlag = true;
                    break;
                }
            }
            if(!isUsedFlag){
                component.set("v.deleteContractFlag",true);
            }
        }
        else
        {                                                
            var toastEvent = $A.get("e.force:showToast");            
            toastEvent.setParams({
                message: 'Mapping Contract is Active, hence it cannot be deleted.',                     
                type: 'ERROR',
                "mode":"pester"    
            });
            toastEvent.fire();
        }
    },
    
    deleteMappingConract: function(component,event,helper)
    {
        //console.log('In deleteMappingConract')                
        helper.handleDeleteMappingContract(component,event,helper)
        
    },
    
    handleCancel : function(component, event, helper) {            
        component.set("v.deleteContractFlag",false); 
    },
    
    handleCancelDeactivate : function(component, event, helper) {            
        component.set("v.deactivateContractFlag",false); 
    },
    
    
    
    handleDeactivate : function(component,event){
        
        
        var check1 = component.get("c.deactivatecontract");
        check1.setParams({
            "acc":component.get("v.contractinfo")
        });
        check1.setCallback(this, function(val) {
            var state = val.getState();
            if (state === "SUCCESS"){
                component.set("v.label",true)
                var navEvt = $A.get("e.force:navigateToSObject");
                navEvt.setParams({
                    "recordId": component.get('v.recordId') ,
                    "slideDevName": "Details"});
                navEvt.fire();
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message":'Mapping Contract ' + component.get("v.contractinfo.Name") + ' has been deactivated successfully.',
                    "type": 'success',
                    "duration":' 5000',
                    "mode":"dismissible"
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(check1);
        
    },
    
    
    handleactivate : function(component,event){
       
        
        var check1 = component.get("c.activatecontract");
        check1.setParams({
            "acc":component.get("v.contractinfo")
        });
        check1.setCallback(this, function(val) {
            var state = val.getState();
            if (state === "SUCCESS"){
                if(val.getReturnValue()){
                    component.set("v.label",false)
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": component.get('v.recordId') ,
                        "slideDevName": "Details"});
                    navEvt.fire();
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success!",
                        "message":'Mapping Contract ' + component.get("v.contractinfo.Name") + ' has been activated successfully.',
                        "type": 'success',
                        "duration":' 5000',
                        "mode":"dismissible"
                    });
                    toastEvent.fire();
                }
            
            else
            {
                component.set("v.label",true)
                var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
            "title": "Error!",
            "message": 'Deactivate active Mapping Contract and Try again!',
            "type": 'Error',
            "mode":"pester"
        });
        toastEvent.fire();
                
            }}
        });
        $A.enqueueAction(check1);
        
    },
    onPressKey: function (component, event, helper) {  
        var keyValue = event.which;
        if (keyValue == 27) {
            component.set("v.editMappingContract",false);
            component.set("v.deleteContractFlag",false);
            component.set("v.deactivateContractFlag",false); 
        }
        //helper.onPressKeyboardKey(component, event, helper);
    },
    
})