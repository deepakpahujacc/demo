({
	NavigatetoCustomSetting : function(component, event, helper) {
		
		console.log('Enter Here');
        var evt = $A.get("e.force:navigateToComponent");
        console.log('evt'+evt);
        evt.setParams({
            componentDef: "c:CustomSettingObj"
            //componentAttributes :{ }
        });
       
        evt.fire();
	},
    
    NavigatetoCustomLabels : function(component, event, helper) {
		
		console.log('Enter Here');
        var evt = $A.get("e.force:navigateToComponent");
        console.log('evt'+evt);
        evt.setParams({
            componentDef: "c:customLabelComponent"
            //componentAttributes :{ }
        });
       
        evt.fire();
	},
    
    NavigatetoCustomMetadaTypesRecord : function(component, event, helper) {
		
		console.log('Enter Here');
        var evt = $A.get("e.force:navigateToComponent");
        console.log('evt'+evt);
        evt.setParams({
            componentDef: "c:CustomMetadataTypesRecord"
            //componentAttributes :{ }
        });
       
        evt.fire();
	},
    
    NavigatetoMetadataExport : function(component, event, helper) {
		
		console.log('Enter Here');
        var evt = $A.get("e.force:navigateToComponent");
        console.log('evt'+evt);
        evt.setParams({
            componentDef: "c:MutipleRecordExport"
            //componentAttributes :{ }
        });
       
        evt.fire();
	},
    
    NavigatetoMassFieldCreate : function(component, event, helper) {
		
		console.log('Enter Here');
        var evt = $A.get("e.force:navigateToComponent");
        console.log('evt'+evt);
        evt.setParams({
            componentDef: "c:customFieldComponent"
            //componentAttributes :{ }
        });
       
        evt.fire();
	},
    NavigatetoFieldLevelPermission : function(component, event, helper) {
		
		console.log('Enter Here');
        var evt = $A.get("e.force:navigateToComponent");
        console.log('evt'+evt);
        evt.setParams({
            componentDef: "c:FieldLevelPermission"
            //componentAttributes :{ }
        });
       
        evt.fire();
	}
})