<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Cart extends MY_Controller { // login

    function __construct() {
        parent::__construct();
        $this->load->model('cart_model');
        $this->load->model('user_model');
    }
    
    public function getList() {
        $user_id = $this->current_user->id;
        $itemArray = $this->cart_model->getList($user_id);
        echo json_encode($itemArray);
    }
    
    public function place_order() {
        $out->ok = false;
        $user_id = $this->current_user->id;
        $out->cartEmpty = true;
        $update_data = array();
        // update user info
        if ($this->input->post('name')) $update_data['name'] = $this->db->escape_str($this->input->post('name'));
        if ($this->input->post('address')) $update_data['address'] = $this->db->escape_str($this->input->post('address'));
        if ($this->input->post('email')) $update_data['email'] = $this->input->post('email');
        if ($this->input->post('phone')) $update_data['phone'] = $this->input->post('phone');
        $user_data = array(
            'name' => $this->db->escape_str($this->current_user->name),
            'address' => $this->db->escape_str($this->current_user->address),
            'email' => $this->current_user->email,
            'phone' => $this->current_user->phone
        );
        $this->user_model->updateUserInfo($user_id, $update_data);
        if ($this->cart_model->getCartItemsCount($user_id)) { // cart not empty
            $out->cartEmpty = false;
            if ($this->cart_model->moveItemsToOrders($user_id, $user_data)) {
                if ($this->cart_model->emptyCurrentCart($user_id)) {
                    $out->ok = true;
                }
            }
        } else {
            $out->cartEmpty = true;
            $out->ok = true;
        }
        echo json_encode($out);
    }
    
    function delete_cart_item() {
        $user_id = $this->current_user->id;
        $out->ok = false;
        $item_id = $this->input->post('id');
        if ($this->cart_model->delete_cart_item($user_id, $item_id)) {
            $out->ok = true;
        }
        echo json_encode($out);
    }

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
?>