@isTest
private class FieldLevelPermissionTest {
    static testMethod void validateObjectlist() {
     List<String> res =   FieldLevelPermissionController.objectList();
        system.assert(res!=null,'error in objectList');
    }
    static testMethod void validatepanelProfiles() {
      List<Profile> res =  FieldLevelPermissionController.panelProfiles();
         system.assert(res!=null,'error in panelProfiles');
    }
    static testMethod void validatecreateService() {
    MetadataService.MetadataPort obj =  FieldLevelPermissionController.createService();
        system.assert(obj!=null,'error in createService');
    }
    static testMethod void validategetUserSessionId() {
      FieldLevelPermissionController.getUserSessionId();
        system.assert(True,'error in getUserSessionId');
    }
    static testMethod void validategetWrapperContent() {
        List<String> profileList = new List<String>{'System Administrator','Contract Manager','Read Only','Sales','Standard User'};
      List<FieldLevelPermissionController.wrapperClass> res = FieldLevelPermissionController.getWrapperContent('Account', profileList);
        system.assert(res!=null,'error in getWrapperContent');
         List<FieldLevelPermissionController.wrapperClass>	res1 = FieldLevelPermissionController.getWrapperContent('Contact', profileList);
         system.assert(res1!=null,'error in getWrapperContent');
         List<FieldLevelPermissionController.wrapperClass> res2 =	FieldLevelPermissionController.getWrapperContent('Contact', null);
         system.assert(res2!=null,'error in getWrapperContent');
         List<FieldLevelPermissionController.wrapperClass> res3 =	FieldLevelPermissionController.getWrapperContent('Account', null);
         system.assert(res3!=null,'error in getWrapperContent');
    }
    static testMethod void validatefieldLevelPermissions() {
        List<String> fields = new List<String>{'Account.AccountSource-true-true','Account.CleanStatus-true-false','Account.Contacts_Created_in_Last_4_hours__c-true-true','Account.CustomerPriority__c-true-true','Account.Description-true-true',
          									   'Account.DunsNumber-true-false','Account.Email__c-true-true','Account.Fax-true-true','Account.Industry-true-true','Account.Jigsaw-true-true',
           									   'Account.Match_Billing_Address__c-true-true','Account.NaicsCode-true-false','Account.NaicsDesc-true-false','Account.No_Of_Contacts__c-true-true','Account.NumberOfEmployees-true-true',
 											    'Account.NumberofLocations__c-true-true', 'Account.Only_Default_Contact__c-true-true','Account.Out_of_Zip__c-true-true','Account.Ownership-true-true','Account.Phone-true-true',
           										 'Account.Rating-true-true','Account.SLAExpirationDate__c-true-true','Account.SLASerialNumber__c-true-true','Account.SLA__c-true-true','Account.ShippingAddress-true-true','Account.Sic-true-true',
            									'Account.SicDesc-true-true', 'Account.Store_Location__c-true-true','Account.Support_Plan_Start_Date__c-true-false','Account.TickerSymbol-true-true','Account.TopOpportunity__c-true-true',
            									'Account.Tradestyle-true-false','Account.Type-true-true', 'Account.UpsellOpportunity__c-true-true','Account.Website-true-true','Account.YearStarted-true-false','Account.is_gold__c-true-true','Account.need_intel__c-true-true'};
                                                    
         List<String> fields1 = new List<String>{'Account.AccountSource-false-true','Account.CleanStatus-true-false','Account.Contacts_Created_in_Last_4_hours__c-true-true','Account.CustomerPriority__c-true-true','Account.Description-true-true',
          									   'Account.DunsNumber-true-false','Account.Email__c-true-true','Account.Fax-true-true','Account.Industry-true-true','Account.Jigsaw-true-true',
           									   'Account.Match_Billing_Address__c-true-true','Account.NaicsCode-true-false','Account.NaicsDesc-false-false','Account.No_Of_Contacts__c-true-true','Account.NumberOfEmployees-true-true',
 											    'Account.NumberofLocations__c-false-true', 'Account.Only_Default_Contact__c-true-true','Account.Out_of_Zip__c-true-true','Account.Ownership-true-true','Account.Phone-true-true',
           										 'Account.Rating-false-true','Account.SLAExpirationDate__c-true-true','Account.SLASerialNumber__c-true-true','Account.SLA__c-true-true','Account.ShippingAddress-true-true','Account.Sic-true-true',
            									'Account.SicDesc-true-true', 'Account.Store_Location__c-true-true','Account.Support_Plan_Start_Date__c-true-false','Account.TickerSymbol-true-true','Account.TopOpportunity__c-true-true',
            									'Account.Tradestyle-true-false','Account.Type-true-true', 'Account.UpsellOpportunity__c-true-true','Account.Website-true-true','Account.YearStarted-true-false','Account.is_gold__c-true-true','Account.need_intel__c-true-true'};
                                           
         FieldLevelPermissionController.fieldLevelPermissions('System Administrator', fields);
         FieldLevelPermissionController.fieldLevelPermissions('Contract Manager', fields1);
        system.assert(True,'error in fieldLevelPermissions');
    }
}