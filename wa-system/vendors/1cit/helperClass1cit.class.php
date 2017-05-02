<?php

class helperClass1cit
{
    /**
     * Возвращает наименование населенного пункта с сокращением
     * @param type $city Наименование города
     * @param type $region Код региона
     */
    public static function getCityFullNameFromKladr($city,$region)
    {
        $api = new KladrApi(KladrApi::OurToken, '');
        
        $query = new KladrQuery();	
	$query->ContentName = $city;
        $query->ParentType = KladrObjectType::Region;
        $query->ParentId = $region.'00000000000';
        $query->ContentType = KladrObjectType::City;        
	$query->Limit = 1;   
        $query->WithParent = true;
        
        $arResult = $api->QueryToArray($query);
        
        if(count($arResult)>0)
        {
            return array('name' => $arResult[0]['name'],'type' => $arResult[0]['typeShort']);
        } 
        else
        {
            return $city;
        }
    }
            
    /**
     * Возвращает код кладр населенного пункта
     * @param type $city Наименование города
     * @param type $region Код региона
     */
    public static function getCityIDFromKladr($city,$region)
    {
        $api = new KladrApi(KladrApi::OurToken, '');
        
        $query = new KladrQuery();	
	$query->ContentName = $city;
        $query->ParentType = KladrObjectType::Region;
        $query->ParentId = $region.'00000000000';
        $query->ContentType = KladrObjectType::City;        
	$query->Limit = 5;   
        $query->WithParent = true;
        
        $arResult = $api->QueryToArray($query);
        
        if(count($arResult)>0)
        {
            foreach ($arResult as $res)
            {
                if(strcasecmp($res['name'], $city) === 0)
                {
                    return $res['id'];
                }
            }
            return $arResult[0]['id'];           
        } 
        else
        {
            return "";
        }
    }
    
