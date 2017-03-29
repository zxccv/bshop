<?php


class shopBshopPlugin extends shopPlugin
{
    public function orderCreateEvent($order_data)
    {
        $shop_order_export_model = new shopOrderExportModel();
        $shop_order_export_model->registerOrder($order_data['order_id']);
    }
}


