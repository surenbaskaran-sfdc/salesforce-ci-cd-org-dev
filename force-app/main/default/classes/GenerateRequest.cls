/*********************************************************************************************************************************************************************************************************
Company 					: HTC Global Services
Developer 					: Arunkumar V K
Description					: Generate request JSON data object using results from database
Related Aura Components   	: 
Related Apex Controllers  	: 
Created Date		  		: May 05, 2021
Last Modified Date	  		: May 07, 2021
**********************************************************************************************************************************************************************************************************/




public class GenerateRequest {
    
    Public static blob body;
    Public Static JSONGenerator requestJson ;
    public static Datetime NOW  = system.now();    
    public static Boolean isJsonValid = true, isErrorFound = true;    
    public static String keyField = '', valueField = '', EndPointURL = '',requestData = '', dmlOperationType = '';                        
    public static List<String> mandatoryFields = new List<String>();
    public static List<String> mandatoryFieldsUniqueList = new List<String>();
    public static List<SObject> allQueriedRecords = new List<SObject>();  
    public static List<Map<String, String>> dataMapList = new List<Map<String, String>>();      
    public static Map<String ,SObject> allQueriedRecordsMap = new Map<String ,SObject>();    
    public static Map<String ,Mapping_Rule__c> mrMap = new Map<String ,Mapping_Rule__c>();
     
