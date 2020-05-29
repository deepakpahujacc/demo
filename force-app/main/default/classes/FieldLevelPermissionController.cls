public class FieldLevelPermissionController{
     
    public static Map<String, List<String>> ogValues = new Map<String, List<String>>();
    public static Integer PermSetName = 1;
    
    @AuraEnabled
    public static List<String> objectList(){
        List<Schema.SObjectType> allObjectList = Schema.getGlobalDescribe().Values();    
        List<String> objectList = new List<String>();
        for(SObjectType obj : allObjectList){
            if(obj.getDescribe().getName().endsWith('__c') || obj.getDescribe().getName() == 'Account' || obj.getDescribe().getName() == 'Contact' || obj.getDescribe().getName() == 'Case' || obj.getDescribe().getName() == 'Contract' || obj.getDescribe().getName() == 'Lead' || obj.getDescribe().getName() == 'OrderItem' || obj.getDescribe().getName() == 'Task' || obj.getDescribe().getName() == 'Quote'|| obj.getDescribe().getName() == 'Product2' ||  
               obj.getDescribe().getName() == 'Campaign' || obj.getDescribe().getName() == 'Opportunity' || obj.getDescribe().getName() == 'Order' || obj.getDescribe().getName() == 'Asset' || obj.getDescribe().getName() == 'QuoteLineItem' ||  obj.getDescribe().getName() == 'ProductItem' || obj.getDescribe().getName() == 'Pricebook2'){
                   objectList.add(obj.getDescribe().getName()+'####'+obj.getDescribe().getLabel());
               }
        }  
        objectList.sort();
        return objectList;
    }
    
    @AuraEnabled
    public static List<Profile> panelProfiles(){
        
        List<String> internalProfileNames = new List<String>{'Analytics Cloud Integration User','Analytics Cloud Security User','Authenticated Website','Analytics Cloud Security','Chatter External User',
            'Chatter Free User','Chatter Moderator User','Cross Org Data Proxy User','Work.com Only User','Customer Community Plus Login User',
            'Customer Community User','Customer Portal Manager Custom','Customer Portal Manager Standard','External Identity User','Force.com - App Subscription User',
            'Force.com - Free User','Gold Partner User','High Volume Customer Portal','Identity User','Partner App Subscription User'};
                
                return [SELECT name FROM Profile WHERE name NOT IN :internalProfileNames];
    }
    
    private static List<String> gettingSchemaFields(String objName) {
        
        //getting fields from schema (part a starts)
        
        Set<String> fieldsList = new Set<String>();
        Map<String , Schema.SObjectType> globalDescription = Schema.getGlobalDescribe();
        Schema.sObjectType objType = globalDescription.get(objName); 
        Schema.DescribeSObjectResult r1 = objType.getDescribe(); 
        Map<String , Schema.SObjectField> mapFieldList = r1.fields.getMap();  
        
        List<String> requiredFieldList = new List<String>();
        
        for(String obj : mapFieldList.keyset()) {
            Schema.DescribeFieldResult describeField = mapFieldList.get(obj).getDescribe();
            if (describeField.isCreateable()  && !describeField.isNillable() && !describeField.isDefaultedOnCreate()) {
                requiredFieldList.add(obj.toLowerCase());
            }
        }
        System.debug(requiredFieldList);
        
        for(Schema.SObjectField field : mapFieldList.values()){  
            Schema.DescribeFieldResult fieldResult = field.getDescribe();  
            if(!requiredFieldList.contains(String.valueOf(fieldResult.getName()).toLowerCase())){
                if(fieldResult.isUpdateable() && fieldResult.isPermissionable())  {
                    
                    if(fieldResult.getName() == 'BillingCity' ||
                       fieldResult.getName() == 'BillingCountry' || 
                       fieldResult.getName() == 'BillingGeocodeAccuracy' ||
                       fieldResult.getName() == 'BillingLatitude' ||
                       fieldResult.getName() == 'BillingLongitude' ||
                       fieldResult.getName() == 'BillingPostalCode' ||
                       fieldResult.getName() == 'BillingState' ||
                       fieldResult.getName() == 'BillingStreet') 
                        fieldsList.add('BillingAddress');
                    else if(fieldResult.getName() == 'ShippingCity' ||
                            fieldResult.getName() == 'ShippingCountry' || 
                            fieldResult.getName() == 'ShippingGeocodeAccuracy' ||
                            fieldResult.getName() == 'ShippingLatitude' ||
                            fieldResult.getName() == 'ShippingLongitude' ||
                            fieldResult.getName() == 'ShippingPostalCode' ||
                            fieldResult.getName() == 'ShippingState' ||
                            fieldResult.getName() == 'ShippingStreet') 
                        fieldsList.add('ShippingAddress');
                    else if(fieldResult.getName() == 'OtherCity' ||
                            fieldResult.getName() == 'OtherCountry' || 
                            fieldResult.getName() == 'OtherGeocodeAccuracy' ||
                            fieldResult.getName() == 'OtherLatitude' ||
                            fieldResult.getName() == 'OtherLongitude' ||
                            fieldResult.getName() == 'OtherPostalCode' ||
                            fieldResult.getName() == 'OtherState' ||
                            fieldResult.getName() == 'OtherStreet') 
                        fieldsList.add('OtherAddress');
                    else if(fieldResult.getName() == 'MailingCity' ||
                            fieldResult.getName() == 'MailingCountry' || 
                            fieldResult.getName() == 'MailingGeocodeAccuracy' ||
                            fieldResult.getName() == 'MailingLatitude' ||
                            fieldResult.getName() == 'MailingLongitude' ||
                            fieldResult.getName() == 'MailingPostalCode' ||
                            fieldResult.getName() == 'MailingState' ||
                            fieldResult.getName() == 'MailingStreet') 
                        fieldsList.add('MailingAddress');
                    else
                        fieldsList.add(fieldResult.getName());
                }
            }
        }
        List<String> tempList1 = new List<String>();
        for(String fieldname : fieldsList){
            tempList1.add(fieldname); 
        } 
        tempList1.sort();
        System.debug('schemaList = '+tempList1);
        return tempList1;
        
        //part a ends
        
    }
    
    private static Map<String, String> objField(String objName){
        List<String> tempList1 = gettingSchemaFields(objName);
        List<FieldDefinition> fieldDefinitionList = [SELECT DeveloperName, DurableId, EntityDefinitionId, QualifiedApiName FROM FieldDefinition where EntityDefinitionId  =: objName ];
        Map<String, String> fieldMapToReturn = new Map<String, String>();
        fieldDefinitionList.sort();
        for(FieldDefinition obj: fieldDefinitionList){
            if(tempList1.contains(obj.QualifiedApiName))
                fieldMapToReturn.put(obj.developerName, obj.QualifiedApiName);
        }
        System.debug('objFields = '+fieldMapToReturn);
        return fieldMapToReturn;
    }
    
    @AuraEnabled 
    public static List<WrapperClass> getWrapperContent(String objName,List<String> profileName){
        Map<String, String> objectFields = objField(objName);
        List<WrapperClass> wrapperContent = new List<WrapperClass>();
        List<String> internalProfileNames = new List<String>{'Analytics Cloud Integration User','Analytics Cloud Security User','Authenticated Website','Analytics Cloud Security','Chatter External User',
            'Chatter Free User','Chatter Moderator User','Cross Org Data Proxy User','Work.com Only User','Customer Community Plus Login User',
            'Customer Community User','Customer Portal Manager Custom','Customer Portal Manager Standard','External Identity User','Force.com - App Subscription User',
            'Force.com - Free User','Gold Partner User','High Volume Customer Portal','Identity User','Partner App Subscription User'};
                
                
                List<String> profileList = new List<String>();
        String QueryString = '';
        
        if(profileName!=null && profileName.size()>0)
            QueryString = 'SELECT profile.name FROM permissionset WHERE profile.name IN :profileName ORDER BY profile.name';
        else
            QueryString ='SELECT profile.name FROM permissionset WHERE isCustom=false AND profile.name!=null AND profile.name NOT IN :internalProfileNames  ORDER BY profile.name';
        
        for(Permissionset permSet: Database.query(QueryString)){
            profileList.add(permSet.Profile.name);
            profileList.sort();
        }
        
        Map<String,boolean> readMap = new Map<String,boolean>();
        Map<String,boolean> writeMap = new Map<String,boolean>();
        for(PermissionSet permSet : [SELECT PermissionSet.Profile.Name,(SELECT Field, PermissionsRead, PermissionsEdit FROM FieldPerms WHERE SobjectType =:objName)
                                     FROM PermissionSet 
                                     WHERE PermissionSet.Profile.Name IN :profileList]){
                                         for(FieldPermissions fieldPerm: permSet.FieldPerms){
                                             readMap.put(permSet.Profile.Name+'-'+fieldPerm.Field, fieldPerm.PermissionsRead);
                                             writeMap.put(permSet.Profile.Name+'-'+fieldPerm.Field, fieldPerm.PermissionsEdit);
                                         }                                             
                                     }
        
        for(String field: objectFields.keySet()){
            List<ProfileWrapper> profilewrpList = new List<ProfileWrapper>();
            for(String profile : profileList){
                profilewrpList.add(new ProfileWrapper(profile, readMap.get(profile+'-'+objName+'.'+objectFields.get(field)), writeMap.get(profile+'-'+objName+'.'+objectFields.get(field))));
            }
            wrapperContent.add(new WrapperClass(field, profilewrpList));
        }
        system.debug(wrapperContent);
        return wrapperContent;
    }
    
    @AuraEnabled 
    public static void fieldLevelPermissions(String profileName, List<String> fieldsName){
        String objName = fieldsName[0].substring(0,fieldsName[0].indexOf('.'));
        Map<String, String> apiName = objField(objName);
        System.debug('@@@ '+apiName);
        System.debug('!!! '+objName);
        List<String> profileList = new List<String>();
        String QueryString = '';
        
        if(profileName!=null)
            QueryString = 'SELECT profile.name FROM permissionset WHERE profile.name = :profileName ORDER BY profile.name';
        
        for(Permissionset permSet: Database.query(QueryString)){
            profileList.add(permSet.Profile.name);
            profileList.sort();
        }
        System.debug('profileList = '+profileList);
        Map<String,boolean> readMap = new Map<String,boolean>();
        Map<String,boolean> writeMap = new Map<String,boolean>();
        for(PermissionSet permSet : [SELECT PermissionSet.Profile.Name,(SELECT Field, PermissionsRead, PermissionsEdit FROM FieldPerms WHERE SobjectType =:objName)
                                     FROM PermissionSet 
                                     WHERE PermissionSet.Profile.Name IN :profileList]){
                                         for(FieldPermissions fieldPerm: permSet.FieldPerms){
                                             readMap.put(permSet.Profile.Name+'-'+fieldPerm.Field, fieldPerm.PermissionsRead);
                                             writeMap.put(permSet.Profile.Name+'-'+fieldPerm.Field, fieldPerm.PermissionsEdit);
                                         }                                             
                                     }
        
        for(String field: apiName.keySet()){
            for(String profile : profileList){
                if(!ogValues.containsKey(profile)) {
                    ogValues.put(profile, new List<String>());
                }
                ogValues.get(profile).add((objName+'.'+field+'-'+readMap.get(profile+'-'+objName+'.'+apiName.get(field))+'-'+writeMap.get(profile+'-'+objName+'.'+apiName.get(field))));
                
            }
        }
        System.debug('rm '+readMap);
        System.debug('wm '+writeMap);
        System.debug(ogValues);
        
        
        System.debug('pname === '+profileName);
        System.debug('fname === '+fieldsName);
        List<FieldPermissions> fpIns = new List<FieldPermissions>();
        List<FieldPermissions> fpUpd = new List<FieldPermissions>();
        List<FieldPermissions> fpDel = new List<FieldPermissions>();
        
        List<PermissionSet> psIns = [SELECT id, name FROM PermissionSet WHERE Profile.Name =: profileName];
        Map<String, List<FieldPermissions>> fpId = new Map<String, List<FieldPermissions>>();
        
        for(FieldPermissions fp : [SELECT id, field FROM FieldPermissions WHERE ParentId = : psIns[0].id]) {
            if(!fpId.containsKey(fp.field))
                fpId.put(fp.field, new List<FieldPermissions>());
            fpId.get(fp.Field).add(fp);
        }
        
        for(String obj : fpId.keySet()) {
            if(fpId.get(obj).size() > 1){
                fpDel.addAll(fpId.get(obj));
                fpId.remove(obj);
            }
        }
        
        System.debug('%%%% '+fpId);
        
        if(ogValues.containsKey(profileName.trim())) {
            for(String fnObj : fieldsName) {
                String s1 = (fnObj.substring(fnObj.indexOf('-')+1, fnObj.lastIndexOf('-')));
                String s2 = (fnObj.substring(fnObj.lastIndexOf('-')+1, fnObj.length()));
                String s3 = (fnObj.substring(fnObj.indexOf('.')+1, fnObj.indexOf('-')));
                String s4 = objName+'.'+apiName.get(s3);
                
                if(!(ogValues.get(profileName).contains(fnObj))) {
                    if(s1 == 'true' || s1 == 'false'){
                        if(s2 == 'true' || s2 == 'false') {
                            if(fpId.containsKey(s4)){
                                fpUpd.add(new FieldPermissions(Id = fpId.get(s4)[0].Id, SobjectType = objName, 
                                                               Field = s4, PermissionsRead = Boolean.valueOf(s1),
                                                               PermissionsEdit = Boolean.valueOf(s2)));
                            }
                            else{
                                fpIns.add(new FieldPermissions(ParentId = psIns[0].Id, SobjectType = objName, 
                                                               Field = s4, PermissionsRead = Boolean.valueOf(s1),
                                                               PermissionsEdit = Boolean.valueOf(s2)));
                            }
                        }
                        else {
                            if(fpId.containsKey(s4)){
                                fpUpd.add(new FieldPermissions(Id = fpId.get(s4)[0].Id, ParentId = psIns[0].Id, SobjectType = objName, 
                                                               Field = s4, PermissionsRead = Boolean.valueOf(s1),
                                                               PermissionsEdit = false));
                            }
                            else{
                                fpIns.add(new FieldPermissions(ParentId = psIns[0].Id, SobjectType = objName, 
                                                               Field = s4, PermissionsRead = Boolean.valueOf(s1),
                                                               PermissionsEdit = false));
                            }
                        }
                    }
                    else{
                        if(s2 == 'true' || s2 == 'false') {
                            if(fpId.containsKey(s4)){
                                fpUpd.add(new FieldPermissions(Id = fpId.get(s4)[0].Id, ParentId = psIns[0].Id, SobjectType = objName, 
                                                               Field = s4, PermissionsRead = false,
                                                               PermissionsEdit = Boolean.valueOf(s2)));
                            }
                            else{
                                fpIns.add(new FieldPermissions(ParentId = psIns[0].Id, SobjectType = objName, 
                                                               Field = s4, PermissionsRead = false,
                                                               PermissionsEdit = Boolean.valueOf(s2)));
                            }
                        }
                    }
                }
            }
        }
        System.debug('*** '+fpDel);
        System.debug('**** '+fpIns);
        System.debug('***** '+fpUpd);
        if(!fpDel.isEmpty()) {
            Database.delete (fpDel, false);
        }
        if(!fpIns.isEmpty()) {
            Database.Insert(fpIns, false);
        }
        if(!fpUpd.isEmpty()) {
            Database.Update(fpUpd, false);
        }
    }
    
    public class WrapperClass{
        @AuraEnabled 
        public String fieldName;
        @AuraEnabled
        public list<ProfileWrapper> profileWrp;
        
        public WrapperClass(String fieldName, list<ProfileWrapper> profileWrp){
            this.fieldName = fieldName;  
            this.profileWrp = profileWrp;
        }
    }   
    
    public class ProfileWrapper{
        
        @AuraEnabled
        public boolean read = false;
        @AuraEnabled
        public boolean write = false;
        @AuraEnabled
        public String profile;
        
        public ProfileWrapper(String p,Boolean r,Boolean w){
            this.profile = p;
            this.read = r;
            this.write = w;
        }
    }
    
    public static String getUserSessionId(){
        String sessionId = '';
        PageReference reportPage = Page.GetSessionIdVF;
        Blob excelBlob;
        
        if(Test.isRunningTest()) {
            excelBlob = blob.valueOf('Unit.Test');
            return null;
        }
        else{
            excelBlob = reportPage.getContent();
            //vfContent = reportPage.getContent().toString();
            String vfContent = excelBlob.toString();
            Integer startP = vfContent.indexOf('Start_Of_Session_Id') + 'Start_Of_Session_Id'.length(),
                endP = vfContent.indexOf('End_Of_Session_Id');
            sessionId = vfContent.substring(startP, endP);
            return sessionId;
        }
    }
    public static MetadataService.MetadataPort createService(){
        
        MetadataService.MetadataPort service = new MetadataService.MetadataPort();
        service.SessionHeader = new MetadataService.SessionHeader_element();
        service.SessionHeader.sessionId = getUserSessionId();
        return service;
    }
}