<?php

    if (isset($_POST['csv']))
    {
        file_put_contents('list.csv', 'id;' . $_POST['csv']);
    }
