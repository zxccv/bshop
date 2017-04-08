<?php


class sberbankPayment extends waPayment implements waIPayment
{
    const MODE_TEST = 'TEST';
    const MODE_NORMAL = 'NORMAL';
    const MODE_TEST_URL = 'https://3dsec.sberbank.ru';
    const MODE_NORMAL_URL = 'https://securepayments.sberbank.ru';
    const REGISTER_URL = '/payment/rest/register.do';
    const STATUS_URL = '/payment/rest/getOrderStatus.do';
    const TIMEOUT = 120; // Timeout для cUrl соединений
    const BANK_CURRENCY_ISO = 643; // RUB
    const PLUGIN_CURRENCY = 'RUB';
    const LANGUAGE = 'ru';
    const SESSION_TIMEOUT_SECS = 600; // 60 сек. * 10 мин.
    const MAX_RETRIES = 5;
    const SSL_VERIFYPEER = false;

    //Самойлов НАЧАЛО 08.04.17 16:21 #252
    /**
     * Проверяет доступность метода оплаты в зависимости от параметров заказа
     * @param type $parameters
     * @return boolean
     */
    public function isMethodAllowed($parameters)
    {
        $availablity = true;
        return $availablity; 
    }
    //Самойлов КОНЕЦ 08.04.17 16:21
    
    public static function getServerOptions()
    {
        return array(
            array(
                'value' => self::MODE_TEST,
                'title' => 'Тестовый сервер'
            ),
            array(
                'value' => self::MODE_NORMAL,
                'title' => 'Рабочий сервер'
            ),
        );
    }

    public function allowedCurrency()
    {
        return 'RUB';
    }

    public function payment($payment_form_data, $order_data, $auto_submit = false)
    {
        if (!extension_loaded('curl')) {
            throw new waPaymentException('Библиотека cURL не установлена');
        }

        $order = waOrder::factory($order_data);

        $transactions = $this->getTransactionsByOrder($order->id);
        if (count($transactions) >= self::MAX_RETRIES)
            return wa()->getView()->fetch($this->path . '/templates/declined.html');

        $try_number = count($transactions);

        if (!empty($payment_form_data['register'])) {
            $response = $this->registerOrder($order, $try_number);

            if (is_null($response))
                throw new waPaymentException("Ошибка регистрации заказа. Заказ {$order->id_str}.");

            $this->registerTransactionForInvoice($order, $response);

            if (isset($response['formUrl'])) {
                wa()->getResponse()->redirect($response['formUrl']);
                return '';
            }
        }
        $view = wa()->getView();
        $view->assign('auto_submit', $auto_submit);
        $view->assign('fields', array('register'=>'1'));
        return $view->fetch($this->path . '/templates/payment.html');
    }

    protected function callbackInit($request)
    {
        if (empty($request['app']) || empty($request['mid'])) {
            throw new waPaymentException('Требуемые поля пусты');
        }

        $this->app_id = $request['app'];
        $this->merchant_id = $request['mid'];

        return parent::callbackInit($request);
    }

    protected function callbackHandler($request)
    {
        if (!extension_loaded('curl'))
            throw new waPaymentException('Библиотека cURL не установлена');

        if (empty($request['orderId']))
            throw new waPaymentException('Пропущен параметр orderId');

        $orderId = $request['orderId'];
        $status = $this->orderStatus($orderId);

        if (is_null($status))
            throw new waPaymentException('Ошибка соединения с банком');

        if (!isset($status['OrderStatus']))
            throw new waPaymentException('Ошибка получения статуса заказа');

        $transaction_model = new waTransactionModel();
        $transaction = $this->getTransactionByNativeId($orderId);

        if ($status['OrderStatus'] == 2) {
            $transaction_model->updateByField('native_id', $orderId, array('state' => waPayment::STATE_CAPTURED));
            $this->execCallback(self::CALLBACK_PAYMENT, $transaction);
            $this->setRedirect(waAppPayment::URL_SUCCESS, $transaction);
            return;
        }

        if ($status['OrderStatus'] == 6) {
            $transaction_model->updateByField('native_id', $orderId, array('state' => waPayment::STATE_DECLINED));
            $this->execCallback(self::CALLBACK_DECLINE, $transaction);
            $this->setRedirect(waAppPayment::URL_FAIL, $transaction);
            return;
        }

        header("HTTP/1.0 400 Bad Request");
        throw new waPaymentException('Неподдерживаемая операция');
    }