    // Generate request JSON data 
    public static String createRequest(List<SObject> dataList, String dmlOperationType, String parentObject,String contractRuleId,String externalId)
    {   
        if(!dataList.isEmpty())
        { 
            List<Mapping_Rule__c> mappingRuleList = new List<Mapping_Rule__c>();
            Map<String,Map<String,String>> objectReferenceRecords = new Map<String,Map<String,String>>();
            Map<String, Mapping_Rule__c> mappingRuleMap = new Map<String, Mapping_Rule__c>();            
                
                // Querying Mapping rules and its related details
                mappingRuleList = MappingContractDetails.getMappingRules(contractRuleId,dmlOperationType);
                System.debug('mappingRuleList'+mappingRuleList);
            	if(mappingRuleList.size()>0)
                {                
                    EndPointURL = String.valueOf(mappingRuleList[0].Contract_Rule__r.Mapping_Contract__r.End_point_URL__c);                
                    String recordIds='';
                    for(Integer i=0;i<dataList.size();i++){
                        String currentId='\''+dataList[i].Id+'\'';
                        recordIds=recordIds+currentId+',';
                    }
                    recordIds = recordIds.subString(0,recordIds.length() - 1);
                    List<List<SObject>> queriedRecords = getallObjects(parentObject , recordIds);
                    allQueriedRecords = queriedRecords[0];
                    System.debug('123allQueriedRecords '+allQueriedRecords.size());
                    for(SObject objj : allQueriedRecords)
                    {
                        allQueriedRecordsMap.put(String.valueOf(objj.get('Id')), objj);
                    }
                    
                    // Create List of Map with Account fields and values                
                    for(SObject data :dataList)
                    {
                        Map<String, String> dataMap = new Map<String, String>();
                        List<String> missingMandatoryFields = new List<String>();
                        for(Mapping_Rule__c mr : mappingRuleList)
                        {        
                            sObject mappingRule = mr;                        
                            if(mappingRule != null)
                            {
                                String transformationField = '';
                                String transformationValue = String.valueOf(mappingRule.get('Transformation_Value__c'));                            
                                String transformationType = String.valueOf(mappingRule.get('Name'));                            
                                String targetField = String.valueOf(mappingRule.get('Target_Field__c'));                                                                         
                                String finalValue = '';
                                
                                // Transform values based on mapping rule transformation types
                                switch on transformationType{
                                    when 'Default'
                                    {
                                        finalValue = transformationValue;
                                    }
                                    when 'Direct'
                                    {
                                        finalValue = String.valueOf(data.get(transformationValue));
                                    }
                                    when 'Object Reference'
                                    {                                    
                                        finalValue = getObjectReferenceValue(String.valueOf(mappingRule.get('Dev_value__c')),data);                                                                
                                    }
                                    
                                    when 'If-Else'
                                    {                                    
                                        finalValue = MappingRuleTransformations.getIfElseValue(data,mappingRule);                                    
                                    }
                                    
                                    when 'Text Split'
                                    {                                    
                                        String devValue = String.valueOf(mappingRule.get('Dev_value__c'));
                                        Object devValueObj = (Object)JSON.deserializeUntyped(devValue);
                                        String fieldName = (String)((Map<String, Object>)devValueObj).get('FieldName');
                                        String fieldValue = String.valueOf(data.get(fieldName));                                    
                                        finalValue = MappingRuleTransformations.transformText(fieldValue, String.valueOf(mappingRule.get('Transformation_value__c')));                                 
                                    }
                                    when 'Text Area Split'
                                    {                                    
                                        String devValue = String.valueOf(mappingRule.get('Dev_value__c'));
                                        Object devValueObj = (Object)JSON.deserializeUntyped(devValue);
                                        String fieldName = (String)((Map<String, Object>)devValueObj).get('FieldName');
                                        String fieldValue = String.valueOf(data.get(fieldName));                                        
                                        finalValue = MappingRuleTransformations.transformTextArea(fieldValue, String.valueOf(mappingRule.get('Transformation_value__c')));                                    
                                    }
                                }                           
                                if(Boolean.valueOf(mappingRule.get('Mandatory__c')) == true && (finalValue == '' || finalValue == null))
                                {
                                    isJsonValid = false;
                                    missingMandatoryFields.add(targetField);   
                                }
                                dataMap.put(targetField,finalValue);
                                
                            }
                        }     
                          System.debug('dataMap '+dataMap);
                        if(missingMandatoryFields.size() > 0) 
                        {
                            String salesforceId=String.valueOf(data.get('Id'));
                            String externalValue = String.valueOf(dataMap.get(externalId)); 
                            String ErrorString = 'Mandatory field values are missing - ';
                            String missingMandatoryFieldsStr = '';
                            for(Integer k = 0 ; k < missingMandatoryFields.size() ; k++)
                            {
                                missingMandatoryFieldsStr = missingMandatoryFieldsStr + missingMandatoryFields[k];
                                if((k+1) != missingMandatoryFields.size())
                                    missingMandatoryFieldsStr = missingMandatoryFieldsStr + ' , ';
                            }
                            ErrorString = ErrorString + missingMandatoryFieldsStr;
                            mandatoryFields.add(ErrorString);  
                            System.debug('salesforceId '+salesforceId);
                            mandatoryFieldsUniqueList.add(salesforceId);
                        }	
                        System.debug('mandatoryFieldsUniqueList '+mandatoryFieldsUniqueList);
                        dataMapList.add(dataMap);                
                    }
                    // Calling 'getRequestString' method to create request JSON data string for Account records
                    requestData = getRequestString(dataMapList,parentObject);                 
                }
                else
                {         
                    System.debug('in else error');
                    // If mapping rules not created
                    isErrorFound = false;      
                    isJsonValid = false;
                    requestData = GenerateResponse.errorResponse(parentObject, 'SalesforceId','',  'No Mapping Rules available for this combination. Please Contact Adminstrator',
                                                                 'Mapping Rules Not Found' );
                }
        }        
        system.debug('requestData ::: ' + requestJson);
        return requestData;
    } 
    
    public static List<String> referenceList=new List<String>();
    public static List<String> parentReferenceList=new List<String>();
    public static List<String> grandParentReferenceList=new List<String>();
    public static List<String> unwantedObjects=new List<String>{'User','Pricing_Template__c'};
        
