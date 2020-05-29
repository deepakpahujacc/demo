({
    
    // function call on component Load
    doInit: function(component, event, helper) {
        var action = component.get("c.objectNames");
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            if (state === "SUCCESS") {           
                var allValues = response.getReturnValue();
                var result = response.getReturnValue();
                console.log('result ' +result);
                var plValues = [];
                for (var i = 0; i < result.length; i++) {
                    plValues.push({
                        value: result[i].split('####')[1],
                        label: result[i].split('####')[0]
                    });
                }
                plValues.sort();
                component.set("v.objlist", plValues);
                console.log(component.get('v.objlist'));
            }        	         
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +  errors[0].message);
                    }
                } 
                else {
                    console.log("Unknown Error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    doSearch: function(component,event,helper){
        var Cobject = component.get('v.objselectedValue');
        component.set("v.Recordvisible2", false);
        component.set("v.Recordvisible1", true);
        console.log('Inside Method');
        helper.showSpinner(component);
        console.log('@@ values',Cobject);
        helper.getTableFieldSet(component,event);
        var childComp = component.find('childComp');
        childComp.callChild();
        var valNul = component.get("v.customSettingRecordsToDeleteNull");
        component.set('v.customSettingRecordsToDelete',valNul);
    },
    
    // function for save the Records 
    Save: function(component, event, helper) {
        if(component.get('v.objselectedValue') == null){
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({ title : 'Error Message', message:'Select a Custom Setting Object First', type: 'error',  
                                 });
            toastEvent.fire();
        }
        else{
            var action = component.get("c.saveCustomSettingRecords");
            var recordsToSave = component.get('v.customSettingRecords');
            console.log(recordsToSave);  
            var aptData = true;
            for  (var item in recordsToSave){
                if(component.get('v.customSettingRecords')[item].Name==""){
                    aptData = false;
                    console.log('@@DataName',component.get('v.customSettingRecords')[item].Name);
                }
            }
            console.log('@@aptData',aptData);
            if(!aptData){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({ title : 'Error Message', message:'Name Field Cannot be Empty', type: 'error',  
                                     });
                toastEvent.fire();
            }
            else{
                var recordsToCheck = component.get('v.customSettingRecords');
                var exName = component.get('v.existingName');
                var appData = true;
                for  (var j=0; j<recordsToCheck.length; j++){
                    if((exName.has(recordsToCheck[j].Name)) && recordsToCheck[j].fromOrg == false){
                        console.log('matched@',(exName.has(recordsToCheck[j].Name)));
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({ title : 'Error Message', message:'Name Value Already Exist', type: 'error',  
                                             });
                        toastEvent.fire();
                        appData = false;
                    }
                }
                if(appData){
                    action.setParams({"records":recordsToSave, "deleteRecords": component.get("v.customSettingRecordsToDelete")});
                    action.setCallback(this, function(response) {
                        var state = response.getState();
                        if (state === "SUCCESS") { 
                            console.log('success');
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({ title : 'Sucess Message', message:'Record Saved', type: 'success',  
                                                 });
                            toastEvent.fire();
                            helper.getTableFieldSet(component);
                            var valNul = component.get("v.customSettingRecordsToDeleteNull");
                            component.set('v.customSettingRecordsToDelete',valNul);
                        }
                        else if (state === "ERROR") {
                            console.log('ERROR');
                            var errors = response.getError();
                            if (errors) {
                                console.log('inside errors');
                                if (errors[0] && errors[0].pageErrors[0].message) {
                                    var toastEvent = $A.get("e.force:showToast");
                                    toastEvent.setParams({
                                        title : 'Error',
                                        message:'Error message:'+errors[0].pageErrors[0].message,
                                        key: 'info_alt',
                                        type: 'error',
                                        mode: 'pester'
                                    });
                                    toastEvent.fire();   
                                    component.set("v.Spinner", false); 
                                    
                                }
                            } 
                            else {
                                console.log("Unknown error");
                            }
                        }
                    });
                    $A.enqueueAction(action);
                }
            }
        }
    },
    
    // function for create new object Row in Contact List 
    addNewRow: function(component, event, helper) {
        
        
        var a = component.get('v.customSettingRecords');
        var selectedObject = component.get('v.objselectedValue');
        if(selectedObject == "Select an Option"){
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({ title : 'Error Message', message:'Select a Custom Setting Object First', type: 'error',  
                                 });
            toastEvent.fire();
        }
        else{
            console.log(selectedObject);
            a.push({
                'sobjectType': selectedObject,
                'Name': '',
                'fromOrg': false
            });
            component.set('v.customSettingRecords',a);
            //pagenation
            var sortNo = component.get('v.sortNo');
            component.set("v.maxPage", parseInt(Math.floor(component.get("v.customSettingRecords").length+(sortNo-1))/sortNo));
            helper.renderPage(component);
            var goLast = component.find('childComp');
            goLast.gotoLastPage();
        }   
    },
    
    // function for delete the row 
    removeDeletedRow: function(component, event, helper) {
        
        var target = event.target;
        var rowIndex = target.getAttribute("data-index");
        console.log("Row No : " + rowIndex);
        
        var AllRowsList = component.get("v.customSettingRecords");
        var remList = component.get("v.customSettingRecordsToDelete");
        var pagenumber = component.get('v.pageNumber');
        var actualIndex = parseInt((pagenumber - 1) + rowIndex);
        var deletedRow= AllRowsList[actualIndex];
        if(deletedRow.Id != undefined)
            remList.push(deletedRow);
        AllRowsList.splice(actualIndex, 1);
        
        
        component.set('v.customSettingRecords',AllRowsList);
        component.set('v.customSettingRecordsToDelete',remList);
        console.log(component.get("v.customSettingRecordsToDelete"));
        //pagenation
        var sortNo = component.get('v.sortNo');
        var divForPage = parseInt(Math.floor(component.get("v.customSettingRecords").length+parseInt(sortNo-1))/sortNo);
        var prevMaxPage = Math.floor(component.get('v.maxPage'));
        if(divForPage == prevMaxPage){
            component.set("v.maxPage",divForPage);
        }
        else{ 
            component.set("v.maxPage",divForPage);
            var prevPage = component.find('childComp');
            prevPage.gotoPrevPagePage();
        }
        helper.renderPage(component);
    },
    
    cancel : function(component, event, helper) {
        console.log('Enter Here');
        var evt = $A.get("e.force:navigateToComponent");
        console.log('evt'+evt);
        evt.setParams({
            componentDef: "c:AdminPlayGroundHome"
            //componentAttributes :{ }
        });
        
        evt.fire();
    },
    
    showSpinner: function(component, event, helper) {
        component.set("v.Spinner", true); 
    },
    
    hideSpinner : function(component,event,helper){    
        component.set("v.Spinner", false);
    },
    //pagenation
    onPagination:function(component,event,helper){
        helper.renderPage(component);
    },
    
    searchKeyChange: function( component, event, helper ){
        
        var wraplist = component.get('v.customSettingRecords');
        var templist = [];
        var searchkey = component.find('searchKey').get('v.value');
        if(searchkey == ''){
            
            component.set('v.pageNumber',component.get('v.pageNumber'));
            //pagenation part
            var sortNo = component.get('v.sortNo');
            var divForPage =   parseInt(Math.floor(component.get("v.customSettingRecords").length+parseInt(sortNo-1))/sortNo);
            if(divForPage > 0)
                component.set("v.maxPage",divForPage);
            else
                component.set("v.maxPage",1); 
            helper.renderPage(component);
        }
        else{
            for(var i=0 ; i<wraplist.length;i++){
                if(wraplist[i].Name.toLowerCase().startsWith(searchkey.toLowerCase())){
                    templist.push(wraplist[i]);
                }
                
            }
            var childComp = component.find('childComp');
            childComp.callChild();
            component.set("v.paginationList", templist);
            //pagenation part
            var sortNo = component.get('v.sortNo');
            var divForPage =   parseInt(Math.floor(component.get("v.paginationList").length+parseInt(sortNo-1))/sortNo);
            if(divForPage > 0)
                component.set("v.maxPage",divForPage);
            else
                component.set("v.maxPage",1); 
            //helper.renderPage(component);
        }
    },
    
    onSortChange: function(component,event,helper){
        component.find('searchKey').set('v.value','');
        var childComp = component.find('childComp');
        childComp.callChild();
        var sortNo = component.get('v.sortNo');
        component.set("v.maxPage", parseInt(Math.floor(component.get("v.customSettingRecords").length+(sortNo-1))/sortNo));
        helper.renderPage(component);
    },
    
    sort:function( component, event, helper ) {
        component.find('searchKey').set('v.value','');
        console.log('sort');
        if(component.get('v.Asc')){
            component.set('v.Asc',false);    
        }
        else{
            component.set('v.Asc',true);
        }
        
        var SortOrder = component.get('v.sortOrder');
        SortOrder =SortOrder === 'asc' ? 'desc' : 'asc';
        var reverse = SortOrder === 'asc' ? 1 : -1;
        let table = JSON.parse(JSON.stringify(component.get('v.customSettingRecords')));
        table.sort((a,b) => {return a[a.Name] > b[b.Name] ? 1*reverse : -1*reverse});
        component.set('v.sortOrder','desc');
        component.set('v.customSettingRecords',table);
        helper.renderPage(component);
    },
})