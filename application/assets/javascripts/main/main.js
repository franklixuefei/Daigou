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
        taobaoURL.listenInput();
        sidebarResizable.init();
    };
    
    var taobaoURL = function() {
        var inputListener = function() {
            var timer;
            var prev_id;
            $('input#url_input').keydown(function() {
                var input = $(this);
                clearTimeout(timer);
                timer = setTimeout(function() {
                    var id = URIHelper.lookupQuery(input.val(), 'id');
                    //                    console.log(id);
                    if (!id) {
                        showResult(-1); 
                        sidebarResizable.reinit();
                        prev_id = null;
                    } else if (id == prev_id) {
                    // do nothing
                    } else {
                        prev_id = id;
                        $('div.main_content').text('');
                        $('div.main_content').children().remove();
                        /* insert loading here */
                        $.ajax({
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
                                if (j.item.num_iid == parseInt(URIHelper.lookupQuery(input.val(), 'id'))) { // only show corresponding info
                                    $('div.main_content').text('');
                                    $('div.main_content').children().remove();
                                    showResult(j);
                                    sidebarResizable.reinit();
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown, exception) {
                                if (textStatus == 'error' && errorThrown == 'Unauthorized') { // CSRF token expired
                                    location.reload();
                                } else { // mostly timed out.
                                    $('div.main_content').text('');
                                    $('div.main_content').children().remove();
                                    prev_id = null; // if timed out, set prev id to null in order to allow retry on same id.
                                    showResult(-2);
                                }
                                
                            }
                        });
                    }
                }, 350);
            }).keydown();
            
            
        };
        var showResult = function(list) {
            if (list == -1) $('div.main_content').text('invalid url'); // TODO
            else if (list == -2) $('div.main_content').text('Timed out, please retry'); // TODO
            else {
                if (list.sub_code && list.sub_code == 'isv.item-get-service-error:ITEM_NOT_FOUND') {
                    
                } else if (list.sub_code && list.sub_code == 'isv.item-is-delete:invalid-numIid') {
                    
                } else if (list.item){ // guarantee that item exists.
                    var item = list.item;
                    var basic_info_container = $('<div>').attr('class', 'basic_info_container main_block').appendTo('div.main_content');
                    basic_info_container
                    .append(
                        $('<div>').attr('class', 'block_header clearfix')
                        .append($('<div>').attr('class', 'block_header_icon').attr('id', 'basic'))
                        .append($('<div>').attr('class', 'block_header_title').attr('id', 'basic').text('基本信息'))
                        .append($('<span>').attr('class', 'list_period').text('上架时段：' + item.list_time + ' - ' + item.delist_time))
                        )
                    .append(
                        $('<div>').attr('class', 'block_content')
                        .append(
                            $('<div>').attr('class', 'item_pic')
                            .append($('<img>').attr('id', 'item_pic').attr('src', item.pic_url))
                            )
                        .append(
                            $('<div>').attr('class', 'basic_table')
                            .append($('<h3>').html(item.title + '<span id="stuff_status">'+ (item.stuff_status == 'new'? '全新' : (item.stuff_status == 'unused'? '闲置' : '二手')) +'</span>'+
                                '<span id="approve_status">'+ (item.approve_status == 'onsale'? '出售中' : '已下架') +'</span>'+
                                '<span id="detail_url"><a target="_blank" href="'+ item.detail_url +'">[查看商品页面]</a></span>'
                                ))
                            .append($('<table>').attr('id', 'basic_table')
                                .append('<tr><td>原价</td><td>'+item.price+' 元</td></tr>'+
                                    '<tr><td>促销</td><td>'+ (item.has_discount? '正在促销<a target="_blank" href="'+ item.detail_url +'">查看促销价</a>' : '无促销活动') +'</td></tr>'+
                                    '<tr><td>商品所在地</td><td>'+ (item.location) +'</td></tr>'+
                                    '<tr><td>配送</td><td>'+ (item.post_fee? '平邮：'+item.post_fee+' 元<br/>' : '') + (item.express_fee? '快递：'+ item.express_fee +' 元<br/>' : '') + (item.ems_fee? 'EMS：'+ item.ems_fee +' 元</td>' : '') + '</tr>'
                                    )
                                )
                            .append($('<div>').attr('class', 'seller_promises').append(
                                (item.has_warranty? $('<img class="seller_promises_icons">').attr('id', 'warranty').attr('src', '/daigou/application/assets/images/main/warranty.png') : '')
                                ).append(
                                (item.has_invoice? $('<img class="seller_promises_icons">').attr('id', 'invoice').attr('src', '/daigou/application/assets/images/main/invoice.png') : '')
                                ).append(
                                (item.sell_promise? $('<img class="seller_promises_icons">').attr('id', 'sell_promise').attr('src', '/daigou/application/assets/images/main/return.png') : '')
                                )
                                
                            )        
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
    
    var sidebarResizable = function() {
        var initialize = function() {
            leftWindowOrigWidth = $('div.main_wrapper').width();
            //rightWindowOrigWidth = $('div.vertical_drag_bar').parent().width();
            resizeWidth();
            resizeHeight();
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