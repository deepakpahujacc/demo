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