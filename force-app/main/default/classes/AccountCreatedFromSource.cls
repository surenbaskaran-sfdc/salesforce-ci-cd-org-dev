public class AccountCreatedFromSource {

    public class deserializeResponse{

        public String id;

        public String access_token;

    }

    @future(callout=true)

    public static void createAccountinTargetOrg(String accName, String accId){ 

        String clientId = '3MVG9n_HvETGhr3B_QKLDQT7oAmaNdUntXQlNoDxltN4xYCNOjebXcIh6MBIXQHbWCjr2B_rJ8aiLP60Eme52';//your consumer Key

        String clientSecret = 'D0886C8E5FB07811F0AC0810FB12A693258FF6A18DE8DA0F0F9DA73021678BED';//your consumer secret

        String username = 'vikash.ganesan@empathetic-wolf-8z7qmj.com';

        String password = 'Amma@appa123';

        String reqbody = 'grant_type=password&client_id='+clientId+'&client_secret='+clientSecret+'&username='+username+'&password='+password;

        Http h = new Http();

        HttpRequest req = new HttpRequest();

        req.setBody(reqbody);

        req.setMethod('POST');

       	req.setEndpoint('https://empathetic-wolf-8z7qmj-dev-ed.trailblaze.my.salesforce.com');

        HttpResponse res = h.send(req);

        deserializeResponse resp1 = (deserializeResponse)JSON.deserialize(res.getbody(),deserializeResponse.class);

        if(resp1.access_token != null){

            String endPoint = 'https://empathetic-wolf-8z7qmj-dev-ed.trailblaze.my.salesforce.com/services/apexrest/createAccount/';

            String jsonstr = '{"AccName" : "' + accName + '"}';

            Http h2 = new Http();

            HttpRequest req1 = new HttpRequest();

            req1.setHeader('Authorization','Bearer' + resp1.access_token);

            req1.setHeader('Content-Type','application/json');

            req1.setHeader('accept','application/json');

            req1.setBody(jsonstr);

            req1.setMethod('POST');

            req1.setEndpoint(endPoint);

            HttpResponse res1 = h2.send(req1);

        }

    }

}