public class CustomMetadataCallback implements Metadata.DeployCallback {
    public void handleResult(Metadata.DeployResult result,
                             Metadata.DeployCallbackContext context) {
                 System.debug('result ' + result);
                 System.debug(' context  '+ context);               
                                 if (result.status == Metadata.DeployStatus.Succeeded) {
                                     System.debug('success: '+ result);
                                     
                                 } else {
                                     // Deployment was not successful
                                     System.debug('fail: '+ result);
                                 }
                             }
}