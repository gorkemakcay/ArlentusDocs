$(function () {
    const connectionStatus = $("#connectionStatus");
    const clientNotify = $("#clientNotify");

    // #region SignalR Configurations
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:44397/myhub")
        .withAutomaticReconnect([2000, 2000, 2000, 2000, 2000, 2000]) // default cycle timings: 0.s -> 2.s -> 10.s -> 30.s trying reconnect.
        .build();

    // this function works per 2 second when the connection is not established at all (per 2 second)
    async function startSignalR() {
        try {
            await connection.start();
        } catch (error) {
            setTimeout(() => startSignalR(), 2000);
        }
    }
    startSignalR();

    function statusChanger(htmlElement, context, backgroundColor) {
        htmlElement.css('background-color', backgroundColor);
        htmlElement.html(context);
        htmlElement.fadeIn(2000, () => {
            setTimeout(() => {
                htmlElement.fadeOut(2000);
            }, 2000);
        });
    }

    connection.on('receiveMessage', message => {
        let messageContext = `<p class="m-0" style="font-weight:400; color:white;">${message}</p>`;
        $("#chatBox").append(messageContext);
    });

    connection.on('clientList', onlineClientList => {
        var list = "";
        $.each(onlineClientList, (index, item) => {
            list += `<li>${item}</li>`;
        })
        console.log(list);
        $("#onlineClient").children().remove();
        $("#onlineClient").append(list);
    });

    // this function works when before the reconnecting process
    connection.onreconnecting(error => {
        statusChanger(connectionStatus, 'Reconnecting...', 'blue');
    });

    // this function works when after the reconnecting process done
    connection.onreconnected(connectionId => {
        statusChanger(connectionStatus, 'Reconnected...', 'green');
    });

    // this function works when reconnecting process' failed
    connection.onclose(connectionId => {
        statusChanger(connectionStatus, 'Connection failed!', 'red');
    });

    connection.on('userJoined', connectionId => {
        statusChanger(clientNotify, `${connectionId} connected`, 'green');
    });

    connection.on('userLeaved', connectionId => {
        statusChanger(clientNotify, `${connectionId} leaved`, 'red');
    });

    // #endregion

    // click send button for send to message
    $("#sendButton").click(() => {
        let message = $("#messageInput").val();
        if (message != '') {
            $.ajax({
                url: "/Chat/SendMessage",
                data: { message: message },
                success: function () {
                    $("#messageInput").val('');
                },
                error: function (error) {
                    console.log(error);
                }
            });
            //connection.invoke("SendMessageAsync", message).catch(error => console.log(`Error occurred while sending message: ${error}`));
        }
    });
});

// press enter for send to message
$("#messageInput").on('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        $("#sendButton").click();
    }
});