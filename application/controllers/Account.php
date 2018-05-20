<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Account extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->library('session');
        $this->load->model('User_model');
        $this->load->model('Product_model');
        $session_user = $this->session->userdata('logged_in');
        if ($session_user) {
            $this->user_id = $session_user['login_id'];
        } else {
            $this->user_id = 0;
        }
    }

    public function index() {
        redirect('Account/profile');
    }

    public function profile() {
        if ($this->user_id == 0) {
            redirect('/');
        }

        $user_details = $this->User_model->user_details($this->user_id);
        $data['user_details'] = $user_details;
        $data['msg'] = "";
        if (isset($_POST['change_password'])) {
            $old_password = $this->input->post('old_password');
            $new_password = $this->input->post('new_password');
            $re_password = $this->input->post('re_password');

            if ($user_details->password == md5($old_password)) {
                if ($new_password == $re_password) {
                    $password = md5($re_password);
                    $this->db->set('password', $password);
                    $this->db->where('id', $this->user_id);
                    $this->db->update('admin_users');
                    redirect('Account/profile');
                } else {
                    $data['msg'] = "Password didn't match.";
                }
            } else {
                $data['msg'] = 'Enterd wrong password.';
            }
        }


        if (isset($_POST['update_profile'])) {
            $this->db->set('first_name', $this->input->post('first_name'));
            $this->db->set('last_name', $this->input->post('last_name'));
            $this->db->set('contact_no', $this->input->post('contact_no'));
            $this->db->set('gender', $this->input->post('gender'));
            $this->db->set('birth_date', $this->input->post('birth_date'));

            $this->db->where('id', $this->user_id);
            $this->db->update('admin_users');

            $session_user = $this->session->userdata('logged_in');
            $session_user['first_name'] = $this->input->post('first_name');
            $session_user['last_name'] = $this->input->post('last_name');
            $this->session->set_userdata('logged_in', $session_user);

            redirect('Account/profile');
        }
        $this->load->view('Account/profile', $data);
    }

    function login() {
        $data1['msg'] = "";

        $link = isset($_GET['page']) ? $_GET['page'] : '';

        if (isset($_POST['signIn'])) {
            $username = $this->input->post('email');
            $password = $this->input->post('password');

            $this->db->select('au.id,au.first_name,au.last_name,au.email,au.password,au.user_type, au.image');
            $this->db->from('admin_users au');
            $this->db->where('email', $username);
            $this->db->where('password', md5($password));
            $this->db->limit(1);
            $query = $this->db->get();
            if ($query->num_rows() > 0) {
                $userdata = $query->result_array()[0];
                $usr = $userdata['email'];
                $pwd = $userdata['password'];
                if ($username == $usr && md5($password) == $pwd) {
                    $sess_data = array(
                        'username' => $username,
                        'first_name' => $userdata['first_name'],
                        'last_name' => $userdata['last_name'],
                        'login_id' => $userdata['id'],
                    );

                    $session_cart = $this->session->userdata('session_cart');
                    $productlist = $session_cart['products'];

                    foreach ($productlist as $key => $value) {
                        $quantity = $value['quantity'];
                        $product_id = $value['product_id'];
                        $this->Product_model->cartOperation($product_id, $quantity, $userdata['id'], 1);
                    }
                    $this->session->set_userdata('logged_in', $sess_data);

                    if ($link == 'checkout') {
                        redirect('Cart/checkout');
                    }

                    redirect('Account/profile');
                } else {
                    $data1['msg'] = 'Invalid Email Or Password, Please Try Again';
                }
            } else {
                $data1['msg'] = 'Invalid Email Or Password, Please Try Again';
                //redirect('Account/login', $data1);
            }
        }
        $this->load->view('Account/login', $data1);
    }

    // Logout from admin page
    function logout() {
        $newdata = array(
            'username' => '',
            'password' => '',
            'logged_in' => FALSE,
        );

        $this->session->unset_userdata($newdata);
        $this->session->sess_destroy();

        redirect('/');
    }

    function orderList() {
        if ($this->user_id == 0) {
            redirect('/');
        }
        $this->db->where('user_id', $this->user_id);
        $query = $this->db->get('user_order');
        $orderlist = $query->result();
        $data['orderslist'] = $orderlist;
        $this->load->view('Account/orderList', $data);
    }

}

?>
