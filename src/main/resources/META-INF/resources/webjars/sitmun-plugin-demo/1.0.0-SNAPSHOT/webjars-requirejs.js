requirejs.config({
    paths: {
        "sitmun-plugin-demo": webjars.path("sitmun-plugin-demo", "js/main"),
    },
    shim: { "sitmun-plugin-demo": [ "jquery" ] }
});
