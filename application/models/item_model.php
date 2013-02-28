<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class Item_model extends MY_Model {

    function __construct() {
        parent::__construct();
    }
    
    function create_item($data) {
        $this->db->insert('items_in_cart', $data);
        return $this->db->insert_id();
    }
    
    function get_item($id) {
        return $this->db->select()->from('items_in_cart')->where('id', $id)->get()->row();
    }
    
    function getList($uid) {
        return $this->db->select()->from('items_in_cart')->where('user_id', $uid)->get()->result();
    }

    
}

?>
