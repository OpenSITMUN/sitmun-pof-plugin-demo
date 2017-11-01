requirejs.config({
    paths: {
        "sitmun-pof-plugin-demo": webjars.path("sitmun-pof-plugin-demo", "js/main"),
    },
    shim: { "sitmun-pof-plugin-demo": [ "jquery" ] }
});
