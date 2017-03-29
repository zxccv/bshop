$.product = {
    init: function () {
        if (typeof ($.History) != "undefined") {
            $.History.bind(function (hash) {
                $.product.dispatch(hash);
            });
        } else {
            this.dispatch();
        }
    },
    getHash: function () {
        return this.cleanHash();
    },
    cleanHash: function (hash) {
        if (typeof hash == 'undefined') {
            hash = window.location.hash.toString();
        }

        if (!hash.length) {
            hash = '' + hash;
        }
        while (hash.length > 0 && hash[hash.length - 1] === '/') {
            hash = hash.substr(0, hash.length - 1);
        }
        hash += '/';
        if (hash[0] != '#') {
            if (hash[0] != '/') {
                hash = '/' + hash;
            }
            hash = '#' + hash;
        } else if (hash[1] && hash[1] != '/') {
            hash = '#/' + hash.substr(1);
        }

        if (hash == '#/') {
            return '';
        }
        return hash;
    },
    setHash: function (hash) {
        if (!(hash instanceof String) && hash.toString) {
            hash = hash.toString();
        }
        hash = hash.replace(/\/\//g, "/");
        hash = hash.replace(/^.*#/, '');
        if (parent && !$.browser.msie) {
            parent.window.location.hash = hash;
        } else {
            location.hash = hash;
        }
        return true;
    },
    highlightTab: function (tab) {
        $("#product-tabs li").removeClass("selected");
        $("#product-tabs a[data-id='" + tab + "']").parent("li").addClass("selected");
    },
    reviewsAction: function (tabId) {
        var url = $("#product-tabs a[data-id='" + tabId + "']").attr('href');
        if (url) {

            $.get(url, {}, function (response) {
                $("#" + tabId).html($(response).find(".reviews"));
                $(".rating-table").prependTo($("#" + tabId));
                var jsFiles = $(response).find(".add-js");
                if (jsFiles.length) {
                    $.each(jsFiles, function (i, file) {
                        $.ajax({
                            url: $(file).data('js'),
                            dataType: 'script',
                            async: false
                        });
                    });
                }
            });
        }
    },
    pageAction: function (tabId) {
        var url = $("#product-tabs a[data-id='" + tabId + "']").attr('href');
        if (url) {
            $.get(url, {}, function (response) {
                var re = /(?:(<div\s+class\=\"page\">[\s\S]*))(<script\b[^>]*>[\s\S]*?<\/script>)(?:([\s\S]*<\/div><!\-\-\sEND\s\-\->))/gm;
                var re2 = /(<script\b[^>]*>[\s\S]*?<\/script>)/gm;
                var scripts = [];
                var match;
                if (match = re.exec(response)) {
                    if (match[1] != "") {
                        var match2;
                        while (match2 = re2.exec(match[0])) {
                            var script = $(match2[0]);
                            if (script.attr('src')) {
                                $.getScript(script.attr('src'));
                            } else {
                                scripts.push(script.html());
                            }
                        }
                        $.each(scripts, function (i, v) {
                            setTimeout(function () {
                                var execScript = new Function(v);
                                execScript();
                            }, 500);
                        });
                    }
                }
                $("#" + tabId).html($(response).find("#page-content"));
            });
        }
    },
    dispatch: function (hash) {
        var id = 'overview';
        if (this.stopDispatchIndex > 0) {
            this.stopDispatchIndex--;
            return false;
        }
        if (hash === undefined) {
            hash = this.getHash();
        } else {
            hash = this.cleanHash(hash);
        }

        hash = hash.replace(/^[^#]*#\/*/, '');
        if (hash) {
            hash = hash.split('/');
            var actionName = hash[0] || 'overview';
            if (actionName == 'overview' || actionName == 'reviews') {
                id = actionName;
            } else {
                actionName = 'page';
                id = hash[0];
            }
            if (actionName == 'reviews') {
                $('html, body').animate({
                    scrollTop: $("#product-tabs").offset().top - 100
                }, 2000);
            }
        } else {
            var actionName = 'overview';
        }
        $("#tab-content > div").hide();
        id = id.replace(/\s/g, "_");
        if (!$("#" + id).length) {
            if (this[actionName + 'Action']) {
                $("#tab-content").append("<div id='" + id + "' style='display: block'><i class='icon16 loading'></i> " + $.yourshop.translate('Loading') + "...</div>");
                this[actionName + 'Action'](id);
            } else {
                if (console) {
                    console.log('Invalid action name:', actionName + 'Action');
                }
                $("#overview").show();
            }
        } else {
            $("#" + id).show();
        }
        $.product.highlightTab(id);
        $(document).trigger('hashchange', [hash]);
    }
};

jQuery(document).ready(function ($) {
    $("#product-tabs a").click(function () {
        var btn = $(this);
        var id = btn.data("id");
        if (id !== undefined) {
            if (!btn.hasClass("show-tab")) {
                $.product.setHash($.product.cleanHash(id));
                return false;
            } else {
                if ($("#" + id).length) {
                    $("#tab-content > div").hide();
                    $("#" + id).show();
                    $.product.highlightTab(id);
                    return false;
                }
            }
        }
    });
    $.product.init();
});