sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/unified/FileUploaderParameter",
    "sap/m/MessageToast"
], (Controller, MessageBox, FileUploaderParameter,MessageToast) => {
    "use strict";

    return Controller.extend("com.demo.b78sapui5.controller.View3", {
        onInit() {
            this.certModel = this.getOwnerComponent().getModel("certModel");
            this.certModel.setData({
                aCertifications: [
                ]
            });
        },
        onPressAdd: function () {
            this.certModel.getData().aCertifications.push(
                {
                    Empid: this.byId("oIpEmpId").getValue(),
                    Certcode: "",
                    Skill: "",
                    Certname: ""
                }
            );
            this.certModel.refresh();
        },
        onDeleteRow: function (oEvent) {
            /// you need to find out the index and use splice function on the array
            var index = oEvent.getSource().getParent().getBindingContextPath().split("/")[2];
            this.certModel.getData().aCertifications.splice(index, 1);
            this.certModel.refresh();
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },
        onSelFile: function (oEvent) {
            this.fileName = oEvent.getParameter("files")[0].name;
            this.fileType = oEvent.getParameter("files")[0].type;
        },
        onUploadComplete:function(oEvent){
            var status = oEvent.getParameter("status");
            if(status === 201){
               MessageToast.show("Employee photo uploaded successfully");
            }else{
                MessageToast.show("Falied to upload the photo");
            }
        },
        uploadPhoto: function () {
            var oFileUploader = this.byId("oFileUploaderPhoto");
            var empId = this.byId("oIpEmpId").getValue();
            var slug = empId + "," + this.fileName;

            //1. add slug parameter
            oFileUploader.addHeaderParameter(new FileUploaderParameter({
                name: "slug",
                value: slug
            }));
            //2. add the File type parameter 
            oFileUploader.addHeaderParameter(new FileUploaderParameter({
                name: "Content-Type",
                value: this.fileType
            }));
            //3. add X-CSRF token
            this.getOwnerComponent().getModel("oModel").refreshSecurityToken();
            oFileUploader.addHeaderParameter(new FileUploaderParameter({
                name: "x-csrf-token",
                value: this.getOwnerComponent().getModel("oModel").getHeaders()['x-csrf-token']
            }));
            oFileUploader.upload();

        },
        onPresSave: function () {
            var empId = this.byId("oIpEmpId").getValue();
            var name = this.byId("oIpName").getValue();
            var desig = this.byId("oIpDesig").getValue();
            var email = this.byId("oIpEmail").getValue();
            var salary = this.byId("oIpSalary").getValue();
            var status = this.byId("oIpStatus").getValue();
            var rating = this.byId("oIpRating").getValue();

            //perform any validation if required 

            var payload = {
                Empid: empId,
                Name: name,
                Desig: desig,
                Email: email,
                Salary: salary,
                Status: status,
                Rating: parseInt(rating),
                toCertifications: this.certModel.getData().aCertifications
            };
            var oModel = this.getOwnerComponent().getModel("oModel");
            oModel.create("/EmployeeSet", payload, {
                success: function (req, res) {
                    if (res.statusCode === "201") {
                        MessageBox.success("New Employee Created Successfully");
                        this.uploadPhoto();
                    }
                }.bind(this),
                error: function (oError) {
                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                }
            });

        }
    });
});