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
        $help = new helperClass1cit();
        
        $result = $help->mult(3, 8);
        
        $this->view->assign('result', $result);
    }
}
