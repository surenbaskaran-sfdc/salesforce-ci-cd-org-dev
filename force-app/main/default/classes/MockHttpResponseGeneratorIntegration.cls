@isTest
global class MockHttpResponseGeneratorIntegration implements HttpCalloutMock {
    global HTTPResponse respond(HTTPRequest req) {
        // Create a fake response
        System.debug('fake response'+req.getEndpoint());
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');  
        if(req.getEndpoint()!=''&&req.getEndpoint()!=null&&req.getEndpoint()!='null'){
            res.setStatusCode(200);
            res.setStatus('success');
            res.setBody('File Uploaded Successfully');
        }
        else{
            res.setStatusCode(400);
            res.setStatus('error');
            res.setBody('Failed');
        }
        return res;
    }
}