        // Creating query with given object names and its related object fields
        @AuraEnabled
        public static  List<List<SObject>> getallObjects(String objectType , String recId){
            System.debug('In getallObjects');
            List<List<SObject>> obj=new List<List<SObject>>();
            List<String> objectList = new  list<String>();
            objectList.add(objectType);        
            for(String objName:objectList)
            {            
                String query = 'SELECT ';
                query=generateQuery(objName,query,false,'',objectType,false);            
                if(referenceList.size()>0){
                    for(Integer i=0;i<referenceList.size();i++){					
                        List<String> refList=referenceList[i].split(':##:');                    
                        query=generateQuery(refList[1],query,true,refList[0],objectType,false);
                    }                
                    if(parentReferenceList.size()>0){
                        for(Integer j=0;j<parentReferenceList.size();j++){                        
                            List<String> refListparent=parentReferenceList[j].split(':##:');                        
                            query=generateQuery(refListparent[1],query,true,refListparent[0],objectType,true);
                        }                    
                    }
                    parentReferenceList=new List<String>();
                    if(grandParentReferenceList.size()>0){
                        for(Integer k=0;k<grandParentReferenceList.size();k++){                        
                            List<String> refListGrandParent=grandParentReferenceList[k].split(':##:');
                            Map<String, Schema.SObjectField> fieldMapGrandParent = Schema.getGlobalDescribe().get(refListGrandParent[1]).getDescribe().fields.getMap();
                            List<String> strFieldListGrandParent = new List<String>(fieldMapGrandParent.keySet());
                            if(strFieldListGrandParent.size()>0){                            
                                query=query+refListGrandParent[0]+'.'+String.join(strFieldListGrandParent, ','+refListGrandParent[0]+'.')+',';
                            }
                        }                    
                    }
                    grandParentReferenceList=new List<String>();
                }
                referenceList=new List<String>();
                query = query.subString(0,query.length() - 1);
                query = query + ' FROM '+objName + ' where Id IN (' + recId + ')';  
                String s=' FROM '+objName + ' where Id IN (' + recId + ')'; 
                system.debug('zzz ' + s);
                system.debug('Account query ::: ' + query);
                Boolean queryFlag = true;
                
                List<SObject> resultantObject=new List<SObject>();            
                if(queryFlag)
                    resultantObject = Database.query(query);  
                obj.add(resultantObject);
            }
            return obj;
        }
    
