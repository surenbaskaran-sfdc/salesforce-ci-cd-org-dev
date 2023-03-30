({
	handleGetMappingFieldsDetails: function(component,event,helper) 
    {
        var action = component.get("c.getMappingObjectAndFieldsDetails");
        action.setParams({
            "objectName": component.get("v.contractRuleDetail.Source_Object__c"),
            "dataStore": component.get("v.mappingContractDetail.Source_Datastore__c"),
            "type":'All'
            
        });  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                if(storeResponse.length>0)
                {
                    component.set("v.mappingObjectDetails",storeResponse[0]);
                    
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
                    
                    component.set("v.directFieldOptions",mappingObjectFieldsList);                                        
                    component.set("v.loadingSpinner",false);
                    component.set("v.directData", component.get("v.mappingRuleDetail.Transformation_Value__c"));
                    window.setTimeout(
                        $A.getCallback(function() {
                            if(component.find("directField")!= undefined){
                                component.find("directField").focus();
                            }
                        }), 1
                    );
                }                                                   
            }
        });
        $A.enqueueAction(action);                
    },
})