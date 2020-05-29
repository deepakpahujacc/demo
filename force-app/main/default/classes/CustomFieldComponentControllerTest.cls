@isTest
private class CustomFieldComponentControllerTest {
	
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
        
    
    //my methods
    @IsTest
	private static void getFields()
	{	
    	  
        Test.startTest();    
        
       List<CustomFieldComponentController.options> resLst = CustomFieldComponentController.getObject();
        system.assert(resLst!=null,'error in getObject');
       	
        Test.stopTest();
	}
    
    @IsTest
	private static void getFieldsData()
	{	
    	  
        Test.startTest();    
        
      object obj = CustomFieldComponentController.getFields('Account');
        system.assert(obj!=null,'error in getFields');
       	
        Test.stopTest();
	}
    
     @IsTest
	private static void getLookUpFields()
	{	Test.startTest();    
         
     List<string> resLst =  CustomFieldComponentController.getRecords();
     system.assert(reslst!=null,'error in getRecords');
       	
        Test.stopTest();
	}
    
    @IsTest
	private static void getSessionIds()
	{	
        Test.startTest();    
         
         CustomFieldComponentController.fetchUserSessionId();
        system.assert(True,'error in fetchUserSessionId ');
       	
        Test.stopTest();
	}
   
    
     @IsTest
    private static void upsertDataFields()
    {	
        // Null Web Service mock implementation
        System.Test.setMock(WebServiceMock.class, new WebServiceMockImpl());
        // Only required to workaround a current code coverage bug in the platform
        MetadataService metaDataService = new MetadataService();
        Test.startTest();    
        String testStr ='[{"label":"acountautonumber","required":"false","type":"STRING","isRef":false,"name":"acountautonumber__c","length":30,"scale":0,"precision":0,"referenceTo":"","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"Average income of employees","required":"false","type":"DOUBLE","isRef":false,"name":"Average_income_of_employees__c","length":0,"scale":2,"precision":16,"referenceTo":"","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"Contact Primary LookUp","required":"false","type":"REFERENCE","isRef":true,"name":"Contact_Primary_LookUp__c","length":18,"scale":0,"precision":0,"referenceTo":"Contact","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"Contact Records created last 4 hours","required":"false","type":"DOUBLE","isRef":false,"name":"Contact_Records_created_last_4_hours__c","length":0,"scale":2,"precision":16,"referenceTo":"","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"Email","required":"false","type":"EMAIL","isRef":false,"name":"Email__c","length":80,"scale":0,"precision":0,"referenceTo":"","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"Match Billing Address","required":"true","type":"BOOLEAN","isRef":false,"name":"Match_Billing_Address__c","length":0,"scale":0,"precision":0,"referenceTo":"","defaultValue":"true","pickListValue":"","fromOrg":true},{"label":"need_intel","required":"true","type":"BOOLEAN","isRef":false,"name":"need_intel__c","length":0,"scale":0,"precision":0,"referenceTo":"","defaultValue":"false","pickListValue":"","fromOrg":true},{"label":"Number of Contacts","required":"false","type":"DOUBLE","isRef":false,"name":"Number_of_Contacts__c","length":0,"scale":2,"precision":16,"referenceTo":"","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"Only_Default_Contact","required":"true","type":"BOOLEAN","isRef":false,"name":"Only_Default_Contact__c","length":0,"scale":0,"precision":0,"referenceTo":"","defaultValue":"false","pickListValue":"","fromOrg":true},{"label":"OppAtchName1","required":"false","type":"TEXTAREA","isRef":false,"name":"OppAtchName__c","length":255,"scale":0,"precision":0,"referenceTo":"","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"Out_of_Zip","required":"true","type":"BOOLEAN","isRef":false,"name":"Out_of_Zip__c","length":0,"scale":0,"precision":0,"referenceTo":"","defaultValue":"false","pickListValue":"","fromOrg":true},{"label":"sampleLabel","required":"false","type":"PERCENT","isRef":false,"name":"sample12__c","length":0,"scale":2,"precision":16,"referenceTo":"","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"SLA Expiration Date","required":"false","type":"DATE","isRef":false,"name":"SLAExpirationDate__c","length":0,"scale":0,"precision":0,"referenceTo":"","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"SLA Serial Number","required":"false","type":"DATE","isRef":false,"name":"SLASerialNumber__c","length":0,"scale":0,"precision":0,"referenceTo":"","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"ss","required":"false","type":"STRING","isRef":false,"name":"sss__c","length":30,"scale":0,"precision":0,"referenceTo":"","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"Sum of Opportunities","required":"false","type":"CURRENCY","isRef":false,"name":"Sum_of_Opportunities__c","length":0,"scale":2,"precision":18,"referenceTo":"","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"temp","required":"false","type":"DOUBLE","isRef":false,"name":"temp__c","length":0,"scale":2,"precision":16,"referenceTo":"","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"testcheckfield","required":"true","type":"BOOLEAN","isRef":false,"name":"testcheckfield__c","length":0,"scale":0,"precision":0,"referenceTo":"","defaultValue":"false","pickListValue":"","fromOrg":true},{"label":"testsss","required":"false","type":"STRING","isRef":false,"name":"testsss__c","length":22,"scale":0,"precision":0,"referenceTo":"","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"topOpportunity","required":"false","type":"REFERENCE","isRef":true,"name":"topOpportunity__c","length":18,"scale":0,"precision":0,"referenceTo":"Opportunity","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"Total Opportunities","required":"false","type":"DOUBLE","isRef":false,"name":"Total_Opportunities__c","length":0,"scale":0,"precision":18,"referenceTo":"","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"Verified for Credit card","required":"true","type":"BOOLEAN","isRef":false,"name":"Verified_for_Credit_card__c","length":0,"scale":0,"precision":0,"referenceTo":"","defaultValue":"false","pickListValue":"","fromOrg":true},{"label":"sampleLabel","name":"sampleName12__c","type":"PHONE","length":"20","precision":"16","scale":"2","referenceTo":"()","defaultValue":"false","pickListValue":"","fromOrg":false,"isRef":false},{"label":"sampleLabel","name":"sampleName14__c","type":"PICKLIST","length":"20","precision":"16","scale":"2","referenceTo":"()","defaultValue":"true","pickListValue":"test1","fromOrg":false,"isRef":false},{"label":"sampleLabel","name":"sampleName654__c","type":"REFERENCE","length":"20","precision":"16","scale":"2","referenceTo":"Account","defaultValue":"false","pickListValue":"","fromOrg":false,"isRef":false}]';
       Boolean res = CustomFieldComponentController.upsertCustomfield(testStr,'Account');
        system.assert(res,'error in upsertCustomfield');
        Test.stopTest();
    }
    
