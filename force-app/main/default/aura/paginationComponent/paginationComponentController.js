({
	First : function(component, event, helper) {
		component.set("v.currentPage",1);
	},
    
    Previous : function(component, event, helper) {
		component.set("v.currentPage",component.get("v.currentPage")-1);
	},
    
    Next : function(component, event, helper) {
		component.set("v.currentPage",component.get("v.currentPage")+1);
	},
    
    Last : function(component, event, helper) {
		component.set("v.currentPage",component.get("v.maxPage"));
	},
     callChildMethod : function(component, event, helper) {
        component.set("v.currentPage",1);
    }



})