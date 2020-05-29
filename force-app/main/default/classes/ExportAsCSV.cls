public  with sharing class ExportAsCSV {
    // public List<sObject> objLst {get;set;} 
    public String coma {get;set;}
    public String newLine {get;set;}
    public string xmlheader {get;set;}
    public string endfile{get;set;}
    public List<wrapperClass> wrapperList{get; set;}
    public List<wrapperClass> RecordTypewrapperList{get; set;}
    // public List<wrapperClass> FieldListWrapper{get; set;}
    public List<wrapperClass> FieldsetListWrapper{get; set;}
    public List<wrapperClass2> wrapperclass2list{get;set;}
    public List<wrapperClass3> sectionDetailwrapper{get;set;}
    public List<wrapperClass4> sectionMetaDatawrapper{get;set;}
    public List<wrapperClass> LayoutWrapperList{get; set;}
    //public List<wrapperClass4> wrapperclass4list{get;set;}
    
    public ExportAsCSV(){
        xmlheader ='<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
        endfile = '</Workbook>';
        coma = ',';
        newLine = '\n';
        
        String obj;
        String Fieldsetobj1;
        String Recordtypeobj;
        String Layoutobj;
        
        if(System.currentPageReference().getParameters().get('objNameForFields') !=  '' ||System.currentPageReference().getParameters().get('objNameForFields') !=  Null )        
            obj = System.currentPageReference().getParameters().get('objNameForFields');  
        
        if(System.currentPageReference().getParameters().get('objectNameForRecordType') !=  '' ||System.currentPageReference().getParameters().get('objectNameForRecordType') !=  Null )         
            Recordtypeobj = System.currentPageReference().getParameters().get('objectNameForRecordType');   
        
        if(System.currentPageReference().getParameters().get('objectNameForFieldSet') !=  '' ||System.currentPageReference().getParameters().get('objectNameForFieldSet') !=  Null )  
            Fieldsetobj1 = System.currentPageReference().getParameters().get('objectNameForFieldSet');
        
        if(System.currentPageReference().getParameters().get('objectNameForLayoutData') !=  '' ||System.currentPageReference().getParameters().get('objectNameForLayoutData') !=  Null )  
            Layoutobj =   System.currentPageReference().getParameters().get('objectNameForLayoutData');
        
        
        
        List<String> fieldObj = new List<String>();
        if(obj != null && obj != ''){
            fieldObj = obj.split(',');
        }
        
        List<String> FieldsetobjList = new List<String>();
        if(Fieldsetobj1 != null && Fieldsetobj1 != ''){
            FieldsetobjList = Fieldsetobj1.split(','); 
        }
        
        List<String> RecdObjList = new List<String>();
        if(Recordtypeobj != null && Recordtypeobj != ''){
            RecdObjList = Recordtypeobj.split(',');
        }
        
        List<String> LayObjList =new List<String>();
        if( Layoutobj != null && Layoutobj != ''){
            LayObjList = Layoutobj.split(','); 
        }      
        
        
        wrapperList = new List<wrapperClass>();
        RecordTypewrapperList = new List<wrapperClass>();
        FieldsetListWrapper =new List<wrapperClass>();
        
        
        if(fieldObj.size()>0){
            for(String objName : fieldObj){
                List<FieldDefinition> fieldDfn = new List<FieldDefinition>();    
                fieldDfn = [SELECT Label, QualifiedApiName, Length, DataType,RelationshipName FROM FieldDefinition where EntityDefinition.DeveloperName=:objName];  
                
                wrapperList.add(new wrapperClass(objName, fieldDfn));
            }
        }
        if(RecdObjList.size()>0){
            for(String objN : RecdObjList ){
                List<RecordType> recdList = new List<RecordType>();
                recdList = [SELECT Name,DeveloperName,IsActive FROM RecordType where SobjectType=:objN];           
                RecordTypewrapperList.add(new wrapperClass(objN,recdList));         
            }
        }
        if(FieldsetobjList.size()>0){
            for(String fldObj : FieldsetobjList){                         
                Map<String, Schema.SObjectType> GlobalDescribeMap =Schema.getGlobalDescribe();
                Schema.SObjectType SObjectTypeObj = GlobalDescribeMap.get(fldObj);
                if(SObjectTypeObj != null){
                    Schema.DescribeSObjectResult DescribeSObjectResultObj = SObjectTypeObj.getDescribe();
                    Map<String,Schema.FieldSet> fieldSetObj = DescribeSObjectResultObj.FieldSets.getMap();
                    List<fieldSetMember> fieldSetMemberList = new List<fieldSetMember>();
                    Map<String,List<string>> fieldSetWithFields = new Map<string,List<string>>();   
                    for(String ss : fieldSetObj.keyset()){
                        if(!fieldSetWithFields.containskey(ss)){  
                            fieldSetWithFields.put(ss,new List<string>());
                            for(Schema.FieldSetMember gg : fieldSetObj.get(ss).getfields()){
                                fieldSetWithFields.get(ss).add(string.valueof(gg.getFieldPath()))   ;
                            }
                        }  
                    }
                    wrapperclass2list = new List<wrapperClass2>(); 
                    for(string gg : fieldSetWithFields.keyset()){
                        wrapperclass2list.add(new wrapperClass2(gg,fieldSetWithFields.get(gg)));
                    }  
                    FieldsetListWrapper.add(new wrapperClass(fldObj,wrapperclass2list));
                }            
            }
            Map<string,List<String>> LayoutNamesMap = new Map<String,List<String>>();
            for(String layObj : LayObjList){
                List<String> fetchName = fetchLayoutName(layObj);
                if(!LayoutNamesMap.containskey(layObj)){
                    LayoutNamesMap.put(layObj,fetchName );
                }           
            }
            LayoutWrapperList = new List<wrapperClass>();
            for(String layObj : LayObjList){ 
                LayoutWrapperList.add(new wrapperClass(layObj,generateFieldList(LayoutNamesMap.get(layObj)) ));  
            }
        }
    }
    public List<String> fetchLayoutName(String objn){
        System.debug('called ' + objn  );
        List<String> layoutnms= new List<String>();
        HttpRequest req = new HttpRequest();
        req.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionID()); 
        req.setHeader('Content-Type', 'application/json');
        String SFdomainUrl=URL.getSalesforceBaseUrl().toExternalForm();
        String obj = 'Account';
        String query='Select+FullName+from+Layout+Where+EntityDefinitionId=\''+objn+'\'';
        req.setEndpoint(SFdomainUrl+'/services/data/v33.0/tooling/query/?q='+query);
        req.setMethod('GET');
        Http h = new Http();
        HttpResponse response = h.send(req);
        System.debug('response  '+ response.getBody() );
        Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());    
        List<object> LayoutNames = (List<object>) results.get('records');
        List<Map<String, Object>> data = new List<Map<String, Object>>();
        for (Object instance : LayoutNames)
            data.add((Map<String, Object>)instance);    
        
        for(Map<String, Object> dd :  data){
            layoutnms.add(String.valueOf(dd.get('FullName')));      
        }
        return layoutnms;      
    }
    
    public  List<wrapperClass4> generateFieldList(List<String> apiNames){
        sectionMetaDatawrapper = new List<wrapperClass4>();        
        for(Integer i = 0; i<apiNames.size();i++){
            List<Metadata.Metadata> layouts =  Metadata.Operations.retrieve(Metadata.MetadataType.Layout,apiNames);
            Metadata.Layout layoutMd = (Metadata.Layout) layouts.get(i);             
            String SectionName;
            List<String> fieldsList ;
            sectionDetailwrapper = new List<wrapperClass3>();   
            for (Metadata.LayoutSection section : layoutMd.layoutSections){                          
                fieldsList = new List<String>();
                SectionName = section.label;
                String fields; 
                for (Metadata.LayoutColumn column : section.layoutColumns){            
                    if (column.layoutItems != null) {            
                        for (Metadata.LayoutItem item : column.layoutItems) {
                            fieldsList.add(item.field);
                        }            
                    }         
                }
                sectionDetailwrapper.add(new wrapperClass3(SectionName ,fieldsList )); 
            }
            String fullNameDeode =  EncodingUtil.urlDecode(layoutMd.fullname, 'UTF-8');
            sectionMetaDatawrapper.add(new wrapperClass4(fullNameDeode,sectionDetailwrapper));
        }
        return sectionMetaDatawrapper;
        
    }
    public class wrapperClass{
        public String objectName{get; set;}
        public List<FieldDefinition> fieldList{get; set;}
        public List<RecordType> recordTypeList{get; set;}
        // public List<Object> LayoutList{get;set;}
        public List<wrapperClass2> wrapperclasslist2{get;set;}        
        public List<wrapperClass4> wrapperclasslist4{get;set;}
        
        public wrapperClass(String objectName, List<FieldDefinition> fieldList){
            this.objectName = objectName;
            this.fieldList = fieldList;
        }
        public wrapperClass(String objectNAme, List<RecordType> recordTypeList){
            this.objectName = objectName;
            this.recordTypeList = recordTypeList;
        }  
        public wrapperClass(String objectNAme,List<wrapperClass2> wrapperclasslist2){
            this.objectName = objectName;
            this.wrapperclasslist2= wrapperclasslist2;
        }  
        public wrapperClass(String objectNAme, List<wrapperClass4> wrapperclasslist4){
            this.objectName = objectName;
            this.wrapperclasslist4= wrapperclasslist4; 
        }       
    }
    public class wrapperClass2{
        public string fieldsetname{get;set;} 
        public List<string> fieldsvalue{get;set;}
        
        public wrapperClass2(string fieldsetname , List<string> fieldsvalue){
            this.fieldsetname  = fieldsetname ;
            this.fieldsvalue = fieldsvalue;
        }
    }
    public class wrapperClass3{
        public string sectionName{get;set;}
        public List<String> fieldsList{get;set;}
        
        public wrapperClass3(String sectionName, List<string> fieldsList){
            this.sectionName = sectionName;
            this.fieldsList = fieldsList;
        }
    }
    public class wrapperClass4{
        public string apiFullname{get;set;}
        public List<wrapperClass3> sectionMetaDetails{get;set;}
        
        public wrapperClass4(string apiFullname,List<wrapperClass3> sectionMetaDetails){
            this.apiFullname = apiFullname;
            this.sectionMetaDetails= sectionMetaDetails;
        }
    }
}