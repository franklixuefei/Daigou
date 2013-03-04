<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class Admin_model extends MY_Model {

    function __construct() {
        parent::__construct();
    }

    function getActiveOrders() {
        return $this->db->select()->from('orders')->where('status <', 3)->order_by('created_at', 'desc')->order_by('user_id', 'asc')->get()->result();
    }
    
    function getInactiveOrders() {
        return $this->db->select()->from('orders')->where('status >=', 3)->order_by('created_at', 'desc')->order_by('user_id', 'asc')->get()->result();
    }
    
    function count_active_orders() {
        return $this->db->select()->from('orders')->where('status <', 3)->count_all_results();
    }
    
    function count_inactive_orders() {
        return $this->db->select()->from('orders')->where('status >=', 3)->count_all_results();
    }
    
    function update_order_status($id, $status) {
        $data = array (
            'status' => (int)$status,
            'updated' => 1
        );
        $this->db->set('updated_at', 'NOW()', FALSE);
        $this->db->where('id', $id)->update('orders', $data);
        return $this->db->affected_rows();
    }

}

?>
