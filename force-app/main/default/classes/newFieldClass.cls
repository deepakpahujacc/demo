public class newFieldClass {
    public static String getUserSessionId(){
        String sessionId = '';
        PageReference reportPage = Page.GetSessionIdVf;
        Blob excelBlob;
        if(Test.isRunningTest()){
            excelBlob = blob.valueOf('Unit.Test');
            return NULL;
        }
        else{
            excelBlob = reportPage.getContent();
            String vfContent = excelBlob.toString();
            Integer startP = vfContent.indexOf('Start_Of_Session_Id') + 'Start_Of_Session_Id'.length(),
                endP = vfContent.indexOf('End_Of_Session_Id');
            sessionId = vfContent.substring(startP, endP);
            return sessionId;
        }
    }
    @AuraEnabled
    public static void createCheckboxField(string objName, string label, string name, string defVal){
        
        MetadataService.MetadataPort service = createService();
        List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = objName+'.'+name;
        customField.label = label;
        
        customField.type_x = 'Checkbox';
        customField.defaultvalue = defVal;   
        fields.add(customField);
        if(!Test.isRunningTest()){
            service.createMetadata(fields);
        }
    }
    
    @AuraEnabled
    public static void createTextField(string objName, string label, string name, integer len, boolean required, boolean externalID){
        
        MetadataService.MetadataPort service = createService();
        List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = objName+'.'+name;
        customField.label = label;
        
        customField.type_x = 'Text';
        customField.length = len; 
        customField.required = required;
        customField.externalID = externalID;
        fields.add(customField);
        if(!Test.isRunningTest()){
            service.createMetadata(fields);
        }
    }
    
    @AuraEnabled
    public static void createEmailField(string objName, string label, string name, boolean required, boolean uniqueID, boolean externalID){
        
        MetadataService.MetadataPort service = createService();
        List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = objName+'.'+name;
        customField.label = label;
        
        customField.type_x = 'Email';
        customField.required = required;
        customField.Unique = uniqueID;
        customField.externalID = externalID;
        fields.add(customField);
        if(!Test.isRunningTest()){
            service.createMetadata(fields);
        }
    }
    
    @AuraEnabled
    public static void createCurrencyField(string objName, string label, string name, integer len, integer dPlace, boolean required){
        
        MetadataService.MetadataPort service = createService();
        List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = objName+'.'+name;
        customField.label = label;
        
        customField.type_x = 'Currency';
        customField.required = required;
        customField.scale = dPlace;
        customField.precision = len;  
        fields.add(customField);
        if(!Test.isRunningTest()){
            service.createMetadata(fields);
        }
    }
    
    @AuraEnabled
    public static void createNumberField(string objName, string label, string name, integer len, integer dPlace, boolean required, boolean uniqueID, boolean externalID){
        
        MetadataService.MetadataPort service = createService();
        List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = objName+'.'+name;
        customField.label = label;
        
        customField.type_x = 'Number';
        customField.required = required;
        customField.Unique = uniqueID;
        customField.externalID = externalID;
        customField.scale = dPlace;
        customField.precision = len;  
        fields.add(customField);
        if(!Test.isRunningTest()){
            service.createMetadata(fields);
        }
    }
    
    @AuraEnabled
    public static void createDateField(string objName, string label, string name, boolean required){
        
        MetadataService.MetadataPort service = createService();
        List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = objName+'.'+name;
        customField.label = label;
        
        customField.type_x = 'Date';
        customField.required = required;
        fields.add(customField);
        if(!Test.isRunningTest()){
            service.createMetadata(fields);
        }
    }
    
    @AuraEnabled
    public static void createDateTimeField(string objName, string label, string name, boolean required){
        
        MetadataService.MetadataPort service = createService();
        List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = objName+'.'+name;
        customField.label = label;
        
        customField.type_x = 'DateTime';
        customField.required = required;
        fields.add(customField);
        if(!Test.isRunningTest()){
            service.createMetadata(fields);
        }
    }
    
    @AuraEnabled
    public static void createPercentField(string objName, string label, string name, integer len, integer dPlace, boolean required){
        
        MetadataService.MetadataPort service = createService();
        List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = objName+'.'+name;
        customField.label = label;
        
        customField.type_x = 'Percent';
        customField.required = required;
        customField.scale = dPlace;
        customField.precision = len;  
        fields.add(customField);
        if(!Test.isRunningTest()){
            service.createMetadata(fields);
        }
    }
    
    @AuraEnabled
    public static void createPhoneField(string objName, string label, string name, boolean required){
        
        MetadataService.MetadataPort service = createService();
        List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = objName+'.'+name;
        customField.label = label;
        
        customField.type_x = 'Phone';
        customField.required = required;
        fields.add(customField);
        if(!Test.isRunningTest()){
            service.createMetadata(fields);
        }
    }
    
    @AuraEnabled
    public static void createPicklistField(string objName, string label, string name, string values, boolean required){
        
        MetadataService.MetadataPort service = createService();
        List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = objName+'.'+name;
        customField.label = label;
        
        system.debug('in picklist part');
        customField.type_x = 'Picklist';
        customField.required = required;
        Metadataservice.ValueSet pt = new Metadataservice.ValueSet();
        Metadataservice.ValueSetValuesDefinition one = new Metadataservice.ValueSetValuesDefinition();
        list<MetadataService.CustomValue> picklistvalues =new list<MetadataService.CustomValue>();
        for(string val:values.split(',')){
            MetadataService.CustomValue customval = new MetadataService.CustomValue();
            customval.fullName =val;
            customval.default_x= false;
            system.debug('in else block');
            customval.isActive =true;
            customval.label=val;
            picklistvalues.add(customval);
        }
        one.value = picklistvalues;
        one.sorted=false;
        pt.valueSetDefinition = one;
        customField.valueSet = pt;
        
        fields.add(customField);
        if(!Test.isRunningTest()){
            service.createMetadata(fields);
        }
    }
    
    @AuraEnabled
    public static void createTimeField(string objName, string label, string name, boolean required){
        
        MetadataService.MetadataPort service = createService();
        List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = objName+'.'+name;
        customField.label = label;
        
        customField.type_x = 'Time';
        customField.required = required;
        fields.add(customField);
        if(!Test.isRunningTest()){
            service.createMetadata(fields);
        }
    }
    
    @AuraEnabled
    public static void createUrlField(string objName, string label, string name, boolean required){
        
        MetadataService.MetadataPort service = createService();
        List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = objName+'.'+name;
        customField.label = label;
        
        customField.type_x = 'Url';
        customField.required = required;
        fields.add(customField);
        if(!Test.isRunningTest()){
            service.createMetadata(fields);
        }
    }
    
    @AuraEnabled
    public static void createANumberField(string objName, string label, string name, boolean required){
        
        MetadataService.MetadataPort service = createService();
        List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = objName+'.'+name;
        customField.label = label;
        
        customField.type_x = 'AutoNumber';
        customField.required = required;
        fields.add(customField);
        if(!Test.isRunningTest()){
            service.createMetadata(fields);
        }
    }
    
    @AuraEnabled
    public static void createLookupField(string objName, string label, string name, string rObj, boolean required){
        system.debug('r'+required);
        //Dynamic String For Relationship Name
        String CharList = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        Integer position;
        String Res;
        Integer LengthRequired = 6;
        for(Integer i = 0; i <= LengthRequired; i++) {
            position = Integer.valueof(String.valueof(Math.roundToLong(CharList.length()*Math.random()))) -1;
            Res = Res+CharList.substring(position,position+1);
        }
        //Api Name For the Reference Object
        map<string,string> getApiName = new map<string,string>();
        List<Schema.SObjectType> gd = Schema.getGlobalDescribe().Values();    
        for(SObjectType f : gd){
            getApiName.put(f.getDescribe().getlabel(),f.getDescribe().getName());      
        }
        MetadataService.MetadataPort service = createService();
        List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = objName+'.'+name;
        customField.label = label;
        
        customField.type_x = 'Lookup';
        //customField.required = required;
        customField.relationshipLabel = Res;
        customField.relationshipName = Res;
        customField.referenceTo = getApiName.get(rObj);
        fields.add(customField);
        if(!Test.isRunningTest()){
            service.createMetadata(fields);
        }
    }
    
    @AuraEnabled
    public static List<string> getRecords(){
        List<String> options = new List<String>();
        List<Schema.SObjectType> gd = Schema.getGlobalDescribe().Values();    
        for(SObjectType f : gd){ 
            if(f.getDescribe().isAccessible() && f.getDescribe().isCreateable() && !f.getDescribe().isCustomSetting() && f.getDescribe().isDeletable()
              && !f.getDescribe().isDeprecatedAndHidden() && f.getDescribe().isQueryable() && f.getDescribe().isSearchable() 
              && f.getDescribe().isUndeletable() && f.getDescribe().getlabel() != 'Event' && f.getDescribe().getlabel() != 'Enhanced LetterHead' && f.getDescribe().getlabel() != 'List Email' 
              && f.getDescribe().getlabel() != 'Document' && f.getDescribe().getlabel() != 'Attachment' && f.getDescribe().getlabel() != 'Note' && f.getDescribe().getlabel() != 'Task' 
              && f.getDescribe().getlabel() != 'Event' && f.getDescribe().getlabel() != 'Email Message' && f.getDescribe().getlabel() != 'Idea Comment' && f.getDescribe().getlabel() != 'Asset Relationship' 
              && f.getDescribe().getlabel() != 'Image' && f.getDescribe().getlabel() != 'Broker' ){
                options.add(f.getDescribe().getlabel());
            }
        }
        return options;
    }
    
    @AuraEnabled
    public static list<string> getFields(string objName, string fieldName){
        boolean m = false;
        list<string> mval = new list<string>();
        map<string,SObjectField> fList = schema.getGlobalDescribe().get(objName).getDescribe().fields.getMap();
        for(string str: fList.keySet()){
            if(fList.get(str).getDescribe().getName() == fieldName)
            {
                m = true;
            }
        }
        system.debug('-*'+m);
        if(m){
            mval.add('True');
        }
        else{
            mval.add('False');
        }
        system.debug('**'+mval);
        return mval;
    }
    
    public static MetadataService.MetadataPort createService()
    {
        MetadataService.MetadataPort service = new MetadataService.MetadataPort();
        service.SessionHeader = new MetadataService.SessionHeader_element();
        service.SessionHeader.sessionId = getUserSessionId();
        //system.debug(fetchUserSessionId());
        return service;
    }
}