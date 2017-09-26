<?php

/*
 * The Channel Model
 * Link http://github.com/typefo/lamb
 * Copyright (C) typefo <typefo@qq.com>
 */

use Tool\Filter;

class ChannelModel {
    public $db = null;
    private $table = 'channels';
    private $column = ['id', 'gid', 'weight', 'operator'];
    
    public function __construct() {
        $this->db = Yaf\Registry::get('db');
    }

    public function get($id = null, $gid = null) {
        $sql = 'SELECT * FROM ' . $this->table . ' WHERE id = ' . intval($id) . ' and gid = ' . intval($gid);
        $sth = $this->db->query($sql);
        if ($sth) {
            $result = $sth->fetch();
            if ($result !== false) {
                return $result;
            }
        }

        return null;
    }

    public function getAll($gid = null) {
        $result = [];
        $sql = 'SELECT * FROM ' . $this->table . ' WHERE gid = ' . intval($gid) . ' ORDER BY weight';
        $sth = $this->db->query($sql);
        if ($sth) {
            $result = $sth->fetchAll();
        }

        return $result;
    }

    public function create(array $data = null) {
        $data = $this->checkArgs($data);

        if ($this->isExist($data['id'])) {
            $sql = 'INSERT INTO channels VALUES(:id, :gid, :weight, :operator)';
            $sth = $this->db->prepare($sql);

            foreach ($data as $key => $val) {
                if ($val !== null) {
                    $sth->bindValue(':' . $key, $data[$key], is_int($val) ? PDO::PARAM_INT : PDO::PARAM_STR);
                } else {
                    return false;
                }
            }

            if ($sth->execute()) {
                return true;
            }
        }


        return false;
    }

    public function delete($id = null, $gid = null) {
        if ($this->getTotal($gid) > 1) {
            $sql = 'DELETE FROM ' . $this->table . ' WHERE id = ' . intval($id) . ' and gid = ' . intval($gid);
            if ($this->db->query($sql)) {
                return true;
            }
        }
        return false;
    }

    public function deleteAll($gid = null) {
        $sql = 'DELETE FROM ' . $this->table . ' WHERE gid = ' . intval($gid);
        if ($this->db->query($sql)) {
            return true;
        }

        return false;
    }

    public function isExist($id = null) {
        $sql = 'SELECT count(id) AS total FROM gateway WHERE id = ' . intval($id);
        $sth = $this->db->query($sql);
        if ($sth) {
            $result = $sth->fetch();
            if (intval($result['total']) > 0) {
                return true;
            }
        }

        return false;
    }

    public function checkArgs(array $data) {
        $res = array();
        $data = array_intersect_key($data, array_flip($this->column));

        foreach ($data as $key => $val) {
            switch ($key) {
            case 'id':
                $res['id'] = Filter::number($val, null);
                break;
            case 'gid':
                $res['gid'] = Filter::number($val, null);
                break;
            case 'weight':
                $res['weight'] = Filter::number($val, null, 1);
                break;
            case 'operator':
                $res['operator'] = Filter::number($val, null);
                break;
            }
        }

        return $res;
    }

    public function keyAssembly(array $data) {
    	$text = '';
        $append = false;
        foreach ($data as $key => $val) {
            if ($val !== null) {
                if ($text != '' && $append) {
                    $text .= ", $key = :$key";
                } else {
                    $append = true;
                    $text .= "$key = :$key";
                }
            }
        }
        return $text;
    }
}