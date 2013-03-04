<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class Cart_model extends MY_Model {

    function __construct() {
        parent::__construct();
    }

    function getList($uid) {
        return $this->db->select()->from('items_in_cart')->where('user_id', $uid)->order_by('created_at', 'desc')->get()->result();
    }

    function getCartItemsCount($user_id) {
        return $this->db->select()->from('items_in_cart')->where('user_id', $user_id)->count_all_results();
    }

    function moveItemsToOrders($user_id, $user_data) {
        $itemsArr = $this->db->select('user_id, amount, taobao_id, detail_url, orig_price, has_discount, has_warranty, has_invoice, item_standing, title, size, weight, post_fee, ems_fee, express_fee, item_for_sale, sell_promise, msg, pic_url')->from('items_in_cart')->where('user_id', $user_id)->get()->result_array();
        //print_r($itemsArr);
        foreach($itemsArr as $key=>$value) {
            $itemsArr[$key]['track_num'] = uniqid('D');
            $itemsArr[$key]['name'] = $user_data['name'];
            $itemsArr[$key]['address'] = $user_data['address'];
            $itemsArr[$key]['email'] = $user_data['email'];
            $itemsArr[$key]['phone'] = $user_data['phone'];
        }
        $this->db->trans_start();
        $this->db->insert_batch('orders', $itemsArr);
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            return false;
        }
        return true;
    }
    
    function emptyCurrentCart($user_id) {
        $this->db->trans_start();
        $this->db->where('user_id', $user_id)->delete('items_in_cart');
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            return false;
        }
        return true;
    }
    
    function delete_cart_item($uid, $iid) {
        $this->db->trans_start();
        $this->db->where('user_id', $uid)->where('id', $iid)->delete('items_in_cart');
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            return false;
        }
        return true;
    }

}

?>
