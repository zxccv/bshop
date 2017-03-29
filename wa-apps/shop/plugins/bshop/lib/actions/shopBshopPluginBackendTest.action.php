<?php

class shopBshopPluginBackendTestAction extends waViewAction
{
    public function execute()
    {
       
        $shop_order_export_model = new shopOrderExportModel();       
        
        $shop_order_export_model->registerOrder(5);
        //$shop_order_export_model->registerOrder(12);
        //$shop_order_export_model->registerOrderExport(11);
        
        //$order_data = $shop_order_export_model->getOrderData(12);
        //$registered_orders = $shop_order_export_model->getRegisteredOrders();

        $this->view->assign('result', $product['name'].'---->'.$pt);
    }
}
