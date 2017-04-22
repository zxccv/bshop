<?php

class sdeknpMusLabShipping extends waShipping
{
    protected function calculate()
    {          
        if(!$this->getAddress('zip'))
            return "Не задан точный адрес доставки";
        
        $cart = new shopCart();
        $calc_result = helperClass1cit::getSdekCalculation($this->getAddress('zip'), $cart->items(),$this->getTotalPrice());
        if(is_string($calc_result))
            return $calc_result;
                       
        $deliveries = array();        
        $deliveries[] =
                array(
                'name'         => 'Доставка курьером СДЭК (наложенный платеж, +4% от стоимости заказа)',
                'currency'     => 'RUB',
                'rate'         => $calc_result['rate'],
                'est_delivery' => $calc_result['est_delivery']
            );
                
        return $deliveries;
    }

    public function allowedCurrency()
    {
        return 'RUB';
    }

    public function allowedWeightUnit()
    {
        return 'kg';
    }

    public function requestedAddressFields()
    {
        return false;
    }
    
    //Самойлов НАЧАЛО 22.04.17 13:58 #252
    /**
     * Проверяет доступность метода доставки в зависимости от параметров заказа
     * @param type $parameters
     * @return boolean
     */
    public function isMethodAllowed($parameters)
    {
       $availablity = false;
        
        if($parameters['spb'] === false && $parameters['is_payment_post'] === true && $parameters['weight'] <= 20)
        {
            $availablity = true;                
        }
                
        return $availablity; 
    }
    //Самойлов КОНЕЦ 22.04.17 13:58
}
