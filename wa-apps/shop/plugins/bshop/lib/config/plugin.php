<?php

return array(
    'name' => 'bshop', 
    'img'  => 'img/bshop.png',
    'frontend' => true,
    'handlers' => array(
        'order_action.create' => 'orderCreateEvent',
        'backend_order' => 'backendOrderHook',
        'product_save' => 'productSave'
    ),
    );