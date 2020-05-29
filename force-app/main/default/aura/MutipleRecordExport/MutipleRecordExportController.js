({
    initData: function(component, event, helper) {
        component.set("v.Spinner", true); 
        helper.getWrapperData(component, event, helper);       
    },
    handleClick :function(component, event, helper){
        var checked = false;
        var wrapList = component.get('v.wrapList');
        for(var i=0 ; i<wrapList.length;i++){
            if(wrapList[i].fieldRecord == true || wrapList[i].fieldsetRecord == true || wrapList[i].LayoutData == true || wrapList[i].RecordtypeData == true){
                checked = true;    
            }
        }	
        if(checked){
            component.set("v.Spinner", true); 
            var action = component.get('c.ExportRecord');
            action.setParams({
                wrapList : JSON.stringify(wrapList)
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS"){
                    var strFile = "data:application/excel;base64,"+action.getReturnValue();
                    download(strFile, "myexcelfile.xls", "application/excel");
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Success',
                        message: 'File has been Downloaded Successfully',
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'success',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                    helper.getWrapperData(component, event, helper); 
                    
                }
            });
            $A.enqueueAction(action);
        }
        else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Error',
                message:'Please Select atleast one CheckBox or More',            
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
    },
    scriptsLoaded :function(component, event, helper){ 
        
    },
    showSpinner: function(component, event, helper) {
        //component.set("v.Spinner", true); 
    },
    hideSpinner : function(component,event,helper){    
        // component.set("v.Spinner", false);
    },
    handleNewButtonClick: function( component, event, helper ){
        component.set("v.dateValidationError" , false);
        component.set( "v.record", {} );
        var ele = component.find( "recordPopup" );
        $A.util.removeClass( ele, "slds-hide" );      
        
    },
    handleCancelPopupClick: function( component, event, helper ){
        component.set("v.RecdType" , false);
        component.set("v.RecordNamebool" , false);            
        component.set("v.PluName" , false); 
        component.set("v.dateValidationError" , false);
        component.set( "v.PluralObjectName",'' );
        component.set( "v.RecordName",'' );
        component.set( "v.StartNumber",'' );
        component.set( "v.ObjectName" ,'');
        component.find('select').set('v.value','');
        component.set( "v.StartNumber",'');
        
        var ele = component.find( "recordPopup" );
        $A.util.addClass( ele, "slds-hide" );
    },
    handleSavePopupClick: function( component, event, helper ) {
        var objName = component.get( "v.ObjectName" );
        var objlist = component.get( "v.wrapList" );
        var objExist = true;
        if(objName==null){
            component.set("v.dateValidationError" , true);
        }
        else{
            for(var i=0 ; i<objlist.length;i++){
                if(objlist[i].sobjName.toLowerCase() == objName.toLowerCase()){
                    alert('This Object already Exist. Please change the name');
                    objExist = false;
                } 
            }
            var pluname = component.get( "v.PluralObjectName" );
            var RecordName = component.get( "v.RecordName" );
            var recordType = component.find('select').get('v.value');
            var StartNumber = component.get( "v.StartNumber" );
            
            if(pluname == null){
                component.set("v.PluName" , true); 
                objExist = false;
            }
            else{
                if(pluname.charAt(pluname.length-1) != 's'){
                    component.set("v.PluName" , true); 
                    objExist = false;
                }
            }
            if(RecordName == null){
                component.set("v.RecordNamebool" , true); 
                objExist = false;
            }             
            if(recordType == 'Auto Number'){
                if(StartNumber ==null){
                    component.set("v.RecdType" , true); 
                    objExist = false;    
                }   
            }
            if(objExist){                
                var action = component.get('c.CreateObject');
                action.setParams({
                    objName  : objName,
                    pluralName : component.get( "v.PluralObjectName" ),
                    RecordName : component.get( "v.RecordName" ),
                    StartNumber : component.get( "v.StartNumber" )
                });
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS"){
                        var ele = component.find( "recordPopup" );
                        $A.util.addClass( ele, "slds-hide" );
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            title : 'Success',
                            message: 'Object Created Successfully',
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'success',
                            mode: 'pester'
                        });
                        toastEvent.fire();
                        
                        
                        helper.getWrapperData(component, event, helper);
                        component.set("v.RecdType" , false);
                        component.set("v.RecordNamebool" , false);            
                        component.set("v.PluName" , false); 
                        component.set("v.dateValidationError" , false);
                        component.set( "v.PluralObjectName",'' );
                        component.set( "v.RecordName",'' );
                        component.set( "v.StartNumber",'' );
                        component.set( "v.ObjectName" ,'');
                        component.find('select').set('v.value','');
                        component.set( "v.StartNumber",'');
                    }
                });
                
                $A.enqueueAction(action); 
            }
        }
    },
    onPagination: function(component,event,helper){
        var wrapList = component.get('v.wrapList');
        var templist = [];
        var templist2 = [];
        var searchkey = component.get('v.searchKey');
        if(searchkey == '' && searchkey == null ){
            helper.renderPage(component);
        }
        else{
            for(var i=0 ; i<wrapList.length;i++){
                if(wrapList[i].sobjName.toLowerCase().startsWith(searchkey.toLowerCase())){
                    templist.push(wrapList[i]);
                }
            }
            
            if(templist.length > 0){
                var allvalues = templist;
                for(var i=0; i<allvalues.length;i++){
                    allvalues[i].serialNo=i+1;  
                    console.log(allvalues[i]);
                }
                var sortNo = component.get('v.sortNo');
                var pagenumber = component.get('v.pageNumber');
                component.set("v.maxPage",Math.ceil(templist.length/sortNo));
                var templist2= templist.slice((pagenumber-1)*sortNo,pagenumber*sortNo);
                component.set('v.paginationList',templist2);
            }
        }
    },
    handleSearchkey : function(component,event,helper){
        var templist = [];
        var wrapList = component.get('v.wrapList');
        var tempList2 = [];
        var searchkey = event.getSource().get("v.value");         
        if(searchkey == '' ){
            var sortNo = component.get('v.sortNo');
            component.set('v.pageNumber',component.get('v.pageNumber'));
            component.set("v.maxPage",Math.ceil(wrapList.length/sortNo));
            helper.renderPage(component, event, helper);       
        }
        else{
            for(var i=0 ; i<wrapList.length;i++){
                if(wrapList[i].sobjName.toLowerCase().startsWith(searchkey.toLowerCase())){
                    templist.push(wrapList[i]);
                }
            }
            
            if(templist.length > 0){
                var allvalues = templist;
                for(var i=0; i<allvalues.length;i++){
                    allvalues[i].serialNo=i+1; 
                }
                component.set('v.pageNumber',1);
                var sortNo = component.get('v.sortNo');
                var pagenumber = component.get('v.pageNumber');
                component.set("v.maxPage",Math.ceil(templist.length/sortNo));
                var templist2= templist.slice((pagenumber-1)*sortNo,pagenumber*sortNo);
                component.set('v.paginationList',templist2);
            }
            else if(templist.length == 0){
                var templist = [];
                component.set('v.NoRecord',true);
                component.set('v.paginationList',templist); 
                var pagenumber = component.get('v.pageNumber');
                component.set("v.maxPage",pagenumber);                
            }
        }
    },    
    onSortChange: function(component,event,helper){
        var searchkey = component.get('v.searchKey');
        if(searchkey == '' && searchkey == null ){
            var sortNo = component.get('v.sortNo');
            component.set("v.maxPage", Math.ceil((component.get("v.wrapList").length)/parseInt(sortNo)));
            helper.paginationHandle(component);
        }
        else{
            var templist = [];
            var templist2 = [];
            var wrapList = component.get('v.wrapList');
            for(var i=0 ; i<wrapList.length;i++){
                if(wrapList[i].sobjName.toLowerCase().startsWith(searchkey.toLowerCase())){
                    templist.push(wrapList[i]);
                }
            }
            
            if(templist.length > 0){
                var allvalues = templist;
                for(var i=0; i<allvalues.length;i++){
                    allvalues[i].serialNo=i+1;  
                }
                var sortNo = component.get('v.sortNo');
                var pagenumber = component.get('v.pageNumber');
                component.set("v.maxPage",Math.ceil(templist.length/sortNo));
                var templist2= templist.slice((pagenumber-1)*sortNo,pagenumber*sortNo);
                component.set('v.paginationList',templist2);
            }
        }
    },
    sort:function( component, event, helper ) {
        var paglist = component.get('v.paginationList'); 
        var SortOrder = component.get('v.sortOrder');
        SortOrder =SortOrder === 'asc' ? 'desc' : 'asc';
        var reverse = SortOrder === 'asc' ? 1 : -1;
        let table = JSON.parse(JSON.stringify(component.get('v.wrapList')));
        table.sort((a,b) => {return a[a.sobjName] > b[b.sobjName] ? 1*reverse : -1*reverse});
        component.set('v.sortOrder','desc');
        component.set('v.wrapList',table);
        helper.renderPage(component);       
        if(component.get('v.Asc')){
            component.set('v.Asc',false);    
        }
        else{
            component.set('v.Asc',true);
        }
    },
    onChange: function (cmp, evt, helper) {
        var recordType = cmp.find('select').get('v.value');
        if(recordType == 'Auto Number'){
            cmp.set('v.RecordType',true);
        }
        else{
            cmp.set('v.RecordType',false);
        }
    },
    cancel : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        console.log('evt'+evt);
        evt.setParams({
            componentDef: "c:AdminPlayGroundHome"
            //componentAttributes :{ }
        });
        
        evt.fire();
    },
})