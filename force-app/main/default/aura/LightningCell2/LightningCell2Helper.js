({
    doInit : function(component, event, helper) {
        var record = component.get("v.record");
        var field = component.get("v.field");
        component.set("v.cellValue", record[field.name]);
        
        if(field.type == 'STRING'){
            if(field.required=='true'){
                component.set("v.isRequired", true);
            }
            component.set("v.isTextField", true);
            if(field.name=='DeveloperName' && record['DeveloperName'] !=null ){
                component.set("v.isDevelopername", true);
            }
            else{
                component.set("v.isDevelopername", false);
            }
            
        }
        
        else if(field.type == 'DATE'){
            component.set("v.isDateField", true);
        }
            else if(field.type == 'DATETIME'){
                component.set("v.isDateTimeField", true);
            }
                else if(field.type == 'ID'){
                    component.set("v.isIdField", true);
                }
                    else if(field.type == 'EMAIL'){
                        component.set("v.isEmailField", true);
                    }
                        else if(field.type == 'DOUBLE'){
                            component.set("v.isNumberField", true);
                        }
                            else if(field.type == 'CURRENCY'){
                                component.set("v.isCurrencyField", true);
                            }
                                else if(field.type == 'BOOLEAN'){
                                    component.set("v.isCheckBoxField", true);
                                }
                                    else if(field.type == 'URL'){
                                        component.set("v.isUrlField", true);
                                    }
                                        else if(field.type == 'TEXTAREA'){
                                            component.set("v.isTextAreaLongField", true);
                                        }
                                            else if(field.type == 'PHONE'){
                                                component.set("v.isPhoneField", true);
                                            }
                                                else if(field.type == 'PERCENT'){
                                                    component.set("v.isPercentField", true);
                                                }
                                                    else if(field.type == 'PICKLIST'){
                                                        if(JSON.stringify(record[field.name]) != null && JSON.stringify(record[field.name]) != '' ){
                                                            component.set("v.isPicklistField", true);
                                                            component.set("v.isPicklistFieldNull", true);
                                                        }
                                                        else{
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
                                                        }
                                                    }
                                                        else if(field.type == 'REFERENCE'){
                                                            if(JSON.stringify(record[field.name]) != null && JSON.stringify(record[field.name]) != '' ){
                                                                var action = component.get('c.fetchLookupObjectName');
                                                                action.setParams({
                                                                    fieldId : record[field.name]
                                                                });
                                                                action.setCallback(this, function(response) {
                                                                    var state = response.getState();
                                                                    if (state === "SUCCESS") {
                                                                        var result = response.getReturnValue();
                                                                        component.set("v.ReferncefieldValue",(result));
                                                                        component.set("v.isReferenceField", true);
                                                                        component.set("v.ReferncefieldValueNotNull", true);
                                                                        
                                                                    }
                                                                });
                                                                $A.enqueueAction(action);
                                                            }
                                                            else{
                                                                component.set("v.isReferenceField", true);
                                                                component.set("v.ReferncefieldValueNotNull", false);
                                                            }
                                                        }
        
    },
})