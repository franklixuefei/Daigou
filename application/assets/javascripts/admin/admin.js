/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var admin = function() {
    var initialize = function() {
        orders.init();
    };
    var orders = function() {
        var index = 0;
        var list = null;
        var i_index = 0;
        var i_list = null;
        var MAX_INDEX = 2147483647;
        var initialize = function() {
            $('div#active_orders_button_more').bind('click', function() {
                generateList(list);
            });
            getList();
            $('div#inactive_orders_button_more').bind('click', function() {
                generateIList(i_list);
            });
            getIList();
        };
        
        var generateEntry = function(item) {
            var entry = $('<div>').attr('class', 'orders_entry');
            var basic_order_info = $('<div>').attr('class', 'basic_order_info');
            var detailed_order_info = $('<div>').attr('class', 'detailed_order_info');
            var buyer_info = $('<div>').attr('class', 'buyer_info');
            
            basic_order_info
            .append(
                $('<div>').attr('class','order_num').text('#'+item.track_num))
            .append(
                $('<div>').attr('class', 'order_created_at').text('下单时间：'+ item.created_at))
            .append(
                $('<div>').attr('class', 'orig_price').text('原价：'+item.orig_price+'元').append(parseInt(item.has_discount)?$('<a>').attr('href', item.detail_url).text('(有折扣)'):$('<span>').text(' (无折扣)')));
            
            detailed_order_info.append($('<a>').attr('href', item.detail_url).attr('target', '_blank').append($('<div>').attr('class','thumb_pic_container').append($('<img>').attr('src', item.pic_url)))
                .append($('<div>').attr('class','middle_content')
                    .append($('<div>').attr('class', 'orders_item_title').text(item.title))
                    .append($('<div>').attr('class', 'orders_item_msg').text(item.msg))
                    )
                .append($('<div>').attr('class','orders_item_amount').append($('<span>').text('×'+item.amount))));
            
            buyer_info.append($('<div>').attr('class', 'buyer_info_wrapper').append($('<table>')
                .append('<tr><td>收件人：</td><td></td><td>'+ item.name +'</td></tr>'+
                    '<tr><td>地址：</td><td></td><td>'+ item.address +'</td></tr>'+
                    '<tr><td>电子邮箱：</td><td></td><td><a href="mailto:'+ item.email +'">'+ item.email +'</a></td></tr>'+
                    '<tr><td>电话：</td><td></td><td>'+ item.phone +'</td></tr>')))
            .append($('<div>').attr('class', 'order_control')
                .append($('<div>').text('订单状态'))
                .append($('<select>').append('<option value="0" '+(parseInt(item.status)==0?'selected="selected"':'')+'>未处理</option>'+
                    '<option value="1" '+(parseInt(item.status)==1?'selected="selected"':'')+'>已确认，正在配货</option>'+
                    '<option value="2" '+(parseInt(item.status)==2?'selected="selected"':'')+'>已发货</option>'+
                    '<option value="3" '+(parseInt(item.status)==3?'selected="selected"':'')+'>已成交</option>'+
                    '<option value="4" '+(parseInt(item.status)==4?'selected="selected"':'')+'>已关闭</option>'
                    ))
                .append($('<button>').attr('class', 'order_control_submit').text('保存')
                    .bind('click', function() {
                        // TODO add notice bar
                        var thisButton = $(this);
                        $.ajax({
                            type: "POST",
                            data: {
                                'csrf_token_name': $("input[name=csrf_token_name]").val(),
                                'order_id': item.id,
                                'order_status': thisButton.parent().find('select').val()
                            },
                            datatype: 'JSON',
                            beforeSend: function(x) {
                                if(x && x.overrideMimeType) {
                                    x.overrideMimeType("application/json;charset=UTF-8");
                                }
                            },
                            url: "/daigou/index.php/admin/update_order_status",
                            success: function (j) {
                                if (j.ok) {
                                    // TODO notice bar here
                                } else {
                                    // TODO notice bar here
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown, exception) {
                                if (textStatus == 'error' && errorThrown == 'Unauthorized') { // CSRF token expired
                                    location.reload();
                                } else {
                        
                                }
                            }
                        });
                    })));
            
            
            
            basic_order_info.appendTo(entry);
            detailed_order_info.appendTo(entry);
            buyer_info.appendTo(entry);
            
            return entry;
        };
        
        var generateList = function(list) {
            var i = index;
            var entry;
            for (;i < index + 10 && list.hasOwnProperty(i);++i) {
                entry = generateEntry(list[i]);
                $("div#active_orders_list_body").append(entry);
            }
            index = i;
            //if (entry) entry.css('margin-bottom', '60px');
            $("#active_orders_button_more").appendTo("div#active_orders_list_body").show();
            if (!list.hasOwnProperty(index) || index >= MAX_INDEX) {
                $("#active_orders_button_more").css('cursor','default')
                .css("background-image", "url('../application/assets/images/main/button_nomore.png')");
            } else {
                $("#active_orders_button_more").css('cursor','')
                .css("background-image", "");
            }
        };
        var generateIList = function(list) {
            var i = i_index;
            var entry;
            for (;i < i_index + 10 && list.hasOwnProperty(i);++i) {
                entry = generateEntry(list[i]);
                $("div#inactive_orders_list_body").append(entry);
            }
            i_index = i;
            //if (entry) entry.css('margin-bottom', '60px');
            $("#inactive_orders_button_more").appendTo("div#inactive_orders_list_body").show();
            if (!list.hasOwnProperty(index) || index >= MAX_INDEX) {
                $("#inactive_orders_button_more").css('cursor','default')
                .css("background-image", "url('../application/assets/images/main/button_nomore.png')");
            } else {
                $("#active_orders_button_more").css('cursor','')
                .css("background-image", "");
            }
        };
        
        var getList = function() {
            $("#active_orders_button_more").hide();
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
                url: "/daigou/index.php/admin/getActiveOrders",
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
        
        var getIList = function() {
            $("#inactive_orders_button_more").hide();
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
                url: "/daigou/index.php/admin/getInactiveOrders",
                success: function (j) {
                    //console.log(j);
                    i_list = j;
                    generateIList(j);
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
            init: initialize
        }
    }();
    
    var controller = function() {
        var foo = null;
        return {
            
        }
    }();
    
    return {
        init: initialize
    }
}();

$(document).ready(function() {
    admin.init();
});