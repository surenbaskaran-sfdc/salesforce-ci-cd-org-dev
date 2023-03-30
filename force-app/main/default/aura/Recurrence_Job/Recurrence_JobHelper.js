({
    getCurrentJob : function(component,event,helper) {
        var action = component.get("c.getJob");
        action.setParams({ recordId : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {   
                component.set("v.jobRecord", response.getReturnValue());
                component.set("v.jobRecordCopy", JSON.parse(JSON.stringify(response.getReturnValue())));
                helper.createOptions(component,event,helper);
                helper.removeSpinner(component,event,helper);
            }
        });
        $A.enqueueAction(action);
    },
    createOptions : function(component,event,helper){
        let monthOptions = [];
        for(var i=1;i<=31;i++){
            let option = {};
            option.label = i;
            option.value = i;
            monthOptions.push(option);
        }
        component.set("v.monthOptions",monthOptions);
        
        let weekOptions =[];
        weekOptions.push({'label':'M','value':'Mon'});
        weekOptions.push({'label':'Tu','value':'Tue'});
        weekOptions.push({'label':'W','value':'Wed'});
        weekOptions.push({'label':'Th','value':'Thu'});
        weekOptions.push({'label':'F','value':'Fri'});
        weekOptions.push({'label':'Sa','value':'Sat'});
        weekOptions.push({'label':'Su','value':'Sun'});
        component.set("v.weekOptions",weekOptions);
        
        let minutesOptions = [];
        for(var i=0;i<=59;i++){
            let option = {};
            option.label = i;
            option.value = i;
            minutesOptions.push(option);
        }
        component.set("v.minutesOptions",minutesOptions);
        
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
        component.set("v.today",today);
        helper.handleStyleReset(component,event,helper);
    },
    handleStyleReset : function(component,event,helper){
        var errorRecords = [];
        errorRecords.push('label-hidden');
        errorRecords.push('');
        errorRecords.push('');
        errorRecords.push('label-hidden');
        errorRecords.push('label-hidden');
        errorRecords.push('');
        errorRecords.push('');
        errorRecords.push('');
        errorRecords.push('');
        component.set("v.errorRecords",errorRecords);
        
        /*var inputCmp = component.find("endDate");
        inputCmp.setCustomValidity("");
        inputCmp.reportValidity();
        
        inputCmp = component.find("startDate");
        inputCmp.setCustomValidity("");
        inputCmp.reportValidity();*/
    },
    handleCancelOperation: function(component,event,helper){
        var unsaved = component.find("unsaved");
        unsaved.setUnsavedChanges(false);
        helper.handleStyleReset(component,event,helper);
        component.set("v.showFooter",false);
        component.set("v.jobRecordCopy",JSON.parse(JSON.stringify(component.get("v.jobRecord"))));
    },
    openFooter : function(component,event,helper){
        component.set("v.showFooter",true);
        var unsaved = component.find("unsaved");
        unsaved.setUnsavedChanges(true, { label: 'Recurrence' });
    },
    resetScheduledValues : function(component,event,helper){
        var jobRecordCopy = component.get("v.jobRecordCopy");
        jobRecordCopy.Time__c='';
        jobRecordCopy.Day__c='';
        jobRecordCopy.minutes__c='';
        component.set("v.jobRecordCopy",jobRecordCopy);
    },
    handleSaveOperation : function(component,event,helper){
        if(!component.get("v.jobRecordCopy").Active__c){
            helper.handleStyleReset(component,event,helper);
            if(helper.validateRecurrenceTab(component,event,helper)){
                helper.createExpression(component,event,helper);
                helper.addSpinner(component,event,helper);
                component.set("v.showFooter",false);
                var action = component.get("c.updateJob");
                action.setParams({ record : component.get("v.jobRecordCopy") });
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var unsaved = component.find("unsaved");
                        unsaved.setUnsavedChanges(false);
                        component.set("v.jobRecord",JSON.parse(JSON.stringify(component.get("v.jobRecordCopy"))));
                        helper.showToastMessage(component,event,helper,'Success','Job Updated Successfully.');
                        helper.removeSpinner(component,event,helper);
                    }
                });
                $A.enqueueAction(action);
            }
        }else{
            helper.showToastMessage(component,event,helper,'Error','Active job cannot be updated.');
        }
    },
    validateRecurrenceTab : function(component,event,helper){
        var isValid = true;
        var errorRecords = component.get("v.errorRecords");
        var jobRecordCopy = component.get("v.jobRecordCopy");
        if(jobRecordCopy.Job_Type__c == undefined || jobRecordCopy.Job_Type__c == null || jobRecordCopy.Job_Type__c == ''){
            isValid = false;
            errorRecords[0] = 'label-hidden slds-has-error';
        }
        else{
            switch(jobRecordCopy.Job_Type__c) {
                case 'Daily':
                    if(jobRecordCopy.Time__c == undefined || jobRecordCopy.Time__c == null || jobRecordCopy.Time__c == ''){
                        isValid = false;
                        errorRecords[1] = 'slds-has-error';
                    }
                    break;
                case 'Weekly':
                    if(jobRecordCopy.Day__c == undefined || jobRecordCopy.Day__c == null || jobRecordCopy.Day__c == ''){
                        isValid = false;
                        errorRecords[2] = 'slds-has-error';
                    }
                    if(jobRecordCopy.Time__c == undefined || jobRecordCopy.Time__c == null || jobRecordCopy.Time__c == ''){
                        isValid = false;
                        errorRecords[5] = 'slds-has-error';
                    }
                    break;
                case 'Monthly':
                    if(jobRecordCopy.Day__c == undefined || jobRecordCopy.Day__c == null || jobRecordCopy.Day__c == ''){
                        isValid = false;
                        errorRecords[3] = 'label-hidden slds-has-error';
                    }
                    if(jobRecordCopy.Time__c == undefined || jobRecordCopy.Time__c == null || jobRecordCopy.Time__c == ''){
                        isValid = false;
                        errorRecords[6] = 'slds-has-error';
                    }
                    break;
                case 'Hourly':
                    if(jobRecordCopy.minutes__c == undefined || jobRecordCopy.minutes__c == null || jobRecordCopy.minutes__c == ''){
                        isValid = false;
                        errorRecords[4] = 'label-hidden slds-has-error';
                    }
                    break;
            }
        }
        
        /*if(jobRecordCopy.Start_Date__c == undefined || jobRecordCopy.Start_Date__c == null || jobRecordCopy.Start_Date__c == ''){
            isValid = false;
            errorRecords[7] = 'slds-has-error';
            var inputCmp = component.find("startDate");
            inputCmp.setCustomValidity("Start Date should be Greater than or Equal to Today");
            inputCmp.reportValidity();
            
        }
        else if (jobRecordCopy.Start_Date__c < component.get("v.today")) {
            isValid = false;
            errorRecords[7] = 'slds-has-error';
            var inputCmp = component.find("startDate");
            inputCmp.setCustomValidity("Start Date should be Greater than or Equal to Today");
            inputCmp.reportValidity();
        }
        
        if(jobRecordCopy.End_Date__c == undefined || jobRecordCopy.End_Date__c == null || jobRecordCopy.End_Date__c == ''){
            isValid = false;
            errorRecords[8] = 'slds-has-error';
            var inputCmp = component.find("endDate");
            inputCmp.setCustomValidity("End Date should be Greater than or Equal to Start Date");
            inputCmp.reportValidity();
        }
        else if (jobRecordCopy.End_Date__c < jobRecordCopy.Start_Date__c) {
            isValid = false;
            errorRecords[8] = 'slds-has-error';
            var inputCmp = component.find("endDate");
            inputCmp.setCustomValidity("End Date should be Greater than or Equal to Start Date");
            inputCmp.reportValidity();
        }*/
        
        component.set("v.errorRecords",errorRecords);
        if(!isValid){
            helper.showToastMessage(component,event,helper,'Error','Please fill all the fields and enter correct value.');
        }
        return isValid;
    },
    createExpression : function(component,event,helper){
        var jobRecordCopy = component.get("v.jobRecordCopy");
        //var start = jobRecordCopy.Start_Date__c.split("-");
        //var end = jobRecordCopy.End_Date__c.split("-");
        //find date range and time for cron expression
        var yearRange = '*';
        var monthRange = '*';
        var dayRange = '*';
        var weekRange = '?';
        switch(jobRecordCopy.Job_Type__c) {
            case 'Daily':
                var time = jobRecordCopy.Time__c.split(":");
                var hour = time[0];
                var minute = time[1];
                var second = 0;
                jobRecordCopy.Cron_Expression__c = second + ' '+ minute + ' ' + hour + ' ' + dayRange + ' ' + monthRange + ' ' + weekRange + ' ' +yearRange;
                break;
            case 'Weekly':
                var time = jobRecordCopy.Time__c.split(":");
                var hour = time[0];
                var minute = time[1];
                var second = 0;
                jobRecordCopy.Cron_Expression__c = second + ' '+ minute + ' ' + hour + ' ' + '?' + ' ' + monthRange + ' ' + jobRecordCopy.Day__c + ' ' +yearRange;
                break; 
            case 'Monthly':
                var time = jobRecordCopy.Time__c.split(":");
                var hour = time[0];
                var minute = time[1];
                var second = 0;
                jobRecordCopy.Cron_Expression__c = second + ' '+ minute + ' ' + hour + ' ' + jobRecordCopy.Day__c + ' ' + monthRange + ' ' + weekRange + ' ' +yearRange;
                break;
            case 'Hourly':
                var minute = jobRecordCopy.minutes__c;
                jobRecordCopy.Cron_Expression__c = '0 '  + minute + ' * * * ? *';
                break;
        }
        console.log(jobRecordCopy.Cron_Expression__c);
        component.set("v.jobRecordCopy",jobRecordCopy);
    },
    showToastMessage: function(component, event, helper, type, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({                
            "type": type,
            "message": message
        });
        toastEvent.fire();
    },
    addSpinner: function (component, event, helper) {
        var spinner = component.find("uSpinnerContainer");
        $A.util.removeClass(spinner, "slds-hide");
    },
    
    removeSpinner: function (component, event, helper) {
        var spinner = component.find("uSpinnerContainer");
        $A.util.addClass(spinner, "slds-hide");
    },
    
})