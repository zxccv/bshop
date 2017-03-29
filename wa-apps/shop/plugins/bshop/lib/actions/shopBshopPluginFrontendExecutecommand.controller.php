<?php
      
class shopBshopPluginFrontendExecutecommandController extends waJsonController
{
    private function testKey($key)
    {
        $right_key = '4ce67746-53ac-44e7-a86e-89194e15037c';
        
        if($key == $right_key)
            return true;
        else
            return false;
    }


    public function execute()
    {                
        $command = waRequest::param('command');
	
        try {
            $request_body = file_get_contents('php://input');        
            $request = json_decode($request_body,true);            
        } catch (Exception $ex) {
            $this->setError('Не удалось распарсить тело запроса.');
        }
        
        if(!$this->testKey($request['key']))
        {
            $this->setError('Wrong key. Fuck off.');
            return;
        }
        
        if($command == 'setsettings')
        {
            $settings_app_name = $request['ИмяПлагина'];
            $settings_name = $request['ИмяНастройки'];
            $settings_value = $request['ЗначениеНастройки'];
            
            if(!$settings_app_name)
                $settings_app_name = 'bshop';
            
            if($settings_name == NULL || $settings_value == NULL)
            {
                $this->setError('Недостаточно параметров.');
                return;
            }
            
            $waSettigsModel = new waAppSettingsModel();
            
            if(!$waSettigsModel->set(array('shop',$settings_app_name), $settings_name, $settings_value))
            {
                $this->setError('Что-то пошло не так');
            }
            
        }
        elseif($command == 'GetToken')
        {
            $model = new waContactModel();
            $user_info = $model->getByEmail('shop@1c-it.com');
            $wa_auth = new waAuth();
            $this->response = array('token' => $wa_auth->getToken($user_info));
        }
        elseif($command == 'UpdateFeatureTypes')
        {
            $code = $request['Code'];
            $product_types = $request['ВидыНоменклатуры'];
            $sort = $request['Сортировка'];
            
            if(!$code)
            {
                $this->setError('Недостаточно параметров.');
                return;
            }
            
            $productTypeModel = new shopTypeModel();            
            $allProductTypes = $productTypeModel->getTypes();            
            
            $types = array();
            foreach ($allProductTypes as $productType)
            {
                if(!is_array($product_types) || array_search($productType['name'], $product_types) !== FALSE)
                {
                    $types[$productType['id']]=$productType['id'];
                }
            }
            
            $feature_model = new shopFeatureModel();            
            $type_features_model = new shopTypeFeaturesModel();
            
            $feature = $feature_model->getByCode($code);
            $feature['types'] = $types;
            
            $feature['types'] = $type_features_model->updateByFeature($feature['id'], $feature['types']);
            $type_features_model->updateByField('feature_id', $feature['id'], array('sort' => $sort));
            
        }
        elseif($command == 'UpdateFeature')
        {
            $name = $request['Наименование'];
            $code = $request['Code'];
            $status = $request['Отображать'] ? 'public' : 'private';
            $type = $request['Тип'];
            $selectable = $request['ВыборИзСписка'];
            $values = $request['Значения'];
            $sort = $request['Сортировка'];
           
            if(!$name || !$code || !$status || !$type)
            {
                $this->setError('Недостаточно параметров.');
                return;
            }
            
            $feature_model = new shopFeatureModel();            
            $type_features_model = new shopTypeFeaturesModel();
            
            $feature = $feature_model->getByCode($code);
            
            if($feature)
            {
                $id = $feature['id'];
            }
            else
            {
                $feature=array();
                $id = null;
            }         
            
            $feature['name'] = $name;
            $feature['code'] = $code;
            $feature['status'] = $status;
            $feature['type'] = $type;
            
            if($selectable === TRUE)
            {
                $feature['selectable'] = 1;
            } else
            {
                $feature['selectable'] = 0;
            }
            
            
            $feature['id'] = $feature_model->save($feature,$id);
            
            //values
            if($feature['selectable'] === 1 && is_array($values))
            {
                $feature_values_model = $feature_model::getValuesModel($feature['type']);
                $feature_values =  $feature_model->getFeatureValues($feature);
                
                $feature_values = array_intersect($feature_values, $values);
                $new_values = array_diff($values, $feature_values);
                
                $index = -1;
                foreach ($new_values as $new_value)
                {
                    $feature_values[$index--] = $new_value;
                }
                
                asort($feature_values);
                
                $feature_model->setValues($feature, $feature_values);                
            }           
        }
        elseif($command == 'GetOrders')
        {
            $shop_order_export_model = new shopOrderExportModel();
            $this->response = array('Заказы' => $shop_order_export_model->getRegisteredOrders());
        }
        else
        {
            $this->setError('Неизвестная команда');
        }
        
        
    }
}
