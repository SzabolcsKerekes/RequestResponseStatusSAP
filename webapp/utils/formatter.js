sap.ui.define([], function () {
    "use strict";

    return {
        formatDate: function (sDate) {
            if (!sDate) {
                return "";
            }

            // Extract the timestamp from the string
            var timestamp = parseInt(sDate.replace("/Date(", "").replace(")/", ""), 10);
            
            // Create a new Date object
            var oDate = new Date(timestamp);

            // Format day, month, year
            var day = String(oDate.getDate()).padStart(2, '0');
            var month = String(oDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            var year = oDate.getFullYear();

            return day + "/" + month + "/" + year;
        },

        formatStateBullet1: function(stat, gaekoStatus) {
            if (gaekoStatus === "") {
                if (stat === "IA") {
                    return "Warning"
                } else if (stat === "ZG" || stat === "GE" || stat === "PA") {
                    return "Success"
                } else {
                    return "None"
                }
            } else {
                if (stat === "IA") {
                    return "Error"
                } else if (stat === "ZG" || stat === "GE" || stat === "PA") {
                    return "Success"
                } else {
                    return "None"
                }
            }
        },
        formatStateBullet2: function(stat, gaekoStatus) {
            if (gaekoStatus === "") {
                if (stat === "ZG") {
                    return "Warning"
                } else if (stat === "GE" || stat === "PA") {
                    return "Success"
                } else {
                    return "None"
                }
            } else {
                if (stat === "ZG") {
                    return "Error"
                } else if (stat === "GE" || stat === "PA") {
                    return "Success"
                } else {
                    return "None"
                }
            }
        },
        formatStateBullet3: function(stat, gaekoStatus) {
            if (gaekoStatus === "") {
                if (stat === "PA") {
                    return "Warning"
                } else if (stat === "GE" || stat === "PA") {
                    return "Information"
                } else {
                    return "None"
                }
            } else {
                if (stat === "PA") {
                    return "Error"
                } else if (stat === "GE" || stat === "PA") {
                    return "Information"
                } else {
                    return "None"
                }
            }
        },
        formatStateBullet4: function(stat, gaekoStatus) {
            return (stat === "GE" && gaekoStatus === "") ? "Information" : "None"; 
        },
    };
});