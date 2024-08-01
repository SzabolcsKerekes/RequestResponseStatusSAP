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
                    var aPwListSet = oModel.getProperty("/HeaderSet");
                    // Setting up table
                    oModel.setProperty("/MainPageTableDataList", aPwListSet);
                    oModel.setProperty("/Step7BenutzersucheList", aPwListSet);

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

            /* ======================================================================================================================================
                Main Page Table Filterbar & Search Implementation
            ====================================================================================================================================== */
            // // Clearing search fields
            onPressClearSearchMainPageTable: function () {
                var oFilterBar = this.byId("fbMainPageTable");
                var aFilterItems = oFilterBar.getAllFilterItems();

                aFilterItems.forEach(function (oFilterItem) {
                    var oControl = oFilterItem.getControl();
                    if (oControl) {
                        oControl.setValue("");
                    }
                });

                var oTable = this.byId("scMainPageTable").getContent()[0];
                oTable.getBinding("items").filter([]);
            },

            // // Setting search filters on list
            // onPressSearchMainPageTable: function (oEvent) {
            //     var oFilterBar = this.byId("fbMainPageTable");
            //     var aFilters = [];
            //     var aFilterItems = oFilterBar.getAllFilterItems();

            //     console.log("Filter Bar:", oFilterBar);
            //     console.log("Filter Items:", aFilterItems);

            //     aFilterItems.forEach(function (oFilterItem) {
            //         var oControl = oFilterItem.getControl();
            //         if (oControl) {
            //             var sKey = oFilterItem.getName();
            //             var sValue;

            //             if (oControl.getValue) {
            //                 sValue = oControl.getValue();
            //             } 
            //             // else if (oControl.getSelectedKey) {
            //             //     sValue = oControl.getSelectedKey();
            //             // } else if (oControl.getDateValue) {
            //             //     var oDate = oControl.getDateValue();
            //             //     sValue = oDate ? oDate.toISOString().split('T')[0] : null; // Adjust date format as needed
            //             // }

            //             if (sValue) {
            //                 console.log("Adding Filter:", sKey, sValue);
            //                 aFilters.push(new Filter(sKey, FilterOperator.Contains, sValue.toLowerCase()));
            //             }
            //         }
            //     });

            //     console.log("Filters Applied:", aFilters.length);

            //     var oTable = this.byId("scMainPageTable").getContent()[0];
            //     var oBinding = oTable.getBinding("items");

            //     console.log("Binding before filter:", oBinding);

            //     oBinding.filter(aFilters);

            //     console.log("Binding after filter:", oBinding.length);
            // },
            // onPressSearchMainPageTable: function () {
            //     var oFilterBar = this.byId("fbMainPageTable");
            //     var aFilters = [];
            //     var aFilterItems = oFilterBar.getAllFilterItems();

            //     aFilterItems.forEach(function (oFilterItem) {
            //         var oControl = oFilterItem.getControl();
            //         if (oControl && oControl.getValue) {
            //             var sValue = oControl.getValue();
            //             if (sValue) {
            //                 var sKey = oFilterItem.getName();
            //                 aFilters.push(new Filter(sKey, FilterOperator.Contains, sValue.toLowerCase()));
            //             }
            //         }
            //     });

            //     // Applying filters to the table
            //     var oTable = this.byId("scMainPageTable").getContent()[0];
            //     var oBinding = oTable.getBinding("items");
            //     oBinding.filter(aFilters);
            // },

            onPressSearchMainPageTable: function () {
                var oFilterBar = this.byId("fbMainPageTable");
                var aFilters = [];
                var aFilterItems = oFilterBar.getAllFilterItems();

                aFilterItems.forEach(function (oFilterItem) {
                    var oControl = oFilterItem.getControl();
                    if (oControl && oControl.getValue) {
                        var sValue = oControl.getValue().toLowerCase();
                        if (sValue) {
                            var sKey = oFilterItem.getName();
                            switch (sKey) {
                                case "PWNummer":
                                    aFilters.push(new Filter("PW_NR", FilterOperator.Contains, sValue));
                                    break;
                                case "Status":
                                    aFilters.push(new Filter("STAT", FilterOperator.Contains, sValue));
                                    break;
                                case "Planungsnummer":
                                    aFilters.push(new Filter("BT_NR", FilterOperator.Contains, sValue));
                                    break;
                                case "Verwendungszweck":
                                    aFilters.push(new Filter("VRWNG_AUSL", FilterOperator.Contains, sValue));
                                    break;
                                case "Projektnummer":
                                    aFilters.push(new Filter("Derivate_ConstructionSet_Project", FilterOperator.Contains, sValue));
                                    break;
                                case "Ersteller":
                                    aFilters.push(new Filter("Creator", FilterOperator.Contains, sValue));
                                    break;
                                case "Verwender":
                                    aFilters.push(new Filter("User_LastName", FilterOperator.Contains, sValue));
                                    break;
                                case "Erstelldatum":
                                    aFilters.push(new Filter("CREATED_ON", FilterOperator.Contains, sValue));
                                    break;
                            }
                        }
                    }
                });

                // Applying filters to the table
                var oTable = this.byId("scMainPageTable").getContent()[0];
                var oBinding = oTable.getBinding("items");
                oBinding.filter(aFilters);
            },

            // /* ======================================================================================================================================
            //     Navigation to Details Page
            // ====================================================================================================================================== */
            onPressSelectMainPageTableNavToPwDetails: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem") || oEvent.getSource();

                var oContext = oSelectedItem.getBindingContext("applicationModel");
                var sPwNr = oContext.getProperty("PW_NR");
                var sOidKop = oContext.getProperty("OID_KOP");
                var sAnrKop = oContext.getProperty("ANR_KOP");

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RoutePwDetails", {
                    PW_NR: sPwNr,
                    ANR_KOP: sAnrKop,
                    OID_KOP: sOidKop
                });
            }

        });
    });
