({
    CSV2JSON: function (component,csv) {
        //console.log('@@@ Incoming csv = ' + csv);
        
        
        var arr = []; 
        arr =  csv.split('\n');
        //console.log('@@@ arr = '+arr);
        arr.pop();
        var jsonObj = [];
        var temp = component.get('v.fieldValuesList');
        var headers = arr[0].split(',');
        
        
        for(var i = 1; i < arr.length; i++) {
            var data = arr[i].split(',');
            var obj = {};
            
            for(var j = 0; j < data.length; j++) {
                obj[headers[j].trim()] = data[j].trim();
                
            }
            jsonObj.push(obj);
            //temp.push(obj);
            
            //console.log('@@ type:',typeof(lines));
            
        }
        for(var i = 0 ; i < jsonObj.length;i++){
            jsonObj[i].fromOrg = false;
            jsonObj[i].isRef = false;
        }
        for(var i = 0 ; i < jsonObj.length;i++){
            temp.push(jsonObj[i]);
            
        }
        var json = JSON.stringify(jsonObj);
        console.log('Object val',jsonObj);
        /**for(var i = 0; i< temp.length; i++){
            temp[i].fromCsv = true;
        }
        **/
        console.log('csv',temp);
        component.set('v.fieldValuesList',temp);
        var sortNo = component.get('v.sortNo');
        component.set("v.maxPage", parseInt(Math.floor(component.get("v.fieldValuesList").length+(sortNo-1))/sortNo));
         this.renderPage(component);
        
        console.log('@@@ json = '+ json);
        return json;
        
        
    },
    
    CreateAccount : function (component,jsonstr,objName){
        //console.log('@@@ ObjecName' + objName);
        var action = component.get("c.upsertCustomfield");   
        action.setParams({
            "strfromlex" : jsonstr,
            "sObjectName":objName
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {  
               // component.find("toastCmp").showToastModel("Fields Updated Succesfully!", "success");    
                var toastEvent = $A.get("e.force:showToast");
                                        toastEvent.setParams({ title : 'Fields Updated Succesfully!', type: 'success',  
                                                             });
                                        toastEvent.fire();
                this.serverloadDataHelper(component,objName);
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        
                        console.log("Reply From Server Error message: " + 
                                    errors[0].message);
                        //component.find("toastCmp").showToastModel(errors[0].message, "error");
                         var toastEvent = $A.get("e.force:showToast");
                                        toastEvent.setParams({ title : 'Error Message', message:errors[0].message, type: 'error',  
                                                             });
                                        toastEvent.fire();
                    }
                } else {
                    console.log("Unknown error");
                    alert('Unknown');
                }
            }
        }); 
        
        $A.enqueueAction(action);    
        
    },
    helperdelete : function(component,objstr,objName) {
        console.log('Inside Delete Helper');
        var delObj = JSON.parse(objstr);
        for(var i = 0 ; i < delObj.length;i++){
            var mapOfExistingApiName = component.get('v.existingfields');
            if(mapOfExistingApiName.has(delObj[i].name) ){
                mapOfExistingApiName.delete(delObj[i].name);
            }
            
        }
        var action = component.get("c.deleteField");
        action.setParams({ strfromlex : objstr ,
                          sObjectName:objName
                         });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                //alert("Delete Status: " + response.getReturnValue());
               // component.find("toastCmp").showToastModel("Fields Deleted Succesfully!", "success");
                 var toastEvent = $A.get("e.force:showToast");
                                        toastEvent.setParams({ title : 'Fields Deleted Succesfully!', type: 'success',  
                                                             });
                                        toastEvent.fire();
                //setTimeout(() => { this.loaddata(component); }, 20000);
                //component.find("toastCmp").showToastModel("This is warning toast.", "warning");
                //component.find("toastCmp").showToastModel("This is error toast.", "error");
                
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
                            //component.find("toastCmp").showToastModel(errors[0].message, "error");
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
     serverloadDataHelper :function(component,obj) {
        console.log('Inside Load Helper');
        //console.log('value: '+obj)
        if(obj != ''){
            
        
            var action = component.get('c.getFields');
            action.setParams({"sObjectName" : obj });
            action.setCallback(this, function(response) {
                
                var state = response.getState();
                if (state == "SUCCESS") {
                    //
                    //
                   component.set('v.sortNo',10);
                    //
                    var responses = response.getReturnValue();
                    console.log('@@ response',responses);
                    var result = JSON.parse(responses);
                    console.log('hiii new code');
                    var byName = result.slice(1);
                    byName.sort(function(a,b) {
                        var x = a.name.toLowerCase();
                        var y = b.name.toLowerCase();
                        return x < y ? -1 : x > y ? 1 : 0;
                    });
                    console.log('sorted:',byName);
                    //component.set("v.fieldValuesList",byName );
                    
                    //for correcting reference
                    for (var i = 0; i < byName.length; ++i) {
                        var text = byName[i]['referenceTo'];
                        var text1 = text.slice(0,1);
                         var temp = text.slice(1,text.length-1);
                            
                            
                            console.log('@@',temp);
                            byName[i]['referenceTo'] = temp;
                            //component.set('v.fieldValuesList',validrecord);
                            
                            console.log('values in list',byName[i]['referenceTo']);   
                      }
                     component.set("v.fieldValuesList",byName );
                    var sample = component.get('v.fieldValuesList');
                    var myMap = new Map();
                    
                    for(var y = 0; y < sample.length;y++){
                        
                        myMap.set(sample[y].name,sample[y].type);
                    }
                   
                    console.log('MAP',myMap);
                    component.set('v.existingfields',myMap);
                    var sortNo = component.get('v.sortNo');
                    var divForPage =   parseInt(Math.floor(component.get("v.fieldValuesList").length+parseInt(sortNo-1))/sortNo);
                    if(divForPage > 0)
                    component.set("v.maxPage",divForPage);
                    else
                      component.set("v.maxPage",1);  
                    console.log('page number: ',component.get('v.pageNumber'));
                    console.log('Sort number: ',component.get('v.sortNo'));
                    console.log('Max Page: ',component.get('v.maxPage'));
                    var childComp = component.find('childComp');
                    childComp.callChild();
                    this.renderPage(component);
                   this.hideSpinner(component);
                    component.set("v.deletedfieldValuesList",JSON.parse( responses ));
                    var toEmpty = component.get('v.deletedfieldValuesList');
                    var removedItems = toEmpty.splice(0, toEmpty.length);
                    component.set('v.deletedfieldValuesList',toEmpty);
                    var a = component.get('v.deletedfieldValuesList');
                    console.log('size is',a.length);
                    
                    //-------------------------//
                    // when response successfully return from server then apply jQuery dataTable after 500 milisecond
                  //this.datatableHelper(component);
                    
                }        	         
            });
            $A.enqueueAction(action);
    }
        },
    
    
    getSampleJSON : function(){
        // 3. Variable declaration and assigning value to show in component.
        var jsonStr = '{"rows":[{"vals":[{"val":"sampleLabel","cssClass":""},{"val":"sampleNam","cssClass":""},{"val":"DOUBLE","cssClass":""},{"val":"20","cssClass":"responsiveHide"},{"val":"16","cssClass":"responsiveHide"},{"val":"2","cssClass":"responsiveHide"},{"val":"()","cssClass":"responsiveHide"},{"val":"false","cssClass":"responsiveHide"},{"val":"","cssClass":"responsiveHide"}]},{"vals":[{"val":"sampleLabel1","cssClass":""},{"val":"sampleNam1","cssClass":""},{"val":"STRING","cssClass":""},{"val":"20","cssClass":"responsiveHide"},{"val":"16","cssClass":"responsiveHide"},{"val":"2","cssClass":"responsiveHide"},{"val":"()","cssClass":"responsiveHide"},{"val":"false","cssClass":"responsiveHide"},{"val":"","cssClass":"responsiveHide"}]},{"vals":[{"val":"sampleLabe2","cssClass":""},{"val":"sampleNam2","cssClass":""},{"val":"CURRENCY","cssClass":""},{"val":"20","cssClass":"responsiveHide"},{"val":"16","cssClass":"responsiveHide"},{"val":"2","cssClass":"responsiveHide"},{"val":"()","cssClass":"responsiveHide"},{"val":"false","cssClass":"responsiveHide"},{"val":"","cssClass":"responsiveHide"}]},{"vals":[{"val":"sampleLabe3","cssClass":""},{"val":"sampleNam3","cssClass":""},{"val":"DOUBLE","cssClass":""},{"val":"20","cssClass":"responsiveHide"},{"val":"16","cssClass":"responsiveHide"},{"val":"2","cssClass":"responsiveHide"},{"val":"()","cssClass":"responsiveHide"},{"val":"false","cssClass":"responsiveHide"},{"val":"","cssClass":"responsiveHide"}]},{"vals":[{"val":"sampleLabel4","cssClass":""},{"val":"sampleNam4","cssClass":""},{"val":"AUTONUMBER","cssClass":""},{"val":"20","cssClass":"responsiveHide"},{"val":"16","cssClass":"responsiveHide"},{"val":"2","cssClass":"responsiveHide"},{"val":"()","cssClass":"responsiveHide"},{"val":"false","cssClass":"responsiveHide"},{"val":"","cssClass":"responsiveHide"}]},{"vals":[{"val":"sampleLabel6","cssClass":""},{"val":"sampleNam6","cssClass":""},{"val":"PHONE","cssClass":""},{"val":"20","cssClass":"responsiveHide"},{"val":"16","cssClass":"responsiveHide"},{"val":"2","cssClass":"responsiveHide"},{"val":"()","cssClass":"responsiveHide"},{"val":"false","cssClass":"responsiveHide"},{"val":"","cssClass":"responsiveHide"}]}],"headers":[{"title":"label","isSortable":false,"dataType":"","cssClass":""},{"title":"name","isSortable":false,"dataType":"","cssClass":""},{"title":"type","isSortable":false,"dataType":"","cssClass":""},{"title":"length","isSortable":false,"dataType":"","cssClass":"responsiveHide"},{"title":"precision","isSortable":false,"dataType":"","cssClass":"responsiveHide"},{"title":"scale","isSortable":false,"dataType":"","cssClass":"responsiveHide"},{"title":"referenceTo","isSortable":false,"dataType":"","cssClass":"responsiveHide"},{"title":"defaultValue","isSortable":false,"dataType":"","cssClass":"responsiveHide"},{"title":"pickListValue","isSortable":false,"dataType":"","cssClass":"responsiveHide"}]}';
        return jsonStr;
    }   ,
    renderPage: function(component){
        var wrapList= component.get('v.fieldValuesList');
        var pagenumber = component.get('v.pageNumber');
        var sortNo = component.get('v.sortNo');
        var templist= wrapList.slice((pagenumber-1)*sortNo,pagenumber*sortNo);
        component.set('v.paginationList',templist);
    },
    loadLookuplist: function(component,event,helper){
        
        var action = component.get("c.getRecords");
        
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            if (state === "SUCCESS") {           
                var allValues = response.getReturnValue();
                console.log(allValues);
                
                component.set('v.lookUpList', allValues.sort());
            }        	         
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +  errors[0].message);
                         var toastEvent = $A.get("e.force:showToast");
                                        toastEvent.setParams({ title : 'Error Message', message:errors[0].message, type: 'error',  
                                                             });
                                        toastEvent.fire();
                    }
                } 
                else {
                    console.log("Unknown Error");
                }
            }
        });
        $A.enqueueAction(action);
    
    },
    showSpinner: function(component, event, helper) {
        component.set("v.Spinner", true); 
    },
    
    
    hideSpinner : function(component,event,helper){
        component.set("v.Spinner", false);
    },
    
})