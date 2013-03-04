<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class Order_model extends MY_Model {

    function __construct() {
        parent::__construct();
    }

    function getList($uid) {
        return $this->db->select()->from('orders')->where('user_id', $uid)->order_by('created_at', 'desc')->get()->result();
    }


    
    function delete_orders_item($uid, $iid) {
        $this->db->trans_start();
        $this->db->where('user_id', $uid)->where('id', $iid)->delete('orders');
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            return false;
        }
        return true;
    }

}

?>
