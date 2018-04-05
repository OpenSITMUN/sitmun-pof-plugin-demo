var DemoWidget = (function ($) {
    "use strict";

    return {

        demo: function(pos) {

            var demo1 = $(
                "<div id=\"change_div\" class=\"alert alert-info\">" +
                "<strong id=\"replace_me\">Touch me!</strong>" +
                "</div>");

            pos.append(demo1)

            $('#change_div')
                .on("click", function () {
                    $.get("/api/demo/hello?name=you", function (data, status) {
                        $('#replace_me').text(data.message);
                        $('#change_div').removeClass("alert-info")
                            .addClass("alert-success");
                    });
                });
        },

        init: function() {
            this.demo($('#toolbar'))
        }

    }
}(jQuery));



jQuery(document).ready(function() {

    DemoWidget.init();

});
