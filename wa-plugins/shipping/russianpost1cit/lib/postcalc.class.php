<?php

class postCalc
{
    private function GetConfig()
    {
        return array(
            // === ИСТОЧНИК ДАННЫХ ===
           'source' => 'txt',              // Источник - либо txt, либо mysql. Для mysql требуется поддержка MySQLi
           'txt_dir' => __DIR__,           // Для txt: размещение текстовых файлов данных, по умолчанию - каталог postcalc_light_lib
           'mysql_host' => 'localhost',    // Для mysql: имя хоста
           'mysql_user' => 'testuser',     // Для mysql: имя пользователя БД
           'mysql_pass' => 'testpass',     // Для mysql: пароль пользователя БД
           'mysql_db'   => 'postcalc',     // Для mysql: имя базы данных

           // === НАСТРОЙКИ ЗАПРОСА ===
           'st' => 'shop.1c-it.com',        // Название сайта, без http: и слэшей
           'ml' => 'alex@1c-it.com',     // Контактный email. Самый принципиальный параметр
           'ib' => 'f',                  // База страховки - полная f или частичная p
           'r' => 0.01,                  // Округление вверх поля ОценкаПолная при ответе по API. 0.01 - округление до копеек, 1 - до рублей
           'pr' => 0,                    // Наценка в рублях за обработку заказа
           'pk' => 0,                    // Наценка в рублях за упаковку одного отправления
           'cs' => 'utf-8',              // Кодировка - utf-8 или windows-1251 
           'd'  =>'now',                 // Дата - в формате, который понимает strtotime(), например, '+7days','10.10.2014'
           'city_as_pindex' => 1,        // Если 1, то в запрос вместо нас.пункта будет подставлен его почтовый индекс по умолчанию

           // === НАСТРОЙКИ ВЕБ-ФОРМЫ ===
           'default_from' => '192236',   // Отделение отправителя по умолчанию. 101000 - Московский главпочтамт.
           'hide_from' => 0,             // Скрыть поле "Откуда".
           'autocomplete_items' => 20,   // Число элементов в списке автодополнения для полей "Откуда" и "Куда"

           // === ЖУРНАЛ СОЕДИНЕНИЙ И СТАТИСТИКА ===
           'log' => 1,                    // Если 1, ведет в cache_dir журнал соединений вида postcalc_light_YYYY-MM.log
                                          // Учтите, что при перезагрузке сервера временный каталог по умолчанию (/tmp)
                                          // обычно очищается и журналы удаляются, поэтому задайте для cache_dir иной каталог.
           'error_log' => 1,              // Если 1, ведет в cache_dir журнал ошибок соединения вида postcalc_light_error_YYYY-MM.log
           'error_log_send' => 10,        // Число ошибок соединения, после которых по адресу ml отсылается извещение об ошибках.
                                          // Если 0, извещение не отсылается.
           'pass' => '',                  // Пароль для доступа к статистике. Если пустая строка - не запрашивается.
           'pass_keep_days' => 365,       // Сколько хранить пароль в куки. 0 - хранить в течение сеанса.

           // === НАСТРОЙКИ СОЕДИНЕНИЯ ===
           'cache_dir' => sys_get_temp_dir(),  // Каталог кэширования - любой, в который веб-сервер имеет право записи
           'cache_valid' => 600,           // Время в секундах, после которого кэш считается устаревшим
           'timeout' => 5,                 // Время ожидания ответа сервера в секундах
            //Список серверов для беплатной версии
           'servers' => array('api.postcalc.ru', 'test.postcalc.ru'), 
           //Список серверов для коммерческой версии
           //'servers'=>array('pro.postcalc.ru', 'pro2.postcalc.ru', 'api.postcalc.ru', 'test.postcalc.ru'), 


           // === НАСТРОЙКИ ВЫВОДА ВЕБ-КЛИЕНТА ===
           /* Режим отладки. Если 1 - под таблицей с тарифами выводится полный массив ответа сервера.
            Обратите внимание на параметры _request и _server в самом конце - это переменные, которые были в запросе,
            и некоторые переменные ответа сервера. 
            Переменная [_server][REMOTE_ADDR] содержит реальный IP, с которого ушел ваш запрос.
            */
           'debug' => 0,
           /* Какие колонки таблицы показывать. */
           'arrColumns' => array(
              'Количество' => 1,
              'Тариф' => 1,
              'Страховка' => 1,        
              'Доставка' => 1,
              'Ценность' => 1,
              'СрокДоставки' => 1,
           ),
           /*
           Массив названий почтовых отправлений, который выводится в клиенте. На запрос не влияет.
           Если какие-то почтовые отправления выводить не нужно, просто закомментируйте их.
           */
            'arrParcels' => array(        
               'ПростаяБандероль',
               'ЗаказнаяБандероль',
               'ЗаказнаяБандероль1Класс',
               'ЦеннаяБандероль',
               'ЦеннаяПосылка',
               'ЦеннаяАвиаБандероль',
               'ЦеннаяАвиаПосылка',
               'ЦеннаяБандероль1Класс',
               'EMS',
               'ПосылкаОнлайн',
               'КурьерОнлайн',
               'ПростоеПисьмо',
               'ЗаказноеПисьмо',
               'ЦенноеПисьмо',
               'ПростойМультиконверт',
               'ЗаказнойМультиконверт',
               'МждМешокМ',
               'МждМешокМАвиа',
               'МждМешокМЗаказной',
               'МждМешокМАвиаЗаказной',
               'МждБандероль',
               'МждБандерольАвиа',
               'МждБандерольЗаказная',
               'МждБандерольАвиаЗаказная',
               'МждМелкийПакет',
               'МждМелкийПакетАвиа',
               'МждМелкийПакетЗаказной',
               'МждМелкийПакетАвиаЗаказной',
               'EMS_МждДокументы',
               'EMS_МждТовары',
            ),
           /*
           Дизайн страницы - одна из 24 тем оформления jQuery UI. 
           Для просмотра тем пройдите по ссылке:
           http://jqueryui.com/themeroller/
           Слева на странице в виде вертикальной колонки с черным фоном находится ThemeRoller. Щелкните по второй закладке "Gallery" -
           появятся изображения календарей с разным дизайном. Если вы нажмете по изображению одного из календарей, его дизайн будет 
           присвоен всей странице. Названия тем соответствуют ключам массива arrSkins.
            */
           'skin' => 'Start', 
           'arrSkins' => array(
               'Base' => 'base', 
               'Black Tie' => 'black-tie',
               'Blitzer' => 'blitzer',
               'Cupertino' => 'cupertino',
               'Dark Hive' => 'dark-hive',
               'Dot Luv' => 'dot-luv',
               'Eggplant' => 'eggplant', 
               'Excite Bike' => 'excite-bike', 
               'Flick' => 'flick', 
               'Hot Sneaks' => 'hot-sneaks', 
               'Humanity' => 'humanity', 
               'Le Frog' => 'le-frog',
               'Mint Choc' => 'mint-choc', 
               'Overcast' => 'overcast', 
               'Pepper Grinder' => 'pepper-grinder', 
               'Redmond' => 'redmond', 
               'Smoothness' => 'smoothness', 
               'South Street' => 'south-street', 
               'Start' => 'start', 
               'Sunny' => 'sunny', 
               'Swanky Purse' => 'swanky-purse', 
               'Trontastic' => 'trontastic', 
               'UI darkness' => 'ui-darkness', 
               'UI lightness' => 'ui-lightness', 
               'Vader' => 'vader'
           ),
       );
    }
    
