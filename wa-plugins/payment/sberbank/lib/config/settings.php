<?php

return array(
    'LOGIN' => array(
        'value'        => '',
        'title'        => 'Логин',
        'description'  => 'Логин магазина для API. Полученный при подключении',
        'control_type' => waHtmlControl::INPUT,
    ),
    'PASSWORD' => array(
        'value'        => '',
        'title'        => 'Пароль',
        'description'  => 'Пароль магазина для API. Полученный при подключении',
        'control_type' => waHtmlControl::INPUT,
    ),
    'SERVER_MODE' => array(
    'value'        => sberbankPayment::MODE_TEST,
    'title'        => 'Сервер банка',
    'description'  => 'Сервер банка для отправки запросов. Банк сообщает клиенту какой использовать при подключении',
    'control_type' => waHtmlControl::SELECT . ' sberbankPayment::getServerOptions',
    ),
);
