function Product(form, options) {
    this.form = $(form);
    this.add2cart = this.form.find(".all-price");
    this.button = this.form.find("input[type=submit]");
    for (var k in options) {
        this[k] = options[k];
    }
    var self = this;

    this.button.click(function () {
        if (!$(this).attr("disabled")) {
            self.form.submit();
        }
    });

    // Сброс артикула, который необходимо сделать активным.
    var selectedSku = $.cookie('yourshop_product_sku');
    if (selectedSku) {
        $.cookie('yourshop_product_sku', null, {path: $.yourshop.shopUrl});
    }
    
    this.form.find(".services input[type=checkbox]").click(function () {
        var obj = $('select[name="service_variant[' + $(this).val() + ']"]');
        if (obj.length) {
            if ($(this).is(':checked')) {
                obj.removeAttr('disabled');
            } else {
                obj.attr('disabled', 'disabled');
            }
        }
        self.updatePrice();
    });

    this.form.find(".services .service-variants").on('change', function () {
        self.updatePrice();
    });

    this.form.find('.inline-select a').click(function () {
        var that = $(this);
        var d = that.closest('.inline-select');
        d.find('a.selected').removeClass('selected').find(".fa-check").remove();
        that.addClass('selected');
        d.hasClass("color") && that.prepend("<i class='fa fa-check'></i>")
        d.find('.sku-feature').val(that.data('value')).change();
        return false;
    });
    this.form.find('.inline-select a.selected').click();

    this.form.find(".skus input[type=radio]").click(function () {
        var input = $(this);
        var imageId = input.data('image-id');
        if (imageId && !input.hasClass("without-click")) {
            $(".product-image-" + imageId).addClass("without-click").click();
            var dialogThumb = $(".image-thumb-dialog[data-image-id='" + imageId + "']");
            if (dialogThumb.length) {
                $(".image-thumb-dialog").hide();
                dialogThumb.show();
            }
        }
        // Для Гибких скидок. Иначе при нажатии на изображение хитрый артикул не переключается.
        if (input.hasClass("without-click")) {
            input.prop('checked', true);
        }
        input.removeClass("without-click");
        if (input.data('disabled')) {
            self.button.attr('disabled', 'disabled');
        } else {
            self.button.removeAttr('disabled');
        }
        var sku_id = input.val();
        self.updateSku(input.closest("li").find(".sku-sku").data("sku"), input.closest(".product-page").find(".s-sku"));
        self.updateSkuServices(sku_id);
        self.updatePrice();
    });
    this.form.find(".skus input[type=radio]:checked").click();

    var firstLoad = 1;
    this.form.find(".sku-feature").change(function () {
        var key = "";
        self.form.find(".sku-feature").each(function () {
            key += $(this).data('feature-id') + ':' + $(this).val() + ';';
        });
        if (self.major_feature !== 'undefined' && $(".sku-feature[data-feature-id='" + self.major_feature + "']").length) {
            var majorF = $(".sku-feature[data-feature-id='" + self.major_feature + "']"),
                    majorFId = majorF.data('feature-id') + ':' + majorF.val() + ';',
                    minorF = $(".sku-feature:not([data-feature-id='" + self.major_feature + "'])"),
                    minorFId = minorF.data("feature-id"),
                    changeF = 0,
                    visibleF = '';
            if ($(this).data("feature-id") == majorF.data('feature-id') || firstLoad) {
                if (minorF.is(":input")) {
                    minorF.siblings(".temp-block").remove();
                    minorF.siblings("a").each(function () {
                        var that = $(this);
                        var keyF = self.major_first ? (majorFId + minorFId + ':' + that.data("value") + ';') : (minorFId + ':' + that.data("value") + ';' + majorFId);
                        if (!self.features[keyF]) {
                            that.hide();
                            if (key == keyF) {
                                changeF = 1;
                            }
                        } else if (self.features[keyF] && !self.features[keyF].available) {
                            that.show().addClass("disabled");
                        } else {
                            visibleF = that;
                            that.show().removeClass("disabled");
                        }
                    });
                    if (changeF) {
                        if (!minorF.siblings("a:visible").length) {
                            minorF.after("<a class='disabled temp-block' href='javascript:void(0)' title=''>"+$.yourshop.translate("Empty")+"</a>");
                        } else {
                            visibleF.click();
                        }
                        return false;
                    }
                    firstLoad = 0;
                } else {
                     minorF.find("option").each(function () {
                        var that = $(this);
                        var keyF = self.major_first ? (majorFId + minorFId + ':' + that.val() + ';') : (minorFId + ':' + that.val() + ';' + majorFId);
                        if (!self.features[keyF]) {
                            that.hide();
                            if (key == keyF) {
                                changeF = 1;
                            }
                        } else if (self.features[keyF] && !self.features[keyF].available) {
                            that.prop("disabled", true);
                        } else {
                            visibleF = that;
                            that.show().prop("disabled", false);
                        }
                    });
                    if (changeF) {
                        minorF.val(visibleF.val()).change();
                        return false;
                    }
                    firstLoad = 0;
                }
            }
        }
        var sku = self.features[key];
        var skuField = $(this).closest(".product-page").find(".s-sku");
        if (sku) {
            if (sku.image_id) {
                $(".product-image-" + sku.image_id).click();
                var dialogThumb = $(".image-thumb-dialog[data-image-id='" + sku.image_id + "']");
                if (dialogThumb.length) {
                    $(".image-thumb-dialog").hide();
                    dialogThumb.show();
                }
            }
            self.updateSkuServices(sku.id);
            if (sku.available) {
                self.button.removeAttr('disabled');
            } else {
                self.button.attr('disabled', 'disabled');
            }
            self.add2cart.find(".price").data('price', sku.price);
            self.updatePrice(sku.price, sku.compare_price);
            if (typeof self.sku_names[sku.id] !== 'undefined') {
                self.updateSku(self.sku_names[sku.id], skuField);
            } else {
                skuField.hide();
            }
        } else {
            self.form.find("div.stocks > div").hide();
            self.form.find(".sku-no-stock").show();
            self.button.attr('disabled', 'disabled');
            self.add2cart.find(".compare-price").hide();
            self.add2cart.find(".price").empty();
            skuField.hide();
        }
    });
    this.form.find(".sku-feature:first").change();

    if (!this.form.find(".skus input:radio:checked").length) {
        this.form.find(".skus input:radio:enabled:first").attr('checked', 'checked');
    }

    this.form.submit(function () {
        var updateFlyCart = function (data) {
            $(".cart-total, .fly-cart .total").html(data.total);
            $("#cart").find(".indicator").text(data.count);
            $(".fly-discount .discount").html(data.discount);
        };
        var f = $(this);
        f.attr("data-id", "");
        var input = f.find("input[type='submit']");
        if (!input.hasClass("active")) {
            input.addClass("active");
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
                        var count = parseInt(f.find(".add2cart input[name='quantity']").val()) || 1;
                        var flyCart = $(".fly-cart");
                        var existProduct = flyCart.find(".fly-item[data-id='" + response.data.item_id + "']");
                        var skuId = f.find("input[name='sku_id']:checked").val();
                        var dialog = 0;
                        var dial = f.closest('.dialog');
                        if (dial.length && !dial.hasClass("quick-view-dial")) {
                            dialog = 1;
                        } else {
                            input.val($.yourshop.translate("Added"));
                            setTimeout(function () {
                                input.val(oldFV);
                            }, 2500);
                        }
                        if (existProduct.length) {
                            var quantityBlock = existProduct.find(".qty");
                            var priceBlock = existProduct.find(".fly-price");
                            var price = parseFloat(priceBlock.text().replace(",", ".").replace(/[^\d\.]/g, "")) + parseFloat(f.find(".all-price .price").attr('data-price')) * count;
                            count += parseInt(quantityBlock.val());
                            quantityBlock.val(count);
                            priceBlock.html("~" + self.currencyFormat(price, ($.yourshop.ruble == 'html' ? 0 : 1)));
                        } else {
                            var name = f.find("li[data-id='" + skuId + "'] .s-radio-name");
                            var url = dialog ? f.find("h4").data("url") : "";
                            var html = '<div class="fly-item" data-id="' + response.data.item_id + '">' +
                                    '<div class="fly-img">' + (dialog ? '<a href="' + url + '" title="' + f.find("h4").data("name") + '">' + (f.find(".image-thumb-dialog:visible").length ? f.find(".image-thumb-dialog:visible").clone().removeClass().prop('outerHTML') : f.find(".image > img").clone().removeClass().prop('outerHTML')) + '</a>' : (f.closest(".product-page").find(".image-thumb a.selected").length ? f.closest(".product-page").find(".image-thumb a.selected img").clone().removeClass().prop('outerHTML') : f.closest(".product-page").find(".image").data("small"))) + '</div>' +
                                    '<div class="fly-info">' +
                                    '<div class="fly-name">' + (dialog ? '<a href="' + f.find("h4").data("url") + '">' + escapeHtml(f.find("h4").data("name")) + '</a>' : escapeHtml(f.closest(".product-page").find("h1[itemprop='name']").text())) + (name.length && name.text() ? " (" + escapeHtml(name.text()) + ")" : "") + '</div>' +
                                    '<div class="fly-quantity">' +
                                    '<a href="javascript:void(0)" title="' + $.yourshop.translate('decrease') + '" class="f-minus"><i class="ys ys-larr"></i></a>' +
                                    '<input type="text" value="' + count + '" class="qty" />' +
                                    '<a href="javascript:void(0)" title="' + $.yourshop.translate('increase') + '" class="f-plus"><i class="ys ys-rarr"></i></a>' +
                                    '</div>' +
                                    '<div class="fly-price price colored">~' + self.currencyFormat(parseFloat(f.find(".all-price .price").attr('data-price')) * count, ($.yourshop.ruble == 'html' ? 0 : 1)) + '</div>' +
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
                        if (dialog || (dial.length && dial.hasClass("quick-view-dial"))) {
                            dial.find(".dialog-close").click();
                        }
                        bouncePopup(cart, "+ " + $.yourshop.translate('Added to cart'));
                    }
                } else if (response.status == 'fail') {
                    alert(response.errors);
                }
            }, "json");
        }
        return false;
    });
}

