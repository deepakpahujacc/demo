({
    loaddata : function(component,objstr) {
        console.log('Load Helper Method');
        var action = component.get("c.getCustRec");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var temp = response.getReturnValue();
                component.set('v.label',temp.records);
                var result = component.get("v.label" );
                var bylabel = result.slice(0);
                console.log('label sliced',bylabel);
                bylabel.sort(function(a,b) {
                    var x = a.Name.toLowerCase();
                    var y = b.Name.toLowerCase();
                    return x < y ? -1 : x > y ? 1 : 0;
                });
                
                component.set("v.label",bylabel );
                var sortNo = component.get('v.sortNo');
                var divForPage = parseInt(Math.floor(component.get("v.label").length+parseInt(sortNo-1))/sortNo);
                if(divForPage > 0){
                    component.set("v.maxPage",divForPage);
                }
                else{
                    component.set("v.maxPage",1);
                    var childComp = component.find('childComp');
                    childComp.callChild();
                }
                this.renderPage(component);
                component.set('v.toDeleteLabel',temp.records);
                var emptyset = component.get('v.toDeleteLabel');
                var removedItems = emptyset.splice(0, emptyset.length);
                component.set('v.toDeleteLabel',emptyset);
                
                var sizeofDel = component.get('v.toDeleteLabel');
                
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " +
                                        errors[0].message);
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({ title : 'Error Message', message:errors[0].message, type: 'error',
                                                 });
                            toastEvent.fire();
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
        });
        
        $A.enqueueAction(action);
        
        
    },
    
    helperdelete : function(component,objstr) {
        console.log('Inside Delete Helper');
        
        var action = component.get("c.deleteField");
        action.setParams({ strfromlex : objstr
                          
                         });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                this.loaddata(component);
                
                
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " +
                                        errors[0].message);
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({ title : 'Error Message', message:errors[0].message, type: 'error',
                                                 });
                            toastEvent.fire();
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
        });
        
        $A.enqueueAction(action);
    },
    
    upsertData : function(component,objstr) {
        console.log('Inside Upsert Helper');
        var action = component.get("c.createCustomLabel");
        action.setParams({ strfromlex : objstr
                          
                         });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({ title : 'Success Message', message:'Fields Updated', type: 'success',
                                     });
                toastEvent.fire();
                this.loaddata(component);
                
                
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " +
                                        errors[0].message);
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({ title : 'Error Message', message:errors[0].message, type: 'error',
                                                 });
                            toastEvent.fire();
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
        });
        
        $A.enqueueAction(action);
        
    },
    renderPage: function(component){
        var wrapList= component.get('v.label');
        var pagenumber = component.get('v.pageNumber');
        var sortNo = component.get('v.sortNo');
        var templist= wrapList.slice((pagenumber-1)*sortNo,pagenumber*sortNo);
        component.set('v.paginationList',templist);
    },
    
    showSpinner: function(component, event, helper) {
        component.set("v.Spinner", true);
    },
    
    
    hideSpinner : function(component,event,helper){
        component.set("v.Spinner", false);
    },
})