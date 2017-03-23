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
        if(!$this->testKey(waRequest::param('key')))
        {
            $this->setError('Wrong key. Fuck off.');
            return;
        }
        
        $command = waRequest::param('command');
	
        try {
            $request_body = file_get_contents('php://input');        
            $request = json_decode($request_body,true);            
        } catch (Exception $ex) {
            $this->setError('Не удалось распарсить тело запроса.');
        }
        
        if($command == 'setsettings')
        {
            $settings_name = $request['ИмяНастройки'];
            $settings_value = $request['ЗначениеНастройки'];
            
            if($settings_name == NULL || $settings_value == NULL)
            {
                $this->setError('Недостаточно параметров.');
                return;
            }
            
            $waSettigsModel = new waAppSettingsModel();
            
            if(!$waSettigsModel->set(array('shop','bshop'), $settings_name, $settings_value))
            {
                $this->setError('Что-то пошло не так');
            }
            
        }
        else
        {
            $this->setError('Неизвестная команда');
        }
        
        
    }
}
