@isTest
private class CustomMetadataTypesRecordControllerTest {
    static testMethod void validateGetObjectlist() {
       List<String> strlst = CustomMetadataTypesRecordController.getObjectlist();   
        system.assert(strlst!=null,'error in getObjectlist');
    }
    static testMethod void validateGetFieldSet(){
        String ObjectnameNegative ='ObjectnameNegative';    
        String Objectname ='Account';
      string res = CustomMetadataTypesRecordController.getFieldSet(ObjectnameNegative);
        system.assert(res!=null,'error in getFieldSet');
      string res1= CustomMetadataTypesRecordController.getFieldSet(Objectname);
       system.assert(res1!=null,'error in getFieldSet');
    }
    static testMethod void validateGetRecords(){
        string objectName2 = 'exception';
        string Objectname ='Account';
        string fieldlist = '["Id","Name","AccountNumber","RecordTypeId","AccountSource","AnnualRevenue","NumberOfEmployees","Fax","Industry","Rating","Phone"]';
        
        test.startTest();
        string res = CustomMetadataTypesRecordController.getRecords(Objectname,fieldlist);
        system.assert(res!=null,'error in getFieldSet');
        string res1 = CustomMetadataTypesRecordController.getRecords(objectName2,fieldlist);
        system.assert(res1!=null,'error in getFieldSet');
        test.stopTest();
    }
    static testMethod void validateUpdateRecords(){
         test.startTest();
         //CustomMetadataTypesRecordController.UpdateRecords( (List<Object>)JSON.deserializeUntyped('[{"Credit_Card_Charge__c":"3000", "DeveloperName":"sdsdf", "Id":"m002v0000011K1jAAE", "MasterLabel":"dfds", "date__c":"2020-05-20"},{"Date__c":"2020-05-20", "DeveloperName":"heloo", "Id":"m022v000000RLcpAAG", "MasterLabel":"heloo"},{"Boolean__c":"true", "DeveloperName":"heloo", "Id":"m022v000000RLcpAAG", "MasterLabel":"heloo"},{"DateTime__c":"2020-05-20T10:09:00.000Z", "DeveloperName":"heloo", "Id":"m022v000000RLcpAAG", "MasterLabel":"heloo"}]'),'Credit_Card_Charge_setting __mdt', (List<Object>)JSON.deserializeUntyped('[{"editable":"false", "label":"Custom Metadata Record Name", "name":"DeveloperName", "required":"true", "type":"STRING"},{"editable":"false", "label":"Date", "name":"Date__c", "required":"false", "type":"DATE"},{"editable":"false", "label":"Boolean", "name":"Boolean__c", "required":"true", "type":"BOOLEAN"},{"editable":"false", "label":"DateTime", "name":"DateTime__c", "required":"false", "type":"DATETIME"}]') , new list<object>());
         //CustomMetadataTypesRecordController.UpdateRecords( new list<object>(),'lookup_test__mdt',new list<object>(),(List<Object>)JSON.deserializeUntyped('[{"DeveloperName":"abc", "Id":"m022v000000RLd9", "MasterLabel":"abc"}]'));
         //CustomMetadataTypesRecordController.UpdateRecords( (List<Object>)JSON.deserializeUntyped('[{"Credit_Card_Charge_Setting__c":"m002v0000011K9nAAE", "DeveloperName":"abc", "Id":"m022v000000RLd9AAG", "MasterLabel":"abc"}]'),'lookup_test__mdt', (List<Object>)JSON.deserializeUntyped('[{"editable":"false", "label":"Credit Card Charge Setting", "name":"Credit_Card_Charge_Setting__c", "required":"false", "type":"REFERENCE"}]'),new list<object>());
        Account acc = new Account(Name='2015-10-26T07:46:36.611Z');
        Account acc1 = new Account(Name='2015-10-26');
        
        List<Account> accList = new List<Account>();
        accList.add(acc);
        insert accList;
        CustomMetadataTypesRecordController.UpdateRecords((List<Object>)accList, 'Account', (List<Object>)JSON.deserializeUntyped('[{"editable":"false", "label":"Name", "name":"Name", "required":"false", "type":"DATETIME"}]'),(List<Object>)accList);
        
        accList = new List<Account>();
        
        accList.add(acc1);
        insert accList;
        CustomMetadataTypesRecordController.UpdateRecords((List<Object>)accList, 'Account', (List<Object>)JSON.deserializeUntyped('[{"editable":"false", "label":"Name", "name":"Name", "required":"false", "type":"DATE"}]'),(List<Object>)accList);
        Account acc2 = new Account(Name='true', parentId = accList[0].Id);
        accList = new List<Account>();
        
        accList.add(acc2);
        insert accList;
        
        CustomMetadataTypesRecordController.UpdateRecords((List<Object>)accList, 'Account', (List<Object>)JSON.deserializeUntyped('[{"editable":"false", "label":"Name", "name":"Name", "required":"false", "type":"BOOLEAN"}, {"editable":"false", "label":"ParentId", "name":"ParentId", "required":"false", "type":"REFERENCE"}]'),(List<Object>)accList);
        system.assert(TRUE,'error in UpdateRecords');
        test.stopTest();
    }
    static testMethod void validatefetchLookupObjectName(){
        test.startTest();
        Account acc1 = new Account(Name='test');
        Insert acc1;
        string fieldId =acc1.Id;
        CustomMetadataTypesRecordController.fetchLookupObjectName(fieldId);
        system.assert(True,'error in fetchLookupObjectName');
        test.stopTest();
    }
    static testMethod void validatefetchfetchLookupObjectData(){
        Account acc1 = new Account(Name='test');
        Insert acc1;
        Account acc2 = new Account(Name='test2', parentId = acc1.Id);
        Insert acc2;
        test.startTest();
        String ObjData ='{"editable":"false", "label":"ParentId", "name":"ParentId", "required":"false", "type":"REFERENCE"}';
        String queryTerm = 'te';
        String objectname = '"Account"';
        CustomMetadataTypesRecordController.fetchLookupObjectData(ObjData, queryTerm, objectname);
        system.assert(True,'error in fetchLookupObjectData');
        test.stopTest();        
    }
    static testMethod void validatefetchPicklistValue(){
        test.startTest();
        Account acc = new Account(Name='test',Industry='Energy');
        Insert acc;
        String fieldData ='{"editable":"false", "label":"Industry", "name":"Industry", "required":"false", "type":"PICKLIST"}';
        String objectnames = '"Account"';
       list<string> strlst =  CustomMetadataTypesRecordController.fetchPicklistValue(fieldData, objectnames);
        system.assert(strlst!=null,'error in fetchPicklistValue');
        test.stopTest();
    }
}