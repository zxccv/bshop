<?php

require_once dirname(__FILE__).'/../wa-system/autoload/waAutoload.class.php';
waAutoload::register();
waAutoload::getInstance()->add(array(
    'helperClass1cit' => 'wa-system/vendors/1cit/helperClass1cit.class.php'
));

class SystemConfig extends waSystemConfig
{

}
