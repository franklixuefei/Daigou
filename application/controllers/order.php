<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Order extends MY_Controller { // login

    function __construct() {
        parent::__construct();
        $this->load->model('order_model');
        $this->load->model('user_model');
    }
    
    public function getList() {
        $user_id = $this->current_user->id;
        $itemArray = $this->order_model->getList($user_id);
        echo json_encode($itemArray);
    }
    
    
    
    function delete_orders_item() {
        $user_id = $this->current_user->id;
        $out->ok = false;
        $item_id = $this->input->post('id');
        if ($this->order_model->delete_orders_item($user_id, $item_id)) {
            $out->ok = true;
        }
        echo json_encode($out);
    }

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
?>