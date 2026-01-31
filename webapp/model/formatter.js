sap.ui.define([
], () => {
    "use strict";

    return {
        formatStatus: function (Status) {
            if (Status === "PERMANENT") {
                return "Success";
            } else {
                return "Error";
            }
        },
        formatRating: function (Rating) {
            var ratingDesc = "";
            if (Rating === 5) {
                ratingDesc = "(Outstanding)";
            } else if (Rating === 4) {
                ratingDesc = "(Commendable)";
            } else if (Rating === 3) {
                ratingDesc = "(Met Expectation)";
            } else if (Rating === 2) {
                ratingDesc = "(Needs Improvment)";
            } else if (Rating === 1) {
                ratingDesc = "(PIP)";
            }
            return Rating + ratingDesc;
        }

    }


});