<script type="text/javascript" src="<?php echo $base_url; ?>application/assets/javascripts/admin/admin.js"></script>
<link rel="stylesheet" type="text/css" href="<?php echo $base_url; ?>application/assets/stylesheets/admin/admin.css" />
<script type="text/javascript">
    
</script>
<div class="admin_wrapper">
    <div class="admin_content">
        <div class="active_orders_container main_block">
            <div class="block_header clearfix">
                <div id="detail" class="block_header_icon"></div>
                <div id="detail" class="block_header_title">活跃订单</div>
                <span class="num_orders"><?php echo $numActiveOrders?></span>
            </div>
            <div class="block_content">
                <div id="active_orders_list_body"></div>
                <div id="active_orders_button_more"></div>
            </div>
        </div>
        <div class="inactive_orders_container main_block">
            <div class="block_header clearfix">
                <div id="detail" class="block_header_icon"></div>
                <div id="detail" class="block_header_title">已成交／关闭订单</div>
                <span class="num_orders"><?php echo $numInactiveOrders?></span>
            </div>
            <div class="block_content">
                <div id="inactive_orders_list_body"></div>
                <div id="inactive_orders_button_more"></div>
            </div>
        </div>
    </div>

</div>
