public class CustomFieldComponentController {
   
    @AuraEnabled
    public static List<options> getObject(){
         //List<options> optionsList = new List<options>();
       /** List<Schema.SObjectType> gd = Schema.getGlobalDescribe().Values();    
        for(SObjectType f : gd){
            if(f.getDescribe().isCreateable() && !f.getDescribe().isCustomSetting() && f.getDescribe().isDeletable()
              && !f.getDescribe().isDeprecatedAndHidden() && f.getDescribe().isQueryable() 
              && f.getDescribe().isUndeletable() && f.getDescribe().getlabel() != 'Event' && f.getDescribe().getlabel() != 'Enhanced LetterHead' && f.getDescribe().getlabel() != 'List Email' 
              && f.getDescribe().getlabel() != 'Document' && f.getDescribe().getlabel() != 'Attachment' && f.getDescribe().getlabel() != 'Note' && f.getDescribe().getlabel() != 'Task' 
              && f.getDescribe().getlabel() != 'Event' && f.getDescribe().getlabel() != 'Email Message' && f.getDescribe().getlabel() != 'Idea Comment' && f.getDescribe().getlabel() != 'Asset Relationship' 
              && f.getDescribe().getlabel() != 'Image' && f.getDescribe().getlabel() != 'Broker'  ){
                   optionsList.add(new Options(f.getDescribe().getLabel(),f.getDescribe().getName()));   
               }
        } **/
        List<Schema.SObjectType> gd = Schema.getGlobalDescribe().Values();
        //List<string> options = new List<string>();
        List<options> optionsList = new List<options>();
        for(Schema.SObjectType obj : gd){
            //&& obj.getDescribe().isAvailable() && obj.getDescribe().isMaster()
            
            if(!obj.getDescribe().isCustomSetting() && obj.getDescribe().getName().endsWith('__c') || obj.getDescribe().getName() == 'Account' || obj.getDescribe().getName() == 'Contact' || obj.getDescribe().getName() == 'Case' || obj.getDescribe().getName() == 'Contract' || obj.getDescribe().getName() == 'Lead' || obj.getDescribe().getName() == 'OrderItem' || obj.getDescribe().getName() == 'Task' || obj.getDescribe().getName() == 'Quote'|| obj.getDescribe().getName() == 'Product2' ||  
               obj.getDescribe().getName() == 'Campaign' || obj.getDescribe().getName() == 'Opportunity' || obj.getDescribe().getName() == 'User' || obj.getDescribe().getName() == 'Order' || obj.getDescribe().getName() == 'Asset' || obj.getDescribe().getName() == 'QuoteLineItem' ||  obj.getDescribe().getName() == 'ProductItem' || obj.getDescribe().getName() == 'Pricebook2'){
                 
            
             optionsList.add(new Options(obj.getDescribe().getLabel(),obj.getDescribe().getName()));   
            
            }

        }
        //optionsList.sort(); 
        return optionsList;    
    }
    @AuraEnabled
    public static object getFields(String sObjectName){
        String result = '';
       
