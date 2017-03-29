jQuery(document).ready(function ($) {
    $(".slider-range").each(function () {
        var slider = $(this);
        var priceFilter = slider.parent();
        var min = priceFilter.find(".min");
        var max = priceFilter.find(".max");
        slider.slider({
            range: true,
            min: parseFloat(min.attr('placeholder')),
            max: parseFloat(max.attr('placeholder')),
            step: (parseFloat(max.attr('placeholder')) - parseFloat(min.attr('placeholder'))) <= 5 ? 0.1 : 1,
            values: [parseFloat(min.val().length ? min.val() : min.attr('placeholder')),
                parseFloat(max.val().length ? max.val() : max.attr('placeholder'))],
            slide: function (event, ui) {
                var v = ui.values[0] == $(this).slider('option', 'min') ? '' : ui.values[0];
                min.val(v ? v : '');
                v = ui.values[1] == $(this).slider('option', 'max') ? '' : ui.values[1];
                max.val(v ? v : '');
            },
            stop: function (event, ui) {
                min.change();
            }
        });
        min.add(max).change(function () {
            var v_min = parseFloat(min.val()) || slider.slider('option', 'min');
            var v_max = parseFloat(max.val()) || slider.slider('option', 'max');
            if (v_max >= v_min) {
                slider.slider('option', 'values', [v_min, v_max]);
            }
        });
    });

    var requestTrack = [];
    var ajax_function = function (elem) {
        $(window).lazyLoad && $(window).lazyLoad('sleep');
        $(requestTrack).each(function (i, jqXHR) {
            jqXHR.abort();
            requestTrack.splice(i, 1);
        });

        if (!elem.hasClass("filter-delete")) {
            var label = elem.next("label");
            if (elem.hasClass("f-price")) {
                label = elem.closest(".price-inputs");
            } else if (elem.hasClass("hidden")) {
                label = elem.closest(".filter-field");
            }
            label.find(".loading").remove();
            label.append("<i class='icon16 loading'></i>");
        } else {
            elem.html("<i class='icon16 loading'></i>");
            elem.siblings("input").remove();
        }

        var f = elem.closest('form');
        var fields = f.serializeArray();
        var params = [];
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].value !== '') {
                params.push(fields[i].name + '=' + fields[i].value);
            }
        }
        var url = '?' + params.join('&');
        $.ajax({
            type: 'get',
            url: url,
            cache: false,
            beforeSend: function (jqXHR) {
                requestTrack.push(jqXHR);
            },
            success: function (html) {
                if (elem.hasClass("filter-delete")) {
                    elem.closest(".filter-field").remove();
                } else {
                    label.find(".loading").remove();
                }
                $('.bottom-paging').hide();
                var productList = $(html).find('#product-list .product-list').children();
                if (productList.length) {
                    $(".sort-view").show();
                    $('#product-list .product-list').html(productList);
                    var newPagingBott = $(html).find('.bottom-paging');
                    if (!$('.bottom-paging').length && newPagingBott.length) {
                        $('#product-list .product-list').after(newPagingBott.prop('outerHTML'));
                    } else if (newPagingBott.length) {
                        $('.bottom-paging').html(newPagingBott.html()).show();
                    }
                    $(".found-info").html($(html).find(".found-info").html()).show();
                    if ($(html).find('.lazyloading-paging').length) {
                        $('.lazyloading-paging').html($(html).find('.lazyloading-paging').html());
                    } else {
                        $('.lazyloading-paging').html('');
                    }
                    if (!!(history.pushState && history.state !== undefined)) {
                        window.history.pushState({}, '', url);
                    }
                    $(window).lazyLoad && $(window).lazyLoad('reload');
                } else {
                    $('#product-list .product-list').empty().append("<li>" + $(html).find('#product-list').html() + "</li>");
                    $(".sort-view, .found-info").hide();
                }
            },
            error: function () {
                if (elem.hasClass("filter-delete")) {
                    elem.html("X");
                } else {
                    label.find(".loading").remove();
                }
            }
        });
    };
    $('.filters.ajax form input').change(function () {
        ajax_function($(this));
    });

    $(".filter-field").each(function (i, v) {
        var parent = $(this);
        if (!parent.hasClass("checked")) {
            parent.find("input").prop("checked", false);
        } else {
            parent.find("input").prop("checked", true);
        }
    });

    $(".filter-select").change(function () {
        var select = $(this);
        if (select.val() !== '' && !$('#fil-' + select.data("fid") + '-' + select.val()).length) {
            select.closest(".filter-value").append("<div class='filter-field' id='fil-" + select.data("fid") + "-" + select.val() + "'><input type='hidden' class='hidden' name='" + select.data("code") + "[]' value='" + select.val() + "' />" + select.find(":selected").html() + " <a href='javascript:void(0)' class='filter-delete' title='" + $.yourshop.translate("delete") + "'>X</a></div>");
            $("#fil-" + select.data("fid") + "-" + select.val() + " input").change();
            ajax_function($("#fil-" + select.data("fid") + "-" + select.val() + " input"));
        }
        select.prop('selectedIndex', 0);
        return false;
    });
    $(".filter-select").prop('selectedIndex', 0);
    $(document).on("click", ".filter-delete", function () {
        $(this).parent().find('input').attr('disabled', 'disabled').change();
        ajax_function($(this));
    });

    // Открытие / закрытие фильтра
    $(".filter-block > a").click(function (e) {
        if ($(e.target).is('span.q')) {
            return;
        }
        var that = $(this);
        var i = that.find("i");
        var filterBlock = that.closest(".filter-block");
        var id = filterBlock.data("id");
        var filter = $.cookie('product_filter');
        if (filter) {
            filter = filter.split(',');
        } else {
            filter = [];
        }
        var k = $.inArray(id + '', filter);
        if (k != -1) {
            filter.splice(k, 1);
        }
        if (i.hasClass("open")) {
            i.removeClass("open fa-chevron-down").addClass("close fa-chevron-right");
            filterBlock.find(".filter-value").slideUp();
        } else {
            i.removeClass("close fa-chevron-right").addClass("open fa-chevron-down");
            filterBlock.find(".filter-value").slideDown();
            filter.push(id);
        }
        $.cookie('product_filter', filter.join(','), {expires: 30, path: $.yourshop.shopUrl});
    });

    var filter = $.cookie('product_filter');
    if (filter) {
        filter = filter.split(',');
    } else {
        filter = [];
    }
    if (filter) {
        $.each(filter, function (i, v) {
            $(".filter-block[data-id='" + v + "']").addClass("open").find(".fa").removeClass("fa-chevron-right close").addClass("fa-chevron-down open");
        });
    }
});