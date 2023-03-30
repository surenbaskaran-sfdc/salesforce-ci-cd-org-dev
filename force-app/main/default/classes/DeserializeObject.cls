/*********************************************************************************************************************************************************************************************************
Company 					: HTC Global Services
Developer 					: Arunkumar V K
Description					: Deserialize received JSON data and create sobject list
Related Aura Components   	: 
Related Apex Controllers  	: 
Created Date		  		: June 09, 2021
Last Modified Date	  		: June 09, 2021
**********************************************************************************************************************************************************************************************************/


public class DeserializeObject {
    
    public static String keyField = '', valueField = '' , dmlOperationType = '' ;    
    public static List<String> recordsWithMandatoryFields = new List<String>();
    public static List<SObject> allQueriedRecords = new List<SObject>();  
    public static Map<String,List<SObject>> queriedRecords = new Map<String,List<SObject>>();        
    public static List<String> objectList = new  list<String>();
    public static List<String> objectsList = new  list<String>();
    public static Map<String ,SObject> allQueriedRecordsMap = new Map<String ,SObject>();    
    public static List<String> externalIdList = new List<String>();
    // Deserialize received JSON data and create account list
    public static List<sObject> getsObjectList(String requestJsonData,String type, Mapping_Contract__c mappingContract,Contract_Rule__c contractRuleList,String targetObject,String externalId)
    {
        System.debug('In getobjectsList');            
        List< sObject > sObjectList = new List< sObject >();                
        List<Map<String, Object>> sObjectMapList = new List<Map<String, Object>>();
        objectsList = SFConnectController.getAllObjectNames();
        // Deserialize received JSON data 
        Object reqJsonData = (Object)JSON.deserializeUntyped(requestJsonData);
        
        
        // Get value for data field
        Map<String, Object> dataNode = (Map<String, Object>)((Map<String, Object>)reqJsonData).get('data');        
        
        // Get value for object field
        String sobjects = '';
        for(String data : dataNode.keySet())
        {
            sobjects = JSON.serialize(dataNode.get(data));
        }
        
        // Deserialize sobject field, and create a List with sobject details
        List<Object> sObjectData = (List<Object>)JSON.deserializeUntyped(sobjects);
        
        
        
        System.debug('contractRuleList'+contractRuleList);
        System.debug('externalId '+externalId);
        // Loop sobjectdata to seperate each sobject from JSON and add to a list.
        // Get ExternalId in a list
        for(Object record : sObjectData)
        {         
            Map<String, Object> recordMap = (Map<String, Object>)record;
            sObjectMapList.add(recordMap);
            externalIdList.add(String.valueOf(recordMap.get(externalId)));
        }       
        System.debug('externalIdList '+externalIdList); 
        System.debug('contractRuleList.Source_Object__c '+contractRuleList.Source_Object__c);
        //List<SObject> objectsList = MappingContractDetails.getAllObjectFields(String.valueOf(contractRuleList.Source_Object__c));        
        //System.debug('objectsList '+objectsList); 
        Map<String,String> fieldAndTypeMap = new Map<String,String>();        
        
        Map<String,Map<String,String>> objectReferenceRecords = new Map<String,Map<String,String>>();                             
        Map<String, SObject> mappingRuleMap = new Map<String, SObject>();
        
        List<SObject> mappingRuleList = new List<SObject>();                                   
        
        mappingRuleList = MappingContractDetails.getMappingRules(contractRuleList.Id, type);
        System.debug('mappingRuleList '+mappingRuleList); 
        Map<string,SObjectField> fList = schema.getGlobalDescribe().get(contractRuleList.Target_Object__c).getDescribe().fields.getMap();                        
        System.debug('fList '+fList); 
        for(sObject mappingRule : mappingRuleList)
        {
            if( String.valueOf(mappingRule.get('Name')) == 'Object Reference')
            {
                String devValue = String.valueOf(mappingRule.get('Dev_value__c'));
                
                Map<String, Object> map1 = (Map<String, Object>)JSON.deserializeUntyped(devValue);  
                String LookupField = String.valueOf(map1.get('LookupField'));
                
                String[] fieldNamesList = LookupField.split('\\.');                    
                Integer fieldNamesListSize = fieldNamesList.size();                    
                
                String finalObjectName = '';                    
                if(fieldNamesList[1] == 'Parent')
                {                        
                    if(fieldNamesList[0].contains('__r')){                            
                        finalObjectName =   (fieldNamesList[0]).replace('__r','__c');
                    }
                    else{                            
                        finalObjectName = fieldNamesList[0];
                    }
                }
                else if(fieldNamesList[1] == 'Owner')
                {
                    if(fieldNamesList[0].contains('__r'))
                        finalObjectName =   (fieldNamesList[0]).replace('__r','__c');
                    else
                        finalObjectName = 'User';
                }
                else
                {
                    if(fieldNamesList[1].contains('__r'))
                        finalObjectName =   (fieldNamesList[1]).replace('__r','__c');
                    else
                        finalObjectName = fieldNamesList[1];
                }                    
                objectList.add(finalObjectName);
            }
        }
        System.debug('objectList'+objectList);
        System.debug('Limit3 ::: ' + System.Limits.getCpuTime());
        queriedRecords = getallObjects(''); 
        System.debug('queriedRecords ::: ' + queriedRecords);
        System.debug('Limit4 ::: ' + System.Limits.getCpuTime());
        for(Map<String, Object> recordMap : sObjectMapList)
        {
            sObject recordDetail = Schema.getGlobalDescribe().get(contractRuleList.Target_Object__c).newSObject();
            List<String> missingMandatoryFields = new List<String>();
            for(sObject mappingRule : mappingRuleList)
            {        
                if(mappingRule != null)
                {
                    String targetField = String.valueOf(mappingRule.get('Target_Field__c'));
                    String targetFieldType = String.valueOf(fList.get(targetField).getDescribe().getType()); //fieldAndTypeMap.get(targetField);
                    String transformationValue = String.valueOf(mappingRule.get('Transformation_value__c'));
                    String transformationType = String.valueOf(mappingRule.get('Name'));                        
                    String value = '';
                    
                    switch on transformationType
                    {
                        when 'Direct'
                        {                                
                            value = String.valueOf(recordMap.get(transformationValue));
                        }
                        when 'Default'
                        {
                            value = transformationValue;
                        }
                        when 'Object Reference'
                        {                                
                            value = getObjectReferenceValue(String.valueOf(mappingRule.get('Dev_value__c')),recordMap);
                        }
                        when 'If-Else'
                        {
                            value = getIfElseValue(recordMap,mappingRule);
                        }
                        when 'Text Split'
                        {
                            String devValue = String.valueOf(mappingRule.get('Dev_value__c'));
                            Object devValueObj = (Object)JSON.deserializeUntyped(devValue);
                            String fieldName = (String)((Map<String, Object>)devValueObj).get('FieldName');
                            String fieldValue = String.valueOf(recordMap.get(fieldName));    
                            value = MappingRuleTransformations.transformText(fieldValue,String.valueOf(mappingRule.get('Transformation_value__c')));
                            //value = MappingRuleTransformations.transformText(value,String.valueOf(mappingRule.get('Transformation_value__c')));
                        }
                        when 'Text Area Split'
                        {
                            String devValue = String.valueOf(mappingRule.get('Dev_value__c'));
                            Object devValueObj = (Object)JSON.deserializeUntyped(devValue);
                            String fieldName = (String)((Map<String, Object>)devValueObj).get('FieldName');
                            String fieldValue = String.valueOf(recordMap.get(fieldName));    
                            value = MappingRuleTransformations.transformTextArea(fieldValue, String.valueOf(mappingRule.get('Transformation_value__c')));
							//value = MappingRuleTransformations.transformText(value,String.valueOf(mappingRule.get('Transformation_value__c')));
                        }
                    }
                    
                    System.debug('targetField ::: ' + targetField + ', value ::: ' + value); 
                    if(value != null && value != '')
                    {                            
                        switch on targetFieldType
                        {
                            when 'REFERENCE'
                            {                                    
                                recordDetail.put(targetField, value);
                            }
                            when 'CURRENCY'
                            {                                                                        
                                Decimal currencyValue = Decimal.valueOf(!String.isEmpty(value) ? value : '0');
                                currencyValue = currencyValue.setScale(4, RoundingMode.HALF_EVEN);
                                recordDetail.put(targetField, currencyValue );
                            }                            
                            when 'NUMBER','PERCENT','DOUBLE'
                            {                                    
                                recordDetail.put(targetField, Decimal.valueOf(value));
                            }                                
                            when 'BOOLEAN'
                            {                                    
                                recordDetail.put(targetField, Boolean.valueOf(value));
                            }                                
                            when 'DATE'
                            {                      
                                
                                recordDetail.put(targetField, Date.valueOf(value) );
                            }
                            when 'STRING','TEXT','TEXTAREA','EMAIL','URL','PICKLIST','ID','COMBOBOX'
                            {                                    
                                recordDetail.put(targetField, value );
                            }
                        }
                    }
                    else
                    {
                        switch on targetFieldType
                        {
                            when 'REFERENCE'
                            {
                                recordDetail.put(targetField, value);                                   
                            }
                            when 'CURRENCY'
                            {                                                 
                                recordDetail.put(targetField, 0 );                                   
                            }                            
                            when 'NUMBER','PERCENT','DOUBLE'
                            {           
                                recordDetail.put(targetField, 0);
                                System.debug('After NUMBER');
                            }
                            when 'BOOLEAN'
                            {                                            
                                recordDetail.put(targetField, false);
                                
                            }                                
                            when 'DATE'
                            {
                                recordDetail.put(targetField, Date.valueOf(value) );                                    
                            }
                            when 'STRING','TEXT','TEXTAREA','EMAIL','URL','PICKLIST','ID','COMBOBOX'
                            {                                            
                                recordDetail.put(targetField, value );                               
                            }
                        }
                        //recordDetail.put(targetField, value );                            
                        if(Boolean.valueOf(mappingRule.get('Mandatory__c')))
                        {
                            missingMandatoryFields.add(targetField);                                
                        }
                    }
                    
                }                                        
            }
            if(missingMandatoryFields.size() > 0)
            {
                
                String ErrorString = '';
                ErrorString = 'Mandatory field values are missing : ';
                String missingMandatoryFieldsStr = '';
                for(Integer k = 0 ; k < missingMandatoryFields.size() ; k++)
                {
                    missingMandatoryFieldsStr = missingMandatoryFieldsStr + missingMandatoryFields[k];
                    if((k+1) != missingMandatoryFields.size())
                        missingMandatoryFieldsStr = missingMandatoryFieldsStr + ' , ';
                }
                ErrorString = ErrorString + missingMandatoryFieldsStr;
                recordsWithMandatoryFields .add(ErrorString);                                    
            }				
            sObjectList.add(recordDetail);                
        }
        
        
        System.debug('Limit5 ::: ' + System.Limits.getCpuTime());
        //find and add id to existing records if its patch / put
        if(sObjectList.size()>0){
            for(Integer k=0;k<sObjectList.size();k++){
                
            }
        }
        return sObjectList;
    }
    
