/*********************************************************************************************************************************************************************************************************
Company 					: HTC Global Services
Developer 					: Arunkumar V K
Description					: update response data fields
Related Aura Components   	: 
Related Apex Controllers  	: 
Created Date		  		: June 04, 2021
Last Modified Date	  		: June 04, 2021
**********************************************************************************************************************************************************************************************************/

public class ResponseRuleExecution {
    
    public static Boolean updateResponseData(String responseData,String contractRuleId,String objectName,List<sObject> recordList){
        
        System.debug('responseData'+responseData);
        System.debug('contractRuleId'+contractRuleId);
        System.debug('recordList'+recordList);
        //fetch response rule for current contract rule
        List<Response_Rule__c> responseRuleList=[SELECT Id,Contract_Rule__c,Dev_value__c,Source_Object_Fields__c,
                                                               Target_Field__c FROM Response_Rule__c WHERE Contract_Rule__c=:contractRuleId];
        if(responseRuleList.size()>0&&responseData!='Record Synced Successfully'){
            try{
                Object resJsonData = (Object)JSON.deserializeUntyped(responseData);
                String res_datetime = (String)((Map<String, Object>)resJsonData).get('res_datetime');
                String Status = (String)((Map<String, Object>)resJsonData).get('status');
                String message = (String)((Map<String, Object>)resJsonData).get('message');
                Map<String, Object> resData = (Map<String, Object>)((Map<String, Object>)resJsonData).get('data'); 
                System.debug('resData'+resData);
                List<Map<String, Object>> objectMapList = new List<Map<String, Object>>();
                List<Object> objectDataList=(List<Object>)resData.get(objectName); 
                System.debug('objectDataList '+objectDataList);
                if(objectDataList!=null){
                    for(Integer i=0;i<objectDataList.size();i++){
                        Map<String, Object> currentObject = (Map<String, Object>)objectDataList[i];
                        objectMapList.add(currentObject);
                    }
                    System.debug('objectMapList '+objectMapList);
                    
                    //update records based on contract rule
                    List<sObject> updateRecordList=new List<sObject>();
                    Map<string,SObjectField> fList = schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap();                        
                    //record list iteration
                    for(Integer i=0;i<recordList.size();i++){
                        Boolean isUpdateFound=false;
                        sObject currentObject=recordList[i];
                        if(objectMapList.size()>i){
                            Map<String, Object> currentObjectResponseMap=objectMapList[i];
                            //iterate response rule list
                            for(Integer j=0;j<responseRuleList.size();j++){
                                String targetField=responseRuleList[j].Target_Field__c;
                                String tempsourceField=responseRuleList[j].Source_Object_Fields__c;
                        		String sourceField=tempsourceField;
                                if(tempsourceField.startsWith('["') && tempsourceField.endsWith('"]')){
                                	sourceField=tempsourceField.substringBetween('"');
                                }
                                String targetFieldType = String.valueOf(fList.get(targetField).getDescribe().getType());
                                //check json has source field or not
                                if(currentObjectResponseMap.containsKey(sourceField)){
                                    isUpdateFound=true;
                                    String value=String.valueOf(currentObjectResponseMap.get(sourceField));
                                    if(value != null && value != '')
                                    {                            
                                        switch on targetFieldType
                                        {
                                            when 'REFERENCE'
                                            {                                    
                                                currentObject.put(targetField, value);
                                            }
                                            when 'CURRENCY'
                                            {                                                                        
                                                Decimal currencyValue = Decimal.valueOf(!String.isEmpty(value) ? value : '0');
                                                currencyValue = currencyValue.setScale(4, RoundingMode.HALF_EVEN);
                                                currentObject.put(targetField, currencyValue );
                                            }                            
                                            when 'NUMBER','PERCENT','DOUBLE'
                                            {                                    
                                                currentObject.put(targetField, Decimal.valueOf(value));
                                            }                                
                                            when 'BOOLEAN'
                                            {                                    
                                                currentObject.put(targetField, Boolean.valueOf(value));
                                            }                                
                                            when 'DATE'
                                            {                                    
                                                currentObject.put(targetField, Date.valueOf(value) );
                                            }
                                            when 'STRING','TEXT','TEXTAREA','EMAIL','URL','PICKLIST','ID','COMBOBOX'
                                            {                                    
                                                currentObject.put(targetField, value );
                                            }
                                        }
                                    }
                                    else
                                    {
                                        switch on targetFieldType
                                        {
                                            when 'REFERENCE'
                                            {
                                                currentObject.put(targetField, value);                                   
                                            }
                                            when 'CURRENCY'
                                            {                                                 
                                                currentObject.put(targetField, 0 );                                   
                                            }                            
                                            when 'NUMBER','PERCENT','DOUBLE'
                                            {           
                                                currentObject.put(targetField, 0);
                                            }
                                            when 'BOOLEAN'
                                            {                                            
                                                currentObject.put(targetField, false);                
                                            }                                
                                            when 'DATE'
                                            {
                                                currentObject.put(targetField, Date.valueOf(value) );                                    
                                            }
                                            when 'STRING','TEXT','TEXTAREA','EMAIL','URL','PICKLIST','ID','COMBOBOX'
                                            {                                            
                                                currentObject.put(targetField, value );                               
                                            }
                                        }                                
                                    }
                                }//source field exist
                            }//response rule list iteration end
                            if(isUpdateFound){
                                updateRecordList.add(currentObject);
                            }
                        }//json exist for recordindex
                    }//record list iteration end
                    if(updateRecordList.size()>0){
                        update updateRecordList;
                    }
                }//current object exist in json
                return true;
            }
            catch(Exception e){
                System.debug('error'+e.getMessage());
                return false;
            }
        }
        else{
            return true;
        }
    }
}