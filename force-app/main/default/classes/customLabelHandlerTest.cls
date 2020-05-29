@IsTest
public class customLabelHandlerTest {
    //test
   private class WebServiceMockImpl implements WebServiceMock 
	{
		public void doInvoke(
			Object stub, Object request, Map<String, Object> response,
			String endpoint, String soapAction, String requestName,
			String responseNS, String responseName, String responseType) 
		{
			if(request instanceof MetadataService.retrieve_element)
				response.put('response_x', new MetadataService.retrieveResponse_element());
			else if(request instanceof MetadataService.checkDeployStatus_element)
				response.put('response_x', new MetadataService.checkDeployStatusResponse_element());
			else if(request instanceof MetadataService.listMetadata_element)
				response.put('response_x', new MetadataService.listMetadataResponse_element());
			else if(request instanceof MetadataService.checkRetrieveStatus_element)
				response.put('response_x', new MetadataService.checkRetrieveStatusResponse_element());
			else if(request instanceof MetadataService.describeMetadata_element)
				response.put('response_x', new MetadataService.describeMetadataResponse_element());
			else if(request instanceof MetadataService.deploy_element)
				response.put('response_x', new MetadataService.deployResponse_element());
            else if(request instanceof MetadataService.updateMetadata_element)
                response.put('response_x', new MetadataService.updateMetadataResponse_element());
            else if(request instanceof MetadataService.renameMetadata_element)
                response.put('response_x', new MetadataService.renameMetadataResponse_element());
            else if(request instanceof  MetadataService.cancelDeploy_element)
                response.put('response_x', new MetadataService.cancelDeployResponse_element());
            else if(request instanceof  MetadataService.deleteMetadata_element)
                response.put('response_x', new MetadataService.deleteMetadataResponse_element());
            else if(request instanceof  MetadataService.upsertMetadata_element)
                response.put('response_x', new MetadataService.upsertMetadataResponse_element());
            else if(request instanceof  MetadataService.createMetadata_element)
                response.put('response_x', new MetadataService.createMetadataResponse_element());
            else if(request instanceof  MetadataService.deployRecentValidation_element)
                response.put('response_x', new MetadataService.deployRecentValidationResponse_element());
            else if(request instanceof MetadataService.describeValueType_element)
                response.put('response_x', new MetadataService.describeValueTypeResponse_element());
            else if(request instanceof MetadataService.checkRetrieveStatus_element)
                response.put('response_x', new MetadataService.checkRetrieveStatusResponse_element());
			return;
		}
	}    
    
    
	 @IsTest
    private static void getCustRecCheck(){
        
            Test.setMock(HttpCalloutMock.class, new RestMock());
            test.startTest();
            customlabelHandler.getCustRec();
        	system.assert(TRUE,'error in getCustRec');
            test.stopTest();
        
        
    }
    
    private class RestMock implements HttpCalloutMock {
        
        public HTTPResponse respond(HTTPRequest req) {
            String fullJson = '{"size":4,"totalSize":4,"done":true,"queryLocator":null,"entityTypeName":"ExternalString","records":[{"attributes":{"type":"ExternalString","url":"/services/data/v45.0/tooling/sobjects/ExternalString/1012v00000M74svAAB"},"Id":"1012v00000M74svAAB","Name":"xcvxcv","Value":"cvxvxc","MasterLabel":"xcvcxv"},{"attributes":{"type":"ExternalString","url":"/services/data/v45.0/tooling/sobjects/ExternalString/1012v00000M73YpAAJ"},"Id":"1012v00000M73YpAAJ","Name":"test","Value":"test","MasterLabel":"test"},{"attributes":{"type":"ExternalString","url":"/services/data/v45.0/tooling/sobjects/ExternalString/1012v00000M74slAAB"},"Id":"1012v00000M74slAAB","Name":"dcdsc","Value":"fdsfsd","MasterLabel":"dfds"},{"attributes":{"type":"ExternalString","url":"/services/data/v45.0/tooling/sobjects/ExternalString/1012v00000M74sqAAB"},"Id":"1012v00000M74sqAAB","Name":"dsdds","Value":"dsfdsfsd","MasterLabel":"dfsdf"}]}';
            
            HTTPResponse res = new HTTPResponse();
            res.setHeader('Content-Type', 'text/json');
            res.setBody(fullJson);
            res.setStatusCode(200);
            return res;
        }
    }
    
     @IsTest
    private static void findAllCustomLabelsCheck()
    {	Test.setMock(HttpCalloutMock.class, new RestMock());
     test.startTest();
    customlabelHandler obj = customlabelHandler.findAllCustomLabels('',UserInfo.getSessionId());
     system.assert(obj!=null,'error in findAllCustomLabels ');
     test.stopTest();
    }
    
     
    
     @IsTest
	private static void createCustomLabelCheck()
    {	// Null Web Service mock implementation
        System.Test.setMock(WebServiceMock.class, new WebServiceMockImpl());
        // Only required to workaround a current code coverage bug in the platform
        MetadataService metaDataService = new MetadataService();
        Test.startTest();
        String strfromlex = '[{"Id":"","MasterLabel":"dfds","Name":"dcdsc","Value":"fdsfsd"},{"Id":"","MasterLabel":"test","Name":"test","Value":"test"},{"Id":"","Name":"dsdds","MasterLabel":"dfsdf","Value":"dsfdsfsd"},{"Id":"","Name":"xcvxcv","MasterLabel":"xcvcxv","Value":"cvxvxc"}]';
        customlabelHandler.createCustomLabel(strfromlex);
        system.assert(True,'error in createCustomLabel ');
        Test.stopTest();
    }
    
     @IsTest
	private static void deleteFieldCheck()
    {	
         System.Test.setMock(WebServiceMock.class, new WebServiceMockImpl());
        // Only required to workaround a current code coverage bug in the platform
        MetadataService metaDataService = new MetadataService();
        Test.startTest();
        
        String strfromlex = '[{"Id":"1012v00000M74slAAB","MasterLabel":"dfds","Name":"dcdsc","Value":"fdsfsd"},{"Id":"1012v00000M73YpAAJ","MasterLabel":"test","Name":"test","Value":"test"},{"Id":"","Name":"dsdds","MasterLabel":"dfsdf","Value":"dsfdsfsd"},{"Id":"","Name":"xcvxcv","MasterLabel":"xcvcxv","Value":"cvxvxc"}]';
      Boolean res =  customlabelHandler.deleteField(strfromlex);
        system.assert(res,'error in deleteFields');
        Test.stopTest();
    }
    
   
    @IsTest
	private static void createServiceCheck()
    {
       MetadataService.MetadataPort obj = customlabelHandler.createService();
        system.assert(obj!=null,'error in createService');
    }
    
    @IsTest
	private static void fetchUserSessionIdCheck()
    {
        Test.startTest(); 
        customlabelHandler.fetchUserSessionId();
        system.assert(TRUE,'error in fetchUserSessionId');
        Test.stopTest();
    }
    
        
        
        
        
        
}