    public static List<String> referenceList=new List<String>();
    public static List<String> parentReferenceList=new List<String>();
    public static List<String> grandParentReferenceList=new List<String>();
    public static List<String> unwantedObjects=new List<String>{'User'};
        
        @AuraEnabled
        public static  Map<String,List<SObject>> getallObjects(String objectType){        
            Map<String,List<SObject>> obj=new Map<String,List<SObject>>();                
            System.debug('Limit6 ::: ' + System.Limits.getCpuTime());
            
            for(String objName:objectList)
            {
                if(objName.contains('__r'))
                {
                    if(objectsList.contains(objName.replace('__r', '__c')))
                        objName = objName.replace('__r', '__c');
                    else if(objectsList.contains(objName.replace('__r', '')))
                        objName = objName.replace('__r', '');
                }
                else if(objName.contains('__c'))
                {
                    if(!objectsList.contains(objName))
                        objName = objName.replace('__c', '');
                }
                String query = 'SELECT ';
                query=generateQuery(objName,query,false,'',objectType,false);            
                if(referenceList.size()>0)
                {
                    for(Integer i=0;i<referenceList.size();i++){				
                        List<String> refList=referenceList[i].split(':##:');                    
                        query=generateQuery(refList[1],query,true,refList[0],objectType,false);
                    }      
                    /*
if(parentReferenceList.size()>0){
for(Integer j=0;j<parentReferenceList.size();j++){                        
List<String> refListparent=parentReferenceList[j].split(':##:');                        
query=generateQuery(refListparent[1],query,true,refListparent[0],objectType,true);
}                    
}
parentReferenceList=new List<String>();*/
                    /*if(grandParentReferenceList.size()>0){
for(Integer k=0;k<grandParentReferenceList.size();k++){                        
List<String> refListGrandParent=grandParentReferenceList[k].split(':##:');
Map<String, Schema.SObjectField> fieldMapGrandParent = Schema.getGlobalDescribe().get(refListGrandParent[1]).getDescribe().fields.getMap();
List<String> strFieldListGrandParent = new List<String>(fieldMapGrandParent.keySet());
if(strFieldListGrandParent.size()>0){                            
query=query+refListGrandParent[0]+'.'+String.join(strFieldListGrandParent, ','+refListGrandParent[0]+'.')+',';
}
}                    
}
grandParentReferenceList=new List<String>();*/
                }
                referenceList=new List<String>();
                query = query.subString(0,query.length() - 1);
                query = query + ' FROM ' + objName;            
                Boolean queryFlag = true;            
                System.debug('query ::: ' + query);
                List<SObject> resultantObject=new List<SObject>();         
                if(queryFlag){
                    System.debug('Limit123 ::: ' + System.Limits.getCpuTime());
                    
                    /*if(SAPautoNumberList.size()>0 && objName == 'Account')
resultantObject = Database.query(query + ' WHERE SAP_Auto_Number__c IN : SAPautoNumberList');              
else*/
                    resultantObject = Database.query(query);              
                    System.debug('Limit123456 ::: ' + System.Limits.getCpuTime());
                }
                //obj.add(resultantObject);
                obj.put(objName,resultantObject);
                System.debug('resultantObject ::: ' + resultantObject);
            }
            return obj;
        }
    
