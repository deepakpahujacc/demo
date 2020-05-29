global class MutipleRecordExportController{
   
    @AuraEnabled
    public static List<WrapperClass> fetchsObject(){
        List<WrapperClass> wrapList = new List<WrapperClass>();  
        List<string> sobjectlist = new List<string>();
        List<Schema.SObjectType> allObjects = Schema.getGlobalDescribe().Values();
        for(SObjectType sotype : allObjects){
            if(sotype.getDescribe().isDeletable()){
                string sobj =sotype.getDescribe().getLabel(); 
                if(!sotype.getDescribe().iscustom()){
                    sobj = sobj.replaceAll('\\s', ''); 
                }
                sobjectlist.add(sobj);
                
            }
        }  
        sobjectlist.sort();
        for(String objList : sobjectlist){
            wrapList.add(new WrapperClass(objList,false,false,false,false));               
        }
        return wrapList;
    }
    
    @AuraEnabled
    public static String ExportRecord(String wrapList){
        System.debug('wrapList   ' +wrapList);
        String fieldsobjName;
        String RecordTypeobjName;
        String fieldsetobjName;
        String LayoutobjName;
        
        List<WrapperClass> reqDataList = (List<WrapperClass>)JSON.deserialize(wrapList, List<WrapperClass>.class);
        
        for(WrapperClass wrapData : reqDataList ){
            System.debug('wrapData' + wrapData);
            wrapData.sobjName = wrapData.sobjName.replace(' ','_'); 
            if(wrapData.fieldRecord == true){
                if(fieldsobjName==null){
                    fieldsobjName  = wrapData.sobjName;  
                }
                else{
                    fieldsobjName=fieldsobjName+','+wrapData.sobjName;  
                }
            }
            if(wrapData.RecordtypeData == true){
                if(RecordTypeobjName == null){
                    RecordTypeobjName = wrapData.sobjName;  
                }
                else{
                    RecordTypeobjName =RecordTypeobjName +','+wrapData.sobjName;  
                }
            }
            if(wrapData.fieldsetRecord == true){
                if(fieldsetobjName== null){
                    fieldsetobjName= wrapData.sobjName;  
                }
                else{
                    fieldsetobjName=fieldsetobjName+','+wrapData.sobjName;  
                }   
            }
            if(wrapData.LayoutData == true){
                if(LayoutobjName== null){
                    LayoutobjName= wrapData.sobjName;  
                }
                else{
                    LayoutobjName=LayoutobjName+','+wrapData.sobjName;  
                }   
            }
        }
        
        PageReference excelPage = Page.ExportAsCsv;
        
        if(fieldsobjName!=''){
            excelPage.getParameters().put('objNameForFields',fieldsobjName);
        }
        if(RecordTypeobjName!=''){ 
            excelPage.getParameters().put('objectNameForRecordType',RecordTypeobjName);
        }
        if(fieldsetobjName!=''){
            excelPage.getParameters().put('objectNameForFieldSet',fieldsetobjName);
        }
        if(LayoutobjName!=''){
            excelPage.getParameters().put('objectNameForLayoutData',LayoutobjName);
        }
        Blob excelBlob;
        
        if(Test.isRunningTest()) {
		excelBlob = blob.valueOf('Unit.Test');
        }
        else{
        excelBlob = excelPage.getContent();
        }
        String base64Excel = EncodingUtil.base64Encode(excelBlob);
        return base64Excel; 
        
    }
    @AuraEnabled
    public static Void CreateObject(String objName, String pluralName, String RecordName, String StartNumber){
        CreateObjectFutureMethod(objName,pluralName,RecordName,StartNumber);
    }
    @future(callout=true)
    public static void CreateObjectFutureMethod(String objvar,String pluralName, String RecordName, String StartNumber){
        System.debug('objvar  '+objvar);
         System.debug('pluralName  '+pluralName);
         System.debug('RecordName  '+RecordName);
         System.debug('StartNumber  '+StartNumber);
        String sessionId = UserInfo.getSessionId();
        MetadataService.MetadataPort service = new MetadataService.MetadataPort();
        service.SessionHeader = new MetadataService.SessionHeader_element();
        service.SessionHeader.sessionId =sessionId;
        List<MetadataService.Metadata> fields = new List<MetadataService.Metadata>();
        List<MetadataService.Metadata> fields1 = new List<MetadataService.Metadata>();
        MetadataService.CustomObject customObject = new MetadataService.CustomObject();
        String fullName = objvar.replaceAll('\\s', ''); 
        customObject.fullName = fullName+'__c';
        customObject.label = objvar;
        customObject.pluralLabel = pluralName;
        customObject.nameField = new MetadataService.CustomField();
        if(StartNumber == '')
        customObject.nameField.type_x = 'Text';
        else{
            customObject.nameField.type_x = 'AutoNumber';
            customObject.nameField.displayFormat = '{'+StartNumber+'}';
            
        }
        customObject.nameField.label = RecordName;
        customObject.deploymentStatus = 'Deployed';
        customObject.sharingModel = 'ReadWrite';
        fields.add(customobject);
        
        if(!Test.isRunningTest()) {
         service.createMetadata(fields);
         }
    }   
    global class WrapperClass{
        @AuraEnabled
        public Boolean fieldRecord;
        @AuraEnabled
        public Boolean RecordtypeData;
        @AuraEnabled
        public Boolean fieldsetRecord;
        @AuraEnabled
        public Boolean LayoutData;
        @AuraEnabled
        public String sobjName;   
        
        public WrapperClass(String sobjName,Boolean fieldRecord,Boolean fieldsetRecord,Boolean RecordtypeData,Boolean LayoutData){        
            this.sobjName= sobjName;     
            this.fieldRecord= fieldRecord;  
            this.RecordtypeData= RecordtypeData;  
            this.fieldsetRecord= fieldsetRecord;  
            this.LayoutData=LayoutData;  
        }
    }
}