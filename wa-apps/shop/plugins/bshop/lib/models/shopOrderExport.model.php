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
        
        $order_data['ТипОплаты'] = $order_params['payment_plugin'];
        $order_data['ТипДоставки'] = $order_params['shipping_plugin'];
        //$order_data['']
        
        $order_data['АдресДоставки'] = $order_params['shipping_address.zip'].', ';
        
        $region_model = new waRegionModel();
        
        $region = $region_model->get($order_params['shipping_address.country'],$order_params['shipping_address.region']);
        if(isset($region['name']))
            $order_data['АдресДоставки'].= $region['name'].', ';
        
        $order_data['АдресДоставки'].= $order_params['shipping_address.city'].', ';
        $order_data['АдресДоставки'].= $order_params['shipping_address.city'].', ';
        $order_data['АдресДоставки'].= $order_params['shipping_address.street'];
        
        $order_data['СтоимостьДоставки'] = (float)$order['shipping'];
        
        $order_data['Сумма'] = (float)$order['total'];;
        $order_data['СуммаСкидки'] = (float)$order['discount'];
                
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
            
            $items_data[]=$item_data;
        }
        
        $order_data['Товары'] = $items_data;
        
        return $order_data;
    }
}
