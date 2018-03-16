    "use strict";

    const DEBUG       = true; // console messages
    const SPECIAL     = true; // special effects
    const COOKIE_EXP  = 365 * 24 * 60 * 60 * 1000; // how long to store the csv (1 year)
    const COOKIE_NAME = "TODO_LIST"; // key of the cookie list

    var ft_list;
    var ft_item;
    var csv;
    var cloned_item;
    var todo_list;
    var id_counter;
    var elem;

    init();

    function init()
    {
        // register document elements
        ft_list = $('#ft_list');
        ft_item = $('#ft_item');

        // special effects (css)
        (!SPECIAL) ? $('#ft_new').removeClass("new") : noop();
        (!SPECIAL) ? ft_list.removeClass("list") : noop();
        (!SPECIAL) ? ft_item.removeClass("item") : noop();

        // register event listener
        $('#ft_new').on('click', newBtn);

        // init variables
        id_counter = 1;
        todo_list = [];

        // load csv
        $.ajax({
            method: "POST",
            url: "select.php",
            data: { 'csv': csv }
        })
        .done(function(resp) {
            csv = resp;
            start();
        });
    }

    function start()
    {
        $('.loader_container').remove();

        if (csv != "")
        {
            csv = JSON.parse(csv);

            for (var i = 0, n = csv.data.length; i < n; i++)
            {
                addHtmlElement(csv.data[i]);
            }

            (DEBUG) ? console.log("CSV loaded:", csv) : noop();
        }
    }

    function newBtn()
    {
        (DEBUG) ? console.log("Adding item...") : noop();

        var item = prompt("TODO:", "");

        (item != null && item != "") ? addItem(item) : noop();
    }

    function addItem(txt)
    {
        (DEBUG) ? console.log("TODO text: ", txt) : noop();

        addHtmlElement(txt);
        insertCSV();
    }

    function addHtmlElement(txt)
    {
        // clone and add element to list
        todo_list.push(txt);
        cloned_item = ft_item.clone();
        elem = cloned_item.find('span');
        elem.text(txt);
        cloned_item.attr("id", (cloned_item.attr('id') + "_" + id_counter++));
        cloned_item.on('click', deleteItem);
        ft_list.prepend(cloned_item);
    }

    function deleteItem(ev)
    {
        if (confirm("Confirm delete"))
        {
            (DEBUG) ? console.log("Deleting item id:", ev.target.parentNode.id) : noop();

            elem = ft_list.find('#' + ev.target.parentNode.id);

            for (var i = 0, n = todo_list.length; i < n; i++)
            {
                if (ev.target.parentNode.id === elem.attr('id'))
                {
                    // remove also from list and update csv
                    todo_list.splice(todo_list.length - i - 2, 1);
                    deleteCSV();
                    break;
                }
            }

            // remove event listener and remove element from DOM
            elem.off();
            elem.remove();
        }
    }

    function insertCSV()
    {
        csv = JSON.stringify({'data': todo_list});

        // update list
        $.ajax({
            method: "POST",
            url: "insert.php",
            data: { 'csv': csv }
        });

        (DEBUG) ? console.log("CSV updated: ", JSON.parse(csv)) : noop();
    }

    function deleteCSV()
    {
        csv = JSON.stringify({'data': todo_list});

        // update list
        $.ajax({
            method: "POST",
            url: "delete.php",
            data: { 'csv': csv }
        });

        (DEBUG) ? console.log("CSV updated: ", JSON.parse(csv)) : noop();
    }

    function noop()
    {}
