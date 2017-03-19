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

        $cart = new shopCart();
        $cart_items = $cart->items();
                
        $product_ids = array();
        foreach($cart_items as $cart_item)
        {
          $product_ids[]=$cart_item['id'];  
        };
        
        $purch_time = helperClass1cit::getProductsPurchaseTime($product_ids);
        
        $CP = $postResponce['Отправления']['ЦеннаяПосылка'];
        
        $dost_date = new DateTime();
        
        $dost_date = date_add($dost_date, new DateInterval('P'.$purch_time.'D'));
        
        $tire_position = strpos($CP['СрокДоставки'],'-');
        if($tire_position == FALSE)
        {
            $delivery_time = $CP['СрокДоставки'];
        }
        else
        {
            $delivery_time = substr($CP['СрокДоставки'], $tire_position+1);
        }
        
        $dost_date = date_add($dost_date, new DateInterval('P'.$delivery_time.'D'));
                
        $deliveries = array();        
        $deliveries[] =
                array(
                'name'         => $CP['Название'],
                'currency'     => $currency,
                'rate'         => $CP['Доставка'],
                'est_delivery' => $dost_date->format('d.m.Y')                
            );
        
        /*$CP = $postResponce[Отправления][ПростаяБандероль];
                
        $deliveries[2] =
                array(
                'name'         => $CP[Название],
                'currency'     => $currency,
                'rate'         => $CP[Тариф],
                'est_delivery' => $CP[СрокДоставки].' дней'
            );*/
        
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
