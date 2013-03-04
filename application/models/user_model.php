<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class User_model extends MY_Model {

    function __construct() {
        parent::__construct();
    }
    
    function updateUserInfo($uid, $data) {
        $this->db->set('updated_at', 'NOW()', FALSE);
        $this->db->where('id', $uid)->update('users', $data);
        return $this->db->affected_rows();
    }

    
}

?>
