sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/core/ValueState",
    "sap/m/MessageToast",
    "reqresproject/utils/formatter"
],
    function (
        Controller,
        JSONModel,
        Fragment,
        Filter,
        FilterOperator,
        MessageBox,
        ValueState,
        MessageToast,
        formatter
    ) {
        "use strict";

        return Controller.extend("reqresproject.controller.View1", {
            formatter: formatter,
            /* ======================================================================================================================================
                App initialization
            ====================================================================================================================================== */
            onInit: function () {
                var oApplicationModel = new JSONModel("./model/data.json");
                this.getView().setModel(oApplicationModel, "applicationModel");
            },

            /* ======================================================================================================================================
                After rendering the app
            ====================================================================================================================================== */
            onAfterRendering: function () {
                // Get the application model
                var oModel = this.getView().getModel("applicationModel");

                // Ensure the model is fully loaded before accessing the data
                oModel.attachRequestCompleted(function () {
                    // Access the PwList property
                    var aPwListSet = oModel.getProperty("/PwList");
                    // Setting up table
                    oModel.setProperty("/MainPageTableDataList", aPwListSet);
                });
            },

            /* ======================================================================================================================================
                Main Page Table Toolbar Implementation
            ====================================================================================================================================== */
            onSelectChangeItemCardinalityMainPageTable: function (oEvent) {
                var selectedKey = oEvent.getParameter("selectedItem").getKey();
                // Update the table's item count based on the selectedKey
                // Implement your logic here
            },

            onPressOptionsMainPageTable: function () {
                // Handle the options button press
                // Implement your logic here
            }
        });
    });
