(function flexible(win, doc) {
  var docEl = doc.documentElement;
  var dpr = win.devicePixelRatio || 1;
  // adjust body font size
  function setBodyFontSize() {
    if (doc.readyState == 'complete' || doc.body) {
      doc.body.style.fontSize = (12 * dpr) + 'px';
    } else {
      doc.addEventListener('DOMContentLoaded', setBodyFontSize);
    }
  }
  setBodyFontSize();
  // set 1rem = viewWidth / 10
  function setRemUnit() {
    var rem = docEl.clientWidth / 10;
    docEl.style.fontSize = rem + 'px';
  }
  setRemUnit();
  // reset rem unit on page resize
  win.addEventListener('resize', setRemUnit);
  win.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit();
    }
  })
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
  function setAttr(name, value) {
    if (typeof docEl.setAttribute == 'function') {
      docEl.setAttribute(name, value);
    } else {
      docEl[name] = value;
    }
  }
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
}(window, document));