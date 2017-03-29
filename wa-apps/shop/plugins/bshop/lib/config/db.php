<?php

return array(
    'shop_order_export' => array(        
        'order_id' => array('int', 11, 'null' => 0),
        'add_datetime' => array('timestamp', 'null' => 0, 'default' => 'CURRENT_TIMESTAMP'),
        'export_datetime' => array('timestamp'),
        'error' => array('varchar', 255, 'null' => 0, 'default' => ''),
        ':keys' => array(            
            'INDEX' => array('order_id'),
        ),
    ),    
);