            SObjectType sObjName = Schema.getGlobalDescribe().get(sObjectName);         
            Map<String,Schema.SObjectField> mfields = sObjName.getDescribe().fields.getMap();
            For(Schema.SObjectField field : mfields.values()){
                If(field.getDescribe().isCustom()){
                    if(result != ''){
                        result += ',';
                    }
                    String jsonPart = '{';
                    jsonPart += '"label":"' + field.getDescribe().getLabel() + '",';
                    jsonPart += '"required":"' + (!field.getDescribe().isNillable() ) + '",';
                    jsonPart += '"type":"' + (field.getDescribe().getType()) + '",';
                    if(string.valueOf(field.getDescribe().getType()) == 'REFERENCE'){
                        jsonPart += '"isRef":' + true + ',';
                    }
                    else{
                        jsonPart += '"isRef":' + false + ',';
                    }
                    jsonPart += '"name":"' +field.getDescribe().getName() + '",';
                    jsonPart += '"length":' +field.getDescribe().getlength() + ',';
                    jsonPart += '"scale":' +field.getDescribe().getScale() + ',';
                    jsonPart += '"precision":' +field.getDescribe().getprecision() + ',';
                    jsonPart += '"referenceTo":"' +field.getDescribe().getreferenceTo() + '",';
                    jsonPart += '"defaultValue":"' +field.getDescribe().getDefaultValue()+'",';
                    List<Schema.PicklistEntry> ple = field.getDescribe().getPicklistValues();
                    string temp='';
                    Integer s = 0;
                    for( Schema.PicklistEntry pickListVal : ple){
                        temp+= pickListVal.getLabel();
                        if(s < (ple.size() - 1)){
                            temp+=',';
                        }
                        s++;
                        
                    }   
                    jsonPart += '"pickListValue":"' +temp +'",';
                    jsonPart += '"fromOrg":true';
                    jsonPart += '}';
                    result += jsonPart;
                    
                }
            }
        
        
        system.debug('@field Type'+result);
        return '['+result+']';
    }
    