    public static String generateQuery(String objName,String query,Boolean relationFound,String existingRelationshipName,String objectType,Boolean grandParentFlag){        
        System.debug('Limit7 ::: ' + System.Limits.getCpuTime());
        if(objName.contains('__r'))
        {
            if(objectsList.contains(objName.replace('__r', '__c')))
                objName = objName.replace('__r', '__c');
            else if(objectsList.contains(objName.replace('__r', '')))
                objName = objName.replace('__r', '');
        }
        else if(objName.contains('__c'))
        {
            if(!objectsList.contains(objName))
                objName = objName.replace('__c', '');
        }
        
        List<Schema.SObjectField> fieldList = Schema.getGlobalDescribe().get(objName).getDescribe().fields.getMap().Values();
        Integer fieldListLength=fieldList.size();
        for(Integer i=0;i<fieldListLength;i++){
            if(objName!=objectType||(objName==objectType&&fieldList[i].getDescribe().getType() != Schema.DisplayType.TextArea))
            {
                if(relationFound){                    
                    //if(!query.contains(existingRelationshipName+'.'+fieldList[i]))
                    query = query + existingRelationshipName+'.'+fieldList[i] + ',';
                }
                else{                    
                    //if(!query.contains(String.valueOf(fieldList[i])))
                    query = query + fieldList[i] + ',';
                }
                //Add this if type is Reference then get object name else field API
                if(fieldList[i].getDescribe().getType() == Schema.DisplayType.Reference){
                    Schema.DescribeFieldResult dfr = fieldList[i].getDescribe();
                    List<Schema.sObjectType> referenceToObjects=dfr.getReferenceTo();
                    String relationshipName=dfr.getRelationshipName();
                    if(relationshipName!=null && referenceToObjects.size()==1 )//&& !unwantedObjects.contains(String.valueOf(referenceToObjects[0])))
                    {
                        if(!grandParentFlag)
                        {
                            if(!relationFound)
                            {
                                referenceList.add(relationshipName+':##:'+referenceToObjects[0]);
                            }
                            else
                            {
                                if(!unwantedObjects.contains(String.valueOf(referenceToObjects[0])))
                                    parentReferenceList.add(existingRelationshipName+'.'+relationshipName+':##:'+referenceToObjects[0]);
                            }
                        }
                        else{
                            if(String.valueOf(referenceToObjects[0])==objName)
                            {
                                if(!unwantedObjects.contains(String.valueOf(referenceToObjects[0])))
                                    grandParentReferenceList.add(existingRelationshipName+'.'+relationshipName+':##:'+referenceToObjects[0]);
                            }
                        }
                    }
                }
            }
        }
        return query;
    }
    
