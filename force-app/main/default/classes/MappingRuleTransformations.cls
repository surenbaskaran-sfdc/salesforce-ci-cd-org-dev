/*********************************************************************************************************************************************************************************************************
Company 					: HTC Global Services
Developer 					: Arunkumar V K
Description					: transform mapping rule values
Related Aura Components   	: 
Related Apex Controllers  	: 
Created Date		  		: May 05, 2021
Last Modified Date	  		: May 07, 2021
**********************************************************************************************************************************************************************************************************/


public class MappingRuleTransformations {
    
    // Transform If-Else transformation type value
    public static String getIfElseValue(sObject accountMap,sObject mappingRule)
    {                
        System.debug('In getIfElseValue');
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
            List<String> elseValueList = new List<String>();
            elseValueList = ElseValue.split('#');
            
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
        System.debug('finalResult ::: ' + finalResult);        
        return finalResult;
    }
    
    // Transform If-Else transformation type value - Custom Condition validation
    public static Boolean validateConditions(List<Boolean> conditionResults,Boolean orCondition, Boolean andCondition, Boolean customCondition, String customformula)
    {
        Boolean isResultFound = false;
        if(orCondition || andCondition)
        {
            isResultFound = conditionResults[0];
        }
        else
        {
            String tempCustomFormula = customformula;
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
    
    // Transform If-Else transformation type value - Operation validation
    public static Boolean checkIfCondition(String lhsFieldValue, String operator, String rhsFieldValue)
    {
        Boolean isConditionTrue = false;        
        switch on operator
        {
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
    
    // Transform If-Else transformation type value - Get RHS condition value
    public static String getRHSValue(Map<String, Object> condition,sObject accountMap)
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
        }                     
        return fieldValue;
    }
    // Transform If-Else transformation type value - Get THEN condition value
    public static String getThenValue(Map<String, Object> condition,sObject accountMap)
    {
        String fieldValue = '';
        
        Boolean thenDirect = Boolean.valueOf(condition.get('thenDirect'));
        Boolean thenReference = Boolean.valueOf(condition.get('thenReferece'));
        Boolean thenvariables = Boolean.valueOf(condition.get('thenvariables'));
        
        String fieldName = '';
        
        if(thenDirect == true)
        {
            fieldValue = String.valueOf(condition.get('thenvalue'));
        }
        if(thenReference == true)
        {
            fieldName = String.valueOf(condition.get('thenvalue')); fieldValue = String.valueOf(accountMap.get(fieldName));
        }
             
        return fieldValue;
    }
    
    // Method to get If-Else Transformation type value
    public static String getIfElseValue(Map<String, Object> accountMap,sObject mappingRule)
    {                
        //System.debug('In getIfElseValue');
        String devValue = String.valueOf(mappingRule.get('Dev_value__c'));Object devValueData = (Object)JSON.deserializeUntyped(devValue);
        String ElseValue = (String)((Map<String, Object>)devValueData).get('ElseValue');Map<String, Object> Conditions =(Map<String, Object>)((Map<String, Object>)devValueData);                                     
		String ifConditionString = JSON.serialize(Conditions.get('FilterConditions'));List<Object> ifConditionsList = (List<Object>)JSON.deserializeUntyped(ifConditionString);              
       String finalResult = '';Boolean resultFound = false;
        
        
        for(Object ifConditonBlock : ifConditionsList){
            List<Object> filterCondition = (List<Object>)ifConditonBlock;List<Boolean> conditionResults = new List<Boolean>();
            
            String thenValue = '', customformula = '';Boolean orCondition = false, andCondition = false, customCondition = false;            
            
            for(Integer i=0; i< filterCondition.size() ; i++)
            {
                                
                Map<String, Object> condition = (Map<String, Object>)filterCondition[i];
                                
                if(i == 0){
                    orCondition = Boolean.valueOf(condition.get('orCondition'));andCondition = Boolean.valueOf(condition.get('andCondition'));customCondition = Boolean.valueOf(condition.get('customCondition'));customformula = String.valueOf(condition.get('customformula'));
                    
                    // Getting then value
                    thenValue = getThenValue(condition,accountMap);                    
                }
                
                // Geting LHS field value
                String lhsFieldValue = '';String fieldName = String.valueOf(condition.get('field'));lhsFieldValue = String.valueOf(accountMap.get(fieldName));
                
                // Getting RHS Field value
                String rhsFieldValue = '';rhsFieldValue = getRHSValue(condition,accountMap);
                                
                // Getting operator value
                String operator = '';operator = String.valueOf(condition.get('operator'));Boolean isConditionTrue = checkIfCondition(lhsFieldValue,operator,rhsFieldValue);               
				
                conditionResults.add(isConditionTrue);
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
                                    
            //System.debug('conditionResults ::: ' + conditionResults);            
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
        //System.debug('finalResult ::: ' + finalResult);
        
        return finalResult;
    }        
    public static String getRHSValue(Map<String, Object> condition,Map<String, Object> accountMap)
    {
        String fieldValue = '';String type = String.valueOf(condition.get('type'));String operator = String.valueOf(condition.get('operator'));        String fieldName = '';
        switch on type
        {
            when 'Direct','Boolean'
            {                
                fieldValue = String.valueOf(condition.get('value'));
            }
            when 'Field Reference'
            {
                fieldName = String.valueOf(condition.get('value')); 
                fieldValue = String.valueOf(accountMap.get(fieldName));
            }        
        }
        
        //System.debug('rhs type ::: ' + type);
        //System.debug('rhs fieldName ::: ' + fieldName);
        //System.debug('rhs fieldValue ::: ' + fieldValue);                
        return fieldValue;
    }
    public static String getThenValue(Map<String, Object> condition,Map<String, Object> accountMap)
    {
        String fieldValue = '';
        
        Boolean thenDirect = Boolean.valueOf(condition.get('thenDirect'));Boolean thenReferece = Boolean.valueOf(condition.get('thenReferece'));Boolean thenvariables = Boolean.valueOf(condition.get('thenvariables'));
        
        String fieldName = '';
        
        if(thenDirect == true)
        {
            fieldValue = String.valueOf(condition.get('thenvalue'));
        }
        if(thenReferece == true)
        {
            fieldName = String.valueOf(condition.get('thenvalue')); 
            fieldValue = String.valueOf(accountMap.get(fieldName));
        }
        if(thenvariables == true)
        {
            
        }
                    
        //System.debug('then fieldName ::: ' + fieldName);
        //System.debug('then fieldValue ::: ' + fieldValue);                
        return fieldValue;
    }
    
    
    // Transform Text Split transformation type value
    public static String transformText(String fieldValue,String trasformationValue){
        System.debug('In transformText'+fieldValue);
        System.debug('In trasformationValue'+trasformationValue);
        String TransformedValue = '';        
        if(trasformationValue != '' &&  fieldValue != '' &&  fieldValue != null){
            System.debug('In if');
            //trasformationValue = '<Account.Description*SPLIT*10*15*END>>';
            String lineNum, preVal, startPosition, endPosition, postVal;
            
            //Clearing delimiters and breaking transformations and storing into array 
            trasformationValue = trasformationValue.replaceAll('\\*', '•');
            trasformationValue = trasformationValue.replaceAll('<', '');        
            trasformationValue = trasformationValue.replaceAll('>', '');
            trasformationValue = trasformationValue.replaceFirst('•', ',');
            String fieldAPIWithObj =trasformationValue.split(',')[0];
            trasformationValue = trasformationValue.substringAfter(',');
            
            String[] transformationValueArr= trasformationValue.split('•');                        
            preVal = transformationValueArr[0];
            
            startPosition = transformationValueArr[1];
            endPosition = transformationValueArr[2];
            if(transformationValueArr.size()>3){
                postVal = transformationValueArr[3];
            }
            else{
                postVal='';
            }
            System.debug('fieldValue'+fieldValue);
            if(fieldValue.length()<=Integer.valueOf(endPosition)){
                endPosition=String.valueOf(fieldValue.length()-1);
            }
            String valToTransformTemp2='';
            if(fieldValue.length()>=Integer.valueOf(startPosition)){
               valToTransformTemp2=fieldValue.substring(Integer.valueOf(startPosition),Integer.valueOf(endPosition)+1);
            }
            
                        
            TransformedValue = preVal+valToTransformTemp2+postVal;
        }
        system.debug('TransformedValue ::: ' + TransformedValue); 
        return TransformedValue;
    }
            
    // Transform Text Area Split transformation type value
    public static String transformTextArea(String fieldValue, String trasformationValue){
        System.debug('In transformTextArea'+trasformationValue);        
        String value = '';        
        if(trasformationValue != '' &&  fieldValue != '' &&  fieldValue != null){            
            String lineNum, preVal, startPosition, endPosition, postVal;
            
            //Clearing delimiters and breaking transformations and storing into array 
            trasformationValue = trasformationValue.replaceAll('\\*', '•');
            trasformationValue = trasformationValue.replaceAll('•<', ',');        
            trasformationValue = trasformationValue.replaceAll('>•<', ',');
            trasformationValue = trasformationValue.replaceAll('<', '');        
            trasformationValue = trasformationValue.replaceAll('>', '');
            trasformationValue = trasformationValue.replaceFirst(',', '•');
            String fieldAPIWithObj =trasformationValue.split('•')[0];
            trasformationValue = trasformationValue.substringAfter('•');
            String[] transformationValueArr= trasformationValue.split(',');
            System.debug('transformationValueArr'+transformationValueArr);
            map<Integer, String[]>  transformationValueMap = new map<Integer,String[]>();
            
            for(String s : transformationValueArr){
                String[] valForMap = s.split('•'); 
                System.debug('valForMap'+valForMap);
                transformationValueMap.put(Integer.valueOf(valForMap[0]) - 1, valForMap);
                
            }
            System.debug('transformationValueMap'+transformationValueMap);
            //Breaking text area field into separate lines
            fieldValue = fieldValue.replaceAll('\r\n', '\n');
            String[] LinesToTransformArr = fieldValue.split('\n');
            
            list<String> TransformedList = new list<String>();
            
            for(integer i=0  ; LinesToTransformArr.size() > i ; i++){
                System.debug('---value---'+LinesToTransformArr[i]);    
                String TransformedValue = '';
                if(transformationValueMap.containsKey(i)){
                    String[] transformationVal = transformationValueMap.get(i);
                    
                    lineNum = transformationVal[0];
                    preVal = transformationVal[1];
                    System.debug('transformationVal[2]'+transformationVal[2]);
                    System.debug('transformationVal[3]'+transformationVal[3]);
                    startPosition = transformationVal[2];
                    endPosition = transformationVal[3];
                    if(transformationVal.size()>4){
                        postVal = transformationVal[4];
                    }
                    else{
                        postVal='';
                    }
                    System.debug('deva-----');
                    
                    if(LinesToTransformArr[i].length()<=Integer.valueOf(endPosition)){
                        endPosition=String.valueOf(LinesToTransformArr[i].length()-1);
                    }
                    System.debug('deva---startPosition---'+startPosition);  
                    System.debug('deva---endPosition---'+endPosition);  
                    String valToTransformTemp2='';
                    if(LinesToTransformArr[i].length()>=Integer.valueOf(startPosition)){
                        valToTransformTemp2=LinesToTransformArr[i].substring(Integer.valueOf(startPosition),Integer.valueOf(endPosition)+1);
                    }
                    System.debug('deva---valToTransformTemp2---'+valToTransformTemp2); 
                    TransformedValue = preVal+ valToTransformTemp2 + postVal;  
                    
                }
                
                if(TransformedValue.length() > 0){
                    TransformedList.add(TransformedValue);
                }else{
                    // TransformedList.add(LinesToTransformArr[i]);
                }                            
            }            
            value = String.join(TransformedList, ' ');
            system.debug('value ::: ' + value);
        }
        return value;         
    }     
        
    // Querying all field values of an object
    public list<sobject> getDataList(String objectName, String recId){
        System.debug('In getDataList');
        String allFieldApi = getAllFieldsOfObject(objectName);  
        System.debug('allFieldApi ::: ' + allFieldApi);
        String refValue = ' = \'' + recId + '\'';
        List<sobject> dataList = new List<sobject>();
        dataList = Database.query('Select ' + allFieldApi + ' From '+ objectName +' where id' + refValue);
        
        return dataList;
    } 
    
    // Querying all field values of an object
    public list<sobject> getRecordDataList(String objectName,String fieldName, String recId,Boolean isRecordTypeExist,String recordTypeId){
        System.debug('In getDataList');
        String allFieldApi = getAllFieldsOfObject(objectName);  
        System.debug('allFieldApi ::: ' + allFieldApi);
        String refValue;
        if(isRecordTypeExist){
            refValue = fieldName+' = \'' + recId + '\''+' AND RecordTypeId'+' = \'' + recordTypeId + '\'';
        }
        else{
            refValue = fieldName+' = \'' + recId + '\'';
        }
        List<sobject> dataList = new List<sobject>();
        dataList = Database.query('Select ' + allFieldApi + ' From '+ objectName +' where ' + refValue);
        return dataList;
    } 
    
    // Querying all field values of child object
    public list<sobject> getChildDataList(String parentObjRefFieldVal, String childObjName, String parentId){
        String allFieldApi = getAllFieldsOfObject(childObjName);
        String condition = parentObjRefFieldVal +' = \'' + parentId + '\'';        
        List<sobject> dataList = Database.query('Select ' + allFieldApi + ' From '+ childObjName +' where ' + condition);
        return dataList;
    } 
    
    // Querying all fields of an object
    public String getAllFieldsOfObject(String objName){
        List<Schema.DescribeFieldResult> listDescribeSObjectResult = new List<Schema.DescribeFieldResult>();
        SObjectType objType = Schema.getGlobalDescribe().get(objName);
        Map<String,Schema.SObjectField> fieldMap = objType.getDescribe().fields.getMap();
        list<String> allFieldsList = new list<String>();
        for(String s : fieldMap.keySet()){
            allFieldsList.add(s);
        }
        String allFields = String.join(allFieldsList, ',');
        return allFields;
    }
    
    // Querying all field values of an object with record Id's
    public list<sobject> getBulkDataList(String objectName, set<Id> recId){
        String allFieldApi = getAllFieldsOfObject(objectName);
        List<sobject> dataList = new List<sobject>();
        dataList = Database.query('Select ' + allFieldApi + ' From '+ objectName +' where id IN : recId');
        return dataList;
    } 
}