    @AuraEnabled
    public static boolean upsertCustomfield(String strfromlex ,string sObjectName)
    {
        system.debug('@@@ strfromlex = ' + strfromlex);
        List<fieldWrapper> datalist = (List<fieldWrapper>)JSON.deserialize(strfromlex, List<fieldWrapper>.class);
        system.debug('@@@ datalist = ' + datalist);
        system.debug('@@@ datalistSize = ' + datalist.size());
        
        for(Integer i = 0 ; i < (datalist.size() / 10)+1 ; i++){
            List<fieldWrapper> lstTempRec = new List<fieldWrapper>();
            for(Integer j=(i*10);(j<(i*10)+10) && j< datalist.size() ; j++){
                lstTempRec.add(datalist.get(j));
            }
            //do perform
            MetadataService.MetadataPort service = createService();
            List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
            
            for(fieldWrapper wrapper: lstTempRec){
                System.debug('Iteration number: '+i);
                MetadataService.CustomField customField = new MetadataService.CustomField();
                System.debug('Name:  '+sObjectName+'.'+wrapper.name);
                customField.fullName = sObjectName+'.'+wrapper.name;
                customField.label = wrapper.label;
                
                if(wrapper.type == 'STRING'){
                    //system.debug('in text part');
                    customField.type_x = 'Text';
                    customField.length = Integer.valueOf(wrapper.length);
                    
                }
                if(wrapper.type == 'NUMBER' || wrapper.type == 'DOUBLE'){
                    //system.debug('in Number part');
                    customField.type_x = 'Number';
                    customField.scale = Integer.valueOf(wrapper.scale);
                    customField.precision = Integer.valueOf(wrapper.precision);
                    //customField.length = Integer.valueof(wrapper.length);
                    
                }
                
                if(wrapper.type == 'CURRENCY'){
                    customField.type_x = 'Currency';
                    customField.scale = Integer.valueOf(wrapper.scale);
                    customField.precision = Integer.valueOf(wrapper.precision);  
                    //customField.scale = Integer.valueOf(wrapper.scale);
                   // customField.precision = Integer.valueOf(wrapper.precision);
                    //customField.precision = wrapper.DecimlPlace;
                }
                if(wrapper.type == 'DATE'){
                    customField.type_x = 'Date';
                }
                if(wrapper.type == 'Time'){
                    customField.type_x = 'DateTime';
                }
                if(wrapper.type == 'PERCENT'){
                    //system.debug('in Percentage part');
                    customField.type_x = 'Percent';
                    customField.scale = Integer.valueOf(wrapper.scale);
                    customField.precision = Integer.valueOf(wrapper.precision);
                }
                if(wrapper.type == 'EMAIL'){
                    customField.type_x = 'Email';
                    
                }
                if(wrapper.type == 'BOOLEAN'){
                    customField.type_x = 'Checkbox';
                    //system.debug('value of default in boolean: '+wrapper.defaultValue);
                    
                        
                     customField.defaultvalue = wrapper.defaultValue;
                   
                    
                }
                if(wrapper.type == 'REFERENCE'){
                    System.debug('Field Type: '+wrapper.type);
                   
                    //new code
                    if(wrapper.fromOrg == false){
                        createLookupField(sObjectName, wrapper.label, wrapper.name, wrapper.referenceTo);
                    }
                    if(wrapper.fromOrg == true  && wrapper.isRef == false){
                        deleteSingleField(sObjectName+'.'+wrapper.name);
                        createLookupField(sObjectName, wrapper.label, wrapper.name, wrapper.referenceTo);
                    }
                    
                    
                }
                if(wrapper.type == 'PICKLIST'){
                    system.debug('in picklist part');
                    customField.type_x = 'Picklist';
                    Metadataservice.ValueSet pt = new Metadataservice.ValueSet();
                    Metadataservice.ValueSetValuesDefinition one = new Metadataservice.ValueSetValuesDefinition();
                    list<MetadataService.CustomValue> picklistvalues =new list<MetadataService.CustomValue>();
                    boolean con;
                    //System.debug('value of default: '+wrapper.defaultValue);
                    if(wrapper.defaultValue == 'true'){
                        
                     con= true;
                    }
                    else{
                        con = false;
                    }
                    for(string val:wrapper.pickListValue.split(',')){
                        MetadataService.CustomValue customval = new MetadataService.CustomValue();
                        customval.fullName =val;
                        if(con == true){
                            
                            customval.default_x= true;
                            con=false;
                            system.debug('con :-'+con);
                        }
                        else{
                            customval.default_x= false;
                            system.debug('in else block');
                            
                        }
                        customval.isActive =true;
                        customval.label=val;
                        picklistvalues.add(customval);
                    }
                    one.value = picklistvalues;
                    one.sorted=false;
                    pt.valueSetDefinition = one;
                    customField.valueSet = pt;
                }
                if(wrapper.type == 'PHONE'){
                    //system.debug('in PHONE part');
                    customField.type_x = 'Phone';
                    
                }
                if(wrapper.type == 'AUTONUMBER'){
                    //system.debug('in PHONE part');
                    customField.type_x = 'AutoNumber';
                    
                }
                if(wrapper.type == 'TEXTAREA'){
                    system.debug('in TEXTAREA part');
                    customField.type_x = 'TextArea';
                }
                if(wrapper.type != 'REFERENCE'){
                    fields.add(customField);
                }
                    System.debug('Field List Size: '+ fields.size());
                
                   
            }
            if(fields.size() >0){
                List<MetadataService.UpsertResult> results = service.upsertMetadata(fields);
                /**for(MetadataService.UpsertResult result: results){
                    system.debug('update custom label results success='+result);
                    System.debug('Result:'+result);
                } **/
                
                
            }
        }
        
        
        return true;
    }
    @AuraEnabled
    public static boolean deleteField(String strfromlex,string sObjectName)
    {   System.debug('Inside Delete Method');
     system.debug('@@@ strfromlex = ' + strfromlex);
     List<fieldWrapper> datalist = (List<fieldWrapper>)JSON.deserialize(strfromlex, List<fieldWrapper>.class);
     system.debug('@@@ datalist = ' + datalist);
     system.debug('@@@ datalistSize = ' + datalist.size());
     for(Integer i = 0 ; i < (datalist.size() / 10)+1 ; i++){
         List<fieldWrapper> lstTempRec = new List<fieldWrapper>();
         for(Integer j=(i*10);(j<(i*10)+10) && j< datalist.size() ; j++){
             lstTempRec.add(datalist.get(j));
         }
         //do perform
         List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
         List<MetadataService.DeleteResult> results;
         List<string> nameList = new List<String>();
         for(fieldWrapper wrapper: datalist){
             //System.debug('@@'+wrapper.Id);
             if(wrapper.name !='')
             {
                 namelist.add(sObjectName+'.'+wrapper.Name);
             }
         }
         if(namelist.size() > 0){
             MetadataService.MetadataPort service = createService();
             results = service.deleteMetadata('CustomField', nameList );
             system.debug('Iteration number : '+i);
             
         }
     }
     return true;
     
    }
     @AuraEnabled
    public static void deleteSingleField(String field)
    {   
      MetadataService.MetadataPort service = createService();
        List<MetadataService.DeleteResult> results =
            service.deleteMetadata(
                'CustomField', new String[] {field  });
       
     
    }
    
