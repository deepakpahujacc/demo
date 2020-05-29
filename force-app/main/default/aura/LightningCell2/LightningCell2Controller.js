({
    doInit : function(component, event, helper) {
        helper.doInit(component, event, helper);
        
    },
    handelOnChange : function(component,event,helper){
        var recordRow = component.get('v.record');
        var fieldName = component.get('v.field');
        recordRow[fieldName.name] = component.get('v.cellValue');
        component.set('v.record', recordRow);
    },
    handelpicklist : function(component,event,helper){
        var record = component.get("v.record");
        var field = component.get("v.field");
        var action = component.get('c.fetchPicklistValue');
        action.setParams({
            objectnames : JSON.stringify(component.get("v.objectname")),
            fieldData : JSON.stringify(field)
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                var plValues = [];
                plValues.push({
                    Label:'',
                    value:''
                });
                for (var i = 0; i < result.length; i++) {
                    plValues.push({
                        label: result[i].split('####')[1],
                        value: result[i].split('####')[0]
                    });
                }
                component.set("v.options", plValues);
                component.set("v.isPicklistField", true);
                component.set("v.isPicklistFieldNull", false);
            }
        });
        $A.enqueueAction(action);
    },
    handlepicklistchange : function(component,event,helper){
        var recordRow = component.get('v.record');
        var fieldName = component.get('v.field');
        recordRow[fieldName.name] = component.find('pId').get('v.value');
        component.set('v.record', recordRow);
    },
    handelookup :function(component,event,helper){
        var record = component.get("v.record");
        var field = component.get("v.field");
        var action = component.get('c.fetchLookupObjectList');
        action.setParams({ objectData : JSON.stringify(field) });
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                console.log('result' +JSON.stringify(result) );
                var plValues = [];
                plValues.push({
                    Label:'--none--',
                    value:''
                });
                for (var i = 0; i < result.length; i++) {
                    console.log(JSON.stringify(result[i].Id));
                    plValues.push({
                        label: result[i].DeveloperName,
                        value: result[i].DeveloperName
                    });
                }
                component.set("v.lookupData", plValues);
                component.set("v.isReferenceField", true);
                component.set("v.isReferenceFieldNull", false);
            }
        });
        $A.enqueueAction(action);
    },
    handlefieldchange : function(component,event,helper){
        var recordRow = component.get('v.record');
        var fieldName = component.get('v.field');
        recordRow[fieldName.name] = component.find('fielId').get('v.value');
        component.set('v.record', recordRow);
    },
    handleLookupEdit : function(component,event,helper){
        component.set('v.ReferncefieldValueNotNull',false);
        component.set('v.EditLookupfield',true);
    },
    closeModel: function(component, event, helper) {
        component.set('v.ReferncefieldValueNotNull',true);
        component.set('v.EditLookupfield',false);
    },
    handleSearch: function (component, event) {
        var queryTerm = component.find('enter-search').get('v.value');
        var record = component.get("v.record");
        var field = component.get("v.field");
        var action = component.get("c.fetchLookupObjectData");
        action.setParams({
            objectData : JSON.stringify(field),
            queryTerm : queryTerm,
            objectname : JSON.stringify(component.get("v.objectname"))
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                if(result.length != 0){
                    component.set("v.LookupListLenght", true);
                    var plValues = [];
                    plValues.push({Label: '--none --',value:''});
                    for (var i = 0; i < result.length; i++) {
                        console.log(JSON.stringify(result[i].Id));
                        plValues.push({
                            Label: result[i].DeveloperName,
                            value: result[i].Id
                        });
                    }
                    component.set("v.LookupList", plValues);
                }
                else{
                    component.set("v.LookupListLenght", false);
                }
            }
        });
        $A.enqueueAction(action);
    },
    handleLookupChangeOnChange : function(component, event, helper){
        var LookupList = component.get("v.LookupList")[component.get("v.LookupId")];
        if(JSON.stringify(component.get("v.LookupList")[component.get("v.LookupId")]) != null){
            component.set('v.ReferncefieldValue',LookupList);
        }
        else{
            component.set('v.ReferncefieldValue','');
        }
        component.set('v.ReferncefieldValueNotNull',true);
        component.set('v.EditLookupfield',false);
        var recordRow = component.get('v.record');
        var fieldName = component.get('v.field');
        if(component.get('v.ReferncefieldValue') != null && component.get('v.ReferncefieldValue') != ''){
            recordRow[fieldName.name] = component.get('v.ReferncefieldValue.value');
        }
        component.set('v.record', recordRow);
        
    },
})