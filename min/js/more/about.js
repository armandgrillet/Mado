/* Copyright (c) 2015 Armand Grillet.
See the license in the "About" section for further information. */
function CloseButtonManager(){this.head=$("head")[0],this.close=$("#window-close"),this.close.on("click",function(){chrome.app.window.current().close()}),this.init()}function Localizer(){this.localizedText=$(".localized"),this.init()}CloseButtonManager.prototype={constructor:CloseButtonManager,init:function(){var a,b=document.createElement("link");b.setAttribute("rel","stylesheet"),b.setAttribute("type","text/css"),a=navigator.appVersion.indexOf("Mac")>-1?"mac":navigator.appVersion.indexOf("Win")>-1?"windows":"chromeos",b.setAttribute("href","../../css/more/more-frame-"+a+".css"),this.close.attr("class","cta little-icon-"+a.substring(0,3)+"-close"),this.head.appendChild(b)}},Localizer.prototype={constructor:Localizer,init:function(){this.localizedText.each(function(){$(this).html(chrome.i18n.getMessage(this.innerHTML))})}},window.onload=function(){new CloseButtonManager,new Localizer};