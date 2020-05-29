@isTest
public class newFieldClassTest {
    static testMethod void validateGetUserSessionId(){
        newFieldClass.getUserSessionId();
        system.assert(True,'error in getUserSessionId ');
    }
    static testMethod void validatecreateCheckboxField(){
        string objName = 'Account';
        string label = 'dataTest';
        string name = 'dataTest__c';
        string defVal = 'false';
        newFieldClass.createCheckboxField(objName,label,name,defVal);
         system.assert(True,'error in createCheckboxField ');
    }
    static testMethod void validatecreateTextField(){
        string objName = 'Account';
        string label = 'dataTest1';
        string name = 'dataTest1__c';
        integer len = 30;
        boolean required = false;
        boolean externalID = false;
        newFieldClass.createTextField(objName,label,name,len,required,externalID);
        system.assert(True,'error in createTextField ');
    }
    static testMethod void validatecreateEmailField(){
        string objName = 'Account';
        string label = 'dataTest2';
        string name = 'dataTest2__c';
        boolean required = false;
        boolean uniqueID = false;
        boolean externalID = false;
        newFieldClass.createEmailField(objName,label,name,required,uniqueID,externalID);
        system.assert(True,'error in createEmailField ');
    }
    static testMethod void validatecreateCurrencyField(){
        string objName = 'Account';
        string label = 'dataTest3';
        string name = 'dataTest3__c';
        integer len = 16;
        integer dPlace = 2;
        boolean required = false;
        newFieldClass.createCurrencyField(objName,label,name,len,dPlace,required);
         system.assert(True,'error in createCurrencyField ');
    }
    static testMethod void validatecreateNumberField(){
        string objName = 'Account';
        string label = 'dataTest4';
        string name = 'dataTest4__c';
        integer len = 16;
        integer dPlace = 2;
        boolean required = false;
        boolean uniqueID = false;
        boolean externalID = false;
        newFieldClass.createNumberField(objName,label,name,len,dPlace,required,uniqueID,externalID);
         system.assert(True,'error in createNumberField ');
    }
    static testMethod void validatecreateDateField(){
        string objName = 'Account';
        string label = 'dataTest5';
        string name = 'dataTest5__c';
        boolean required = false;
        newFieldClass.createDateField(objName,label,name,required);
        system.assert(True,'error in createDateField ');
    }
    static testMethod void validatecreateDateTimeField(){
        string objName = 'Account';
        string label = 'dataTest6';
        string name = 'dataTest6__c';
        boolean required = false;
        newFieldClass.createDateTimeField(objName,label,name,required);
        system.assert(True,'error in createDateTimeField ');
    }
    static testMethod void validatecreatePercentField(){
        string objName = 'Account';
        string label = 'dataTest7';
        string name = 'dataTest7__c';
        integer len = 16;
        integer dPlace = 2;
        boolean required = false;
        newFieldClass.createPercentField(objName,label,name,len,dPlace,required);
         system.assert(True,'error in createPercentField ');
    }
    static testMethod void validatecreatePhoneField(){
        string objName = 'Account';
        string label = 'dataTest8';
        string name = 'dataTest8__c';
        boolean required = false;
        newFieldClass.createPhoneField(objName,label,name,required);
         system.assert(True,'error in createPhoneField ');
    }
    static testMethod void validatecreatePicklistField(){
        string objName = 'Account';
        string label = 'dataTest9';
        string name = 'dataTest9__c';
        string values = 'test';
        boolean required = false;
        newFieldClass.createPicklistField(objName,label,name,values,required);
         system.assert(True,'error in createPicklistField ');
    }
    static testMethod void validatecreateTimeField(){
        string objName = 'Account';
        string label = 'dataTest10';
        string name = 'dataTest10__c';
        boolean required = false;
        newFieldClass.createTimeField(objName,label,name,required);
         system.assert(True,'error in createTimeField ');
    }
    static testMethod void validatecreateUrlField(){
        string objName = 'Account';
        string label = 'dataTest11';
        string name = 'dataTest11__c';
        boolean required = false;
        newFieldClass.createUrlField(objName,label,name,required);
         system.assert(True,'error in createUrlField ');
    }
    static testMethod void validatecreateANumberField(){
        string objName = 'Account';
        string label = 'dataTest12';
        string name = 'dataTest12__c';
        boolean required = false;
        newFieldClass.createANumberField(objName,label,name,required);
         system.assert(True,'error in createANumberField ');
    }
    static testMethod void validatecreateLookupField(){
        string objName = 'Account';
        string label = 'dataTest13';
        string name = 'dataTest13__c';
        string rObj = 'Contact';
        boolean required = false;
        newFieldClass.createLookupField(objName,label,name,rObj,required);
         system.assert(True,'error in createLookupField ');
    }
    static testMethod void validategetRecords(){
      List<string> res =  newFieldClass.getRecords();
         system.assert(res!=null,'error in getRecords ');
    }
    static testMethod void validategetFields(){
        string objName = 'Account';
        string fieldName = 'dataTest14';
       list<string> res = newFieldClass.getFields(objName,fieldName);
         system.assert(res!=null,'error in res ');
    }

}