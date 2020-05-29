({
    doInit : function(component, event, helper) {
        var record = component.get("v.record");
        var field = component.get("v.field");
        component.set("v.cellValue", record[field.name]);
        console.log('record:- ' + JSON.stringify(record)+ 'field :- '+ JSON.stringify(field));
        
        if(field.type == 'STRING'){
            component.set("v.isTextField", true);
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
                                                else if(field.type == 'DOUBLE'){
                                                    component.set("v.isNumberField", true);
                                                }
    }
})