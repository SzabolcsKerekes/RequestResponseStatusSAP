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
        }
    };
});