    public function postcalc_request($From, $To, $Weight, $Valuation=0, $Country='RU')
    {
        $arrPostcalcConfig = $this->GetConfig();        
        // Обязательно! Проверяем данные - больше всего ошибочных запросов из-за неверных значений веса и оценки,
        // из-за пропущенного поля "Куда".
        if ( !is_numeric($Weight) || !($Weight > 0 && $Weight <= 100000) ) 
                    return "Bec в граммах - число от 1 до 100000, десятичный знак - точка!";
        if ( !is_numeric($Valuation) || !($Valuation >= 0 && $Valuation <= 100000) ) 
                    return "Оценка в рублях - число от 0 до 100000, десятичный знак - точка!";

        // Отдельная функция проверяет правильность полей Откуда и Куда
        $PindexFrom = $this->postcalc_get_default_ops($From);
        if ( !$PindexFrom ) 
                return "Поле 'Откуда': '$From' - не является допустимым индексом, названием региона или центра региона!";


        $PindexTo = $this->postcalc_get_default_ops($To);
        if ( !$PindexTo ) 
                return "Поле 'Куда': '$To' - не является допустимым индексом, названием региона или центра региона!";
        // Если установлен флаг $config_city_as_pindex, то в запрос подставляем почтовый индекс по умолчанию.
        // Если флаг $config_city_as_pindex не установлен, переводим название нас.пункта в "процентную" кодировку.
        $From = ( $arrPostcalcConfig['city_as_pindex'] ) ? $PindexFrom : rawurlencode($From);  
        $To = ( $arrPostcalcConfig['city_as_pindex'] ) ? $PindexTo : rawurlencode($To);

        if ( !$this->postcalc_arr_from_txt('postcalc_light_countries.txt', $Country, 1) ) 
                return "Код страны '$Country' не найден в базе стран postcalc_light_countries.txt!";

        // Формируем запрос со всеми необходимыми переменными. 
        $QueryString  = "st=$arrPostcalcConfig[st]&ml=$arrPostcalcConfig[ml]";
        $QueryString .= "&f=$From&t=$To&w=$Weight&v=$Valuation&c=$Country";
        $QueryString .= "&o=php&sw=PostcalcLight_2.2&cs=$arrPostcalcConfig[cs]";
        if ( $arrPostcalcConfig['d'] != 'now' ) $QueryString .= "&d=$arrPostcalcConfig[d]";
        if ( $arrPostcalcConfig['ib'] != 'f' ) $QueryString .= "&ib=$arrPostcalcConfig[ib]";
        if ( $arrPostcalcConfig['r'] != 0.01 ) $QueryString .= "&r=$arrPostcalcConfig[r]";
        if ( $arrPostcalcConfig['pr'] > 0 ) $QueryString .= "&pr=$arrPostcalcConfig[pr]";    
        if ( $arrPostcalcConfig['pk'] > 0 ) $QueryString .= "&pk=$arrPostcalcConfig[pk]";  

        // Название файла - префикс postcalc_ плюс хэш строки запроса
        $CacheFile = "$arrPostcalcConfig[cache_dir]/postcalc_".md5($QueryString).'.txt';
        // Сборка мусора. Удаляем все файлы, которые подходят под маску, старше POSTCALC_CACHE_VALID секунд 
        $arrCacheFiles = glob( "$arrPostcalcConfig[cache_dir]/postcalc_*.txt" );
        $Now = time();
        foreach ( $arrCacheFiles as $fileObj ) 
            if ( $Now-filemtime($fileObj) > $arrPostcalcConfig['cache_valid'] ) unlink( $fileObj );

        // Если существует файл кэша для данной строки запроса, просто зачитываем его
        if ( file_exists($CacheFile) ) {
            return  unserialize( file_get_contents($CacheFile) ); 
        } else {
             // Формируем опции запроса. Это _необязательно_, однако упрощает контроль и отладку
            $arrOptions = array('http' =>
              array( 'header'  => 'Accept-Encoding: gzip',
                     'timeout' => $arrPostcalcConfig['timeout'], 
                     'user_agent' => 'PostcalcLight_2.2 '.phpversion() 
                   )
            );
            $TS = microtime(1);
            // Опрашиваем в цикле сервера Postcalc.RU, пока не получаем ответ
            $ConnectOK = 0;
            foreach ( $arrPostcalcConfig['servers'] as $Server ) {
                // Запрос к серверу. Подавляем вывод сообщений и сохраняем ответ в переменной $Response. 
                $Response = @file_get_contents("http://$Server/?$QueryString", false , stream_context_create($arrOptions));
                // При ошибке соединения опрашиваем следующий сервер в цепочке.
                if ( $Response === false  ) {
                      // === ОБРАБОТКА ОШИБОК СОЕДИНЕНИЯ                  
                      // Журнал ошибок соединения, поля разделены табуляцией: 
                      // метка времени, сервер, истекшее время с начала сессии (т.е. всех запросов), краткое сообщение об ошибке, полное сообщение об ошибке
                      if ( $arrPostcalcConfig['error_log'] && count(error_get_last()) ) {
                            $ErrorLog = "$arrPostcalcConfig[cache_dir]/postcalc_error_" .date('Y-m') .'.log';
                            $arrError = error_get_last(); 
                            $PHPErrorMessage = $arrError['message'];
                            // Отрезаем конец сообщения PHP, где сообщается причина проблемы
                            $ErrMessage = substr( $PHPErrorMessage, strrpos( $PHPErrorMessage,':')+2 );
                            $fp_log = fopen($ErrorLog,'a');
                            fwrite($fp_log, date('Y-m-d H:i:s') ."\t$Server\t" .number_format((microtime(1)-$TS),3) ."\t$ErrMessage\t$PHPErrorMessage\n");
                            fclose($fp_log);
                            if ( $arrPostcalcConfig['error_log_send'] > 0 ) {
                                $fp_log = fopen($ErrorLog,'r');
                                // Последовательно идем по логу и сохраняем в переменной $MailMessage фрагмент не более $config_error_log_send строк
                                $MailMessage = '';  $send_log=false;  $line_counter = 0;
                                while ( ($line = fgets($fp_log)) !== false) {
                                    $line_counter++;
                                    if ( $send_log ) {
                                        $MailMessage = '';
                                        $send_log=false;
                                    }
                                    $MailMessage .= $line;
                                    // Если в $MailMessage оказалось ровно $config_error_log_send строк, сбрасываем счетчик строк и устанавливаем флаг $send_log.
                                    // Если следующее чтение вернуло конец файла, цикл будет прерван и фрагмент лога отослан по почте.  
                                    // Иначе фрагмент лога будет сброшен, как и флаг $send_log 
                                    if ( $line_counter % $arrPostcalcConfig['error_log_send'] === 0 ) {
                                        $line_counter = 0;
                                        $send_log=true;
                                    }
                                }
                                fclose($fp_log);
                                if ( $send_log ) {
                                        $MailMessage="$_SERVER[SERVER_ADDR] [$_SERVER[SERVER_ADDR]]: ошибки соединения в скрипте $_SERVER[SCRIPT_FILENAME].\n"
                                                . "Подробности см. в http://$_SERVER[HTTP_HOST]".dirname($_SERVER['REQUEST_URI'])."/postcalc_light_stat.php\n"
                                                . "Последние строки ($arrPostcalcConfig[error_log_send]) из журнала ошибок:\n\n"
                                                . $MailMessage;
                                        mail($arrPostcalcConfig[ml], 
                                             "$_SERVER[SERVER_ADDR] [$_SERVER[SERVER_ADDR]]: connection errors in postcalc_light_lib",
                                             $MailMessage,
                                             "Content-Transfer-Encoding: 8bit\nContent-Type: text/plain; charset=$arrPostcalcConfig[cs]\n");
                                }
                            }
                      }
                      // === КОНЕЦ ОБРАБОТКИ ОШИБОК СОЕДИНЕНИЯ
                      continue;
                }
                    $ConnectOK = 1;      
                    break;
            }
            if ( !$ConnectOK )  return 'Не удалось соединиться ни с одним из следующих серверов postcalc.ru: '.implode(',',$arrPostcalcConfig['servers']).'. Проверьте соединение с Интернетом.';

            $ResponseSize = strlen( $Response );

            // Если поток сжат, разархивируем его
            if ( substr($Response, 0, 3) == "\x1f\x8b\x08" ) 
                    $Response = gzinflate( substr($Response, 10, -8) );

            // Переводим ответ сервера в массив PHP
            if ( !$arrResponse = unserialize($Response) ) 
                    return "Получены странные данные. Ответ сервера:\n$Response";

            // Обработка возможной ошибки
            if ( $arrResponse['Status'] != 'OK' ) 
                    return "Сервер вернул ошибку: $arrResponse[Status]!";

            // Журнал успешных соединений, поля разделены табуляцией: 
            // метка времени, сервер, затраченное время, размер ответа, строка запроса
            if ( $arrPostcalcConfig['log'] ) {
                $fp_log = fopen("$arrPostcalcConfig[cache_dir]/postcalc_light_" .date('Y-m') .'.log','a');
                fwrite($fp_log,date('Y-m-d H:i:s')."\t$Server\t" .number_format((microtime(1)-$TS),3) ."\t$ResponseSize\t$QueryString\n");
                fclose($fp_log);
            }
            // Успешный ответ пишем в кэш
            file_put_contents($CacheFile, $Response);

        return $arrResponse;
        }

    }

