({
    initCreateMappingObject : function(component, event, helper) 
    {     
        //console.log('In initCreateMappingObject')  
        
        var mappingObjectDetail = component.get("v.mappingObjectDetail");
        mappingObjectDetail.Name = '';
        mappingObjectDetail.Datastore__c = '';
        mappingObjectDetail.Description__c = '';
        mappingObjectDetail.Active__c = 'true';
        
        
        component.set("v.DatastoreError",'');
        component.set("v.objectError",'');
        
        component.set("v.isDisabled",true);
        component.set("v.mappingObjectDetail",mappingObjectDetail);
        
        
        
        
        var action = component.get("c.getMappingObjectFieldsDetails");
        action.setParams({
            "objectName":"Mapping_Object__c",
            "fieldName":"Datastore__c"
            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            //console.log('state ::: ' , state)
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                //console.log('storeResponse ::: ' , storeResponse)
                if(storeResponse.length>0)
                {                    
                    component.set("v.allObjectsList",storeResponse[0]);    
                    //component.set("v.dataStorePicklistValues",storeResponse[1]); 
                    
                    
                    
                    var datastorTypeList = [];                                          
                    //datastorTypeList.push({'label': '--None--', 'value': ''});
                    ////console.log('storeResponse[1].length ::: ',storeResponse[1].length)
                    for(var i=0 ; i< storeResponse[1].length; i++)
                    {
                        //console.log('storeResponse[1] ::: ' , JSON.parse(storeResponse[1][i]))
                        var pickListValue = JSON.parse(storeResponse[1][i]);
                        datastorTypeList.push({   
                            'label':pickListValue.label,
                            'value':pickListValue.label
                        });
                    }                
                    /*if(datastorTypeList.length!=0){
                        //console.log(datastorTypeList.length)
                        datastorTypeList.sort(function(a,b) {
                            var t1 = a.label == b.label, t2 = a.label < b.label;
                            return t1? 0: (datastorTypeList?-1:1)*(t2?1:-1);
                        });
                    } */                                
                    component.set("v.dataStorePicklistValues",datastorTypeList); 
                    
                    //console.log('allObjectsList ::: '+ JSON.stringify(component.get("v.allObjectsList")))
                    //console.log(component.get("v.allObjectsList").length)
                    //console.log('dataStorePicklistValues ::: '+component.get("v.dataStorePicklistValues"))
                    //component.set("v.mappingObjectDetail.Datastore__c",'Salesforce');
                    if(component.get("v.dataStoreName") == '')
                    {
                        component.set("v.isDisabled",true);
                    }                    
                }     
                component.set("v.loadingSpinner",false);
                
            }
        });
        $A.enqueueAction(action);
        helper.escapeEventHelper(component,event,helper);
        /*var mappingObjectDetail = component.get("v.mappingObjectDetail");
        
        mappingObjectDetail.Name = '';
        mappingObjectDetail.Datastore__c = '';
        mappingObjectDetail.Description__c = '';
        
        component.set("v.mappingObjectDetail",mappingObjectDetail);
        //console.log('mappingObjectDetail ::: ' , mappingObjectDetail);    */    
    },
    
    escapeEventHelper: function (component, event, helper) {             
        window.addEventListener("keydown", $A.getCallback(function (event) {
            if (event.code == 'Escape') {                
                helper.closeSettingsModalHelper(component, event, helper);
            }
        }, true));
    },
    
    closeSettingsModalHelper : function(component, event, helper) 
    {        
        var homeEvent = $A.get("e.force:navigateToObjectHome");
        homeEvent.setParams({
            "scope": "Mapping_Object__c"
        });
        homeEvent.fire(); 
        component.set("v.isErrorFound",false);
        //$A.get('e.force:refreshView').fire();
    },    
    validateMappingObjectData: function(component, event, helper) 
    {     
        //console.log('In validateMappingObjectData')
        
        var errorFieldsList = '';
        var isError = false;
        var mappingObjectDetail = component.get("v.mappingObjectDetail");                      
        var dataStoreName = component.get("v.mappingObjectDetail.Datastore__c");        
        var objectName = '';
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
            component.set("v.objectError","slds-has-error");
            //component.set("v.objectError","");
            //console.log(component.get("v.objectError"))
        }
        else
        {
            component.set("v.mappingObjectDetail.Name",objectName);
            component.set("v.objectError","");
        }
        if(errorFieldsList!='')
        {
            isError = true;
            component.set('v.isErrorFound',true);
            component.set("v.errorText","These required fields must be completed: " + errorFieldsList);
        }
        else
        {
            component.set('v.isErrorFound',false);
            component.set("v.errorText","");
        }
        //console.log('After validation')
        var description =  document.getElementById("7034:0").value;
        component.set("v.mappingObjectDetail.Description__c",description);
        var active =  component.get("v.isActive"); //document.getElementById("7035:0").value;        
        //console.log('active ::: ',active)        
        component.set("v.mappingObjectDetail.Active__c",active);                
        
        //console.log('isError ::: ' + isError)
        //console.log('mappingObjectDetail' + JSON.stringify(mappingObjectDetail))  
        return isError;
    },
    
    saveMappingObjectData: function(component, event, helper) 
    {
        //console.log('In saveMappingObjectData')
        //component.set("v.loadingSpinner",true);
        var action = component.get("c.saveMappingObject");
        action.setParams({ 
            "ObjectDetail": component.get("v.mappingObjectDetail")
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            //console.log('state ::: ' + state)
            if (state === "SUCCESS") {
                if(a.getReturnValue()!=null){
                    
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": a.getReturnValue(),
                        "isredirect" : false
                    });
                    navEvt.fire();
                    
                    /*var mappingObjectDetail = component.get("v.mappingObjectDetail");
                    mappingObjectDetail.Name = '';
                    mappingObjectDetail.Datastore__c = '';
                    mappingObjectDetail.Description__c = '';
                    mappingObjectDetail.Active__c = 'true';
                    
                    
                    component.set("v.DatastoreError",'');
                    component.set("v.objectError",'');
                    
                    component.set("v.isDisabled",true);
                    component.set("v.mappingObjectDetail",mappingObjectDetail);
                    
                    
                    component.set("v.loadingSpinner",false);
                    */
                    helper.LightningToastmessage(component, event, helper,"Object created successfully.","Success");
                                        
                }
                else{
                    component.set('v.isErrorFound',true);
                    component.set("v.errorText","Object with same name is already present. Try again with different name!");
                    component.set("v.loadingSpinner",false);
                    //component.set("v.mappingObjectDetail.Name",'');
                    //if(component.get("v.mappingObjectDetail.Datastore__c") == 'Salesforce')
                    component.set("v.objectError","slds-has-error");
                    //else
                    //    component.set("v.objectError","lookupField");
                }
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