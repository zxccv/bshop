<?php

class helperClass1cit
{
    /**
     * 
     * @param type $city Наименование города
     * @param type $region Наименование региона
     */
    public static function getCityZipCodeFromKladr($city,$region = NULL)
    {
        $api = new KladrApi(KladrApi::OurToken, '');
        
        $query              = new KladrQuery();	
	$query->ContentName = $city;
        if($region)
        {       
            $query->ParentType = KladrObjectType::Region;
            $query->ParentId = $region.'00000000000';
            $query->ContentType = KladrObjectType::City;
        } else
        {
            $query->OneString = true;
        }
	$query->Limit = 1;   
        $query->WithParent = true;
        
        $arResult = $api->QueryToArray($query);
        
        if(count($arResult)>0)
        {
            if($arResult[0]['zip'])
                return $arResult[0]['zip'];
            
            if($arResult[0]['parents'][0]['zip'])
                return $arResult[0]['parents'][0]['zip'];
            
            return "";
        } 
        else
        {
            return "";
        }
    }
            


    /**
     * 
     * @param type $receiver_zip - индекс получателя
     * @param type $items - массив товаров, каждый элемент должен содержать product_id,quantity
     * @param float $total_price - общая стоимость товаров
     */
    public static function getSdekCalculation($receiver_zip,$items,$total_price = 0)
    {          
        $sdek_request = array();
        $sdek_request['version'] = '1.0';
        $sdek_request['tariffId'] = '11';
        $sdek_request['senderCityPostCode'] = '192236';
        $sdek_request['receiverCityPostCode'] = $receiver_zip;
        
        $purchase_time = helperClass1cit::getProductsPurchaseTime($items);
        $date_execute = new DateTime();
        $date_execute->add(new DateInterval('P'.$purchase_time.'D'));
        $sdek_request['dateExecute'] = $date_execute->format('Y-m-d');
        
        $goods = array();
        foreach ($items as $item)
        {
            $product = new shopProduct($item['product_id']);            
            $features = $product->getFeatures();
            
            if($features['weight'] == NULL || $features['volume'] == NULL )
            {
                return "Невозможно расчитать стоимость. Для одного из товаров не задан вес или объем";
            }
            
            $goods[]=array('weight' => $features['weight']['value']*$item['quantity'],'volume' => $features['volume']['value']*$item['quantity']);
        }
        
        $sdek_request['goods'] = $goods;
        
        $sdek_request_encoded = json_encode($sdek_request);
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://api.edostavka.ru/calculator/calculate_price_by_json.php');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $sdek_request_encoded);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
                    'Content-Type: application/json',                                                                                
                    'Content-Length: ' . strlen($sdek_request_encoded)));
        
        $result_json = curl_exec($ch);
        
        $result = json_decode($result_json,true);
        
        if($result['error'] != NULL)
        {
            return $result['error'][0]['text'];
        }
        
        if($result['result'])
        {
          $min_date = clone $date_execute;
          $min_date->add(new DateInterval('P'.$result['result']['deliveryPeriodMin'].'D'));
          $max_date = clone $date_execute;
          $max_date->add(new DateInterval('P'.$result['result']['deliveryPeriodMax'].'D'));
          
          $est_delivery = $min_date->format('d.m.Y').' - '.$max_date->format('d.m.Y');
          $rate = $result['result']['price'];
          
          //Страховка
          $insurance = 0.0075 * $total_price;
          $rate = ceil($rate + $insurance);
          
          return array('rate' => $rate,'est_delivery' => $est_delivery);
        }
        else
        {
            return 'Ошибка при расчете';
        }
    }

    /**
     * 
     * @param array $items Массив товаров, каждый элемент должен содержать поле 'product_id' - id товара
     * @return int Время необходимое на закупку в днях (0 - товар есть на складе)
     */
    public static function getProductsPurchaseTime($items)
    {
        $max_purchase_time = -1;
        foreach ($items as $item)
        {
            $purchase_time = helperClass1cit::getProductPurchaseTime($item['product_id']);
            
            if($purchase_time > $max_purchase_time)
            {
                $max_purchase_time = $purchase_time;
            }
        }
        
        return $max_purchase_time;
    }
    
    /**
     * 
     * @param type $product_id ID товара
     * @return int Время необходимое на закупку в днях (0 - товар есть на складе) 
     */
    public static function getProductPurchaseTime($product_id)
    {
        $settinsModel = new waAppSettingsModel();
        $stock_times_json = $settinsModel->get(array('shop','bshop'),'stock_time');
        $stock_times = json_decode($stock_times_json,true);
        
        $product = new shopProduct($product_id);
        $skus = $product->getSkus();
        
        $min_purchase_time = 200;
        
        foreach ($skus[$product_id]['stock'] as $stock_key => $stock_remain)        
        {
            if((int)$stock_remain > 0)
            {
                $stock_purchase_time = $stock_times[$stock_key];
                
                if($stock_purchase_time <= $min_purchase_time)
                    $min_purchase_time = $stock_purchase_time;
            };
        };
        
        return $min_purchase_time;        
    }

        public function mult($x,$y)
    {
        return $x * $y;
    }
}