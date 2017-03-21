<?php

class sdekMusLabShipping extends waShipping
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
                'name'         => 'Доставка курьером СДЭК',
                'currency'     => $currency,
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
}
