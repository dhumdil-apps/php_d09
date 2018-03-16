<?php

    $json = file_get_contents('list.csv');

    if ($json)
    {
        $list = explode(';', file_get_contents('list.csv'));
        echo ($list == False) ? '' : $list[1];
    }
    else
    {
        echo '';
    }
