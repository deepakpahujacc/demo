({
	getWrapperData: function(component, event, helper) {
        var sortNo = component.get('v.sortNo');
         var action = component.get('c.fetchsObject');
        action.setCallback(this, function(response) {
        var state = response.getState();
        if (state === "SUCCESS") {
            var allvalues = response.getReturnValue();
            for(var i=0; i<allvalues.length;i++){
             	allvalues[i].serialNo=i+1;   
            }
         component.set('v.wrapList', allvalues);
         component.set("v.maxPage",Math.ceil((component.get("v.wrapList").length)/sortNo));
         this.renderPage(component);  
         component.set("v.Spinner", false);
        }
      });
      $A.enqueueAction(action);
	},
    renderPage: function(cmp){    
        var sortNo = cmp.get('v.sortNo');
        var wrapList= cmp.get('v.wrapList');
        var pagenumber = cmp.get('v.pageNumber'); 
        var templist= wrapList.slice((pagenumber-1)*sortNo,pagenumber*sortNo);
        cmp.set('v.paginationList',templist);
        cmp.set('v.NoRecord',false);
    },
    paginationHandle:function(cmp){
    	var sortNo = cmp.get('v.sortNo');
        var wrapList= cmp.get('v.wrapList');
        var pagenumber = cmp.get('v.pageNumber');
        var maxPage = cmp.get('v.maxPage');
        if(pagenumber<=maxPage){
        	var templist= wrapList.slice((pagenumber-1)*sortNo,pagenumber*sortNo);
            cmp.set('v.paginationList',templist);    
             cmp.set('v.NoRecord',false);
        }
        else{
            cmp.set('v.pageNumber',1);
            var pagenumber = cmp.get('v.pageNumber');
            var templist= wrapList.slice((pagenumber-1)*sortNo,pagenumber*sortNo);
            cmp.set('v.paginationList',templist);
            cmp.set('v.NoRecord',false);
        }
    }
})