    public static List<String> currentObjectNames =new List<String>();
    public static Map<String,SObject> curentRecordsMap = new Map<String,SObject>();
    
    // Method to generate query using object reference JSON data
    public static String getObjectReferenceValue(String devValue,Map<String, Object> dataRecord)
    {
        System.debug('Limit8 ::: ' + System.Limits.getCpuTime());
        String finalResult = '',LookupField='',FilterType='', ReturnField = '', MappingObjectField = '';          
        if(devValue != null && devValue != '')
        {                        
            // Deserialize object reference JSON data
            Map<String, Object> map1 = (Map<String, Object>)JSON.deserializeUntyped(devValue);  
            LookupField = String.valueOf(map1.get('LookupField'));
            FilterType = String.valueOf(map1.get('FilterType')); 
            ReturnField = String.valueOf(map1.get('ReturnField')); 
            MappingObjectField =  String.valueOf(map1.get('MappingObjectField')); 
            
            String[] fieldNamesList = LookupField.split('\\.');
            Integer fieldNamesListSize = fieldNamesList.size();
            String uniqueFieldName = fieldNamesList[fieldNamesListSize-1];            
            
            Boolean orCondition = false, andCondition = false, customCondition = false;            
            
            String customformula =  String.valueOf(map1.get('CustomValue')); 
            if(FilterType == 'AND')
                andCondition = true;
            else if(FilterType == 'OR')
                orCondition = true;
            else if(FilterType == 'CUSTOM')
                customCondition = true;                        
            
            String filterConditions =JSON.serialize(map1.get('FilterConditions'));            
            System.debug('queriedRecords ::: ' + queriedRecords);
            System.debug('fieldNamesList[1] ::: ' + fieldNamesList[1]);
            String objName = fieldNamesList[1];
            if(objName.contains('__r'))
            {
                if(objectsList.contains(objName.replace('__r', '__c')))
                    objName = objName.replace('__r', '__c');
                else if(objectsList.contains(objName.replace('__r', '')))
                    objName = objName.replace('__r', '');
            }
            else if(objName.contains('__c'))
            {
                if(!objectsList.contains(objName))
                objName = objName.replace('__c', '');
            }
            
            if(objName == 'Owner')
                objName = 'User'; 
            else if(objName == 'Parent')
                objName = fieldNamesList[0];
            if((queriedRecords.get(objName)).size() > 0 )
            {
                if(!currentObjectNames.contains(objName))
                {
                    System.debug('Limit10 ::: ' + System.Limits.getCpuTime());
                    for(sObject record : queriedRecords.get(objName))
                    {                
                        //System.debug('record ::: ' + record);                        
                        curentRecordsMap.put(String.valueOf(record.get(uniqueFieldName)), record);                        
                        
                    }          
                    System.debug('Limit11 ::: ' + System.Limits.getCpuTime());
                    currentObjectNames.add(objName);
                }
                
                SObject currentRecord = curentRecordsMap.get(String.valueOf(dataRecord.get(MappingObjectField)));
                System.debug('curentRecordsMap'+curentRecordsMap);
                System.debug('dataRecord'+dataRecord);
                System.debug('MappingObjectField'+MappingObjectField);
                System.debug('check '+String.valueOf(dataRecord.get(MappingObjectField)));
                //String currentRecordStr = JSON.serialize(currentRecord);                        
                System.debug('currentRecord ::: ' + currentRecord);
                
                if(filterConditions != null && filterConditions != '' && filterConditions != '[]' )
                {
                    // Deserialize Filter Conditions value and create a list of objects
                    List<Object> filterConditionsList = (List<Object>)JSON.deserializeUntyped(filterConditions);                 
                    List<Map<String, Object>> filterConditionsMapList = new List<Map<String, Object>>();
                    
                    // Loop filterConditions List, deserialize the each condition and add in another list
                    for(Object conditions : filterConditionsList){
                        Map<String, Object> filterCondition =new Map<String, Object>();filterCondition = (Map<String, Object>)JSON.deserializeUntyped(JSON.serialize(conditions));filterConditionsMapList.add(filterCondition);            }
                    
                    // Loop filterConditionsMap List. construct Conditions string. Add them in a list
                    List<String> conditionsList = new List<String>();
                    List<Boolean> conditionResults = new List<Boolean>();
                    
                    
                    for(Map<String, Object> filterCondition : filterConditionsMapList)
                    {String condition = '';String conditionFieldName = String.valueOf(filterCondition.get('Field'));
                        String conditionFieldValue = String.valueOf(filterCondition.get('Value'));String lhsFieldValue = getFieldValue(conditionFieldName , currentRecord);
                     String operator = String.valueOf(filterCondition.get('Operator'));String rhsFieldValue = '';
                        if(String.valueOf(filterCondition.get('Type')) == 'direct')
                            rhsFieldValue = String.valueOf(filterCondition.get('Value'));
                        else                        
                            rhsFieldValue = getFieldValue(conditionFieldValue , currentRecord);
                        
                        Boolean isConditionTrue = checkIfCondition(lhsFieldValue,operator.toUppercase(),rhsFieldValue);conditionResults.add(isConditionTrue);
                        if(isConditionTrue && orCondition)
                        {
                            conditionResults.clear();conditionResults.add(isConditionTrue);                    
                            break;
                        }
                        if(!isConditionTrue && andCondition)
                        {
                            conditionResults.clear();conditionResults.add(isConditionTrue);
                            break;
                        }
                    }                    
                    Boolean resultFound = validateConditions(conditionResults,orCondition,andCondition,customCondition,customformula);                    
                    
                    if(resultFound)
                    {                        
                        if(getFieldValue(LookupField , currentRecord) == String.valueOf(dataRecord.get(MappingObjectField)))
                            finalResult = String.valueOf(currentRecord.get(ReturnField));
                    }
                }
                else
                {
                    String currentFieldValue = '';
                    if(currentRecord != null)
                    {
                        currentFieldValue = getFieldValue(LookupField , currentRecord);                        
                        
                        if(currentFieldValue == String.valueOf(dataRecord.get(MappingObjectField)))
                        {
                            finalResult = String.valueOf(currentRecord.get(ReturnField));                                 
                        }   
                    }                    
                }
            }                    
            
            else
            {
                finalResult = '';
            }
        }
        
        return finalResult;
    }
    
