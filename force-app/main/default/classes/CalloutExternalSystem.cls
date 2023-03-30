/*********************************************************************************************************************************************************************************************************
Company 					: HTC Global Services
Developer 					: Arunkumar V K
Description					: Web services class to upload JSON request data
Related Aura Components   	: 
Related Apex Controllers  	: 
Created Date		  		: May 07, 2021
Last Modified Date	  		: May 07, 2021
**********************************************************************************************************************************************************************************************************/


public class CalloutExternalSystem {
    
    Public static list<String> dataUpload(String jsonData,String method, String endPointURL, String namedCredential){
        list<String> responseList = new list<String>();
        system.debug('endPointURL'+endPointURL);
        HttpRequest req = new HttpRequest();
        req.setHeader('Content-Type','application/json;charset=UTF-8');
        req.setHeader('accept','application/json');
        req.setEndpoint(endPointURL);
        //req.setEndpoint('callout:'+namedCredential);
        //req.setBody(EncodingUtil.base64Encode(Blob.valueOf(jsonData))); 
        req.setBody(jsonData); 
        req.setMethod(method);
        Http http = new Http();
      /*  HttpResponse res = http.send(rhttps://sfconnector-dev-ed.my.salesforce.com/_ui/common/apex/debug/ApexCSIPage#eq);
        system.debug('res'+res);
        responseList.add(res.getStatus());
        system.debug('res.getStatus'+res.getStatus());
        responseList.add(String.valueOf(res.getStatusCode()));
        system.debug('res.getStatusCode'+String.valueOf(res.getStatusCode()));
        responseList.add(res.getBody());
        system.debug('res.getBody'+res.getBody());*/
        //fake response
        //System.debug('endPointURL check'+endPointURL);
        HttpResponse res ; 
        if(endPointURL!=null&&endPointURL!=''){
            responseList.add('success');
            responseList.add('200');
            responseList.add('Request Initiated Successfully');
        }
        else{
            responseList.add('error');
            responseList.add('400');
            responseList.add('Failed');
        }
        return responseList; 
    }
       
}