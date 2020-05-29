({
    doInit: function (component, event, helper) {
        helper.getObjectAndPanelProfiles(component);
        component.set('v.onLoadSpinner',true);
    },
    
    givePermissions: function(component, event, helper ){
        var wrapList = component.get('v.wrapperList');
        var obj = component.get('v.objselectedValue');
        
        if(obj == ''){
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Error',
                message:'Select Object To Give Permissions',
                type: 'error',
            });
            toastEvent.fire();
        }else{
            
            var mapProfileToFields = new Map();
            for(var i=0;i< wrapList.length;i++){
                for(var j=0; j<wrapList[i].profileWrp.length;j++){
                    var fieldList = [];
                    if(mapProfileToFields.has(wrapList[i].profileWrp[j].profile)){
                        fieldList =  mapProfileToFields.get(wrapList[i].profileWrp[j].profile);
                    }
                    fieldList.push(obj+'.'+wrapList[i].fieldName+ '-'+wrapList[i].profileWrp[j].read+'-'+ wrapList[i].profileWrp[j].write);
                    mapProfileToFields.set(wrapList[i].profileWrp[j].profile, fieldList);
                }
            }
            var i = 0;
            for(var key of mapProfileToFields.keys()){
               helper.savePermission(component, key, mapProfileToFields.get(key),mapProfileToFields.size,i);
                i++;
            }
        }
    },
    
    onValueChange: function (component, event, helper) {
        var obj = component.get('v.objselectedValue');
        if(obj == '-None-'){
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Error!",
                "message": "Select the Object Correctly",
                "type" : "Error"
            });
            toastEvent.fire();  
            $A.get('e.force:refreshView').fire();
        }else{
            helper.getFields(component);
            component.set('v.spinner',true);
            component.set("v.pageNumber", 1);
            
            var action = component.get("c.panelProfiles");
            action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {           
                var allValues = response.getReturnValue();
                console.log(allValues);
                var profileSet = ['System Administrator','Contract Manager','Solution Manager','Read Only','Marketing User','Standard User','Standard Platform User','Customer Community Login User',
                                  'Customer Community Plus User','Silver Partner User','Partner Community User','Partner Community Login User','High Volume Customer Portal User'];
                for(var i=0; i< allValues.length; i++){
                    if(profileSet.includes(allValues[i].Name)){	
                        allValues[i].checked =true;
                        allValues[i].disable =true; 
                    }else{
                        allValues[i].checked =false;
                        allValues[i].disable =false;
                    }
                }
                component.set('v.onLoadSpinner',false);
                console.log(allValues);
                component.set("v.panelProfiles", allValues);
            }        	         
        });
        
        $A.enqueueAction(action);
        }
            
    },
    
    searchKeyChange: function( component, event, helper ){
        var wrapList = component.get('v.wrapperList');
        var tempList = [];
        var tempList2 = [];
        var sortNo = component.get('v.sortNo');
        var maxPage = component.get('v.maxPage');
        var pageNumber = component.get('v.pageNumber');
        var searchkey = component.find('searchKey').get('v.value');
        if(searchkey == ''){
          component.set('v.pageNumber',component.get('v.pageNumber'));
          component.set("v.maxPage", Math.ceil((component.get("v.wrapperList").length)/sortNo));
          helper.renderPage(component);
          component.set('v.noRecordsToShow',false);
        }else{
            for(var i=0 ; i< wrapList.length;i++){
                if(wrapList[i].fieldName.toLowerCase().startsWith(searchkey.toLowerCase())){
                    tempList.push(wrapList[i]);
                }
            }
            if(tempList.length > 0){
                component.set("v.pageNumber", 1);
                for(var i=0; i< tempList.length; i++){
        			tempList[i].SerialNo = i+ 1 ;
        		}
                tempList2 = tempList.slice((pageNumber-1)*sortNo,pageNumber*sortNo);
                component.set('v.paginationList',tempList2);
                
                component.set("v.maxPage", Math.ceil((tempList.length)/sortNo));
                component.set('v.noRecordsToShow',false);
             }else if(tempList.length == 0){
                 var emptyList = [];
                component.set("v.paginationList", emptyList);
                component.set('v.noRecordsToShow',true);
                component.set('v.maxPage',pageNumber); 
            }
            
        }
    },
    
    onSortChange: function(component,event,helper){
        var wrapList = component.get('v.wrapperList');
        var sortNo = component.get('v.sortNo');
        var length = component.get("v.wrapperList").length;
        var searchkey = component.find('searchKey').get('v.value');
        var pageNumber = component.get('v.pageNumber');
         var templist  = [];
          
        if(sortNo > length && searchkey == ''){
            component.set("v.maxPage", Math.ceil((component.get("v.wrapperList").length)/sortNo));
    		component.set('v.pageNumber',1);
        	helper.renderPage(component);
        }
        if(sortNo < length && searchkey != ''){
                for(var i=0 ; i< wrapList.length;i++){
                    if(wrapList[i].fieldName.toLowerCase().startsWith(searchkey.toLowerCase())){
                        templist.push(wrapList[i]);
                    }
            	}
            if(templist.length > 0 && sortNo < templist.length){
                var pagenumber = component.get('v.pageNumber');
                component.set("v.maxPage",Math.ceil(templist.length/sortNo));
                var templist2= templist.slice((pagenumber-1)*sortNo,pagenumber*sortNo);
                component.set('v.paginationList',templist2);
            }
         }
        if(sortNo > length && searchkey != ''){
            for(var i=0 ; i< wrapList.length;i++){
                    if(wrapList[i].fieldName.toLowerCase().startsWith(searchkey.toLowerCase())){
                        templist.push(wrapList[i]);
                    }
            }
            if(sortNo < templist.length){
                var pagenumber = component.get('v.pageNumber');
                component.set("v.maxPage",Math.ceil(templist.length/sortNo));
                var templist2= templist.slice((pagenumber-1)*sortNo,pagenumber*sortNo);
                component.set('v.paginationList',templist2);
            } 
        }  
         if(searchkey == ''&& sortNo < length){
            component.set("v.maxPage", Math.ceil((component.get("v.wrapperList").length)/sortNo));
            component.set('v.pageNumber',1);
            helper.renderPage(component);
          }
        if(sortNo == length){
            component.set("v.maxPage", Math.ceil((length)/sortNo));
            helper.renderPage(component);
        }  
    },
        
    
    onPagination: function(component,event,helper){
        var wrapList = component.get('v.wrapperList');
        var templist = [];
        var templist2 = [];
        var searchkey = component.find('searchKey').get('v.value');
        if(searchkey == ''){
        	helper.renderPage(component);
        }
        else{
            for(var i=0 ; i< wrapList.length;i++){
                if(wrapList[i].fieldName.toLowerCase().startsWith(searchkey.toLowerCase())){
                    templist.push(wrapList[i]);
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
        
    },
    
    panelButtonClick: function(component,event,helper){
        var panelProfileList = component.get('v.panelProfiles');
        
        var tempList = [];
        for(var i= 0 ; i< panelProfileList.length ; i++){
            if(panelProfileList[i].checked == true){
                tempList.push(panelProfileList[i].Name);
            }
        }
        console.log(tempList);
        var action = component.get('c.getWrapperContent');
        component.set('v.spinner',true);
        action.setParams({
            "objName" : component.get('v.objselectedValue'),
            "profileName" :tempList
        });
        
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            if(state === "SUCCESS") {   
                var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                        "title"  : "Success!",
                        "message": "The record has been updated successfully.",
                        "type"   : "Success"
                        });
                        toastEvent.fire();                    
                 component.set('v.spinner',false);
                var allValues = response.getReturnValue();
                for(var i=0; i< allValues.length; i++){
                    allValues[i].SerialNo = i+ 1  ;
                }
                component.set('v.wrapperList', allValues);
                helper.renderPage(component);
                component.set('v.spinner',false);
                component.set('v.panel',false);
            }      
        });
        $A.enqueueAction(action);
        
    },
    sort:function( component, event, helper ) {
        
        var SortOrder = component.get('v.sortOrder');
        SortOrder = SortOrder === 'asc' ? 'desc' : 'asc';
        var reverse = SortOrder === 'asc' ? 1 : -1;
        let table = JSON.parse(JSON.stringify(component.get('v.wrapperList')));
        table.sort((a,b) => {return a[a.fieldName] > b[b.fieldName] ? 1*reverse : -1*reverse});
        component.set('v.sortOrder','desc');
        component.set('v.wrapperList',table);
        helper.renderPage(component);
        if(event.getSource().get('v.title') == 'arrowup'){
            component.set('v.arrowDown',true);
        	component.set('v.arrowUp',false);
        }else{
            component.set('v.arrowDown',false);
        	component.set('v.arrowUp',true);
        }
    },
        
    handleNewButtonClick: function( component, event, helper ){
        component.set('v.showModal',true);
    },
    
    handleShowProfilesClick: function( component, event, helper ){
        var panel = component.get('v.panel');
        if(panel == false){
          component.set('v.panel',true);
        }else{
            component.set('v.panel',false);
        }
    },
    
    handlePanelClose: function( component, event, helper ){
        component.set('v.panel',false);
        var pflist = component.get('v.panelProfiles');
        var wraplist = component.get('v.wrapperList');
        
        var templist =[];
        for(var i= 0 ; i< wraplist[0].profileWrp.length ; i++){
            templist.push(wraplist[0].profileWrp[i].profile);
        }
        
        for(var i= 0 ; i< pflist.length ; i++){ 
            if(templist.includes(pflist[i].Name)){
                pflist[i].checked = true;
            }else{
                pflist[i].checked = false;
            }	  			 
        }
        
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
})