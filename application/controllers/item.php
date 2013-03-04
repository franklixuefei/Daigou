<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Item extends MY_Controller { // login

    function __construct() {
        parent::__construct();
        $this->load->model('item_model');
    }

    public function purchase() {
        $out->ok = false;
        $data = array (
            'user_id' => $this->current_user->id,
            'amount' => $this->input->post('amount'),
            'taobao_id' => $this->input->post('id'),
            'detail_url' => $this->db->escape_str($this->input->post('detail_url')),
            'pic_url' => $this->db->escape_str($this->input->post('pic_url')),
            'orig_price' => $this->input->post('orig_price'),
            'has_discount' => (bool)$this->input->post('has_discount'),
            'has_warranty' => (bool)$this->input->post('has_warranty'),
            'has_invoice' => (bool)$this->input->post('has_invoice'),
            'item_standing' => $this->input->post('item_standing'),
            'title' => $this->db->escape_str($this->input->post('title')),
            'size' => $this->input->post('size'),
            'weight' => $this->input->post('weight'),
            'post_fee' => $this->input->post('post_fee'),
            'ems_fee' => $this->input->post('ems_fee'),
            'express_fee' => $this->input->post('express_fee'),
            'item_for_sale' => (bool)$this->input->post('item_for_sale'),
            'sell_promise' => (bool)$this->input->post('sell_promise'),
            'msg' => $this->db->escape_str($this->input->post('msg'))
        );
        if ($ret_id = $this->item_model->create_item($data)) {
            $out->ok = true;
            $item = $this->item_model->get_item($ret_id);
            $out->item = $item;
        }
        echo json_encode($out);
    }

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
?>