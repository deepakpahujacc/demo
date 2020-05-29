({
    doInit : function(component, event, helper) {
        // 1. Calling method "getSampleJSON()" and parsing it into JSON object.
        var jsonData = JSON.parse(helper.getSampleJSON());
        // 2. Setting parsed data in attribute "gridData".
        component.set("v.gridData",jsonData);
        
        var action = component.get("c.getObject");
        
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            if (state === "SUCCESS") {           
                var allValues = response.getReturnValue();
                console.log('Object Received',allValues);
                var byName = allValues.slice(0);
                byName.sort(function(a,b) {
                    var x = a.optionLabel.toLowerCase();
                    var y = b.optionLabel.toLowerCase();
                    return x < y ? -1 : x > y ? 1 : 0;
                });
                console.log('sorted:',byName);
                
                component.set("v.objlist", byName);
                helper.loadLookuplist(component);
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
        
        
    }
    ,
    
    showSpinner: function(component, event, helper) {
        component.set("v.Spinner", true); 
    },
    
    
    hideSpinner : function(component,event,helper){
        component.set("v.Spinner", false);
    },
    
    loadFields : function(component,event,helper){
        console.log('hi from loadFields');
        
        
        var searchkey = component.find('searchKey').get('v.value');
        component.find('searchKey').set('v.value','');
        console.log('search val',searchkey);
        
        var objval = component.get('v.objselectedValue');
        console.log('current value:',objval);
        helper.serverloadDataHelper(component,objval);
        
        
        
    }
    ,
    showfiledata :  function (component, event, helper){
        
        console.log('inside add row')
        var obj = component.get('v.objselectedValue');
        console.log('@@'+obj);
        //component.find('searchKey').set('v.value','');
        console.log('value Selected:',obj);
        var apt = true;
        if(obj == ''){
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({ title : 'Error Message', message:'Please Select an Object First', type: 'error',  
                                 });
            toastEvent.fire();
            apt = false; 
        }
        console.log('value of apt'+apt);
        if(apt){
            component.find('searchKey').set('v.value','');
            var fileInput = component.find("file").get("v.files");
            var file = fileInput[0];
            if (file) {
                
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = function (evt) {
                    
                    //console.log("EVT FN");
                    var csv = evt.target.result;
                    //console.log('@@@ csv file'+ csv);
                    var result = helper.CSV2JSON(component,csv);
                    var goLast = component.find('childComp');
                    goLast.gotoLastPage();
                }
                reader.onerror = function (evt) {
                    console.log("error reading file");
                }
            }
        }
        
        
    },
    CreateRecord: function (component, event, helper) {
        
        console.log('Upsert method');
        
        
        var obj = component.get('v.objselectedValue');
		     
        if(obj != ''){
              
        	component.find('searchKey').set('v.value','');          
            var validrecord1 = component.get("v.deletedfieldValuesList");
            for  (var item in validrecord1){
                
                console.log('index: ',item);
                console.log(' type ');
                var a =typeof(validrecord1[item].fromOrg);
                
                if(a == false){
                    validrecord1.splice(item,1);
                }
            }
            
            console.log('Delete List Length: ',validrecord1.length,JSON.stringify(validrecord1));
            if(validrecord1.length > 0){
                console.log('to be deleted:',validrecord1);
                helper.helperdelete(component,JSON.stringify(validrecord1),obj);
                var toEmpty = component.get('v.deletedfieldValuesList');
                var removedItems = toEmpty.splice(0, toEmpty.length);
                component.set('v.deletedfieldValuesList',toEmpty);
            }
            
            
            
            var val = component.get('v.fieldValuesList');
            console.log('Data: ',JSON.stringify(val));
            
            var validrecord = component.get("v.fieldValuesList");
            var aptData = true;
            
            //check if Rec exist
            if(validrecord.length == 0){
                toastEvent.setParams({ title : 'Error Message', message:' No Rec. to Update', type: 'error',  
                                     });
                aptData = false;
                
            }
            
            //validation check   
            for(var item in validrecord){
                function findMatches(regex, str, matches = []) {
                    const res = regex.exec(str)
                    res && matches.push(res) && findMatches(regex, str, matches)
                    return matches
                }
                var errorMsg='Missing Required Field';
                
                if(validrecord[item].name == ''){
                    /** component.find("toastCmp").showToastModel(errorMsg, "error");**/
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({ title : 'Error Message', message:errorMsg, type: 'error',  
                                         });
                    toastEvent.fire();
                    //alert('Inside blank name case');
                    aptData = false;
                    
                }
                //check valid name
                if(validrecord[item].fromOrg == false){
                    var str = validrecord[item].name;
                    var matches1 = findMatches(/[-!$%^&*()+|~=`{}[:;<>?,.@#\]]/g, str);
                    var matches = findMatches(/__/g, str);
                    var nameInitial =str.substring(0,1);
                    var matches2 = findMatches(/[-!$%^&*()_+|~=`{}[:;<>?,.@#\]0-9]/g,nameInitial );
                    var matches3 = findMatches(/[\s\r\n]/g,str);
                    if(matches.length > 1){
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({ title : 'Error Message', message:validrecord[item].name+' name not valid', type: 'error',  
                                             });
                        toastEvent.fire();
                        aptData = false;
                    } else if(matches1.length > 0){
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({ title : 'Error Message', message:validrecord[item].name+' Name should not contain Special char', type: 'error',  
                                             });
                        toastEvent.fire();
                        aptData = false;
                    } else if(matches2.length > 0){
                       
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({ title : 'Error Message', message:validrecord[item].name+' Invalid Initail', type: 'error',  
                                             });
                        toastEvent.fire();
                        aptData = false;
                    }
                     else if(matches3.length > 0){
                       
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({ title : 'Error Message', message:validrecord[item].name+' Invalid Name', type: 'error',  
                                             });
                        toastEvent.fire();
                        aptData = false;
                    }
                    
                }
                
                if(validrecord[item].fromOrg == false){
                    var exName = component.get('v.existingfields');
                    var str = validrecord[item].name;
                    var n = str.lastIndexOf("__c");
                    if(n == -1){
                        validrecord[item].name = validrecord[item].name+'__c';
                    }
                    if((exName.has(validrecord[item].name))){
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({ title : 'Error Message', message:validrecord[item].name+' Api name already exist', type: 'error',  
                                             });
                        toastEvent.fire();
                        aptData = false;
                    }
                    
                }
                
                
                if(validrecord[item].fromOrg == false){
                    var templist = component.get('v.fieldValuesList');
                    var str = templist[item].name;
                    var n = str.lastIndexOf("__c");
                    if(n == -1){
                        templist[item].name = templist[item].name+'__c';
                        component.set('v.fieldValuesList',templist);
                    }
                }
                
                
                if(validrecord[item].label == ''){
                    
                    // component.find("toastCmp").showToastModel(errorMsg, "error");
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({ title : 'Error Message', message:errorMsg, type: 'error',  
                                         });
                    toastEvent.fire();
                    aptData = false;
                }
                if(validrecord[item].type == 'STRING' ){
                    if(validrecord[item].length == '' || validrecord[item].length == 0 ){ 
                        errorMsg = 'Length cannot be null';
                        //component.find("toastCmp").showToastModel(errorMsg, "error");
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({ title : 'Error Message', message:errorMsg, type: 'error',  
                                             });
                        toastEvent.fire();
                        aptData = false;
                    }
                    
                }
                if(validrecord[item].type == 'STRING' ){
                    var strlength = parseInt(validrecord[item].length,10);
                    if(strlength > 255 ){ 
                        errorMsg = 'Length cannot greater than 255';
                        //component.find("toastCmp").showToastModel(errorMsg, "error");
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({ title : 'Error Message', message:errorMsg, type: 'error',  
                                             });
                        toastEvent.fire();
                        aptData = false;
                    }
                    
                }
                
                
                if( validrecord[item].type == 'DOUBLE'|| validrecord[item].type == 'CURRENCY' || validrecord[item].type == 'PERCENT' ){
                    if( validrecord[item].precision == '' || validrecord[item].precision == '0'){
                        errorMsg = 'Length cannot be Null';
                        //component.find("toastCmp").showToastModel(errorMsg, "error");
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({ title : 'Error Message', message:errorMsg, type: 'error',  
                                             });
                        toastEvent.fire();
                        aptData = false;
                    }
                    if(validrecord[item].scale == '' ){
                        validrecord[item].scale = 0;
                    }
                }
                
                if( validrecord[item].type == 'DOUBLE'||  validrecord[item].type == 'PERCENT' ){
                    var p =parseInt(validrecord[item].precision);
                    var s = parseInt(validrecord[item].scale);
                    var sum = parseInt(p+s);
                    console.log('Sum: ',sum);
                    if(sum >18 ){
                        errorMsg = 'Sum of The sum of the length and decimal places must be an integer less than or equal to 18';
                        // component.find("toastCmp").showToastModel(errorMsg, "error");
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({ title : 'Error Message', message:errorMsg, type: 'error',  
                                             });
                        toastEvent.fire();
                        aptData = false;
                    }
                    
                }
                
                
                if( validrecord[item].type == 'PICKLIST'){
                    if( validrecord[item].pickListValue == '' ){
                        errorMsg = 'PickList value is Empty';
                        component.find("toastCmp").showToastModel(errorMsg, "error");
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({ title : 'Error Message', message:errorMsg, type: 'error',  
                                             });
                        toastEvent.fire();
                        aptData = false;
                    }
                    
                }
            }
            if(aptData){
                helper.CreateAccount(component,JSON.stringify(val),obj);
            }

        }
        else{
           var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({ title : 'Error Message', message:'Please Select Object', type: 'error',  
                                             });
                        toastEvent.fire();
        }
        
        
                
    },
    removeRow : function(component, event, helper) {
        console.log('Inside remove');
        component.find('searchKey').set('v.value','');
        var target = event.target;
        var rowIndex = target.getAttribute("data-index");
        console.log("Row No : " + rowIndex);
        var updatedList = component.get('v.fieldValuesList');
        var delList = component.get('v.deletedfieldValuesList');
        let indexToRemove = target.getAttribute("data-index");
        console.log('index: ',indexToRemove);
        var pagenumber = component.get('v.pageNumber');            
        
        
        var actualIndex = (pagenumber - 1) + indexToRemove;
        if(parseInt(actualIndex,10) > 0){
            var removedElements = updatedList.splice(parseInt(actualIndex,10), 1);
            //helper.datatableHelper(component);
            delList.push(removedElements[0]);
        }
        else{
            console.log('else case');
            var removedElements = updatedList.splice(0, 1);
            console.log('deleted element'+removedElements);
            delList.push(removedElements[0]);
            
        }
        
        component.set('v.fieldValuesList', updatedList);
        
        var sortNo = component.get('v.sortNo');
        var divForPage = parseInt(Math.floor(component.get("v.fieldValuesList").length+parseInt(sortNo-1))/sortNo);
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
        component.set('v.deletedfieldValuesList', delList);
        
        
    },
   
    onControllerFieldChange: function(component, event, helper) {    
        
        var controllerValueKey = event.getSource().get("v.value"); // get selected controller field value
        var index = event.getSource().get("v.name");
        var val = component.get('v.fieldValuesList');
        ////console.log('@@'+val[index].type);
        var pagenumber = component.get('v.pageNumber');  
        var actualIndex = (pagenumber - 1) + index;
        
        console.log('value rec: '+controllerValueKey+' index '+actualIndex);
        val[actualIndex].referenceTo = 'Account';
        component.set('v.fieldValuesList',val);
        if(controllerValueKey == 'PICKLIST' ){
            component.set('v.picklistFlag',false);
        }
        else{
            component.set('v.picklistFlag',true);
        }
        if(controllerValueKey == 'BOOLEAN'){
            val[index].defaultValue ='false';
            component.set('v.fieldValuesList',val);
        }
        if(controllerValueKey == 'REFERENCE' ){
            //var index = event.getSource().get("v.name");
            //var actualIndex = (pagenumber - 1) + index;
            //alert('index'+actualIndex);
        }
    },
    
    
    
    
    // 2. Method to download CSV file.
    downloadCSV : function(component, event, helper,fileTitle) {
        // 3. Getting table data to download it in CSV.
        var gridData = component.get("v.gridData");
        // 4. Spliting headers form table.
        var gridDataHeaders = gridData["headers"];
        // 5. Spliting row form table.
        var gridDataRows = gridData["rows"];
        // 6. CSV download.
        var csv = '';
        for(var i = 0; i < gridDataHeaders.length; i++){         
            csv += (i === (gridDataHeaders.length - 1)) ? gridDataHeaders[i]["title"] : gridDataHeaders[i]["title"] + ','; 
        }
        csv += "\n";
        var data = [];
        for(var i = 0; i < gridDataRows.length; i++){
            var gridRowIns = gridDataRows[i];
            var gridRowInsVals = gridRowIns["vals"];
            var tempRow = [];
            for(var j = 0; j < gridRowInsVals.length; j++){                                     
                var tempValue = gridRowInsVals[j]["val"];
                if(tempValue.includes(',')){
                    tempValue = "\"" + tempValue + "\"";
                }
                tempValue = tempValue.replace(/(\r\n|\n|\r)/gm,"");                 
                tempRow.push(tempValue);
            }
            data.push(tempRow); 
        }
        data.forEach(function(row){
            csv += row.join(',');
            csv += "\n";
        });
        // 6. To download table in CSV format.
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'Samplefile'+'.csv'; 
        hiddenElement.click();
    },
    
    onPagination:function(component,event,helper){
        helper.renderPage(component);
    },
    
    searchKeyChange: function( component, event, helper ){
        
        var wraplist = component.get('v.fieldValuesList');
        var templist = [];
        var searchkey = component.find('searchKey').get('v.value');
        if(searchkey == ''){
            var sortNo = component.get('v.sortNo');
            var divForPage =   parseInt(Math.floor(component.get("v.fieldValuesList").length+parseInt(sortNo-1))/sortNo);
            if(divForPage > 0)
                component.set("v.maxPage",divForPage);
            else
                component.set("v.maxPage",1);
            component.set('v.pageNumber',component.get('v.pageNumber'));
            helper.renderPage(component);
        }else{
            for(var i=0 ; i<wraplist.length;i++){
                if(wraplist[i].name.toLowerCase().startsWith(searchkey.toLowerCase())){
                    templist.push(wraplist[i]);
                }
                // console.log('temp size: '+temp.length);
            }
            var childComp = component.find('childComp');
            childComp.callChild();
            component.set("v.paginationList", templist);
            var a = component.get('v.paginationList');
            //alert('@@'+a.length);
            var sortNo = component.get('v.sortNo');
            var divForPage =   parseInt(Math.floor(component.get("v.paginationList").length+parseInt(sortNo-1))/sortNo);
            if(divForPage > 0)
                component.set("v.maxPage",divForPage);
            else
                component.set("v.maxPage",1); 
            
        }
    },
    
    onSortChange: function(component,event,helper){
        component.find('searchKey').set('v.value','');
        var childComp = component.find('childComp');
        childComp.callChild();
        var sortNo = component.get('v.sortNo');
        component.set("v.maxPage", parseInt(Math.floor(component.get("v.fieldValuesList").length+(sortNo-1))/sortNo));
        helper.renderPage(component);
    },
    sort:function( component, event, helper ) {
        component.find('searchKey').set('v.value','');
        console.log('sort');
        if(component.get('v.Asc')){
            component.set('v.Asc',false);    
        }
        else{
            component.set('v.Asc',true);
        }
        
        var SortOrder = component.get('v.sortOrder');
        SortOrder =SortOrder === 'asc' ? 'desc' : 'asc';
        var reverse = SortOrder === 'asc' ? 1 : -1;
        let table = JSON.parse(JSON.stringify(component.get('v.fieldValuesList')));
        table.sort((a,b) => {return a[a.name] > b[b.name] ? 1*reverse : -1*reverse});
        component.set('v.sortOrder','desc');
        component.set('v.fieldValuesList',table);
        helper.renderPage(component);
    },
    sortlabel:function( component, event, helper ) {
        component.find('searchKey').set('v.value','');
        console.log('sortlabel');
        if(component.get('v.labelAsc')){
            component.set('v.labelAsc',false);    
        }
        else{
            component.set('v.labelAsc',true);
        }
        
        var SortOrder = component.get('v.sortOrderlabel');
        SortOrder =SortOrder === 'asc' ? 'desc' : 'asc';
        var reverse = SortOrder === 'asc' ? 1 : -1;
        
        let table = JSON.parse(JSON.stringify(component.get('v.fieldValuesList')));
        table.sort((a,b) => {return a[a.label] > b[b.label] ? 1*reverse : -1*reverse});
        component.set('v.sortOrderlabel','desc');
        component.set('v.fieldValuesList',table);
        helper.renderPage(component);
    },
    handleNewButtonClick: function( component, event, helper ){
        component.set('v.showModal',true);
        component.find('searchKey').set('v.value','');
    },
    test: function( component, event, helper ){
        //alert('hey');
        var goLast = component.find('childComp');
        goLast.gotoLastPage();
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
    }
    
})