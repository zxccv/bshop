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
        $params_model = new shopProductParamsModel(); 
        
        //$types_model = new shopTypeModel();        
        //$vinyl_type_id = $types_model->getByField('name','Виниловая пластинка')['id'];
        $vinyl_type_id = 18;

        if($params['data']['type_id'] == $vinyl_type_id)
        {
            $product_params_entry = array();
            $product_params_entry['product_id'] = $params['data']['id'];
            $product_params_entry['name'] = 'yandexmarket.ignored';
            $product_params_entry['value'] = '1';
            $params_model->insert($product_params_entry,1);
            return;             
        }
        
        $stock_times_cache = new waRuntimeCache('shop_bshop_stockcache');
        
        if($stock_times_cache->isCached())
        {
            $stock_times = $stock_times_cache->get();
        } else
        {        
            $settinsModel = new waAppSettingsModel();        
            $stock_times_json = $settinsModel->get(array('shop','bshop'),'stock_time');
            $stock_times = json_decode($stock_times_json,true);
            $stock_times_cache->set($stock_times);
        }
        
        $sku = reset($params['data']['skus']);
        $min_purchase_time = 200;       
                
        foreach ($sku['stock'] as $stock_key => $stock_remain)        
        {
            if((int)$stock_remain > 0)
            {
                $stock_purchase_time = $stock_times[$stock_key];
                
                if($stock_purchase_time <= $min_purchase_time)
                    $min_purchase_time = $stock_purchase_time;
            };
        };
                        
        if($min_purchase_time == 200)
        {
            $params_model->deleteByField(array('product_id'=>$params['data']['id'],'name'=>'yandexmarket.local_delivery_days'));
            $params_model->deleteByField(array('product_id'=>$params['data']['id'],'name'=>'yandexmarket.local_delivery_cost'));
        }
        else
        {
            $product_params_entry = array();
            $product_params_entry['product_id'] = $params['data']['id'];
            $product_params_entry['name'] = 'yandexmarket.local_delivery_days';
            $product_params_entry['value'] = $min_purchase_time+1;
            $params_model->insert($product_params_entry,1);
            
            $product_params_entry = array();
            $product_params_entry['product_id'] = $params['data']['id'];
            $product_params_entry['name'] = 'yandexmarket.local_delivery_cost';
            $product_params_entry['value'] = '400';
            $params_model->insert($product_params_entry,1);
        }
    }
}


