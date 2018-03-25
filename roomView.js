




//let the server know that the client has join


jQuery(function ($) {

    var $roomID=$('#roomNum');
    var $userName=$('#username');
    var $usermsg=$('#usermsg');

    var $link=$('#link');
    var $shareableLink=$('#sharableLink');


    //IO name space includes all handling of socket.io on the client side

    var IO=
        {
            init:function()
            {
                    IO.socket=io();
                    IO.bindEvents();

                    IO.socket.emit('joinRoom',$roomID);

            }
            ,
            bindEvents:function ()
            {
                IO.socket.on('joinRoom',IO.joinRoom);
                IO.socket.on('createRoom',IO.createRoom);
            }
            ,
            joinRoom:function(username)
            {
                $usermsg.innerText=username+" has joined the room ";
            }
            ,
            createRoom:function ()
            {

            }


        }


        var App=
            {
                init:function()
                {
                    App.bindEvents();
                }
                ,
                bindEvents:function()
                {
                   $shareableLink.onclick(App.displaySharedLink);
                }
                ,
                displaySharedLink:function()
                {
                    $link.innerText=window.location.href;
                    $link.hidden=false;
                }
            }
        IO.init();
        App.init();

});