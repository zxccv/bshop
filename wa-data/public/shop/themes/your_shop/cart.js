$(function () {

    // Обновление цен и количества 
    function updateCart(data)
    {
        $("#cart .cart-total, .fly-cart .total").html(data.total);
        $(".cart-page .cart-total").html(data.total);
        if (data.discount_numeric) {
            $(".cart-discount").parent().show();
        }
        $(".cart-discount").html('&minus; ' + data.discount);
        $(".fly-discount .discount").html(data.discount);
        $("#cart .indicator").text(data.count);

        if (data.add_affiliate_bonus) {
            $(".affiliate").show().find(".points").text(data.add_affiliate_bonus.match(/\+\d+\.?\d*/));
        } else {
            $(".affiliate").hide();
        }
        // Минимальная сумма заказа
        var cartError = 0;
        if ($.yourshop.minorderSum > 0) {
            var total = parseFloat(data.total.replace(",", ".").replace(/[^\d\.]/g, ""));
            if (total < $.yourshop.minorderSum) {
                $(".cart-page .cart-error .cart-sum-error").show();
                cartError = 1;
            } else {
                $(".cart-page .cart-error .cart-sum-error").hide();
            }
        }
        if ($.yourshop.minorderCount > 0) {
            if (data.count < $.yourshop.minorderCount) {
                $(".cart-page .cart-error .cart-count-error").show();
                cartError = 1;
            } else {
                $(".cart-page .cart-error .cart-count-error").hide();
            }
        }
        if (cartError) {
            $(".cart-page .checkout > .float-right").hide().find(":submit").prop("disabled", true);
            $(".cart-page .cart-error").show();
        } else {
            $(".cart-page .checkout > .float-right").show().find(":submit").prop("disabled", false);
            $(".cart-page .cart-error").hide();
        }
    }

    // Удаление товара
    $(".cart-page a.delete").click(function () {
        if (!confirm($.yourshop.translate("Do you really want to delete product from cart?"))) {
            return false;
        }
        var that = $(this);
        var cartRow = that.closest('.cart-row');
        var id = cartRow.data('id');
        that.html('<i class="fa fa-spin fa-spinner"></i>');
        $.post('delete/', {html: ($.yourshop.ruble == 'html' ? 1 : 0), id: id}, function (response) {
            if (response.data.count == 0) {
                location.reload();
            }
            cartRow.fadeOut(function () {
                $(this).remove();
            });
            $(".fly-item[data-id='" + id + "']").remove();
            updateCart(response.data);

            // Товары-комплекты
            if (typeof $.itemsetsFrontend !== 'undefined') {
                $.itemsetsFrontend.cartDelete(that);
            }

            // Гибкие скидки
            if (typeof $.flexdiscountFrontend !== 'undefined') {
                $.flexdiscountFrontend.cartChange();
            }
        }, "json");
        return false;
    });

    // Изменение услуг
    $(".cart-page .services input:checkbox").change(function () {
        var that = $(this);
        var cartRow = that.closest('.cart-row');
        var obj = $('select[name="service_variant[' + cartRow.data('id') + '][' + that.val() + ']"]');
        if (obj.length) {
            if (that.is(':checked')) {
                obj.removeAttr('disabled');
            } else {
                obj.attr('disabled', 'disabled');
            }
        }

        var div = that.closest('div');
        var label = that.next("label");
        if (!label.next(".fa").length) {
            label.after("<i class='fa fa-refresh fa-spin'></i>");
        }
        if (that.is(':checked')) {
            var parent_id = cartRow.data('id');
            var data = {html: ($.yourshop.ruble == 'html' ? 1 : 0), parent_id: parent_id, service_id: that.val()};
            var variants = $('select[name="service_variant[' + parent_id + '][' + that.val() + ']"]');
            if (variants.length) {
                data['service_variant_id'] = variants.val();
            }
            $.post('add/', data, function (response) {
                div.data('id', response.data.id);
                cartRow.find('.item-total').html(response.data.item_total);
                label.next(".fa").remove();
                updateCart(response.data);
            }, "json");
        } else {
            $.post('delete/', {html: ($.yourshop.ruble == 'html' ? 1 : 0), id: div.data('id')}, function (response) {
                div.data('id', null);
                cartRow.find('.item-total').html(response.data.item_total);
                label.next(".fa").remove();
                updateCart(response.data);
            }, "json");
        }
    });

    // Изменение количества товаров
    var changeQuantity = function (that, callback) {
        if (that.val() > 0) {
            var cartRow = that.closest('.cart-row');
            var id = cartRow.data('id');
            var flyItem = $(".fly-item[data-id='" + id + "']");
            that.prop('disabled', true);
            $.post('save/', {html: ($.yourshop.ruble == 'html' ? 1 : 0), id: id, quantity: that.val()}, function (response) {
                that.prop('disabled', false);
                cartRow.find('.item-total').html(response.data.item_total);
                flyItem.find('.price').html(response.data.item_total);
                if (response.data.q) {
                    that.val(response.data.q);
                }
                flyItem.find('input.qty').val(that.val());

                // Товары-комплекты
                if (typeof $.itemsetsFrontend !== 'undefined') {
                    $.itemsetsFrontend.quantityChange(that);
                }

                // Гибкие скидки
                if (typeof $.flexdiscountFrontend !== 'undefined') {
                    $.flexdiscountFrontend.cartChange();
                }
                if (response.data.error) {
                    alert(response.data.error);
                } else {
                    that.removeClass('error');
                }
                if (callback) {
                    callback.call();
                }
                updateCart(response.data);
            }, "json");
        } else {
            that.val(1);
        }
    };

    // Уменьшение количества товаров
    $(".f-quantity-minus").click(function () {
        var btn = $(this);
        var i = btn.find("i");
        if (!i.hasClass("fa-refresh")) {
            i.removeClass().addClass("fa fa-refresh fa-spin");
            var qty = btn.closest(".quantity").find("input[name*='quantity']");
            qty.val(function (i, oldval) {
                if (parseInt(oldval, 10) > 1) {
                    return --oldval;
                } else {
                    return 1;
                }
            });
            changeQuantity(qty, function () {
                i.removeClass().addClass("fa fa-caret-left");
            });
        }
        return false;
    });

    // Увеличение количества товаров
    $(".f-quantity-plus").click(function () {
        var btn = $(this);
        var i = btn.find("i");
        if (!i.hasClass("fa-refresh")) {
            i.removeClass().addClass("fa fa-refresh fa-spin");
            var qty = btn.closest(".quantity").find("input[name*='quantity']");
            qty.val(function (i, oldval) {
                if (parseInt(oldval, 10) < 1) {
                    return 1;
                } else {
                    return ++oldval;
                }
            });
            changeQuantity(qty, function () {
                i.removeClass().addClass("fa fa-caret-right");
            });
        }
        return false;
    });

    // Изменение количества товаров
    $(".cart-page input.qty").change(function () {
        changeQuantity($(this));
    });

    // Выбор услуг в выпадающем списке
    $(".cart-page .services select").change(function () {
        var that = $(this);
        var cartRow = that.closest('.cart-row');
        if (!that.next(".fa").length) {
            that.after("<i class='fa fa-refresh fa-spin'></i>");
        }
        $.post('save/', {html: ($.yourshop.ruble == 'html' ? 1 : 0), id: that.closest('div').data('id'), 'service_variant_id': that.val()}, function (response) {
            cartRow.find('.item-total').html(response.data.item_total);
            that.next(".fa").remove();
            updateCart(response.data);
        }, "json");
    });

    // Отмена бонусов
    $("#cancel-affiliate").click(function () {
        $(this).closest('form').append('<input type="hidden" name="use_affiliate" value="0">').submit();
        return false;
    });
});