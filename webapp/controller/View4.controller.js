sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller,MessageBox) => {
    "use strict";

    return Controller.extend("com.demo.b78sapui5.controller.View4", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("RouteView4").attachPatternMatched(this.onPatternMatched, this);
        },
        onPatternMatched: function (oEvent) {
            var empId = oEvent.getParameter("arguments").key;
            this.getView().bindElement("oModel>/EmployeeSet('" + empId + "')");
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },
        onPresSave:function(){
             var empId = this.byId("oIpEmpId").getValue();
            var name = this.byId("oIpName").getValue();
            var desig = this.byId("oIpDesig").getValue();
            var skill = this.byId("oIpSkill").getValue();
            var email = this.byId("oIpEmail").getValue();
            var salary = this.byId("oIpSalary").getValue();
            var status = this.byId("oIpStatus").getValue();
            var rating = this.byId("oIpRating").getValue();

            //perform any validation if required 

            var payload = {
                Empid: empId,
                Name: name,
                Desig: desig,
                Skill: skill,
                Email: email,
                Salary: salary,
                Status: status,
                Rating: parseInt(rating),
            };
            var oModel = this.getOwnerComponent().getModel("oModel");
            oModel.update("/EmployeeSet('"+empId+"')",payload,{
                success:function(req,res){
                     MessageBox.success("Employee Updated Successfully");
                },
                error:function(oError){
                  MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                }
            });
        }
    });
});