    // Creating query with given object names and its related object fields
    public static String generateQuery(String objName,String query,Boolean relationFound,String existingRelationshipName,String objectType,Boolean grandParentFlag){
        List<Schema.SObjectField> fieldList = Schema.getGlobalDescribe().get(objName).getDescribe().fields.getMap().Values();
        Integer fieldListLength=fieldList.size();
        for(Integer i=0;i<fieldListLength;i++){
            if(objName!=objectType||(objName==objectType&&fieldList[i].getDescribe().getType() != Schema.DisplayType.TextArea)){
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
    
    // Transform object reference transformation type value
    public static String getObjectReferenceValue(String devValue,SObject dataRecord)
    {
        System.debug('123devValue'+devValue);
        System.debug('123dataRecord '+dataRecord);
        String finalResult = '',LookupField='',FilterType='';          
        if(devValue != null && devValue != '')
        {                        
            // Deserialize object reference JSON data
            Map<String, Object> map1 = (Map<String, Object>)JSON.deserializeUntyped(devValue);  
            LookupField = String.valueOf(map1.get('LookupField'));
            FilterType = String.valueOf(map1.get('FilterType'));             
            Boolean orCondition = false, andCondition = false, customCondition = false;            
            
            String customformula =  String.valueOf(map1.get('CustomValue')); 
            if(FilterType == 'AND')
                andCondition = true;
            else if(FilterType == 'OR')
                orCondition = true;
            else if(FilterType == 'CUSTOM')
                customCondition = true;
            
            SObject currentRecord = allQueriedRecordsMap.get(String.valueOf(dataRecord.get('Id')));
            System.debug('currentRecord--'+currentRecord);
            String currentRecordStr = JSON.serialize(currentRecord);                        
            String filterConditions =JSON.serialize(map1.get('FilterConditions'));                        
            
            if(filterConditions != null && filterConditions != '' && filterConditions != '[]' )
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
                List<Boolean> conditionResults = new List<Boolean>();
                
                
                for(Map<String, Object> filterCondition : filterConditionsMapList)
                {
                    String condition = '';            
                    String conditionFieldName = String.valueOf(filterCondition.get('Field'));
                    String conditionFieldValue = String.valueOf(filterCondition.get('Value'));                    
                    String lhsFieldValue = '';
                    try{
                        lhsFieldValue = getFieldValue(conditionFieldName , currentRecord);
                    }
                    Catch (Exception e)
                    {
                        lhsFieldValue = '';                        
                    }
                    String operator = String.valueOf(filterCondition.get('Operator'));
                    String rhsFieldValue = '';
                    if(String.valueOf(filterCondition.get('Type')) == 'direct')
                        rhsFieldValue = String.valueOf(filterCondition.get('Value'));
                    else                       
                    {
                        try{
                            rhsFieldValue = getFieldValue(conditionFieldValue , currentRecord);
                        }
                        Catch (Exception e)
                        {
                            rhsFieldValue = '';                            
                        }   
                    }
                    
                    Boolean isConditionTrue = MappingRuleTransformations.checkIfCondition(lhsFieldValue,operator.toUppercase(),rhsFieldValue);                    
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
                Boolean resultFound = MappingRuleTransformations.validateConditions(conditionResults,orCondition,andCondition,customCondition,customformula);                
                
                if(resultFound)
                {
                    try{
                        finalResult = getFieldValue(LookupField , currentRecord);                                
                    }
                    Catch (Exception e)
                    {
                        finalResult = '';                        
                    }
                }                  
            }
            else
            {
                try{
                    finalResult = getFieldValue(LookupField , currentRecord); 
                }
                Catch (Exception e)
                {
                    finalResult = '';                    
                }
            }
        }
        System.debug('finalResult ::: ' + finalResult);
        return finalResult;
    }
    
    // Get value from related SObject
    public static String getFieldValue(String fieldName, SObject objj)
    {
        System.debug('In getFieldValue');
        System.debug('In fieldName '+fieldName);
        System.debug('In objj '+objj);
        String fieldValue = '';        
        String[] fieldNamesList = fieldName.split('\\.');        
        Integer fieldNamesListSize = fieldNamesList.size();        
        switch on fieldNamesListSize
        {
            when 2
            {                         
                fieldValue = (String)objj.get(fieldNamesList[fieldNamesListSize-1]);                
            }
            when 3
            {                           
                fieldValue = (String)objj.getSobject(fieldNamesList[fieldNamesListSize-2]).get(fieldNamesList[fieldNamesListSize-1]);                
            }
            when 4
            {                
                fieldValue =  (String)objj.getSobject(fieldNamesList[fieldNamesListSize-3]).getSobject(fieldNamesList[fieldNamesListSize-2]).get(fieldNamesList[fieldNamesListSize-1]);                
            }
            when 5
            {                
                fieldValue =  (String)objj.getSobject(fieldNamesList[fieldNamesListSize-4]).getSobject(fieldNamesList[fieldNamesListSize-3]).getSobject(fieldNamesList[fieldNamesListSize-2]).get(fieldNamesList[fieldNamesListSize-1]);                
            }
        }        
        return fieldValue;
    }            
    
    // Generate JSON data
    public static String getRequestString(List<Map<String, String>> dataMapList, String objectName)
    {        
        System.debug('In getRequestString');        
        JSONGenerator gen = JSON.createGenerator(true);                        
        gen.writeStartObject();
        gen.writeStringField('Object' , objectName );  
        gen.writeStringField('req_datetime',String.valueOf(NOW));  
        gen.writeFieldName('data');            
        gen.writeStartObject();
        gen.writeFieldName(objectName);
        gen.writeStartArray();    
        for(Map<String, String> map1 : dataMapList)
        {            
            gen.writeStartObject();  
            for(String key : map1.keySet())
            {                 
                if(map1.get(key)!=null)
                {
                    String Value = '';                                        
                    Value = map1.get(key);                                     
                    gen.writeStringField(key, Value);                    
                }
                else
                {
                    
                    //gen.writeStringField(key, '');//modified
                    gen.writeNullField(key);
                }                    
            }  
            gen.writeEndObject();                
        }        
        gen.writeEndArray();
        gen.writeEndObject();
        gen.writeEndObject();
        
        String jsonData = gen.getAsString();     		
        return jsonData;
    }         
}