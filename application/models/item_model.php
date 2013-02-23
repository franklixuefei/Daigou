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

    
}

?>