    /**
     * Функция проверки правильности отправителя или получателя. Принимает либо 6-значный индекс,
     * либо название населенного пункта из файла postcalc_light_cities.txt или таблицы postcalc_light_cities. 
     * Например: 'Москва', 'Абагур (Новокузнецк)', 'Абрамцево, Московская область, Сергиево-Посадский район'.
     * 
     * Возвращает 6-значный индекс ОПС, если не найдено - false. 
     *  
     * Если передан 6-значный индекс, проверка идет по текстовому файлу postcalc_light_post_indexes.txt
     * или таблице postcalc_light_post_indexes, где находятся все почтовые индексы России в формате 
     * индекс ОПС - название ОПС из "эталонного справочника Почты России".
     * 
     * <code>
     * $From = 'Сергиев Посад';
     * 
     * $postIndex = postcalc_get_default_ops($From);
     * 
     * if ( !$postIndex ) echo "'$From' не является допустимым индексом, названием региона или центра региона!";
     * </code>
     * 
     * @param string $FromTo Проверяемое значение 
     * @return string  При ошибке возвращает false, иначе - шестизначный индекс ОПС.
     * 
     * @uses postcalc_arr_from_txt() Запрашивает массив, созданный из текстового файла.
     */
    private function postcalc_get_default_ops( $FromTo )
    {
        if ( !$FromTo ) return false;

        if ( preg_match('/^[1-9][0-9]{5}$/',$FromTo) ) {
            // Это 6-значный индекс. 
            $isPindex = true;
            $arr = $this->postcalc_arr_from_txt('postcalc_light_post_indexes.txt', $FromTo);
        } else {
            // Это любое другое сочетание букв и цифр
            $isPindex = false;
            $arr = $this->postcalc_arr_from_txt('postcalc_light_cities.txt', $FromTo);
        }
        // Ищем точное совпадение $FromTo и ключа в массиве. 
        if ( isset($arr[$FromTo]) ) 
            return ($isPindex) ? $FromTo : $arr[$FromTo];

        return false;
    }
    /**
     * Функция генерирует массив PHP либо из текстового файла с данными,
     * либо из таблицы MySQL. 
     * 
     * В первом случае открывает файл $src_txt, в котором находятся данные в формате:
     * [ключ]\t[значение]\n. 
     * 
     * Во втором случае обращается к таблице MySQL. Ее название совпадает с названием 
     * текстового файла без расширения .txt.
     * 
     * Возвращает массив. Параметр search - совпадение с началом ключа. Если пустая 
     * строка (по умолчанию) - возвращает все строки. 
     * 
     * @param string $src_txt Название файла с данными (включая расширение .txt).
     * @param string $search Совпадение с началом ключа. Если пустая строка - возвращает полную таблицу.
     * @param integer $limit Возвращать не более $limit элементов (для Autocomplete)
     * @return array Массив, если совпадений нет - пустой массив
     * 
     */
    private function postcalc_arr_from_txt($src_txt, $search = '', $limit = 0){
         $arrPostcalcConfig = $this->GetConfig();
         // === Источник - таблица mysql
      
         // === Источник - текстовый файл.
         $src_idx = basename($src_txt, 'txt'). 'idx';
         $src_txt = $arrPostcalcConfig['txt_dir']. '/' .$src_txt;
         $src_idx = $arrPostcalcConfig['txt_dir']. '/' .$src_idx;
         $search =  mb_convert_case($search, MB_CASE_LOWER, $arrPostcalcConfig['cs']);

         // == Если нет файла индекса или фильтр отсутствует, идем полным перебором 
         if ( !file_exists($src_idx) || $search == '' ) {
             $fp = fopen($src_txt, 'r');
             $counter = 0;
             while ( ( $line = fgets($fp) ) !== false ) {
                 list($key, $value) = explode("\t", $line);
                 if (  $search == '' || 
                      ( $search != '' && mb_stripos($key, $search, 0, $arrPostcalcConfig['cs']) === 0 ) 
                    ) {
                   $arr[$key] = trim($value);
                   if ($limit > 0 && ++$counter >= $limit) break;
                 } 
             }
             fclose($fp);
             return $arr;
         } 
         // == Индексный файл есть.
         $string_idx = file_get_contents($src_idx);
         // Начало совпадения
         $pos = mb_strpos(
                           $string_idx,
                           // Берем два первых символа
                          "\n".mb_substr($search, 0, 2, $arrPostcalcConfig['cs']), 
                           0,  
                           $arrPostcalcConfig['cs']
                 );
         $idx_len = mb_strlen($string_idx, $arrPostcalcConfig['cs']);
         // Конец строки с совпадением
         $pos_line_end = mb_strpos($string_idx, "\n", $pos + 1, $arrPostcalcConfig['cs']);
         $s = mb_substr($string_idx, $pos + 1, $pos_line_end - $pos - 1, $arrPostcalcConfig['cs']);
         // Получили сдвиг в оригинальном файле.
         list($tmp, $offset) = explode("\t", $s);
         // Теперь длина. 
         if ( $idx_len == $pos_line_end + 1 ) {
            // Если это последняя строка в файле индекса, то будем брать фрагмент до конца файла данных.
            // Берем любое большое число.
            $len = 1000000;
         } else {
            $pos = $pos_line_end + 1;
            $pos_line_end = mb_strpos($string_idx, "\n", $pos + 1, $arrPostcalcConfig['cs']);
            $s = mb_substr($string_idx, $pos + 1, $pos_line_end - $pos, $arrPostcalcConfig['cs']);
            list($tmp, $offset2) = explode("\t", $s);
            $len = $offset2 - $offset;
         }
         $fp = fopen($src_txt, 'r');    
         fseek($fp, $offset);
         $chunk = fread($fp, $len);
         fclose($fp);
         // Теперь делаем массив.
         $arr_tmp = explode("\n", trim($chunk));
         $counter = 0;
         foreach ($arr_tmp as $no => $line ) {
              list($key, $value) = explode("\t", $line);
              if (  $search == '' || 
                      ( $search != '' && mb_stripos($key, $search, 0, $arrPostcalcConfig['cs']) === 0 ) 
                    ) {
                   $arr[$key] = trim($value);
                   if ($limit > 0 && ++$counter >= $limit) break;
                 } 

         }
         return $arr;
    }

