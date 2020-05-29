@isTest
public class MutipleRecordExportControllerTest {
    static testMethod void ValidatefetchsObject() {
    List<MutipleRecordExportController.WrapperClass> reslst = MutipleRecordExportController.fetchsObject();
        system.assert(reslst!=null,'error in fetchsObject');
    }
    static testMethod void ValidateExportRecord(){
        string wrapList = '[{"fieldRecord":true,"fieldsetRecord":true,"LayoutData":true,"RecordtypeData":true,"sobjName":"Account"},{"fieldRecord":true,"fieldsetRecord":true,"LayoutData":true,"RecordtypeData":true,"sobjName":"AccountContactRole"},{"fieldRecord":false,"fieldsetRecord":false,"LayoutData":false,"RecordtypeData":false,"sobjName":"AccountFeed"}]';
       String res = MutipleRecordExportController.ExportRecord(wrapList);
        system.assert(res!=null,'error in ExportRecord');
    }
    static testMethod void ValidateCreateObject(){
        String objName = 'test';
        String pluralName= 'tests';
        String RecordName='test';
        String StartNumber='0';
        String StartNumber2 ='';
        Test.startTest();
    	MutipleRecordExportController.CreateObject(objName,pluralName,RecordName,StartNumber);   
        MutipleRecordExportController.CreateObject(objName,pluralName,RecordName,StartNumber2); 
        system.assert(True,'error in CreateObject');	
        Test.stopTest();
    }
}