    public static String getFieldValue(String fieldName, SObject objj)
    {
        System.debug('Limit12 ::: ' + System.Limits.getCpuTime());
        String fieldValue = '';String[] fieldNamesList = fieldName.split('\\.');Integer fieldNamesListSize = fieldNamesList.size();
        
        switch on fieldNamesListSize
        {
            when 2
            {         
                
                fieldValue = (String)objj.get(fieldNamesList[fieldNamesListSize-1]);
                
            }
            when 3
            {
                System.debug('objj'+objj);
                if(fieldNamesList[fieldNamesListSize-1] == 'Owner')
                    fieldValue = (String)objj.get('User');    
                else
                    fieldValue = (String)objj.get(fieldNamesList[fieldNamesListSize-1]);
                
            }
            when 4
            {
                
                fieldValue =  (String)objj.getSobject(fieldNamesList[fieldNamesListSize-2]).get(fieldNamesList[fieldNamesListSize-1]);
                
            }
            when 5
            {
                
                fieldValue =  (String)objj.getSobject(fieldNamesList[fieldNamesListSize-3]).getSobject(fieldNamesList[fieldNamesListSize-2]).get(fieldNamesList[fieldNamesListSize-1]);
                
            }
        }
        
        return fieldValue;
    }
    
    // Method to generate query using object reference JSON data
    /* public static String getObjectReferenceQuery(String devValue)
{
String query = '';          
if(devValue != null && devValue != '')
{

// Deserialize object reference JSON data
Map<String, Object> map1 = (Map<String, Object>)JSON.deserializeUntyped(devValue);  


// Create basic query using deserialized data
query = query + 'SELECT ' + map1.get('Fields') + ' FROM ' + map1.get('Object');


// Get Filter Conditions field value from JSON data
String filterConditions =JSON.serialize(map1.get('FilterConditions'));                   
if(filterConditions != null && filterConditions != '')
{
// Deserialize Filter Conditions value and create a list of objects
List<Object> filterConditionsList = (List<Object>)JSON.deserializeUntyped(filterConditions);                 
List<Map<String, Object>> filterConditionsMapList = new List<Map<String, Object>>();

// Loop filterConditions List, deserialize the each condition and add in another list
for(Object conditions : filterConditionsList)
{
Map<String, Object> filterCondition =new Map<String, Object>();
filterCondition = (Map<String, Object>)JSON.deserializeUntyped(JSON.serialize(conditions));
filterConditionsMapList.add(filterCondition);            
}

// Loop filterConditionsMap List. construct Conditions string. Add them in a list
List<String> conditionsList = new List<String>();
for(Map<String, Object> filterCondition : filterConditionsMapList)
{
String condition = '';            
condition = ' '+ String.valueOf(filterCondition.get('Field')) +' '+ String.valueOf(filterCondition.get('Operator')) +' \''+ String.valueOf(filterCondition.get('Value') +'\'');
conditionsList.add(condition);            
}                
}
}

// Dynamic query string constructed

return query;
}*/
    
