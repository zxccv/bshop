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
        //Это позволит получить тип оплаты для определения доступности доставки
        //$data = wa()->getStorage()->get('shop/checkout');
        
        require_once 'postcalc.class.php';
        $postcalclib = new postCalc();
        
        if($this->getAddress('zip'))
            $zip = $this->getAddress('zip');
        else
        {
            $zip = helperClass1cit::getCityZipCodeFromKladr($this->getAddress('city'), $this->getAddress('region'));
        }
        
        if($this->getTotalWeight() == 0)
        {
            return "Невозможно расчитать стоимость. Для товаров не задан вес";
        }
        
        //Самойлов НАЧАЛО 21.03.17 15:33 #
        //Страхуемся только на 100 рублей
        //$postResponce = $postcalclib->postcalc_request(192236, $zip, $this->getTotalWeight()*1000 , $this->getTotalPrice(), 'RU');
        $postResponce = $postcalclib->postcalc_request(192236, $zip, $this->getTotalWeight()*1000 , 100, 'RU');
        //Самойлов КОНЕЦ 21.03.17 15:34
        
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
        
        $CP = $postResponce['Отправления']['ЦеннаяПосылка'];
        
        $purch_time = helperClass1cit::getProductsPurchaseTime($cart_items);                
        
        if($purch_time != -1)
        {
            $dost_date = new DateTime();
            date_add($dost_date, new DateInterval('P'.number_format($purch_time).'D'));

            $tire_position = strpos($CP['СрокДоставки'],'-');
            if($tire_position == FALSE)
            {
                $delivery_time = $CP['СрокДоставки'];
            }
            else
            {
                $delivery_time = substr($CP['СрокДоставки'], $tire_position+1);
            }

            date_add($dost_date, new DateInterval('P'.number_format($delivery_time).'D'));
            $est_delivery = $dost_date->format('d.m.Y');
        } 
        else
        {
            $est_delivery = '';    
        }        
                
        $deliveries = array();        
        $deliveries[] =
                array(
                //Самойлов НАЧАЛО 23.03.17 18:10 #   
                //'name'         => $CP['Название'],
                'name'         => 'Почтовое отделение '.$postResponce['Куда']['Адрес'],
                //Самойлов КОНЕЦ 23.03.17 18:10    
                'currency'     => $currency,
                'rate'         => ceil($CP['Доставка']),
                'est_delivery' => $est_delivery                
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
