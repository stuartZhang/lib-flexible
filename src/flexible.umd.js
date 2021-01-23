! function (win, callback) {
  if ('object' == typeof exports && 'object' == typeof module) { // cmd
    module.exports = callback();
  } else if ('function' == typeof define && define.amd) { // amd
    define([], callback);
  } else if ('object' == typeof exports) { // commonjs
    exports.libFlexibleStzhang = callback();
  } else { // script
    win.libFlexibleStzhang = callback();
  }
}(window, function () {
  var win = window;
  var doc = document;
  var lenUnitPattern = /^\s*(\d+(?:\.\d+)?)\s*(%|px)?\s*$/i;
  var docEl = doc.documentElement;
  var dpr = win.devicePixelRatio || 1;
  var onDOMContentLoaded, onResize, onPageshow;
  function setBodyFontSize() { // adjust body font size
    if (doc.readyState == 'complete' || doc.body) {
      doc.body.style.fontSize = (12 * dpr) + 'px';
      onDOMContentLoaded && doc.removeEventListener('DOMContentLoaded', onDOMContentLoaded);
    } else {
      doc.addEventListener('DOMContentLoaded', onDOMContentLoaded = setBodyFontSize);
    }
  }
  function setRemUnit(options) { // set 1rem = ***
    var acceptedWidth = calcAcceptedWidth(options.minWidth, options.maxWidth);
    if (options.diagonal) {
      var acceptedHeight = calcAcceptedHeight(options.minHeight, options.maxHeight);
      var rem = Math.sqrt(Math.pow(acceptedWidth, 2) + Math.pow(acceptedHeight, 2));
    } else {
      var rem = acceptedWidth;
    }
    docEl.style.fontSize = rem / 10 + 'px';
  }
  function calcAcceptedWidth(min, max){
    var acceptedWidth = docEl.clientWidth;
    var match = lenUnitPattern.exec(min);
    if (match) {
      var minWidth = parseFloat(match[0]);
      if (match[1] == '%') {
        minWidth *= .01 * screen.availWidth;
      }
      acceptedWidth = minWidth > acceptedWidth ? minWidth : acceptedWidth;
    }
    match = lenUnitPattern.exec(max);
    if (match) {
      var maxWidth = parseFloat(match[0]);
      if (match[1] == '%') {
        maxWidth *= .01 * screen.availWidth;
      }
      acceptedWidth = maxWidth < acceptedWidth ? maxWidth : acceptedWidth;
    }
    return acceptedWidth;
  }
  function calcAcceptedHeight(min, max){
    var acceptedHeight = docEl.clientHeight;
    var match = lenUnitPattern.exec(min);
    if (match) {
      var minHeight = parseFloat(match[0]);
      if (match[1] == '%') {
        minHeight *= .01 * screen.availHeight;
      }
      acceptedHeight = minHeight > acceptedHeight ? minHeight : acceptedHeight;
    }
    match = lenUnitPattern.exec(max);
    if (match) {
      var maxHeight = parseFloat(match[0]);
      if (match[1] == '%') {
        maxHeight *= .01 * screen.availHeight;
      }
      acceptedHeight = maxHeight < acceptedHeight ? maxHeight : acceptedHeight;
    }
    return acceptedHeight;
  }
  function setAttr(name, value) { // font-size prefers to /* px */
    if (typeof docEl.setAttribute == 'function') {
      docEl.setAttribute(name, value);
    } else {
      docEl[name] = value;
    }
  }
  return function (options) {
    var options = options || {};
    // adjust body font size
    setBodyFontSize();
    // set 1rem = viewWidth / 10
    setRemUnit(options);
    // reset rem unit on page resize
    onResize && win.removeEventListener('resize', onResize);
    win.addEventListener('resize', onResize = function () {
      setRemUnit(options);
    });
    onPageshow && win.removeEventListener('pageshow', onPageshow);
    win.addEventListener('pageshow', onPageshow = function (e) {
      if (e.persisted) {
        setRemUnit(options);
      }
    });
    // detect 0.5px supports
    if (dpr >= 2) {
      var fakeBody = doc.createElement('body');
      var testElement = doc.createElement('div');
      testElement.style.border = '.5px solid transparent';
      fakeBody.appendChild(testElement);
      docEl.appendChild(fakeBody);
      if (testElement.offsetHeight === 1) {
        docEl.className += ' hairlines ';
      }
      docEl.removeChild(fakeBody);
    }
    // font-size prefers to /* px */
    if (dpr >= 3) {
      setAttr('data-dpr', '3');
    } else if (dpr >= 2) {
      setAttr('data-dpr', '2');
    } else {
      setAttr('data-dpr', '1');
    }
    // global auxiliary functions
    win.__rem2px__ = function (d) {
      var val = parseFloat(d) * parseFloat(docEl.style.fontSize);
      if (typeof d == 'string' && d.match(/rem$/)) {
        val += 'px';
      }
      return val;
    }
    win.__px2rem__ = function (d) {
      var val = parseFloat(d) / parseFloat(docEl.style.fontSize);
      if (typeof d == 'string' && d.match(/px$/)) {
        val += 'rem';
      }
      return val;
    }
  };
});
