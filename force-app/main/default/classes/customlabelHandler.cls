public class customlabelHandler {
    
   
    @AuraEnabled public List<records> records{get;set;}
    
    @AuraEnabled
    public static customlabelHandler getCustRec(){
        System.debug('value to be return: '+findAllCustomLabels('',fetchUserSessionId()));
        return findAllCustomLabels('',fetchUserSessionId());
    }
    
    public static customlabelHandler findAllCustomLabels(String endpointURL,string headId){
        
        endpointURL='/services/data/v45.0/tooling/query/?q=Select+id,Name,Value,MasterLabel+from+CustomLabel+where+namespaceprefix+=+null';
        
        HttpRequest req = new HttpRequest();
        req.setHeader('Authorization', 'Bearer ' + headId);
        req.setHeader('Content-Type', 'application/json');
        String domainUrl=URL.getSalesforceBaseUrl().toExternalForm();
        system.debug('********domainUrl:'+domainUrl);
        req.setEndpoint(domainUrl+endpointURL);
        req.setMethod('GET');
        
        Http h = new Http();
        HttpResponse res = h.send(req);
        string responseBody = res.getBody();
        system.debug('****responseBody:'+responseBody); 
        
        customlabelHandler completeWrapper = (customlabelHandler)System.JSON.deserialize(responseBody, customlabelHandler.class);
        for(records rec: completeWrapper.records){
            System.debug('Name: '+rec.Name+' : Value  '+rec.Value+' : Label  '+rec.MasterLabel); 
            
        }
        return completeWrapper;
        
    }
   
    public class MetadataServiceExamplesException extends Exception { }
    
    //method to create custom labels
    @AuraEnabled
    public static void createCustomLabel(String strfromlex){
        
        system.debug('@@@ strfromlex = ' + strfromlex);
        List<records> datalist = (List<records>) JSON.deserialize(strfromlex, List<records>.class);
        system.debug('@@@ datalist = ' + datalist);
        system.debug('@@@ datalistSize = ' + datalist.size());
        for(Integer i = 0 ; i < (datalist.size() / 10)+1 ; i++){
                List<records> lstTempRec = new List<records>();
                for(Integer j=(i*10);(j<(i*10)+10) && j< datalist.size() ; j++){
                    lstTempRec.add(datalist.get(j));
                }
        List<MetadataService.Metadata> allMetadataList = new List<MetadataService.Metadata>();
        MetadataService.MetadataPort service = createService();
        for(records wrapper: lstTempRec){
            MetadataService.CustomLabel csLabel = new MetadataService.CustomLabel();
            csLabel.fullName = wrapper.Name;
            csLabel.language ='en_US' ;
            csLabel.protected_x  = true;
            csLabel.shortDescription  =wrapper.MasterLabel ;
            csLabel.value=wrapper.Value;
            allMetadataList.add(csLabel);
        }
        
         service.upsertMetadata(allMetadataList);
        }
       
    }
    @AuraEnabled
    public static Boolean deleteField(String strfromlex)
    {
        system.debug('@@@ strfromlex = ' + strfromlex);
        List<records> datalist = (List<records>) JSON.deserialize(strfromlex, List<records>.class);
        system.debug('@@@ datalist = ' + datalist);
        system.debug('@@@ datalistSize = ' + datalist.size());
        for(Integer i = 0 ; i < (datalist.size() / 10)+1 ; i++){
                List<records> lstTempRec = new List<records>();
                for(Integer j=(i*10);(j<(i*10)+10) && j< datalist.size() ; j++){
                    lstTempRec.add(datalist.get(j));
                }
        List<MetadataService.Metadata> allMetadataList = new List<MetadataService.Metadata>();
        List<MetadataService.DeleteResult> results;
        List<string> nameList = new List<String>();
        for(records wrapper: lstTempRec){
            System.debug('@@'+wrapper.Id);
            if(wrapper.Name !='' &&  wrapper.Id != '' )
            {
                namelist.add(wrapper.Name);
            }
        }
        if(namelist.size() > 0){
            MetadataService.MetadataPort service = createService();
            results = service.deleteMetadata('CustomLabel', nameList );
            return true;
        }
        }
       return false; 
    }
  
    public static MetadataService.MetadataPort createService(){ 
        MetadataService.MetadataPort service = new MetadataService.MetadataPort();
        service.SessionHeader = new MetadataService.SessionHeader_element();
        service.SessionHeader.sessionId = fetchUserSessionId();
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
    
    //wrapper class
    class records {
        @AuraEnabled public String Id{get;set;}	
        @AuraEnabled public String Name{get;set;}
        @AuraEnabled public String Value{get;set;}
        @AuraEnabled public String MasterLabel{get;set;}
    }
    
    
}