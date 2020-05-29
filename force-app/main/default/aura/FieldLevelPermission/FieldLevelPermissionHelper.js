({
    
    getObjectAndPanelProfiles: function (component) {
        var action1 = component.get("c.objectList");
        var action2 = component.get("c.panelProfiles");
        
        action1.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {           
                var allValues = response.getReturnValue();
                var objValues = [];
                for (var i = 0; i < allValues.length; i++) {
                    objValues.push({
                        label: allValues[i].split('####')[1],
                        value: allValues[i].split('####')[0]
                    });
                }
                component.set('v.onLoadSpinner',false);
                objValues.sort();
                component.set("v.objList", objValues);
            }        	         
        });
        
        action2.setCallback(this, function(response) {
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
        
        $A.enqueueAction(action1);
        $A.enqueueAction(action2);
    },
    
    getFields: function (cmp) {
        var action = cmp.get('c.getWrapperContent');
        var obj = cmp.get('v.objselectedValue');
        
        action.setParams({
            "objName" : cmp.get('v.objselectedValue'),
            "profileName" :null
        });
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            if(state === "SUCCESS") {           
                var allValues = response.getReturnValue();
                if(allValues.length == 0){
                    var tempList = [];
                    cmp.set('v.dataVisible', true);
                    cmp.set('v.fieldsVisible', false);
                    cmp.set('v.wrapperList', tempList);
                    cmp.set('v.spinner',false);
                }else{
                    cmp.set('v.dataVisible', false);
                    cmp.set('v.sortNo', 10);
                    cmp.set('v.newAndShowProfiles', false);
                    cmp.set('v.fieldsVisible', true);
                    cmp.set('v.tableshow',true);
                    
                    for(var i=0; i< allValues.length; i++){
                        allValues[i].SerialNo = i+ 1  ;
                    }
                    cmp.set('v.spinner',false);
                    console.log(allValues);
                    cmp.set('v.wrapperList', allValues);
                    var sortNo = cmp.get('v.sortNo');
                    cmp.set("v.maxPage", Math.ceil((cmp.get("v.wrapperList").length)/sortNo));
                    console.log(cmp.get("v.maxPage"));
                    this.renderPage(cmp);
                    cmp.find('searchKey').set('v.value', '');
                }
            }      
        });
        $A.enqueueAction(action);
    },
    
    renderPage: function(cmp,event){
        var wrapList= cmp.get('v.wrapperList');
        var pageNumber = cmp.get('v.pageNumber');
        var sortNo = cmp.get('v.sortNo');
        var tempList= wrapList.slice((pageNumber-1)*sortNo,pageNumber*sortNo);
        for(var i=0; i< tempList.length; i++){
            tempList[i].SerialNo = i+ 1 ;
        }
        cmp.set('v.paginationList',tempList);
    },
    
    savePermission: function(component, profile, fieldsList,sizeofMap,j){
        var localthis = this;
        window.setTimeout(
            $A.getCallback(function() { 
                var action = component.get('c.fieldLevelPermissions');
                component.set('v.spinner',true);
                action.setParams({ 
                    "profileName" : profile,
                    "fieldsName" 	: fieldsList
                });
                action.setCallback(this, function(response) {
                    console.log('response chala')
                    var state = response.getState();
                    if(state === "SUCCESS") {
                        localthis.toast(component,sizeofMap,j);
                    }
                });
                $A.enqueueAction(action);    
            }), 1000
        );
    },
    
    toast: function(component,sizeofMap,j){
        console.log(sizeofMap+''+j+1);
        if(sizeofMap == (j+1)){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Success',
                    message: 'Permissions Saved',
                    duration:' 5000',
                    type: 'success',
                });
                toastEvent.fire();
            this.getFields(component);
            component.set('v.spinner',false);
                
        }/*else if(sizeofMap == j){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Error',
                    message:'Something went wrong',
                    type: 'error',
                });
                toastEvent.fire(); 
        }*/
    }
})