Product.prototype.currencyFormat = function (number, no_html) {
    var i, j, kw, kd, km;
    var decimals = this.currency.frac_digits;
    var dec_point = this.currency.decimal_point;
    var thousands_sep = this.currency.thousands_sep;
    if (isNaN(decimals = Math.abs(decimals))) {
        decimals = 2;
    }
    if (dec_point == undefined) {
        dec_point = ",";
    }
    if (thousands_sep == undefined) {
        thousands_sep = ".";
    }
    i = parseInt(number = (+number || 0).toFixed(decimals)) + "";
    if ((j = i.length) > 3) {
        j = j % 3;
    } else {
        j = 0;
    }
    km = (j ? i.substr(0, j) + thousands_sep : "");
    kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
    kd = (decimals && (number - i) ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");
    var number = km + kw + kd;
    var s = no_html ? this.currency.sign : this.currency.sign_html;
    if (!this.currency.sign_position) {
        return s + this.currency.sign_delim + number;
    } else {
        return number + this.currency.sign_delim + s;
    }
};

Product.prototype.serviceVariantHtml = function (id, name, price) {
    return $('<option data-price="' + price + '" value="' + id + '"></option>').html(name + ' (+' + this.currencyFormat(price, 1) + ')');
};

Product.prototype.updateSkuServices = function (sku_id) {
    this.form.find("div.stocks > div").hide();
    this.form.find(".sku-" + sku_id + "-stock").show();
    for (var service_id in this.services[sku_id]) {
        var v = this.services[sku_id][service_id];
        if (v === false) {
            this.form.find(".service-" + service_id).hide().find('input,select').attr('disabled', 'disabled').removeAttr('checked');
        } else {
            this.form.find(".service-" + service_id).show().find('input').removeAttr('disabled');
            if (typeof (v) == 'string') {
                this.form.find(".service-" + service_id + ' .service-price').html(this.currencyFormat(v, ($.yourshop.ruble == 'html' ? 0 : 1)));
                this.form.find(".service-" + service_id + ' input').data('price', v);
            } else {
                var select = this.form.find(".service-" + service_id + ' .service-variants');
                var selected_variant_id = select.val();
                for (var variant_id in v) {
                    var obj = select.find('option[value=' + variant_id + ']');
                    if (v[variant_id] === false) {
                        obj.hide();
                        if (obj.attr('value') == selected_variant_id) {
                            selected_variant_id = false;
                        }
                    } else {
                        if (!selected_variant_id) {
                            selected_variant_id = variant_id;
                        }
                        obj.replaceWith(this.serviceVariantHtml(variant_id, v[variant_id][0], v[variant_id][1]));
                    }
                }
                this.form.find(".service-" + service_id + ' .service-variants').val(selected_variant_id);
            }
        }
    }
};

Product.prototype.updatePrice = function (price, compare_price) {
    if (price === undefined) {
        var input_checked = this.form.find(".skus input:radio:checked");
        if (input_checked.length) {
            var price = parseFloat(input_checked.data('price'));
            var compare_price = parseFloat(input_checked.data('compare-price'));
        } else {
            var price = parseFloat(this.add2cart.find(".price").data('price'));
        }
    }
    if (compare_price) {
        if (!this.add2cart.find(".compare-price").length) {
            this.add2cart.append('<div class="compare-price"></div>');
        }
        this.add2cart.find(".compare-price").html(this.currencyFormat(compare_price, ($.yourshop.ruble == 'html' ? 0 : 1))).show();
    } else {
        this.add2cart.find(".compare-price").hide();
    }
    var self = this;
    this.form.find(".services input:checked").each(function () {
        var s = $(this).val();
        if (self.form.find('.service-' + s + '  .service-variants').length) {
            price += parseFloat(self.form.find('.service-' + s + '  .service-variants :selected').data('price'));
        } else {
            price += parseFloat($(this).data('price'));
        }
    });
    this.add2cart.find(".price").html(this.currencyFormat(price, ($.yourshop.ruble == 'html' ? 0 : 1))).attr("data-price", price);
};
Product.prototype.updateSku = function (sku, skuField) {
    if (sku) {
        skuField.show().find("span").text(sku);
    } else {
        skuField.hide();
    }
};