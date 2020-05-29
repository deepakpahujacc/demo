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