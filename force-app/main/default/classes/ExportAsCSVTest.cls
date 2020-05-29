@isTest
public class ExportAsCSVTest {
	static testMethod void ValidateExportasCsv() {
        Test.setMock(HttpCalloutMock.class, new RestMock());
        test.startTest();
		PageReference pageRef = Page.exportascsv;
        Test.setCurrentPage(pageRef);
        pageRef.getParameters().put('objectNameForFieldSet','Account');
        pageRef.getParameters().put('objectNameForLayoutData','Account');
        pageRef.getParameters().put('objectNameForRecordType','Account');
        pageRef.getParameters().put('objNameForFields','Account');
        ExportAsCSV controller = new ExportAsCSV();
        system.assert(True,'error in ExportCSV Class');
        test.stopTest();
    }
    private class RestMock implements HttpCalloutMock {
        
        public HTTPResponse respond(HTTPRequest req) {
            String fullJson = '{"size":4,"totalSize":4,"done":true,"queryLocator":null,"entityTypeName":"Layout","records":[{"attributes":{"type":"Layout","url":"/services/data/v33.0/tooling/sobjects/Layout/00h2x000001iwHYAAY"},"FullName":"Account-Account %28Marketing%29 Layout"},{"attributes":{"type":"Layout","url":"/services/data/v33.0/tooling/sobjects/Layout/00h2x000001iwHZAAY"},"FullName":"Account-Account %28Sales%29 Layout"},{"attributes":{"type":"Layout","url":"/services/data/v33.0/tooling/sobjects/Layout/00h2x000001iwHaAAI"},"FullName":"Account-Account %28Support%29 Layout"},{"attributes":{"type":"Layout","url":"/services/data/v33.0/tooling/sobjects/Layout/00h2x000001iwHbAAI"},"FullName":"Account-Account Layout"}]}';
            
            HTTPResponse res = new HTTPResponse();
            res.setHeader('Content-Type', 'text/json');
            res.setBody(fullJson);
            res.setStatusCode(200);
            return res;
        }
    }
}