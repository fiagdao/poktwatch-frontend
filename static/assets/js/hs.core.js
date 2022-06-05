;(function($){'use strict';$.HSCore={init:function(){$(document).ready(function(e){$('[data-toggle="tooltip"]').tooltip({trigger:'hover'});$('[data-toggle="popover"]').popover({trigger:'hover'});$.HSCore.helpers.darkMode();$.HSCore.helpers.detectIE();$.HSCore.helpers.bootstrapNavOptions.init();});},components:{},helpers:{Math:{getRandomValueFromRange:function(startPoint,endPoint,fixed){var fixedInner=fixed?fixed:false;Math.random();return fixedInner?(Math.random()*(endPoint-startPoint)+startPoint):(Math.floor(Math.random()*(endPoint-startPoint+1))+startPoint);}},darkMode:function(){$('#darkModaBtn').on('click',function(){$('body').toggleClass('dark-mode');if($('body').hasClass('dark-mode')){writeCookie("displaymode","dark");$('#darkModaBtnIcon').toggleClass('fa-moon fa-sun');$('#logo-header').attr('src','/images/logo-white.svg?v=0.0.3');window.mode='dark';$("iframe").each(function(){var src=$(this).contents().find('body');src.addClass('dark-mode');src.attr('style','background: #11002d !important;');var subIframe=$(this).contents().find('iframe');if(subIframe.length>0){var subIframeBody=$(subIframe).contents().find('body');var style='background: #11002d !important;';subIframeBody.addClass('dark-mode');subIframeBody.attr('style',style);}});$('#dappBody').css('background-image','url("/assets/svg/illustrations/dapp-bg-dark.svg")');}else{writeCookie("displaymode","normal");$('#darkModaBtnIcon').toggleClass('fa-sun fa-moon');$('#logo-header').attr('src','/images/logo.svg?v=0.0.3');window.mode='normal';$("iframe").each(function(){var src=$(this).contents().find('body');src.attr('class','');src.removeAttr("style");var subIframe=$(this).contents().find('iframe');if(subIframe.length>0){var subIframeBody=$(subIframe).contents().find('body');subIframeBody.attr('class','');subIframeBody.removeAttr("style");}});$('#dappBody').css('background-image','url("/assets/svg/illustrations/dapp-bg.svg")');}
if(typeof loaddisqus!=='undefined'&&$.isFunction(loaddisqus)){if(disqusloaded===true){disqusloaded=false;loaddisqus();}}});function writeCookie(key,value,days){var date=new Date();days=days||365;date.setTime(+date+(days*86400000));window.document.cookie=key+"="+value+"; expires="+date.toGMTString()+"; path=/";return value;}},detectIE:function(){var ua=window.navigator.userAgent;var trident=ua.indexOf('Trident/');if(trident>0){var rv=ua.indexOf('rv:');var ieV=parseInt(ua.substring(rv+3,ua.indexOf('.',rv)),10);document.querySelector('body').className+=' IE';}
var edge=ua.indexOf('Edge/');if(edge>0){var ieV=parseInt(ua.substring(edge+5,ua.indexOf('.',edge)),10);document.querySelector('body').className+=' IE';}
return false;},bootstrapNavOptions:{init:function(){this.mobileHideOnScroll();},mobileHideOnScroll:function(){var $collection=$('.navbar');if(!$collection.length)return;var $w=$(window),breakpointsMap={'sm':576,'md':768,'lg':992,'xl':1200};$('body').on('click.HSMobileHideOnScroll','.navbar-toggler',function(e){var $navbar=$(this).closest('.navbar');if($navbar.length){$navbar.data('mobile-menu-scroll-position',$w.scrollTop());}
e.preventDefault();});$w.on('scroll.HSMobileHideOnScroll',function(e){$collection.each(function(i,el){var $this=$(el),$toggler,$nav,offset,$hamburgers,breakpoint;if($this.hasClass('navbar-expand-xl'))breakpoint=breakpointsMap['xl'];else if($this.hasClass('navbar-expand-lg'))breakpoint=breakpointsMap['lg'];else if($this.hasClass('navbar-expand-md'))breakpoint=breakpointsMap['md'];else if($this.hasClass('navbar-expand-xs'))breakpoint=breakpointsMap['xs'];if($w.width()>breakpoint)return;$toggler=$this.find('.navbar-toggler');$nav=$this.find('.navbar-collapse');if(!$nav.data('mobile-scroll-hide'))return;if($nav.length){offset=$this.data('mobile-menu-scroll-position');if(Math.abs($w.scrollTop()-offset)>40&&$nav.hasClass('show')){$toggler.trigger('click');$hamburgers=$toggler.find('.is-active');if($hamburgers.length){$hamburgers.removeClass('is-active');}}}});});}}},settings:{rtl:false}};$.HSCore.init();})(jQuery);