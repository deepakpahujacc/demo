({ 
    openModel: function(component, event, helper) {
        // for Display Model,set the "isOpen" attribute to "true"
        component.set("v.isOpen", true);
    },
    
    closeModel: function(component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
        var vx = component.get("v.method");
        $A.enqueueAction(vx);
        component.set("v.isOpen", false);
    },
    
    save: function(component, event, helper) {
        var fLable = component.get('v.lable');
        var nav = component.find("radiusPicklist").get("v.value");
        if(nav == "Select an Option"){
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({ title : 'Error Message', message:'Select a Field Type first', type: 'error',  
                                 });
            toastEvent.fire();
        }
        else{
            var validExpense = component.find('expenseform').reduce(function (validSoFar, inputCmp) {
                // Displays error messages for invalid fields
                inputCmp.showHelpMessageIfInvalid();
                return validSoFar && inputCmp.get('v.validity').valid;
            }, true);
            // If we pass error checking, do some real work
            if(validExpense){
                function findMatches(regex, str, matches = []) {
                    const res = regex.exec(str)
                    res && matches.push(res) && findMatches(regex, str, matches)
                    return matches
                }
                var forValid = component.get("v.name");
                var matches = findMatches(/__/g, forValid);
                var matches1 = findMatches(/[-!$%^&*()+|~=`{}[:;<>?,.@#\]]/g, forValid);
                var nameInitial =forValid.substring(0,1);
                var matches2 = findMatches(/[-!$%^&*()_+|~=`{}[:;<>?,.@#\]0-9]/g,nameInitial );
                var matches3 = findMatches(/[\s\r\n]/g,forValid);
                console.log('%%',matches);
                if(matches.length >1){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({ title : 'Error Message', message:forValid+' Invalid Field Name', type: 'error',  
                                         });
                    toastEvent.fire();
                }else if(matches1.length >0){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({ title : 'Error Message', message:forValid+' Invalid Field Name', type: 'error',  
                                         });
                    toastEvent.fire();
                }else if(matches2.length >0){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({ title : 'Error Message', message:forValid+' Invalid Field Name', type: 'error',  
                                         });
                    toastEvent.fire();
                }else if(matches3.length>0){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({ title : 'Error Message', message:forValid+' Invalid Field Name', type: 'error',  
                                         });
                    toastEvent.fire();
                }
                else{
                    let word = component.get("v.name"), sequenceToCheck = '__c';
                    if (word.indexOf(sequenceToCheck) > -1) {
                        console.log('sequence exist');
                        var fName = component.get('v.name');
                    } else {
                        console.log('sequence does not exist');
                        var fName = component.get('v.name')+'__c';
                        console.log('@',fName);
                    }        
                    var action1 = component.get('c.getFields');
                    action1.setParams({"objName":component.get('v.objname'),"fieldName":fName});
                    action1.setCallback(this, function(response) {
                        var state = response.getState();
                        if (state === "SUCCESS") { 
                            if(response.getReturnValue() == "True"){
                                var toastEvent = $A.get("e.force:showToast");
                                toastEvent.setParams({ title : 'Error Message', message:'Field Name Already Exists', type: 'error',  
                                                     });
                                toastEvent.fire();
                            }
                            else{
                                if(nav == "CheckBox"){
                                    var dValue = component.get('v.value');
                                    var action = component.get('c.createCheckboxField');
                                    action.setParams({"objName":component.get('v.objname'), "label":fLable, "name":fName, "defVal":dValue});
                                    action.setCallback(this, function(response) {
                                        var state = response.getState();
                                        if (state === "SUCCESS") { 
                                            var toastEvent = $A.get("e.force:showToast");
                                            toastEvent.setParams({ title : 'Sucess Message', message:'CheckBox Field created.', type: 'success',  
                                                                 });
                                            toastEvent.fire();
                                            component.set("v.isOpen", false);
                                            component.set("v.toggleCheckBox", false);
                                            component.set("v.togglemain", true);
                                            var vx = component.get("v.method");
                                            $A.enqueueAction(vx);
                                        }
                                    });
                                    $A.enqueueAction(action);
                                    component.set("v.lable", "");
                                    component.set("v.name", "");
                                    component.set("v.value", "");
                                }
                                else if(nav == "Text"){
                                    var fLength = component.get('v.length');
                                    if (component.get('v.length') <= 255){
                                        var action = component.get('c.createTextField');
                                        console.log(component.get('v.objname'));
                                        action.setParams({"objName":component.get('v.objname'), "label":fLable, "name":fName, "len":fLength, "required":component.get('v.requiredValue'), "externalID":component.get('v.externalidValue')});
                                        action.setCallback(this, function(response) {
                                            var state = response.getState();
                                            if (state === "SUCCESS") { 
                                                var toastEvent = $A.get("e.force:showToast");
                                                toastEvent.setParams({ title : 'Sucess Message', message:'Text Field created.', type: 'success',  
                                                                     });
                                                toastEvent.fire();
                                                component.set("v.isOpen", false);
                                                component.set("v.toggleText", false);
                                                component.set("v.togglemain", true);
                                                var vx = component.get("v.method");
                                                $A.enqueueAction(vx);
                                            }
                                        });
                                        $A.enqueueAction(action);
                                        component.set("v.lable", "");
                                        component.set("v.name", "");
                                        component.set("v.length", "");
                                        component.set("v.requiredValue", "");
                                        component.set("v.externalidValue", "");
                                    }
                                    else{
                                        var toastEvent = $A.get("e.force:showToast");
                                        toastEvent.setParams({ title : 'Error Message', message:'Length Must Be Less Than Or Equal To 255', type: 'error',  
                                                             });
                                        toastEvent.fire();
                                    }
                                }
                                    else if(nav == "Email"){    
                                        var action = component.get('c.createEmailField');
                                        action.setParams({"objName":component.get('v.objname'), "label":fLable, "name":fName, "required":component.get('v.requiredValue'), "uniqueID":component.get('v.uniqueValue'), "externalID":component.get('v.externalidValue')});
                                        action.setCallback(this, function(response) {
                                            var state = response.getState();
                                            if (state === "SUCCESS") { 
                                                var toastEvent = $A.get("e.force:showToast");
                                                toastEvent.setParams({ title : 'Sucess Message', message:'Email Field created.', type: 'success',  
                                                                     });
                                                toastEvent.fire();
                                                component.set("v.isOpen", false);
                                                component.set("v.toggleEmail", false);
                                                component.set("v.togglemain", true);
                                                var vx = component.get("v.method");
                                                $A.enqueueAction(vx);
                                            }
                                        });
                                        $A.enqueueAction(action);
                                        component.set("v.lable", "");
                                        component.set("v.name", "");
                                        component.set("v.requiredValue", "");
                                        component.set("v.uniqueValue", "");
                                        component.set("v.externalidValue", "");
                                    }
                                        else if(nav == "Currency"){
                                            var fLength = component.get('v.length');
                                            var dePlace = component.get('v.decimal');
                                            if(parseInt(component.get('v.length'))+parseInt(component.get('v.decimal')) <= 18 ){
                                                var action = component.get('c.createCurrencyField');
                                                action.setParams({"objName":component.get('v.objname'), "label":fLable, "name":fName, "len":fLength, "dPlace":dePlace, "required":component.get('v.requiredValue')});
                                                action.setCallback(this, function(response) {
                                                    var state = response.getState();
                                                    if (state === "SUCCESS") { 
                                                        var toastEvent = $A.get("e.force:showToast");
                                                        toastEvent.setParams({ title : 'Sucess Message', message:'Currency Field created.', type: 'success',  
                                                                             });
                                                        toastEvent.fire();
                                                        component.set("v.isOpen", false);
                                                        component.set("v.toggleCurrency", false);
                                                        component.set("v.togglemain", true);
                                                        var vx = component.get("v.method");
                                                        $A.enqueueAction(vx);
                                                    }
                                                });
                                                $A.enqueueAction(action);
                                                component.set("v.lable", "");
                                                component.set("v.name", "");
                                                component.set("v.length", "");
                                                component.set("v.decimal", "");
                                                component.set("v.requiredValue", "");
                                            }
                                            else{
                                                var toastEvent = $A.get("e.force:showToast");
                                                toastEvent.setParams({ title : 'Error Message', message:'The sum of the length and decimal places must be less than or equal to 18', type: 'error',  
                                                                     });
                                                toastEvent.fire();
                                            }
                                        }
                                            else if(nav == "Number"){
                                                var fLength = component.get('v.length');
                                                var dePlace = component.get('v.decimal');
                                                if(parseInt(component.get('v.length'))+parseInt(component.get('v.decimal')) <= 18 ){
                                                    var action = component.get('c.createNumberField');
                                                    action.setParams({"objName":component.get('v.objname'), "label":fLable, "name":fName, "len":fLength, "dPlace":dePlace, "required":component.get('v.requiredValue'), "uniqueID":component.get('v.uniqueValue'), "externalID":component.get('v.externalidValue')});
                                                    action.setCallback(this, function(response) {
                                                        var state = response.getState();
                                                        if (state === "SUCCESS") { 
                                                            var toastEvent = $A.get("e.force:showToast");
                                                            toastEvent.setParams({ title : 'Sucess Message', message:'Number Field created.', type: 'success',  
                                                                                 });
                                                            toastEvent.fire();
                                                            component.set("v.isOpen", false);
                                                            component.set("v.toggleNumber", false);
                                                            component.set("v.togglemain", true);
                                                            var vx = component.get("v.method");
                                                            $A.enqueueAction(vx);
                                                        }
                                                    });
                                                    $A.enqueueAction(action);
                                                    component.set("v.lable", "");
                                                    component.set("v.name", "");
                                                    component.set("v.length", "");
                                                    component.set("v.decimal", "");
                                                    component.set("v.requiredValue", "");
                                                    component.set("v.uniqueValue", "");
                                                    component.set("v.externalidValue", "");
                                                }
                                                else{
                                                    var toastEvent = $A.get("e.force:showToast");
                                                    toastEvent.setParams({ title : 'Error Message', message:'The sum of the length and decimal places must be less than or equal to 18', type: 'error',  
                                                                         });
                                                    toastEvent.fire();
                                                }
                                            }
                                                else if(nav == "Date"){
                                                    var action = component.get('c.createDateField');
                                                    action.setParams({"objName":component.get('v.objname'), "label":fLable, "name":fName, "required":component.get('v.requiredValue')});
                                                    action.setCallback(this, function(response) {
                                                        var state = response.getState();
                                                        if (state === "SUCCESS") { 
                                                            var toastEvent = $A.get("e.force:showToast");
                                                            toastEvent.setParams({ title : 'Sucess Message', message:'Date Field created.', type: 'success',  
                                                                                 });
                                                            toastEvent.fire();
                                                            component.set("v.isOpen", false);
                                                            component.set("v.toggleDate", false);
                                                            component.set("v.togglemain", true);
                                                            var vx = component.get("v.method");
                                                            $A.enqueueAction(vx);
                                                        }
                                                    });
                                                    $A.enqueueAction(action);
                                                    component.set("v.lable", "");
                                                    component.set("v.name", "");
                                                    component.set("v.requiredValue", "");
                                                }
                                                    else if(nav == "Date/Time"){
                                                        var action = component.get('c.createDateTimeField');
                                                        action.setParams({"objName":component.get('v.objname'), "label":fLable, "name":fName, "required":component.get('v.requiredValue')});
                                                        action.setCallback(this, function(response) {
                                                            var state = response.getState();
                                                            if (state === "SUCCESS") { 
                                                                var toastEvent = $A.get("e.force:showToast");
                                                                toastEvent.setParams({ title : 'Sucess Message', message:'Date/Time Field created.', type: 'success',  
                                                                                     });
                                                                toastEvent.fire();
                                                                component.set("v.isOpen", false);
                                                                component.set("v.toggleDateTime", false);
                                                                component.set("v.togglemain", true);
                                                                var vx = component.get("v.method");
                                                                $A.enqueueAction(vx);
                                                            }
                                                        });
                                                        $A.enqueueAction(action);
                                                        component.set("v.lable", "");
                                                        component.set("v.name", "");
                                                        component.set("v.requiredValue", "");
                                                    }
                                                        else if(nav == "Percent"){
                                                            var fLength = component.get('v.length');
                                                            var dePlace = component.get('v.decimal');
                                                            if(parseInt(component.get('v.length'))+parseInt(component.get('v.decimal')) <= 18 ){
                                                                var action = component.get('c.createPercentField');
                                                                action.setParams({"objName":component.get('v.objname'), "label":fLable, "name":fName, "len":fLength, "dPlace":dePlace, "required":component.get('v.requiredValue')});
                                                                action.setCallback(this, function(response) {
                                                                    var state = response.getState();
                                                                    if (state === "SUCCESS") { 
                                                                        var toastEvent = $A.get("e.force:showToast");
                                                                        toastEvent.setParams({ title : 'Sucess Message', message:'Percent Field created.', type: 'success',  
                                                                                             });
                                                                        toastEvent.fire();
                                                                        component.set("v.isOpen", false);
                                                                        component.set("v.togglePercent", false);
                                                                        component.set("v.togglemain", true);
                                                                        var vx = component.get("v.method");
                                                                        $A.enqueueAction(vx);
                                                                    }
                                                                });
                                                                $A.enqueueAction(action);
                                                                component.set("v.lable", "");
                                                                component.set("v.name", "");
                                                                component.set("v.length", "");
                                                                component.set("v.decimal", "");
                                                                component.set("v.requiredValue", "");
                                                            }
                                                            else{
                                                                var toastEvent = $A.get("e.force:showToast");
                                                                toastEvent.setParams({ title : 'Error Message', message:'The sum of the length and decimal places must be less than or equal to 18', type: 'error',  
                                                                                     });
                                                                toastEvent.fire();
                                                            }
                                                        }
                                                            else if(nav == "Phone"){
                                                                var action = component.get('c.createPhoneField');
                                                                action.setParams({"objName":component.get('v.objname'), "label":fLable, "name":fName, "required":component.get('v.requiredValue')});
                                                                action.setCallback(this, function(response) {
                                                                    var state = response.getState();
                                                                    if (state === "SUCCESS") { 
                                                                        var toastEvent = $A.get("e.force:showToast");
                                                                        toastEvent.setParams({ title : 'Sucess Message', message:'Phone Field created.', type: 'success',  
                                                                                             });
                                                                        toastEvent.fire();
                                                                        component.set("v.isOpen", false);
                                                                        component.set("v.togglePhone", false);
                                                                        component.set("v.togglemain", true);
                                                                        var vx = component.get("v.method");
                                                                        $A.enqueueAction(vx);
                                                                    }
                                                                });
                                                                $A.enqueueAction(action);
                                                                component.set("v.lable", "");
                                                                component.set("v.name", "");
                                                                component.set("v.requiredValue", "");
                                                            }
                                                                else if(nav == "Picklist"){
                                                                    var pList = component.get('v.pvalues');
                                                                    var action = component.get('c.createPicklistField');
                                                                    action.setParams({"objName":component.get('v.objname'), "label":fLable, "name":fName, "values":pList, "required":component.get('v.requiredValue')});
                                                                    action.setCallback(this, function(response) {
                                                                        var state = response.getState();
                                                                        if (state === "SUCCESS") { 
                                                                            var toastEvent = $A.get("e.force:showToast");
                                                                            toastEvent.setParams({ title : 'Sucess Message', message:'Picklist Field created.', type: 'success',  
                                                                                                 });
                                                                            toastEvent.fire();
                                                                            component.set("v.isOpen", false);
                                                                            component.set("v.togglePicklist", false);
                                                                            component.set("v.togglemain", true);
                                                                            var vx = component.get("v.method");
                                                                            $A.enqueueAction(vx);
                                                                        }
                                                                    });
                                                                    $A.enqueueAction(action);
                                                                    component.set("v.lable", "");
                                                                    component.set("v.name", "");
                                                                    component.set("v.pvalues", "");
                                                                    component.set("v.requiredValue", "");
                                                                }
                                                                    else if(nav == "Time"){
                                                                        var action = component.get('c.createTimeField');
                                                                        action.setParams({"objName":component.get('v.objname'), "label":fLable, "name":fName, "required":component.get('v.requiredValue')});
                                                                        action.setCallback(this, function(response) {
                                                                            var state = response.getState();
                                                                            if (state === "SUCCESS") { 
                                                                                var toastEvent = $A.get("e.force:showToast");
                                                                                toastEvent.setParams({ title : 'Sucess Message', message:'Time Field created.', type: 'success',  
                                                                                                     });
                                                                                toastEvent.fire();
                                                                                component.set("v.isOpen", false);
                                                                                component.set("v.toggleTime", false);
                                                                                component.set("v.togglemain", true);
                                                                                var vx = component.get("v.method");
                                                                                $A.enqueueAction(vx);
                                                                            }
                                                                        });
                                                                        $A.enqueueAction(action);
                                                                        component.set("v.lable", "");
                                                                        component.set("v.name", "");
                                                                        component.set("v.requiredValue", "");
                                                                    }
                                                                        else if(nav == "Url"){
                                                                            var action = component.get('c.createUrlField');
                                                                            action.setParams({"objName":component.get('v.objname'), "label":fLable, "name":fName, "required":component.get('v.requiredValue')});
                                                                            action.setCallback(this, function(response) {
                                                                                var state = response.getState();
                                                                                if (state === "SUCCESS") { 
                                                                                    var toastEvent = $A.get("e.force:showToast");
                                                                                    toastEvent.setParams({ title : 'Sucess Message', message:'Url Field created.', type: 'success',  
                                                                                                         });
                                                                                    toastEvent.fire();
                                                                                    component.set("v.isOpen", false);
                                                                                    component.set("v.toggleUrl", false);
                                                                                    component.set("v.togglemain", true);
                                                                                    var vx = component.get("v.method");
                                                                                    $A.enqueueAction(vx);
                                                                                }
                                                                            });
                                                                            $A.enqueueAction(action);
                                                                            component.set("v.lable", "");
                                                                            component.set("v.name", "");
                                                                            component.set("v.requiredValue", "");
                                                                        }
                                                                            else if(nav == "Auto Number"){
                                                                                var action = component.get('c.createANumberField');
                                                                                action.setParams({"objName":component.get('v.objname'), "label":fLable, "name":fName, "required":component.get('v.requiredValue')});
                                                                                action.setCallback(this, function(response) {
                                                                                    var state = response.getState();
                                                                                    if (state === "SUCCESS") { 
                                                                                        var toastEvent = $A.get("e.force:showToast");
                                                                                        toastEvent.setParams({ title : 'Sucess Message', message:'Auto Number Field created.', type: 'success',  
                                                                                                             });
                                                                                        toastEvent.fire();
                                                                                        component.set("v.isOpen", false);
                                                                                        component.set("v.toggleANumber", false);
                                                                                        component.set("v.togglemain", true);
                                                                                        var vx = component.get("v.method");
                                                                                        $A.enqueueAction(vx);
                                                                                    }
                                                                                });
                                                                                $A.enqueueAction(action);
                                                                                component.set("v.lable", "");
                                                                                component.set("v.name", "");
                                                                                component.set("v.requiredValue", "");
                                                                            }
                                                                                else if(nav == "Lookup Relationship"){
                                                                                    console.log('r',component.get('v.requiredValue'));
                                                                                    var nav1 = component.get('v.objselectedValue');
                                                                                    console.log('##',nav1)
                                                                                    if(nav1 == ""){
                                                                                        var toastEvent = $A.get("e.force:showToast");
                                                                                        toastEvent.setParams({ title : 'Error Message', message:'Select an object', type: 'error',  
                                                                                                             });
                                                                                        toastEvent.fire();
                                                                                    }
                                                                                    else{
                                                                                        var action = component.get('c.createLookupField');
                                                                                        action.setParams({"objName":component.get('v.objname'), "label":fLable, "name":fName, "rObj":nav1, "required":component.get('v.requiredValue')});
                                                                                        action.setCallback(this, function(response) {
                                                                                            var state = response.getState();
                                                                                            if (state === "SUCCESS") { 
                                                                                                var toastEvent = $A.get("e.force:showToast");
                                                                                                toastEvent.setParams({ title : 'Sucess Message', message:'Lookup Relationship Field created.', type: 'success',  
                                                                                                                     });
                                                                                                toastEvent.fire();
                                                                                                component.set("v.isOpen", false);
                                                                                                component.set("v.toggleLookup", false);
                                                                                                component.set("v.togglemain", true);
                                                                                                var vx = component.get("v.method");
                                                                                                $A.enqueueAction(vx);
                                                                                            }
                                                                                        });
                                                                                        $A.enqueueAction(action);
                                                                                        component.set("v.lable", "");
                                                                                        component.set("v.name", "");
                                                                                        component.set("v.requiredValue", "");
                                                                                    }
                                                                                }
                            }
                        }
                    });
                    $A.enqueueAction(action1);
                }
            }
        }
    },
    
    selectValue : function(component, event, helper) {
        var nav = component.find("radiusPicklist").get("v.value");
        if(nav == "Select an Option"){
            component.set("v.toggleCheckBox", false);
            component.set("v.toggleText", false);
            component.set("v.toggleEmail", false);
            component.set("v.toggleCurrency", false);
            component.set("v.toggleNumber", false);
            component.set("v.toggleDate", false);
            component.set("v.toggleDateTime", false);
            component.set("v.togglePercent", false);
            component.set("v.togglePhone", false);
            component.set("v.togglePicklist", false);
            component.set("v.toggleTime", false);
            component.set("v.toggleUrl", false);
            component.set("v.toggleANumber", false);
            component.set("v.toggleLookup", false);
            component.set("v.togglemain", true);
        }
        else if(nav == "CheckBox"){
            component.set("v.togglemain", false);
            component.set("v.toggleText", false);
            component.set("v.toggleEmail", false);
            component.set("v.toggleCurrency", false);
            component.set("v.toggleNumber", false);
            component.set("v.toggleDate", false);
            component.set("v.toggleDateTime", false);
            component.set("v.togglePercent", false);
            component.set("v.togglePhone", false);
            component.set("v.togglePicklist", false);
            component.set("v.toggleTime", false);
            component.set("v.toggleUrl", false);
            component.set("v.toggleANumber", false);
            component.set("v.toggleLookup", false);
            component.set("v.toggleCheckBox", true);
            //alert(component.find("radiusPicklist").get("v.value"));    
        }
            else if(nav == "Text"){
                component.set("v.togglemain", false);
                component.set("v.toggleEmail", false);
                component.set("v.toggleCurrency", false);
                component.set("v.toggleNumber", false);
                component.set("v.toggleDate", false);
                component.set("v.toggleDateTime", false);
                component.set("v.togglePercent", false);
                component.set("v.togglePhone", false);
                component.set("v.togglePicklist", false);
                component.set("v.toggleTime", false);
                component.set("v.toggleUrl", false);
                component.set("v.toggleCheckBox", false);
                component.set("v.toggleANumber", false);
                component.set("v.toggleLookup", false);
                component.set("v.toggleText", true);
            }
                else if(nav == "Email"){
                    component.set("v.togglemain", false);
                    component.set("v.toggleCurrency", false);
                    component.set("v.toggleNumber", false);
                    component.set("v.toggleDate", false);
                    component.set("v.toggleDateTime", false);
                    component.set("v.togglePercent", false);
                    component.set("v.togglePhone", false);
                    component.set("v.togglePicklist", false);
                    component.set("v.toggleTime", false);
                    component.set("v.toggleUrl", false);
                    component.set("v.toggleCheckBox", false);
                    component.set("v.toggleText", false);
                    component.set("v.toggleANumber", false);
                    component.set("v.toggleLookup", false);
                    component.set("v.toggleEmail", true);
                }
                    else if(nav == "Currency"){
                        component.set("v.togglemain", false);
                        component.set("v.toggleNumber", false);
                        component.set("v.toggleDate", false);
                        component.set("v.toggleDateTime", false);
                        component.set("v.togglePercent", false);
                        component.set("v.togglePhone", false);
                        component.set("v.togglePicklist", false);
                        component.set("v.toggleTime", false);
                        component.set("v.toggleUrl", false);
                        component.set("v.toggleCheckBox", false);
                        component.set("v.toggleText", false);
                        component.set("v.toggleEmail", false);
                        component.set("v.toggleANumber", false);
                        component.set("v.toggleLookup", false);
                        component.set("v.toggleCurrency", true);
                    }
                        else if(nav == "Number"){
                            component.set("v.togglemain", false);
                            component.set("v.toggleDate", false);
                            component.set("v.toggleDateTime", false);
                            component.set("v.togglePercent", false);
                            component.set("v.togglePhone", false);
                            component.set("v.togglePicklist", false);
                            component.set("v.toggleTime", false);
                            component.set("v.toggleUrl", false);
                            component.set("v.toggleCheckBox", false);
                            component.set("v.toggleText", false);
                            component.set("v.toggleEmail", false);
                            component.set("v.toggleCurrency", false);
                            component.set("v.toggleANumber", false);
                            component.set("v.toggleLookup", false);
                            component.set("v.toggleNumber", true);
                        }
                            else if(nav == "Date"){
                                component.set("v.togglemain", false);
                                component.set("v.toggleDateTime", false);
                                component.set("v.togglePercent", false);
                                component.set("v.togglePhone", false);
                                component.set("v.togglePicklist", false);
                                component.set("v.toggleTime", false);
                                component.set("v.toggleUrl", false);
                                component.set("v.toggleCheckBox", false);
                                component.set("v.toggleText", false);
                                component.set("v.toggleEmail", false);
                                component.set("v.toggleCurrency", false);
                                component.set("v.toggleNumber", false);
                                component.set("v.toggleANumber", false);
                                component.set("v.toggleLookup", false);
                                component.set("v.toggleDate", true);
                            }
                                else if(nav == "Date/Time"){
                                    component.set("v.togglemain", false); 
                                    component.set("v.togglePercent", false);
                                    component.set("v.togglePhone", false);
                                    component.set("v.togglePicklist", false);
                                    component.set("v.toggleTime", false);
                                    component.set("v.toggleUrl", false);
                                    component.set("v.toggleCheckBox", false);
                                    component.set("v.toggleText", false);
                                    component.set("v.toggleEmail", false);
                                    component.set("v.toggleCurrency", false);
                                    component.set("v.toggleNumber", false);
                                    component.set("v.toggleDate", false);
                                    component.set("v.toggleANumber", false);
                                    component.set("v.toggleLookup", false);
                                    component.set("v.toggleDateTime", true);
                                }
                                    else if(nav == "Percent"){
                                        component.set("v.togglemain", false); 
                                        component.set("v.togglePhone", false);
                                        component.set("v.togglePicklist", false);
                                        component.set("v.toggleTime", false);
                                        component.set("v.toggleUrl", false);
                                        component.set("v.toggleCheckBox", false);
                                        component.set("v.toggleText", false);
                                        component.set("v.toggleEmail", false);
                                        component.set("v.toggleCurrency", false);
                                        component.set("v.toggleNumber", false);
                                        component.set("v.toggleDate", false);
                                        component.set("v.toggleDateTime", false);
                                        component.set("v.toggleANumber", false);
                                        component.set("v.toggleLookup", false);
                                        component.set("v.togglePercent", true);
                                    }
                                        else if(nav == "Phone"){
                                            component.set("v.togglemain", false); 
                                            component.set("v.togglePicklist", false);
                                            component.set("v.toggleTime", false);
                                            component.set("v.toggleUrl", false);
                                            component.set("v.toggleCheckBox", false);
                                            component.set("v.toggleText", false);
                                            component.set("v.toggleEmail", false);
                                            component.set("v.toggleCurrency", false);
                                            component.set("v.toggleNumber", false);
                                            component.set("v.toggleDate", false);
                                            component.set("v.toggleDateTime", false);
                                            component.set("v.togglePercent", false);
                                            component.set("v.toggleANumber", false);
                                            component.set("v.toggleLookup", false);
                                            component.set("v.togglePhone", true);
                                        }
                                            else if(nav == "Picklist"){
                                                component.set("v.togglemain", false); 
                                                component.set("v.toggleTime", false);
                                                component.set("v.toggleUrl", false);
                                                component.set("v.toggleCheckBox", false);
                                                component.set("v.toggleText", false);
                                                component.set("v.toggleEmail", false);
                                                component.set("v.toggleCurrency", false);
                                                component.set("v.toggleNumber", false);
                                                component.set("v.toggleDate", false);
                                                component.set("v.toggleDateTime", false);
                                                component.set("v.togglePercent", false);
                                                component.set("v.togglePhone", false);
                                                component.set("v.toggleANumber", false);
                                                component.set("v.toggleLookup", false);
                                                component.set("v.togglePicklist", true);
                                            }
                                                else if(nav == "Time"){
                                                    component.set("v.togglemain", false); 
                                                    component.set("v.toggleUrl", false);
                                                    component.set("v.toggleCheckBox", false);
                                                    component.set("v.toggleText", false);
                                                    component.set("v.toggleEmail", false);
                                                    component.set("v.toggleCurrency", false);
                                                    component.set("v.toggleNumber", false);
                                                    component.set("v.toggleDate", false);
                                                    component.set("v.toggleDateTime", false);
                                                    component.set("v.togglePercent", false);
                                                    component.set("v.togglePhone", false);
                                                    component.set("v.togglePicklist", false);
                                                    component.set("v.toggleANumber", false);
                                                    component.set("v.toggleLookup", false);
                                                    component.set("v.toggleTime", true);
                                                }
                                                    else if(nav == "Url"){
                                                        component.set("v.togglemain", false); 
                                                        component.set("v.toggleCheckBox", false);
                                                        component.set("v.toggleText", false);
                                                        component.set("v.toggleEmail", false);
                                                        component.set("v.toggleCurrency", false);
                                                        component.set("v.toggleNumber", false);
                                                        component.set("v.toggleDate", false);
                                                        component.set("v.toggleDateTime", false);
                                                        component.set("v.togglePercent", false);
                                                        component.set("v.togglePhone", false);
                                                        component.set("v.togglePicklist", false);
                                                        component.set("v.toggleTime", false);
                                                        component.set("v.toggleANumber", false);
                                                        component.set("v.toggleLookup", false);
                                                        component.set("v.toggleUrl", true);
                                                    }
                                                        else if(nav == "Lookup Relationship"){
                                                            var action = component.get("c.getRecords");
                                                            action.setCallback(this, function(response) {
                                                                var state = response.getState();
                                                                if (state === "SUCCESS") {           
                                                                    var allValues = response.getReturnValue();
                                                                    console.log(allValues);
                                                                    component.set("v.objlist", allValues);
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
                                                            component.set("v.togglemain", false); 
                                                            component.set("v.toggleCheckBox", false);
                                                            component.set("v.toggleText", false);
                                                            component.set("v.toggleEmail", false);
                                                            component.set("v.toggleCurrency", false);
                                                            component.set("v.toggleNumber", false);
                                                            component.set("v.toggleDate", false);
                                                            component.set("v.toggleDateTime", false);
                                                            component.set("v.togglePercent", false);
                                                            component.set("v.togglePhone", false);
                                                            component.set("v.togglePicklist", false);
                                                            component.set("v.toggleTime", false);
                                                            component.set("v.toggleUrl", false);
                                                            component.set("v.toggleANumber", false);
                                                            component.set("v.toggleLookup", true);
                                                        }
                                                            else if(nav == "Auto Number"){
                                                                component.set("v.togglemain", false); 
                                                                component.set("v.toggleCheckBox", false);
                                                                component.set("v.toggleText", false);
                                                                component.set("v.toggleEmail", false);
                                                                component.set("v.toggleCurrency", false);
                                                                component.set("v.toggleNumber", false);
                                                                component.set("v.toggleDate", false);
                                                                component.set("v.toggleDateTime", false);
                                                                component.set("v.togglePercent", false);
                                                                component.set("v.togglePhone", false);
                                                                component.set("v.togglePicklist", false);
                                                                component.set("v.toggleTime", false);
                                                                component.set("v.toggleUrl", false);
                                                                component.set("v.toggleLookup", false);
                                                                component.set("v.toggleANumber", true);
                                                            }
    },
})