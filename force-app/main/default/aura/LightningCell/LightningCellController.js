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
  
})