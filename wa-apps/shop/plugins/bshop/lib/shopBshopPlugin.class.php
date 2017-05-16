<?php

////
class shopBshopPlugin extends shopPlugin
{
    public function orderCreateEvent($order_data)
    {
        $shop_order_export_model = new shopOrderExportModel();
        $shop_order_export_model->registerOrder($order_data['order_id']);
    }
    
    public function backendOrderHook($params)
    {        
        $order_id = $params['id'];
        $shop_order_export_model = new shopOrderExportModel();
        return array(
            'action_button' => '<li><a href="'.wa()->getConfig()->getBackendUrl(true).'shop?plugin=bshop&action=registerOrder&order_id='.$order_id.'" class="button blue">Выгрузить в 1С</a></li>',
            'info_section' => $shop_order_export_model->getExportStatus($order_id),
        );
    }
    
    public function productSave($params)
    {        
        $sku = reset($params['data']['skus']);
        $min_purchase_time = 200;
        
        $settinsModel = new waAppSettingsModel();        
        $stock_times_json = $settinsModel->get(array('shop','bshop'),'stock_time');
        $stock_times = json_decode($stock_times_json,true);
                
        foreach ($sku['stock'] as $stock_key => $stock_remain)        
        {
            if((int)$stock_remain > 0)
            {
                $stock_purchase_time = $stock_times[$stock_key];
                
                if($stock_purchase_time <= $min_purchase_time)
                    $min_purchase_time = $stock_purchase_time;
            };
        };
        
        $params_model = new shopProductParamsModel(); 
        
        if($min_purchase_time == 200)
        {
            $current_params = array();
        }
        else
        {
            $current_params = $params_model->get($params['data']['id']);
            $current_params['yandexmarket.local_delivery_days'] = $min_purchase_time+1;
            $current_params['yandexmarket.local_delivery_cost'] = 400;        
        }
        
        $params_model->set($params['data']['id'], $current_params);
    }
}


