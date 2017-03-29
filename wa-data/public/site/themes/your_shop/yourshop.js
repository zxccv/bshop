jQuery(document).ready(function ($) {

    /* On load */
// Кнопка поиска
    $(".search > .search-button").click(function () {
        var that = $(this);
        var form = that.parent().find("form");
        if (form.hasClass("hidden-search")) {
            if (!that.hasClass("open")) {
                form.slideDown('fast');
                that.addClass("open active").find("i").addClass("active");
                $(".search-input-field", form).focus();
            } else if ($.trim(form.find(".search-input-field").val()) !== '') {
                form.submit();
            } else {
                form.slideUp('fast');
                that.removeClass("open active").find("i").removeClass("active");
            }
        } else {
            form.submit();
        }
    });

// Всплывающие окна верхнего меню для мобильной версии
    $(".mobile .has-popup > a, .mobile .has-popup-mobile > a").click(function () {
        if ($(this).parent().attr("id") == 'cart') {
            var flyForm = $(".fly-cart");
        } else {
            var flyForm = $(this).closest("li").find(".fly-form");
        }
        $(".fly-cart, .fly-form").not(flyForm).hide();
        if (flyForm.length) {
            if (flyForm.is(":visible")) {
                flyForm.fadeOut();
            } else {
                flyForm.fadeIn();
            }
            return false;
        }
    });

// Раскрывание/закрытие категорий
    $(".first.category-list > a").click(function () {
        var that = $(this);
        var ul = that.next();
        var i = that.find("i");
        if (ul.is(":visible")) {
            ul.slideUp();
            i.removeClass("fa-chevron-up").addClass("fa-chevron-down");
            that.parent().removeClass("open");
        } else {
            ul.slideDown();
            i.removeClass("fa-chevron-down").addClass("fa-chevron-up");
            that.parent().addClass("open");
        }
        return false;
    });

// Позиционирование блока с брендами в горизонтальном меню
    $(document).on("mouseenter", "#horizontal-menu .brands-tab", function () {
        var that = $(this),
                brands = that.find("ul.brands"),
                wrap = $(".wrap"),
                tabOffsetL = that.offset().left,
                brandsW = brands.width(),
                wrapW = wrap.width();

        if (tabOffsetL - wrap.offset().left + brandsW > wrapW) {
            brands.css("left", (-1) * (brandsW - wrapW - wrap.offset().left + tabOffsetL));
        }
    });

// Сворачивание, разворачивание категорий, страниц и пр
    $(document).on("click", ".collapsible-icon", function () {
        var btn = $(this);
        var ul = btn.closest("li").children("ul");
        if (ul.hasClass("hidden") || !ul.is(":visible")) {
            btn.removeClass("fa-plus").addClass("fa-minus");
            ul.slideDown("700", function () {
                $(this).removeClass("hidden").addClass("show").removeAttr("style");
            });
        } else {
            btn.removeClass("fa-minus").addClass("fa-plus");
            ul.slideUp("700", function () {
                $(this).addClass("hidden").removeClass("show").removeAttr("style");
            });
        }
        var oldT = btn.attr("title");
        var newT = btn.attr("data-toggle");
        btn.attr("title", newT).attr("data-toggle", oldT);
        return false;
    });

// Позиционирование всплывающего меню
    var positionMenu = function (ul, wrap) {
        var offset = ul.offset();
        if (offset.left - wrap.offset().left + ul.find("a").outerWidth() > wrap.width()) {
            ul.css('left', '-100%');
        } else if (offset.left < 0 || offset.left < wrap.offset().left) {
            ul.css('left', '100%');
        }
    };
    $(document).on("mouseenter", ".categories-block li.dropdown-menu, .pages-block > ul li, .categories-tree li.dropdown-menu", function () {
        var ul = $(this).find("ul");
        if (ul.length) {
            if ($.browser.msie == true) {
                setTimeout(function () {
                    positionMenu(ul, $(".wrap"));
                }, 5);
            } else {
                positionMenu(ul, $(".wrap"));
            }
        }
    });
    $(document).on("mouseenter", ".categories-list > li:last", function () {
        var dropdown = $(this).children(".dropdown");
        if (dropdown.length) {
            var wrap = $(".wrap");
            if (dropdown.offset().left - wrap.offset().left + dropdown.find("a").outerWidth() > wrap.width()) {
                dropdown.css({left: 'inherit', right: 0});
            }
        }
    });
// Аккордеон
    $(document).on("click", ".dropdown.vertical i, .f-collapsible", function () {
        var that = $(this);
        var parent = that.parent();
        if (parent.parent().hasClass("category-heading")) {
            var ul = parent.parent().next();
        } else {
            var ul = parent.next();
        }
        var oldText = that.attr('title');
        var newText = that.attr('data-toggle');
        if (ul.is(":visible")) {
            ul.slideUp('fast');
            if (that.hasClass("f-collapsible")) {
                that.removeClass("fa-minus").addClass("fa-plus");
            } else {
                that.removeClass("fa-chevron-up").addClass("fa-chevron-down");
            }
        } else {
            ul.slideDown('fast');
            if (that.hasClass("f-collapsible")) {
                that.removeClass("fa-plus").addClass("fa-minus");
            } else {
                that.removeClass("fa-chevron-down").addClass("fa-chevron-up");
            }
        }
        that.attr('data-title', oldText).attr('title', newText);
        return false;
    });

    // Всплывающая форма авторизации
    $(document).on("click", ".fly-auth, .dialog.auth-dial .wa-submit a", function () {
        var that = $(this);
        openDialog(function(dialog) {
            $.yourshop.xhr.push($.get(that.attr("href"), function (response) {
                var content = $(response).find(".yourshop-form.auth-form");
                content.find("form").attr("action", that.attr("href"));
                var recaptcha = content.find(".wa-recaptcha");
                if (recaptcha.length) {
                    recaptcha.closest(".wa-value").removeClass();
                }
                dialog.removeClass("is-loading").addClass("auth-dial").find(".temp-loader").remove();
                dialog.find(".content").removeClass("align-center").append(content);
            }, 'html'));
        });
        return false;
    });
    $(document).on("click", ".dialog.auth-dial .wa-submit :submit", function () {
        var that = $(this),
            dialog = that.closest(".dialog"),
            form = dialog.find("form"),
            action = form.attr("action"),
            data = form.serializeArray();
        
        openDialog(function(dialog) {
            $.post(action, data, function (response) {
                var content = $(response).find(".yourshop-form.auth-form");
                if (content.length) {
                    if (content.find(".success-signed").length) {
                        content.find(".success-signed").append("<i class='icon16 loading'></i>");
                        location.reload();
                    } else {
                        content.find("form").attr("action", action);
                    }
                    dialog.removeClass("is-loading").find(".temp-loader").remove();
                    dialog.find(".content").removeClass("align-center").append(content);
                } else {
                    location.reload();
                }
            }, 'html');
        });
       return false;
    });

// Стилизуем поля форм
    $('input[type="text"], input[type="password"], textarea, select').focus(function () {
        var that = $(this);
        if (!that.hasClass("on-focus")) {
            $(this).addClass("on-focus");
        }
        that.removeClass("s-error wa-error");
    }).blur(function () {
        $(this).removeClass("on-focus");
    }).placeholder();

// Категории в каталоге
    $('.not-mobile .categories-tree li.appear-menu').hover(function () {
        $('.categories-tree .dropdown-holder').hide();
        var li = $(this);
        var dropdown = li.find('.dropdown-holder');
        if (!dropdown.length) {
            return false;
        }
        clearTimeout(dropdown.data('timer'));
        if (dropdown.is(':animated')) {
            return false;
        }
        dropdown.show();
    }, function () {
        var dropdown = $(this).find('.dropdown-holder');
        dropdown.data('timer', setTimeout(function () {
            dropdown.hide();
        }, 500));
    });

// Всплывающие окна в верхнем меню
    $('.not-mobile .has-popup').hover(function () {
        var li = $(this);
        if (li.attr("id") == 'cart' && !li.hasClass("has-items")) {
            return false;
        }
        var flycart = li.find('.fly-cart, .fly-form');
        $('.not-mobile .has-popup').find('.fly-cart, .fly-form').not(flycart).hide();
        clearTimeout(flycart.data('timer'));
        if (flycart.is(':animated')) {
            return false;
        }
        flycart.fadeIn();
    }, function () {
        var flycart = $(this).find('.fly-cart, .fly-form');
        flycart.data('timer', setTimeout(function () {
            flycart.fadeOut();
        }, 800));
    });

// Прокрутка страницы 
    $(window).scroll(function () {
        var goTop = $("#go-top");
        if ($(this).scrollTop() > 200) {
            goTop.fadeIn();
        } else {
            goTop.fadeOut();
        }
    });
    $('#go-top a').click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    // Закрытие всплывающих окон
    var closeDialog = function(dialog) {
        $("body").removeClass("dialog-open");
        dialog.removeClass("quick-view-dial auth-dial demo-dial is-loading").hide().find('.content').empty();
        if ($.yourshop.xhr.length) {
            for (var i in $.yourshop.xhr) {
                $.yourshop.xhr[i].abort();
            }
        }
    };
    $(document).keyup(function (e) {
        e.keyCode == 27 && closeDialog($(".dialog:visible"));
    });
    // Закрытие всплывающей формы
    $(".dialog-window").click(function (e) {
        if (!$(e.target).closest(".content").length) {
            $(".dialog-close").click();
        }
    });
    $('.dialog').on('click', 'a.dialog-close', function () {
        closeDialog($(this).closest('.dialog'));
        return false;
    });

// Появлениие/исчезание формы подписки в футере
    $(".subscribe-block-heading").click(function () {
        if ($(".subscribe-block").css('display') == 'block') {
            var that = $(this);
            var inputs = that.next(".inputs");
            if (inputs.is(":visible")) {
                inputs.slideUp();
            } else {
                inputs.slideDown();
            }
        }
    });

// Нажатие кнопки открытия доп. меню в фикс. меню в мобильной версии
    $(".header-menu-block > a").click(function () {
        var menuBlock = $(this).closest("li");
        var visibleLi = menuBlock.siblings(":visible").not(".mobile-block");
        var hiddenLi = menuBlock.siblings(":hidden");
        if (visibleLi.length) {
            visibleLi.fadeOut(function () {
                $(this).addClass("hidden").removeAttr("style");
                hiddenLi.fadeIn();
            });
        } else {
            hiddenLi.fadeIn();
        }
    });

// Открытие/закрытие сайдбара каталога мобильной версии
    $(".f-open-sidebar").click(function () {
        var that = $(this);
        var sidebar = $(".category-sidebar, .has-mobile-sidebar .sidebar");
        if (that.hasClass("opened")) {
            sidebar.animate({left: sidebar.hasClass("fb-page") ? '-315px' : '-250px'}, 500, function () {
                that.removeClass("opened").find("i").removeClass("fa-angle-double-left").addClass("fa-angle-double-right");
            });
        } else {
            sidebar.animate({left: 0}, 500, function () {
                that.addClass("opened").find("i").removeClass("fa-angle-double-right").addClass("fa-angle-double-left");
            });
        }
    });

// Нажатие кнопки "Меню" в мобильной версии
    $(".mobile-menu").click(function () {
        var catBlock = $(".mobile-categories-block");
        if (catBlock.is(":visible")) {
            catBlock.slideUp(function () {
                $(this).addClass("hidden").removeClass("show").removeAttr("style");
            });
            $(this).removeClass("selected");
        } else {
            catBlock.slideDown(function () {
                $(this).removeClass("hidden").addClass("show").removeAttr("style");
            });
            $(this).addClass("selected");
        }
    });

// Закрытие подстраниц в мобильной версии
    $(".mobile-close").click(function () {
        $(this).closest(".dropdown, .dropdown-holder").hide();
    });

// Появление подстраниц в мобильной версии
    $(".mobile .pages-block ul.menu-h > li > a").click(function () {
        var dropdown = $(this).next(".dropdown");
        if (dropdown.length && !dropdown.is(":visible")) {
            dropdown.show();
            return false;
        }
    });

// Появление/исчезание валют в мобильной версии
    $(".mobile .currency-block > a").click(function () {
        var ul = $(this).next();
        if (ul.is(":visible")) {
            ul.hide();
        } else {
            ul.show();
        }
        return false;
    });

// Валюты
    $(".currencies li, .currencies a").click(function () {
        var url = location.href;
        if (url.indexOf('?') == -1) {
            url += '?';
        } else {
            url += '&';
        }
        location.href = url + 'currency=' + $(this).data('code');
    });

// Появление/исчезание информационных страниц в мобильной версии
    $(document).on("click", ".mobile .more-tab a", function () {
        var dropdown = $(this).next(".dropdown");
        if (dropdown.length && !dropdown.is(":visible")) {
            dropdown.show();
        } else {
            dropdown.hide();
        }
    });

// Всплывание окон для мобильной версии
    $(document).on("click", ".mobile .dropdown  li > a, .mobile .categories-list > li > a, .mobile .categories-tree .h4 > a, .mobile .more-block", function (event) {
        var a = $(this).parent(".h4").length ? $(this).parent(".h4") : $(this);
        var insideBlock = a.next(".dropdown-holder, ul");
        if (insideBlock.length && !insideBlock.hasClass("visible") && !a.children(".f-collapsible, .collapsible-icon").length) {
            $(".categories-list .dropdown, .pages-block .dropdown, .currencies, .categories-tree .dropdown-menu ul.menu-v, .dropdown-holder, .more .dropdown")
                    .not($(event.target).parents(".dropdown"))
                    .not($(event.target).parents(".appear-menu").find("ul"))
                    .not($(event.target).parents("ul"))
                    .not($(event.target).parents(".dropdown-holder")).removeClass("visible").hide();
            insideBlock.addClass("visible").show();
            return false;
        }
    });

// Закрытие всплывающих окон в мобильной версии при нажатии на любую часть экрана
    $(".mobile .main-wrapper").click(function (e) {
        if (!$(e.target).parents(".dropdown").length && !$(e.target).parent().parent(".categories-list").length) {
            $(".categories-list .dropdown, .pages-block .dropdown, .currencies, .categories-tree .dropdown-menu ul.menu-v, .dropdown-holder, .more .dropdown").removeClass("visible").hide();
        }
    });
// Просмотренные
    $(document).on("click", ".viewed-link", function () {
        var that = $(this);
        var viewed = $.cookie('shop_yourshop_viewed');
        var viewedBlock = $(".viewed-block");
        var url = $.yourshop.shopUrl + "search/?title=" + $.yourshop.translate('Viewed+products') + "&viewed_products=1";
        if (viewed) {
            viewed = viewed.split(',');
        } else {
            viewed = [];
        }
        var i = $.inArray(that.data('product') + '', viewed);
        if (i != -1) {
            viewed.splice(i, 1);
        }
        if (!that.hasClass("active")) {
            viewed.push(that.data('product'));
            $(".viewed-link[data-product='" + that.data('product') + "']").addClass("active");
            that.attr('title', $.yourshop.translate('Remove from Viewed list?'));
            viewedBlock.removeClass("grey");
            $.cookie('shop_yourshop_viewed', viewed.join(','), {expires: 30, path: $.yourshop.siteUrl});
            flyFormAction(that, "viewed", "add");
        } else {
            if (viewed.length) {
                $.cookie('shop_yourshop_viewed', viewed.join(','), {expires: 30, path: $.yourshop.siteUrl});
                viewedBlock.removeClass("grey");
            } else {
                url = 'javascript:void(0)';
                $.cookie('shop_yourshop_viewed', null, {expires: 30, path: $.yourshop.siteUrl});
                viewedBlock.addClass("grey");
            }

            $(".viewed-link[data-product='" + that.data('product') + "']").removeClass("active");
            flyFormAction(that, "viewed", "delete");
        }
        viewedBlock.attr('href', url).find(".indicator").text(viewed.length);
        return false;
    });

// Сравнение
    $(document).on("click", ".compare-link", function () {
        var that = $(this);
        var compare = $.cookie('shop_compare');
        var compareBlock = $(".compare-block");
        if (compare) {
            compare = compare.split(',');
        } else {
            compare = [];
        }
        var i = $.inArray(that.data('product') + '', compare);
        if (i != -1) {
            compare.splice(i, 1);
        }
        if (!that.hasClass("active")) {
            if (compareBlock.hasClass("grey")) {
                var url = $.yourshop.shopUrl + 'compare/' + that.data('product') + '/';
            } else {
                var href = compareBlock.attr('href');
                var url = href.substr(0, href.length - 1) + ',' + that.data('product') + '/';
            }
            compare.push(that.data('product'));
            $(".compare-link[data-product='" + that.data('product') + "']").addClass("active");
            that.attr('title', $.yourshop.translate('Remove from compare list?'));
            compareBlock.removeClass("grey");
            $.cookie('shop_compare', compare.join(','), {expires: 30, path: $.yourshop.siteUrl});
            var action = "add";
            bouncePopup(compareBlock.parent(), "+ " + $.yourshop.translate('Added to compare list'));
        } else {
            if (compare.length) {
                var url = $.yourshop.shopUrl + 'compare/' + compare.join(',') + '/';
                compareBlock.removeClass("grey");
                $.cookie('shop_compare', compare.join(','), {expires: 30, path: $.yourshop.siteUrl});
            } else {
                var url = 'javascript:void(0)';
                compareBlock.addClass("grey");
                $.cookie('shop_compare', null, {expires: 30, path: $.yourshop.siteUrl});
            }
            var action = "delete";
            $(".compare-link[data-product='" + that.data('product') + "']").removeClass("active");
            that.attr('title', $.yourshop.translate('Add to compare list?'));
            if (!that.hasClass("f-without-popup")) {
                bouncePopup(compareBlock.parent(), "- " + $.yourshop.translate('Removed from compare list'));
            }
        }
        compareBlock.attr('href', url).find(".indicator").text(parseInt(compare.length));
        flyFormAction(that, "compare", action);
        return false;
    });

// Избранное
    $(document).on("click", ".favourite-link", function () {
        var that = $(this);
        var favourite = $.cookie('shop_yourshop_favourite');
        var favouriteBlock = $(".favourite-block");
        var url = $.yourshop.shopUrl + "search/?title=" + $.yourshop.translate('Wish+list') + "&favourite=1";
        if (favourite) {
            favourite = favourite.split(',');
        } else {
            favourite = [];
        }
        var i = $.inArray(that.data('product') + '', favourite);
        if (i != -1) {
            favourite.splice(i, 1);
        }
        if (!that.hasClass("active")) {
            favourite.push(that.data('product'));
            $(".favourite-link[data-product='" + that.data('product') + "']").addClass("active");
            that.attr('title', $.yourshop.translate('Remove from Wish list?'));
            favouriteBlock.removeClass("grey");
            $.cookie('shop_yourshop_favourite', favourite.join(','), {expires: 30, path: $.yourshop.siteUrl});
            flyFormAction(that, "favourite", "add");
            bouncePopup(favouriteBlock.parent(), "+ " + $.yourshop.translate('Added to Wish list'));
        } else {
            if (favourite.length) {
                $.cookie('shop_yourshop_favourite', favourite.join(','), {expires: 30, path: $.yourshop.siteUrl});
                favouriteBlock.removeClass("grey");
            } else {
                url = 'javascript:void(0)';
                $.cookie('shop_yourshop_favourite', null, {expires: 30, path: $.yourshop.siteUrl});
                favouriteBlock.addClass("grey");
            }

            $(".favourite-link[data-product='" + that.data('product') + "']").removeClass("active");
            that.attr('title', $.yourshop.translate('Add to Wish list?'));
            flyFormAction(that, "favourite", "delete");
            if (!that.hasClass("f-without-popup")) {
                bouncePopup(favouriteBlock.parent(), "- " + $.yourshop.translate('Removed from Wish list'));
            }
        }
        favouriteBlock.attr('href', url).find(".indicator").text(favourite.length);
        return false;
    });

    $(".yourshop-popup-link").click(function () {
        $.fancybox.open($(this).closest(".yourshop-popup-box").find(".yourshop-popup-content"));
        return false;
    });

    var updateFlyCart = function (data) {
        $(".cart-total, .fly-cart .total").html(data.total);
        $("#cart").find(".indicator").text(data.count);
        $(".fly-discount .discount").html(data.discount);
        $(".cart-discount").html('&minus; ' + data.discount);
    };
    // Удаление товаров из летающей корзины
    $(document).on("click", ".fly-cart a.delete", function () {
        var btn = $(this);
        var id = btn.data('id');

        if (!confirm($.yourshop.translate("Do you really want to delete product from cart?"))) {
            return false;
        }
        btn.html('<i class="fa fa-spin fa-spinner"></i>');
        $.post($.yourshop.shopCartUrl + 'delete/?html=' + ($.yourshop.ruble == 'html' ? '1' : '0'), {id: id}, function (response) {
            btn.html("x");
            btn.closest(".fly-item").slideUp(function () {
                $(this).remove();
            });
            $("#cart .indicator").text(response.data.count);
            updateFlyCart(response.data);
            if (response.data.count > 0) {
                $(".cart-page .cart-row[data-id='" + id + "']").remove();
            } else {
                $("#cart").removeClass("has-items").find(".indicator").hide();
                $(".cart-total").html($.yourshop.translate("Cart is empty"));
                $(".fly-content").html("<p>" + $.yourshop.translate("Cart is empty") + "</p>");
            }
        }, "json");
        return false;
    });

    // Изменение количества товаров
    var changeQuantity = function (that, callback) {
        var item = that.closest(".fly-item");
        var id = item.data("id");
        var tr = $(".cart-page .cart-row[data-id='" + id + "']");
        var cartQty = tr.find(".qty");
        if (that.val() > 0) {
            if (that.val()) {
                that.prop("disabled", true);
                $.post($.yourshop.shopCartUrl + 'save/?html=' + ($.yourshop.ruble == 'html' ? '1' : '0'), {id: id, quantity: that.val()}, function (response) {
                    that.prop("disabled", false);
                    tr.find(".item-total").html(response.data.item_total);
                    item.find(".price").html(response.data.item_total);
                    if (response.data.q) {
                        that.val(response.data.q);
                    }
                    cartQty.val(that.val());
                    if (response.data.error) {
                        alert(response.data.error);
                    }
                    if (callback) {
                        callback.call();
                    }
                    updateFlyCart(response.data);
                }, "json");
            }
        } else {
            that.val(1);
            cartQty.val(1);
            item.find("input.qty").change();
        }
    };
    $(document).on("change", ".fly-item input.qty", function () {
        changeQuantity($(this));
    });
    $(document).on("click", ".f-minus", function () {
        var btn = $(this);
        var i = btn.find("i");
        var qty = btn.next();
        if (!i.hasClass("fa")) {
            i.removeClass().addClass("fa fa-refresh fa-spin");
            qty.val(function (i, oldval) {
                if (parseInt(oldval, 10) > 1) {
                    return --oldval;
                } else {
                    return 1;
                }
            });
            changeQuantity(qty, function () {
                i.removeClass().addClass("ys ys-larr");
            });
        }
    });
    $(document).on("click", ".f-plus", function () {
        var btn = $(this);
        var i = btn.find("i");
        var qty = btn.prev();
        if (!i.hasClass("fa")) {
            i.removeClass().addClass("fa fa-refresh fa-spin");
            qty.val(function (i, oldval) {
                if (parseInt(oldval, 10) < 1) {
                    return 1;
                } else {
                    return ++oldval;
                }
            });
            changeQuantity(qty, function () {
                i.removeClass().addClass("ys ys-rarr");
            });
        }
    });
    
    $(window).resize();

    /* До загрузки страницы */
    // Обработка форм подписки
    if ($(".mini-subscribe .wa-subscribe-form").length) {
        $(".mini-subscribe .wa-subscribe-form .wa-value-input").each(function () {
            var that = $(this);
            var input = that.find("input[type='text']");
            var label = that.closest(".wa-field").find("label");
            if (!input.attr("placeholder")) {
                var placeholderText = label.text();
                if (placeholderText) {
                    input.attr("placeholder", placeholderText);
                }
            }
            label.remove();
        });
    }

    // Инициализация строки поиска
    var searchResize = function () {
        var searchForm = $(".header-top .search-input-field").closest("form");
        if (searchForm.length) {
            if (window.innerWidth <= 755) {
                if (!searchForm.hasClass("hidden-search")) {
                    searchForm.addClass("mobile hidden-search").hide();

                }
            } else if (searchForm.hasClass("mobile hidden-search")) {
                searchForm.removeClass("mobile hidden-search").show();
                $(".search-button").addClass("active");
            }
        }
    };

    searchResize();

    $(".categories-list .menu-v.brands").addClass("dropdown");
    /* Формирование вкладки "Еще" для категорий 
     ------------------------------------------------------*/
    var categoriesblock = $(".categories-block > ul");
    var more = [];
    var resizeCategoriesBlock = function (categoriesblock) {
        var horizontalMenu = $("#horizontal-menu");
        var categories = $('.categories-block');

        if (!categories.is(":visible")) {
            return false;
        }

        horizontalMenu.removeClass("resized");
        // Вкладка "Еще" в меню
        // Если уже существует вкладка "Еще", то прячем ее
        var moreTab = categories.next(".more");
        if (moreTab.length) {
            moreTab.hide();
        }
        // Узнаем высоту блока навигации
        var height = horizontalMenu.height();

        // Если высота больше допустимого уровня, то собираем все вкладки, которые вышли за пределы
        if (height > '65') {
            while (height > '65') {
                var last = categoriesblock.children().last();
                more.push(last);
                last.remove();
                height = horizontalMenu.height();
            }
            // Добавляем вкладку "Еще", чтобы проверить не происходит ли смещение
            categories.after("<div class='more'><ul><li><div class='more-block'><i class='fa fa-bars'></i></div><ul class='menu-v dropdown vertical'></ul></li></ul></div>");
            height = horizontalMenu.height();

            // Если смещение произошло, то убираем еще один пункт навигации
            if (height > '65') {
                categories.next(".more").remove();
                var last = categoriesblock.children().last();
                more.push(last);
                last.remove();
            } else {
                categories.next(".more").remove();
            }

            var html = "";
            // Клонируем объект со скрытыми вкладками 
            var moreClon = [];
            $.each(more, function (i, k) {
                moreClon.push($(k).clone());
            });
            // Функция, формирующая пункты во вкладке "Еще"
            var createMoreTabInsideLi = function (moreClon) {
                var html = "";
                $.each(moreClon, function () {
                    var that = $(this);
                    var ul = that.children("ul");
                    if (ul.length) {
                        that.children("a").append("<i class='fa fa-chevron-down'></i>");
                    }
                    that.find(".dropdown").removeClass("dropdown");
                    that.find("i.fa-chevron-right").removeClass("fa-chevron-right").addClass("fa-chevron-down");
                    html += "<li>" + that.html() + "</li>";
                });
                return html;
            };

            if (!moreTab.length) {
                html = "<div class='more'><ul><li>" +
                        "<div class='more-block'><i class='fa fa-bars'></i></div>" +
                        "<ul class='menu-v dropdown vertical'>" +
                        createMoreTabInsideLi(moreClon) +
                        "</ul>" +
                        "</li></ul></div>";
            } else {
                html += createMoreTabInsideLi(moreClon);
                moreTab.find(".dropdown").html(html);
            }

            if (moreTab.length) {
                moreTab.show();
            } else {
                categories.after(html);
            }
        } else if (moreTab.length) {
            if (more.length) {
                categoriesblock.append(more.pop());
                resizeCategoriesBlock($(".categories-block > ul"));
            }
        }
        horizontalMenu.addClass("resized");
    };
    resizeCategoriesBlock(categoriesblock);
    /* --------------------------------------------------------- */
    /* Формирование вкладки "Еще" для статических страниц 
     ------------------------------------------------------*/
    var pagesblock = $(".pages-block > ul");
    var morePages = [];
    var resizePagesBlock = function (pagesblock) {
        var headerTop = $('.header-top');
        headerTop.removeClass("resized");
        // Вкладка "Еще" в меню
        // Если уже существует вкладка "Еще", то прячем ее
        var moreTab = pagesblock.children(".more-tab");
        if (moreTab.length) {
            moreTab.hide();
        }
        // Узнаем высоту блока навигации
        var height = headerTop.height();

        // Если высота больше допустимого уровня, то собираем все вкладки, которые вышли за пределы
        if (height > '50') {
            while (height > '50') {
                var last = moreTab.length ? pagesblock.children().eq(-2) : pagesblock.children().last();
                morePages.push(last);
                last.remove();
                height = headerTop.height();
            }
            // Добавляем вкладку "Еще", чтобы проверить не происходит ли смещение
            pagesblock.append("<li class='more-tab'><a href='javascript:void(0)'><i class='fa fa-bars'></i></a></li>");
            height = headerTop.height();

            // Если смещение произошло, то убираем еще один пункт навигации
            if (height > '50') {
                pagesblock.children().last().remove();
                var last = moreTab.length ? pagesblock.children().eq(-2) : pagesblock.children().last();
                morePages.push(last);
                last.remove();
            } else {
                pagesblock.children().last().remove();
            }

            var html = "";
            // Клонируем объект со скрытыми вкладками 
            var moreClon = [];
            $.each(morePages, function (i, k) {
                moreClon.push($(k).clone());
            });
            // Функция, формирующая пункты во вкладке "Еще"
            var createMoreTabInsideLi = function (moreClon) {
                var html = "";
                $.each(moreClon, function () {
                    var a = $(this).children("a");
                    a.find("i").remove();
                    html += "<li>" + a.prop('outerHTML') + "</li>";
                });
                return html;
            };

            if (!moreTab.length) {
                html = "<li class='more-tab'>" +
                        "<a href='javascript:void(0)'><i class='fa fa-bars'></i></a>" +
                        "<ul class='menu-v dropdown'>" +
                        createMoreTabInsideLi(moreClon) +
                        "</ul>" +
                        "</li>";
            } else {
                html += createMoreTabInsideLi(moreClon);
                moreTab.find(".dropdown").html(html);
            }

            if (moreTab.length) {
                moreTab.show();
            } else {
                pagesblock.append(html);
            }
        } else if (moreTab.length) {
            if (morePages.length) {
                moreTab.before(morePages.pop());
                resizePagesBlock($(".pages-block > ul"));
            }
        }
        headerTop.addClass("resized");
    };

    resizePagesBlock(pagesblock);
    $(window).bind('load resize', function () {
        resizePagesBlock($(".pages-block > ul"));
    });

    $(window).resize(function () {
        searchResize();
        if (window.innerWidth <= 760 || ($.browser.safari && $(window).width() <= 760)) {
            $("#horizontal-menu .more").hide();
        } else {
            resizeCategoriesBlock($(".categories-block > ul"));
        }
    });

});

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function defaultInputValue(input, cssClass) {
    if (!(input instanceof jQuery)) {
        input = $(input);
    }
    var defValue = input.attr('placeholder');
    var onBlur = function () {
        var v = input.val();
        if (!v || v == defValue) {
            input.val(defValue);
            input.addClass(cssClass);
        }
    };
    onBlur();
    input.blur(onBlur);
    input.focus(function () {
        if (input.hasClass(cssClass)) {
            input.removeClass(cssClass);
            input.val('');
        }
    });
}
function bouncePopup(elemToFall, message) {
    $(".bounce-popup").text(message);
    var popup = $(".bounce-popup");
    var offset = elemToFall.offset();
    var w = elemToFall.width();
    var dh = popup.outerHeight() + 15;
    var dw = popup.width();
    var initLeft = offset.left + w / 2 - dw / 2;
    var finalTop = dh;

    clearTimeout(popup.data('timer'));
    if (popup.is(":animated")) {
        return false;
    }
    popup.css({
        left: initLeft,
        top: offset.top - $(window).scrollTop() - dh - 100,
        display: 'block',
        position: 'fixed'
    }).animate({
        left: initLeft,
        top: finalTop,
        opacity: 1
    }, 250).animate({
        top: finalTop - 10
    }, 150).animate({
        top: finalTop
    }, 100, function () {
        var that = $(this);
        popup.data('timer', setTimeout(function () {
            that.hide();
        }, 1500));
    });
}
function flyFormAction(link, blockId, action) {
    var block = $(".fly-form.white-popup." + blockId);
    if (block.length) {
        var id = link.data("product");
        if (action == 'add') {
            if (!block.find("li[data-id='" + id + "']").length) {
                if (block.find(".empty-field").length) {
                    block.find(".empty-field").remove();
                    block.find(".content").append("<ul class='menu-h'></ul>");
                }
                var productItem = link.closest(".product-item");
                if (productItem.length) {
                    var image = productItem.find(".image").data("small");
                    var href = productItem.find("h5 a").attr("href");
                    var name = escapeHtml(productItem.find("h5 a").attr("title"));
                } else {
                    productItem = link.closest(".product-page");
                    var image = productItem.find(".images .image").attr("data-small");
                    var href = location.href;
                    var name = productItem.find("h1").html();
                }
                var hide = 0;
                if (block.find("li").length > 7) {
                    hide = 1;
                }
                block.find("ul").append("<li data-id='" + id + "'" + (hide ? " class='hidden'" : "") + "><a href='" + href + "' title='" + name + "'>" + image + "</a><a href='javascript:void(0)' data-product='" + id + "' class='delete active f-without-popup " + (blockId == 'compare' ? 'compare-link' : (blockId == 'favourite' ? 'favourite-link' : 'viewed-link')) + "' title='" + $.yourshop.translate('Delete') + "'>x</a></li>");

                if (hide) {
                    block.find(".show-all").css('display', 'block');
                }
                if (blockId == 'compare') {
                    block.find(".show-all").attr("href", $(".compare-block").attr('href'));
                }
            }
        } else if (action == 'delete') {
            block.find("li[data-id='" + id + "']").remove();
            var hiddenRow = block.find("li.hidden");
            var hiddenRowCount = hiddenRow.length;
            if (block.find("li:not(.hidden)").length <= 8) {
                if (hiddenRowCount) {
                    hiddenRow.first().removeClass("hidden");
                }
                if (hiddenRowCount - 1 <= 0 && !$.yourshop.mobile) {
                    block.find(".show-all").hide();
                }
            }
            if (blockId == 'compare') {
                block.find(".show-all").attr("href", $(".compare-block").attr('href'));
            }
            if (block.find("li").length == 0) {
                block.find(".content").html("<div class='empty-field'>" + $.yourshop.translate("No products") + "</div>");
            }
        }

    }
}
function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function openDialog(callback) {
    var dialog = $('#dialog');
    if (!dialog.hasClass("is-loading")) {
        dialog.addClass("is-loading").show(function () {
            $("body").addClass("dialog-open");
        }).find(".content").addClass("align-center").html('<span class="temp-loader"><i class="icon16 loading3" style="vertical-align: middle;"></i> ' + $.yourshop.translate("Wait, please. Information is loading") + '</span>');
        if (!dialog.find(".dialog-close").length) {
            dialog.find(".content").prepend('<a href="#" class="dialog-close">x</a>');
        }
        callback.call(null, dialog);
    }
    return false;
}