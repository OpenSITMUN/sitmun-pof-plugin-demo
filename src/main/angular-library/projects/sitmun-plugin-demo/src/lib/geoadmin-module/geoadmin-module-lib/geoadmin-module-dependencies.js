//<!-- Tree angularjs configuration files -->
//<!-- in source, we need to load it here because IE9 ignores it in
//the comments for reasons unknown to me. In prod, it's only
//loaded in IE9 -->
document.write('<script src="geoadmin-module-lib/lib/polyfill.js"></s' + 'cript>');
document.write('<script src="geoadmin-module-lib/lib/IE9Fixes.js"></s' + 'cript>');
document.write('<script>' +
 '\/\/This call only affects browser <= IE9' + 
 'IE9Fix.call(this);' + 
'</' + 'script>');

//<!-- Load jquery before angular for the tree module to work properly
//     Load the rest of the tree geoadmin module scripts here in to
//     avoid getting them loaded more than once
// -->
document.write('<script src="geoadmin-module-lib/lib/jquery.js"></s' + 'cript>');
document.write('<script src="geoadmin-module-lib/lib/jQuery.XDomainRequest.js"></s' + 'cript>');
document.write('<script src="geoadmin-module-lib/lib/slip.js"></s' + 'cript>');

document.write('<script src="geoadmin-module-lib/lib/d3.js"></s' + 'cript>');

document.write('<script src="geoadmin-module-lib/lib/bootstrap.js"></s' + 'cript>');

document.write('<script src="geoadmin-module-lib/lib/typeahead.jquery.js"></s' + 'cript>');
document.write('<script src="geoadmin-module-lib/lib/proj4js-compressed.js"></s' + 'cript>');
document.write('<script src="geoadmin-module-lib/lib/EPSG21781.js"></s' + 'cript>');
document.write('<script src="geoadmin-module-lib/lib/EPSG2056.js"></s' + 'cript>');
document.write('<script src="geoadmin-module-lib/lib/EPSG32631.js"></s' + 'cript>');
document.write('<script src="geoadmin-module-lib/lib/EPSG32632.js"></s' + 'cript>');
document.write('<script src="geoadmin-module-lib/lib/fastclick.js"></s' + 'cript>');
document.write('<script src="geoadmin-module-lib/lib/localforage.js"></s' + 'cript>');
document.write('<script src="geoadmin-module-lib/lib/filesaver.js"></s' + 'cript>');
document.write('<script src="geoadmin-module-lib/lib/moment-with-customlocales.js"></s' + 'cript>');
document.write('<script src="geoadmin-module-lib/lib/gyronorm.complete.js"></s' + 'cript>');