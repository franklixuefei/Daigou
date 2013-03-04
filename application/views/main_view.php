<script type="text/javascript" src="<?php echo $base_url; ?>application/assets/javascripts/main/main.js"></script>
<link rel="stylesheet" type="text/css" href="<?php echo $base_url; ?>application/assets/stylesheets/main/main.css" />
<script type="text/javascript">
    var item = null;
</script>
<div class="main_wrapper">
    <div class="main_content">

    </div>
    <div class="item_control"> 
        <span id="toggle_sidebar">&rarr;</span>
    </div>
</div>
<div class="side_wrapper">
    <div class="vertical_drag_bar"></div>
    <div class="side_content">
        <div class="sidebar_title active" id="cart">购物车</div>
        <div class="sidebar_title" id="orders">订单</div>
        <div id="shopping_cart_list_body">
            <div id="button_more"></div>
        </div>
        <div id="orders_list_body">
            <div id="orders_button_more"></div>
        </div>
        <div id="shopping_cart_control">
            <div class="continue">
                <span id="place_order" class="sidebar_buttons">下单</span>
                <div id="detail_info">
                    <table id="detail_info_table">
                        <tbody>
                            <tr>
                                <td><label for="name">姓名</label></td>
                                <td><input id="name" type="text" value="<?php echo $current_user->name; ?>" /></td>

                            </tr>
                            <tr>
                                <td><label for="address">详细住址</label></td>
                                <td><input id="address" type="text" value="<?php echo $current_user->address; ?>" /></td>

                            </tr>
                            <tr>
                                <td><label for="email">电子邮箱</label></td>
                                <td><input id="email" type="email" value="<?php echo $current_user->email; ?>"/></td>

                            </tr>
                            <tr> 
                                <td><label for="phone">电话</label></td>
                                <td><input id="phone" type="phone" value="<?php echo $current_user->phone; ?>" /></td>
                            </tr>
                        </tbody>
                    </table>
                    <span id="confirm" class="sidebar_buttons">确认</span>
                    <span id="back" class="sidebar_buttons">返回</span>
                </div>
            </div>
        </div>
    </div>
</div>