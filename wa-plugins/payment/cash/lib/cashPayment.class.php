<?php

class cashPayment extends waPayment
{
    //Самойлов НАЧАЛО 08.04.17 16:21 #252 **
    /**
     * Проверяет доступность метода оплаты в зависимости от параметров заказа
     * @param type $parameters
     * @return boolean
     */
    public function isMethodAllowed($parameters)
    {
        $availablity = false;
        if($parameters['spb'])
        {
            if($parameters['available'] || ($parameters['postcash'] && $parameters['sum'] <= 20000))
                $availablity = true;                
        } else
        {
            if(($parameters['available'] && $parameters['sum'] <= 40000 ) || ($parameters['postcash'] && $parameters['sum'] <= 20000))
                $availablity = true; 
        }
        
        return $availablity; 
    }
    //Самойлов КОНЕЦ 08.04.17 16:21
    
    public function allowedCurrency()
    {
        return true;
    }
}
