$(function () {
    // Ленивая подгрузка
    if ($("#product-list").length) {
        var paging = $('.lazyloading-paging').last();
        if (!paging.length && !$.yourshop.lazyloading) {
            return;
        }
        // check need to initialize lazy-loading
        var current = paging.find('li.selected');
        if (current.children('a').text() != '1' && !$.yourshop.lazyloading) {
            return;
        }

        $('.lazyloading-paging').hide();
        var win = $(window);

        // prevent previous launched lazy-loading
        win.lazyLoad('stop');

        // check need to initialize lazy-loading
        var next = current.next();
        if (next.length || $.yourshop.lazyloading) {
            win.lazyLoad({
                container: '#product-list',
                load: function () {
                    win.lazyLoad('sleep');

                    var paging = $('.lazyloading-paging').last().hide();

                    // determine actual current and next item for getting actual url
                    var current = paging.find('li.selected');
                    var next = current.next();
                    var url = next.find('a').attr('href');
                    if (!url) {
                        win.lazyLoad('stop');
                        return;
                    }

                    var product_list = $('#product-list .product-list');
                    var loading = paging.parent().find('.loading').parent();
                    if (!loading.length) {
                        loading = $('<div><i class="icon16 loading"></i>' + $.yourshop.translate('Loading') + '...</div>').insertBefore(paging);
                    }

                    loading.show();
                    $.get(url, function (html) {
                        html = $(html);
                        if ($.Retina) {
                            html.find('#product-list .product-list img').retina();
                        }
                        var newProductList = html.find('#product-list .product-list').children();
                        
                        product_list.append(newProductList);
                        var swipable = newProductList.find(".image.swipeable");
                        if (swipable.length) {
                            $.yourshop.initProductSwipeEvent(swipable);
                            if (!product_list.hasClass('show-cat-thumbs')) {
                                product_list.addClass('show-cat-thumbs');
                            }
                        }
                        var tmp_paging = html.find('.lazyloading-paging').last().hide();
                        paging.replaceWith(tmp_paging);
                        paging = tmp_paging;

                        // check need to stop lazy-loading
                        var current = paging.find('li.selected');
                        var next = current.next();
                        if (next.length) {
                            win.lazyLoad('wake');
                        } else {
                            win.lazyLoad('stop');
                        }

                        loading.hide();
                    });
                }
            });
        }
    }
});