    // Method to get If-Else Transformation type value
    public static String getIfElseValue(Map<String, Object> accountMap,sObject mappingRule)
    {                
        
        String devValue = String.valueOf(mappingRule.get('Dev_value__c'));
        
        Object devValueData = (Object)JSON.deserializeUntyped(devValue);
        
        String ElseValue = (String)((Map<String, Object>)devValueData).get('ElseValue');                        
        Map<String, Object> Conditions =(Map<String, Object>)((Map<String, Object>)devValueData);                                     
        String ifConditionString = JSON.serialize(Conditions.get('FilterConditions'));        
        
        List<Object> ifConditionsList = (List<Object>)JSON.deserializeUntyped(ifConditionString);              
        
        String finalResult = '';
        Boolean resultFound = false;
        
        
        for(Object ifConditonBlock : ifConditionsList)
        {
            List<Object> filterCondition = (List<Object>)ifConditonBlock;            
            List<Boolean> conditionResults = new List<Boolean>();
            
            String thenValue = '', customformula = '';                        
            Boolean orCondition = false, andCondition = false, customCondition = false;            
            
            for(Integer i=0; i< filterCondition.size() ; i++)
            {
                
                Map<String, Object> condition = (Map<String, Object>)filterCondition[i];
                
                if(i == 0)
                {
                    orCondition = Boolean.valueOf(condition.get('orCondition'));
                    andCondition = Boolean.valueOf(condition.get('andCondition'));
                    customCondition = Boolean.valueOf(condition.get('customCondition'));
                    customformula = String.valueOf(condition.get('customformula'));
                    
                    // Getting then value
                    thenValue = getThenValue(condition,accountMap);                    
                }
                
                // Geting LHS field value
                String lhsFieldValue = '';
                String fieldName = String.valueOf(condition.get('field'));
                lhsFieldValue = String.valueOf(accountMap.get(fieldName));
                
                // Getting RHS Field value
                String rhsFieldValue = '';
                rhsFieldValue = getRHSValue(condition,accountMap);
                
                // Getting operator value
                String operator = '';
                operator = String.valueOf(condition.get('operator'));                
                
                Boolean isConditionTrue = checkIfCondition(lhsFieldValue,operator,rhsFieldValue);               
                
                conditionResults.add(isConditionTrue);
                if(isConditionTrue && orCondition)
                {
                    conditionResults.clear();
                    conditionResults.add(isConditionTrue);                    
                    break;
                }
                if(!isConditionTrue && andCondition)
                {
                    conditionResults.clear();
                    conditionResults.add(isConditionTrue);
                    break;
                }
            }
            
            
            resultFound = validateConditions(conditionResults,orCondition,andCondition,customCondition,customformula);
            if(resultFound)
            {
                finalResult = thenValue;
                break;                
            }
        }        
        
        if(!resultFound)
        {
            List<String> elseValueList = new List<String>();elseValueList = ElseValue.split('#');
            
            if(elseValueList.size()>0)
            {
                String elseValueType = elseValueList[1];                
                switch on elseValueType
                {
                    when 'Direct'
                    {
                        finalResult = elseValueList[0];
                    }
                    when 'Field Reference'
                    {
                        finalResult = String.valueOf(accountMap.get(elseValueList[0]));
                    }
                }
            }
        }
        
        
        return finalResult;
    }
    
    
    
    
    
