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

    return Controller.extend("reqresproject.controller.DetailView", {
        formatter: formatter,

        /* ======================================================================================================================================
            Initializing the DetailView application
        ====================================================================================================================================== */
        onInit: function () {
            // var oRoute = this.getRouter().getRoute("RoutePwDetails")
            this.getOwnerComponent().getRouter().getRoute("RoutePwDetails").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oApplicationModel = new JSONModel("./model/data.json");
            this.getView().setModel(oApplicationModel, "applicationModel");

            oApplicationModel.attachRequestCompleted(function () {
                var aPwList = oApplicationModel.getProperty("/HeaderSet");
                var aCurrentLoggedOnUser = oApplicationModel.getProperty("/AuthorizationSet");

                var oMatchingObject = aPwList.find(function (oItem) {
                    return oItem.ANR_KOP === sANR_KOP && oItem.PW_NR === sPW_NR && oItem.OID_KOP === sOID_KOP;
                });

                // Date select (anlieferung) value
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var sText1 = oResourceBundle.getText("text1.wizard6.step8");
                var sText2 = oResourceBundle.getText("text2.wizard6.step8");

                // Create a JSON model and set the properties directly
                var oSelectModelAnlieferung = new JSONModel();
                oSelectModelAnlieferung.setProperty("/SelectAnlieferungValues", [
                    { key: "1", text: sText1 },
                    { key: "2", text: sText2 }
                ]);
                this.getView().setModel(oSelectModelAnlieferung, "selectAnlieferungModel");


                // Setting EDIT button's visibility based on Ersteller or Verwender
                if (oMatchingObject.Creator_QX === aCurrentLoggedOnUser.QX || oMatchingObject.User_QX === aCurrentLoggedOnUser.QX) {
                    this.getView().byId("editDataBtn").setVisible(true);
                    this.getView().byId("editDataBtn2").setVisible(true);

                } else {
                    this.getView().byId("editDataBtn").setVisible(false);
                    this.getView().byId("editDataBtn2").setVisible(false);

                }

                // Setting up Derivate Baukasten ProjectSet
                var aDerivatSet = this.getView().getModel("applicationModel").getProperty("/Derivate_Baukasten_ProjectSet");
                this.getView().getModel("applicationModel").setProperty("/DerivateBaukastenValues", aDerivatSet);

                // Setting up BBG Vorserie
                var aBBGVorserieSet = this.getView().getModel("applicationModel").getProperty("/MT_BBG_VorserieSet");
                this.getView().getModel("applicationModel").setProperty("/BBGVorserieValues", aBBGVorserieSet);

                // Creating Header and HeaderEdit clones
                this.getView().getModel("applicationModel").setProperty("/Header", { ...oMatchingObject });
                this.getView().getModel("applicationModel").setProperty("/HeaderEdit", { ...oMatchingObject });
            }.bind(this));

            var sPW_NR = oEvent.getParameter("arguments").PW_NR;
            var sANR_KOP = oEvent.getParameter("arguments").ANR_KOP;
            var sOID_KOP = oEvent.getParameter("arguments").OID_KOP;
        },

        formatDeliveryTypeText: function (sKey) {
            // Access the i18n model
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            // Define your texts based on i18n keys
            var sText1 = oResourceBundle.getText("text1.wizard6.step8");
            var sText2 = oResourceBundle.getText("text2.wizard6.step8");

            // Define local mapping
            var oMapping = {
                "1": sText1,
                "2": sText2
            };

            // Retrieve the text based on the key
            return oMapping[sKey] || sKey; // Default to key if not found
        },
        /* ======================================================================================================================================
            Navigation back to Main Page
        ====================================================================================================================================== */
        onPressNavigationBackToMainPage: function () {
            // Navigate back to the previous page
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteView1", {}, true);
        },

        /* ======================================================================================================================================
            Implementing EDIT button
        ====================================================================================================================================== */
        onPressEditPwHeader: function () {
            var oView = this.getView();
            var oModel = oView.getModel("applicationModel");

            // Set flags for visibility
            oModel.setProperty("/bRestartVisibilityGeneralDataEdit", true);
            oModel.setProperty("/bRestartVisibilityGeneralDataReadOnly", false);

            // Update button visibility
            oView.byId("editDataBtn").setVisible(false);
            oView.byId("saveDataBtn").setVisible(true);
            oView.byId("discardDataBtn").setVisible(true);
            oView.byId("editDataBtn2").setVisible(false);
            oView.byId("saveDataBtn2").setVisible(true);
            oView.byId("discardDataBtn2").setVisible(true);
        },

        /* ======================================================================================================================================
            Implementing SAVE button
        ====================================================================================================================================== */
        onPressUpdatePwHeader: function () {
            var oView = this.getView();
            var oModel = oView.getModel("applicationModel");
            var that = this;

            MessageBox.success(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msg.success"), {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        // Save logic here
                        var oNewHeader = oModel.getProperty("/HeaderEdit");
                        oModel.setProperty("/Header", { ...oNewHeader });

                        oModel.setProperty("/bRestartVisibilityGeneralDataEdit", false);
                        oModel.setProperty("/bRestartVisibilityGeneralDataReadOnly", true);

                        oView.byId("editDataBtn2").setVisible(true);
                        oView.byId("saveDataBtn2").setVisible(false);
                        oView.byId("discardDataBtn2").setVisible(false);
                        oView.setBusy(false);
                    } else {
                        oView.setBusy(false);
                    }
                }
            });
        },

        /* ======================================================================================================================================
            Implementing CANCEL button
        ====================================================================================================================================== */
        onPressDiscardChanges: function () {
            var oView = this.getView();
            oView.setBusy(true);
            var oModel = oView.getModel("applicationModel");

            var oHeader = oModel.getProperty("/Header");
            var oHeaderEdit = oModel.getProperty("/HeaderEdit");

            if (JSON.stringify(oHeader) === JSON.stringify(oHeaderEdit)) {
                oModel.setProperty("/bRestartVisibilityGeneralDataEdit", false);
                oModel.setProperty("/bRestartVisibilityGeneralDataReadOnly", true);
                oView.byId("editDataBtn").setVisible(true);
                oView.byId("saveDataBtn").setVisible(false);
                oView.byId("discardDataBtn").setVisible(false);
                oView.setBusy(false);
            } else {
                MessageBox.warning(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msg.discard"), {
                    actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            // Discard logic here
                            var oOriginalHeader = oModel.getProperty("/Header");
                            oModel.setProperty("/HeaderEdit", { ...oOriginalHeader });

                            oModel.setProperty("/bRestartVisibilityGeneralDataEdit", false);
                            oModel.setProperty("/bRestartVisibilityGeneralDataReadOnly", true);

                            oView.byId("editDataBtn").setVisible(true);
                            oView.byId("saveDataBtn").setVisible(false);
                            oView.byId("discardDataBtn").setVisible(false);
                            oView.setBusy(false);
                        } else {
                            oView.setBusy(false);
                        }
                    }
                });
            }

        },


        /* ======================================================================================================================================
            Implementing Date Picker Selection
        ====================================================================================================================================== */
        onChangeDatePickerGeneralData: function (oEvent) {
            // Get the new date value from the event
            var oDatePicker = oEvent.getSource();
            var oDateValue = oDatePicker.getDateValue();

            // Check if value is not null
            if (oDateValue) {
                // Convert date to OData format
                var timestamp = oDateValue.getTime();
                var sODataDateFormat = "/Date(" + timestamp + ")/";

                // Set the formatted date to the model
                var oModel = this.getView().getModel("applicationModel");
                oModel.setProperty("/HeaderEdit/CREATED_ON", sODataDateFormat);
            }
        },

        // -------------------------
        // EDIT - Verwender Dialog
        // -------------------------
        onOpenSummaryVerwenderDialog: function () {
            // Load and open the fragment as a dialog
            if (!this._dialogSummaryVerwender) {
                this._dialogSummaryVerwender = Fragment.load({
                    id: this.getView().getId(),
                    name: "reqresproject.view.fragments.SummaryVerwender",
                    controller: this
                });
            }

            var aInternalUsers = this.getView().getModel("applicationModel").getProperty("/User_detailsSet");
            this.getView().getModel("applicationModel").setProperty("/VerwenderListGeneralDataDialog", aInternalUsers);

            this._dialogSummaryVerwender.then(function (oDialog) {
                this.getView().addDependent(oDialog);
                oDialog.open();
            }.bind(this));
        },

        // Pop-up dialog's search for Verwender
        onPressClearSearchVerwenderSummary: function () {
            var oFilterBar = this.byId("fbSummaryVerwenderSearch");
            var aFilterItems = oFilterBar.getAllFilterItems();

            aFilterItems.forEach(function (oFilterItem) {
                var oControl = oFilterItem.getControl();
                if (oControl) {
                    oControl.setValue("");
                }
            });

            var oTable = this.byId("scSummaryVerwenderStep10").getContent()[0];
            oTable.getBinding("items").filter([]);
        },

        onPressSearchVerwenderSummary: function () {
            var oFilterBar = this.byId("fbSummaryVerwenderSearch");
            var aFilters = [];
            var aFilterItems = oFilterBar.getAllFilterItems();

            aFilterItems.forEach(function (oFilterItem) {
                var oControl = oFilterItem.getControl();
                if (oControl && oControl.getValue) {
                    var sValue = oControl.getValue();
                    if (sValue) {
                        var sKey = oFilterItem.getName();
                        aFilters.push(new Filter(sKey, FilterOperator.Contains, sValue.toLowerCase()));
                    }
                }
            });

            // GET "MainPageTableDataList" FROM getProperty()... => filter this array

            // Applying filters to the table
            var oTable = this.byId("scSummaryVerwenderStep10").getContent()[0];
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        // Pressing on a selected row in table
        onPressSelectVerwenderSummary: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oSelectedItemContext = oSelectedItem.getBindingContext("applicationModel");
            var oSelectedItemData = oSelectedItemContext.getObject();

            // Save selected data to the model
            // this.getView().getModel("applicationModel").setProperty("/Wizard/Step6Verwender", oSelectedItemData);

            this.onCloseSummaryVerwenderDialog();
        },

        onCloseSummaryVerwenderDialog: function () {
            // Setting new user
            this._dialogSummaryVerwender.then(function (oDialog) {
                oDialog.close();
            });
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