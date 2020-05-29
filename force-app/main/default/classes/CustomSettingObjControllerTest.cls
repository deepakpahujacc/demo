@isTest
public class CustomSettingObjControllerTest {
    static testMethod void validateobjectNames(){
      list<string> strlst =  CustomSettingObjController.objectNames();
        system.assert(strlst!=null,'error in CustomSettingObjController');
    }
    static testMethod void validategetFieldSet(){
       string res = CustomSettingObjController.getFieldSet('Testexception');
        system.assert(res!=null,'error in getFieldSet');
      string res1 =  CustomSettingObjController.getFieldSet('Account');
        system.assert(res1!=null,'error in getFieldSet');
    }
	static testMethod void validategetRecords(){
        string field = '["Name"]';
        string objectName = 'Account';
      list<sobject> reslst =  CustomSettingObjController.getRecords(objectName,field);
        system.assert(reslst!=null,'error in getRecords');
    }
    static testMethod void validateSaveCustomSettingRecords(){
        list<Account> newRecords = new list<Account>();
        Account acctN = new Account(name = 'chahal');
        newRecords.add(acctN);
        list<Account> deleteRecords = new  list<Account>();
        Account acctDelN = new Account(name = 'check');
        deleteRecords.add(acctDelN);
        CustomSettingObjController.saveCustomSettingRecords(newRecords,deleteRecords);
        system.assert(true,'error in saveCustomSettingRecords');
    }
}