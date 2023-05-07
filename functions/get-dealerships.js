/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {
    secret = {
    "COUCH_URL": "https://c3d24601-04aa-47ac-9d10-306ba2242d09-bluemix.cloudantnosqldb.appdomain.cloud",
    "IAM_API_KEY": "NxrNCPOSNqgQjTBTlFOvUzjb7pz9ImEMOykbPlx3CWbU",
    "COUCH_USERNAME": "c3d24601-04aa-47ac-9d10-306ba2242d09-bluemix"
    };

    return new Promise(function (resolve, reject) {
        // const Cloudant = require('@cloudant/cloudant'); 
        // const cloudant = Cloudant({
        //     url: secret.COUCH_URL,
        //     plugins: {iamauth: {iamApiKey:secret.IAM_API_KEY}} 
        // });
        // const dealershipDb = cloudant.use('dealerships'); 
        
        const { CloudantV1 } = require('@ibm-cloud/cloudant');
        const { IamAuthenticator } = require('ibm-cloud-sdk-core');
        
        const authenticator = new IamAuthenticator({
            apikey: secret.IAM_API_KEY
            
        });
        
        const client = new CloudantV1({
            authenticator: authenticator
            
        });
        client.setServiceUrl(secret.COUCH_URL);
        
        const dealershipDb = client.getDatabaseInformation({db: 'dealerships'}).then(response => {
            console.log(response.result);
            
        });
        
        if (params.dealerId) { 
            // return dealership of specified dealership ID (if specified)
            dealershipDb.find({"selector": {"id": parseInt(params.dealerId)}}, 
                function (err, result) { 
                        if (err) { 
                            console.log(err) 
                            reject(err); 
                        } 
                        let code=200; 
                            if (result.docs.length==0) { 
                                code= 404; 
                            }
                        resolve({ 
                            statusCode: code, 
                            headers: { 'Content-Type': 'application/json' }, 
                            body: result 
                        }); 
                    }); 
        } else if (params.state) { 
            // return dealerships for the specified state (if specified)
            dealershipDb.find({"selector": {"state": {"$eq": params.state}}}, 
                function (err, result) { 
                        if (err) { 
                            console.log(err) 
                            reject(err); 
                        } 
                        let code=200; 
                            if (result.docs.length==0) { 
                                code= 404; 
                            }
                        resolve({ 
                            statusCode: code, 
                            headers: {'Content-Type': 'application/json'}, 
                            body: result 
                        }); 
                    }); 
        } else { 
            // return all documents if no parameters are specified
            dealershipDb.list(
                { include_docs: true }, 
                function (err, result) { 
                    if (err) { 
                        console.log(err) 
                        reject(err); 
                    } 
                    resolve({ 
                        statusCode: 200, 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: result 
                    }); 
                }
            ); 
        } 
    });
}
