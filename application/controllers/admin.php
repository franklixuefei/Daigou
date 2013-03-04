<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Admin extends MY_Controller { // login

    function __construct() {
        parent::__construct();
        $this->load->model('admin_model');
        $this->load->model('user_model');
        // TODO: put auth check here: if not admin, redirect to home page
    }
    
    public function index() {
        $header_data = array(
            'base_url' => base_url(),
            'title' => '袋狗网',
            'current_user' => $this->current_user,
            'csrf_token_name' => $this->security->get_csrf_token_name(),
            'csrf_hash' => $this->security->get_csrf_hash()
        );
        $admin_data = array(
            'current_user' => $this->current_user,
            'numActiveOrders' => $this->admin_model->count_active_orders(),
            'numInactiveOrders' => $this->admin_model->count_inactive_orders()
        );
        $footer_data = array(
            'current_user' => $this->current_user
        );
        $this->load->view('admin_header', $header_data);

        $this->load->view('admin_view', $admin_data);

        $this->load->view('admin_footer', $footer_data);

    }
    
    public function getActiveOrders() {
        $itemArray = $this->admin_model->getActiveOrders();
        echo json_encode($itemArray);
    }
    
    public function getInactiveOrders() {
        $itemArray = $this->admin_model->getInactiveOrders();
        echo json_encode($itemArray);
    }
    
    public function update_order_status() {
        $out->ok = false;
        $id = $this->input->post('order_id');
        $status = $this->input->post('order_status');
        if ($this->admin_model->update_order_status($id, $status)) {
            $out->ok = true;
        }
        echo json_encode($out);
    }
    

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
?>