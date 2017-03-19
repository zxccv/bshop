<?php

class helperClass1cit
{
    public static function getProductsPurchaseTime($product_ids)
    {
        $max_purchase_time = -200;
        foreach ($product_ids as $product_id)
        {
            $purchase_time = helperClass1cit::getProductPurchaseTime($product_id);
            
            if($purchase_time > $max_purchase_time)
            {
                $max_purchase_time = $purchase_time;
            }
        }
        
        return $max_purchase_time;
    }
    
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