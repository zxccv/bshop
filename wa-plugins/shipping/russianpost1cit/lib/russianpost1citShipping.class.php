<?php

/**
 *
 * @property-read array $rate_zone
 * @property-read string $rate_by
 * @property-read string $currency
 * @property-read array $rate
 * @property-read string $delivery_time
 * @property-read string $prompt_address
 */

class russianpost1citShipping extends waShipping
{
    protected function calculate()
    {
        require_once 'postcalc.class.php';
        $postcalclib = new postCalc();
        $postResponce = $postcalclib->postcalc_request(192236, $this->getAddress('zip'), $this->getTotalWeight()*1000 , $this->getTotalPrice(), 'RU');
        if(gettype($postResponce) == "string")
            return $postResponce;
        
        $currency = $this->currency;
        
        $CP = $postResponce[Отправления][ЦеннаяПосылка];
        
        $deliveries = array();        
        $deliveries[1] =
                array(
                'name'         => $CP[Название],
                'currency'     => $currency,
                'rate'         => $CP[Тариф],
                'est_delivery' => $CP[СрокДоставки].' дней'
            );
        
        $CP = $postResponce[Отправления][ПростаяБандероль];
                
        $deliveries[2] =
                array(
                'name'         => $CP[Название],
                'currency'     => $currency,
                'rate'         => $CP[Тариф],
                'est_delivery' => $CP[СрокДоставки].' дней'
            );
        
        return $deliveries;
    }

    public function allowedCurrency()
    {
        return $this->currency;
    }

    public function allowedWeightUnit()
    {
        return 'kg';
    }

    public function requestedAddressFields()
    {
        return $this->prompt_address ? array() : false;
    }
}
