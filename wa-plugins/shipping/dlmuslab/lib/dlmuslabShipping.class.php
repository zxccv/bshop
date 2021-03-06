<?php

class dlMusLabShipping extends waShipping
{
    protected function calculate()
    {          
        $kladr_id = helperClass1cit::getCityIDFromKladr($this->getAddress('city'), $this->getAddress('region'));       
        
        $cart = new shopCart();
        $calc_result = helperClass1cit::getDLCalculation($kladr_id, $cart->items(),$this->getTotalPrice());
        if(is_string($calc_result))
            return $calc_result;
               
        $deliveries = array();        
        foreach ($calc_result as $delivery_variant)
        {
            $deliveries[] =
                array(
                'name'         => $delivery_variant['name'],
                'currency'     => 'RUB',
                'rate'         => $delivery_variant['rate'],
                'est_delivery' => $delivery_variant['est_delivery']
            );
        }       
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
        return array();
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
        
        if($parameters['spb'] === false && $parameters['is_payment_post'] === false && $parameters['weight'] >= 2)
        {
            $availablity = true;                
        }
                
        return $availablity; 
    }
    //Самойлов КОНЕЦ 22.04.17 13:58
}
