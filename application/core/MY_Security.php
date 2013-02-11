<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


class MY_Security extends CI_Security {

    public function __construct() {
        parent::__construct();
    }

    public function csrf_show_error() {
        //show_error('The action you have requested is not allowed.');
        // Set 401 header instead of the default 500
        show_error('The action you have requested is not allowed.', 401);
    }

}
?>
