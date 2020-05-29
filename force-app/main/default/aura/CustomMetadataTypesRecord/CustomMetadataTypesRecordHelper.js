({
    fetchData : function( component,event,helper ) {
        var action = component.get("c.getObjectlist");
        action.setCallback( this, function( response ) {
            var state = response.getState();
            if( state === "SUCCESS") {
                var result = response.getReturnValue();
                var plValues = [];
                for (var i = 0; i < result.length; i++) {
                    plValues.push({
                        label: result[i].split('####')[1],
                        value: result[i].split('####')[0]
                    });
                }
                component.set("v.Objectvisible", false);
                plValues.sort();
                component.set("v.CustomMetaDataObjecList", plValues);
                component.set("v.Spinner", false);
            }
        });
        
        $A.enqueueAction( action );
    },
    getTableFieldSet : function(component, event, helper) {
        var action = component.get("c.getFieldSet");
        action.setParams({
            sObjectName: component.get("v.SelectedObject")
        });
        action.setCallback(this, function(response) {            
            var fieldSetObj = JSON.parse(response.getReturnValue());
            component.set("v.fieldSetValues", fieldSetObj);
            this.getTableRows(component, event, helper);
        })
        $A.enqueueAction(action);
    },
    getTableRows : function(component, event, helper){ 
        var action = component.get("c.getRecords");
        var fieldSetValues = component.get("v.fieldSetValues");
        var setfieldNames = new Set();
        for(var c=0, clang=fieldSetValues.length; c<clang; c++){            
            if(!setfieldNames.has(fieldSetValues[c].name)) {
                setfieldNames.add(fieldSetValues[c].name);
                if(fieldSetValues[c].type == 'REFERENCE') {} 
            } 
        } 
        var arrfieldNames = []; 
        var sortNo = component.get('v.sortNo');
        setfieldNames.forEach(v => arrfieldNames.push(v));       
        action.setParams({
            sObjectName: component.get("v.SelectedObject"),
            fieldNameJson: JSON.stringify(arrfieldNames)
        });
        action.setCallback(this, function(response) {
            this.hideSpinner(component);
            var extraField = JSON.parse(response.getReturnValue());
            if(extraField.length > 0){
                for(var i; i<extraField.length; i++){
                    extraField[i].fromOrg = true;
                }
                var byName = extraField.slice(0);
                console.log('byname '+byName);
                byName.sort(function(a,b) {
                    var x = a.DeveloperName.toLowerCase();
                    var y = b.DeveloperName.toLowerCase();
                    return x < y ? -1 : x > y ? 1 : 0;
                });
                for(var i=0; i<byName.length;i++){
                    byName[i].serialNo=i+1;   
                }
                component.set("v.tableRecords", byName);
                component.set("v.tableRecordsOriginal",byName);
                var updatedList = component.get('v.tableRecords');
                component.set("v.maxPage",Math.ceil((component.get("v.tableRecords").length)/sortNo));
                this.renderPage(component); 
            }
            else{
                
                component.set('v.pagenumber',1);
                component.set("v.maxPage",1);
                component.set('v.Spinner',false);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Error',
                    message:'No Record Found',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'pester'
                });
                toastEvent.fire();
            }
            
        })
        $A.enqueueAction(action);
    },
    removeRecord : function(component, index) {
        var records = component.get("v.tableRecords");
        records.splice(index, 1);
        component.set("v.tableRecords", records);
    },
    showSpinner: function (component, event, helper) {
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
    
    hideSpinner: function (component, event, helper) {
        component.set("v.Recordvisible", false);
        var spinner = component.find("mySpinner");
        $A.util.addClass(spinner, "slds-hide");
    },
    renderPage: function(cmp){    
        var sortNo = cmp.get('v.sortNo');
        var wrapList= cmp.get('v.tableRecords');
        var pagenumber = cmp.get('v.pageNumber'); 
        var templist= wrapList.slice((pagenumber-1)*sortNo,pagenumber*sortNo);
        cmp.set('v.paginationList',templist);
        cmp.set("v.Spinner", false);
        cmp.set("v.Spinner", false); 
    },
    paginationHandle:function(cmp){
        var sortNo = cmp.get('v.sortNo');
        var wrapList= cmp.get('v.tableRecords');
        var pagenumber = cmp.get('v.pageNumber');
        var maxPage = cmp.get('v.maxPage');
        if(pagenumber<=maxPage){
            var templist= wrapList.slice((pagenumber-1)*sortNo,pagenumber*sortNo);
            cmp.set('v.paginationList',templist);    
        }
        else{
            cmp.set('v.pageNumber',1);
            var pagenumber = cmp.get('v.pageNumber');
            var templist= wrapList.slice((pagenumber-1)*sortNo,pagenumber*sortNo);
            cmp.set('v.paginationList',templist);
        }
    }
})