    protected function execCallback($callback, $transaction)
    {
        if ($this->SERVER_MODE == self::MODE_TEST) {
            $callback = self::CALLBACK_NOTIFY;
            $transaction['view_data'] = 'Тестовый запрос';
        }

        $this->execAppCallback($callback, $transaction);
    }

    protected function setRedirect($type, $transaction_data = array()) {
        $url = $this->getAdapter()->getBackUrl($type, $transaction_data);
        wa()->getResponse()->redirect($url);
    }

    protected function registerOrder(waOrder $order, $try_number=0)
    {
        $url_add = "?app={$this->app_id}&mid={$this->merchant_id}";

        $total = substr($order->total, 0, -2);
        $amount = str_replace('.', '', $total);

        $data = array(
            'userName' => $this->LOGIN,
            'password' => $this->PASSWORD,
            'orderNumber' => sprintf('%d-%d', $order->id, $try_number),
            'amount' => $amount,
            'currency' => self::BANK_CURRENCY_ISO,
            'language' => self::LANGUAGE,
            'returnUrl' => $this->getRelayUrl() . $url_add,
            'failUrl' => $this->getRelayUrl() . $url_add,
            'pageView' => 'DESKTOP',
            'description' => $order->description . ' от ' . date('d.m.Y', strtotime($order->datetime)),
            'sessionTimeoutSecs' => self::SESSION_TIMEOUT_SECS,
        );

        $url = $this->getServerUrl() . self::REGISTER_URL;
        return $this->sendPost($url, $data);
    }

    protected function orderStatus($bank_order_id)
    {
        $data = array(
            'userName' => $this->LOGIN,
            'password' => $this->PASSWORD,
            'orderId' => $bank_order_id,
            'language' => self::LANGUAGE,
        );

        $url = $this->getServerUrl() . self::STATUS_URL;
        return $this->sendPost($url, $data);
    }

    protected function getServerUrl()
    {
        if ($this->SERVER_MODE == self::MODE_NORMAL)
            return self::MODE_NORMAL_URL;
        else
            return self::MODE_TEST_URL;
    }

    protected function sendPost($url, $data)
    {
        if ($ch = curl_init($url)) {
            $result = null;

            @curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, self::SSL_VERIFYPEER);
            @curl_setopt($ch, CURLOPT_SSLVERSION, CURL_SSLVERSION_TLSv1_2);

            @curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            @curl_setopt($ch, CURLOPT_TIMEOUT, self::TIMEOUT);
            @curl_setopt($ch, CURLOPT_POST, 1);
            @curl_setopt($ch, CURLOPT_POSTFIELDS, $data);


            $response = curl_exec($ch);
            if (!$response) {
                $errorstr = curl_error($ch);
                $errorno = curl_errno($ch);
                self::log($this->id, "cUrl error: #{$errorno} {$errorstr} @ " . $url);
            } elseif (!($result = json_decode($response, true))) {
                self::log($this->id, "Error while decode response: " . $response);
            }
            curl_close($ch);

            return $result;
        }

        self::log($this->id, "cUrl init error.");

        return null;
    }

    protected function registerTransactionForInvoice(waOrder $order, $raw = null) {
        $transaction_data = $this->formalizeData(null);

        $data = array(
            'type' => waPayment::TYPE_ONLINE,
            'state' => waPayment::STATE_AUTH,
            'order_id' => $order->id,
            'amount' => $order->total,
            'currency_id' => self::PLUGIN_CURRENCY,
            );

        if (isset($raw['orderId'])) $data['native_id'] = $raw['orderId'];
        if (isset($raw['errorMessage'])) {
            $data['error'] = $raw['errorMessage'];
            $data['state'] = waPayment::STATE_DECLINED;
        }

        $transaction_data = array_merge($transaction_data, $data);

        return $this->saveTransaction($transaction_data, $raw);
    }

    protected function getTransactionByNativeId($native_id) {
        $conditions = array(
            'native_id' => $native_id,
            'plugin' => $this->id,
            'merchant_id' => $this->merchant_id,
        );

        return reset($this->getTransactionsByFields($conditions));
    }

    protected function getTransactionsByOrder($order_id, $state = null) {
        $conditions = array(
            'order_id' => $order_id,
            'plugin' => $this->id,
            'merchant_id' => $this->merchant_id,
        );

        if (!is_null($state))
            $conditions['state'] = $state;

        return $this->getTransactionsByFields($conditions);
    }
}