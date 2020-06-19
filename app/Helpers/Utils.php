<?php

namespace App\Helpers;


class Utils{

    private $data;

    public function put($key,$val){
        $this->data[$key] = $val;
    }

    public function get($key){
       return $this->data[$key];
    }
}