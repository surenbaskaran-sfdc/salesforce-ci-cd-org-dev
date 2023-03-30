({
    afterRender: function (component, helper) {
        this.superAfterRender();
        component.find("default").focus();
    }
})