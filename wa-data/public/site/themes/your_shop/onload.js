/* Fancybox */
(function(r,G,f,v){var J=f("html"),n=f(r),p=f(G),b=f.fancybox=function(){b.open.apply(this,arguments)},I=navigator.userAgent.match(/msie/i),B=null,s=G.createTouch!==v,t=function(a){return a&&a.hasOwnProperty&&a instanceof f},q=function(a){return a&&"string"===f.type(a)},E=function(a){return q(a)&&0<a.indexOf("%")},l=function(a,d){var e=parseInt(a,10)||0;d&&E(a)&&(e*=b.getViewport()[d]/100);return Math.ceil(e)},w=function(a,b){return l(a,b)+"px"};f.extend(b,{version:"2.1.5",defaults:{padding:15,margin:20,
width:800,height:600,minWidth:100,minHeight:100,maxWidth:9999,maxHeight:9999,pixelRatio:1,autoSize:!0,autoHeight:!1,autoWidth:!1,autoResize:!0,autoCenter:!s,fitToView:!0,aspectRatio:!1,topRatio:0.5,leftRatio:0.5,scrolling:"auto",wrapCSS:"",arrows:!0,closeBtn:!0,closeClick:!1,nextClick:!1,mouseWheel:!0,autoPlay:!1,playSpeed:3E3,preload:3,modal:!1,loop:!0,ajax:{dataType:"html",headers:{"X-fancyBox":!0}},iframe:{scrolling:"auto",preload:!0},swf:{wmode:"transparent",allowfullscreen:"true",allowscriptaccess:"always"},
keys:{next:{13:"left",34:"up",39:"left",40:"up"},prev:{8:"right",33:"down",37:"right",38:"down"},close:[27],play:[32],toggle:[70]},direction:{next:"left",prev:"right"},scrollOutside:!0,index:0,type:null,href:null,content:null,title:null,tpl:{wrap:'<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',image:'<img class="fancybox-image" src="{href}" alt="" />',iframe:'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen'+
(I?' allowtransparency="true"':"")+"></iframe>",error:'<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',closeBtn:'<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',next:'<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',prev:'<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'},openEffect:"fade",openSpeed:250,openEasing:"swing",openOpacity:!0,
openMethod:"zoomIn",closeEffect:"fade",closeSpeed:250,closeEasing:"swing",closeOpacity:!0,closeMethod:"zoomOut",nextEffect:"elastic",nextSpeed:250,nextEasing:"swing",nextMethod:"changeIn",prevEffect:"elastic",prevSpeed:250,prevEasing:"swing",prevMethod:"changeOut",helpers:{overlay:!0,title:!0},onCancel:f.noop,beforeLoad:f.noop,afterLoad:f.noop,beforeShow:f.noop,afterShow:f.noop,beforeChange:f.noop,beforeClose:f.noop,afterClose:f.noop},group:{},opts:{},previous:null,coming:null,current:null,isActive:!1,
isOpen:!1,isOpened:!1,wrap:null,skin:null,outer:null,inner:null,player:{timer:null,isActive:!1},ajaxLoad:null,imgPreload:null,transitions:{},helpers:{},open:function(a,d){if(a&&(f.isPlainObject(d)||(d={}),!1!==b.close(!0)))return f.isArray(a)||(a=t(a)?f(a).get():[a]),f.each(a,function(e,c){var k={},g,h,j,m,l;"object"===f.type(c)&&(c.nodeType&&(c=f(c)),t(c)?(k={href:c.data("fancybox-href")||c.attr("href"),title:c.data("fancybox-title")||c.attr("title"),isDom:!0,element:c},f.metadata&&f.extend(!0,k,
c.metadata())):k=c);g=d.href||k.href||(q(c)?c:null);h=d.title!==v?d.title:k.title||"";m=(j=d.content||k.content)?"html":d.type||k.type;!m&&k.isDom&&(m=c.data("fancybox-type"),m||(m=(m=c.prop("class").match(/fancybox\.(\w+)/))?m[1]:null));q(g)&&(m||(b.isImage(g)?m="image":b.isSWF(g)?m="swf":"#"===g.charAt(0)?m="inline":q(c)&&(m="html",j=c)),"ajax"===m&&(l=g.split(/\s+/,2),g=l.shift(),l=l.shift()));j||("inline"===m?g?j=f(q(g)?g.replace(/.*(?=#[^\s]+$)/,""):g):k.isDom&&(j=c):"html"===m?j=g:!m&&(!g&&
k.isDom)&&(m="inline",j=c));f.extend(k,{href:g,type:m,content:j,title:h,selector:l});a[e]=k}),b.opts=f.extend(!0,{},b.defaults,d),d.keys!==v&&(b.opts.keys=d.keys?f.extend({},b.defaults.keys,d.keys):!1),b.group=a,b._start(b.opts.index)},cancel:function(){var a=b.coming;a&&!1!==b.trigger("onCancel")&&(b.hideLoading(),b.ajaxLoad&&b.ajaxLoad.abort(),b.ajaxLoad=null,b.imgPreload&&(b.imgPreload.onload=b.imgPreload.onerror=null),a.wrap&&a.wrap.stop(!0,!0).trigger("onReset").remove(),b.coming=null,b.current||
b._afterZoomOut(a))},close:function(a){b.cancel();!1!==b.trigger("beforeClose")&&(b.unbindEvents(),b.isActive&&(!b.isOpen||!0===a?(f(".fancybox-wrap").stop(!0).trigger("onReset").remove(),b._afterZoomOut()):(b.isOpen=b.isOpened=!1,b.isClosing=!0,f(".fancybox-item, .fancybox-nav").remove(),b.wrap.stop(!0,!0).removeClass("fancybox-opened"),b.transitions[b.current.closeMethod]())))},play:function(a){var d=function(){clearTimeout(b.player.timer)},e=function(){d();b.current&&b.player.isActive&&(b.player.timer=
setTimeout(b.next,b.current.playSpeed))},c=function(){d();p.unbind(".player");b.player.isActive=!1;b.trigger("onPlayEnd")};if(!0===a||!b.player.isActive&&!1!==a){if(b.current&&(b.current.loop||b.current.index<b.group.length-1))b.player.isActive=!0,p.bind({"onCancel.player beforeClose.player":c,"onUpdate.player":e,"beforeLoad.player":d}),e(),b.trigger("onPlayStart")}else c()},next:function(a){var d=b.current;d&&(q(a)||(a=d.direction.next),b.jumpto(d.index+1,a,"next"))},prev:function(a){var d=b.current;
d&&(q(a)||(a=d.direction.prev),b.jumpto(d.index-1,a,"prev"))},jumpto:function(a,d,e){var c=b.current;c&&(a=l(a),b.direction=d||c.direction[a>=c.index?"next":"prev"],b.router=e||"jumpto",c.loop&&(0>a&&(a=c.group.length+a%c.group.length),a%=c.group.length),c.group[a]!==v&&(b.cancel(),b._start(a)))},reposition:function(a,d){var e=b.current,c=e?e.wrap:null,k;c&&(k=b._getPosition(d),a&&"scroll"===a.type?(delete k.position,c.stop(!0,!0).animate(k,200)):(c.css(k),e.pos=f.extend({},e.dim,k)))},update:function(a){var d=
a&&a.type,e=!d||"orientationchange"===d;e&&(clearTimeout(B),B=null);b.isOpen&&!B&&(B=setTimeout(function(){var c=b.current;c&&!b.isClosing&&(b.wrap.removeClass("fancybox-tmp"),(e||"load"===d||"resize"===d&&c.autoResize)&&b._setDimension(),"scroll"===d&&c.canShrink||b.reposition(a),b.trigger("onUpdate"),B=null)},e&&!s?0:300))},toggle:function(a){b.isOpen&&(b.current.fitToView="boolean"===f.type(a)?a:!b.current.fitToView,s&&(b.wrap.removeAttr("style").addClass("fancybox-tmp"),b.trigger("onUpdate")),
b.update())},hideLoading:function(){p.unbind(".loading");f("#fancybox-loading").remove()},showLoading:function(){var a,d;b.hideLoading();a=f('<div id="fancybox-loading"><div></div></div>').click(b.cancel).appendTo("body");p.bind("keydown.loading",function(a){if(27===(a.which||a.keyCode))a.preventDefault(),b.cancel()});b.defaults.fixed||(d=b.getViewport(),a.css({position:"absolute",top:0.5*d.h+d.y,left:0.5*d.w+d.x}))},getViewport:function(){var a=b.current&&b.current.locked||!1,d={x:n.scrollLeft(),
y:n.scrollTop()};a?(d.w=a[0].clientWidth,d.h=a[0].clientHeight):(d.w=s&&r.innerWidth?r.innerWidth:n.width(),d.h=s&&r.innerHeight?r.innerHeight:n.height());return d},unbindEvents:function(){b.wrap&&t(b.wrap)&&b.wrap.unbind(".fb");p.unbind(".fb");n.unbind(".fb")},bindEvents:function(){var a=b.current,d;a&&(n.bind("orientationchange.fb"+(s?"":" resize.fb")+(a.autoCenter&&!a.locked?" scroll.fb":""),b.update),(d=a.keys)&&p.bind("keydown.fb",function(e){var c=e.which||e.keyCode,k=e.target||e.srcElement;
if(27===c&&b.coming)return!1;!e.ctrlKey&&(!e.altKey&&!e.shiftKey&&!e.metaKey&&(!k||!k.type&&!f(k).is("[contenteditable]")))&&f.each(d,function(d,k){if(1<a.group.length&&k[c]!==v)return b[d](k[c]),e.preventDefault(),!1;if(-1<f.inArray(c,k))return b[d](),e.preventDefault(),!1})}),f.fn.mousewheel&&a.mouseWheel&&b.wrap.bind("mousewheel.fb",function(d,c,k,g){for(var h=f(d.target||null),j=!1;h.length&&!j&&!h.is(".fancybox-skin")&&!h.is(".fancybox-wrap");)j=h[0]&&!(h[0].style.overflow&&"hidden"===h[0].style.overflow)&&
(h[0].clientWidth&&h[0].scrollWidth>h[0].clientWidth||h[0].clientHeight&&h[0].scrollHeight>h[0].clientHeight),h=f(h).parent();if(0!==c&&!j&&1<b.group.length&&!a.canShrink){if(0<g||0<k)b.prev(0<g?"down":"left");else if(0>g||0>k)b.next(0>g?"up":"right");d.preventDefault()}}))},trigger:function(a,d){var e,c=d||b.coming||b.current;if(c){f.isFunction(c[a])&&(e=c[a].apply(c,Array.prototype.slice.call(arguments,1)));if(!1===e)return!1;c.helpers&&f.each(c.helpers,function(d,e){if(e&&b.helpers[d]&&f.isFunction(b.helpers[d][a]))b.helpers[d][a](f.extend(!0,
{},b.helpers[d].defaults,e),c)});p.trigger(a)}},isImage:function(a){return q(a)&&a.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i)},isSWF:function(a){return q(a)&&a.match(/\.(swf)((\?|#).*)?$/i)},_start:function(a){var d={},e,c;a=l(a);e=b.group[a]||null;if(!e)return!1;d=f.extend(!0,{},b.opts,e);e=d.margin;c=d.padding;"number"===f.type(e)&&(d.margin=[e,e,e,e]);"number"===f.type(c)&&(d.padding=[c,c,c,c]);d.modal&&f.extend(!0,d,{closeBtn:!1,closeClick:!1,nextClick:!1,arrows:!1,
mouseWheel:!1,keys:null,helpers:{overlay:{closeClick:!1}}});d.autoSize&&(d.autoWidth=d.autoHeight=!0);"auto"===d.width&&(d.autoWidth=!0);"auto"===d.height&&(d.autoHeight=!0);d.group=b.group;d.index=a;b.coming=d;if(!1===b.trigger("beforeLoad"))b.coming=null;else{c=d.type;e=d.href;if(!c)return b.coming=null,b.current&&b.router&&"jumpto"!==b.router?(b.current.index=a,b[b.router](b.direction)):!1;b.isActive=!0;if("image"===c||"swf"===c)d.autoHeight=d.autoWidth=!1,d.scrolling="visible";"image"===c&&(d.aspectRatio=
!0);"iframe"===c&&s&&(d.scrolling="scroll");d.wrap=f(d.tpl.wrap).addClass("fancybox-"+(s?"mobile":"desktop")+" fancybox-type-"+c+" fancybox-tmp "+d.wrapCSS).appendTo(d.parent||"body");f.extend(d,{skin:f(".fancybox-skin",d.wrap),outer:f(".fancybox-outer",d.wrap),inner:f(".fancybox-inner",d.wrap)});f.each(["Top","Right","Bottom","Left"],function(a,b){d.skin.css("padding"+b,w(d.padding[a]))});b.trigger("onReady");if("inline"===c||"html"===c){if(!d.content||!d.content.length)return b._error("content")}else if(!e)return b._error("href");
"image"===c?b._loadImage():"ajax"===c?b._loadAjax():"iframe"===c?b._loadIframe():b._afterLoad()}},_error:function(a){f.extend(b.coming,{type:"html",autoWidth:!0,autoHeight:!0,minWidth:0,minHeight:0,scrolling:"no",hasError:a,content:b.coming.tpl.error});b._afterLoad()},_loadImage:function(){var a=b.imgPreload=new Image;a.onload=function(){this.onload=this.onerror=null;b.coming.width=this.width/b.opts.pixelRatio;b.coming.height=this.height/b.opts.pixelRatio;b._afterLoad()};a.onerror=function(){this.onload=
this.onerror=null;b._error("image")};a.src=b.coming.href;!0!==a.complete&&b.showLoading()},_loadAjax:function(){var a=b.coming;b.showLoading();b.ajaxLoad=f.ajax(f.extend({},a.ajax,{url:a.href,error:function(a,e){b.coming&&"abort"!==e?b._error("ajax",a):b.hideLoading()},success:function(d,e){"success"===e&&(a.content=d,b._afterLoad())}}))},_loadIframe:function(){var a=b.coming,d=f(a.tpl.iframe.replace(/\{rnd\}/g,(new Date).getTime())).attr("scrolling",s?"auto":a.iframe.scrolling).attr("src",a.href);
f(a.wrap).bind("onReset",function(){try{f(this).find("iframe").hide().attr("src","//about:blank").end().empty()}catch(a){}});a.iframe.preload&&(b.showLoading(),d.one("load",function(){f(this).data("ready",1);s||f(this).bind("load.fb",b.update);f(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();b._afterLoad()}));a.content=d.appendTo(a.inner);a.iframe.preload||b._afterLoad()},_preloadImages:function(){var a=b.group,d=b.current,e=a.length,c=d.preload?Math.min(d.preload,
e-1):0,f,g;for(g=1;g<=c;g+=1)f=a[(d.index+g)%e],"image"===f.type&&f.href&&((new Image).src=f.href)},_afterLoad:function(){var a=b.coming,d=b.current,e,c,k,g,h;b.hideLoading();if(a&&!1!==b.isActive)if(!1===b.trigger("afterLoad",a,d))a.wrap.stop(!0).trigger("onReset").remove(),b.coming=null;else{d&&(b.trigger("beforeChange",d),d.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove());b.unbindEvents();e=a.content;c=a.type;k=a.scrolling;f.extend(b,{wrap:a.wrap,skin:a.skin,
outer:a.outer,inner:a.inner,current:a,previous:d});g=a.href;switch(c){case "inline":case "ajax":case "html":a.selector?e=f("<div>").html(e).find(a.selector):t(e)&&(e.data("fancybox-placeholder")||e.data("fancybox-placeholder",f('<div class="fancybox-placeholder"></div>').insertAfter(e).hide()),e=e.show().detach(),a.wrap.bind("onReset",function(){f(this).find(e).length&&e.hide().replaceAll(e.data("fancybox-placeholder")).data("fancybox-placeholder",!1)}));break;case "image":e=a.tpl.image.replace("{href}",
g);break;case "swf":e='<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="'+g+'"></param>',h="",f.each(a.swf,function(a,b){e+='<param name="'+a+'" value="'+b+'"></param>';h+=" "+a+'="'+b+'"'}),e+='<embed src="'+g+'" type="application/x-shockwave-flash" width="100%" height="100%"'+h+"></embed></object>"}(!t(e)||!e.parent().is(a.inner))&&a.inner.append(e);b.trigger("beforeShow");a.inner.css("overflow","yes"===k?"scroll":
"no"===k?"hidden":k);b._setDimension();b.reposition();b.isOpen=!1;b.coming=null;b.bindEvents();if(b.isOpened){if(d.prevMethod)b.transitions[d.prevMethod]()}else f(".fancybox-wrap").not(a.wrap).stop(!0).trigger("onReset").remove();b.transitions[b.isOpened?a.nextMethod:a.openMethod]();b._preloadImages()}},_setDimension:function(){var a=b.getViewport(),d=0,e=!1,c=!1,e=b.wrap,k=b.skin,g=b.inner,h=b.current,c=h.width,j=h.height,m=h.minWidth,u=h.minHeight,n=h.maxWidth,p=h.maxHeight,s=h.scrolling,q=h.scrollOutside?
h.scrollbarWidth:0,x=h.margin,y=l(x[1]+x[3]),r=l(x[0]+x[2]),v,z,t,C,A,F,B,D,H;e.add(k).add(g).width("auto").height("auto").removeClass("fancybox-tmp");x=l(k.outerWidth(!0)-k.width());v=l(k.outerHeight(!0)-k.height());z=y+x;t=r+v;C=E(c)?(a.w-z)*l(c)/100:c;A=E(j)?(a.h-t)*l(j)/100:j;if("iframe"===h.type){if(H=h.content,h.autoHeight&&1===H.data("ready"))try{H[0].contentWindow.document.location&&(g.width(C).height(9999),F=H.contents().find("body"),q&&F.css("overflow-x","hidden"),A=F.outerHeight(!0))}catch(G){}}else if(h.autoWidth||
h.autoHeight)g.addClass("fancybox-tmp"),h.autoWidth||g.width(C),h.autoHeight||g.height(A),h.autoWidth&&(C=g.width()),h.autoHeight&&(A=g.height()),g.removeClass("fancybox-tmp");c=l(C);j=l(A);D=C/A;m=l(E(m)?l(m,"w")-z:m);n=l(E(n)?l(n,"w")-z:n);u=l(E(u)?l(u,"h")-t:u);p=l(E(p)?l(p,"h")-t:p);F=n;B=p;h.fitToView&&(n=Math.min(a.w-z,n),p=Math.min(a.h-t,p));z=a.w-y;r=a.h-r;h.aspectRatio?(c>n&&(c=n,j=l(c/D)),j>p&&(j=p,c=l(j*D)),c<m&&(c=m,j=l(c/D)),j<u&&(j=u,c=l(j*D))):(c=Math.max(m,Math.min(c,n)),h.autoHeight&&
"iframe"!==h.type&&(g.width(c),j=g.height()),j=Math.max(u,Math.min(j,p)));if(h.fitToView)if(g.width(c).height(j),e.width(c+x),a=e.width(),y=e.height(),h.aspectRatio)for(;(a>z||y>r)&&(c>m&&j>u)&&!(19<d++);)j=Math.max(u,Math.min(p,j-10)),c=l(j*D),c<m&&(c=m,j=l(c/D)),c>n&&(c=n,j=l(c/D)),g.width(c).height(j),e.width(c+x),a=e.width(),y=e.height();else c=Math.max(m,Math.min(c,c-(a-z))),j=Math.max(u,Math.min(j,j-(y-r)));q&&("auto"===s&&j<A&&c+x+q<z)&&(c+=q);g.width(c).height(j);e.width(c+x);a=e.width();
y=e.height();e=(a>z||y>r)&&c>m&&j>u;c=h.aspectRatio?c<F&&j<B&&c<C&&j<A:(c<F||j<B)&&(c<C||j<A);f.extend(h,{dim:{width:w(a),height:w(y)},origWidth:C,origHeight:A,canShrink:e,canExpand:c,wPadding:x,hPadding:v,wrapSpace:y-k.outerHeight(!0),skinSpace:k.height()-j});!H&&(h.autoHeight&&j>u&&j<p&&!c)&&g.height("auto")},_getPosition:function(a){var d=b.current,e=b.getViewport(),c=d.margin,f=b.wrap.width()+c[1]+c[3],g=b.wrap.height()+c[0]+c[2],c={position:"absolute",top:c[0],left:c[3]};d.autoCenter&&d.fixed&&
!a&&g<=e.h&&f<=e.w?c.position="fixed":d.locked||(c.top+=e.y,c.left+=e.x);c.top=w(Math.max(c.top,c.top+(e.h-g)*d.topRatio));c.left=w(Math.max(c.left,c.left+(e.w-f)*d.leftRatio));return c},_afterZoomIn:function(){var a=b.current;a&&(b.isOpen=b.isOpened=!0,b.wrap.css("overflow","visible").addClass("fancybox-opened"),b.update(),(a.closeClick||a.nextClick&&1<b.group.length)&&b.inner.css("cursor","pointer").bind("click.fb",function(d){!f(d.target).is("a")&&!f(d.target).parent().is("a")&&(d.preventDefault(),
b[a.closeClick?"close":"next"]())}),a.closeBtn&&f(a.tpl.closeBtn).appendTo(b.skin).bind("click.fb",function(a){a.preventDefault();b.close()}),a.arrows&&1<b.group.length&&((a.loop||0<a.index)&&f(a.tpl.prev).appendTo(b.outer).bind("click.fb",b.prev),(a.loop||a.index<b.group.length-1)&&f(a.tpl.next).appendTo(b.outer).bind("click.fb",b.next)),b.trigger("afterShow"),!a.loop&&a.index===a.group.length-1?b.play(!1):b.opts.autoPlay&&!b.player.isActive&&(b.opts.autoPlay=!1,b.play()))},_afterZoomOut:function(a){a=
a||b.current;f(".fancybox-wrap").trigger("onReset").remove();f.extend(b,{group:{},opts:{},router:!1,current:null,isActive:!1,isOpened:!1,isOpen:!1,isClosing:!1,wrap:null,skin:null,outer:null,inner:null});b.trigger("afterClose",a)}});b.transitions={getOrigPosition:function(){var a=b.current,d=a.element,e=a.orig,c={},f=50,g=50,h=a.hPadding,j=a.wPadding,m=b.getViewport();!e&&(a.isDom&&d.is(":visible"))&&(e=d.find("img:first"),e.length||(e=d));t(e)?(c=e.offset(),e.is("img")&&(f=e.outerWidth(),g=e.outerHeight())):
(c.top=m.y+(m.h-g)*a.topRatio,c.left=m.x+(m.w-f)*a.leftRatio);if("fixed"===b.wrap.css("position")||a.locked)c.top-=m.y,c.left-=m.x;return c={top:w(c.top-h*a.topRatio),left:w(c.left-j*a.leftRatio),width:w(f+j),height:w(g+h)}},step:function(a,d){var e,c,f=d.prop;c=b.current;var g=c.wrapSpace,h=c.skinSpace;if("width"===f||"height"===f)e=d.end===d.start?1:(a-d.start)/(d.end-d.start),b.isClosing&&(e=1-e),c="width"===f?c.wPadding:c.hPadding,c=a-c,b.skin[f](l("width"===f?c:c-g*e)),b.inner[f](l("width"===
f?c:c-g*e-h*e))},zoomIn:function(){var a=b.current,d=a.pos,e=a.openEffect,c="elastic"===e,k=f.extend({opacity:1},d);delete k.position;c?(d=this.getOrigPosition(),a.openOpacity&&(d.opacity=0.1)):"fade"===e&&(d.opacity=0.1);b.wrap.css(d).animate(k,{duration:"none"===e?0:a.openSpeed,easing:a.openEasing,step:c?this.step:null,complete:b._afterZoomIn})},zoomOut:function(){var a=b.current,d=a.closeEffect,e="elastic"===d,c={opacity:0.1};e&&(c=this.getOrigPosition(),a.closeOpacity&&(c.opacity=0.1));b.wrap.animate(c,
{duration:"none"===d?0:a.closeSpeed,easing:a.closeEasing,step:e?this.step:null,complete:b._afterZoomOut})},changeIn:function(){var a=b.current,d=a.nextEffect,e=a.pos,c={opacity:1},f=b.direction,g;e.opacity=0.1;"elastic"===d&&(g="down"===f||"up"===f?"top":"left","down"===f||"right"===f?(e[g]=w(l(e[g])-200),c[g]="+=200px"):(e[g]=w(l(e[g])+200),c[g]="-=200px"));"none"===d?b._afterZoomIn():b.wrap.css(e).animate(c,{duration:a.nextSpeed,easing:a.nextEasing,complete:b._afterZoomIn})},changeOut:function(){var a=
b.previous,d=a.prevEffect,e={opacity:0.1},c=b.direction;"elastic"===d&&(e["down"===c||"up"===c?"top":"left"]=("up"===c||"left"===c?"-":"+")+"=200px");a.wrap.animate(e,{duration:"none"===d?0:a.prevSpeed,easing:a.prevEasing,complete:function(){f(this).trigger("onReset").remove()}})}};b.helpers.overlay={defaults:{closeClick:!0,speedOut:200,showEarly:!0,css:{},locked:!s,fixed:!0},overlay:null,fixed:!1,el:f("html"),create:function(a){a=f.extend({},this.defaults,a);this.overlay&&this.close();this.overlay=
f('<div class="fancybox-overlay"></div>').appendTo(b.coming?b.coming.parent:a.parent);this.fixed=!1;a.fixed&&b.defaults.fixed&&(this.overlay.addClass("fancybox-overlay-fixed"),this.fixed=!0)},open:function(a){var d=this;a=f.extend({},this.defaults,a);this.overlay?this.overlay.unbind(".overlay").width("auto").height("auto"):this.create(a);this.fixed||(n.bind("resize.overlay",f.proxy(this.update,this)),this.update());a.closeClick&&this.overlay.bind("click.overlay",function(a){if(f(a.target).hasClass("fancybox-overlay"))return b.isActive?
b.close():d.close(),!1});this.overlay.css(a.css).show()},close:function(){var a,b;n.unbind("resize.overlay");this.el.hasClass("fancybox-lock")&&(f(".fancybox-margin").removeClass("fancybox-margin"),a=n.scrollTop(),b=n.scrollLeft(),this.el.removeClass("fancybox-lock"),n.scrollTop(a).scrollLeft(b));f(".fancybox-overlay").remove().hide();f.extend(this,{overlay:null,fixed:!1})},update:function(){var a="100%",b;this.overlay.width(a).height("100%");I?(b=Math.max(G.documentElement.offsetWidth,G.body.offsetWidth),
p.width()>b&&(a=p.width())):p.width()>n.width()&&(a=p.width());this.overlay.width(a).height(p.height())},onReady:function(a,b){var e=this.overlay;f(".fancybox-overlay").stop(!0,!0);e||this.create(a);a.locked&&(this.fixed&&b.fixed)&&(e||(this.margin=p.height()>n.height()?f("html").css("margin-right").replace("px",""):!1),b.locked=this.overlay.append(b.wrap),b.fixed=!1);!0===a.showEarly&&this.beforeShow.apply(this,arguments)},beforeShow:function(a,b){var e,c;b.locked&&(!1!==this.margin&&(f("*").filter(function(){return"fixed"===
f(this).css("position")&&!f(this).hasClass("fancybox-overlay")&&!f(this).hasClass("fancybox-wrap")}).addClass("fancybox-margin"),this.el.addClass("fancybox-margin")),e=n.scrollTop(),c=n.scrollLeft(),this.el.addClass("fancybox-lock"),n.scrollTop(e).scrollLeft(c));this.open(a)},onUpdate:function(){this.fixed||this.update()},afterClose:function(a){this.overlay&&!b.coming&&this.overlay.fadeOut(a.speedOut,f.proxy(this.close,this))}};b.helpers.title={defaults:{type:"float",position:"bottom"},beforeShow:function(a){var d=
b.current,e=d.title,c=a.type;f.isFunction(e)&&(e=e.call(d.element,d));if(q(e)&&""!==f.trim(e)){d=f('<div class="fancybox-title fancybox-title-'+c+'-wrap">'+e+"</div>");switch(c){case "inside":c=b.skin;break;case "outside":c=b.wrap;break;case "over":c=b.inner;break;default:c=b.skin,d.appendTo("body"),I&&d.width(d.width()),d.wrapInner('<span class="child"></span>'),b.current.margin[2]+=Math.abs(l(d.css("margin-bottom")))}d["top"===a.position?"prependTo":"appendTo"](c)}}};f.fn.fancybox=function(a){var d,
e=f(this),c=this.selector||"",k=function(g){var h=f(this).blur(),j=d,k,l;!g.ctrlKey&&(!g.altKey&&!g.shiftKey&&!g.metaKey)&&!h.is(".fancybox-wrap")&&(k=a.groupAttr||"data-fancybox-group",l=h.attr(k),l||(k="rel",l=h.get(0)[k]),l&&(""!==l&&"nofollow"!==l)&&(h=c.length?f(c):e,h=h.filter("["+k+'="'+l+'"]'),j=h.index(this)),a.index=j,!1!==b.open(h,a)&&g.preventDefault())};a=a||{};d=a.index||0;!c||!1===a.live?e.unbind("click.fb-start").bind("click.fb-start",k):p.undelegate(c,"click.fb-start").delegate(c+
":not('.fancybox-item, .fancybox-nav')","click.fb-start",k);this.filter("[data-fancybox-start=1]").trigger("click");return this};p.ready(function(){var a,d;f.scrollbarWidth===v&&(f.scrollbarWidth=function(){var a=f('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),b=a.children(),b=b.innerWidth()-b.height(99).innerWidth();a.remove();return b});if(f.support.fixedPosition===v){a=f.support;d=f('<div style="position:fixed;top:20px;"></div>').appendTo("body");var e=20===
d[0].offsetTop||15===d[0].offsetTop;d.remove();a.fixedPosition=e}f.extend(b.defaults,{scrollbarWidth:f.scrollbarWidth(),fixed:f.support.fixedPosition,parent:f("body")});a=f(r).width();J.addClass("fancybox-lock-test");d=f(r).width();J.removeClass("fancybox-lock-test");f("<style type='text/css'>.fancybox-margin{margin-right:"+(d-a)+"px;}</style>").appendTo("head")})})(window,document,jQuery);
/*Custom js*/
$(".search > .search-button").click(function(){var e=$(this),t=e.parent().find("form");t.hasClass("hidden-search")?e.hasClass("open")?""!==$.trim(t.find(".search-input-field").val())?t.submit():(t.slideUp("fast"),e.removeClass("open active").find("i").removeClass("active")):(t.slideDown("fast"),e.addClass("open active").find("i").addClass("active"),$(".search-input-field",t).focus()):t.submit()}),$(".mobile .has-popup > a, .mobile .has-popup-mobile > a").click(function(){if("cart"==$(this).parent().attr("id"))var e=$(".fly-cart");else var e=$(this).closest("li").find(".fly-form");return $(".fly-cart, .fly-form").not(e).hide(),e.length?(e.is(":visible")?e.fadeOut():e.fadeIn(),!1):void 0}),$(".first.category-list > a").click(function(){var e=$(this),t=e.next(),o=e.find("i");return t.is(":visible")?(t.slideUp(),o.removeClass("fa-chevron-up").addClass("fa-chevron-down"),e.parent().removeClass("open")):(t.slideDown(),o.removeClass("fa-chevron-down").addClass("fa-chevron-up"),e.parent().addClass("open")),!1}),$(document).on("mouseenter","#horizontal-menu .brands-tab",function(){var e=$(this),t=e.find("ul.brands"),o=$(".wrap"),a=e.offset().left,s=t.width(),i=o.width();a-o.offset().left+s>i&&t.css("left",-1*(s-i-o.offset().left+a))}),$(document).on("click",".collapsible-icon",function(){var e=$(this),t=e.closest("li").children("ul");t.hasClass("hidden")||!t.is(":visible")?(e.removeClass("fa-plus").addClass("fa-minus"),t.slideDown("700",function(){$(this).removeClass("hidden").addClass("show").removeAttr("style")})):(e.removeClass("fa-minus").addClass("fa-plus"),t.slideUp("700",function(){$(this).addClass("hidden").removeClass("show").removeAttr("style")}));var o=e.attr("title"),a=e.attr("data-toggle");return e.attr("title",a).attr("data-toggle",o),!1});var positionMenu=function(e,t){var o=e.offset();o.left-t.offset().left+e.find("a").outerWidth()>t.width()?e.css("left","-100%"):(o.left<0||o.left<t.offset().left)&&e.css("left","100%")};$(document).on("mouseenter",".categories-block li.dropdown-menu, .pages-block > ul li, .categories-tree li.dropdown-menu",function(){var e=$(this).find("ul");e.length&&(1==$.browser.msie?setTimeout(function(){positionMenu(e,$(".wrap"))},5):positionMenu(e,$(".wrap")))}),$(document).on("mouseenter",".categories-list > li:last",function(){var e=$(this).children(".dropdown");if(e.length){var t=$(".wrap");e.offset().left-t.offset().left+e.find("a").outerWidth()>t.width()&&e.css({left:"inherit",right:0})}}),$(document).on("click",".dropdown.vertical i, .f-collapsible",function(){var e=$(this),t=e.parent();if(t.parent().hasClass("category-heading"))var o=t.parent().next();else var o=t.next();var a=e.attr("title"),s=e.attr("data-toggle");return o.is(":visible")?(o.slideUp("fast"),e.hasClass("f-collapsible")?e.removeClass("fa-minus").addClass("fa-plus"):e.removeClass("fa-chevron-up").addClass("fa-chevron-down")):(o.slideDown("fast"),e.hasClass("f-collapsible")?e.removeClass("fa-plus").addClass("fa-minus"):e.removeClass("fa-chevron-down").addClass("fa-chevron-up")),e.attr("data-title",a).attr("title",s),!1}),$(document).on("click",".fly-auth, .dialog.auth-dial .wa-submit a",function(){var e=$(this);return openDialog(function(t){$.yourshop.xhr.push($.get(e.attr("href"),function(o){var a=$(o).find(".yourshop-form.auth-form");a.find("form").attr("action",e.attr("href"));var s=a.find(".wa-recaptcha");s.length&&s.closest(".wa-value").removeClass(),t.removeClass("is-loading").addClass("auth-dial").find(".temp-loader").remove(),t.find(".content").removeClass("align-center").append(a)},"html"))}),!1}),$(document).on("click",".dialog.auth-dial .wa-submit :submit",function(){var e=$(this),t=e.closest(".dialog"),o=t.find("form"),a=o.attr("action"),s=o.serializeArray();return openDialog(function(e){$.post(a,s,function(t){var o=$(t).find(".yourshop-form.auth-form");o.length?(o.find(".success-signed").length?(o.find(".success-signed").append("<i class='icon16 loading'></i>"),location.reload()):o.find("form").attr("action",a),e.removeClass("is-loading").find(".temp-loader").remove(),e.find(".content").removeClass("align-center").append(o)):location.reload()},"html")}),!1}),$('input[type="text"], input[type="password"], textarea, select').focus(function(){var e=$(this);e.hasClass("on-focus")||$(this).addClass("on-focus"),e.removeClass("s-error wa-error")}).blur(function(){$(this).removeClass("on-focus")}).placeholder(),$(".not-mobile .categories-tree li.appear-menu").hover(function(){$(".categories-tree .dropdown-holder").hide();var e=$(this),t=e.find(".dropdown-holder");return t.length?(clearTimeout(t.data("timer")),t.is(":animated")?!1:void t.show()):!1},function(){var e=$(this).find(".dropdown-holder");e.data("timer",setTimeout(function(){e.hide()},500))}),$(".not-mobile .has-popup").hover(function(){var e=$(this);if("cart"==e.attr("id")&&!e.hasClass("has-items"))return!1;var t=e.find(".fly-cart, .fly-form");return $(".not-mobile .has-popup").find(".fly-cart, .fly-form").not(t).hide(),clearTimeout(t.data("timer")),t.is(":animated")?!1:void t.fadeIn()},function(){var e=$(this).find(".fly-cart, .fly-form");e.data("timer",setTimeout(function(){e.fadeOut()},800))}),$(window).scroll(function(){var e=$("#go-top");$(this).scrollTop()>200?e.fadeIn():e.fadeOut()}),$("#go-top a").click(function(){return $("html, body").animate({scrollTop:0},800),!1});var closeDialog=function(e){if($("body").removeClass("dialog-open"),e.removeClass("quick-view-dial auth-dial demo-dial is-loading").hide().find(".content").empty(),$.yourshop.xhr.length)for(var t in $.yourshop.xhr)$.yourshop.xhr[t].abort()};$(document).keyup(function(e){27==e.keyCode&&closeDialog($(".dialog:visible"))}),$(".dialog-window").click(function(e){$(e.target).closest(".content").length||$(".dialog-close").click()}),$(".dialog").on("click","a.dialog-close",function(){return closeDialog($(this).closest(".dialog")),!1}),$(".subscribe-block-heading").click(function(){if("block"==$(".subscribe-block").css("display")){var e=$(this),t=e.next(".inputs");t.is(":visible")?t.slideUp():t.slideDown()}}),$(".header-menu-block > a").click(function(){var e=$(this).closest("li"),t=e.siblings(":visible").not(".mobile-block"),o=e.siblings(":hidden");t.length?t.fadeOut(function(){$(this).addClass("hidden").removeAttr("style"),o.fadeIn()}):o.fadeIn()}),$(".f-open-sidebar").click(function(){var e=$(this),t=$(".category-sidebar, .has-mobile-sidebar .sidebar");e.hasClass("opened")?t.animate({left:t.hasClass("fb-page")?"-315px":"-250px"},500,function(){e.removeClass("opened").find("i").removeClass("fa-angle-double-left").addClass("fa-angle-double-right")}):t.animate({left:0},500,function(){e.addClass("opened").find("i").removeClass("fa-angle-double-right").addClass("fa-angle-double-left")})}),$(".mobile-menu").click(function(){var e=$(".mobile-categories-block");e.is(":visible")?(e.slideUp(function(){$(this).addClass("hidden").removeClass("show").removeAttr("style")}),$(this).removeClass("selected")):(e.slideDown(function(){$(this).removeClass("hidden").addClass("show").removeAttr("style")}),$(this).addClass("selected"))}),$(".mobile-close").click(function(){$(this).closest(".dropdown, .dropdown-holder").hide()}),$(".mobile .pages-block ul.menu-h > li > a").click(function(){var e=$(this).next(".dropdown");return e.length&&!e.is(":visible")?(e.show(),!1):void 0}),$(".mobile .currency-block > a").click(function(){var e=$(this).next();return e.is(":visible")?e.hide():e.show(),!1}),$(".currencies li, .currencies a").click(function(){var e=location.href;e+=-1==e.indexOf("?")?"?":"&",location.href=e+"currency="+$(this).data("code")}),$(document).on("click",".mobile .more-tab a",function(){var e=$(this).next(".dropdown");e.length&&!e.is(":visible")?e.show():e.hide()}),$(document).on("click",".mobile .dropdown  li > a, .mobile .categories-list > li > a, .mobile .categories-tree .h4 > a, .mobile .more-block",function(e){var t=$(this).parent(".h4").length?$(this).parent(".h4"):$(this),o=t.next(".dropdown-holder, ul");return!o.length||o.hasClass("visible")||t.children(".f-collapsible, .collapsible-icon").length?void 0:($(".categories-list .dropdown, .pages-block .dropdown, .currencies, .categories-tree .dropdown-menu ul.menu-v, .dropdown-holder, .more .dropdown").not($(e.target).parents(".dropdown")).not($(e.target).parents(".appear-menu").find("ul")).not($(e.target).parents("ul")).not($(e.target).parents(".dropdown-holder")).removeClass("visible").hide(),o.addClass("visible").show(),!1)}),$(".mobile .main-wrapper").click(function(e){$(e.target).parents(".dropdown").length||$(e.target).parent().parent(".categories-list").length||$(".categories-list .dropdown, .pages-block .dropdown, .currencies, .categories-tree .dropdown-menu ul.menu-v, .dropdown-holder, .more .dropdown").removeClass("visible").hide()}),$(document).on("click",".viewed-link",function(){var e=$(this),t=$.cookie("shop_yourshop_viewed"),o=$(".viewed-block"),a=$.yourshop.shopUrl+"search/?title="+$.yourshop.translate("Viewed+products")+"&viewed_products=1";t=t?t.split(","):[];var s=$.inArray(e.data("product")+"",t);return-1!=s&&t.splice(s,1),e.hasClass("active")?(t.length?($.cookie("shop_yourshop_viewed",t.join(","),{expires:30,path:$.yourshop.siteUrl}),o.removeClass("grey")):(a="javascript:void(0)",$.cookie("shop_yourshop_viewed",null,{expires:30,path:$.yourshop.siteUrl}),o.addClass("grey")),$(".viewed-link[data-product='"+e.data("product")+"']").removeClass("active"),flyFormAction(e,"viewed","delete")):(t.push(e.data("product")),$(".viewed-link[data-product='"+e.data("product")+"']").addClass("active"),e.attr("title",$.yourshop.translate("Remove from Viewed list?")),o.removeClass("grey"),$.cookie("shop_yourshop_viewed",t.join(","),{expires:30,path:$.yourshop.siteUrl}),flyFormAction(e,"viewed","add")),o.attr("href",a).find(".indicator").text(t.length),!1}),$(document).on("click",".compare-link",function(){var e=$(this),t=$.cookie("shop_compare"),o=$(".compare-block");t=t?t.split(","):[];var a=$.inArray(e.data("product")+"",t);if(-1!=a&&t.splice(a,1),e.hasClass("active")){if(t.length){var s=$.yourshop.shopUrl+"compare/"+t.join(",")+"/";o.removeClass("grey"),$.cookie("shop_compare",t.join(","),{expires:30,path:$.yourshop.siteUrl})}else{var s="javascript:void(0)";o.addClass("grey"),$.cookie("shop_compare",null,{expires:30,path:$.yourshop.siteUrl})}var i="delete";$(".compare-link[data-product='"+e.data("product")+"']").removeClass("active"),e.attr("title",$.yourshop.translate("Add to compare list?")),e.hasClass("f-without-popup")||bouncePopup(o.parent(),"- "+$.yourshop.translate("Removed from compare list"))}else{if(o.hasClass("grey"))var s=$.yourshop.shopUrl+"compare/"+e.data("product")+"/";else var r=o.attr("href"),s=r.substr(0,r.length-1)+","+e.data("product")+"/";t.push(e.data("product")),$(".compare-link[data-product='"+e.data("product")+"']").addClass("active"),e.attr("title",$.yourshop.translate("Remove from compare list?")),o.removeClass("grey"),$.cookie("shop_compare",t.join(","),{expires:30,path:$.yourshop.siteUrl});var i="add";bouncePopup(o.parent(),"+ "+$.yourshop.translate("Added to compare list"))}return o.attr("href",s).find(".indicator").text(parseInt(t.length)),flyFormAction(e,"compare",i),!1}),$(document).on("click",".favourite-link",function(){var e=$(this),t=$.cookie("shop_yourshop_favourite"),o=$(".favourite-block"),a=$.yourshop.shopUrl+"search/?title="+$.yourshop.translate("Wish+list")+"&favourite=1";t=t?t.split(","):[];var s=$.inArray(e.data("product")+"",t);return-1!=s&&t.splice(s,1),e.hasClass("active")?(t.length?($.cookie("shop_yourshop_favourite",t.join(","),{expires:30,path:$.yourshop.siteUrl}),o.removeClass("grey")):(a="javascript:void(0)",$.cookie("shop_yourshop_favourite",null,{expires:30,path:$.yourshop.siteUrl}),o.addClass("grey")),$(".favourite-link[data-product='"+e.data("product")+"']").removeClass("active"),e.attr("title",$.yourshop.translate("Add to Wish list?")),flyFormAction(e,"favourite","delete"),e.hasClass("f-without-popup")||bouncePopup(o.parent(),"- "+$.yourshop.translate("Removed from Wish list"))):(t.push(e.data("product")),$(".favourite-link[data-product='"+e.data("product")+"']").addClass("active"),e.attr("title",$.yourshop.translate("Remove from Wish list?")),o.removeClass("grey"),$.cookie("shop_yourshop_favourite",t.join(","),{expires:30,path:$.yourshop.siteUrl}),flyFormAction(e,"favourite","add"),bouncePopup(o.parent(),"+ "+$.yourshop.translate("Added to Wish list"))),o.attr("href",a).find(".indicator").text(t.length),!1}),$(".yourshop-popup-link").click(function(){return $.fancybox.open($(this).closest(".yourshop-popup-box").find(".yourshop-popup-content")),!1});var updateFlyCart=function(e){$(".cart-total, .fly-cart .total").html(e.total),$("#cart").find(".indicator").text(e.count),$(".fly-discount .discount").html(e.discount),$(".cart-discount").html("&minus; "+e.discount)};$(document).on("click",".fly-cart a.delete",function(){var e=$(this),t=e.data("id");return confirm($.yourshop.translate("Do you really want to delete product from cart?"))?(e.html('<i class="fa fa-spin fa-spinner"></i>'),$.post($.yourshop.shopCartUrl+"delete/?html="+("html"==$.yourshop.ruble?"1":"0"),{id:t},function(o){e.html("x"),e.closest(".fly-item").slideUp(function(){$(this).remove()}),$("#cart .indicator").text(o.data.count),updateFlyCart(o.data),o.data.count>0?$(".cart-page .cart-row[data-id='"+t+"']").remove():($("#cart").removeClass("has-items").find(".indicator").hide(),$(".cart-total").html($.yourshop.translate("Cart is empty")),$(".fly-content").html("<p>"+$.yourshop.translate("Cart is empty")+"</p>"))},"json"),!1):!1});var changeQuantity=function(e,t){var o=e.closest(".fly-item"),a=o.data("id"),s=$(".cart-page .cart-row[data-id='"+a+"']"),i=s.find(".qty");e.val()>0?e.val()&&(e.prop("disabled",!0),$.post($.yourshop.shopCartUrl+"save/?html="+("html"==$.yourshop.ruble?"1":"0"),{id:a,quantity:e.val()},function(a){e.prop("disabled",!1),s.find(".item-total").html(a.data.item_total),o.find(".price").html(a.data.item_total),a.data.q&&e.val(a.data.q),i.val(e.val()),a.data.error&&alert(a.data.error),t&&t.call(),updateFlyCart(a.data)},"json")):(e.val(1),i.val(1),o.find("input.qty").change())};$(document).on("change",".fly-item input.qty",function(){changeQuantity($(this))}),$(document).on("click",".f-minus",function(){var e=$(this),t=e.find("i"),o=e.next();t.hasClass("fa")||(t.removeClass().addClass("fa fa-refresh fa-spin"),o.val(function(e,t){return parseInt(t,10)>1?--t:1}),changeQuantity(o,function(){t.removeClass().addClass("ys ys-larr")}))}),$(document).on("click",".f-plus",function(){var e=$(this),t=e.find("i"),o=e.prev();t.hasClass("fa")||(t.removeClass().addClass("fa fa-refresh fa-spin"),o.val(function(e,t){return parseInt(t,10)<1?1:++t}),changeQuantity(o,function(){t.removeClass().addClass("ys ys-rarr")}))}),$(window).resize();