    public static Boolean validateConditions(List<Boolean> conditionResults,Boolean orCondition, Boolean andCondition, Boolean customCondition, String customformula)
    {
        Boolean isResultFound = false;
        if(orCondition || andCondition)
        {
            isResultFound = conditionResults[0];
        }
        else
        {
            String tempCustomFormula = customformula.toUpperCase();
            for(Integer i = 0; i < conditionResults.size();i++)
            {                
                customformula = customformula.replace(String.valueOf(i+1), String.valueOf(conditionResults[i]));
            }
            
            customformula = customformula.replaceAll('OR', '||');
            customformula = customformula.replaceAll('AND', '&&');            
            customformula = customformula.replaceAll('!', 'NOT');
            
            Decimal result = null; 
            GetEval expression = new GetEval(customformula);
            result = expression.eval();
            
            if(result == 1)
                isResultFound = true;
            else
                isResultFound = false;
        }
        
        return isResultFound;
    }
    
    
    public static List<SObject> ProcessCoditions(List<sObject> records, String rule)
    {
        List<SObject> filteredRecords = new List<SObject>();
        System.debug('rule'+rule);
        if(rule!=null){
            //convert the condition
            Object ruleData = (Object)JSON.deserializeUntyped(rule);
            System.debug('ruleData'+ruleData);
            boolean andCondition = (boolean)((Map<String, Object>)ruleData).get('andCondition'); boolean orCondition = (boolean)((Map<String, Object>)ruleData).get('orCondition'); boolean customCondition = (boolean)((Map<String, Object>)ruleData).get('customCondition');
            String customFormula = '';
            if(customCondition == true){
                customFormula = (String)((Map<String, Object>)ruleData).get('customFormula');
            }
            String conditionString = JSON.serialize(((Map<String, Object>)ruleData).get('conditions'));        
            System.debug('conditionString'+conditionString);
            List<Object> conditionsList = (List<Object>)JSON.deserializeUntyped(conditionString); 
            System.debug('conditionsList'+conditionsList);
            List<Map<String,String>> filterConditions = new List<Map<String,String>>();
            for(Object con :  conditionsList){
                Map<String,String> filter =  new Map<String,String>();filter.put('field', (String)((Map<String, Object>)con).get('field'));filter.put('operator', (String)((Map<String, Object>)con).get('operator'));
                filter.put('value', (String)((Map<String, Object>)con).get('value'));filterConditions.add(filter);
            }
            System.debug('filterConditions'+filterConditions);          
            Integer filterConditionsSize = filterConditions.size();
            if(filterConditionsSize == 1){
                andCondition = true;
            }
            //iterate through the records
            for(sObject record : records){
                //convert the record as a map
                boolean isRecordPassed = false;List<boolean> customData = new List<boolean>();
                Map<String, Object> recordMap = (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(record));
                System.debug('recordMap'+recordMap);
                for(Integer i=0;i<filterConditionsSize;i++){
                    boolean result = checkIfCondition((String)String.valueOf(recordMap.get(filterConditions[i].get('field'))),filterConditions[i].get('operator'),filterConditions[i].get('value'));
                    System.debug('result'+result);
                    System.debug('orCondition'+orCondition);
                    System.debug('andCondition'+andCondition);
                    System.debug('customCondition'+customCondition);
                    if(orCondition && result){
                        isRecordPassed =  true;
                        break;
                    }
                    else if(andCondition){
                        if(!result){
                            isRecordPassed =  false;
                            break;
                        }else{
                            isRecordPassed =  true;
                        }
                    }
                    else if(customCondition){
                        customData.add(result);
                    }
                }
                if(customCondition){
                    isRecordPassed = validateConditions(customData,andCondition,orCondition,customCondition,customFormula);
                }
                if(isRecordPassed){
                    System.debug('record passed');
                    filteredRecords.add(record);
                }
            }
        }
        else{
            filteredRecords=records;
        }
        return filteredRecords;
    }
    
