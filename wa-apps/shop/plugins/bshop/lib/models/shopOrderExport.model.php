<?php

class shopOrderExportModel extends waModel
{
    protected $table = 'shop_order_export';
    
    public function registerOrder($order_id)
    {
        $current_registration = $this->getByField(array('order_id' => $order_id,'export_datetime' => NULL));
        
        if($current_registration === false)
            $this->insert(array('order_id' => $order_id));
    }
    
    public function registerOrderExport($order_id,$error = '')
    {
        $current_registration = $this->getByField(array('order_id' => $order_id,'export_datetime' => NULL));
        if(is_array($current_registration))
        {
            $this->updateByField(array('order_id' => $order_id,'export_datetime' => NULL), array('export_datetime' => date('Y-m-d H:i:s'),'error' => $error));
        }
    }
    
    public function getExportStatus($order_id)
    {
        $current_line =  $this->query("
                SELECT * FROM {$this->table} WHERE ".
                $this->getWhereByField('order_id',$order_id)." ORDER BY add_datetime DESC LIMIT 1")->fetchAssoc();
                
        
        if($current_line !== FALSE)
        {
            if($current_line['export_datetime'] === NULL)
            {
                $status = '<p style="color: blue;">Зарегистрирован к выгрузке в 1С '.$current_line['add_datetime'].'</p>';
            }
            elseif($current_line['error'] === '')
            {
                $status = '<p style="color: green;">Загружен в 1С '.$current_line['export_datetime'].'</p>';
            }
            else
            {
                $status = '<p style="color: red;">Попытка загрузки в 1С '.$current_line['export_datetime'].'</p>';
                $status .= '<p style="color: red;">При загрузке возникла ошибка '.$current_line['error'].'</p>';
            }
        }
        else
        {
            $status = '<p>Не выгружался в 1С</p>';
        }      
        
        return $status;
    }


    public function getRegisteredOrders()
    {
        $orders_data = array_map(
                function($order)
                { 
                    return $this->getOrderData($order['order_id']);
                },$this->getByField('export_datetime',NULL,true));
                
        return $orders_data;
    }
    
    public function getOrderData($order_id)
    {
        $order_data = array();
        
        $order_data['НомерЗаказа'] = 'МЛ'.sprintf("%'09d",$order_id);
        
        $order_model = new shopOrderModel();
        
        $order = $order_model->getOrder($order_id,TRUE);
        
        $order_data['ДатаЗаказа'] = $order['create_datetime'];
        
        $order_params = $order['params'];
        
        //Самойлов НАЧАЛО 25.05.17 16:12 #276
        $order_data['auth_code'] = $order_params['auth_code'];
        $order_data['auth_pin'] = $order_params['auth_pin'];
        //Самойлов КОНЕЦ 25.05.17 16:12
        
        //Самойлов НАЧАЛО 22.06.17 9:33 #
        if(isset($order_params['yandexmarket.campaign_id']))
            $order_data['YandexMarket'] = true;
        else
            $order_data['YandexMarket'] = false;
        //Самойлов КОНЕЦ 22.06.17 9:33
        
        $order_data['ТипОплаты'] = $order_params['payment_plugin'];
        //Самойлов НАЧАЛО 22.06.17 9:38 #
        $order_data['ТипОплатыНаименование'] = $order_params['payment_name'];
        //Самойлов КОНЕЦ 22.06.17 9:38
        $order_data['ТипДоставки'] = $order_params['shipping_plugin'];
        
        $address = array();
        
        $address['Индекс'] = $order_params['shipping_address.zip'];
        $address['КодРегиона'] = $order_params['shipping_address.region'];
        $city_full = helperClass1cit::getCityFullNameFromKladr($order_params['shipping_address.city'], $order_params['shipping_address.region']);
        if(is_string($city_full))
        {
            $address['Город'] = $city_full.' г';
        }
        else
        {
            if($city_full['type'] == 'г')
            {
                $address['Город'] = $city_full['name'].' '.$city_full['type'];
            } else
            {
                $address['НаселенныйПункт'] = $city_full['name'].' '.$city_full['type'];
            }            
        }
        
        $address_fields = explode(',', $order_params['shipping_address.street']);
        
        foreach ($address_fields as $address_field)
        {
            $address_field = trim($address_field);
            
            if(ctype_digit($address_field) || mb_substr($address_field, 0, 2) == 'кв')
            {
                //Квартира
                $address['Квартира'] = $address_field;
            }
            elseif(mb_substr($address_field, 0, 3) == 'д. ')
            {
                //Дом
                $address_field = mb_substr($address_field, 3);
                
                $corpus_pos = mb_stripos($address_field, 'к');
                if($corpus_pos === FALSE)
                {
                    $address['Дом'] = $address_field;
                } else
                {
                    $address['Дом'] = mb_substr($address_field, 0, $corpus_pos);
                    $address['Корпус'] = mb_substr($address_field, $corpus_pos + 1);
                }
            }            
            elseif(trim($address_field) != '-')
            {
                $dot_pos = mb_stripos($address_field, '.');
                if($dot_pos != 0)
                {
                    $address['Улица'] = mb_substr($address_field, $dot_pos+2).' '.mb_substr($address_field, 0, $dot_pos);
                } else {
                    $address['Улица'] = $address_field; 
                }
            }            
        }
              
        $order_data['АдресДоставки'] = $address;
        //$order_data['АдресДоставки'] = 'Почтовый индекс: '.$order_params['shipping_address.zip'].',';
        /*$region_model = new waRegionModel();
        
        $region = $region_model->get($order_params['shipping_address.country'],$order_params['shipping_address.region']);
        if(isset($region['name']))
            $order_data['АдресДоставки'].= $region['name'].', ';*/
        
        //$order_data['АдресДоставки'].= 'Город: '.$order_params['shipping_address.city'].',';
        //$order_data['АдресДоставки'].= $order_params['shipping_address.street'];
        
        $order_data['СтоимостьДоставки'] = (float)$order['shipping'];
        
        $order_data['Сумма'] = (float)$order['total'];;
        $order_data['СуммаСкидки'] = (float)$order['discount'];
        $order_data['СуммаПоТоварам'] = 0.0;
        
        $order_data['Комментарий'] = $order['comment'];
                
        $order_data['Партнер'] = array();
        
        $order_data['Партнер']['Код'] = 'МЛ'.sprintf("%'09d",$order['contact']['id']);
        $order_data['Партнер']['ФИО'] = $order['contact']['name'];
        $order_data['Партнер']['Адрес'] = $order_data['АдресДоставки'];
        
        $order_data['Партнер']['Телефон'] = $order['contact']['phone'] ? "+".$order['contact']['phone'] : '';
                
        $order_data['Партнер']['ЭлектроннаяПочта'] = $order['contact']['email'];
        
        
        $items_data = array();
        
        foreach($order['items'] as $item)
        {
            $item_data = array();
            
            $item_data['УникальныйИдентификатор'] = $item['id_1c'];
            $item_data['Наименование'] = $item['name'];
            $item_data['Количество'] = (float)$item['item']['quantity'];
            $item_data['Цена'] = (float)$item['item']['price'];
            $item_data['Сумма'] = $item_data['Цена'] * $item_data['Количество'];
            
            $order_data['СуммаПоТоварам'] += $item_data['Сумма'];
            
            $items_data[]=$item_data;
        }
        
        $order_data['Товары'] = $items_data;
        
        return $order_data;
    }
}
