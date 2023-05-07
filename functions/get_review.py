# from cloudant.client import Cloudant
# from cloudant.error import CloudantException

from ibmcloudant.cloudant_v1 import CloudantV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

def main(dict):
    """
    Gets the car reviews for a specified dealership
    :param dict: Cloud Functions actions accept a single parameter, which must be a JSON object.
                In this case, the param must be an a JSON object with the key "dealerId" with the dealership id as value (string or int)
                I.e: {"dealerId": "15"}
    :return: The action returns a JSON object consisting of the HTTP response with all reviews for the given dealership.
    """
    
    # secret = {
    #     "URL": "https://a7637d95-13fd-4d36-bd33-c43326d44b48-bluemix.cloudantnosqldb.appdomain.cloud",
    #     "IAM_API_KEY": "KvcAgqnvLvK8TRAqUujdAmrtR8mVwTjK2yHxDBDU9GQ1",
    #     "ACCOUNT_NAME": "a7637d95-13fd-4d36-bd33-c43326d44b48-bluemix",
    # }

    # client = Cloudant.iam(
    #     account_name=secret["ACCOUNT_NAME"],
    #     api_key=secret["IAM_API_KEY"],
    #     url=secret["URL"],
    #     connect=True,
    # )
    
    authenticator = IAMAuthenticator('NxrNCPOSNqgQjTBTlFOvUzjb7pz9ImEMOykbPlx3CWbU')
    client = CloudantV1(authenticator=authenticator)
    client.set_service_url('https://c3d24601-04aa-47ac-9d10-306ba2242d09-bluemix.cloudantnosqldb.appdomain.cloud')

    my_database = client.get_database_information(db='reviews').get_result()
    print(my_database)

    try:
        selector = {'dealership': {'$eq': int(dict["dealerId"])}}
        result_by_filter = my_database.get_query_result(
            selector, raw_result=True)

        result = {
            'headers': {'Content-Type': 'application/json'},
            'body': {'data': result_by_filter}

        }
        return result
    except:

        return {
            'statusCode': 404,
            'message': "Something went wrong"
        }
