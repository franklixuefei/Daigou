<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class MY_Controller extends CI_Controller {

    protected $current_user;

    public function __construct() { // testing parameter : /market/1
        parent::__construct();
        $this->set_timezone();
        date_default_timezone_set("EST");
        $this->current_user = $this->current_user();
        $this->load->helper('cookie');
    }

    public function set_timezone() {
        $this->db->query("SET time_zone='-5:00'");
    }

    public function getUniqueCode($length = "") {
        do {
            $code = md5(uniqid(rand(), true));
        } while ($this->db->select()->from('users')->where('token', $code)->count_all_results()); // make sure there are no duplicates
        if ($length != "")
            return substr($code, 0, $length);
        else
            return $code;
    }

/*    function genTempPW($length = 8) {

        // start with a blank password
        $password = "";

        // define possible characters - any character in this string can be
        // picked for use in the password, so if you want to put vowels back in
        // or add special characters such as exclamation marks, this is where
        // you should do it
        $possible = "2346789bcdfghjkmnpqrtvwxyzBCDFGHJKLMNPQRTVWXYZ";

        // we refer to the length of $possible a few times, so let's grab it now
        $maxlength = strlen($possible);

        // check for length overflow and truncate if necessary
        if ($length > $maxlength) {
            $length = $maxlength;
        }

        // set up a counter for how many characters are in the password so far
        $i = 0;

        // add random characters to $password until $length is reached
        while ($i < $length) {

            // pick a random character from the possible ones
            $char = substr($possible, mt_rand(0, $maxlength - 1), 1);

            // have we already used this character in $password?
            if (!strstr($password, $char)) {
                // no, so it's OK to add it onto the end of whatever we've already got...
                $password .= $char;
                // ... and increase the counter by one
                $i++;
            }
        }

        // done!
        return $password;
    }
*/
    public function current_user() {
        $user_cookie = $this->input->cookie('DAIGOU_USER_TOKEN');
        $id = $this->input->cookie('DAIGOU_ID');
        if (!$user_cookie || !$id) {
            $token = $this->getUniqueCode();
            // create user in db with newly generated token
            $data["token"] = $token;
            $this->db->insert('users', $data);
            $id = $this->db->insert_id();
            // set cookie as token
            $cookie = array(
                'name' => 'USER_TOKEN',
                'value' => "$token",
                'expire' => '31536000'
            );
            $this->input->set_cookie($cookie);
            $id_cookie = array(
                'name' => 'ID',
                'value' => "$id",
                'expire' => '31536000'
            );
            $this->input->set_cookie($id_cookie);
            // fetch the user according to this token
            $current_user = $this->db->select('*')->from('users')->where('token', $user_cookie)->where('id', $id)->limit(1)->get()->row();
        } else {
            $current_user = $this->db->select('*')->from('users')->where('token', $user_cookie)->where('id', $id)->limit(1)->get()->row();
            if (!$current_user) {
                // delete DAIGOU_USER_TOKEN cookie
                delete_cookie('DAIGOU_USER_TOKEN');
                delete_cookie('DAIGOU_ID');
                $token = $this->getUniqueCode();
                // create user in db with newly generated token
                $data["token"] = $token;
                $this->db->insert('users', $data);
                $id = $this->db->insert_id();               /* FIXME: better use transaction and handle error here.*/
                // set cookie as token
                $cookie = array(
                    'name' => 'USER_TOKEN',
                    'value' => "$token",
                    'expire' => '31536000' // one year
                );
                $this->input->set_cookie($cookie);
                $id_cookie = array(
                    'name' => 'ID',
                    'value' => "$id",
                    'expire' => '31536000'
                );
                $this->input->set_cookie($id_cookie);
                // fetch the user according to this token and id
                $current_user = $this->db->select('*')->from('users')->where('token', $user_cookie)->where('id', $id)->limit(1)->get()->row();
            }   
        }
        return $current_user;
    }

}

?>
