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
                'currency'     => $currency,
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
        return false;
    }
}
