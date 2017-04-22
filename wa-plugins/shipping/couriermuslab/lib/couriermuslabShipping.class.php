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
class couriermuslabShipping extends waShipping
{
    /**
     * Example of direct usage HTML templates instead waHtmlControl
     * (non-PHPdoc)
     * @see waShipping::getSettingsHTML()
     * @param array $params
     * @return string HTML
     */
    public function getSettingsHTML($params = array())
    {
        $values = $this->getSettings();
        if (!empty($params['value'])) {
            $values = array_merge($values, $params['value']);
        }

        $view = wa()->getView();

        $app_config = wa()->getConfig();
        if (method_exists($app_config, 'getCurrencies')) {
            $view->assign('currencies', $app_config->getCurrencies());
        }

        $namespace = '';
        if (!empty($params['namespace'])) {
            if (is_array($params['namespace'])) {
                $namespace = array_shift($params['namespace']);
                while (($namspace_chunk = array_shift($params['namespace'])) !== null) {
                    $namespace .= "[{$namspace_chunk}]";
                }
            } else {
                $namespace = $params['namespace'];
            }
        }

        $view->assign('namespace', $namespace);
        $view->assign('values', $values);
        $view->assign('p', $this);

        $html = '';
        $html .= $view->fetch($this->path.'/templates/settings.html');
        $html .= parent::getSettingsHTML($params);

        return $html;
    }

    protected function calculate()
    {
        $currency = $this->currency;
        $rates = $this->rate;

        //Самойлофф++
        $cart = new shopCart();
        $purch_time = helperClass1cit::getProductsPurchaseTime($cart->items());
        if($purch_time != -1)
        {
            $dost_date = new DateTime();        
            date_add($dost_date, new DateInterval('P'.$purch_time.'D'));
            $est_delivery = $dost_date->format('d.m.Y');
        } else
        {
            $est_delivery = '';
        }
        //Самойлов--
        
        $deliveries = array();
        $i = 1;    // start from index 1
        foreach ($rates as $rate) {
            $deliveries[$i++] = array(
                'name'         => $rate['location'],
                'currency'     => 'RUB',
                'rate'         => $rate['cost'],
                'est_delivery' => $est_delivery
            );
        }

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
    
    public function allowedAddress()
    {
        return array();
    }
    
    //Самойлов НАЧАЛО 22.04.17 13:58 #252
    /**
     * Проверяет доступность метода доставки в зависимости от параметров заказа
     * @param type $parameters
     * @return boolean
     */
    public function isMethodAllowed($parameters)
    {
        $availablity = false;
        if($parameters['spb'])
        {
            $availablity = true;                
        }
        
        return $availablity; 
    }
    //Самойлов КОНЕЦ 22.04.17 13:58
}
