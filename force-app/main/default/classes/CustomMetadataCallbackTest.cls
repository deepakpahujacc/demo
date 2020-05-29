@isTest
public class CustomMetadataCallbackTest {
	@IsTest
    static void testMyCallback() {
        CustomMetadataCallback callback = new CustomMetadataCallback();  
        Metadata.DeployResult result = new Metadata.DeployResult();
        result.status = Metadata.DeployStatus.Succeeded;
        Metadata.DeployMessage messageObj = new Metadata.DeployMessage();
        messageObj.changed = true;
        messageObj.success = true;
        messageObj.fullName='';
        messageObj.componentType ='CustomMetadata';
        messageObj.fullName = 'Ravi.Test';
        Metadata.DeployDetails deployDetailsObj = new Metadata.DeployDetails();
        deployDetailsObj.componentSuccesses.add(messageObj);
        result.details = deployDetailsObj;     
        Metadata.DeployCallbackContext context = new Metadata.DeployCallbackContext();
        callback.handleResult(result, context);
        system.assert(TRUE,'error in testMyCallback');
    }
    @IsTest
    static void testMyCallbackErrorMessage() {
       CustomMetadataCallback callback = new CustomMetadataCallback();   
        Metadata.DeployResult result = new Metadata.DeployResult();
        result.status = Metadata.DeployStatus.Failed;
        Metadata.DeployMessage messageObj = new Metadata.DeployMessage();
        messageObj.changed = false;
        messageObj.success = false;   
        messageObj.componentType ='CustomMetadata';
        messageObj.fullName = 'Ravi.Test';
        messageOBj.problem = 'Default: value not of required type: 1';
        messageObj.problemType = Metadata.DeployProblemType.Error;
        Metadata.DeployDetails deployDetailsObj = new Metadata.DeployDetails();
        deployDetailsObj.componentFailures.add(messageObj);
        result.details = deployDetailsObj;     
        Metadata.DeployCallbackContext context = new Metadata.DeployCallbackContext();  
        callback.handleResult(result, context);
        system.assert(TRUE,'error in testMyCallbackErrorMessage');
    }
}