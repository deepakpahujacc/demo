({
    getTableFieldSet : function(component, event, helper) {
        var action = component.get("c.getFieldSet");
        action.setParams({
            sObjectName: component.get("v.objselectedValue")
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
                if(fieldSetValues[c].type == 'REFERENCE') {
                    if(fieldSetValues[c].name.indexOf('__c') == -1) {
                        setfieldNames.add(fieldSetValues[c].name.substring(0, fieldSetValues[c].name.indexOf('Id')) + '.Name');
                    }
                    else {
                        setfieldNames.add(fieldSetValues[c].name.substring(0, fieldSetValues[c].name.indexOf('__c')) + '__r.Name');
                        
                    } 
                } 
            } 
        } 
        var arrfieldNames = []; 
        setfieldNames.forEach(v => arrfieldNames.push(v));
        console.log(arrfieldNames);
        action.setParams({
            sObjectName: component.get("v.objselectedValue"),
            fieldNameJson: JSON.stringify(arrfieldNames)
        });
        action.setCallback(this, function(response) {
            this.hideSpinner(component);
            var extraField = response.getReturnValue();
            for(var i; i<extraField.length; i++){
                extraField[i].fromOrg = true;
            }
            var byName = extraField.slice(0);
            byName.sort(function(a,b) {
                var x = a.Name.toLowerCase();
                var y = b.Name.toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
            });
            console.log('sorted:',byName);
            component.set('v.customSettingRecords', byName);
            var sample = component.get('v.customSettingRecords');
            var myMap = new Map();
            
            for(var y = 0; y < sample.length;y++){
                
                myMap.set(sample[y].Name,'hi');
            }
            console.log('MAP',myMap);
            component.set('v.existingName',myMap);
            //pagenation part
            var sortNo = component.get('v.sortNo');
            var divForPage =   parseInt(Math.floor(component.get("v.customSettingRecords").length+parseInt(sortNo-1))/sortNo);
            if(divForPage > 0)
                component.set("v.maxPage",divForPage);
            else
                component.set("v.maxPage",1); 
            this.renderPage(component);
        })
        this.hideSpinner(component);
        $A.enqueueAction(action);
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
    renderPage: function(component){
        var wrapList= component.get('v.customSettingRecords');
        var pagenumber = component.get('v.pageNumber');
        var sortNo = component.get('v.sortNo');
        var templist= wrapList.slice((pagenumber-1)*sortNo,pagenumber*sortNo);
        component.set('v.paginationList',templist);
    }
})