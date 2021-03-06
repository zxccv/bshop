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
        $response = $this->getResponse();
        $response->addHeader('Content-Type', 'application/json; charset=utf-8');
        $response->sendHeaders();
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
        elseif($command == 'RegisterOrderExport')
        {
            $order_number = $request['НомерЗаказа'];
            $error = $request['Ошибка'];
            
            $order_id = (int) mb_substr($order_number, 2);
                     
            
            $shop_order_export_model = new shopOrderExportModel();
            $shop_order_export_model->registerOrderExport($order_id,$error);
        }
        elseif($command == 'YandexMarket')
        {
            $plugin = wa()->getPlugin('yandexmarket');

            $profile_helper = new shopImportexportHelper('yandexmarket');

            list($path, $profile_id) = $plugin->getInfoByHash($request['hash']);
            if ($profile_id) {
                $profile = $profile_helper->getConfig($profile_id);
                if (!$profile) {
                    throw new waException('Profile not found', 404);
                }
                
                waRequest::setParam('profile_id', $profile_id);

                $runner = new shopYandexmarketPluginRunController();
                $_POST['processId'] = null;

                $moved = false;
                $ready = false;
                do {
                    ob_start();
                    if (empty($_POST['processId'])) {
                        $_POST['processId'] = $runner->processId;
                    } else {
                        sleep(1);
                    }
                    if ($ready) {
                        $_POST['cleanup'] = true;
                        $moved = true;
                    }
                    $runner->execute();
                    $out = ob_get_clean();
                    $result = json_decode($out, true);
                    $ready = !empty($result) && is_array($result) && ifempty($result['ready']);
                } while (!$ready || !$moved);
                   
            }
        }
        else
        {
            $this->setError('Неизвестная команда');
        }
        
        
    }
}
