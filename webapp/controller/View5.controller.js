sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller,JSONModel) => {
    "use strict";

    return Controller.extend("com.demo.b78sapui5.controller.View5", {
        onInit() {
           this.bulkEmpModel = new JSONModel({
                aEmployees:[]
           });
           this.getView().setModel(this.bulkEmpModel,"bulkEmpModel");
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },
        onSelectFile: function (oEvent) {
            var file = oEvent.getParameter("files")[0];
            this.readXLContentIntoJSONArray(file);
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