    /**
     * Вспомогательная функция, генерирует из массива содержимое списка <select> для веб-страницы.
     * 
     * Создает список стран, Россия в списке выделена:
     * <code>
     * postcalc_make_select(postcalc_arr_from_txt('postcalc_light_countries.txt'),'RU');
     * </code>
     * 
     * @ignore
     * @param array $arrList Ключи массива становятся value в тэге <option>, значения массива становятся видимыми элементами списка.
     * @param string $defaultValue Это значение будет выделено (атрибут selected).
     * @return string Готовый список для вставки на веб-странице между тэгами <select> и </select>.
     */
    private function postcalc_make_select($arrList,$defaultValue)
    {
    $Out='';
       foreach ($arrList as $value=>$label) {
            $Out.= "<option value='$value'";
            $Out.= ($value == $defaultValue) ? ' selected' : ''; 
            $Out.= ">$label</option>\n";
        }
    return $Out;
    }
    /**
     * Автодополнение для полей "Откуда" и "Куда" на веб-странице. Работает с виджетом jQuery Autocomplete.
     * 
     * Внимание! Входные данные ожидаются всегда в кодировке UTF-8. 
     * jQuery Autocomplete эту кодировку обеспечивает автоматически, в остальных случаях можно применять
     * функцию javascript encodeURIComponent().
     * 
     * Возвращает массив JSON для непосредственного использования в виджете jQuery Autocomplete в кодировке UTF-8.
     * 
     *
     * @param string $post_index Начало почтового индекса или населенного пункта.
     * @param integer $limit Максимальное число элементов в списке.
     * @return mixed Объект JSON для непосредственного использования в виджете jQuery Autocomplete.
     * 
     * @uses postcalc_arr_from_txt() Запрашивает функцию postcalc_arr_from_txt() для получения массива, сгенерированного из текстового файла.
     */
    private function postcalc_autocomplete($post_index, $limit = 10)
    {
        $arrPostcalcConfig = $this->GetConfig();
        $Charset = $arrPostcalcConfig['cs'];
        $arr = array();
        // Не менее 3 начальных символов должны быть цифрами
        if ( preg_match("/\d{3,}/", $post_index) ) {
            $arr_indexes = $this->postcalc_arr_from_txt('postcalc_light_post_indexes.txt', $post_index, $limit);
            foreach ($arr_indexes as $pindex => $opsname) 
                $arr[] = array( 
                    'label' => $pindex.' '.mb_convert_encoding($opsname, 'UTF-8', $Charset),
                    // Почтовый индекс - как строка для правильного преобразования в json_encode().
                    'value' => (string)$pindex 
                    );
          } else {
            // Все данные с веб-страницы поступают в UTF-8
            $post_index = mb_convert_case($post_index, MB_CASE_TITLE, 'UTF-8');
            // Преобразуем в текущую кодировку библиотеки
            $post_index = mb_convert_encoding($post_index,$Charset, 'UTF-8' );
            $arr_cities = $this->postcalc_arr_from_txt('postcalc_light_cities.txt', $post_index, $limit);


            foreach ($arr_cities as $city => $default_ops) {
                 $arr[]=array(
                        'label' =>  mb_convert_encoding($city, 'UTF-8', $Charset),
                        'value' =>  mb_convert_encoding($city, 'UTF-8', $Charset)
                 );
            }

        }

      return json_encode($arr);
    }

