<?php

class sdekMusLabShipping extends waShipping
{
    protected function calculate()
    {        
        return 'Хуйс';
                
        $deliveries = array();        
        $deliveries[] =
                array(
                'name'         => $CP['Название'],
                'currency'     => $currency,
                'rate'         => $CP['Доставка'],
                'est_delivery' => $dost_date->format('d.m.Y')                
            );
                
        return $deliveries;
    }

    public function allowedCurrency()
    {
        return 'RUB';
    }

    public function allowedWeightUnit()
    {
        return 'kg';
    }

    public function requestedAddressFields()
    {
        return false;
    }
}
