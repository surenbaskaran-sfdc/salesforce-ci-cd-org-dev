({
    initMethods : function(component, event, helper) {
        helper.getAllObjectsAndPicklistValues(component, event, helper);
        
        
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
                //console.log('Mapping object fields ::: ',JSON.stringify(storeResponse))
                if(storeResponse.length > 0){
                    //console.log(storeResponse.length)
                    component.set("v.isUsed", true);
                    component.set("v.loadingSpinner",false);
                }                
                else
                    component.set("v.loadingSpinner",false);
            }
        });
        $A.enqueueAction(action);
    },
    
    
    getAllObjectsAndPicklistValues : function(component, event, helper) {
    var action = component.get("c.getMappingObjectDetails");
        action.setParams({});  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                if(storeResponse.length>0)
                {
                    component.set("v.ownerDetails", storeResponse[0][0]);
                    component.set("v.allObjectsList",storeResponse[1]);    
                    //component.set("v.dataStorePicklistValues",storeResponse[2]);
                    
                    
                    var datastorTypeList = [];
                    for(var i=0 ; i< storeResponse[2].length; i++)
                    {
                        //console.log('storeResponse[1] ::: ' , JSON.parse(storeResponse[2][i]))
                        var pickListValue = JSON.parse(storeResponse[2][i]);
                        datastorTypeList.push({   
                            'label':pickListValue.label,
                            'value':pickListValue.label
                        });
                    }                                         
                    component.set("v.dataStorePicklistValues",datastorTypeList); 
                    
                    var timeZoneJson = JSON.parse(storeResponse[3][0]);
                    component.set("v.timeZone",timeZoneJson.TimeZoneSidKey);
                    
                    
                    //console.log('allObjectsList ::: '+ JSON.stringify(component.get("v.allObjectsList")))
                    //console.log('dataStorePicklistValues ::: '+component.get("v.dataStorePicklistValues"))
                }
                helper.getMappingObjectDetailsHelper(component, event, helper);
                
                
            }
        });
        $A.enqueueAction(action);
},
    
    checkIsUsedMappingObjectHelper : function(component, event, helper) {
		//console.log('In checkIsUsedMappingObjectHelper')
        var action = component.get("c.checkIsUsedMappingObject");
        action.setParams({
            "objectName": component.get("v.mappingObjectDetail.Name")  ,
            "dataStore":component.get("v.mappingObjectDetail.Datastore__c")
            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var isUsed = response.getReturnValue();
                //console.log('isUsed ::: ' , isUsed)
                component.set("v.isUsed",response.getReturnValue());                
                //alert(component.get("v.isUsed"))
                component.set("v.isDisabled",response.getReturnValue());                
                component.set("v.isActiveDisabled",response.getReturnValue());
                if(response.getReturnValue())
                    component.set("v.loadingSpinner",false);
                else
                    helper.getMappingObjectFieldsList(component, event, helper);
            }
        });
        $A.enqueueAction(action);
	},
    
	getMappingObjectDetailsHelper : function(component, event, helper) {
		//console.log('In getMappingObjectDetailsHelper')
        var action = component.get("c.getDataList");
        action.setParams({
            "objectName": 'Mapping_Object__c',
            "recId": component.get("v.recordId")
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                if(storeResponse.length>0)
                {
                    component.set("v.mappingObjectDetail", storeResponse[0]);
                    //console.log('storeResponse ::: ' +JSON.stringify( storeResponse))
                    helper.checkIsUsedMappingObjectHelper(component, event, helper);
                }
                else{
                component.set("v.loadingSpinner",false);
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
    
    
    validateMappingObjectData: function(component, event, helper) 
    {     
        //console.log('In validateMappingObjectData')
        
        var errorFieldsList = '';
        var isError = false;
        var mappingObjectDetail = component.get("v.mappingObjectDetail");                      
        var dataStoreName = component.get("v.mappingObjectDetail.Datastore__c");        
        var objectName = '';
        //console.log('dataStoreName ::: ' , dataStoreName)
        /*if(dataStoreName == 'SAP'){
            objectName = document.getElementById("7033:0").value;                
            //console.log('objectName ::: ' + objectName)
        }
        else
        {*/
            objectName = component.get("v.mappingObjectDetail.Name");
        //}
        //console.log('dataStoreName',dataStoreName)
        if(dataStoreName =='' || dataStoreName == null)
        {
            //console.log('In ds')
            errorFieldsList = errorFieldsList + 'Datastore';
            component.set("v.DatastoreError","slds-has-error");
            isError = true;
        }
        else
        {
            component.set("v.DatastoreError","");
        }
        
        //console.log('objectName 1::: ',objectName)
        if(objectName ==undefined || objectName == null || objectName.trim() == '')
        {
            //console.log('In obj')
            if(errorFieldsList!=''){
                errorFieldsList = errorFieldsList + ', '
            }
            isError = true;
            errorFieldsList = errorFieldsList + 'Object Name';
            //component.set("v.objectNameError","slds-has-error");
            //component.set("v.objectNameError","lookupField");
            component.set("v.objectNameError","slds-has-error");
            //console.log(component.get("v.objectNameError"))
        }
        else
        {
            component.set("v.mappingObjectDetail.Name",objectName);
            component.set("v.objectNameError","");
        }
        if(errorFieldsList!='')
        {
            isError = true;
            component.set('v.isErrorFound',true);
            helper.LightningToastmessage(component, event, helper,"These required fields must be completed: " + errorFieldsList,"Error");
            //component.set("v.errorText","These required fields must be completed: " + errorFieldsList);
        }
        else
        {
            component.set('v.isErrorFound',false);
            component.set("v.errorText","");
        }
        //console.log('After validation')
        //var description =  document.getElementById("7034:0").value;
        ////console.log()
        //component.set("v.mappingObjectDetail.Description__c",description);
        var active =  component.get("v.mappingObjectDetail.Active__c"); //document.getElementById("7035:0").value;        
        //console.log('active ::: ',active)        
        //component.set("v.mappingObjectDetail.Active__c",active);
        
        
        
        //console.log('isError ::: ' + isError)
        //console.log('mappingObjectDetail' + JSON.stringify(mappingObjectDetail))  
        return isError;
    },
    
    
    onClickSaveHelper: function(component, event, helper) 
    {
        //console.log('In saveMappingObjectData')
        var action = component.get("c.saveMappingObject");
        action.setParams({ 
            "ObjectDetail": component.get("v.mappingObjectDetail")
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            //console.log('state ::: ' + state)
            if (state === "SUCCESS") {
                //console.log('Result ::: ' , a.getReturnValue() )
                if(a.getReturnValue()!=null){                    
                    component.get("v.isEditPage",false)
                    $A.get('e.force:refreshView').fire();                    
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": a.getReturnValue(),
                        "slideDevName": "Details"});
                    navEvt.fire();
                    helper.LightningToastmessage(component, event, helper,"Object updated successfully.","Success");
                }
                else
                {
                    component.set('v.isErrorFound',true);                                        
					component.set("v.objectError","lookupField");
                    helper.LightningToastmessage(component, event, helper,"Object with same name is already present. Try again with different name!","Error");
                }
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