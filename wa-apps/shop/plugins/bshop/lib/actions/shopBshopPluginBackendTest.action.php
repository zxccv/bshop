<?php

class shopBshopPluginBackendTestAction extends waViewAction
{
    public function execute()
    {
        /*$feature_model = new shopFeatureModel();
        $features = $feature_model->select('*')->where('selectable = 1')->order('id DESC')->fetchAll();
        $this->view->assign('features', $features);

        $app_settings_model = new waAppSettingsModel();
        $feature_id = $app_settings_model->get(array('shop', 'brands'), 'feature_id');
        if (!$feature_id) {
            $ids = array('brand', 'manufacturer', 'make');
            foreach ($features as $f) {
                if (in_array($f['code'], $ids)) {
                    $feature_id = $f['id'];
                    break;
                }
            }
        }*/
              
        //$prodId = waRequest::request('prodId');
        
        //$product = new shopProduct($prodId);
        
        //$pt = helperClass1cit::getProductPurchaseTime($prodId);
        //$product = new shopProduct($prodId);          
        //$features = $product->getFeatures();
        $api = new KladrApi(KladrApi::OurToken, '');
        
        /*$query              = new KladrQuery();
	//$query->ContentType = KladrObjectType::City;
        $query->OneString = true;
	//$query->ContentName = 'обл. Новгородская,Великий Новгород';
        $query->ContentName = 'Санкт-Петербург';
	$query->Limit       = 5;   
        $query->WithParent = true;
        
        $arResult = $api->QueryToArray($query);*/
        
        /*$query              = new KladrQuery();	
	$query->ContentName = 'Кушавера';
        $query->ContentType = KladrObjectType::City;
        //$query->OneString = true;
        $query->ParentType = KladrObjectType::Region;
        $query->ParentId = '5300000000000';        
	$query->Limit = 1;        
        $query->WithParent = true;
        
        $arResult = $api->QueryToArray($query);*/
        
        $res = helperClass1cit::getCityIDFromKladr('Кушавера', '53');
        
        $this->view->assign('result', $product['name'].'---->'.$pt);
    }
}
