(function() {
  'use strict';

  function addTargetBlankToExternalLink() {
    var selector = 'a[href^="http"]';
    var elements = Array.prototype.slice.call(document.querySelectorAll(selector));
    elements.forEach(function(elem) {
      elem.setAttribute('target', '_blank');
    });
  }

  function addBackTocLink() {
    var link = document.createElement('a');
    link.href = '#';
    link.innerHTML = '↑';
    link.className = 'back-toc';

    var selector = 'section h1, section h2';
    var elements = Array.prototype.slice.call(document.querySelectorAll(selector));
    elements.forEach(function(elem) {
      elem.appendChild(link.cloneNode(true));
    });
  }

  function addImagePreview() {
    var selector = 'figure';
    var elements = Array.prototype.slice.call(document.querySelectorAll(selector));
    elements.forEach(function(elem) {
      elem.addEventListener('click', function() {
        if (elem.className === '') {
          elem.className = 'fullscreen';
          elem.title = 'クリックで元に戻す';
        } else {
          elem.className = '';
          elem.title = 'クリックで拡大';
        }
      });
      elem.title = 'クリックで拡大';
      elem.style.cursor = 'pointer';
    });
  }

  function onload() {
    addTargetBlankToExternalLink();
    addBackTocLink();
    addImagePreview();
    window.removeEventListener('load', onload, false);
  }

  window.addEventListener('load', onload, false);

  if (null != window.mermaid) {
    window.mermaid.ganttConfig = {
      barHeight: 20,
    };
    window.mermaid.initialize({
      startOnLoad: true,
    });
  }
})();
