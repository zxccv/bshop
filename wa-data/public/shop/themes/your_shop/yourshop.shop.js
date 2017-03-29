/* Autocomplete */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery"],e):e("object"==typeof exports&&"function"==typeof require?require("jquery"):jQuery)}(function(e){"use strict";function t(n,o){var i=function(){},s=this,a={ajaxSettings:{},autoSelectFirst:!1,appendTo:document.body,serviceUrl:null,lookup:null,onSelect:null,width:"auto",minChars:1,maxHeight:300,deferRequestBy:0,params:{},formatResult:t.formatResult,delimiter:null,zIndex:9999,type:"GET",noCache:!1,onSearchStart:i,onSearchComplete:i,onSearchError:i,preserveInput:!1,containerClass:"autocomplete-suggestions",tabDisabled:!1,dataType:"text",currentRequest:null,triggerSelectOnValidInput:!0,preventBadQueries:!0,lookupFilter:function(e,t,n){return-1!==e.value.toLowerCase().indexOf(n)},paramName:"query",transformResult:function(t){return"string"==typeof t?e.parseJSON(t):t},showNoSuggestionNotice:!1,noSuggestionNotice:"No results",orientation:"bottom",forceFixPosition:!1};s.element=n,s.el=e(n),s.suggestions=[],s.badQueries=[],s.selectedIndex=-1,s.currentValue=s.element.value,s.intervalId=0,s.cachedResponse={},s.onChangeInterval=null,s.onChange=null,s.isLocal=!1,s.suggestionsContainer=null,s.noSuggestionsContainer=null,s.options=e.extend({},a,o),s.classes={selected:"autocomplete-selected",suggestion:"autocomplete-suggestion"},s.hint=null,s.hintValue="",s.selection=null,s.initialize(),s.setOptions(o)}var n=function(){return{escapeRegExChars:function(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},createNode:function(e){var t=document.createElement("div");return t.className=e,t.style.position="absolute",t.style.display="none",t}}}(),o={ESC:27,TAB:9,RETURN:13,LEFT:37,UP:38,RIGHT:39,DOWN:40};t.utils=n,e.Autocomplete=t,t.formatResult=function(e,t){var o="("+n.escapeRegExChars(t)+")";return e.value.replace(new RegExp(o,"gi"),"<strong>$1</strong>").replace(/&/g,"&").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/&lt;(\/?strong)&gt;/g,"<$1>")},t.prototype={killerFn:null,initialize:function(){var n,o=this,i="."+o.classes.suggestion,s=o.classes.selected,a=o.options;o.element.setAttribute("autocomplete","off"),o.killerFn=function(t){0===e(t.target).closest("."+o.options.containerClass).length&&(o.killSuggestions(),o.disableKillerFn())},o.noSuggestionsContainer=e('<div class="autocomplete-no-suggestion"></div>').html(this.options.noSuggestionNotice).get(0),o.suggestionsContainer=t.utils.createNode(a.containerClass),n=e(o.suggestionsContainer),n.appendTo(a.appendTo),"auto"!==a.width&&n.width(a.width),n.on("mouseover.autocomplete",i,function(){o.activate(e(this).data("index"))}),n.on("mouseout.autocomplete",function(){o.selectedIndex=-1,n.children("."+s).removeClass(s)}),n.on("click.autocomplete",i,function(){o.select(e(this).data("index"))}),o.fixPositionCapture=function(){o.visible&&o.fixPosition()},e(window).on("resize.autocomplete",o.fixPositionCapture),o.el.on("keydown.autocomplete",function(e){o.onKeyPress(e)}),o.el.on("keyup.autocomplete",function(e){o.onKeyUp(e)}),o.el.on("blur.autocomplete",function(){o.onBlur()}),o.el.on("focus.autocomplete",function(){o.onFocus()}),o.el.on("change.autocomplete",function(e){o.onKeyUp(e)}),o.el.on("input.autocomplete",function(e){o.onKeyUp(e)})},onFocus:function(){var e=this;e.fixPosition(),0===e.options.minChars&&0===e.el.val().length&&e.onValueChange()},onBlur:function(){this.enableKillerFn()},abortAjax:function(){var e=this;e.currentRequest&&(e.currentRequest.abort(),e.currentRequest=null)},setOptions:function(t){var n=this,o=n.options;e.extend(o,t),n.isLocal=e.isArray(o.lookup),n.isLocal&&(o.lookup=n.verifySuggestionsFormat(o.lookup)),o.orientation=n.validateOrientation(o.orientation,"bottom"),e(n.suggestionsContainer).css({"max-height":o.maxHeight+"px",width:o.width+"px","z-index":o.zIndex})},clearCache:function(){this.cachedResponse={},this.badQueries=[]},clear:function(){this.clearCache(),this.currentValue="",this.suggestions=[]},disable:function(){var e=this;e.disabled=!0,clearInterval(e.onChangeInterval),e.abortAjax()},enable:function(){this.disabled=!1},fixPosition:function(){var t=this,n=e(t.suggestionsContainer),o=n.parent().get(0);if(o===document.body||t.options.forceFixPosition){var i=t.options.orientation,s=n.outerHeight(),a=t.el.outerHeight(),l=t.el.offset(),r={top:l.top,left:l.left};if("auto"===i){var u=e(window).height(),c=e(window).scrollTop(),g=-c+l.top-s,d=c+u-(l.top+a+s);i=Math.max(g,d)===g?"top":"bottom"}if(r.top+="top"===i?-s:a,o!==document.body){var p,h=n.css("opacity");t.visible||n.css("opacity",0).show(),p=n.offsetParent().offset(),r.top-=p.top,r.left-=p.left,t.visible||n.css("opacity",h).hide()}"auto"===t.options.width&&(r.width=t.el.outerWidth()-2+"px"),n.css(r)}},enableKillerFn:function(){var t=this;e(document).on("click.autocomplete",t.killerFn)},disableKillerFn:function(){var t=this;e(document).off("click.autocomplete",t.killerFn)},killSuggestions:function(){var e=this;e.stopKillSuggestions(),e.intervalId=window.setInterval(function(){e.visible&&(e.el.val(e.currentValue),e.hide()),e.stopKillSuggestions()},50)},stopKillSuggestions:function(){window.clearInterval(this.intervalId)},isCursorAtEnd:function(){var e,t=this,n=t.el.val().length,o=t.element.selectionStart;return"number"==typeof o?o===n:document.selection?(e=document.selection.createRange(),e.moveStart("character",-n),n===e.text.length):!0},onKeyPress:function(e){var t=this;if(!t.disabled&&!t.visible&&e.which===o.DOWN&&t.currentValue)return void t.suggest();if(!t.disabled&&t.visible){switch(e.which){case o.ESC:t.el.val(t.currentValue),t.hide();break;case o.RIGHT:if(t.hint&&t.options.onHint&&t.isCursorAtEnd()){t.selectHint();break}return;case o.TAB:if(t.hint&&t.options.onHint)return void t.selectHint();if(-1===t.selectedIndex)return void t.hide();if(t.select(t.selectedIndex),t.options.tabDisabled===!1)return;break;case o.RETURN:if(-1===t.selectedIndex)return void t.hide();t.select(t.selectedIndex);break;case o.UP:t.moveUp();break;case o.DOWN:t.moveDown();break;default:return}e.stopImmediatePropagation(),e.preventDefault()}},onKeyUp:function(e){var t=this;if(!t.disabled){switch(e.which){case o.UP:case o.DOWN:return}clearInterval(t.onChangeInterval),t.currentValue!==t.el.val()&&(t.findBestHint(),t.options.deferRequestBy>0?t.onChangeInterval=setInterval(function(){t.onValueChange()},t.options.deferRequestBy):t.onValueChange())}},onValueChange:function(){var t=this,n=t.options,o=t.el.val(),i=t.getQuery(o);return t.selection&&t.currentValue!==i&&(t.selection=null,(n.onInvalidateSelection||e.noop).call(t.element)),clearInterval(t.onChangeInterval),t.currentValue=o,t.selectedIndex=-1,n.triggerSelectOnValidInput&&t.isExactMatch(i)?void t.select(0):void(i.length<n.minChars?t.hide():t.getSuggestions(i))},isExactMatch:function(e){var t=this.suggestions;return 1===t.length&&t[0].value.toLowerCase()===e.toLowerCase()},getQuery:function(t){var n,o=this.options.delimiter;return o?(n=t.split(o),e.trim(n[n.length-1])):t},getSuggestionsLocal:function(t){var n,o=this,i=o.options,s=t.toLowerCase(),a=i.lookupFilter,l=parseInt(i.lookupLimit,10);return n={suggestions:e.grep(i.lookup,function(e){return a(e,t,s)})},l&&n.suggestions.length>l&&(n.suggestions=n.suggestions.slice(0,l)),n},getSuggestions:function(t){var n,o,i,s,a=this,l=a.options,r=l.serviceUrl;if(l.params[l.paramName]=t,o=l.ignoreParams?null:l.params,l.onSearchStart.call(a.element,l.params)!==!1){if(e.isFunction(l.lookup))return void l.lookup(t,function(e){a.suggestions=e.suggestions,a.suggest(),l.onSearchComplete.call(a.element,t,e.suggestions)});a.isLocal?n=a.getSuggestionsLocal(t):(e.isFunction(r)&&(r=r.call(a.element,t)),i=r+"?"+e.param(o||{}),n=a.cachedResponse[i]),n&&e.isArray(n.suggestions)?(a.suggestions=n.suggestions,a.suggest(),l.onSearchComplete.call(a.element,t,n.suggestions)):a.isBadQuery(t)?l.onSearchComplete.call(a.element,t,[]):(a.abortAjax(),s={url:r,data:o,type:l.type,dataType:l.dataType},e.extend(s,l.ajaxSettings),a.currentRequest=e.ajax(s).done(function(e){var n;a.currentRequest=null,n=l.transformResult(e,t),a.processResponse(n,t,i),l.onSearchComplete.call(a.element,t,n.suggestions)}).fail(function(e,n,o){l.onSearchError.call(a.element,t,e,n,o)}))}},isBadQuery:function(e){if(!this.options.preventBadQueries)return!1;for(var t=this.badQueries,n=t.length;n--;)if(0===e.indexOf(t[n]))return!0;return!1},hide:function(){var t=this,n=e(t.suggestionsContainer);e.isFunction(t.options.onHide)&&t.visible&&t.options.onHide.call(t.element,n),t.visible=!1,t.selectedIndex=-1,clearInterval(t.onChangeInterval),e(t.suggestionsContainer).hide(),t.signalHint(null)},suggest:function(){if(0===this.suggestions.length)return void(this.options.showNoSuggestionNotice?this.noSuggestions():this.hide());var t,n=this,o=n.options,i=o.groupBy,s=o.formatResult,a=n.getQuery(n.currentValue),l=n.classes.suggestion,r=n.classes.selected,u=e(n.suggestionsContainer),c=e(n.noSuggestionsContainer),g=o.beforeRender,d="",p=function(e){var n=e.data[i];return t===n?"":(t=n,'<div class="autocomplete-group"><strong>'+t+"</strong></div>")};return o.triggerSelectOnValidInput&&n.isExactMatch(a)?void n.select(0):(e.each(n.suggestions,function(e,t){i&&(d+=p(t,a,e)),d+='<div class="'+l+'" data-index="'+e+'">'+s(t,a)+"</div>"}),this.adjustContainerWidth(),c.detach(),u.html(d),e.isFunction(g)&&g.call(n.element,u),n.fixPosition(),u.show(),o.autoSelectFirst&&(n.selectedIndex=0,u.scrollTop(0),u.children("."+l).first().addClass(r)),n.visible=!0,void n.findBestHint())},noSuggestions:function(){var t=this,n=e(t.suggestionsContainer),o=e(t.noSuggestionsContainer);this.adjustContainerWidth(),o.detach(),n.empty(),n.append(o),t.fixPosition(),n.show(),t.visible=!0},adjustContainerWidth:function(){var t,n=this,o=n.options,i=e(n.suggestionsContainer);"auto"===o.width&&(t=n.el.outerWidth()-2,i.width(t>0?t:300))},findBestHint:function(){var t=this,n=t.el.val().toLowerCase(),o=null;n&&(e.each(t.suggestions,function(e,t){var i=0===t.value.toLowerCase().indexOf(n);return i&&(o=t),!i}),t.signalHint(o))},signalHint:function(t){var n="",o=this;t&&(n=o.currentValue+t.value.substr(o.currentValue.length)),o.hintValue!==n&&(o.hintValue=n,o.hint=t,(this.options.onHint||e.noop)(n))},verifySuggestionsFormat:function(t){return t.length&&"string"==typeof t[0]?e.map(t,function(e){return{value:e,data:null}}):t},validateOrientation:function(t,n){return t=e.trim(t||"").toLowerCase(),-1===e.inArray(t,["auto","bottom","top"])&&(t=n),t},processResponse:function(e,t,n){var o=this,i=o.options;e.suggestions=o.verifySuggestionsFormat(e.suggestions),i.noCache||(o.cachedResponse[n]=e,i.preventBadQueries&&0===e.suggestions.length&&o.badQueries.push(t)),t===o.getQuery(o.currentValue)&&(o.suggestions=e.suggestions,o.suggest())},activate:function(t){var n,o=this,i=o.classes.selected,s=e(o.suggestionsContainer),a=s.find("."+o.classes.suggestion);return s.find("."+i).removeClass(i),o.selectedIndex=t,-1!==o.selectedIndex&&a.length>o.selectedIndex?(n=a.get(o.selectedIndex),e(n).addClass(i),n):null},selectHint:function(){var t=this,n=e.inArray(t.hint,t.suggestions);t.select(n)},select:function(e){var t=this;t.hide(),t.onSelect(e)},moveUp:function(){var t=this;if(-1!==t.selectedIndex)return 0===t.selectedIndex?(e(t.suggestionsContainer).children().first().removeClass(t.classes.selected),t.selectedIndex=-1,t.el.val(t.currentValue),void t.findBestHint()):void t.adjustScroll(t.selectedIndex-1)},moveDown:function(){var e=this;e.selectedIndex!==e.suggestions.length-1&&e.adjustScroll(e.selectedIndex+1)},adjustScroll:function(t){var n=this,o=n.activate(t);if(o){var i,s,a,l=e(o).outerHeight();i=o.offsetTop,s=e(n.suggestionsContainer).scrollTop(),a=s+n.options.maxHeight-l,s>i?e(n.suggestionsContainer).scrollTop(i):i>a&&e(n.suggestionsContainer).scrollTop(i-n.options.maxHeight+l),n.options.preserveInput||n.el.val(n.getValue(n.suggestions[t].value)),n.signalHint(null)}},onSelect:function(t){var n=this,o=n.options.onSelect,i=n.suggestions[t];n.currentValue=n.getValue(i.value),n.currentValue===n.el.val()||n.options.preserveInput||n.el.val(n.currentValue),n.signalHint(null),n.suggestions=[],n.selection=i,e.isFunction(o)&&o.call(n.element,i)},getValue:function(e){var t,n,o=this,i=o.options.delimiter;return i?(t=o.currentValue,n=t.split(i),1===n.length?e:t.substr(0,t.length-n[n.length-1].length)+e):e},dispose:function(){var t=this;t.el.off(".autocomplete").removeData("autocomplete"),t.disableKillerFn(),e(window).off("resize.autocomplete",t.fixPositionCapture),e(t.suggestionsContainer).remove()}},e.fn.autocomplete=e.fn.devbridgeAutocomplete=function(n,o){var i="autocomplete";return 0===arguments.length?this.first().data(i):this.each(function(){var s=e(this),a=s.data(i);"string"==typeof n?a&&"function"==typeof a[n]&&a[n](o):(a&&a.dispose&&a.dispose(),a=new t(this,n),s.data(i,a))})}});
                                    
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (what, i) {
        i = i || 0;
        var L = this.length;
        while (i < L) {
            if (this[i] === what)
                return i;
            ++i;
        }
        return -1;
    };
}
jQuery(document).ready(function ($) {
    
    /* До загрузки страницы */
    // Slider
    if ($('.bxslider').length) {
        $('.bxslider').bxSlider({
            auto: true,
            prevText: '<i class="fa fa-chevron-left"></i>',
            nextText: '<i class="fa fa-chevron-right"></i>',
            pause: $.yourshop.photosSliderSpeed,
            onSliderLoad: function (slider) {
                slider.css({"visibility": "visible", "height": "inherit"}).closest(".slider").find(".default-loader").remove();
            },
        });
    }
    // Большой слайдер товаров
    if ($('#da-slider').length) {
        $('#da-slider').cslider({
            autoplay: true,
            bgincrement: 45,
            interval: $.yourshop.htmlSliderSpeed
        });
        $('#da-slider').swipe({
            swipe: function (event, direction) {
                if (direction == 'left') {
                    $("#da-slider .da-arrows-next").click();
                } else if (direction == 'right') {
                    $("#da-slider .da-arrows-prev").click();
                }
            },
            allowPageScroll: "vertical",
            preventDefaultEvents: false,
            threshold: 35,
            excludedElements: []
        });
    }
    // Слайдер подкатегорий
    if ($(".sub-slider").length) {
        $(".sub-slider").slick({
            infinite: true,
            autoplaySpeed: "5000",
            autoplay: true,
            prevArrow: '<span class="slider-prev s-nav"><span class="sl-prev-control"><i class="fa fa-chevron-left"></i></span></span>',
            nextArrow: '<span class="slider-next s-nav"><span class="sl-next-control"><i class="fa fa-chevron-right"></i></span></span>',
            appendArrows: $(".sub-slider").closest(".slider-custom"),
            respondTo: 'slider',
            responsive: [
                {
                    breakpoint: 1500,
                    settings: {
                        slidesToScroll: 6,
                        slidesToShow: 6
                    }
                }, {
                    breakpoint: 930,
                    settings: {
                        slidesToScroll: 5,
                        slidesToShow: 5
                    }
                }, {
                    breakpoint: 680,
                    settings: {
                        slidesToScroll: 4,
                        slidesToShow: 4
                    }
                }, {
                    breakpoint: 615,
                    settings: {
                        slidesToScroll: 3,
                        slidesToShow: 3
                    }
                }, {
                    breakpoint: 425,
                    settings: {
                        slidesToScroll: 2,
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 310,
                    settings: {
                        slidesToScroll: 1,
                        slidesToShow: 1
                    }
                }]
        });
    }

    // Сортировка в каталоге
    var sorting = $("#sorting-select");
    if (sorting.length) {
        var catalogSorting = function () {
            var activeSort = sorting.find("option:selected");
            var id = activeSort.data("id");
            var clone = activeSort.clone();
            var sortingBlockLi = $("#sorting-block li[data-id='" + id + "']");
            if (sortingBlockLi.length) {
                if (sortingBlockLi.html().search('sort-asc') > 0) {
                    activeSort.append("↑");
                    clone.append("↓");
                } else {
                    activeSort.append("↓");
                    clone.append("↑");
                }
            }
            activeSort.hide();
            clone.prop('selected', false);
            activeSort.after(clone);
            $.each($("#sorting-block li"), function (i, v) {
                sorting.find("option[data-id='" + $(this).data('id') + "']").val($(this).find("a").attr('href'));
            });
            sorting.change(function () {
                location.href = $(this).val();
            });
        };
        catalogSorting();
    }

    // Изменение отображения товаров в каталоге
    var view = $(".f-view");
    if (view.length) {
        var viewCatalog = function () {
            var product_view = $.cookie('your_product_view');
            if (product_view) {
                view.removeClass("active");
                $(".f-view[data-view='" + product_view + "']").addClass("active");
                $(".product-list").removeClass("thumbs thumbs-small table table-small").addClass(product_view);
            }
            view.click(function () {
                var that = $(this);
                if (!that.hasClass("active")) {
                    var viewType = that.data("view");
                    view.removeClass("active");
                    $(".f-view[data-view='" + viewType + "']").addClass("active");
                    $(".product-list").removeClass("thumbs thumbs-small table table-small").addClass(viewType);
                    $.cookie('your_product_view', viewType, {expires: 30, path: $.yourshop.shopUrl});
                }
            });
        };
        viewCatalog();
    }
    
    // Скрыть часть брендов в сайдбаре
    var brandsBlock = $(".sidebar-block .brands");
    if ($.yourshop.sidebarBrandsHide && brandsBlock.length) {
        var brandsHeight = brandsBlock.height();
        if (brandsBlock.find("li").length > 8) {
            brandsBlock.find("li:gt(7)").hide();
            brandsBlock.height(brandsBlock.height()).find("li:gt(7)").show();
            $("<a href='javascript:void(0)'>"+$.yourshop.translate("Show all")+" <i class='fa fa-arrow-circle-down'></i></a>").click(function() {
                brandsBlock.animate({ 'height': brandsHeight });
                $(this).remove();
            }).insertAfter(brandsBlock);
        }
    }
    
    // Скрыть часть фильтров в сайдбаре
    var filterBlock = $("#sidebar-categories .filters");
    if ($.yourshop.filterHide && filterBlock.length) {
        filterBlock.find(".filter-block").each(function() {
            var that = $(this);
            var filterFields = that.find(".filter-field");
            if (filterFields.length > 5) {
                filterFields.filter(":gt(4)").hide();
                $("<a href='javascript:void(0)' class='show-all'>"+$.yourshop.translate("Show all")+" <i class='fa fa-arrow-circle-down'></i></a>").click(function() {
                    filterFields.filter(":gt(4)").show();
                    $(this).remove();
                }).appendTo(that.find(".filter-value"));
            }
        });
    }
    
    // Скрыть часть характеристик на странице товара
    var featuresBlock = $("#features"); 
    if ($.yourshop.featuresHide && featuresBlock.length) { 
        var featuresFields = featuresBlock.find("tr");
        if (featuresFields.length > 5) {
            featuresFields.filter(":gt(4)").hide();
            $("<a href='javascript:void(0)' class='show-all'>"+$.yourshop.translate("Show all")+" <i class='fa fa-arrow-circle-down'></i></a>").click(function() {
                featuresFields.filter(":gt(4)").show();
                $(this).remove();
            }).appendTo(featuresBlock);
        }
    }
    
    /* Onload */
    $(document).on('submit', '.product-list form.addtocart', function () {
        var updateFlyCart = function (data) {
            $(".cart-total, .fly-cart .total").html(data.total);
            $("#cart").find(".indicator").text(data.count);
            $(".fly-discount .discount").html(data.discount);
        };
        var f = $(this);
        f.attr("data-id", "");
        var input = f.find(".addtocart-form input[type='submit']");
        if (!input.hasClass("active")) {
            input.addClass("active");
            if (f.data('url')) {
                var d = $('#dialog');
                var c = d.find('.content');
                c.load(f.data('url') + (f.attr("data-sku") !== undefined ? '&sku_id=' + f.attr("data-sku") : ''), function () {
                    input.removeClass("active");
                    if (!c.find(".dialog-close").length) {
                        c.prepend('<a href="#" class="dialog-close">x</a>');
                    }
                    d.show(function () {
                        $("body").addClass("dialog-open");
                    });
                });
                return false;
            }
            $.post(f.attr('action') + '?html=' + ($.yourshop.ruble == 'html' ? '1' : '0'), f.serialize(), function (response) {
                input.removeClass("active");
                if (response.status == 'ok') {
                    var cart = $("#cart");
                    var cartTotal = $(".cart-total, .fly-cart .total");

                    // Обновление страницы корзины
                    if ($(".cart-page").length) {
                        $.get(location.href, function (html) {
                            $(".cart-page").html($(html).html());
                            cartTotal.html(response.data.total);
                        }, "html");
                    }

                    if (response.data.error) {
                        alert(response.data.error);
                    } else {
                        cart.find(".indicator").text(response.data.count).show();
                        var oldFV = input.val();
                        input.val($.yourshop.translate("Added"));
                        setTimeout(function () {
                            input.val(oldFV);
                        }, 2500);

                        var count = parseInt($(".add2cart input[name='quantity']").val()) || 1;
                        var flyCart = $(".fly-cart");
                        var existProduct = flyCart.find(".fly-item[data-id='" + response.data.item_id + "']");

                        if (f.closest("#dialog").length) {
                            var origin = $(".product-list .product-item[data-id='" + f.find("input[name*='product_id']") + "']");
                        } else {
                            var origin = f.closest('.product-item');
                        }

                        if (existProduct.length) {
                            var quantityBlock = existProduct.find(".qty");
                            var priceBlock = existProduct.find(".fly-price");
                            var price = parseFloat(priceBlock.text().replace(",", ".").replace(/[^\d\.]/g, "")) + parseFloat(origin.find(".price").text().replace(",", ".").replace(/[^\d\.]/g, "")) * count;
                            count += parseInt(quantityBlock.val());
                            quantityBlock.val(count);
                            priceBlock.html("~" + price.toFixed(2).replace(".", ",") + " " + $.yourshop.currency);
                        } else {
                            var name = origin.find("h5 a").clone();
                            name.find(".table").remove();
                            var html = '<div class="fly-item" data-id="' + response.data.item_id + '">' +
                                    '<div class="fly-img">' +
                                    '<a href="' + origin.find(".image a").attr('href') + '" title="' + name.find("span").html() + '">' +
                                    origin.find(".image").data("small") +
                                    '</a>' +
                                    '</div>' +
                                    '<div class="fly-info">' +
                                    '<div class="fly-name">' + name.prop('outerHTML') + '</div>' +
                                    '<div class="fly-quantity">' +
                                    '<a href="javascript:void(0)" title="' + $.yourshop.translate('decrease') + '" class="f-minus"><i class="ys ys-larr"></i></a>' +
                                    '<input type="text" value="' + count + '" class="qty" />' +
                                    '<a href="javascript:void(0)" title="' + $.yourshop.translate('increase') + '" class="f-plus"><i class="ys ys-rarr"></i></a>' +
                                    '</div>' +
                                    '<div class="fly-price price colored">~' + origin.find(".price").html() + '</div>' +
                                    '</div>' +
                                    '<div class="fly-icons"><a href="javascript:void(0)" class="delete" title="' + $.yourshop.translate('Delete') + '" data-id="' + response.data.item_id + '">x</a></div>' +
                                    '</div>';
                            if (!cart.hasClass("has-items")) {
                                var a = cart.find("a");
                                $(".fly-content").find("p").remove();
                                a.attr("href", a.data("url")).parent().addClass("has-items");
                            }
                            $(".fly-content").append(html);
                        }
                        cart.addClass('has-items');
                        updateFlyCart(response.data);
                        bouncePopup(cart, "+ " + $.yourshop.translate('Added to cart'));
                    }
                } else if (response.status == 'fail') {
                    alert(response.errors);
                }
            }, "json");
        }
        return false;
    });

    // Быстрый просмотр
    $(document).on("click", ".quick-view", function () {
        var that = $(this);
        var dialog = $('#dialog');
        if (!dialog.hasClass("quick-view-dial")) {
            dialog.show(function () {
                $("body").addClass("dialog-open");
            }).find(".content").addClass("align-center").append('<span class="temp-loader"><i class="icon16 loading3" style="vertical-align: middle;"></i> ' + $.yourshop.translate("Wait, please. Information is loading") + '</span>');
            if (!dialog.find(".dialog-close").length) {
                dialog.find(".content").prepend('<a href="#" class="dialog-close">x</a>');
            }
            var form = that.closest("form");
            $.get(that.attr("href") + "?quickview=1" + (form.attr("data-sku") !== undefined ? '&sku_id=' + form.attr("data-sku") : ''), function (response) {
                var content = $(response).find(".product-page");
                content.removeClass("wrap").find(".product-full, .related, .category-sidebar, .goto-review").remove();
                content.find(".product-sidebar").removeClass();
                content.find(".cart-form").append("<a href='" + that.attr("href") + "' class='button grey' style='display: inline-block;'>" + $.yourshop.translate("Go to product page") + "</a>");
                dialog.addClass("quick-view-dial").find(".temp-loader").remove();
                dialog.find(".content").removeClass("align-center").append(content);
            }, 'html');
        }
        return false;
    });

    $(document).on("click", ".f-quantity-minus", function () {
        var quantity = $(this).closest(".quantity").find("input[name*='quantity']");
        if (parseInt(quantity.val()) > 1 && !$(this).find("i").hasClass('loading')) {
            quantity.val(function (i, oldval) {
                return --oldval;
            }).trigger('change');
        }
    });

    $(document).on("click", ".f-quantity-plus", function () {
        if (!$(this).find("i").hasClass('loading')) {
            $(this).closest(".quantity").find("input[name*='quantity']").val(function (i, oldval) {
                return ++oldval;
            }).trigger('change');
        }
    });

    // Обрезание описания категории
    var catDesc = $(".category-desc-cut");
    if (catDesc.length) {
        var cutDescHeight = catDesc.height();
        var fullDescHeight = catDesc.css('height', 'auto').height();
        catDesc.height(cutDescHeight);
        $(".cat-cut-link").click(function () {
            var link = $(this);
            if (catDesc.is(":animated")) {
                return false;
            }
            var oldText = link.text();
            var newText = link.attr("data-toggle");
            if (!catDesc.hasClass("opened")) {
                catDesc.animate({'height': fullDescHeight}, 500, function () {
                    $(this).addClass("opened");
                    link.attr("data-toggle", oldText).attr("title", newText).html(newText);
                    link.append("<i class='fa fa-arrow-circle-up'></i>");
                });
            } else {
                catDesc.animate({'height': cutDescHeight}, 500, function () {
                    $(this).removeClass("opened");
                    link.attr("data-toggle", oldText).attr("title", newText).html(newText);
                    link.append("<i class='fa fa-arrow-circle-down'></i>");
                });
            }
        });
    }

    // Постраничная навигация
    var removeParam = function (key, sourceURL) {
        var rtn = sourceURL.split("?")[0],
            param,
            params_arr = [],
            queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
        if (queryString !== "") {
            params_arr = queryString.split("&");
            for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                param = params_arr[i].split("=")[0];
                if (param === key) {
                    params_arr.splice(i, 1);
                }
            }
            rtn = rtn + "?" + params_arr.join("&");
        }
        return rtn;
    };
    $('#products-per-page a').click(function () {
        var that = $(this);
        if (!that.hasClass('selected')) {
            if (that.data('perpage')) {
                $.cookie('products_per_page', that.data('perpage'), {expires: 30, path: $.yourshop.shopUrl});
            } else {
                $.cookie('products_per_page', '', {expires: 0, path: $.yourshop.shopUrl});
            }
            location.href = removeParam("page", location.href);
        }
        return false;
    });
    $('#products-per-page').change(function () {
        var that = $(this);
        if (!that.is(':selected')) {
            if (that.val()) {
                $.cookie('products_per_page', that.val(), {expires: 30, path: $.yourshop.shopUrl});
            } else {
                $.cookie('products_per_page', '', {expires: 0, path: $.yourshop.shopUrl});
            }
            location.href = removeParam("page", location.href);
        } else {
            return false;
        }
    });
    // Открытие страницы товара на выбраном артикуле
    var saveProductSku = function (that) {
        var form = that.closest("form");
        if (form.attr("data-sku") !== undefined) {
            $.cookie('yourshop_product_sku', form.attr("data-sku"), {expires: 1, path: $.yourshop.shopUrl});
        }
    };
    $(document).on({
        click: function () {
            saveProductSku($(this));
        },
        mouseup: function (e) {
            if (e.which <= 2) {
                saveProductSku($(this));
            }
        }
    }, '.product-item .product-image, .product-item h5 > a');
    
    // Сброс просмотренных товаров
    $(".cancel-viewed").click(function () {
        $(this).after("<i class='icon16 loading'></i>");
        $.cookie('shop_yourshop_viewed', null, {path: $.yourshop.siteUrl});
        location.reload();
    });
    
    // Сброс избраных товаров
    $(".cancel-favourite").click(function () {
        $(this).after("<i class='icon16 loading'></i>");
        $.cookie('shop_yourshop_favourite', null, {path: $.yourshop.siteUrl});
        location.reload();
    });

    // Появлениие миниатюр в каталоге
    $(document).on({
        mouseenter: function () {
            var thumbsCont = $(this).find(".sku-thumbs-slider");
            var productList = $("#product-list .product-list");
            if (!thumbsCont.hasClass("slick-initialized")) {
                var images = thumbsCont.data("images");
                var html = "";
                $.each(images, function (i, v) {
                    html += "<div style='width: 50px; height: 50px;'><img src='" + v.img + "' data-id='" + i + "'></div>";
                });
                thumbsCont.html(html);

                if (!productList.hasClass("has-thumbs-slider")) {
                    productList.addClass("has-thumbs-slider");
                }

                var settings = {
                    autoplay: false,
                    draggable: false,
                    infinite: false,
                    vertical: true,
                    prevArrow: '<div class="slider-prev"><i class="fa fa-chevron-up"></i></div>',
                    nextArrow: '<div class="slider-next"><i class="fa fa-chevron-down"></i></div>',
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    appendArrows: thumbsCont.closest(".slider-custom")
                };
                if (productList.hasClass("table")) {
                    settings['slidesToShow'] = 3;
                } else if (productList.hasClass("thumbs-small")) {
                    settings['slidesToShow'] = 4;
                }
                thumbsCont.slick(settings);
            } else {
                var slidesToShow = 5;
                if (productList.hasClass("table")) {
                    slidesToShow = 3;
                } else if (productList.hasClass("thumbs-small")) {
                    slidesToShow = 4;
                }
                thumbsCont.slick('slickSetOption', 'slidesToShow', slidesToShow, true);
            }
        }
    }, ".not-mobile .product-item.has-images.type-thumbs");
    $(document).on({
        mouseenter: function () {
            var that = $(this);
            if (!that.hasClass("selected")) {
                that.closest(".sku-thumbs").find("img").removeClass("selected");
                that.addClass("selected");
                var product = that.closest(".product-item");
                var thumbsData = product.find(".sku-thumbs-slider").data("images");
                var imgData = thumbsData[that.data('id')];
                product.find(".product-image img").attr('src', imgData.largeImg).removeAttr('width height');
                // Если задано выводить артикулы, тогда меняем цены, название и все остальное
                if (imgData.comparepr !== undefined) {
                    product.find(".prices").html((imgData.comparepr !== "0" ? '<span class="compare-price">' + imgData.comparepr + '</span> ' : '') + '<span class="price' + (imgData.comparepr !== "0" ? ' colored' : '') + '" itemprop="price">' + imgData.price + '</span>');
                    if (typeof imgData.sku !== 'undefined') {
                        if (product.find(".sku").length) {
                            product.find(".sku").text($.yourshop.translate("SKU") + ": " + imgData.sku);
                        } else {
                            product.find(".addtocart").prepend("<div class='sku'>" + $.yourshop.translate("SKU") + ": " + imgData.sku + "</div>");
                        }
                    } else {
                        product.find(".sku").remove();
                    }
                    if (typeof imgData.skuName !== 'undefined') {
                        if (product.find(".sku-name").length) {
                            product.find(".sku-name").text(imgData.skuName);
                        } else {
                            product.find("h5").after("<div class='sku-name'>" + imgData.skuName + "</div>");
                        }
                    } else {
                        product.find(".sku-name").remove();
                    }
                    product.find("form.addtocart").attr("data-sku", that.data('id'));
                }
            }
        },
        click: function () {
            var that = $(this);
            !that.closest(".sku-thumbs-slider").hasClass("only-images") && $.cookie('yourshop_product_sku', that.data('id'), {expires: 1, path: $.yourshop.shopUrl});
            location.href = that.closest(".product-item").find(".product-image").attr("href");
        }
    }, ".not-mobile .sku-thumbs img");
    $.yourshop.swipeImageThumbs = function (image, dir) {
        var images = image.data('images'),
                imagesKeys = image.data('images-keys').split(","),
                k = $.inArray(image.attr('data-sku-id'), imagesKeys);
        var showItem;
        image.find("img").hide().after("<i class='icon16 loading'></i>");
        if (dir == 'next' && k == imagesKeys.length - 1) {
            showItem = images[imagesKeys[0]];
        } else if (dir == 'next') {
            showItem = images[imagesKeys[k + 1]];
        } else if (dir == 'prev' && k == 0) {
            showItem = images[imagesKeys[imagesKeys.length - 1]];
        } else if (dir == 'prev') {
            showItem = images[imagesKeys[k - 1]];
        }
        var product = image.closest(".product-item");
        var fadeElements = showItem.comparepr !== undefined ? product.find("h5, .offers") : image.find("img");
        fadeElements.animate({ 'opacity': 0, 'visibility': 'hidden' }, 500, function() {
            $("<img src='" + showItem.largeImg + "'>").load(function (response, status, xhr) {
                image.find("img").replaceWith($(this));
                if (showItem.comparepr !== undefined) {
                    product.find(".prices").html((showItem.comparepr !== "0" ? '<span class="compare-price">' + showItem.comparepr + '</span> ' : '') + '<span class="price' + (showItem.comparepr !== "0" ? ' colored' : '') + '" itemprop="price">' + showItem.price + '</span>');
                    product.find("form.addtocart").attr("data-sku", showItem.id);
                    if (typeof showItem.sku !== 'undefined') {
                        if (product.find(".sku").length) {
                            product.find(".sku").text($.yourshop.translate("SKU") + ": " + showItem.sku);
                        } else {
                            product.find(".addtocart").prepend("<div class='sku'>" + $.yourshop.translate("SKU") + ": " + imgData.sku + "</div>");
                        }
                    } else {
                        product.find(".sku").remove();
                    }
                    if (typeof showItem.skuName !== 'undefined') {
                        if (product.find(".sku-name").length) {
                            product.find(".sku-name").text(showItem.skuName);
                        } else {
                            product.find("h5").after("<div class='sku-name'>" + showItem.skuName + "</div>");
                        }
                    } else {
                        product.find(".sku-name").remove();
                    }
                }
                image.attr("data-sku-id", showItem.id + "s");
                image.find(".loading").remove();
                fadeElements.animate({ 'opacity': 1, 'visibility': 'visible' }, 500);
            });
        });
        
    };
    $(document).on('click', '.image-thumbs-nav', function () {
        var that = $(this);
        $.yourshop.swipeImageThumbs(that.closest('.image').find(".product-image"), that.hasClass("s-next") ? 'next' : 'prev');
    });
    
    $.yourshop.initProductSwipeEvent = function (products) {
        products.swipe({
            swipe: function (event, direction) {
                if (direction == 'left') {
                    $.yourshop.swipeImageThumbs($(this).find(".product-image"), 'next');
                } else if (direction == 'right') {
                    $.yourshop.swipeImageThumbs($(this).find(".product-image"), 'prev');
                }
            },
            allowPageScroll: "vertical",
            preventDefaultEvents: false,
            threshold: 35,
            excludedElements: []
        });
    };
    $.yourshop.initProductSwipeEvent($(".product-item .image.swipeable"));
    
    // Автозаполнение строки поиска
    if ($("#yourshop.shop .search-input-field").length && $.yourshop.searchAutocomplete) {
        $("#yourshop.shop .search-input-field").each(function() {
            var that = $(this);
            var options = {
                minChars: "2",
                maxHeight: "300",
                deferRequestBy: "350",
                width: "300",
                noCache: false,
                autoSelectFirst: false,
                serviceUrl: $.yourshop.shopUrl + 'search/',
                appendTo: that.closest('form'),
                formatResult: function (suggestion, curVal) {
                    var currentValue = curVal.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                    var pattern = '(' + currentValue + ')';
                    return "<a href='" + suggestion.url + (suggestion.showAll ? "?query="+curVal : "") + "' " + (suggestion.showAll ? "class='show-all'" : "") + ">" + suggestion.image + (suggestion.showAll ? $.yourshop.translate("Show all") : suggestion.value.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>')) + "</a><div class='autocomplete-price'>" + suggestion.price + "</div>";
                },
                transformResult: function (response) {
                    var suggestions = [];
                    $.each($(response).find(".product-list li"), function (i, item) {
                        if (i == 5) {
                            suggestions[i] = {url: $.yourshop.shopUrl + 'search/', image: '', value: '', price: '', showAll: true};
                            return false;
                        }
                        item = $(item);
                        suggestions[i] = {url: item.find("h5 a").attr("href"), image: item.find(".image").data("small"), value: item.find("h5 a .thumbs").text(), price: item.find(".prices").html(), showAll: false};
                    });
                    return {
                        suggestions: suggestions
                    };
                },
                beforeRender: function (container) {
                    container.css('top', that.outerHeight());
                },
                onSearchStart: function () {
                    $(this).addClass("autocomplete-loader");
                },
                onSearchComplete: function () {
                    $(this).removeClass("autocomplete-loader");
                },
                onSelect: function (suggestion) {
                    location.href = suggestion.url;
                }
            };
            $(this).autocomplete(options);
        });
    }
    // Счетчик Промо
    if ($.fn.countdowntimer) {
        $('.js-promo-countdown').each(function () {
            var $this = $(this).html('');
            var id = ($this.attr('id') || 'js-promo-countdown' + ('' + Math.random()).slice(2));
            $this.attr('id', id);
            var start = $this.data('start').replace(/-/g, '/');
            var end = $this.data('end').replace(/-/g, '/');
            $this.countdowntimer({
                startDate: start,
                dateAndTime: end,
                size: 'md'
            });
        });
    }
    
});