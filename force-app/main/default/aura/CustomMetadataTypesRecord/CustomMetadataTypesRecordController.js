({
    init : function(component, event, helper) { 
        helper.fetchData( component );
        component.set("v.Spinner", true); 
        
    },
    AddRecord: function(component, event, helper){
        component.set('v.searchKey','');
        var recordList = component.get("v.tableRecords");
        var fieldlist  = component.get("v.fieldSetValues"); 
        var obj={};        
        recordList.push(obj);
        for(var i=0; i<recordList.length;i++){
             	recordList[i].serialNo=i+1;   
            }
        component.set("v.tableRecords",recordList ); 
         var sortNo = component.get('v.sortNo');
        var divForPage = parseInt(Math.floor(component.get("v.tableRecords").length+parseInt(sortNo-1))/sortNo);
        
        if(divForPage >0){
            console.log('if ' + divForPage)
            component.set("v.maxPage",divForPage);
        }
        else{
            console.log('else'  + divForPage)
            component.set("v.maxPage",1);
        }
         component.set('v.addRowhandle',false);     
        var goLast = component.find('childComp');
        goLast.gotoLastPage();
        helper.renderPage(component);
    },
    handleChange: function (component, event,helper) {
        component.set('v.Recordvisible',false);
        component.set("v.Spinner", true); 
        var selectedOptionValue = event.getParam("value");
        component.set( "v.SelectedObject", selectedOptionValue); 
        helper.getTableFieldSet(component,event);  
        
    },
    SaveRecord : function(component,event,helper){
        component.set("v.Spinner", true);  
        var validrecord = component.get("v.tableRecords");
        var aptData = true;
        var selectedobj = component.get("v.SelectedObject");
        for  (var item in validrecord){
            if(JSON.stringify(validrecord[item].DeveloperName)==null){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Error',
                    message:'RecordName can not be null ',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'pester'
                });
                toastEvent.fire();
                aptData=false;
                component.set("v.Spinner", false); 
            }
            if(JSON.stringify(validrecord[item].MasterLabel)==null){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Error',
                    message:'Label can not be null ',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'pester'
                });
                toastEvent.fire();
                aptData=false;
                component.set("v.Spinner", false); 
            }
        }
        if(selectedobj == null){
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Error',
                message:'Please Select MetaData Record First ',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
            aptData=false;
            component.set("v.Spinner", false);
            
        }
        if(aptData){
            var action = component.get("c.UpdateRecords"); 
            console.log(component.get("v.toDeleteRecord"));
            action.setParams({
                recordsdata: component.get("v.tableRecords"),
                objectName: component.get("v.SelectedObject"),
                fieldSetValues: component.get("v.fieldSetValues"),
                toDeleteRecord  : component.get("v.toDeleteRecord")
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    helper.getTableFieldSet(component,event,helper); 
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: "Success!",
                        type: 'success',
                        message: "The record has been Saved successfully."
                    });
                    toastEvent.fire();  
                    component.set("v.Spinner", false); 
                }
                 else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message && errors[0].message != 'Attempt to de-reference a null object'){
                        
                     var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Error',
                message:'Error message:'+errors[0].message,
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();   
            component.set("v.Spinner", false); 
                    
                    }
                    
                } else {
                    console.log("Unknown error");
                }
                 component.set("v.Spinner", false); 
            }
            });
            
            $A.enqueueAction( action );
        }
    },
    removeRow: function(component, event, helper) {
        console.log(component.get('v.tableRecords'));
        var tableData = component.get("v.paginationList"); 
        var target = event.target;
        var selectedItem = event.currentTarget;  
        var index = selectedItem.dataset.index; 
        console.log(index);
        var toDeleteRecord  =  component.get("v.toDeleteRecord");
        //var tableRecord = component.get('v.tableRecords');  
        //console.log(tableRecord);
        var updatedList = component.get('v.tableRecords');
        
        var pagenumber = component.get('v.pageNumber');
        var actualIndex = (pagenumber - 1) + index;
        var removedElements = updatedList.splice(parseInt(actualIndex,10), 1);
        tableData.splice(index, 1);
        console.log(removedElements);
        console.log(updatedList);
        toDeleteRecord.push(removedElements[0]);
        //toDeleteRecord.push(tableData[index]);
        component.set("v.toDeleteRecord" , toDeleteRecord);
        console.log(toDeleteRecord);
       // tableRecord.splice(index,1);
       // tableData.splice(index, 1);

        component.set("v.tableRecords", updatedList);  
        component.set("v.paginationList", tableData);  
        var byName = updatedList;
        for(var i=0; i<byName.length;i++){
            byName[i].serialNo=i+1;   
        }
        component.set("v.tableRecords", byName);
        var sortNo = component.get('v.sortNo');
        var divForPage = parseInt(Math.floor(component.get("v.tableRecords").length+parseInt(sortNo-1))/sortNo);
        var prevMaxPage = Math.floor(component.get('v.maxPage'));
        if(divForPage == prevMaxPage){
            component.set("v.maxPage",divForPage);
        }
        else{ 
            console.log('into else case');
            component.set("v.maxPage",divForPage);
            var prevPage = component.find('childComp');
            prevPage.gotoPrevPagePage();
        }
        
        helper.renderPage(component);
    },
    showSpinner: function(component, event, helper) {
        //component.set("v.Spinner", true); 
    },
    hideSpinner : function(component,event,helper){    
        //component.set("v.Spinner", false);
    },
    onPagination: function(component,event,helper){
        if(addRowhandle){
        var wrapList = JSON.parse(JSON.stringify(component.get('v.tableRecords')));
        var templist = [];
        var templist2 = [];
        var searchkey = component.get('v.searchKey');
        var addRowhandle = component.get('v.addRowhandle');
        if(searchkey == '' && searchkey == null ){
          
        helper.renderPage(component);
        }
        else{
            for(var i=0 ; i<wrapList.length;i++){
                if(wrapList[i].DeveloperName != null){
                    if(wrapList[i].DeveloperName.toLowerCase().startsWith(searchkey.toLowerCase())){
                        templist.push(wrapList[i]);
                    }
                }
            }
            if(templist.length > 0){
              var sortNo = component.get('v.sortNo');
              var pagenumber = component.get('v.pageNumber');
              component.set("v.maxPage",Math.ceil(templist.length/sortNo));
      		  var templist2= templist.slice((pagenumber-1)*sortNo,pagenumber*sortNo);
       		  component.set('v.paginationList',templist2);
            }
        }
       }
       else{
       helper.renderPage(component);
       }
    },
    onSortChange: function(component,event,helper){
        component.set('v.searchKey','');
        var sortNo = component.get('v.sortNo');
        component.set("v.maxPage", Math.ceil((component.get("v.tableRecords").length)/parseInt(sortNo)));  
        helper.paginationHandle(component);
    },
    handleSearchkey : function(component,event,helper){
        var templist = [];
        component.set("v.tableRecords",component.get('v.tableRecordsOriginal'));
        var wrapList = JSON.parse(JSON.stringify(component.get('v.tableRecords')));
        
        var tempList2 = [];
        var searchkey = event.getSource().get("v.value");         
        if(searchkey == ''){
            var sortNo = component.get('v.sortNo');
            component.set('v.pageNumber',component.get('v.pageNumber'));
            component.set("v.maxPage",Math.ceil(wrapList.length/sortNo));
            helper.renderPage(component);      
        }
        else{
            for(var i=0 ; i<wrapList.length;i++){
                if(wrapList[i].DeveloperName.toLowerCase().startsWith(searchkey.toLowerCase())){
                    templist.push(wrapList[i]);
                }
            }
            if(templist.length > 0){
                component.set('v.pageNumber',1);
                /*var sortNo = component.get('v.sortNo');
                var pagenumber = component.get('v.pageNumber');
                component.set("v.maxPage",Math.ceil(templist.length/sortNo));
                var templist2= templist.slice((pagenumber-1)*sortNo,pagenumber*sortNo);
				*/
                var byName = templist;
                for(var i=0; i<byName.length;i++){
                    byName[i].serialNo=i+1;   
                }
                component.set('v.tableRecords',byName);
                var sortNo = component.get('v.sortNo');
                component.set("v.maxPage",Math.ceil((component.get("v.tableRecords").length)/sortNo));
                helper.renderPage(component);
            }
            else if(templist.length == 0){
                var templist = [];
                component.set('v.paginationList',templist); 
                var pagenumber = component.get('v.pageNumber');
                component.set("v.maxPage",pagenumber);                
            }
        }
    }, 
    cancel : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef: "c:AdminPlayGroundHome"
            //componentAttributes :{ }
        });
        
        evt.fire();
    },
     sort:function( component, event, helper ) {
         component.set('v.searchKey','');
        if(component.get('v.Asc')){
            component.set('v.Asc',false);    
        }
        else{
            component.set('v.Asc',true);
        }
        
        var SortOrder = component.get('v.sortOrder');
        SortOrder =SortOrder === 'asc' ? 'desc' : 'asc';
        var reverse = SortOrder === 'asc' ? 1 : -1;
        let table = JSON.parse(JSON.stringify(component.get('v.tableRecords')));
        table.sort((a,b) => {return a[a.Name] > b[b.Name] ? 1*reverse : -1*reverse});
        component.set('v.sortOrder','desc');
         console.log('sort');
         console.log(component.get('v.tableRecords'));
        component.set('v.tableRecords',table);
        helper.renderPage(component);
    }
})