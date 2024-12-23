function prepareLinks() {
  for (var elem of document.getElementsByClassName("hyperlink")) {
    elem.href = elem.href.replace(/q/g, '').replace('(at)', '@').replace(/\(dot\)/g, '.');
    elem.innerHTML = elem.href.replace('mailto:', '');
  }
}

function myOnLoad() {
  prepareLinks();
}

if (window.addEventListener) {
  window.addEventListener('load', myOnLoad);
}