    /**
     * Функция генерирует из журналов соединений массив PHP. Используется в postcalc_light_stat.php. 
     * Возвращаемый массив может быть использован и для самостоятельного анализа.
     * 
     * Открывает в цикле все файлы, которые расположены в cache_dir и имеют название вида postcalc_light_YYYY-MM.log,
     * возвращает массив, где данные сгруппированы по дням: ключ массива - дата в формате YYYY-MM-DD, 
     * значения: число обращений за сутки num_requests, среднее время запроса time_elapsed, средний размер ответа size.
     *  
     * @global array $arrPostcalcConfig
     * @return array
     */
    private function postcalc_get_stat_arr() {
       $arrPostcalcConfig = $this->GetConfig();
       $postcalc_config_cache_dir =  $arrPostcalcConfig['cache_dir'];
       $arrStat=array();
    foreach (glob("$postcalc_config_cache_dir/postcalc_light_*.log") as $logfile ) {
        $fp_log=fopen($logfile,'r');
        while ( $logline = fgets($fp_log)) {
            list($date_time,$server,$time_elapsed,$size,$query_string)=explode("\t",$logline);
            $date = substr($date_time, 0, 10);
            if ( isset($arrStat[$date]) ) {
                $arrStat[$date]['time_elapsed'] += $time_elapsed;
                $arrStat[$date]['size'] += $size;
                $arrStat[$date]['num_requests']++;
            } else {
                $arrStat[$date]['time_elapsed'] = $time_elapsed;
                $arrStat[$date]['size'] = $size;
                $arrStat[$date]['num_requests'] = 1;
                $arrStat[$date]['errors'] = 0;
            }
        }
        fclose($fp_log);
    }
    // Дополняем статистикой по ошибкам
    foreach (glob("$postcalc_config_cache_dir/postcalc_error_*.log") as $logfile ) {
        $fp_log=fopen($logfile,'r');
        while ( $logline = fgets($fp_log)) {
            list($date_time,$server,$time_elapsed,$error_short,$error_full)=explode("\t",$logline);
            $date = substr($date_time, 0, 10);
            if ( isset($arrStat[$date]['errors']) ) {
                $arrStat[$date]['errors'] += 1;
            } else {
                $arrStat[$date]['errors'] = 1;
            }
        }
        fclose($fp_log);
    }

    // Теперь проходимся по всему массиву и вычисляем среднее арифметическое 
    // для size (округляем до целого) и time_elapsed (оставляем 3 знака после запятой).
    foreach ( $arrStat as $date => $arr_values ) {
        if ( isset($arrStat[$date]['time_elapsed']) )
            $arrStat[$date]['time_elapsed'] = number_format(($arrStat[$date]['time_elapsed']/$arrStat[$date]['num_requests']),3,'.','');
        if ( isset($arrStat[$date]['size']) )
            $arrStat[$date]['size'] = round($arrStat[$date]['size']/$arrStat[$date]['num_requests'], 0);
    }

    return $arrStat;
    }
}
