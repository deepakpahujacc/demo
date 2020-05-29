public class CustomMetadataTypesRecordController {
    @AuraEnabled
    public static List<String> getObjectlist(){
        List<String> objectList = new List<String>();
        For(Schema.sObjectType sobj: schema.getGlobalDescribe().values()){
            if(sobj.getDescribe().isQueryable())
                if(string.valueOf(sobj.getDescribe().getName()).contains('__mdt'))
                
                objectList.add(sobj.getDescribe().getName()+'####'+sobj.getDescribe().getLabel());
        }
        return objectList;
    }
    @AuraEnabled
    public static String getFieldSet(String sObjectName) {
        String result = '';
        try{
            SObjectType sObjName = Schema.getGlobalDescribe().get(sObjectName);         
            Map<String,Schema.SObjectField> mfields = sObjName.getDescribe().fields.getMap();
            For(Schema.SObjectField field : mfields.values()){
                If(field.getDescribe().isAccessible() && !field.getDescribe().getName().EndsWith('Id')
                   && field.getDescribe().getName()!='NamespacePrefix'
                   && field.getDescribe().getName()!='Language'
                   //&& field.getDescribe().getName()!='DeveloperName' 
                   //&& field.getDescribe().getName()!='MasterLabel' 
                   &&  field.getDescribe().getName()!='Label'                  
                   && field.getDescribe().getName()!='QualifiedApiName' 
                   //&&field.getDescribe().gettype()!='REFERNCE' 
                   && field.getDescribe().getName()!='IsDeleted' ){
                       if(result != ''){
                           result += ',';
                       }
                       String jsonPart = '{';
                       jsonPart += '"label":"' + field.getDescribe().getLabel() + '",';
                       jsonPart += '"required":"' + (!field.getDescribe().isNillable() ) + '",';
                       jsonPart += '"type":"' + ( field.getDescribe().gettype()) + '",';
                       jsonPart += '"name":"' +field.getDescribe().getName() + '",';
                       jsonPart += '"editable":"' +field.getDescribe().isUpdateable()+ '"';
                       jsonPart += '}';
                       result += jsonPart;
                   }
            }
        }
        catch(Exception e){
            result += e.getLineNumber() + ' : ' + e.getMessage();
        }
        
        return '['+result+']';
    }
    @AuraEnabled
    public static String getRecords(String sObjectName, String fieldNameJson){  
        System.debug('sObjectName  '+sObjectName);
        System.debug('fieldNameJson   ' +fieldNameJson);
        List<sObject> lstResult = new List<sObject>();
        String result = '[]';
        try{
            List<String> fieldNames = (List<String>) JSON.deserialize(fieldNameJson, List<String>.class);
            Set<String> setFieldNames = new Set<String>();
            String query = 'SELECT ' + String.join(fieldNames, ',') + ' FROM ' + sObjectName; 
            for(sObject s : Database.query(query)){
                lstResult.add(s);
            }
            if(lstResult.size() > 0) {
                result = JSON.serialize(lstResult);
            }
        }
        catch(Exception e){
            result += e.getLineNumber() + ' : ' + e.getMessage();
        }
        
        return result;
    }
    @AuraEnabled
    public static void UpdateRecords(List<object> recordsdata, String objectName, List<object> fieldSetValues,List<object> toDeleteRecord){
        System.debug('recordsdata  :' +recordsdata);
        System.debug('objectName  :' +objectName);
        System.debug('fieldSetValues  :' +fieldSetValues);
        System.debug('toDeleteRecord  :' +toDeleteRecord); 
        Map<String,string> fieldMetaDataMap = new Map<String,String>();
        objectName = objectName.removeEnd('__mdt');
        Boolean setData = true;
        List<String> FieldList = new List<String>();
        for(object obj : fieldSetValues){
            FieldList.add(JSON.serialize(obj)) ;  
        }
        for(String fieldString : FieldList){
            JSONParser parserfield = JSON.createParser(fieldString);
            String Label = '';
            String type = '';
            system.debug('fieldstring----'+ fieldstring);
            while (parserfield.nextToken() != null ) {
                system.debug(parserfield.getCurrentToken());
                
                if ((parserfield.getCurrentToken() == JSONToken.FIELD_NAME) && (parserfield.getText() == 'type')) {
                    parserfield.nextToken();                
                    type = parserfield.getText();
                }
                if ((parserfield.getCurrentToken() == JSONToken.FIELD_NAME) && (parserfield.getText() == 'name')) {
                    parserfield.nextToken();                
                    Label = parserfield.getText();
                }
            }
            if(Label != null && type !=null){
                //Label = Label.replaceAll('\\s+','_');
                fieldMetaDataMap.put(Label, type);
            }
        }
        Map<Integer,List<wrapperclass>> wrapperMap = new Map<Integer,List<wrapperclass>>();
        Integer i=1;
        if(recordsdata.size()>0){
            for(object obj : recordsdata){ 
                List<Wrapperclass> wrapperlist = new List<wrapperclass>();       
                Map<String, Object> m = (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(obj));
                //Map<String, string> m = (Map<String, string>) JSON.deserialize(JSON.serialize(String.Valueof(obj)),String.class);
                
                
                    for(string key : m.keyset()){        
                        wrapperlist.add(new wrapperclass(key,string.valueOf(m.get(key)))); 
                        //wrapperlist.add(new wrapperclass(key,m.get(key)));   
                    }
                
                wrapperMap.put(i,wrapperlist);
                i++;                
            }
            Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();
            for(integer index : wrapperMap.keyset()){
                Metadata.CustomMetadata metadataRec =  new Metadata.CustomMetadata();
                String MasterLabel =''; 
                String Developername ='';
                for(wrapperclass wrapperData : wrapperMap.get(index)){               
                    Metadata.CustomMetadataValue customFieldtoUpdate = new Metadata.CustomMetadataValue();
                    if(wrapperData.fieldname!='MasterLabel'&& wrapperData.fieldname!='DeveloperName' 
                       && wrapperData.fieldname !='attributes' ){   
                           if(String.valueOf(wrapperData.fieldname).contains('__c') || Test.isRunningTest()){                               
                               String DataType = '';
                               System.debug(wrapperData.fieldname);
                               System.debug(fieldMetaDataMap);
                               if(fieldMetaDataMap.get(String.valueOf(wrapperData.fieldname)) == 'DATE') {
                                   customFieldtoUpdate.field=wrapperData.fieldname; 
                                   date ff = date.valueOf(wrapperData.value);  
                                   customFieldtoUpdate.value =ff;
                               }
                               
                               else if(fieldMetaDataMap.get(String.valueOf(wrapperData.fieldname)) == 'DATETIME'){
                                   customFieldtoUpdate.field=wrapperData.fieldname;
                                   String tryingDatetime = JSON.serialize(wrapperData.value);
                                   customFieldtoUpdate.value = JSON.deserialize(tryingDatetime, DateTime.class) ;
                               }
                               else if(fieldMetaDataMap.get(String.valueOf(wrapperData.fieldname)) == 'Boolean'){
                                   customFieldtoUpdate.field=wrapperData.fieldname; 
                                   Boolean ff = Boolean.valueOf(wrapperData.value);  
                                   customFieldtoUpdate.value =ff;    
                               }
                               else if(fieldMetaDataMap.get(String.valueOf(wrapperData.fieldname)) == 'REFERENCE'){
                                   customFieldtoUpdate.field=wrapperData.fieldname;
                                   string recordId = wrapperData.value;
                                   String objectAPIName = '';
                                   string keyPrefix = recordId.substring(0,3);
                                   for( Schema.SObjectType obj : Schema.getGlobalDescribe().Values() ){
                                       String prefix = obj.getDescribe().getKeyPrefix();
                                       if(prefix == keyPrefix){
                                           objectAPIName = obj.getDescribe().getName();
                                           break;
                                       }
                                   }
                                   String queryString ='Select developername From '+ objectAPIName +' where id =\''+ wrapperData.value+'\'';                                   
                                   sobject data;
                                   string fieldname;
                                   if(!Test.isRunningTest()){
                                       data = Database.query(queryString);
                                       fieldname= String.valueOf(data.get('DeveloperName'));
                                   }
                                   customFieldtoUpdate.value =fieldname; 
                               }
                               else{
                                   customFieldtoUpdate.field=wrapperData.fieldname;                              
                                   customFieldtoUpdate.value =wrapperData.value;
                               }
                               metadataRec.values.add(customFieldtoUpdate);
                           }                           
                       }
                    if(wrapperData.fieldname=='MasterLabel'){
                        MasterLabel =  wrapperData.value;                   
                    }
                    
                    if(wrapperData.fieldname=='DeveloperName'){
                        Developername = wrapperData.value;
                        Developername = Developername.replaceAll('\\s+','_');
                    }
                    setdata= false;
                }
                metadataRec.fullName =objectName+'.'+Developername;
                metadataRec.label = MasterLabel;
                mdContainer.addMetadata(metadataRec);
            }
            CustomMetadataCallback callback = new CustomMetadataCallback();
            System.debug('Call back : '+ callback);
            if(!Test.isRunningTest()){
            Id jobId = Metadata.Operations.enqueueDeployment(mdContainer, callback); 
            }
        }
        if(toDeleteRecord.size()>0){
            if(!test.isRunningTest())
                objectName = objectName+'__mdt';
            Map<Integer,List<wrapperclass>> wrapperMapToDelete = new Map<Integer,List<wrapperclass>>();
            Integer j=1;
            for(object obj : toDeleteRecord){       
                List<Wrapperclass> wrapperlist = new List<wrapperclass>();       
                Map<String, Object> m = (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(obj));          
                for(string key : m.keyset()){
                    wrapperlist.add(new wrapperclass(key,string.valueOf(m.get(key))));   
                }
                wrapperMapToDelete.put(j,wrapperlist);
                j++;
            }
            for(integer index : wrapperMapToDelete.keyset()){
                for(wrapperclass wrapperData : wrapperMapToDelete.get(index)){
                    if(wrapperData.fieldname=='Id'&&wrapperData.value!=null){
                        getthesessionid(wrapperData.value,objectName);    
                    }  
                }
            }   
        }
    }
    @future(callout=true)
    public static void getthesessionid(string ids, string objName){     
        String sessionId = UserInfo.getSessionId();
        string query;
        query = 'Select id,QualifiedApiName from '+objName+' where id =  \'' + String.escapeSingleQuotes(ids) + '\'';  
        System.debug('query  : +'+query);
        sObject obje;
        String mLabel;
        if(!test.isRunningTest()){
            obje = Database.query(query);        
            mLabel = String.ValueOf(obje.get('QualifiedApiName'));
        }
        MetadataService.MetadataPort service = new MetadataService.MetadataPort();
        service.SessionHeader = new MetadataService.SessionHeader_element();
        service.SessionHeader.sessionId =sessionId;
        List<String> recordsToDelete = new List<String>();
        recordsToDelete.add(objName+'.'+ mLabel);
        
        if(!Test.isRunningTest()){
            service.deleteMetadata('CustomMetadata', recordsToDelete);
         }
    }
    
    @AuraEnabled
    public static List<string> fetchPicklistValue(string fieldData , string objectnames){
        System.debug('fieldData '+fieldData);
         System.debug('objectnames '+objectnames);
        
        String ObjectName = '';
        String fieldName = '';
        String DurbleId = '';
        
        List<String> toReturn = new List<String>();
        
        JSONParser parserfield = JSON.createParser(fieldData);
        while (parserfield.nextToken() != null) {
            if ((parserfield.getCurrentToken() == JSONToken.FIELD_NAME) && (parserfield.getText() == 'label')) {
                parserfield.nextToken();                
                fieldName = parserfield.getText();    
            }
        }
        objectnames = objectnames.replaceAll('__mdt','');
        objectnames = objectnames.replaceAll('\"','');
        
        List<FieldDefinition> fdData =[Select DurableId From FieldDefinition where EntityDefinition.DeveloperName=:objectnames and developername =:fieldName];
        for(FieldDefinition fd : fdData ){
            DurbleId = string.valueOf(fd.DurableId);
        }
        
        List<PicklistValueInfo> plvaue = [SELECT  Label, Value FROM PicklistValueInfo WHERE EntityParticleId =:DurbleId and isActive = true ];
        
        System.debug('plvaue' + plvaue);
        for(PicklistValueInfo plv : plvaue){
            String temp = plv.Label+'####'+plv.Value;
            toReturn.add(temp);
        }  
        return toReturn;
    }
    @AuraEnabled 
    public static sObject fetchLookupObjectName(String fieldId){
        System.debug('fieldId '+fieldId);
        String objectAPIName = '';
        String keyPrefix = fieldid.substring(0,3);
        for( Schema.SObjectType obj : Schema.getGlobalDescribe().Values() ){
            String prefix = obj.getDescribe().getKeyPrefix();
            if(prefix == keyPrefix){
                objectAPIName = obj.getDescribe().getName();
                break;
            }
        }
        string query;
        	 if(!Test.isRunningTest()){
            query = 'select Label from ' +objectAPIName +' where id =  \'' + String.escapeSingleQuotes(fieldId) + '\'';
        	sObject objDetail = Database.query(query);
                 return objDetail;
             }
        else{
            return null;
        }
    }
    @AuraEnabled
    public static List<sobject> fetchLookupObjectData(String objectData,String queryTerm,String objectname){
        String LookupFieldName = '';
        String LookupObjectName = '';
        JSONParser parserfield = JSON.createParser(objectData);
        while (parserfield.nextToken() != null) {
            if ((parserfield.getCurrentToken() == JSONToken.FIELD_NAME) && (parserfield.getText() == 'name')) {
                parserfield.nextToken();                
                LookupFieldName = parserfield.getText();    
            }
        }
        objectname = objectname.replaceAll('\"','');
        Schema.DescribeFieldResult fetchLookupObject = Schema.getGlobalDescribe().get(objectname).getDescribe().fields.getMap().get(LookupFieldName).getDescribe();
        for(Schema.SObjectType reference : fetchLookupObject.getReferenceTo()) {
            LookupObjectName = reference.getDescribe().getName();
        }
        System.debug('queryTerm' + queryTerm);
        string LikeSearchString = queryTerm + '%';
        String Query;
        if(!Test.isRunningTest()){
            Query = 'Select Id,developername From '+LookupObjectName+ ' where developername Like  \''+ LikeSearchString +'\'';       
        List<sobject> Lookupdata = Database.query(Query);
        return Lookupdata;
        }
        else{
            return null;
        }
    }
    class wrapperclass{
        string fieldname;
        string value;
        public wrapperclass(string fieldname, string value){
            this.fieldname=fieldname;
            this.value = value;
        }
    } 
}