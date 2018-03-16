    "use strict";

    const DEBUG       = true; // console messages
    const SPECIAL     = true; // special effects
    const COOKIE_EXP  = 365 * 24 * 60 * 60 * 1000; // how long to store the cookies (1 year)
    const COOKIE_NAME = "TODO_LIST"; // key of the cookie list

    var ft_list;
    var ft_item;
    var cookies;
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
        (SPECIAL) ? $('#ft_new').addClass("new") : noop();
        (SPECIAL) ? ft_list.addClass("list") : noop();
        (SPECIAL) ? ft_item.addClass("item") : noop();

        // register event listener
        $('#ft_new').on('click', newBtn);

        // init variables
        id_counter = 1;
        todo_list = [];

        // load cookies
        cookies = getCookie();

        if (cookies != "")
        {
            cookies = JSON.parse(cookies);

            for (var i = 0, n = cookies.data.length; i < n; i++)
            {
                addHtmlElement(cookies.data[i]);
            }

            (DEBUG) ? console.log("Cookies loaded:", cookies) : noop();
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
        updateCookies();
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
                    // remove also from list and update cookies
                    todo_list.splice(todo_list.length - i - 1, 1);
                    updateCookies();
                    break;
                }
            }

            // remove event listener and remove element from DOM
            elem.off();
            elem.remove();
        }
    }

    function updateCookies()
    {
        var d = new Date();

        cookies = JSON.stringify({'data': todo_list});
        d.setTime(d.getTime() + COOKIE_EXP);
        document.cookie = COOKIE_NAME + "=" + cookies + ";" + "expires="+ d.toUTCString() + ";path=/";
        (DEBUG) ? console.log("Cookies updated: ", JSON.parse(cookies)) : noop();
    }

    function getCookie()
    {
        var value = "; " + document.cookie;
        var parts = value.split("; " + COOKIE_NAME + "=");

        if (parts.length === 2)
        {
            return (parts.pop().split(";").shift());
        }
        return ("");
    }

    function noop()
    {}
