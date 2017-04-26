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
}


