function minorSpamProtection(){
  var x = document.getElementsByClassName("protectALittle");
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].href = x[i].href.replace(/q/g, '').replace('(at)', '@').replace(/\(dot\)/g, '.');
    if (!x[i].innerHTML || x[i].innerHTML.length === 0) {
      x[i].innerHTML = x[i].href.replace('mailto:', '');
    } else {
      x[i].innerHTML = x[i].innerHTML.replace(/q/g, '');
    }
  }
}

function myOnLoad() {
  minorSpamProtection();
}

if(window.attachEvent) {
    window.attachEvent('onload', myOnLoad);
} else {
    if(window.onload) {
        var curronload = window.onload;
        var newonload = function(evt) {
            curronload(evt);
            myOnLoad(evt);
        };
        window.onload = newonload;
    } else {
        window.onload = myOnLoad;
    }
}
