global with sharing class SFConnectController {
	
    /******************************** Common methods ********************************/
     
    // Get all record of a child object based on parent object id (Common function)
    @AuraEnabled
    public static list<sobject> getChildDataList(String childObjectName, String parentObjectName , String recId){
        system.debug('In getChildDataList');
        system.debug('childObjectName ::: ' + childObjectName);
        system.debug('parentObjectName ::: ' + parentObjectName);
        system.debug('recId ::: ' + recId);
        String allFieldApi = getAllFieldsOfObject(childObjectName);
        String refValue = ' = \'' + recId + '\'';
        List<sobject> dataList = new List<sobject>(); 
        //system.debug('Select ' + allFieldApi + ' From '+ childObjectName +' where ' + parentObjectName + refValue);
        dataList = Database.query('Select ' + allFieldApi + ' From '+ childObjectName +' where ' + parentObjectName + refValue);
        //system.debug('dataList ::: ' + dataList);
        return dataList;
    }
    
    // Get all fields in a record (Common function)
    @AuraEnabled 
    public static list<sobject> getDataList(String objectName, String recId){
        //system.debug('In getDataList ');
        //system.debug('objectName ::: ' + objectName);
        //system.debug('recId ::: ' + recId);
        String allFieldApi = getAllFieldsOfObject(objectName);
        String condition = '';
        //system.debug(' recId ::: ' + recId);
        if(recId!= null)
        condition = ' where id = \'' + recId + '\'';
        List<sobject> dataList = new List<sobject>();                
        if(condition != ''){
            //system.debug('query ::: ' + 'Select ' + allFieldApi + ', From '+ objectName + condition);
            dataList = Database.query('Select ' + allFieldApi + ' From '+ objectName + condition);
        }
        else{
            //system.debug('query ::: ' + 'Select ' + allFieldApi + ' From '+ objectName);
            dataList = Database.query('Select ' + allFieldApi + ' From '+ objectName);
        }
        //system.debug('dataList ::: ' + dataList);
        return dataList;
    }
    
    @AuraEnabled 
    public static Map<string,string> getChildObjectNames(String recId){
        Mapping_Contract__c contractRecord = [Select Id, Name, Source_Object__c From Mapping_Contract__c where Id=:recId ];
        String parentObjectName = contractRecord.Source_Object__c;  
        Map<string,string> objectRelationshipMap = new Map<string,string>();
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        for(String ss1: schemaMap.keyset()){
            Schema.SObjectType objToken=schemaMap.get(ss1);
            if(ss1.equalsignorecase(parentObjectName)){
                Schema.DescribeSObjectResult objDescribe=objToken.getdescribe();
                List<Schema.ChildRelationship> childRelationshipList = objDescribe.getChildRelationships();
                for(Schema.ChildRelationship ss:childRelationshipList){
                    string RelationshipName=ss.getRelationshipName();
                    string childObjectName = string.valueof(ss.getChildSObject());
                    string childFieldToken = string.valueof(ss.getField());
                    objectRelationshipMap.put(childObjectName,childFieldToken);
                }
            }
        }
        return objectRelationshipMap;
    }
    
    public list<sobject> getBulkDataList(String objectName, set<Id> recId){
        String allFieldApi = SFConnectController.getAllFieldsOfObject(objectName);
        List<sobject> dataList = new List<sobject>();
        dataList = Database.query('Select ' + allFieldApi + ' From '+ objectName +' where id IN : recId');
        return dataList;
    } 
    
    // Get all fields in a record (Common function)
    @AuraEnabled
    public static list<sobject> getDataListWithConditions(String objectName, String dataStoreValue, String sourceObjectName){
        //system.debug('In getDataListWithConditions ');
        //system.debug('objectName ::: ' + objectName);        
        String allFieldApi = getAllFieldsOfObject(objectName);
        String condition = '';        
        if(dataStoreValue != '')
            condition = ' where Object__r.Datastore__c = \'' + dataStoreValue +'\' AND Object__r.Name = \'' + sourceObjectName + '\'';
        List<sobject> dataList = new List<sobject>();                
        if(condition != ''){
            //system.debug('query ::: ' + 'Select ' + allFieldApi + ' From '+ objectName + condition);
            dataList = Database.query('Select ' + allFieldApi + ' From '+ objectName + condition);
        }
        else{
            //system.debug('query ::: ' + 'Select ' + allFieldApi + ' From '+ objectName);
            dataList = Database.query('Select ' + allFieldApi + ' From '+ objectName);
        }
        //system.debug('dataList ::: ' + dataList);
        return dataList;
    }
        
    // Get all fieldnames of an object in comma seperated string format (Common function)
    @AuraEnabled
    public static String getAllFieldsOfObject(String objName){
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
    
    // Get all field names in a list
    @AuraEnabled
    public static List<String> getAllFieldsNameList(String objectName) 
    {
        List<String> fieldsNameList = new List<String>();
        Map <String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Map <String, Schema.SObjectField> fieldMap = schemaMap.get(objectName).getDescribe().fields.getMap();
        for(Schema.SObjectField sfield : fieldMap.Values())
        {
            schema.describefieldresult dfield = sfield.getDescribe();
            //system.debug('@@@API Name : '  + dfield.getname());
            //system.debug('####Label Name : ' + dfield.getLabel ());                                    
            fieldsNameList.add(dfield.getname());            
        }
        
        return fieldsNameList;
    }
    
    /******************************** Common methods ********************************/
    
    /******************************** Mapping object methods ********************************/
    
    //Delete mapping Contract record
    @AuraEnabled
    public static void deleteMappingContractDetail(Mapping_Contract__c mappingContractDetail){
        DELETE mappingContractDetail;
        
    }
    
	//Update mapping Contract record
    @AuraEnabled
    public static Mapping_Contract__c updateMappingContract(Mapping_Contract__c mappingContractDetail ){
        UPSERT mappingContractDetail;
        return mappingContractDetail;
    }    
    
    // Get mapping object details
    @AuraEnabled
    public static List<List<String>> getMappingObjectDetails()
    {              
        List<List<String>> resultString = new List<List<String>>();
        
        List<String> userInfolist = new List<String>();
		List<String> allObjectsNameList = new List<String>();  
        List<String> allPickListValues = new List<String>();  
        
        
        userInfolist.add(userinfo.getName());                
        allObjectsNameList = getAllObjectNames();
        allPickListValues = getAllPickListValues('Mapping_Object__c','Datastore__c');
        
        //system.debug('userinfo ::: ' + userinfo.getName());
        //system.debug('allObjectsNameList ::: ' + allObjectsNameList);
        //system.debug('allPickListValues ::: ' + allPickListValues);
        
        resultString.add(userInfolist);
        resultString.add(allObjectsNameList);
        resultString.add(allPickListValues);                
        //get the getOrgTimeZone
        List<String> timezoneName =  new List<String>();
        timezoneName.add(JSON.serialize(getOrgTimeZone()[0]));
		resultString.add(timezoneName);
        return resultString;
    }
    
    // Get mapping object field details
    @AuraEnabled
    public static List<List<String>> getMappingObjectFieldsDetails(String objectName, String fieldName)
    {              
        List<List<String>> resultString = new List<List<String>>();
                
		List<String> allFieldsNameList = new List<String>();  
        List<String> allPickListValues = new List<String>();  
                        
        allFieldsNameList = getAllObjectNames();
        allPickListValues = getAllPickListValues(objectName , fieldName);
                
        //system.debug('allFieldsNameList ::: ' + allFieldsNameList);
        //system.debug('allPickListValues ::: ' + allPickListValues);
                
        resultString.add(allFieldsNameList);
        resultString.add(allPickListValues);                
        
        return resultString;
    }        
    
    // Get all objects name list
    @AuraEnabled
    public static List<String> getAllObjectNames() {
        List < String > allObjectNames = new list < String > ();
        Map<String, Schema.SObjectType> allObjectsMap = Schema.getGlobalDescribe();
        for(Schema.SObjectType thisObj : allObjectsMap.values()) {
            
            String objectApiName = String.valueof(thisObj);
            
            /*if(!objectApiName.containsIgnoreCase('Event') && !objectApiName.containsIgnoreCase('Feed') && 
                   !objectApiName.containsIgnoreCase('Share') && !objectApiName.containsIgnoreCase('Info') && 
                   !objectApiName.containsIgnoreCase('ContactRole') && !objectApiName.containsIgnoreCase('Partner') && 
                   !objectApiName.containsIgnoreCase('Attachment') && !objectApiName.containsIgnoreCase('Group') &&
                   !objectApiName.containsIgnoreCase('Auth') && !objectApiName.containsIgnoreCase('ChangeEvent') && 
                   !objectApiName.containsIgnoreCase('History') && !objectApiName.containsIgnoreCase('Apex') &&
                   !objectApiName.containsIgnoreCase('Authorization') && !objectApiName.containsIgnoreCase('Aura') &&
                   !objectApiName.containsIgnoreCase('PermissionSet') && !objectApiName.containsIgnoreCase('Org') &&
                   !objectApiName.containsIgnoreCase('Messaging') && !objectApiName.containsIgnoreCase('App') &&
                   !objectApiName.containsIgnoreCase('Activity') && !objectApiName.containsIgnoreCase('Asset') &&
                   !objectApiName.containsIgnoreCase('Setup') && !objectApiName.containsIgnoreCase('Service') &&
                   !objectApiName.containsIgnoreCase('User') && !objectApiName.containsIgnoreCase('Visualforce') &&
                   !objectApiName.containsIgnoreCase('Task') && !objectApiName.containsIgnoreCase('Secure') &&
                   !objectApiName.containsIgnoreCase('Custom') && !objectApiName.containsIgnoreCase('Data') &&
                   !objectApiName.containsIgnoreCase('Email') && !objectApiName.containsIgnoreCase('Flow') &&
                   !objectApiName.containsIgnoreCase('Entity') && !objectApiName.containsIgnoreCase('Field') &&
                   !objectApiName.containsIgnoreCase('Document') && !objectApiName.containsIgnoreCase('Template') &&
                   !objectApiName.containsIgnoreCase('Lightning') && !objectApiName.containsIgnoreCase('Process') &&
                   !objectApiName.containsIgnoreCase('Folder') && !objectApiName.containsIgnoreCase('Payment') &&
                   !objectApiName.containsIgnoreCase('Library') && !objectApiName.containsIgnoreCase('List') &&
                   !objectApiName.containsIgnoreCase('Content') && !objectApiName.containsIgnoreCase('Macro') &&
                   !objectApiName.containsIgnoreCase('Metric') && !objectApiName.containsIgnoreCase('Chatter') &&
                   !objectApiName.containsIgnoreCase('Search') && !objectApiName.containsIgnoreCase('Topic') &&
                   !objectApiName.containsIgnoreCase('Profile') && !objectApiName.containsIgnoreCase('Prompt') &&
                   !objectApiName.containsIgnoreCase('Resource') && !objectApiName.containsIgnoreCase('Job') &&
                   !objectApiName.containsIgnoreCase('Platform') && !objectApiName.containsIgnoreCase('Quick')                  
                  )*/
            allObjectNames.add(String.valueof(objectApiName));
        }
        allObjectNames.sort();
        return allObjectNames;                
    }
  
    // Get all objects name list
    @AuraEnabled
    public static List<String> getAllReferenceObjectNames(String objectName) {
        Set<String> objectNamesSet = new Set<String>();
        List < String > allReferenceObjectNames = new list < String > ();
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.SObjectType objectSchema = schemaMap.get(objectName);	
        List<Schema.SObjectField> fieldMap = objectSchema.getDescribe().fields.getMap().values();
        for(Schema.SObjectField field :fieldMap) 
        {	
            Schema.DescribeFieldResult fieldData = field.getDescribe();
            if(fieldData.getType() == Schema.DisplayType.REFERENCE){
                List<Schema.sObjectType> referenceToObjects=fieldData.getReferenceTo();
                //system.debug('Object Names' + String.valueOf(referenceToObjects[0]));             
                objectNamesSet.add(String.valueOf(referenceToObjects[0]));
            }    
        }                
        allReferenceObjectNames.addAll(objectNamesSet);
        return allReferenceObjectNames;
    }
    
    public static void checkObjectUsedStatus(List<Mapping_Object__c> objectRecords) 
    { 
        List<Mapping_Object__c> sfRecords = new List<Mapping_Object__c>();
        List<Mapping_Object__c> sapRecords = new List<Mapping_Object__c>();
        set<String> sfObjectNames = new set<String>();
        set<String> sapObjectNames = new set<String>();
        for(Mapping_Object__c objectRecord :  objectRecords){
            if(objectRecord.Datastore__c == 'Salesforce'){
                sfObjectNames.add(objectRecord.Name);
                sfRecords.add(objectRecord);
            }
            else{
                sapObjectNames.add(objectRecord.Name);
                sapRecords.add(objectRecord);
            }
        }
        
        //String sfobjectNameString = SFConnectController.quoteKeySet(sfObjectNames);
        String sfQueryStr = '';
        sfQueryStr = sfQueryStr + 'SELECT '+getAllFieldsOfObject('Contract_Rule__c');
        sfQueryStr = sfQueryStr + ',Mapping_Contract__r.Source_Datastore__c FROM Contract_Rule__c';
        sfQueryStr = sfQueryStr + ' WHERE (Mapping_Contract__r.Source_Datastore__c = \'Salesforce\'';
        sfQueryStr = sfQueryStr + ' AND Source_Object__c IN:sfObjectNames'+ '' +')';
        sfQueryStr = sfQueryStr + ' OR (Mapping_Contract__r.Target_Datastore__c = \'Salesforce\' AND Target_Object__c IN :sfObjectNames'+ '' +')';
        List<Contract_Rule__c> sfReferedContractRulesList = (List<Contract_Rule__c>)Database.query(sfQueryStr);
        for(Contract_Rule__c contractRecord: sfReferedContractRulesList){
            String ObjectName = '';
            if(contractRecord.Mapping_Contract__r.Source_Datastore__c == 'Salesforce'){
                ObjectName = contractRecord.Source_Object__c;
            }
            else{
                ObjectName = contractRecord.Target_Object__c;
            }
            for(Integer i=0;i<sfRecords.size();i++){
                if(sfRecords[i].Name == ObjectName){
                    sfRecords[i].addError('Object is referred in Mapping Contract, hence it cannot be deleted.');
                    sfRecords.remove(i);
                    i--;
                }
            }
        }     
        //String objectNameString = SFConnectController.quoteKeySet(sapObjectNames);
        String queryStr = ''; 
        
        queryStr = queryStr + 'SELECT '+getAllFieldsOfObject('Contract_Rule__c');
        queryStr = queryStr + ',Mapping_Contract__r.Source_Datastore__c FROM Contract_Rule__c';
        queryStr = queryStr + ' WHERE (Mapping_Contract__r.Source_Datastore__c != \'Salesforce\'';
        queryStr = queryStr + ' AND Source_Object__c IN:sapObjectNames'+ '' +')';
        queryStr = queryStr + ' OR (Mapping_Contract__r.Target_Datastore__c != \'Salesforce\' AND Target_Object__c IN :sapObjectNames'+ '' +')';
        
        
        /*queryStr = queryStr + ' WHERE (Mapping_Contract__r.Source_Datastore__c = \'SAP\'';
        queryStr = queryStr + ' AND Source_Object__c IN:sapObjectNames'+ '' +')';
        queryStr = queryStr + ' OR (Mapping_Contract__r.Target_Datastore__c = \'SAP\' AND Target_Object__c IN :sapObjectNames'+ '' +')';*/
       
        
        
        List<Contract_Rule__c> referedContractRulesList = (List<Contract_Rule__c>) Database.query(queryStr);
        for(Contract_Rule__c contractRecord: referedContractRulesList){
            String ObjectName = '';
            if(contractRecord.Mapping_Contract__r.Source_Datastore__c != 'Salesforce'){
                ObjectName = contractRecord.Source_Object__c;
            }
            else{
                ObjectName = contractRecord.Target_Object__c;
            }
            for(Integer i=0;i<sapRecords.size();i++){
                if(sapRecords[i].Name == ObjectName){
                    sapRecords[i].addError('Object is referred in Mapping Contract, hence it cannot be deleted.');
                    sapRecords.remove(i);
                    i--;
                }
            }
        }
    }
    
    
    /*convert a Set<String> into a quoted, comma separated String literal for inclusion in a dynamic SOQL Query
    public Static String quoteKeySet(Set<String> mapKeySet)
    {
        String newSetStr = '' ;
        for(String str : mapKeySet)
            newSetStr += '\'' + str + '\',';
        
        newSetStr = newSetStr.lastIndexOf(',') > 0 ? '(' + newSetStr.substring(0,newSetStr.lastIndexOf(',')) + ')' : newSetStr ;
        return newSetStr;
        
    }*/
    
    @AuraEnabled
    public static Boolean checkIsUsedMappingObject(String objectName, String dataStore) 
    {
        //system.debug('objectName ::: ' + objectName);
        String queryStr = '';
        queryStr = queryStr + 'SELECT '+getAllFieldsOfObject('Contract_Rule__c');
        queryStr = queryStr + ' FROM Contract_Rule__c';
        queryStr = queryStr + ' WHERE (Mapping_Contract__r.Source_Datastore__c = \''+dataStore+'\'';
        queryStr = queryStr + ' AND Source_Object__c = \''+ objectName +'\')';
        queryStr = queryStr + ' OR (Mapping_Contract__r.Target_Datastore__c = \''+dataStore+'\' AND Target_Object__c = \''+ objectName +'\')';
		List<SObject> referedConreactRulesList = Database.query(queryStr);
        if(referedConreactRulesList.size()>0){
            return true;
        }
        else{
            return false; 
        }              
    }
    
    
    
    @AuraEnabled
    public static List<List<SObject>> checkIsUsedMappingObjectFields(String Datastore ,String objectName, List<String> fieldsList) 
    {
        //system.debug('Datastore ::: ' + Datastore);
        //system.debug('objectName ::: ' + objectName);
        //system.debug('objectName ::: ' + objectName);
        String queryStr = '';
        queryStr = queryStr + 'SELECT '+getAllFieldsOfObject('Contract_Rule__c');
        queryStr = queryStr + ' FROM Contract_Rule__c';
        queryStr = queryStr + ' WHERE (Source_Object__c = \''+ objectName +'\' OR Target_Object__c = \''+ objectName +'\')';        
        
        
        /*queryStr = queryStr + ' WHERE (Mapping_Contract__r.Source_Datastore__c = \'Salesforce\'';
        queryStr = queryStr + ' OR Mapping_Contract__r.Source_Datastore__c = \'SAP\')';
        queryStr = queryStr + ' AND (Source_Object__c = \''+ objectName +'\' OR Target_Object__c = \''+ objectName +'\')';        */
        
        
        //system.debug('queryStr ::: ' + queryStr);
        
        Set<String> mappingContractsIdSet = new Set<String>();
        List<String> mappingContractsIdList = new List<String>();
        List<SObject> referredContractRulesList = Database.query(queryStr);
        //system.debug('referredContractRulesList ::: ' + referredContractRulesList);        
        List<String> contractRulesIdList = new List<String>();
        if(referredContractRulesList.size()>0)
        {
            for(SObject contractRule : referredContractRulesList){
                contractRulesIdList.add(String.valueOf(contractRule.get('Id')));
             	mappingContractsIdSet.add(String.valueOf(contractRule.get('Mapping_Contract__c')));  
            }
        }
        
        mappingContractsIdList.addAll(mappingContractsIdSet);
        String mappingContractsQuery = '';
        mappingContractsQuery = mappingContractsQuery + 'SELECT '+getAllFieldsOfObject('Mapping_Contract__c');
        mappingContractsQuery = mappingContractsQuery + ' FROM Mapping_Contract__c WHERE Id IN : mappingContractsIdList' ;
        List<SObject> referredMappingContractsList = Database.query(mappingContractsQuery);
        
        
        String mappingRulesQuery = '';
        mappingRulesQuery = mappingRulesQuery + 'SELECT '+getAllFieldsOfObject('Mapping_Rule__c');
        mappingRulesQuery = mappingRulesQuery + ' FROM Mapping_Rule__c WHERE Contract_Rule__c IN : contractRulesIdList' ;
        List<SObject> referredMappingRulesList = Database.query(mappingRulesQuery);
        
        //query response rules record
        List<Response_Rule__c> responseRuleRecords = [SELECT Id, Name, Target_Field__c, Source_Field__c, Source_Object_Fields__c, Rule_Order__c, Mandatory__c, Dev_value__c, Contract_Rule__c, Allowed_for_update__c FROM Response_Rule__c WHERE Contract_Rule__c IN: contractRulesIdList];
        
        List<List<SObject>> resultList = new List<List<SObject>>();
		resultList.add(referredMappingContractsList);
        resultList.add(referredContractRulesList);
        resultList.add(referredMappingRulesList);
        resultList.add(responseRuleRecords);
        return resultList;
    }    
        
    @AuraEnabled
    public static void deleteMappingObject(Mapping_Object__c mappingObjectDetail) 
    {
    	//system.debug('In deleteMappingObject');
        DELETE mappingObjectDetail;
     
    }
        
    // Get picklist values of a fields 
    @AuraEnabled
    public static List<String> getAllPickListValues(String objectName,String fieldName) 
    {
        List<String> pickListValuesList= new List<String>();

        Schema.SObjectType s = Schema.getGlobalDescribe().get(objectName) ;
        Schema.DescribeSObjectResult r = s.getDescribe() ;
        Map<String,Schema.SObjectField> fields = r.fields.getMap() ;
        Schema.DescribeFieldResult fieldResult = fields.get(fieldName).getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry pickListVal : ple){
            system.debug(pickListVal.getLabel() +' '+pickListVal.getValue());
            
            pickListValuesList.add('{\"label\":\"'+pickListVal.getLabel() +'\",\"value\":\"'+ pickListVal.getValue()+'\"}');
            
        } 
        system.debug('pickListValuesList'+pickListValuesList);
		return pickListValuesList;
    }
     
    // Save mapping object records
    @AuraEnabled
    public static Id saveMappingObject(Mapping_Object__c ObjectDetail) 
    {
        Boolean flag = true;
        
        Mapping_Object__c mappingObjectDetail = ObjectDetail;
        List<Mapping_Object__c> mappingObjects = [SELECT Name,Datastore__c FROM Mapping_Object__c];
        for(Mapping_Object__c mappingObj : mappingObjects){
            if(mappingObj.Id != mappingObjectDetail.Id){
                if(mappingObj.Name == mappingObjectDetail.Name && mappingObj.Datastore__c == mappingObjectDetail.Datastore__c){
                    flag=false;
                }
            }
        }
        if(flag== true){
            upsert mappingObjectDetail;
            return mappingObjectDetail.Id;
        }
        else{
            return null;
        }
    }
    
    // Delete mapping object field record
    @AuraEnabled
    public static boolean deleteMappingObjectField(String objectName, String recId) 
    {
        //system.debug('In deleteMappingObjectField');
        //system.debug('objectName ::: ' + objectName);
        //system.debug('recId ::: ' + recId);
        List<Mapping_Object_Field__c> mappingObjectFieldsList = getDataList(objectName, recId);
        //system.debug('mappingObjectFieldsList ::: ' + mappingObjectFieldsList);
        DELETE mappingObjectFieldsList;
        return true;
    }
    
    // Save mapping object field recprds
    @AuraEnabled
    public static Boolean saveanddeleteMappingObjectFieldsList(List<Mapping_Object_Field__c> mappingObjectFields, List<Mapping_Object_Field__c> deleteList) 
    {     
        //system.debug('In saveanddeleteMappingObjectFieldsList');
        //system.debug('mappingObjectFields ::: ' + mappingObjectFields);
        //for(Mapping_Object_Field__c aa : mappingObjectFields)
            //system.debug('aa ::: ' + aa);
        //system.debug('After first for closs');
        //system.debug('deleteList ::: ' + deleteList);
        
        //if(deleteList != null){
        //for(Mapping_Object_Field__c dd : deleteList)
            //system.debug('dd ::: ' + dd);
        //}
        
        UPSERT mappingObjectFields;
        if(deleteList != null){
            DELETE deleteList;
        }
        return true;
    }
    
    /******************************** Mapping object methods ********************************/
    
    /******************************** Mapping contract - Contract Rule methods ********************************/
        
    // Get all details for mapping contract
    
    @AuraEnabled
    public static List<List<sObject>> getMappingContractDetailsList(String objectName, String recId) 
    {
        List<sObject> sourcePickListValuesList = new List<sObject>();
        List<sObject> targetPickListValuesList = new List<sObject>();
        List<sObject> userInfolist = new List<sObject>();
        
        List<Mapping_Contract__c> mappingContractDetailsList = getDataList(objectName, recId);
        List<Contract_Rule__c> contractRulesDetailsList = getChildDataList('Contract_Rule__c', objectName, recId);
        List<String> sourcePickListValues = getAllPickListValues('Mapping_Object__c', 'Datastore__c');     
        List<String> targetPickListValues = getAllPickListValues('Mapping_Object__c', 'Datastore__c');     
        
        List<Mapping_Contract__c> allMappingContractDetailsList = getDataList(objectName, null);
        
        userInfolist =  getDataList('User', String.valueOf(mappingContractDetailsList[0].get('createdbyid')));
        //system.debug('userInfolist ::: ' + userInfolist);                
        for(String ss : sourcePickListValues)
        {
            sObject sobjValue = new Contract_Rule__c();
            //system.debug('ss ::: ' + ss);
            sobjValue.put('Name', ss);
            //system.debug('sobjValue ::: ' + sobjValue);
            sourcePickListValuesList.add(sobjValue);
        }
        
        for(String tt : targetPickListValues)
        {
            sObject sobjValue = new Contract_Rule__c();
            sobjValue.put('Name', tt);
            targetPickListValuesList.add(sobjValue);
        }     
        
        
        
        List<List<sObject>> resultList = new List<List<sObject>>();
        resultList.add(userInfolist);
        resultList.add(mappingContractDetailsList);
        resultList.add(contractRulesDetailsList);
        resultList.add(sourcePickListValuesList);
        resultList.add(targetPickListValuesList);
        resultList.add(allMappingContractDetailsList);
        //get the getOrgTimeZone
		resultList.add(getOrgTimeZone());
        List<NamedCredential> namedCredentialList=[SELECT DeveloperName,Endpoint,Id,MasterLabel,PrincipalType FROM NamedCredential];
        resultList.add(namedCredentialList);
        
        
        //get the list of objects 
        Map<String, List<String>> objectPicListvalue = new Map<String, List<String>>();
        List<String> objectTypes = new List<String>();
        List<AggregateResult> objectResult = [Select Datastore__c From Mapping_Object__c Group by Datastore__c];
         system.debug('objectResult ::: ' + objectResult);
        for (AggregateResult ar : objectResult)  {
            String name =  String.valueOf(ar.get('Datastore__c'));
            objectTypes.add(name);
            objectPicListvalue.put(name,  new List<String>());
        }
        List<Mapping_Object__c> objects = [Select Name,Datastore__c from Mapping_Object__c];
        system.debug('objects ::: ' + objects);
        for(Mapping_Object__c record : objects){
            List<String> nameList = objectPicListvalue.get(record.Datastore__c);
            nameList.add(record.Name);
            objectPicListvalue.put(record.Datastore__c, nameList);
        }
        
        List<Sobject> picklistValues = new List<Sobject>(); 
        Mapping_Contract__c container = new Mapping_Contract__c();
        container.Description__c  = JSON.serialize(objectPicListvalue);
        picklistValues.add(container);
        resultList.add(picklistValues);
        
        system.debug('resultList ::: ' + resultList);
        return resultList;
    }
    
    
    @AuraEnabled
    public static List<List<sObject>> getNewMappingContractDetailsList(String objectName) 
    {
        List<sObject> sourcePickListValuesList = new List<sObject>();
        List<sObject> targetPickListValuesList = new List<sObject>();        
                        
        List<String> sourcePickListValues = getAllPickListValues('Mapping_Object__c', 'Datastore__c');     
        List<String> targetPickListValues = getAllPickListValues('Mapping_Object__c', 'Datastore__c');             
        
        List<Mapping_Contract__c> allMappingContractDetailsList = getDataList(objectName, null);
                
        for(String ss : sourcePickListValues)
        {
            sObject sobjValue = new Contract_Rule__c();
            //system.debug('ss ::: ' + ss);
            sobjValue.put('Name', ss);
            //system.debug('sobjValue ::: ' + sobjValue);
            sourcePickListValuesList.add(sobjValue);
        }
        
        for(String tt : targetPickListValues)
        {
            sObject sobjValue = new Contract_Rule__c();
            sobjValue.put('Name', tt);
            targetPickListValuesList.add(sobjValue);
        }                
        List<List<sObject>> resultList = new List<List<sObject>>();        
        resultList.add(sourcePickListValuesList);
        resultList.add(targetPickListValuesList);
        resultList.add(allMappingContractDetailsList);
        
        List<NamedCredential> namedCredentialList=[SELECT DeveloperName,Endpoint,Id,MasterLabel,PrincipalType FROM NamedCredential];
        resultList.add(namedCredentialList);
        
        //get the list of objects 
        Map<String, List<String>> objectPicListvalue = new Map<String, List<String>>();
        List<String> objectTypes = new List<String>();
        List<AggregateResult> objectResult = [Select Datastore__c From Mapping_Object__c Group by Datastore__c];
        for (AggregateResult ar : objectResult)  {
            String name =  String.valueOf(ar.get('Datastore__c'));
            objectTypes.add(name);
            objectPicListvalue.put(name,  new List<String>());
        }
        List<Mapping_Object__c> objects = [Select Name,Datastore__c from Mapping_Object__c];
        for(Mapping_Object__c record : objects){
            List<String> nameList = objectPicListvalue.get(record.Datastore__c);
            nameList.add(record.Name);
            objectPicListvalue.put(record.Datastore__c, nameList);
        }
        
        List<Sobject> picklistValues = new List<Sobject>(); 
        Mapping_Contract__c container = new Mapping_Contract__c();
        container.Description__c  = JSON.serialize(objectPicListvalue);
        picklistValues.add(container);
        resultList.add(picklistValues);
        
        
        return resultList;
    }
    
    
    // Get Mapping Contract and Contract Rules details
    @AuraEnabled
    public static Id saveMappingContractDetails(Mapping_Contract__c MappingContract) 
    {
        //system.debug('In saveMappingContractDetails');
        UPSERT MappingContract;
        return MappingContract.Id;
    }
            
    // Get Mapping Contract and Contract Rules details
    @AuraEnabled
    public static List<List<sObject>> getMappingContractAndContractRule(String objectName, String recId) 
    {
        //system.debug('In getMappingContractAndContractRule');
        List<Mapping_Contract__c> mappingContractDetailsList = getDataList(objectName, recId);
        List<Contract_Rule__c> contractRulesDetailsList = getChildDataList('Contract_Rule__c', objectName, recId);
        List<Integration_Mapping__c> integrationMappingList = getDataList('Integration_Mapping__c',null);
        List<Job__c> jobRecords = [select Id, Name, Mapping_Contract__c From Job__c where Mapping_Contract__c=:recId ];
        
        List<List<sObject>> resultList = new List<List<sObject>>();
        
        resultList.add(mappingContractDetailsList);
        resultList.add(contractRulesDetailsList);
        resultList.add(integrationMappingList);
        resultList.add(jobRecords);
        return resultList;
    }
    
    // Save contract rule records
    @AuraEnabled
    public static Id saveContractRuleData(Contract_Rule__c ruleDetail) 
    {
        Boolean flag = true;
        //system.debug('ruleDetail ::: ' + ruleDetail);
        Contract_Rule__c mappingContractRule = ruleDetail;        
        for(Contract_Rule__c contractRule : [SELECT Name,Mapping_Contract__c FROM Contract_Rule__c WHERE Mapping_Contract__c =: mappingContractRule.Mapping_Contract__c]){
            if(contractRule.Id != mappingContractRule.Id){
                if(contractRule.Name == mappingContractRule.Name && contractRule.Mapping_Contract__c == mappingContractRule.Mapping_Contract__c){
                    flag=false;
                }
            }
        }
        if(flag== true){
            upsert mappingContractRule;
            return mappingContractRule.Id;
        }
        else{
            return null;
        }
    }   
    // Save contract rule records
    @AuraEnabled
    public static void saveContractRuleDataList(List<Contract_Rule__c> ruleDetailList) 
    {
        UPSERT ruleDetailList;
    }           
    
    // Delete contract rule record
    @AuraEnabled
    public static void deleteContractRule(Contract_Rule__c contractRuleDetail) 
    {
        //system.debug('In deleteMappingObjectField');        
        DELETE contractRuleDetail;        
    }                
    
    // Get record type list
    @AuraEnabled
    public static List<String> getRecordTypeList(String objectName) 
    {     
        //system.debug('In saveMappingObjectFieldsList');
        
        String queryStr = '';
        
        queryStr = queryStr + 'SELECT '+ getAllFieldsOfObject('RecordType') +' FROM RecordType WHERE SobjectType =: objectName';
        
        List<RecordType> recordsList = Database.query(queryStr);
            
        List<String> recordTypeList = new List<String>();
        
        for(RecordType rec : recordsList)
        {
            recordTypeList.add(rec.Name);
        }
        
        return recordTypeList;
    }
    
    // Get contract rule and mapping contract details
    @AuraEnabled
    public static List<List<sObject>> getContractRuleDetails(String objectName, String recId)
    {              
        List<List<sObject>> resultString = new List<List<sObject>>();
        
        List<sObject> userInfolist = new List<sObject>();
		List<sObject> contractRuleList = new List<sObject>();          
        
        List<sObject> allContractRuleList = new List<sObject>();          
        List<sObject> mappingContractList = new List<sObject>();          
        contractRuleList = getDataList(objectName,recId);                        
        //system.debug('contractRuleList ::: ' + contractRuleList);
		allContractRuleList = getDataList(objectName,null);
		userInfolist =  getDataList('User', String.valueOf(contractRuleList[0].get('createdbyid')));
        //system.debug('Mapping_Contract__c ::: ' + String.valueOf(contractRuleList[0].get('Mapping_Contract__c')));
        mappingContractList = getDataList('Mapping_Contract__c', String.valueOf(contractRuleList[0].get('Mapping_Contract__c')));
        
        //system.debug('userInfolist ::: ' + userInfolist);
        //system.debug('contractRuleList ::: ' + contractRuleList);
        //system.debug('mappingContractList ::: ' + mappingContractList);
        
        resultString.add(userInfolist);
        resultString.add(contractRuleList);              
        resultString.add(mappingContractList);            
        resultString.add(allContractRuleList);            
        //get the getOrgTimeZone
		resultString.add(getOrgTimeZone());
        
        return resultString;
    }
    
    /******************************** Mapping contract - Contract Rule methods ********************************/
    
    /******************************** Contract Rule - Mapping Rule methods ********************************/
    
    // Get mapping rule - mapping object details
    @AuraEnabled
    public static List<List<sObject>> getMappingObjectAndFieldsDetails(String objectName, String dataStore, String type)
    {          
        //system.debug('getMappingObjectAndFieldsDetails ');
        List<List<sObject>> resultList = new List<List<sObject>>();
        
        List<sObject> mappingObjectDetails = new List<sObject>();
		List<sObject> mappingObjectFieldsList = new List<sObject>();  
        
        String allObjectFields = getAllFieldsOfObject('Mapping_Object__c');
        mappingObjectDetails = Database.query('SELECT '+allObjectFields+' FROM Mapping_Object__c WHERE Name = \'' + objectName + '\' AND Datastore__c = \'' + dataStore+'\'');        
        
        //system.debug('type12 ::: ' + type);
        if(type != 'All')
        {
            List<sObject> allMappingObjectFieldsList = new List<sObject>();  
            List<String> obejectFieldNameList = new List<String>();
            //system.debug('dataStore ::: ' + dataStore);
            if(dataStore != 'Salesforce')
            {
                if(mappingObjectDetails.size()>0){
                    //system.debug('Id ::::: '+String.valueOf(mappingObjectDetails[0].get('Id')));
                    allMappingObjectFieldsList = getChildDataList('Mapping_Object_Field__c','Object__c',String.valueOf(mappingObjectDetails[0].get('Id')));            
                    
                    if(allMappingObjectFieldsList.size()>0)
                    {
                        for(sObject obj : allMappingObjectFieldsList){
                            if(String.valueOf(obj.get('Datatype__c')) == type)
                            {
                                obejectFieldNameList.add(String.valueOf(obj.get('Name')));
                            }
                        }    
                    }
                }
            }
            else
            {
                allMappingObjectFieldsList = getChildDataList('Mapping_Object_Field__c','Object__c',String.valueOf(mappingObjectDetails[0].get('Id')));
                
                Map<string,SObjectField> fList = schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap();                        	
                if(allMappingObjectFieldsList.size()>0)
                {
                    for(sObject obj : allMappingObjectFieldsList){
                        //system.debug('obj ::: ' + obj);
                        //system.debug('obj name ::: ' + String.valueOf(obj.get('Name')));
                        //system.debug(String.valueOf(fList.get(String.valueOf(obj.get('Name'))).getDescribe().getType()).toUpperCase());
                        //system.debug('type ::: ' + type);
                        if( String.valueOf(fList.get(String.valueOf(obj.get('Name'))).getDescribe().getType()).toUpperCase() == type)
                        {
                            obejectFieldNameList.add(String.valueOf(obj.get('Name')));
                        }
                    }        
                }
            }
            if(mappingObjectDetails.size()>0){
                mappingObjectFieldsList = getChildDataListWithCondition('Mapping_Object_Field__c','Object__c',String.valueOf(mappingObjectDetails[0].get('Id')),obejectFieldNameList);
            }
        }
        else
        {
            if(mappingObjectDetails.size()>0){
            mappingObjectFieldsList = getChildDataList('Mapping_Object_Field__c','Object__c',String.valueOf(mappingObjectDetails[0].get('Id')));            
            }
        }
        
        
        
                
        resultList.add(mappingObjectDetails);              
        resultList.add(mappingObjectFieldsList);              
        
        return resultList;
    }
    
    // Get all record of a child object based on parent object id (Common function)
    @AuraEnabled
    public static list<sobject> getChildDataListWithCondition(String childObjectName, String parentObjectName ,String recId, List<String> objectFieldNames){
        //system.debug('In getChildDataList');
        //system.debug('childObjectName ::: ' + childObjectName);
        //system.debug('parentObjectName ::: ' + parentObjectName);
        //system.debug('recId ::: ' + recId);
        String allFieldApi = getAllFieldsOfObject(childObjectName);
        String refValue = ' = \'' + recId + '\'';
        List<sobject> dataList = new List<sobject>(); 
        //system.debug('Select ' + allFieldApi + ' From '+ childObjectName +' where ' + parentObjectName + refValue);
        dataList = Database.query('Select ' + allFieldApi + ' From '+ childObjectName +' where ' + parentObjectName + refValue + 'AND Name IN : objectFieldNames');
        //system.debug('dataList ::: ' + dataList);
        return dataList;
    }
        
            @AuraEnabled
    public static List<List<String>> getObjectFieldsAndFieldTypes(String objectName)
    {              
        List<List<String>> resultList = new List<List<String>>();
        
        List<String> mappingObjectFieldsList = new List<String>();
		List<String> mappingObjectFieldsTypeList = new List<String>();  
                
        
        mappingObjectFieldsList = getAllFieldsNameList(objectName);
        
        Map<string,SObjectField> fList = schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap();
        Map<String,String> fieldAndTypeMap = new Map<String,String>();
        for(String fieldName : mappingObjectFieldsList)
        {
            mappingObjectFieldsTypeList.add( '{\"'+fieldName+'\":\"'+ String.valueOf(fList.get(fieldName).getDescribe().getType())+'\"}');
        }		
        resultList.add(mappingObjectFieldsList);              
        resultList.add(mappingObjectFieldsTypeList);              
        
        return resultList;
    }

    /******************************** Contract Rule - Mapping Rule methods ********************************/
    
    
    @AuraEnabled
    public static void saveMappingRules(List<Mapping_Rule__c> mappingRulesList)
    {      
        UPSERT mappingRulesList;
    }
    
    @AuraEnabled
    public static void saveResponseRules(List<Response_Rule__c> responseRulesList)
    {      
        UPSERT responseRulesList;
    }
    
    @AuraEnabled
    public static void deleteMappingRules(Mapping_Rule__c mappingRule)
    {      
        DELETE mappingRule;
    }
    @AuraEnabled
    public static void deleteResponseRules(Response_Rule__c responseRule)
    {      
        DELETE responseRule;
    }
    /**********************************Field Selector starts******************************************************/
    
    global static Map<String,List<String>> mappingObjectDetails = new Map<String,List<String>>();     
    
    @AuraEnabled 
    global static void getmappingObjectsFieldsDetails() {  
        //system.debug('In getmappingObjectDetails');
        //Map<String,List<String>> mappingObjectDetails = new Map<String,List<String>>();
        List<sObject> mappingObjectList = getDataList('Mapping_Object__c',null);
        List<sObject> mappingObjectFieldsList = getDataList('Mapping_Object_Field__c',null);
        
        for(sObject obj : mappingObjectList)
        {
            List<String> objFieldNameList = new List<String>();            
            for(sObject objField : mappingObjectFieldsList)
            {
                if(objField.get('Object__c') == obj.get('Id'))
                    objFieldNameList.add(String.valueOf(objField.get('Name')));          
            }
            
            mappingObjectDetails.put(String.valueOf(obj.get('Name')),objFieldNameList);
        }
        
        
        for(String ss : mappingObjectDetails.keySet())
        {
            //system.debug('ss ::: ' + ss);
            for(String ofields : mappingObjectDetails.get(ss))
            {
                //system.debug('ofields ::: ' + ofields);
            }
        }
        mappingObjectDetails = mappingObjectDetails;        
        //return mappingObjectDetails;
    }
        
    @AuraEnabled 
    global static List<String> getFieldsForFieldSelector(String objectName) {  
        List<String> objectData = new List<String>();
        //get the fields
        //List<List<sObject>> mappingObjectDetails = getMappingObjectAndFieldsDetails(objectName,'Salesforce','REFERENCE');
        //List<sObject> mappingObjectFieldsList = mappingObjectDetails[1];
        getmappingObjectsFieldsDetails();
        //selected object fields as a list divided by - 
        List<String> baseObjectfields = new List<String>();
        //selected Object lookup information as a map
        Map<String,String> lookupInformation = new Map<String,String>();
        //referred parent objects in the selected Object
        Set<string> referenceObjects = new Set<String>();
        //reference object labels
        Map<String,String>  referenceObjectsLabelsBase = new Map<String,String> ();
        //system.debug(mappingObjectDetails);
        List<String> alreadyDeclaredFields = new List<String>();
        if(mappingObjectDetails.get(String.valueOf(objectName)) != null){
            alreadyDeclaredFields = mappingObjectDetails.get(String.valueOf(objectName));
        }
        //system.debug('alreadyDeclaredFields');
        //system.debug(alreadyDeclaredFields);
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.SObjectType objectSchema = schemaMap.get(objectName);	
        List<Schema.SObjectField> fieldMap = objectSchema.getDescribe().fields.getMap().values();
        for(Schema.SObjectField field :fieldMap) 
        {	
            Schema.DescribeFieldResult fieldData = field.getDescribe();
            //system.debug('alreadyDeclaredFields L ::: '+alreadyDeclaredFields);
            //system.debug('fieldData.getName() L ::: '+fieldData.getName());
            //system.debug('fieldData.getType() L ::: '+fieldData.getType());
            //system.debug('Schema.DisplayType.REFERENCE L ::: '+Schema.DisplayType.REFERENCE);
            if(fieldData.getType() == Schema.DisplayType.REFERENCE && alreadyDeclaredFields.contains(fieldData.getName())){
                //system.debug(fieldData.getLabel());
                List<Schema.sObjectType> referenceToObjects=fieldData.getReferenceTo();
                //system.debug(referenceToObjects);
                if(referenceToObjects.size() == 1 && String.valueOf(referenceToObjects[0]) != 'user' && String.valueOf(referenceToObjects[0]) != 'Pricing_Template__c'){
                    String relationshipName=fieldData.getRelationshipName();
                    if(relationshipName != null && relationshipName != 'null')
                    {
                        String referenceFieldName = String.valueOf(referenceToObjects[0]);
                        referenceObjects.add(referenceFieldName);
                        lookupInformation.put(fieldData.getName(),referenceFieldName+'-01');
						referenceObjectsLabelsBase.put(referenceFieldName+'-01', referenceFieldName);	                        
                        baseObjectfields.add(fieldData.getLabel() + ' >--' + fieldData.getName() +'--' +fieldData.getType() + '--'+ relationshipName);
                    }                    
                }
                else{
                    baseObjectfields.add(fieldData.getLabel() + '--' + fieldData.getName() +'--' +fieldData.getType());
                }
            }
            else{
                if((objectName == 'Pricing__c' || objectName == 'Price_Book_Pricing__c' )&& fieldData.getType() == Schema.DisplayType.TEXTAREA){
                    //do nothing
                }else{
                    baseObjectfields.add(fieldData.getLabel() + '--' + fieldData.getName() +'--' +fieldData.getType());
                }
            }
        }
        List<String> referenceObjectList = new List<String>(referenceObjects);//referenceObjects
        //first level parents
        retriveFieldsLevelOne(referenceObjectList);//getting the data from the first level parents
        
        retriveFieldsLevelTwo(referenceObjectsGlobal); // getting the data from the second level parents
        
        Map<String,List<String>> fieldInformation = new Map<String,List<String>>();
        fieldInformation.put(objectName,baseObjectfields);
        //system.debug(fieldInformation.get('Opportunity'));
        fieldInformation.putAll(fieldInformationGlobal);
        fieldInformation.putAll(fieldInformationGlobalTwo);
        fieldInformation.putAll(retriveFieldsLevelThree(referenceObjectsGlobalTwo));
        objectData.add(JSON.serialize(fieldInformation));
        
        //system.debug(fieldInformation.get('Opportunity'));
        
        Map<String,Map<String,String>> lookupDetails = new Map<String,Map<String,String>>();
        lookupDetails.put(objectName,lookupInformation);
        lookupDetails.putAll(lookupDetailsGlobal);
        lookupDetails.putAll(lookupDetailsGlobalTwo);
        objectData.add(JSON.serialize(lookupDetails));
        
        //referenceObjectList.addAll(referenceObjectsGlobal);
        
        Map<String,String> objectNames = new Map<String,String>();
        //objectNames = retriveObjectNames(referenceObjectList);
        objectNames.put(objectName,objectSchema.getDescribe().getLabel().toUppercase());
        objectNames.putAll(referenceObjectsLabelsBase);
        objectNames.putAll(referenceObjectsLabelOne);
        objectNames.putAll(referenceObjectsLabelTwo);
        objectData.add(JSON.serialize(objectNames));
        
        return objectData;        
    }    
    
    global static Map<String,List<String>> fieldInformationGlobal = new Map<String,List<String>>(); 
    global static Map<String,Map<String,String>> lookupDetailsGlobal = new Map<String,Map<String,String>>();
    global static List<String>  referenceObjectsGlobal = new List<String> (); 
    global static Map<String,String>  referenceObjectsLabelOne = new Map<String,String> ();
    
    global static void retriveFieldsLevelOne(List<String> objectNames) {
        Map<String,List<String>> fieldDetails = new Map<String,List<String>>();
        Map<String,Map<String,String>> lookupDetails = new Map<String,Map<String,String>>();
        Set<string> referenceObjects = new Set<String>();
        for(String objectName : objectNames){
            //get the fields
            List<String> baseObjectfields = new List<String>();
            Map<String,String> lookupInformation = new Map<String,String>();
            Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
            Schema.SObjectType objectSchema = schemaMap.get(objectName);	
            List<Schema.SObjectField> fieldMap = objectSchema.getDescribe().fields.getMap().values();
            for(Schema.SObjectField field :fieldMap) 
            {	
                Schema.DescribeFieldResult fieldData = field.getDescribe();
                if(fieldData.getType() == Schema.DisplayType.REFERENCE){
                    List<Schema.sObjectType> referenceToObjects=fieldData.getReferenceTo();
                    if(referenceToObjects.size() == 1 && String.valueOf(referenceToObjects[0]) != 'user' && String.valueOf(referenceToObjects[0]) != 'Pricing_Template__c'){
                        String relationshipName=fieldData.getRelationshipName();
                        if(relationshipName != null && relationshipName != 'null')
                        {
                            String referenceFieldName = String.valueOf(referenceToObjects[0]);
                            referenceObjects.add(referenceFieldName);
                            lookupInformation.put(fieldData.getName(),referenceFieldName+'-02');
                            referenceObjectsLabelOne.put(referenceFieldName+'-02',referenceFieldName);
                            baseObjectfields.add(fieldData.getLabel() + ' >--' + fieldData.getName() +'--' +fieldData.getType() + '--'+ relationshipName);
                        }
                    }
                    else{
                        baseObjectfields.add(fieldData.getLabel() + '--' + fieldData.getName() +'--' +fieldData.getType());
                    }
                }
                else{
                    if((objectName == 'Pricing__c' || objectName == 'Price_Book_Pricing__c') && fieldData.getType() ==Schema.DisplayType.TEXTAREA){
                        //do nothing
                    }else{
                        baseObjectfields.add(fieldData.getLabel() + '--' + fieldData.getName() +'--' +fieldData.getType());
                    }
                }
            }
            fieldDetails.put(objectName +'-01',baseObjectfields);
            lookupDetails.put(objectName + '-01',lookupInformation);
        }
        List<String> referenceObject = new List<String>(referenceObjects);
        fieldInformationGlobal = fieldDetails;
        lookupDetailsGlobal = lookupDetails;
        referenceObjectsGlobal = referenceObject;
    }
    
    global static Map<String,List<String>> fieldInformationGlobalTwo = new Map<String,List<String>>(); 
    global static Map<String,Map<String,String>> lookupDetailsGlobalTwo = new Map<String,Map<String,String>>();
    global static List<String>  referenceObjectsGlobalTwo = new List<String> ();
    global static Map<String,String>  referenceObjectsLabelTwo = new Map<String,String> ();
    
    public static void retriveFieldsLevelTwo(List<String> objectNames) {
        
        Map<String,List<String>> fieldDetails = new Map<String,List<String>>();
        Map<String,Map<String,String>> lookupDetails = new Map<String,Map<String,String>>();
        Set<string> referenceObjects = new Set<String>();
        
        for(String objectName : objectNames){
            List<String> baseObjectfields = new List<String>();
            Map<String,String> lookupInformation = new Map<String,String>();
            Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
            Schema.SObjectType objectSchema = schemaMap.get(objectName);	
            List<Schema.SObjectField> fieldMap = objectSchema.getDescribe().fields.getMap().values();
            for(Schema.SObjectField field :fieldMap) 
            {	
                Schema.DescribeFieldResult fieldData = field.getDescribe();
                if(fieldData.getType() == Schema.DisplayType.REFERENCE){
                    List<Schema.sObjectType> referenceToObjects=fieldData.getReferenceTo();
                    String referenceFieldName = String.valueOf(referenceToObjects[0]);
                    if(referenceToObjects.size() == 1 && referenceFieldName == objectName){
                        String relationshipName=fieldData.getRelationshipName();
                        if(relationshipName != null && relationshipName != 'null')
                        {
                            referenceObjects.add(referenceFieldName);
                            lookupInformation.put(fieldData.getName(),referenceFieldName+'-1');
                            baseObjectfields.add(fieldData.getLabel() + ' >--' + fieldData.getName() +'--' +fieldData.getType() + '--'+ relationshipName);
                            referenceObjectsLabelTwo.put(referenceFieldName+'-1',referenceFieldName.toUppercase());
                        }
                    }
                }
                else{
                    baseObjectfields.add(fieldData.getLabel() + '--' + fieldData.getName() + '--' + fieldData.getType());
                }
            }
            fieldDetails.put(objectName+'-02',baseObjectfields);
            lookupDetails.put(objectName+'-02',lookupInformation);
        }
        List<String> referenceObject = new List<String>(referenceObjects);
        fieldInformationGlobalTwo = fieldDetails;
        lookupDetailsGlobalTwo = lookupDetails;
        referenceObjectsGlobalTwo = referenceObject;
    }
    
    public static Map<String,List<String>> retriveFieldsLevelThree(List<String> objectNames) {
        Map<String,List<String>> fieldDetails = new Map<String,List<String>>();
        for(String objectName : objectNames){
            List<String> baseObjectfields = new List<String>();
            Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
            Schema.SObjectType objectSchema = schemaMap.get(objectName);	
            List<Schema.SObjectField> fieldMap = objectSchema.getDescribe().fields.getMap().values();
            for(Schema.SObjectField field :fieldMap) 
            {	
                Schema.DescribeFieldResult fieldData = field.getDescribe();
                baseObjectfields.add(fieldData.getLabel() + '--' + fieldData.getName() + '--' + fieldData.getType());
            }
            fieldDetails.put(objectName+'-1',baseObjectfields);
        }
        return fieldDetails;
    }
    
    public static Map<String,String> retriveObjectNames(List<String> objectNames) {
        Map<String,String> fieldDetails = new Map<String,String>();
        for(String objectName : objectNames){
            Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
            Schema.SObjectType objectSchema = schemaMap.get(objectName);	
            fieldDetails.put(objectName,objectSchema.getDescribe().getLabel().toUppercase());
        }
        return fieldDetails;
    }
    
   /**********************************Field Selector ends******************************************************/
    @AuraEnabled 
    public static Map<String,List<sObject>> createNewIntegrationMapping(String objectName, String recId) 
    {       
        Map<String,List<sObject>> allRequiredData = new Map<String,List<sObject>>();
        List<String> targetPickListValues = new List<String>();                         
        targetPickListValues = getAllPickListValues('Integration_Mapping__c','Target_Datastore__c');
        List<sObject> targetPickListValuesList = new List<sObject>();
        List<sObject> dataRecords = new List<sObject>();
        List<sObject> userInfolist = new List<sObject>();
        List<sObject> IntegrationMappinglist = new List<sObject>();
        
        IntegrationMappinglist = getDataList('Integration_Mapping__c', null);
        for(String td : targetPickListValues)
        {
            sObject sobjValue = new Integration_Mapping__c();
            sobjValue.put('Target_Datastore__c', td);
            targetPickListValuesList.add(sobjValue);
        }
        
        List<SObject> allButtonsList = new List<SObject>();
        allButtonsList = getDataList('WebLink', null);
        
        List<sObject> allMappingObjectList = getDataList('Mapping_Object__c', null);
        
        
        List<sObject> allMCandCRList = [SELECT Name,Target_Object__c,Source_Object__c,Rule_Order__c, Mapping_Contract__r.Name,Mapping_Contract__r.Source_Datastore__c,Mapping_Contract__r.Target_Datastore__c 
                                        FROM Contract_Rule__c 
                                        where Mapping_Contract__r.Active__c = true and Mapping_Contract__r.Job_Type__c ='Realtime Sync' ORDER BY Rule_Order__c];
        if(recId!=null){
            //system.debug('Rec Idddddddddd ::: ' + recId);
            
            dataRecords = getDataList(objectName, recId);
            //system.debug('dataRecordsssssssssssssssssss ::: ' + dataRecords);
            //system.debug('dataRecordsssssssssssssssssss ::: ' + dataRecords.size());
            for(sObject obj : dataRecords)
            {
                //system.debug('In obj ::: ' + obj);
            }
            userInfolist =  getDataList('User', String.valueOf(dataRecords[0].get('createdbyid')));
            //system.debug('userInfolist ::: ' + userInfolist);
        }                
        
        allRequiredData.put('TargetDatasore', targetPickListValuesList);
        allRequiredData.put('Objects', allMappingObjectList);
        allRequiredData.put('Buttons', allButtonsList);
        allRequiredData.put('MappingContracts', allMCandCRList);
        if(dataRecords.size()>0){            
            allRequiredData.put('IntegrationMappings', dataRecords);
            //system.debug('List Size :::: '+ (allRequiredData.get('IntegrationMappings')).size());            
            allRequiredData.put('UserInfo', userInfolist);
        }
        allRequiredData.put('IntegrationMappinglist', IntegrationMappinglist);
        allRequiredData.put('timeZone',getOrgTimeZone());
        return allRequiredData;
    }
    @AuraEnabled 
    public static Id saveIntegrationMappingDetails(Integration_Mapping__c IntegrationMapping) 
    {      
        UPSERT IntegrationMapping;
        return IntegrationMapping.Id;
    }
    @AuraEnabled 
    public static List<String> getQuickActionsList(String objectName) 
    { 
        List<String> quickActionList = new List<String>();
        
        List<QuickAction.DescribeAvailableQuickActionResult> result1 = QuickAction.DescribeAvailableQuickActions(objectName);  
        
        for(QuickAction.DescribeAvailableQuickActionResult result : result1)
        {
            if(result.getLabel()!= 'Schedule Appointment')
                quickActionList.add(result.getName() + ' - '+result.getLabel());
        }
        
        return quickActionList;
    }
    @AuraEnabled
    public static void deleteIntegrationMapping(Integration_Mapping__c mappingDetail){
        DELETE mappingDetail;
        
    }
    // Get Integration mapping and mapping contracts and contract rules
    @AuraEnabled
    public static List<List<sObject>> getIntegrationMappingDetails(String objectName, String recId) 
    {
        //system.debug('In getMappingContractAndContractRule');
        List<Mapping_Contract__c> mappingContractDetailsList = getDataList(objectName, recId);       
        List<Integration_Mapping__c> integrationMappingList = getDataList('Integration_Mapping__c',null);
        List<List<sObject>> resultList = new List<List<sObject>>();        
        resultList.add(mappingContractDetailsList);        
        resultList.add(integrationMappingList);
        return resultList;
    }
    
    public Static List<Sobject> getOrgTimeZone (){
        return [SELECT Id, TimeZoneSidKey FROM Organization];
    }
    
    @AuraEnabled
    public static Job__c getJob (Id recordId){
        return [Select 
                Id, 
                Job_Type__c, 
                Time__c, 
                Day__c, 
                minutes__c,
                Start_Date__c,
                End_Date__c,
                Cron_Expression__c,
                Active__c	
                From 
                Job__c 
                Where Id=: recordId];
    }
    
    @AuraEnabled
    public static void updateJob (Job__c record){
        update record;
    }
    
    @AuraEnabled
    public static void makeCalloutFromQuickAction (String recordId, String sObjectName){
       List<Integration_Mapping__c> actionMappings = [ Select Button__c,Contract_Rule__c,Mapping_Contract__c,Name,Record_Type__c,Source_Datastore__c,Source_Object__c,Target_Datastore__c,Target_Object__c From Integration_Mapping__c where Source_Object__c =: SObjectName];
       SyncRecord.executeContractRule(sObjectName,recordId);
    }
    
    /***************** Conditions Methods**************************/
    
    //M1
    @AuraEnabled
    public static List<Contract_Rule__c> getContractRuleRecord(Id recordId) {
        Contract_Rule__c nopTemplatesRecord = [SELECT
                                                             Id, 
                                                             Name, 
                                                             Conditions__c,
                                                             Source_Object__c,
                                                             Mapping_Contract__r.Source_Datastore__c
                                                             FROM Contract_Rule__c
                                                             WHERE Id = :recordId];
        
        Contract_Rule__c fieldDetails = new Contract_Rule__c();
        if(nopTemplatesRecord.Mapping_Contract__r.Source_Datastore__c != 'Salesforce'){
            wrapperClass wc =  getObjectFieldsSAP(nopTemplatesRecord.Source_Object__c);
            fieldDetails.Conditions__c= JSON.serialize(wc);
        }else{
            wrapperClass wc =  getObjectFields(nopTemplatesRecord.Source_Object__c);
            fieldDetails.Conditions__c= JSON.serialize(wc);
        }
        List<Contract_Rule__c> nopTemplatesRecords =  new List<Contract_Rule__c>();
        nopTemplatesRecords.add(nopTemplatesRecord);
        nopTemplatesRecords.add(fieldDetails);
        return nopTemplatesRecords;
    }
    
    //M2
    public class wrapperClass
    {
        @auraEnabled public  List<String> objectFields {get; set;}       
        @auraEnabled public  Map<String,List<String>> allPicklistValues{get; set;} 
        
        public wrapperClass(List<String> finalObjectFields,Map<String,List<String>> finalPickListValues) 
        {
            this.objectFields = finalObjectFields; 
            this.allPicklistValues = finalPickListValues;
        }
    }
    
    //M3
    @AuraEnabled
    public static wrapperClass getObjectFields(String objectName) {
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.SObjectType objectSchema = schemaMap.get(objectName);
        List<Schema.SObjectField> fieldMap = objectSchema.getDescribe().fields.getMap().values();
        List<String> fieldNames = new List<String>();
        Map<String,List<String>> allPicklistValues = new Map<String,List<String>>();
        
        for(Schema.SObjectField field :fieldMap) {                        
            
            if(String.valueOf(field.getDescribe().getType()).toLowerCase() == 'picklist') 
            {           
                List<String> picklistValues = new List<String>();
                SObjectType objectType = Schema.getGlobalDescribe().get(objectName);
                List<Schema.PicklistEntry> pick_list_values = objectType.getDescribe()
                    .fields.getMap()
                    .get(field.getDescribe().getName())
                    .getDescribe().getPickListValues();
                
                for (Schema.PicklistEntry aPickListValue : pick_list_values) 
                {
                    picklistValues.add(aPickListValue.getValue());                   
                }
                picklistValues.sort();
                allPicklistValues.put(field.getDescribe().getName(),picklistValues); 
            }           
            
            String fieldType;
            switch on String.valueOf(field.getDescribe().getType()) {
                when 'DATETIME' {
                    fieldType = 'datetime';
                }
                when 'TIME' {
                    fieldType = 'time';
                }
                when 'DATE' {
                    fieldType = 'date';
                }
                when 'INTEGER', 'DOUBLE', 'PERCENT', 'CURRENCY' {
                    fieldType = 'number';
                }
                when 'BOOLEAN' {
                    fieldType = 'boolean';
                }
                when 'PICKLIST' {
                    fieldType = 'picklist';
                }
                when else {
                    fieldType = 'text';
                }
            }
            fieldNames.add(field.getDescribe().getLabel() + '-' + field.getDescribe().getName() + '-' + fieldType);
        }
        wrapperClass wc= new wrapperClass(fieldNames,allPicklistValues); 
        return wc;
    }
    
    //M4
    @AuraEnabled
    public static void saveNOPTemplatesRecord(Contract_Rule__c record) {
        update record;
    }
    
    //M5
    @AuraEnabled
    public static wrapperClass getObjectFieldsSAP(String objectName) {
        List<Mapping_Object_Field__c> objectFields = [SELECT Name, Object__r.Name FROM Mapping_Object_Field__c where Object__r.Name =:objectName];
        List<String> fieldNames = new List<String>();
        Map<String,List<String>> allPicklistValues = new Map<String,List<String>>();
        for(Mapping_Object_Field__c field : objectFields) {                        
            fieldNames.add(field.Name + '-' + field.Name + '-' + 'text');
        }
        wrapperClass wc= new wrapperClass(fieldNames,allPicklistValues); 
        return wc;
    }
    
    /**************** Conditions Methods Ends **********************/
    
   
}