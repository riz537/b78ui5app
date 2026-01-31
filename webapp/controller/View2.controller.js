sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.demo.b78sapui5.controller.View2", {
        onInit() {
        },
        onNavBack:function(){
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        }
    });
});