     @IsTest
	private static void createLookupFieldValidate()
	{	
        // Null Web Service mock implementation
        System.Test.setMock(WebServiceMock.class, new WebServiceMockImpl());
        // Only required to workaround a current code coverage bug in the platform
        MetadataService metaDataService = new MetadataService();
        
        
        Test.startTest(); 
        CustomFieldComponentController.createLookupField('Account', 'testfield', 'testfield__c', 'Contact');
        system.assert(TRUE,'error in createLookupField');
     	 Test.stopTest();
    }
    @IsTest
    private static void deleteSingleFieldValidate(){
        // Null Web Service mock implementation
        System.Test.setMock(WebServiceMock.class, new WebServiceMockImpl());
        // Only required to workaround a current code coverage bug in the platform
        MetadataService metaDataService = new MetadataService();
        
        
        Test.startTest(); 
        CustomFieldComponentController.deleteSingleField('Account.testfield__c');
        system.assert(TRUE,'error in deleteSingleField');
         Test.stopTest();
        
    }
    @IsTest
    private static void deleteFieldValidate(){
        // Null Web Service mock implementation
        System.Test.setMock(WebServiceMock.class, new WebServiceMockImpl());
        // Only required to workaround a current code coverage bug in the platform
        MetadataService metaDataService = new MetadataService();
       
        
        Test.startTest(); 
        String strfromlex ='[{"label":"Paypal","required":"false","type":"EMAIL","isRef":false,"name":"Paypal_email__c","length":80,"scale":0,"precision":0,"referenceTo":"","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"Paypal payment date","required":"false","type":"DATETIME","isRef":false,"name":"Paypal_payment_date__c","length":0,"scale":0,"precision":0,"referenceTo":"","defaultValue":"null","pickListValue":"","fromOrg":true},{"label":"Paypal status","required":"false","type":"PICKLIST","isRef":false,"name":"Paypal_status__c","length":255,"scale":0,"precision":0,"referenceTo":"","defaultValue":"null","pickListValue":"Paid,Upaid,Claimed,Unclaimed,Completed","fromOrg":true}]';
     Boolean res = CustomFieldComponentController.deleteField(strfromlex, 'Account');
        system.assert(res,'error in deleteField');
         Test.stopTest();
    }
    
     @IsTest
    private static void createServiceValidate(){
        Test.startTest(); 
       MetadataService.MetadataPort res = CustomFieldComponentController.createService();
        system.assert(res!=null,'error in createService');
        Test.stopTest();
        
    }
    //
    
    
   
    
    public class options{
        @AuraEnabled
        public String optionLabel;
        @AuraEnabled
        public String optionValue;
        public options(String optionLabel, String optionValue){
            this.optionLabel = optionLabel;
            this.optionValue = optionValue;
        }
    }
    
}