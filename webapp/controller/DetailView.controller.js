sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "reqresproject/utils/formatter"

], function (
    Controller,
    JSONModel,
    formatter
) {
    "use strict";

    return Controller.extend("reqresproject.controller.DetailView", {
        formatter: formatter,

        onInit: function () {
            // var oRoute = this.getRouter().getRoute("RoutePwDetails")

            this.getOwnerComponent().getRouter().getRoute("RoutePwDetails").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oApplicationModel = new JSONModel("./model/data.json");
            this.getView().setModel(oApplicationModel, "applicationModel");

            oApplicationModel.attachRequestCompleted(function() {
                var aPwList = oApplicationModel.getProperty("/HeaderSet");
                console.log("HeaderSet", aPwList);

                var oMatchingObject = aPwList.find(function (oItem) {
                    return oItem.ANR_KOP === sANR_KOP && oItem.PW_NR === sPW_NR && oItem.OID_KOP === sOID_KOP;
                });

                this.getView().getModel("applicationModel").setProperty("/Header", { ...oMatchingObject});   
                this.getView().getModel("applicationModel").setProperty("/HeaderEdit", { ...oMatchingObject});     
            }.bind(this));

            var sPW_NR = oEvent.getParameter("arguments").PW_NR;
            var sANR_KOP = oEvent.getParameter("arguments").ANR_KOP;
            var sOID_KOP = oEvent.getParameter("arguments").OID_KOP;
        },

        onPressNavigationBackToMainPage: function () {
            // Navigate back to the previous page
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteView1", {}, true);
        },

        // _readPwHeader: function (oParam) {
        //     return new Promise(function (resolved, rejected) {
        //         var sPath = this.getModel("detailsModel").createKey("/HeaderSet", {
        //             OID_KOP: oParam.OID_KOP,
        //             ANR_KOP: oParam.ANR_KOP,
        //             PW_NR: oParam.PW_NR
        //         });
        //         this.getModel("detailsModel").read(sPath, {
        //             success: function (oResponse) {
        //                 ///////// KELL getView()????
        //                 this.getModel("applicationModel").setProperty("/Header", { ...oResponse });
        //                 this.getModel("applicationModel").setProperty("/HeaderEdit", { ...oResponse });

        //                 // populate sampling point fields
        //                 var aFilters = [];
        //                 aFilters.push(new Filter("OID_STU", FilterOperator.EQ, oResponse.OID_STU));
        //                 aFilters.push(new Filter("ANR_STU", FilterOperator.EQ, oResponse.ANR_STU));
        //                 aFilters.push(new Filter("STU_BEZ", FilterOperator.EQ, oResponse.STU_BEZ));

        //                 this._readSamplingPoints(aFilters)
        //                     .then(function (oResponse) {
        //                         if (oResponse.results && oResponse.results[0]) {
        //                             this.getView().getModel("applicationModel").setProperty("/SelectedSamplingPoint", oResponse.results[0]);
        //                         } else {
        //                             this.getView().getModel("applicationModel").setProperty("/SelectedSamplingPoint", {});
        //                         }
        //                     }.bind(this))
        //                     .catch(function () {
        //                     }.bind(this))

        //             }
        //         })
        //     })
        // }
    });
})