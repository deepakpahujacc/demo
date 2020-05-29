public with sharing class CustomSettingObjController {
    @AuraEnabled
    public static List<String> objectNames(){
        List<Schema.SObjectType> gd = Schema.getGlobalDescribe().Values();
        List<options> optionsList = new List<options>();
         List<String> objectList = new List<String>();
        for(Schema.SObjectType objectName : gd){
            
            if(objectName.getDescribe().isCustomSetting()){
                SObjectType customSettingType = Schema.getGlobalDescribe().get(objectName.getDescribe().getName());
                String sObjectName = String.valueOf(customSettingType);
                SObjectType sObjName = Schema.getGlobalDescribe().get(sObjectName);         
                Map<String,Schema.SObjectField> mfields = sObjName.getDescribe().fields.getMap();
                For(Schema.SObjectField field : mfields.values()){
                    if(!field.getDescribe().isNillable() ){
                        if(field.getDescribe().getName()=='name'){
                            //optionsList.add(new Options(objectName.getDescribe().getLabel(),objectName.getDescribe().getName()));
                            objectList.add(objectName.getDescribe().getLabel()+'####'+objectName.getDescribe().getName());
                        }
                    }
                } 
            }    
        }
       // return optionsList;  
       objectList.sort();
       return objectList;
    }
    
    @AuraEnabled
    public static String getFieldSet(String sObjectName) {
        String result = '';
        try{
            SObjectType sObjName = Schema.getGlobalDescribe().get(sObjectName);         
            Map<String,Schema.SObjectField> mfields = sObjName.getDescribe().fields.getMap();
            For(Schema.SObjectField field : mfields.values()){
                If(field.getDescribe().isAccessible()&& field.getDescribe().isUpdateable() && !field.getDescribe().getName().EndsWith('Id')){
                    if(result != ''){
                        result += ',';
                    }
                    String jsonPart = '{';
                    jsonPart += '"label":"' + field.getDescribe().getLabel() + '",';
                    jsonPart += '"required":"' + (!field.getDescribe().isNillable() ) + '",';
                    jsonPart += '"type":"' + (field.getDescribe().getType()) + '",';
                    jsonPart += '"name":"' +field.getDescribe().getName() + '"';
                    jsonPart += '}';
                    result += jsonPart;
                    
                }
            }
        }
        catch(Exception e){
            result += e.getLineNumber() + ' : ' + e.getMessage();
            
        }
        system.debug('@field Type'+JSON.serializePretty(result));
        return '['+result+']';
    }
    @AuraEnabled
    public static List<sObject> getRecords(String sObjectName, String fieldNameJson){
        List<sObject> lstResult = new List<sObject>();
        String result = '[]';
        List<String> fieldNames = (List<String>) JSON.deserialize(fieldNameJson, List<String>.class);
        Set<String> setFieldNames = new Set<String>();
        String query = 'SELECT Id,' + String.join(fieldNames, ',') + ' FROM ' + sObjectName;            
        for(sObject s : Database.query(query)){
            lstResult.add(s);
        }
        return lstResult;
    }
    @AuraEnabled
    public static void saveCustomSettingRecords(List<SObject> records, List<SObject> deleteRecords){
        List<SObject> listToInsert = new List<SObject>();
        List<SObject> listToUpdate = new List<SObject>();
        for(SObject obj: records){
            if(obj.Id != NULL){
                listToUpdate.add(obj);    
            }	 
            else{
                listToInsert.add(obj);    
            }
        }
        if(listToUpdate.size()>0)
            update listToUpdate;
        if(listToInsert.size()>0)
            insert listToInsert;
        if(deleteRecords != NULL && deleteRecords.size() > 0){
            if(!Test.isRunningTest()){
                delete deleteRecords;
            }
        }
        
    }   
    public class options{
        @AuraEnabled
        public String label;
        @AuraEnabled
        public String value;
        public options(String label, String value){
            //this.optionLabel = optionLabel;
           // this.optionValue = optionValue;
           this.label = label;
            this.value = value;
           
        }
    }
}