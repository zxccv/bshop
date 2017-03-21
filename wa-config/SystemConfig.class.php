<?php

require_once dirname(__FILE__).'/../wa-system/autoload/waAutoload.class.php';
waAutoload::register();
waAutoload::getInstance()->add(array(
    'helperClass1cit' => 'wa-system/vendors/1cit/helperClass1cit.class.php',
    'KladrApi' => 'wa-system/vendors/1cit/kladr.php',
    'KladrObject' => 'wa-system/vendors/1cit/kladr.php',
    'ObjectType' => 'wa-system/vendors/1cit/kladr.php',
    'KladrQuery' => 'wa-system/vendors/1cit/kladr.php',
));

class SystemConfig extends waSystemConfig
{

}
