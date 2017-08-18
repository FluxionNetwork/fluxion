var ready = ready || (function() {
var lib = {};
var global = this;
var doc = global.document;
var _readyCallbacks = new Array();
function _domReady() {
if (arguments.callee.done) return;
arguments.callee.done = true;
for (var i=0; i<_readyCallbacks.length; i++)
_readyCallbacks[i]();
_readyCallbacks = null;
};
lib.onReady = function(f) {
var domReady = _domReady;
if (domReady.done) return f();
if (doc.addEventListener) {
doc.addEventListener("DOMContentLoaded", domReady, false);
}
else {
}
window.onload = domReady;
_readyCallbacks.push(f);
};
return lib;
})();
