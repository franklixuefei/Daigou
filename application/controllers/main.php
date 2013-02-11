<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Main extends MY_Controller { // login

    function __construct() {
        parent::__construct();
        //$this->load->helper('form');
        //$this->load->helper('security');
        $this->load->model('main_model');
        require_once('application/third_party/taobao/TopSdk.php');
    }

    public function index() {
//        echo $this->current_user;
        $header_data = array(
            'base_url' => base_url(),
            'title' => '袋狗网',
            'current_user' => $this->current_user,
            'csrf_token_name' => $this->security->get_csrf_token_name(),
            'csrf_hash' => $this->security->get_csrf_hash()
        );
        $main_data = array(
            'current_user' => $this->current_user
        );
        $footer_data = array(
            'current_user' => $this->current_user
        );
        $this->load->view('header', $header_data);

        $this->load->view('main_view', $main_data);

        $this->load->view('footer', $footer_data);

    }

    public function get_result() {
        $id = $this->input->post('id');
        $c = new TopClient;
        $c->appkey = "21387032";
        $c->secretKey = "e7aa253ff09a8b81e812945a5329e960";
        $c->format = 'json';
        $req = new ItemGetRequest;
        $req->setFields("detail_url,title,desc,pic_url,num,list_time,delist_time,stuff_status,location,price,post_fee,express_fee,ems_fee,has_discount,has_invoice,has_warranty,approve_status");
        $req->setNumIid((int)$id);
        $resp = $c->execute($req);
        echo json_encode($resp);
    }

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
?>