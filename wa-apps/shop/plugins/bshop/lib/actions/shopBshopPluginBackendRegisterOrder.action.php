<?php

class shopBshopPluginBackendRegisterOrderAction extends waViewAction
{
    public function execute()
    {        
        $order_id = waRequest::get('order_id');
        $shop_order_export_model = new shopOrderExportModel();
        
        $shop_order_export_model->registerOrder((int)$order_id);
        
        $this->redirect(wa()->getConfig()->getBackendUrl(true).'shop/?action=orders#/orders/id='.$order_id.'/');
    }
}
