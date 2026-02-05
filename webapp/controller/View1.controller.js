sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "com/demo/b78sapui5/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter"
], (Controller, MessageBox, MessageToast, formatter, Filter, Sorter) => {
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
            this.getOwnerComponent().getRouter().navTo("RouteView2", {
                key: empId
            });

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
            var aSorters = [];
            var empId = this.byId("oIpEmpId").getValue();
            var name = this.byId("oIpName").getValue();
            if (empId !== "") {
                aFilters.push(new Filter("Empid", "EQ", empId));
            }
            if (name !== "") {
                aFilters.push(new Filter("Name", "Contains", name));
            }
            this.byId("oTabEmp").getBinding("items").filter(aFilters);

            //Sorting logic starts here
            // grouping should take the precedence
            var groupField = this.byId("oCBGroupField").getSelectedKey();
            var groupOrder = this.byId("oRBGGroupOrder").getSelectedIndex();

            if (groupField !== "" && groupOrder !== -1) {
                aSorters.push(new Sorter(groupField, (groupOrder === 0) ? false : true, function (oBindingConntext) {
                    if (groupField === "Skill") {
                        var skill = oBindingConntext.getObject().Skill;
                        return {
                            key: skill,
                            text: skill
                        }
                    }
                    else if (groupField === "Desig") {
                        var desig = oBindingConntext.getObject().Desig;
                        return {
                            key: desig,
                            text: desig
                        }
                    }


                }));
            }



            /// below is sorting logic
            var sortField = this.byId("oCBSortField").getSelectedKey();
            var sortOrder = this.byId("oRBGSortOrder").getSelectedIndex();

            if (sortField !== "" && sortOrder !== -1) {
                aSorters.push(new Sorter(sortField, (sortOrder === 0) ? false : true));
            }

            this.byId("oTabEmp").getBinding("items").sort(aSorters);
        },
        onPressReset: function () {
            this.byId("oIpEmpId").setValue("");
            this.byId("oIpName").setValue("");
            this.byId("oCBSortField").setSelectedKey("");
            this.byId("oRBGSortOrder").setSelectedIndex(-1);

            this.byId("oCBGroupField").setSelectedKey("");
            this.byId("oRBGGroupOrder").setSelectedIndex(-1);

            this.byId("oTabEmp").getBinding("items").filter([]);
            this.byId("oTabEmp").getBinding("items").sort([]);

        },
        onCreateEmp: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView3");
        },
        onEditEmp: function () {
            var selRow = this.byId("oTabEmp").getSelectedItem();
            if (selRow === null) {
                MessageBox.error("Bro, First Select the Row");
                return;
            }
            var empId = selRow.getBindingContext("oModel").getObject().Empid;
            this.getOwnerComponent().getRouter().navTo("RouteView4", {
                key: empId
            });
        },
        onDeleteEmp: function () {
            var selRow = this.byId("oTabEmp").getSelectedItem();
            if (selRow === null) {
                MessageBox.error("Bro, First Select the Row");
                return;
            }
            var empId = selRow.getBindingContext("oModel").getObject().Empid;
            var oModel = this.getOwnerComponent().getModel("oModel");
            oModel.remove("/EmployeeSet('"+empId+"')",{
                success:function(req,res){
                     MessageBox.success("Employee Deleted Successfully");
                },
                error:function(oError){
                  MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                }
            });

        }
    });
});