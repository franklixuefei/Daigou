/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

// if not logged in or registered, after logging in or registered, merge items in cookies to database.

var Daigou = function() {
    var leftWindowOrigWidth;
    //var rightWindowOrigWidth;
    var initialize = function() {
        // load ads, favorites, shopping carts. if not logged in or registered, load from cookies.
        // prepare to listen
        page.init();
        taobaoURL.listenInput();
        sidebarResizable.init();
        shoppingCart.init();
        orders.init();
        controller.init();
    };
    
    var page = function() {
        
        var initialize = function() {
            showStartPage();
        };
        
        var showStartPage = function() {
            $('div.main_content').text('initial page');
        };
        
        return {
            init: initialize,
            showStartPage: showStartPage
        }
    }();
    
    var taobaoURL = function() {
        var inputListener = function() {
            var timer;
            var xhr; // the magic
            var prev_id;
            $('input#url_input').keydown(function() {
                var input = $(this);
                clearTimeout(timer);
                timer = setTimeout(function() {
                    var id = URIHelper.lookupQuery(input.val(), 'id');
                    //                    console.log(id);
                    if (!input.val()) {
                        // show initial page
                        prev_id = null;
                        page.showStartPage();
                    } else if (!id) {
                        showResult(-1); 
                        sidebarResizable.reinit();
                        prev_id = null;
                    } else if (id == prev_id) {
                    // do nothing
                    } else {
                        prev_id = id;
                        
                        /* insert loading here */
                        if (xhr) xhr.abort(); // magic happens here
                        $('div.main_wrapper').prepend($('<div>').attr('class', 'mask').append($('<img>').attr('class', 'loading').attr('src', 'application/assets/images/global/loading.gif')));
                        xhr = $.ajax({
                            type: "POST",
                            data: {
                                'id': parseInt(id),
                                'csrf_token_name': $("input[name=csrf_token_name]").val()
                            },
                            datatype: 'JSON',
                            beforeSend: function(x) {
                                if(x && x.overrideMimeType) {
                                    x.overrideMimeType("application/json;charset=UTF-8");
                                }
                            //console.log(data);
                            },
                            url: "/daigou/index.php/main/get_result",
                            timeout: 100000,
                            success: function (j) {
                                //if (j.item.num_iid == parseInt(URIHelper.lookupQuery(input.val(), 'id'))) { // only show corresponding info
                                window.item = j.item;
                                $('div.main_content').text('');
                                $('div.main_content').children().remove();
                                showResult(j);
                                $('div.mask').remove();
                                sidebarResizable.reinit();
                            //}
                            },
                            error: function(jqXHR, textStatus, errorThrown, exception) {
                                if (textStatus == 'error' && errorThrown == 'Unauthorized') { // CSRF token expired
                                    location.reload();
                                } else { // mostly timed out.
                                    if (textStatus == "abort" && errorThrown == "abort") {
                                    // do nothing
                                    } else if (textStatus == 'timeout' && errorThrown == 'timeout') {
                                        prev_id = null; // reset prev_id so that user could try all possible urls out.
                                        showResult(-2);
                                        $('div.mask').remove();
                                    }
                                    
                                }
                                
                            }
                        });
                    }
                }, 350);
            }).keydown();
            $('input#url_input').change(function() {
                $(this).keydown();
            }).change();
            
        };
        var showResult = function(list) {
            if (list == -1) $('div.main_content').text('invalid url'); // TODO
            else if (list == -2) {
                alert('请求超时，请重试');
            } else {
                if (list.sub_code && list.sub_code == 'isv.item-get-service-error:ITEM_NOT_FOUND') { // item not found
                    
                } else if (list.sub_code && list.sub_code == 'isv.item-is-delete:invalid-numIid') { // item has been deleted
                    
                } else if (list.sub_code && list.code == 0) { // no connection
                    
                } else if (list.item){ // guarantee that item exists.
                    var item = list.item;
                    var purchase_button = $('<button>').attr('id', 'purchase').text('购买');
                    purchase_button.bind('click', function() {
                        controller.purchase();
                    });
                    var basic_info_container = $('<div>').attr('class', 'basic_info_container main_block').appendTo('div.main_content');
                    basic_info_container
                    .append(
                        $('<div>').attr('class', 'block_header clearfix')
                        .append($('<div>').attr('class', 'block_header_icon').attr('id', 'basic'))
                        .append($('<div>').attr('class', 'block_header_title').attr('id', 'basic').text('基本信息'))
                        .append($('<span>').attr('class', 'list_period').text('上架时限：' + item.list_time + ' - ' + item.delist_time))
                        )
                    .append(
                        $('<div>').attr('class', 'block_content')
                        .append(
                            $('<div>').attr('class', 'item_pic')
                            .append($('<img>').attr('id', 'item_pic').attr('src', item.pic_url))
                            )
                        .append(
                            $('<div>').attr('class', 'basic_table')
                            .append($('<h3>').html(item.title + '<span id="stuff_status">'+ (item.stuff_status == 'new'? '<span style="color: green;">[全新]</span>' : (item.stuff_status == 'unused'? '<span style="color: darkgreen;">[闲置]</span>' : '<span style="color: green;">[二手]</span>')) +'</span>'+
                                '<span id="approve_status">'+ (item.approve_status == 'onsale'? '<span style="color: green;">[出售中]</span>' : '<span style="color: gray;">[已下架]</span>') +'</span>'+
                                '<span id="detail_url"><a target="_blank" href="'+ item.detail_url +'">[查看商品页面]</a></span>'
                                ))
                            .append($('<table>').attr('id', 'basic_table')
                                .append('<tr><td>原价</td><td>'+item.price+' 元</td></tr>'+
                                    '<tr><td>促销</td><td>'+ (item.has_discount? '正在促销<a target="_blank" href="'+ item.detail_url +'">查看促销价</a>' : '无促销活动') +'</td></tr>'+
                                    //'<tr><td>商品所在地</td><td>'+ (item.location) +'</td></tr>'+
                                    '<tr><td>配送</td><td>'+ (item.post_fee? '平邮：'+item.post_fee+' 元<br/>' : '') + (item.express_fee? '快递：'+ item.express_fee +' 元<br/>' : '') + (item.ems_fee? 'EMS：'+ item.ems_fee +' 元</td>' : '') + '</tr>'+
                                    '<tr><td>给代购商留言</td><td><textarea id="msg_to_agent" placeholder="请注明商品促销价，以及其他商品具体信息。例如：尺码、颜色、型号、重量等等"></textarea></td>' 
                                    )
                                )
                            .append(
                                $('<div>').attr('class', 'button_wrapper')
                                .append(
                                    $('<span>').attr('id', 'amount_container')
                                    .append(
                                        '<span id="amount">数量：</span><input id="amount_input" type="number" min="0" max="'+ (parseInt(item.num)-parseInt(item.with_hold_quantity)) +'"/>'
                                        )
                                    )
                                .append(
                                    purchase_button
                                    )
                                
                                )
                            //                            .append($('<div>').attr('class', 'seller_promises').append(
                            //                                (item.has_warranty? $('<img class="seller_promises_icons">').attr('id', 'warranty').attr('src', '/daigou/application/assets/images/main/warranty.png') : '')
                            //                                ).append(
                            //                                (item.has_invoice? $('<img class="seller_promises_icons">').attr('id', 'invoice').attr('src', '/daigou/application/assets/images/main/invoice.png') : '')
                            //                                ).append(
                            //                                (item.sell_promise? $('<img class="seller_promises_icons">').attr('id', 'sell_promise').attr('src', '/daigou/application/assets/images/main/return.png') : '')
                            //                                )
                            //                                
                            //                            )        
                            )
                            
                        );
                    var detail_container = $('<div>').attr('class', 'detail_container main_block').appendTo('div.main_content');
                    detail_container.append(
                        $('<div>').attr('class', 'block_header clearfix')
                        .append($('<div>').attr('class', 'block_header_icon').attr('id', 'detail'))
                        .append($('<div>').attr('class', 'block_header_title').attr('id', 'detail').text('详细信息'))
                    
                        )
                    .append(
                        $('<div>').attr('class', 'block_content')
                        .append(item.desc)
                        );
                    
                }
                
            }
        };
        return {
            listenInput : inputListener
        }
    }();
    
    var controller = function() {
        var nameChanged = false;
        var addrChanged = false;
        var emailChanged = false;
        var phoneChanged = false;
        var initialize = function() {
            $('div.sidebar_title#cart').bind('click', function() {
                switchToCart();
            });
            $('div.sidebar_title#orders').bind('click', function() {
                switchToOrders();
            });
            $('div.continue').find('span').bind('mousedown', function() {
                $(this).addClass('active'); 
            }).bind('mouseup', function() {
                $(this).removeClass('active');
            // ajax here
            });
            $('span#place_order').bind('click', showDetailInfo);
            $('span#back').bind('click', backToCart);
            $('span#confirm').bind('click', itemsConfirm);
            $('input#name').change(function() {
                nameChanged = true;
            });
            $('input#address').change(function() {
                addrChanged = true;
            });
            $('input#email').change(function() {
                emailChanged = true;
            });
            $('input#phone').change(function() {
                phoneChanged = true;
            });
        };
        
        var switchToCart = function() {
            $('div#shopping_cart_list_body').show();
            $('div#orders_list_body').hide();
            $('div#shopping_cart_control').show();
            $('div.sidebar_title').removeClass('active');
            $('div.sidebar_title#cart').addClass('active');
        };
        
        var switchToOrders = function() {
            $('div#orders_list_body').show();
            $('div#shopping_cart_list_body').hide();
            $('div#shopping_cart_control').hide();
            $('div.sidebar_title').removeClass('active');
            $('div.sidebar_title#orders').addClass('active');
        };
        
        var showDetailInfo = function() {
            $(this).fadeOut(100);
            $('div#detail_info').fadeIn(200);
            $('div#shopping_cart_control').animate({
                height: "40%"
            }, 300, function() {
                $('div#detail_info').css('overflow','auto');
            });
            $('div#shopping_cart_list_body').animate({
                height: "60%"
            }, 300);
        };
        
        var hideDetailInfo = function() {
            $('div#shopping_cart_control').animate({
                height: "12%"
            }, 300, function() {
                $('div#detail_info').css('overflow','');
            });
            $('div#shopping_cart_list_body').animate({
                height: "88%"
            }, 300);
        };
        
        var backToCart = function() {
            $('div#detail_info').fadeOut(100);
            $('span#place_order').fadeIn(200);
            hideDetailInfo();
        };
        
        var itemsConfirm = function() {
            // some animation here
            var data = {
                'csrf_token_name': $("input[name=csrf_token_name]").val()
            };
            if (nameChanged) {
                data['name'] = $('input#name').val();
            }
            if (addrChanged) {
                data['address'] = $('input#address').val();                
            }
            if (emailChanged) {
                data['email'] = $('input#email').val();
            }
            if (phoneChanged) {
                data['phone'] = $('input#phone').val();
            }
            $.ajax({ // check cart count and then submit order.
                type: "POST",
                data: data,
                datatype: 'JSON',
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/json;charset=UTF-8");
                    }
                //console.log(data);
                },
                url: "/daigou/index.php/cart/place_order",
                success: function (j) {
                    if (j.ok) { // return error here indicating nothing is in cart yet.
                        if (j.cartEmpty) {
                            alert('购物车为空'); // FIXME change to notice bar
                        } else { // order has been submitted
                            // reset flags
                            nameChanged = false;
                            addrChanged = false;
                            emailChanged = false;
                            phoneChanged = false;
                            // remove items in cart and show notice bar success.
                            $('div.cart_entry').fadeOut(200, function() {
                                $(this).remove();
                            });
                            backToCart();
                            // trigger the orders to reload
                            orders.reload();
                        }
                    } else {
                        alert('系统错误，请刷新重试');
                    }
                    
                },
                error: function(jqXHR, textStatus, errorThrown, exception) {
                    if (textStatus == 'error' && errorThrown == 'Unauthorized') { // CSRF token expired
                        location.reload();
                    } else { // mostly timed out.
                                    
                    }
                                
                }
            });
        };
        
        var deleteCartItem = function(item_id, itemObj) {
            $.ajax({ // check cart count and then submit order.
                type: "POST",
                data: {
                    'csrf_token_name': $("input[name=csrf_token_name]").val(),
                    'id': item_id
                    
                },
                datatype: 'JSON',
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/json;charset=UTF-8");
                    }
                //console.log(data);
                },
                url: "/daigou/index.php/cart/delete_cart_item",
                success: function (j) {
                    if (j.ok) {
                        itemObj.fadeOut(200, function() {
                            $(this).remove();
                            $('div.cart_entry:first').css('margin-top','33px');
                        });
                    } else {
                        alert('删除错误，请刷新重试');
                    }  
                },
                error: function(jqXHR, textStatus, errorThrown, exception) {
                    if (textStatus == 'error' && errorThrown == 'Unauthorized') { // CSRF token expired
                        location.reload();
                    } else { // mostly timed out.
                        
                    }
                                
                }
            });
        };
        var deleteOrdersItem = function(item_id, itemObj) {
            $.ajax({ // check cart count and then submit order.
                type: "POST",
                data: {
                    'csrf_token_name': $("input[name=csrf_token_name]").val(),
                    'id': item_id
                    
                },
                datatype: 'JSON',
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/json;charset=UTF-8");
                    }
                //console.log(data);
                },
                url: "/daigou/index.php/order/delete_orders_item",
                success: function (j) {
                    if (j.ok) {
                        itemObj.fadeOut(200, function() {
                            $(this).remove();
                            $('div.orders_entry:first').css('margin-top','33px');
                        });
                    } else {
                        alert('删除错误，请刷新重试');
                    }  
                },
                error: function(jqXHR, textStatus, errorThrown, exception) {
                    if (textStatus == 'error' && errorThrown == 'Unauthorized') { // CSRF token expired
                        location.reload();
                    } else { // mostly timed out.
                        
                    }
                                
                }
            });
        };
        
        var purchase = function() {
            // some animation here TODO
            $.ajax({
                type: "POST",
                data: {
                    'amount': parseInt($('input#amount_input').val()),
                    'id': window.item.num_iid,
                    'detail_url': window.item.detail_url,
                    'list_time': window.item.list_time,
                    'pic_url': window.item.pic_url,
                    'delist_time': window.item.delist_time,
                    'orig_price': window.item.price,
                    'has_discount': window.item.has_discount?1:0,
                    'has_warranty': window.item.has_warranty?1:0,
                    'has_invoice': window.item.has_invoice?1:0,
                    'item_standing': window.item.stuff_status,
                    'title': window.item.title,
                    'size': window.item.item_size,
                    'weight': window.item.item_weight,
                    'post_fee': window.item.post_fee,
                    'ems_fee': window.item.ems_fee,
                    'express_fee': window.item.express_fee,
                    'item_for_sale': window.item.approve_status == 'onsale' ? 1 : 0,
                    'sell_promise': window.item.sell_promise?1:0,
                    'msg' : $('textarea#msg_to_agent').val(),
                    'csrf_token_name': $("input[name=csrf_token_name]").val()
                },
                datatype: 'JSON',
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/json;charset=UTF-8");
                    }
                },
                url: "/daigou/index.php/item/purchase",
                success: function (j) {
                    $('input#amount_input').val('');
                    $('textarea#msg_to_agent').val('');
                    // TODO add notice bar
                    shoppingCart.prepend(j.item);
                },
                error: function(jqXHR, textStatus, errorThrown, exception) {
                    if (textStatus == 'error' && errorThrown == 'Unauthorized') { // CSRF token expired
                        location.reload();
                    } else {
                        
                    }
                }
            });
        };
        return {
            init: initialize,
            purchase: purchase,
            deleteCartItem: deleteCartItem,
            deleteOrdersItem: deleteOrdersItem
        }
    }();
    
    var shoppingCart = function() {
        var index = 0;
        var list = null;
        var MAX_INDEX = 200;
        var initialize = function() {
            $('div#button_more').bind('click', function() {
                $('div.cart_entry:last').css('margin-bottom', '');
                generateList(list);
            });
            getList();
        };
        
        var generateEntry = function(item) {
            var entry = $('<div>').attr('class', 'cart_entry');
            entry.append($('<div>').attr('class','thumb_pic_container').append($('<a>').attr('href', item.detail_url).attr('target', '_blank').append($('<img>').attr('src', item.pic_url))))
            .append($('<div>').attr('class','middle_content')
                .append($('<div>').attr('class', 'cart_item_title').text(item.msg?cutstring(item.title, 28, '...'):cutstring(item.title, 75, '...')))
                .append($('<div>').attr('class', 'cart_item_msg').text(cutstring(item.msg, 90, '...')))
                )
            .append($('<div>').attr('class','cart_item_amount').append($('<span>').text('×'+item.amount)));
            entry.bind('mouseenter', function() {
                $(this).prepend($('<span>').attr('class', 'cart_del').text('×')
                    .bind('click', function() {
                        //alert('working');
                        if (confirm("确定从购物车删除 "+ item.title + " ?"))
                            controller.deleteCartItem(item.id, entry);
                    }));
            }).bind('mouseleave', function() {
                $(this).find('.cart_del').unbind('click').remove();
            });
            return entry;
        };
        
        var generateList = function(list) {
            var i = index;
            var entry;
            for (;i < index + 10 && list.hasOwnProperty(i);++i) {
                entry = generateEntry(list[i]);
                if (i == 0) {
                    entry.css('margin-top', '33px');
                }
                $("div#shopping_cart_list_body").append(entry);
                $('div.orders_entry:first').css('margin-top', '33px');
            }
            index = i;
            //if (entry) entry.css('margin-bottom', '60px');
            $("#button_more").appendTo("div#shopping_cart_list_body").show();
            if (!list.hasOwnProperty(index) || index >= MAX_INDEX) {
                $("#button_more").css('cursor','default')
                .css("background-image", "url('application/assets/images/main/button_nomore.png')");
            } else {
                $("#button_more").css('cursor','')
                .css("background-image", "");
            }
        };
        
        var getList = function() {
            $("#button_more").hide();
            $.ajax({
                type: "POST",
                data: {
                    'csrf_token_name': $("input[name=csrf_token_name]").val()
                },
                datatype: 'JSON',
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/json;charset=UTF-8");
                    }
                },
                url: "/daigou/index.php/cart/getList",
                success: function (j) {
                    //console.log(j);
                    list = j;
                    generateList(j);
                },
                error: function(jqXHR, textStatus, errorThrown, exception) {
                    if (textStatus == 'error' && errorThrown == 'Unauthorized') { // CSRF token expired
                        location.reload();
                    } else {
                        
                    }
                }
            });
        };
        
        var prependItem = function(item) {
            var entry = generateEntry(item);
            $('div.cart_entry').css('margin-top','');
            entry.css('margin-top', '33px').hide();
            $("div#shopping_cart_list_body").prepend(entry);
            entry.fadeIn();
        };
        var reload = function() {
            $('div.cart_entry').remove();
            index = 0;
            list = null;
            getList();
        };
        return {
            init: initialize,
            prepend: prependItem,
            reload: reload
        }
    }();
    
    var orders = function() {
        var index = 0;
        var list = null;
        var MAX_INDEX = 300;
        var initialize = function() {
            $('div#orders_button_more').bind('click', function() {
                $('div.orders_entry:last').css('margin-bottom', '');
                generateList(list);
            });
            getList();
        };
        
        var generateEntry = function(item) {
            var entry = $('<div>').attr('class', 'orders_entry');
            var order_header = $('<div>').attr('class', 'order_header');
            var order_content = $('<div>').attr('class', 'orders_content');
            var order_status = $('<div>').attr('class', 'order_status');
            
            order_header.append($('<div>').attr('class', 'order_num').text('#'+item.track_num))
                .append($('<div>').attr('class', 'order_created_at').text(item.created_at));
            
            order_content.append($('<div>').attr('class','thumb_pic_container').append($('<a>').attr('href', item.detail_url).attr('target', '_blank').append($('<img>').attr('src', item.pic_url))))
            .append($('<div>').attr('class','middle_content')
                .append($('<div>').attr('class', 'orders_item_title').text(item.msg?cutstring(item.title, 28, '...'):cutstring(item.title, 75, '...')))
                .append($('<div>').attr('class', 'orders_item_msg').text(cutstring(item.msg, 90, '...')))
                )
            .append($('<div>').attr('class','orders_item_amount').append($('<span>').text('×'+item.amount)));
            if (parseInt(item.status) == 0) {
                entry.bind('mouseenter', function() {
                    $(this).prepend($('<span>').attr('class', 'orders_del').text('×')
                        .bind('click', function() {
                            //alert('working');
                            if (confirm("确定删除订单 "+ item.title + " ?"))
                                controller.deleteOrdersItem(item.id, entry);
                        }));
                }).bind('mouseleave', function() {
                    $(this).find('.orders_del').unbind('click').remove();
                });
            }
            var status_text = '';
            switch(parseInt(item.status)) {
                case 0:
                    status_text = '<span style="color: gray">未处理</span>';
                    break;
                case 1:
                    status_text = '<span style="color: red">已确认，正在配货</span>';
                    break;
                case 2:
                    status_text = '<span style="color: red">已发货</span>';
                    break;
                case 3:
                    status_text = '<span style="color: green">已成交 &#10003;</span>';
                    break;
                case 4:
                    status_text = '<span style="color: gray">已关闭</span>';
                    break;
                default:
                    break;
            }
            order_status.append($('<div>').attr('class', 'order_status_text').html(status_text))
                .append($('<div>').attr('class', 'order_updated_at').text(item.updated_at));
            
            order_header.appendTo(entry);
            order_content.appendTo(entry);
            order_status.appendTo(entry);
            return entry;
        };
        
        var generateList = function(list) {
            var i = index;
            var entry;
            for (;i < index + 10 && list.hasOwnProperty(i);++i) {
                entry = generateEntry(list[i]);
                if (i == 0) {
                    entry.css('margin-top', '33px');
                }
                $("div#orders_list_body").append(entry);
                $('div.orders_entry:first').css('margin-top', '33px');
            }
            index = i;
            //if (entry) entry.css('margin-bottom', '60px');
            $("#orders_button_more").appendTo("div#orders_list_body").show();
            if (!list.hasOwnProperty(index) || index >= MAX_INDEX) {
                $("#orders_button_more").css('cursor','default')
                .css("background-image", "url('application/assets/images/main/button_nomore.png')");
            } else {
                $("#orders_button_more").css('cursor','')
                .css("background-image", "");
            }
        };
        
        var getList = function() {
            $("#orders_button_more").hide();
            $.ajax({
                type: "POST",
                data: {
                    'csrf_token_name': $("input[name=csrf_token_name]").val()
                },
                datatype: 'JSON',
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/json;charset=UTF-8");
                    }
                },
                url: "/daigou/index.php/order/getList",
                success: function (j) {
                    //console.log(j);
                    list = j;
                    generateList(j);
                },
                error: function(jqXHR, textStatus, errorThrown, exception) {
                    if (textStatus == 'error' && errorThrown == 'Unauthorized') { // CSRF token expired
                        location.reload();
                    } else {
                        
                    }
                }
            });
        };
        
        var reload = function() {
            $('div.orders_entry').remove();
            index = 0;
            list = null;
            getList();
        };
        return {
            init: initialize,
            reload: reload
        }
    }();
    
    var sidebarResizable = function() {
        var toggle = 1;
        var initialize = function() {
            leftWindowOrigWidth = $('div.main_wrapper').width();
            //rightWindowOrigWidth = $('div.vertical_drag_bar').parent().width();
            resizeWidth();
            resizeHeight();
            $('span#toggle_sidebar').bind('click', function() {
                toggle_sidebar();
            });
        };
        
        var toggle_sidebar = function() {
            if (toggle == 0) {
                // show sidebar
                $('div.side_wrapper').show();
                $('div.item_control').css('width', '75%');
                $('div.main_wrapper').css('width', '75%');
                $('div.header_container').css('width', '75%');
                $('span#toggle_sidebar').html('&rarr;');
                toggle = 1;
            } else {
                // hide sidebar
                $('div.side_wrapper').hide();
                $('div.item_control').css('width', '100%');
                $('div.main_wrapper').css('width', '100%');
                $('div.header_container').css('width', '100%');
                $('span#toggle_sidebar').html('&larr;');
                toggle = 0;
            }
        };
        
        var reinitialize = function() {
            $(document).unbind('mousemove'); // unbind mousemove
            $('div.vertical_drag_bar').unbind('mousedown');
            leftWindowOrigWidth = $('div.main_wrapper').width();
            //rightWindowOrigWidth = $('div.vertical_drag_bar').parent().width(); /*don't reinit right window original width because it isn't changed*/
            resizeWidth();
        };
        var resizeWidth = function() {
            
            $('div.vertical_drag_bar').mousedown(function(e){
                var vdb = $(this);
                var leftLimit = 100, rightLimit = 80;
                e.preventDefault();
                $(document).bind('mousemove',function(e){
                    if (e.pageX - leftWindowOrigWidth <= rightLimit && leftWindowOrigWidth - e.pageX <= leftLimit) {
                        vdb.parent().css("width",$('div#window_innerwidth_ruler').width() - e.pageX + 'px');
                        $('div.header_container, div.main_wrapper, div.item_control').css("width",e.pageX + 'px');
                    } else {
                        if (e.pageX - leftWindowOrigWidth > 0) { // right limit
                            vdb.parent().css("width", $('div#window_innerwidth_ruler').width() - leftWindowOrigWidth - rightLimit + 'px');
                            $('div.header_container, div.main_wrapper, div.item_control').css("width",leftWindowOrigWidth + rightLimit + 'px');
                        } else { // left limit
                            vdb.parent().css("width", $('div#window_innerwidth_ruler').width() - leftWindowOrigWidth + leftLimit + 'px');
                            $('div.header_container, div.main_wrapper, div.item_control').css("width",leftWindowOrigWidth - leftLimit + 'px');
                        }
                    }
                });
            });
            $(document).mouseup(function(e){
                $(this).unbind('mousemove');
            });
        };
        var resizeHeight = function() {
            
        };
        return {
            init: initialize,
            reinit : reinitialize
        }
    }();
    
    return {
        init : initialize
        
    }
    
}();

$(document).ready(function() {
    Daigou.init();
});