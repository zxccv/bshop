<?php

class shopBshopPluginBackendTestAction extends waViewAction
{
    public function execute()
    {
        
        
       
        $shop_order_export_model = new shopOrderExportModel();       
        
        $shop_order_export_model->getExportStatus(29);
        //$shop_order_export_model->registerOrder(5);
        //$shop_order_export_model->registerOrder(5);
        //$shop_order_export_model->registerOrder(13);
        //$shop_order_export_model->registerOrderExport(12);
        //$shop_order_export_model->registerOrderExport(14);
        //$shop_order_export_model->registerOrderExport(15);
        //$shop_order_export_model->registerOrderExport(16);
        //$shop_order_export_model->registerOrderExport(17);
        
        //$order_data = $shop_order_export_model->getOrderData(12);
        //$registered_orders = $shop_order_export_model->getRegisteredOrders();

        $this->view->assign('result', $product['name'].'---->'.$pt);
    }
}