    @AuraEnabled
    public static void createLookupField(string objName, string label, string name, string rObj){
        system.debug('##'+objName);
        map<string,string> getApiName = new map<string,string>();
        List<Schema.SObjectType> gd = Schema.getGlobalDescribe().Values();    
        for(SObjectType f : gd){
            getApiName.put(f.getDescribe().getlabel(),f.getDescribe().getName());      
        }
        system.debug('##'+getApiName.get(rObj));
        
        MetadataService.MetadataPort service = createService();
        List<MetadataService.CustomField>  fields = new List<MetadataService.CustomField> ();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        //account.fieldname__c
        customField.fullName = objName+'.'+name;
        customField.label = label;
        String temp = name;
        temp = temp.removeEnd('__c');
        customField.type_x = 'Lookup';
        customField.relationshipLabel = temp+'s';
        customField.relationshipName = temp+'s';
        customField.referenceTo = rObj;
        fields.add(customField);
        
        List<MetadataService.SaveResult> results =service.createMetadata(fields);
            
        
        
    }
    
   
    
   
    
    
    public static MetadataService.MetadataPort createService()
    {
        MetadataService.MetadataPort service = new MetadataService.MetadataPort();
        service.SessionHeader = new MetadataService.SessionHeader_element();
        service.SessionHeader.sessionId = fetchUserSessionId();
        //system.debug(fetchUserSessionId());
        return service;
    }
    public static String fetchUserSessionId(){
        String sessionId = '';
        PageReference reportPage = Page.GetSessionIdVF;
        Blob excelBlob;
        
        if(Test.isRunningTest()) {
            excelBlob = blob.valueOf('Unit.Test');
            return null;
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
    public static List<string> getRecords(){
         List<String> options = new List<String>();
        map<string,string> getApiName = new map<string,string>();
        List<Schema.SObjectType> gd = Schema.getGlobalDescribe().Values();    
        for(SObjectType f : gd){
            getApiName.put(f.getDescribe().getlabel(),f.getDescribe().getName());   
            
            if(f.getDescribe().isCreateable() && !f.getDescribe().isCustomSetting() && f.getDescribe().isDeletable()
              && !f.getDescribe().isDeprecatedAndHidden() && f.getDescribe().isQueryable() && f.getDescribe().isSearchable() 
              && f.getDescribe().isUndeletable() && f.getDescribe().getlabel() != 'Event' && f.getDescribe().getlabel() != 'Enhanced LetterHead' && f.getDescribe().getlabel() != 'List Email' 
              && f.getDescribe().getlabel() != 'Document' && f.getDescribe().getlabel() != 'Attachment' && f.getDescribe().getlabel() != 'Note' && f.getDescribe().getlabel() != 'Task' 
              && f.getDescribe().getlabel() != 'Event' && f.getDescribe().getlabel() != 'Email Message' && f.getDescribe().getlabel() != 'Idea Comment' && f.getDescribe().getlabel() != 'Asset Relationship' 
              && f.getDescribe().getlabel() != 'Image' && f.getDescribe().getlabel() != 'Broker'  ){
                string temp = String.valueOf(f.getDescribe().getName());
                       options.add(temp);
                  
                        
            }
            
        }
        
       
        
        return options;
    }
    
    
    
    public class fieldWrapper{        
        
        public String CustomValue;
        //new val:label name type length precision required
        public String name;
        public String type;
        public Integer length;
        public Integer precision;
        public String required;
        public String label;
        public Integer scale;
        public String pickListValue;
        public String defaultValue;
        public String referenceTo;
        public boolean fromOrg;
        public boolean isRef;
    }
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