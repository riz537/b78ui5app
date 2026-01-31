sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "com/demo/b78sapui5/model/formatter",
    "sap/ui/model/Filter"
], (Controller, MessageBox, MessageToast, formatter, Filter) => {
    "use strict";

    return Controller.extend("com.demo.b78sapui5.controller.View1", {
        f: formatter,
        onInit() {
            var oModel = this.getOwnerComponent().getModel("oModel");
            var empModel = this.getOwnerComponent().getModel("empModel");
            oModel.read("/EmployeeSet", {
                success: function (data) {
                    var ratingDesc = "";
                    for (var i = 0; i < data.results.length; i++) {
                        if (data.results[i].Rating === 5) {
                            ratingDesc = "(Outstanding)";
                        } else if (data.results[i].Rating === 4) {
                            ratingDesc = "(Commendable)";
                        } else if (data.results[i].Rating === 3) {
                            ratingDesc = "(Met Expectation)";
                        } else if (data.results[i].Rating === 2) {
                            ratingDesc = "(Needs Improvment)";
                        } else if (data.results[i].Rating === 1) {
                            ratingDesc = "(PIP)";
                        }
                        data.results[i].Rating = data.results[i].Rating + ratingDesc;
                    }

                    empModel.setData(data);
                }, error: function (oError) {

                }
            });
        },
        onPress: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView2");
        },
        onPressRow: function (oEvent) {
            var empId = oEvent.getSource().getBindingContext("oModel").getObject().Empid;
        },
        getEmpId: function () {
            var aRows = this.byId("oTabEmp").getSelectedItems();
            for (var i = 0; i < aRows.length; i++) {
                MessageBox.success(aRows[i].getBindingContext("oModel").getObject().Empid);
            }
        },
        onPressF4Help: function () {
            if (this.dialog === undefined) {
                this.dialog = sap.ui.xmlfragment(this.getView().getId(), "com.demo.b78sapui5.fragments.EmpIdF4Help", this);
                this.getView().addDependent(this.dialog);
            }
            this.dialog.open();
        },
        onCloseDialog: function () {
            this.dialog.close();
        },
        onPressRowFromF4Help: function (oEvent) {
            var empId = oEvent.getSource().getBindingContext("oModel").getObject().Empid;
            this.byId("oIpEmpId").setValue(empId);
            this.dialog.close();
        },
        onPressGo: function () {
            // unltimate aim of this function is to construct the URL and trigger it
            var aFilters = [];
            var empId = this.byId("oIpEmpId").getValue();
            if (empId !== "") {
                aFilters.push(new Filter("Empid", "EQ", empId));
            }
            this.byId("oTabEmp").getBinding("items").filter(aFilters);
        }
    });
});