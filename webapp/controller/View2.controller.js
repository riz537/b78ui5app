sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.demo.b78sapui5.controller.View2", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("RouteView2").attachPatternMatched(this.onPatternMatched, this);
        },
        onPatternMatched: function (oEvent) {
            var empId = oEvent.getParameter("arguments").key;
            this.empId =empId;
            this.getView().bindElement("oModel>/EmployeeSet('" + empId + "')");
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },
        onPressPhoto:function(){
            var url = "/sap/opu/odata/sap/ZB78_EMP_SRV/PhotoSet('"+this.empId+"')/$value";
            sap.m.URLHelper.redirect(url,false);
        }
    });
});