    public static Boolean checkIfCondition(String lhsFieldValue, String operator, String rhsFieldValue)
    {
        Boolean isConditionTrue = false;
        
        switch on operator
        {
            when 'GREATER THAN'
            {
                if(lhsFieldValue > rhsFieldValue)                
                    isConditionTrue = true;                
            }
            when 'GREATER THAN EQUAL'
            {
                if(lhsFieldValue >= rhsFieldValue)                
                    isConditionTrue = true;                
            }
            when 'LESSER THAN'
            {
                if(lhsFieldValue < rhsFieldValue)                
                    isConditionTrue = true;                
            }
            when 'LESSER THAN EQUAL'
            {
                if(lhsFieldValue <= rhsFieldValue)                
                    isConditionTrue = true;                
            }
            when 'EQUALS'
            {
                if(lhsFieldValue == rhsFieldValue)                
                    isConditionTrue = true;                
            }
            when 'NOT EQUALS'
            {
                if(lhsFieldValue != rhsFieldValue)                
                    isConditionTrue = true;  
            }
            when 'CONTAINS'
            {                
                isConditionTrue = rhsFieldValue.contains(lhsFieldValue);  
            }
            when 'STARTS WITH'
            {                
                isConditionTrue = rhsFieldValue.startsWith(lhsFieldValue);
            }
            when 'ENDS WITH'
            {                
                isConditionTrue = rhsFieldValue.endsWith(lhsFieldValue);
            }
            when 'IS NULL'
            {                
                if((lhsFieldValue != null && lhsFieldValue != '') && Boolean.valueOf(rhsFieldValue)==false)
                {
                    isConditionTrue = true;
                }
                if((lhsFieldValue == null || lhsFieldValue == '') && Boolean.valueOf(rhsFieldValue)==true)
                {
                    isConditionTrue = true;
                }
            }
        }        
        
        return isConditionTrue;
    }
    
    public static String getRHSValue(Map<String, Object> condition,Map<String, Object> accountMap)
    {
        String fieldValue = '';
        String type = String.valueOf(condition.get('type'));
        String operator = String.valueOf(condition.get('operator'));        
        String fieldName = '';
        switch on type
        {
            when 'Direct','Boolean'
            {                
                fieldValue = String.valueOf(condition.get('value'));
            }
            when 'Field Reference'
            {
                fieldName = String.valueOf(condition.get('value')); fieldValue = String.valueOf(accountMap.get(fieldName));
            }
            when 'Variable'
            {
                
            }            
        }       
        return fieldValue;
    }
    public static String getThenValue(Map<String, Object> condition,Map<String, Object> accountMap)
    {
        String fieldValue = '';
        
        Boolean thenDirect = Boolean.valueOf(condition.get('thenDirect'));
        Boolean thenReferece = Boolean.valueOf(condition.get('thenReferece'));
        Boolean thenvariables = Boolean.valueOf(condition.get('thenvariables'));
        
        String fieldName = '';
        
        if(thenDirect == true)
        {
            fieldValue = String.valueOf(condition.get('thenvalue'));
        }
        if(thenReferece == true)
        {
            fieldName = String.valueOf(condition.get('thenvalue')); fieldValue = String.valueOf(accountMap.get(fieldName));
        }
        if(thenvariables == true)
        {
            
        }
        
        return fieldValue;
    }
    
}