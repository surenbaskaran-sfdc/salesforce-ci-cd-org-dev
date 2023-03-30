({
    handleInit : function(component,event,helper) {
        var changeRequest = component.get("v.dataTypeChangeRequest");
        var parentDataType = component.get("v.parentDataType");
        var selectedObject = component.get("v.selectedObject");
        
        var action = component.get("c.getFieldsForFieldSelector");
        action.setParams({ objectName : selectedObject });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var FieldDetails = {};
                var dataTypeDetails = {};
                var relationshipDetails = {};
                var fieldLabelDetails = {};
                var relationshipLabelDetails={};
                var ObjectData = JSON.parse(response.getReturnValue()[0]);
                
                var objectNames = Object.keys(ObjectData);
                var objectNamesLength =  objectNames.length;
                if(parentDataType != undefined && parentDataType != null && parentDataType !='')
                {
                    for(var i=0;i<objectNamesLength;i++)
                    {
                        var picklistValues = [];
                        var fieldLabelValues = {};
                        var dataTypeValues = {};
                        var relationshipValues = {};
                        var relationshipLabels = {};
                        var fieldsString = ObjectData[objectNames[i]];
                        var fieldsStringLength = fieldsString.length;
                        for(var j=0;j<fieldsStringLength;j++)
                        {
                            if(objectNames[i] == selectedObject)
                            {
                                var fieldInformation = fieldsString[j].split('--');
                                fieldLabelValues[fieldInformation[1]] = fieldInformation[0];
                                var datatypeor = fieldInformation[2];
                                
                                //var mappingObjectFieldsList = component.get("v.storedMappingObjectFieldsList");
                                //console.log('mappingObjectFieldsList ::: ' , mappingObjectFieldsList)
                                //var isAvailableInDatastore = false;
                               
                                /*
                                for(var k = 0 ; k < mappingObjectFieldsList.length ; k++)
                                {                                   
                                    console.log('Field 1 ::: ' , mappingObjectFieldsList[k].label + ', Field 2 ::: ' ,fieldInformation[1])
                                    if(mappingObjectFieldsList[k].label == fieldInformation[1])
                                    {
                                        
                                        isAvailableInDatastore = true;
                                        break;
                                    }
                                }
                                if(isAvailableInDatastore){*/
                                if(fieldInformation[2] == 'REFERENCE' && fieldInformation[0].endsWith('>'))
                                {
                                    picklistValues.push({'label': fieldInformation[0], 'value':fieldInformation[1]})
                                }
                                // }
                            }
                            else
                            {
                                var fieldInformation = fieldsString[j].split('--');
                                picklistValues.push({'label': fieldInformation[0], 'value':fieldInformation[1]})
                                fieldLabelValues[fieldInformation[1]] = fieldInformation[0];
                                var datatypeor = fieldInformation[2];
                                if(changeRequest){
                                    switch (fieldInformation[2]) {
                                        case 'DATETIME' :
                                            datatypeor = 'datetime';
                                            break;
                                        case 'TIME' : 
                                            datatypeor = 'time';
                                            break;
                                        case 'DATE' :
                                            datatypeor = 'date';
                                            break;
                                        case 'INTEGER':
                                        case 'DOUBLE':
                                        case 'PERCENT': 
                                        case 'CURRENCY': 
                                            datatypeor = 'number';
                                            break;
                                        case 'BOOLEAN' :
                                            datatypeor = 'boolean';
                                            break;
                                        default :
                                            datatypeor = 'text';
                                    }
                                }
                                dataTypeValues[fieldInformation[1]] = datatypeor;
                                if(fieldInformation[2] == 'REFERENCE'){
                                    relationshipValues[fieldInformation[1]] = fieldInformation[3];
                                    if(fieldInformation[3] != undefined && fieldInformation[3] != null && fieldInformation[3]!='null' && fieldInformation[3]!=''){
                                        relationshipLabels[fieldInformation[3]] = fieldInformation[1];
                                    }
                                }
                            }                                                                                                                                            
                            dataTypeValues[fieldInformation[1]] = datatypeor;
                            if(fieldInformation[2] == 'REFERENCE'){
                                relationshipValues[fieldInformation[1]] = fieldInformation[3];
                                if(fieldInformation[3] != undefined && fieldInformation[3] != null && fieldInformation[3]!='null' && fieldInformation[3]!=''){
                                    relationshipLabels[fieldInformation[3]] = fieldInformation[1];
                                    
                                }
                            }
                        }
                        picklistValues = helper.sortPicklistValues(component,event,helper,picklistValues);
                        FieldDetails[objectNames[i]] = picklistValues;
                        dataTypeDetails[objectNames[i]] = dataTypeValues;
                        relationshipDetails[objectNames[i]] = relationshipValues;
                        fieldLabelDetails[objectNames[i]] = fieldLabelValues;
                        relationshipLabelDetails[objectNames[i]] = relationshipLabels;
                    }
                }else{
                    for(var i=0;i<objectNamesLength;i++){
                        var picklistValues = [];
                        var fieldLabelValues = {};
                        var dataTypeValues = {};
                        var relationshipValues = {};
                        var relationshipLabels = {};
                        var fieldsString = ObjectData[objectNames[i]];
                        var fieldsStringLength = fieldsString.length;
                        for(var j=0;j<fieldsStringLength;j++){
                            var fieldInformation = fieldsString[j].split('--');
                            picklistValues.push({'label': fieldInformation[0], 'value':fieldInformation[1]})
                            fieldLabelValues[fieldInformation[1]] = fieldInformation[0];
                            var datatypeor = fieldInformation[2];
                            if(changeRequest){
                                switch (fieldInformation[2]) {
                                    case 'DATETIME' :
                                        datatypeor = 'datetime';
                                        break;
                                    case 'TIME' : 
                                        datatypeor = 'time';
                                        break;
                                    case 'DATE' :
                                        datatypeor = 'date';
                                        break;
                                    case 'INTEGER':
                                    case 'DOUBLE':
                                    case 'PERCENT': 
                                    case 'CURRENCY': 
                                        datatypeor = 'number';
                                        break;
                                    case 'BOOLEAN' :
                                        datatypeor = 'boolean';
                                        break;
                                    default :
                                        datatypeor = 'text';
                                }
                            }
                            dataTypeValues[fieldInformation[1]] = datatypeor;
                            if(fieldInformation[2] == 'REFERENCE'){
                                relationshipValues[fieldInformation[1]] = fieldInformation[3];
                                if(fieldInformation[3] != undefined && fieldInformation[3] != null && fieldInformation[3]!='null' && fieldInformation[3]!=''){
                                    relationshipLabels[fieldInformation[3]] = fieldInformation[1];
                                }
                            }
                        }
                        picklistValues = helper.sortPicklistValues(component,event,helper,picklistValues);
                        FieldDetails[objectNames[i]] = picklistValues;
                        dataTypeDetails[objectNames[i]] = dataTypeValues;
                        relationshipDetails[objectNames[i]] = relationshipValues;
                        fieldLabelDetails[objectNames[i]] = fieldLabelValues;
                        relationshipLabelDetails[objectNames[i]] = relationshipLabels;
                    }
                }
                component.set("v.FieldDetails",FieldDetails);
                component.set("v.dataTypeDetails",dataTypeDetails);
                component.set("v.relationshipDetails",relationshipDetails);
                component.set("v.fieldLabelDetails",fieldLabelDetails);
                var lookupDetails = JSON.parse(response.getReturnValue()[1]);
                component.set("v.lookupDetails",lookupDetails);
                var objectLabelMap = JSON.parse(response.getReturnValue()[2]);
                component.set("v.objectNames",objectLabelMap);
                //console.log('FieldDetails',JSON.parse((JSON.stringify(component.get("v.FieldDetails")))));
                //console.log('dataTypeDetails',JSON.parse((JSON.stringify(component.get("v.dataTypeDetails")))));
                //console.log('relationshipDetails',JSON.parse((JSON.stringify(component.get("v.relationshipDetails")))));
                //console.log('objectNames',JSON.parse((JSON.stringify(component.get("v.objectNames")))));
                //console.log('lookupDetails',JSON.parse((JSON.stringify(component.get("v.lookupDetails")))));
                //console.log('fieldLabelDetails',JSON.parse((JSON.stringify(component.get("v.fieldLabelDetails")))));
                component.set("v.breadcrumbCollection",[{"label":objectLabelMap[selectedObject],"value":selectedObject,"relationshipName":'','breadcrumbName':objectLabelMap[selectedObject]}]);
                var selectedFieldFromParent = component.get("v.selectedFieldFromParent");
                //console.log('selectedFieldFromParent',selectedFieldFromParent)
                if(selectedFieldFromParent != undefined && selectedFieldFromParent != null && selectedFieldFromParent!= '')
                {
                    var breadcrumbCollection = component.get("v.breadcrumbCollection");
                    var selectedFieldsList = selectedFieldFromParent.split(".");
                    var selectedFieldsListLength = selectedFieldsList.length-1;
                    var isBroke = false;
                    for(var b=1;b<selectedFieldsListLength;b++){
                        var previousObject = breadcrumbCollection[b-1].value;
                        var relatedFieldName =  relationshipLabelDetails[previousObject][selectedFieldsList[b]]; 
                        if(relatedFieldName != undefined && relatedFieldName != null && relatedFieldName != '' && relatedFieldName !='null'){
                            var relatedfieldObject =  lookupDetails[previousObject][relatedFieldName];
                        	var relatedfieldObjectLabel = objectLabelMap[relatedfieldObject];
                            breadcrumbCollection.push({"label":relatedfieldObjectLabel,"value":relatedfieldObject,"relationshipName":selectedFieldsList[b],'breadcrumbName':fieldLabelDetails[previousObject][relatedFieldName].toUpperCase().slice(0, -2)});
                        }
                        else{
                            isBroke = true;
                            break;
                        }
                    }
                    component.set("v.isBroke",isBroke);
                    if(isBroke){
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "type": "Error",
                            "title": "Error",
                            "message": 'Already selected field doesn\'t exist.'
                        });
                        toastEvent.fire();
                        component.set("v.fieldsCollection",FieldDetails[selectedObject]);
                    }else{
                        //insert the last selected field
                    	var finalSelectedField = selectedFieldsList[selectedFieldsListLength];
                        var finalSelectedFieldLabel = fieldLabelDetails[breadcrumbCollection[selectedFieldsListLength-1].value][finalSelectedField];
                        breadcrumbCollection.push({"label":finalSelectedFieldLabel.toUpperCase(),"value":finalSelectedField,"relationshipName":selectedFieldsList[b],'breadcrumbName':finalSelectedFieldLabel.toUpperCase()});
                        component.set("v.breadcrumbCollection",breadcrumbCollection);
                        component.set("v.fieldsCollection",FieldDetails[breadcrumbCollection[selectedFieldsListLength-1].value]);
                        component.set("v.selectedFieldObject",objectLabelMap[breadcrumbCollection[selectedFieldsListLength-1].value]);
                        component.set("v.selectedFieldLabel",finalSelectedFieldLabel);
                        component.set("v.selectedField",finalSelectedField);
                        component.set("v.fieldSelectedFlag",true);
                    }
                }
                else{
                    component.set("v.fieldsCollection",FieldDetails[selectedObject]);
                }
                component.set("v.doInitFlag",true);
                helper.removeSpinner(component,event,helper);
            }
        });
        $A.enqueueAction(action);
    },
    sortPicklistValues: function(component,event,helper,picklistValues){
        picklistValues.sort(function(a, b){
            var nameA=a.label, nameB=b.label
            if (nameA < nameB) //sort string ascending
                return -1 
                if (nameA > nameB)
                    return 1
                    return 0 //default return value (no sorting)
        })
        return picklistValues;
    },
    onPicklistChange : function(component,event,helper){
        var selectedField = component.get("v.selectedField");
        
        //console.log('selectedField ::: ' , selectedField)
        
        if(selectedField == undefined || selectedField == null || selectedField == ''){
            component.set("v.fieldSelectedFlag",false);
            component.set("v.selectedFieldObject",'');
            component.set("v.selectedFieldLabel",'');
        }
        else{
            var breadcrumbCollection = JSON.parse(JSON.stringify(component.get("v.breadcrumbCollection")));
            var currentObject = breadcrumbCollection[breadcrumbCollection.length - 1].value;
            var lookupDetails = component.get("v.lookupDetails")[currentObject];
            var lookupObject = '';
            if(lookupDetails != undefined && lookupDetails != null && lookupDetails!=''){
                lookupObject = lookupDetails[selectedField];
            }
            if(lookupObject != undefined && lookupObject != null && lookupObject!= ''){
                component.set("v.fieldSelectedFlag",false);
                component.set("v.selectedFieldObject",'');
                component.set("v.selectedFieldLabel",'');
                var fieldLabels = component.get("v.fieldLabelDetails");
                var objectLabels = component.get("v.objectNames");
                var relationshipNames = component.get("v.relationshipDetails");
                var picklistValues = component.get("v.FieldDetails");
                var breadcrum = {
                    "label":objectLabels[lookupObject].toUpperCase(),
                    "value":lookupObject,
                    "relationshipName":relationshipNames[currentObject][selectedField],
                    'breadcrumbName':fieldLabels[currentObject][selectedField].toUpperCase().slice(0, -2)
                };                
                breadcrumbCollection.push(breadcrum);
                component.set("v.fieldsCollection",picklistValues[lookupObject]);
                component.set("v.selectedField",'');
            }
            else
            {
                var fieldLabels = component.get("v.fieldLabelDetails");
                var breadcrum = {"label":fieldLabels[currentObject][selectedField].toUpperCase(),
                                 "value":selectedField,
                                 "relationshipName":'',
                                 'breadcrumbName':fieldLabels[currentObject][selectedField].toUpperCase()}
                breadcrumbCollection.push(breadcrum);
                var objectLabels = component.get("v.objectNames");
                component.set("v.selectedFieldObject",objectLabels[currentObject]);
                component.set("v.selectedFieldLabel",fieldLabels[currentObject][selectedField]);
                component.set("v.fieldSelectedFlag",true);
            }
            component.set("v.breadcrumbCollection",breadcrumbCollection);
        }
    },
    onNavigation : function(component,event,helper){
        component.set("v.fieldSelectedFlag",false);
        component.set("v.selectedFieldObject",'');
        component.set("v.selectedFieldLabel",'');
        component.set("v.selectedField",'');
        var index = event.getSource().get("v.name");
        var breadcrumbCollection = JSON.parse(JSON.stringify(component.get("v.breadcrumbCollection")));
        var breadcrumbCollectionLength = breadcrumbCollection.length;
        if(index != 0){
            if(breadcrumbCollectionLength == index+1){
                breadcrumbCollection.splice(index,1);
                var picklistValues = component.get("v.FieldDetails");
                component.set("v.fieldsCollection",picklistValues[breadcrumbCollection[index-1].value]);
            }
            else{
                var temp =[];
                for(var t=0;t<index;t++){
                    temp.push(breadcrumbCollection[t]);
                }
                breadcrumbCollection = temp;
                var picklistValues = component.get("v.FieldDetails");
                component.set("v.fieldsCollection",picklistValues[breadcrumbCollection[index-1].value]);
            }
        }
        else{
            breadcrumbCollection = [breadcrumbCollection[0]];
            var picklistValues = component.get("v.FieldDetails");
            component.set("v.fieldsCollection",picklistValues[breadcrumbCollection[0].value]);
        }
        component.set("v.breadcrumbCollection",breadcrumbCollection);
    },
    addSpinner: function (component, event, helper) {
        var spinner = component.find("uSpinnerContainer");
        $A.util.removeClass(spinner, "slds-hide");
    },
    
    removeSpinner: function (component, event, helper) {
        var spinner = component.find("uSpinnerContainer");
        $A.util.addClass(spinner, "slds-hide");
    },
})