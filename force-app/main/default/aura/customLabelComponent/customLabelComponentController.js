({
    doInit : function(component, event, helper) {
        console.log('Init called');
        helper.loaddata(component);
        
    },
    
    addRow: function(component, event, helper){
        
        component.find('searchKey').set('v.value','');
        console.log('Add row function');
      
        var objData = component.get('v.label');
        //console.log('@@ before',JSON.stringify(objData));
        var obj = new Object();
        obj.Id = '';
        obj.Name = '';
        obj.MasterLabel = '';
        obj.Value = '';
        objData.push(obj);
        component.set('v.label',objData);
        
        var sortNo = component.get('v.sortNo');
        var divForPage = parseInt(Math.floor(component.get("v.label").length+parseInt(sortNo-1))/sortNo);
        if(divForPage > 0)
            component.set("v.maxPage",divForPage);
        else
            component.set("v.maxPage",1);
                
        helper.renderPage(component);
        var goLast = component.find('childComp');
        goLast.gotoLastPage();
        
        
    },
    removeRow : function(component, event, helper) {
        console.log('Inside remove');
        component.find('searchKey').set('v.value','');
        var target = event.target;
        var rowIndex = target.getAttribute("data-index");
        console.log("Row No : " + rowIndex);
        var updatedList = component.get('v.label');
        var delList = component.get('v.toDeleteLabel');
        let indexToRemove = target.getAttribute("data-index");
        var pagenumber = component.get('v.pageNumber');
        var actualIndex = (pagenumber - 1) + indexToRemove;
        
        var removedElements = updatedList.splice(parseInt(actualIndex,10), 1);
        delList.push(removedElements[0]);
        component.set('v.label', updatedList);
        
        var sortNo = component.get('v.sortNo');
        var divForPage = parseInt(Math.floor(component.get("v.label").length+parseInt(sortNo-1))/sortNo);
        var prevMaxPage = Math.floor(component.get('v.maxPage'));
        if(divForPage == prevMaxPage){
           
            component.set("v.maxPage",divForPage);
        }
        else{ 
            
            console.log('into else case');
            component.set("v.maxPage",divForPage);
            var prevPage = component.find('childComp');
            prevPage.gotoPrevPagePage();
        }
        
        helper.renderPage(component);
        component.set('v.toDeleteLabel', delList);
    },
    
    
    createdata :function(component, event, helper) {
        console.log('Upsert method');
        var delList = component.get('v.toDeleteLabel');
        console.log(JSON.stringify(delList));
        if(delList.length > 0)
        { 
         helper.helperdelete(component,JSON.stringify(delList));
         var toEmpty = component.get('v.toDeleteLabel');
         var removedItems = toEmpty.splice(0, toEmpty.length);
         component.set('v.toDeleteLabel',toEmpty);
        }
        component.find('searchKey').set('v.value','');
        var validRec = component.find('expenseform').reduce(function (validSoFar, inputCmp) {
            // Displays error messages for invalid fields
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && inputCmp.get('v.validity').valid;
        }, true);
        
        var validrecord = component.get("v.label");
        if(validrecord.length == 0){
            
            validRec = false;
            
        }
        for (var item in validrecord){
            if(validrecord[item].Name == ''){
                validRec = false;
            }
            if(validrecord[item].MasterLabel == ''){
                validRec = false;
            }
            if(validrecord[item].Value == ''){
                validRec = false;
            }
             if(validrecord[item].Value == ''){
                validRec = false;
            }
             function findMatches(regex, str, matches = []) {
                    const res = regex.exec(str)
                    res && matches.push(res) && findMatches(regex, str, matches)
                    return matches
                }
            
            		var str = validrecord[item].Name;
            		var matches = findMatches(/__/g, str);
                    var matches1 = findMatches(/[-!$%^&*()+|~=`{}[:;<>?,.@#\]]/g, str);
                    var nameInitial =str.substring(0,1);
            		var matches2 = findMatches(/[-!$%^&*()_+|~=`{}[:;<>?,.@#\]0-9]/g,nameInitial );
            		var nameLast =str.substring(str.length -1);
                    var matches3 = findMatches(/[_]/g,nameLast );
            		var matches4 = findMatches(/[\s\r\n]/g,str);
            
            if(matches.length > 0){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({ title : 'Error Message', message:validrecord[item].Name+' name not valid', type: 'error',  
                                     });
                toastEvent.fire();
                validRec = false;
            } else if(matches1.length > 0){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({ title : 'Error Message', message:validrecord[item].Name+' Name should not contain Special char', type: 'error',  
                                     });
                toastEvent.fire();
                validRec = false;
            } else if(matches2.length > 0){
                
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({ title : 'Error Message', message:validrecord[item].Name+' Invalid Name', type: 'error',  
                                     });
                toastEvent.fire();
                validRec = false;
            }else if(matches3.length > 0){
                
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({ title : 'Error Message', message:validrecord[item].Name+' Invalid Name', type: 'error',  
                                     });
                toastEvent.fire();
                validRec = false;
            }
            else if(matches4.length > 0){
                
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({ title : 'Error Message', message:'Space Not Allowed in Name Field', type: 'error',  
                                     });
                toastEvent.fire();
                validRec = false;
            }
        }
        //alert('value of validReec:'+validRec);
        // If we pass error checking, do some real work
        if(validRec){
            var obj = component.get('v.label');
            console.log(obj.length);
            if(obj.length > 0){
                helper.upsertData(component,JSON.stringify(obj));
                
                
            }
        }
        
        
        
        
        
    },
    
    refresh :function(component, event, helper) {
        helper.loaddata(component);
    },
    
    
    keyCheck : function(component, event, helper){
        var target = event.getSource().get('v.value');
        
        var index = event.getSource().get('v.name');
        
        var a = component.get('v.label');
        
        const text = target;
        const newText = text.split(/\s/).join('');
        var pagenumber = component.get('v.pageNumber');
        var actualIndex = (pagenumber - 1) + index;
        a[actualIndex].Name = newText;
        
        
        setTimeout(() => { component.set('v.label',a); }, 8000);
                          
                          
                         },
                          onPagination:function(component,event,helper){
                              helper.renderPage(component);
                          },
                          searchKeyChange: function( component, event, helper ){
                              
                              var wraplist = component.get('v.label');
                              var templist = [];
                              var searchkey = component.find('searchKey').get('v.value');
                              if(searchkey == ''){
                                  
                                  
                                  var sortNo = component.get('v.sortNo');
                                  var divForPage = parseInt(Math.floor(component.get("v.label").length+parseInt(sortNo-1))/sortNo);
                                  if(divForPage > 0){
                                      component.set("v.maxPage",divForPage);
                                  }
                                  else{
                                      component.set("v.maxPage",1);
                                  }
                                  
                                  
                                  component.set('v.pageNumber',component.get('v.pageNumber'));
                                  
                                  helper.renderPage(component);
                                  
                                  
                              }
                              
                              else{
                                  for(var i=0 ; i<wraplist.length;i++){
                                      if(wraplist[i].Name.toLowerCase().startsWith(searchkey.toLowerCase())){
                                          templist.push(wraplist[i]);
                                      }
                                  }
                                  var childComp = component.find('childComp');
                                  childComp.callChild();
                                  component.set("v.paginationList", templist);
                                  var a = component.get('v.paginationList');
                                  //alert('@@'+a.length);
                                  var sortNo = component.get('v.sortNo');
                                  var divForPage = parseInt(Math.floor(component.get("v.paginationList").length+parseInt(sortNo-1))/sortNo);
                                  if(divForPage > 0)
                                      component.set("v.maxPage",divForPage);
                                  else
                                      component.set("v.maxPage",1);
                                  
                              }
                          },
                          
                          onSortChange: function(component,event,helper){
                              component.find('searchKey').set('v.value','');
                              component.find('searchKey').set('v.value','');
                              var childComp = component.find('childComp');
                              childComp.callChild();
                              var sortNo = component.get('v.sortNo');
                              component.set("v.maxPage", parseInt(Math.floor(component.get("v.label").length+(sortNo-1))/sortNo));
                              helper.renderPage(component);
                          },
                          sortlabel:function( component, event, helper ) {
                              component.find('searchKey').set('v.value','');
                              component.find('searchKey').set('v.value','');
                              console.log('sortlabel');
                              if(component.get('v.labelAsc')){
                                  component.set('v.labelAsc',false);
                              }
                              else{
                                  component.set('v.labelAsc',true);
                              }
                              
                              var SortOrder = component.get('v.sortOrderlabel');
                              console.log('sortOrderlabel: ',SortOrder);
                              SortOrder =SortOrder === 'asc' ? 'desc' : 'asc';
                              var reverse = SortOrder === 'asc' ? 1 : -1;
                              console.log('Reverse value: ',reverse)
                              
                              let table = JSON.parse(JSON.stringify(component.get('v.label')));
                              table.sort((a,b) => {return a[a.Name] > b[b.Name] ? 1*reverse : -1*reverse});
                              component.set('v.sortOrderlabel','desc');
                              
                              component.set('v.label',table);
                              helper.renderPage(component);
                          },
                          showSpinner: function(component, event, helper) {
                              component.set("v.Spinner", true);
                          },
                          
                          
                          hideSpinner : function(component,event,helper){
                              component.set("v.Spinner", false);
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
                          
                          test: function( component, event, helper ){
                              alert('hey');
                              var goLast = component.find('childComp');
                              goLast.gotoLastPage();
                          },
                         })