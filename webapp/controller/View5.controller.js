sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("com.demo.b78sapui5.controller.View5", {
        onInit() {
            this.bulkEmpModel = new JSONModel({
                aEmployees: []
            });
            this.getView().setModel(this.bulkEmpModel, "bulkEmpModel");
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },
        onSelectFile: function (oEvent) {
            var file = oEvent.getParameter("files")[0];
            this.readXLContentIntoJSONArray(file);
        },
        onSubmit: function () {
            var aEmployees = this.bulkEmpModel.getData().aEmployees;
            var oModel = this.getOwnerComponent().getModel("oModel");

            var aDeferredGroups = oModel.getDeferredGroups();
            aDeferredGroups = aDeferredGroups.concat(["CREATEGRP"]);
            oModel.setDeferredGroups(aDeferredGroups);

            for (var i = 0; i < aEmployees.length; i++) {
                // give ith Employee Record data
                oModel.create("/EmployeeSet", aEmployees[i], {
                    groupId: "CREATEGRP"
                });
            }
            oModel.submitChanges({
                groupId: "CREATEGRP",
                success: function (req, res) {

                },
                error: function () {

                }
            });

        },
        readXLContentIntoJSONArray: function (file) {
            var that = this;
            var aResults = [];
            if (file && window.FileReader) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {
                        type: 'binary'
                    });
                    workbook.SheetNames.forEach(function (sheetName) {
                        // Here is your object for every sheet in workbook
                        aResults = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

                    });
                    // edit below two lines

                    that.bulkEmpModel.getData().aEmployees = aResults;
                    that.bulkEmpModel.refresh(true);
                };
                reader.onerror = function (ex) {
                    console.log(ex);
                };
                reader.readAsBinaryString(file);
            }
        }

    });
});