    /**
     * Возвращает индекс по населенному пункту и региону
     * @param type $city Наименование города
     * @param type $region Код региона
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
     * Расчитывает варианты доставки деловыми линиями
     * @param type $receiver_zip - индекс получателя
     * @param type $items - массив товаров, каждый элемент должен содержать product_id,quantity
     * @param float $total_price - общая стоимость товаров
     */
    public static function getDLCalculation($receiver_kladr_id,$items,$total_price = 0)
    {
        $total_weight = 0;
        $total_volume = 0;
        foreach ($items as $item)
        {
            $product = new shopProduct($item['product_id']);            
            $features = $product->getFeatures();
            
            if(!isset($features['weight']) || $features['weight']['value'] == "0" || !isset($features['volume']) || $features['volume']['value'] == "0")
            {
                return "Невозможно расчитать стоимость. Для одного из товаров не задан вес или объем";
            }
            
            $total_weight = $total_weight + $features['weight']['value']*$item['quantity'];
            $total_volume = $total_volume + $features['volume']['value']*$item['quantity'];           
        }
        
        $dl_request = array();
        $dl_request['appKey'] = '5F133B38-0E0A-11E7-9479-00505683A6D3';
        $dl_request['derivalPoint'] = '7800000000000000000000000';
        $dl_request['derivalDoor'] = false;
        $dl_request['arrivalPoint'] = $receiver_kladr_id.'000000000000';
        $dl_request['arrivalDoor'] = false;
        $dl_request['sizedVolume'] = (string)$total_volume;
        $dl_request['sizedWeight'] = (string)$total_weight;
        $dl_request['statedValue'] = $total_price;
        
        $dl_request_encoded = json_encode($dl_request);
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://api.dellin.ru/v1/public/calculator.json');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $dl_request_encoded);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
                    'Content-Type: application/json',                                                                                
                    'Content-Length: ' . strlen($dl_request_encoded)));
        
        $result_json = curl_exec($ch);
        
        $result = json_decode($result_json,true);
        
        if(isset($result['errors']))
        {
            if(is_string($result['errors']))
            {
                return $result['errors'];
            } 
            elseif(is_array($result['errors']['messages']))
            {
                $error_text = '';
                foreach ($result['errors']['messages'] as $error_key => $error_desc)
                {
                    $error_text = $error_text.$error_key.'('.$error_desc.')<BR>';
                }
                //Самойлов НАЧАЛО 02.05.17 13:33 #
                return $error_text;
                //Самойлов КОНЕЦ 02.05.17 13:33
            }
            else
            {
                return 'Неопознанная ошибка';
            }
        }
        
        $purchase_time = helperClass1cit::getProductsPurchaseTime($items);
        
        if($purchase_time != -1)
        {
            $est_delivery_date = new DateTime();        
            $est_delivery_date->add(new DateInterval('P'.number_format($purchase_time).'D'));
            $est_delivery_date->add(new DateInterval('P'.number_format($result['time']['value']).'D'));
        
            $est_delivery = $est_delivery_date->format('d.m.Y');
        } 
        else
        {
            $est_delivery = '';
        }
        
        $rate = $result['price'];
        
        $delivery_variants = array();
        foreach ($result['arrival']['terminals'] as $terminal_data)
        {
            $delivery_variants[]=array('name' => $terminal_data['address'],'rate' => $rate,'est_delivery' => $est_delivery);
        }
        
        return $delivery_variants;        
    }

    /**
     * 
     * @param type $receiver_zip - индекс получателя
     * @param type $items - массив товаров, каждый элемент должен содержать product_id,quantity
     * @param float $total_price - общая стоимость товаров
     */
    public static function getSdekCalculation($receiver_zip,$items,$total_price = 0)
    {      
        $date_execute = new DateTime();
        $purchase_time = helperClass1cit::getProductsPurchaseTime($items);
        if($purchase_time != -1)
        {            
            $date_execute->add(new DateInterval('P'.number_format($purchase_time).'D'));
        }
                
        $sdek_request = array();
        $sdek_request['version'] = '1.0';
        //Самойлов НАЧАЛО 22.03.17 12:15 #228.1
        $sdek_request['authLogin'] = '5f9b4a5ad630df114caa9c4cbfdd5920';
        $sdek_request['secure'] = md5($date_execute->format('Y-m-d').'&'.'6352af35f6e9507a2303f2e87f9d5513');
        //$sdek_request['tariffId'] = '11';
        $sdek_request['tariffId'] = '137';
        //Самойлов КОНЕЦ 22.03.17 12:15
        
        $sdek_request['senderCityPostCode'] = '192236';
        $sdek_request['receiverCityPostCode'] = $receiver_zip;
        
        $sdek_request['dateExecute'] = $date_execute->format('Y-m-d');
        
        $goods = array();
        foreach ($items as $item)
        {
            $product = new shopProduct($item['product_id']);            
            $features = $product->getFeatures();
            
            if(!isset($features['weight']) || $features['weight']['value'] == "0" || !isset($features['volume']) || $features['volume']['value'] == "0")
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
        
        if(isset($result['error']) && $result['error'] != NULL)
        {
            return $result['error'][0]['text'];
        }
        
        if($result['result'])
        {
            if($purchase_time != -1)
            {
                $min_date = clone $date_execute;
                $min_date->add(new DateInterval('P'.number_format($result['result']['deliveryPeriodMin']).'D'));
                $max_date = clone $date_execute;
                $max_date->add(new DateInterval('P'.number_format($result['result']['deliveryPeriodMax']).'D'));

                //Самойлов НАЧАЛО 22.04.17 14:51 #252
                //Всё к единому формату
                //$est_delivery = $min_date->format('d.m.Y').' - '.$max_date->format('d.m.Y');
                $est_delivery = $max_date->format('d.m.Y');
                //Самойлов КОНЕЦ 22.04.17 14:52
            }
            else
            {
                $est_delivery = '';
            }
          
          
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
        $sku = reset($skus);
        $min_purchase_time = 200;
        
        foreach ($sku['stock'] as $stock_key => $stock_remain)        
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
    
    //Самойлов НАЧАЛО 22.04.17 14:29 #252
    public static function getShippingCostAddition($shipping_plugin,$parameters)
    {
        $cost_addition = 0;
        switch ($shipping_plugin)
        {
        case 'pickupmuslab':
            break;
        case 'couriermuslab':
            break;
        case 'russianpostmuslab':
            $cost_addition = $parameters['sum'] * 0.01;
            break;
        case 'dlmuslab':
            $cost_addition = 300;
            break;
        case 'sdekmuslab':
            $cost_addition = 100;
            break;
        case 'sdeknpmuslab':
            $cost_addition = 100;
            break;
        }        
        
        return ceil($cost_addition);
    }
    
    public static function getShippingDateAddition($shipping_plugin,$est_delivery)
    {
        $date_addition = 0;
        switch ($shipping_plugin)
        {
        case 'pickupmuslab':
            break;
        case 'couriermuslab':
            $date_addition = 1;
            break;
        case 'russianpostmuslab':
            $date_addition = 3;
            break;
        case 'dlmuslab':
            $date_addition = 3;
            break;
        case 'sdekmuslab':
            $date_addition = 3;
            break;
        case 'sdeknpmuslab':
            $date_addition = 3;
            break;
        }        
        
        if($date_addition > 0)
        {
            $est_delivery_date = DateTime::createFromFormat('d.m.Y', $est_delivery);
            date_add($est_delivery_date, new DateInterval('P'.$date_addition.'D'));
            return $est_delivery_date->format('d.m.Y');
        }
        else
        {
            return $est_delivery;
        };
        
        
    }
    //Самойлов КОНЕЦ 22.04.17 14:29
}