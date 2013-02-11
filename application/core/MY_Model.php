<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


class MY_Model extends CI_Model {

    public function __construct() {
        parent::__construct();
        mysql_query("SET NAMES 'utf8'");
        $this->set_timezone();
        date_default_timezone_set("EST");
    }

    public function set_timezone() {
        $this->db->query("SET time_zone='-5:00'");
    }

}
?>
