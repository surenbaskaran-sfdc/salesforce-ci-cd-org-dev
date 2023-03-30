({
    doInit : function(component, event, helper) {
        helper.handleInit(component,event,helper);
    },
    handlePicklistChange : function(component, event, helper) {
        helper.onPicklistChange(component,event,helper);
    },
    handleNavigation : function(component, event, helper) {
        helper.onNavigation(component,event,helper);
    },
    validateComponent : function(component, event, helper) {
        var param = {};
        if(component.get("v.fieldSelectedFlag")){
            var breadcrumbCollection = JSON.parse(JSON.stringify(component.get("v.breadcrumbCollection")));
            var breadcrumbCollectionLength = breadcrumbCollection.length;
            var field = '';
            for(var i=0;i<breadcrumbCollectionLength;i++){
                if(i == 0){
                    field = field + breadcrumbCollection[i].value;
                }
                else{
                    if(breadcrumbCollection[i].relationshipName != undefined && breadcrumbCollection[i].relationshipName != null && breadcrumbCollection[i].relationshipName != 'null' && breadcrumbCollection[i].relationshipName !=''){
                        field = field + '.' +breadcrumbCollection[i].relationshipName;
                    }else{
                        field = field + '.' + breadcrumbCollection[i].value;
                    }
                }
            }
            //get the datatype
            var dataTypeDetails = component.get("v.dataTypeDetails");
            var fieldname = breadcrumbCollection[breadcrumbCollectionLength-1].value;
            var object = breadcrumbCollection[breadcrumbCollectionLength-2].value;
            var dataType = dataTypeDetails[object][fieldname];
            param.isValid = true;
            param.field = field;
            param.dataType = dataType;
            param.fieldsCollection = component.get("v.fieldsCollection");
        }
        else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "type": "Error",
                "title": "Error",
                "message": 'Please select a field to insert.'
            });
            toastEvent.fire();
            param.isValid = false;
        }
        return param;
    },
})