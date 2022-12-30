using BusinessLogic.Concrete.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace ArlentusDocs.Hubs
{
    //public class MyHubDispatcher : Hub
    //{
    //    static List<string> clientlist = new List<string>();
    //    public async Task sendmessageasync(string message)
    //    {
    //        await Clients.All.SendAsync("ReceiveMessage", message);
    //    }

    //    // the function is triggered when any client connects to the hub 
    //    public override async Task OnConnectedAsync()
    //    {
    //        clientlist.Add(Context.ConnectionId);
    //        await Clients.All.SendAsync("clientlist", clientlist);
    //        await Clients.All.SendAsync("userjoined", Context.ConnectionId);
    //    }

    //    // the function is triggered when any client disconnects to the hub 
    //    public override async Task OnDisconnectedAsync(Exception? exception)
    //    {
    //        clientlist.Remove(Context.ConnectionId);
    //        await Clients.All.SendAsync("clientlist", clientlist);
    //        await Clients.All.SendAsync("ReceiveMessage", Context.ConnectionId);
    //    }
    //}

    //public class MyHubDispatcher : IMyHubService
    //{
    //    private readonly IHubContext<MyHub> _hubContext;
    //    public MyHubDispatcher(IHubContext<MyHub> hubContext)
    //    {
    //        _hubContext = hubContext;
    //    }

    //    static List<string> clientlist = new List<string>();
    //    public async Task sendmessageasync(string message)
    //    {
    //        await Clients.All.SendAsync("ReceiveMessage", message);
    //    }

    //    // the function is triggered when any client connects to the hub 
    //    public override async Task OnConnectedAsync()
    //    {
    //        clientlist.Add(Context.ConnectionId);
    //        await clients.all.sendasync("clientlist", clientlist);
    //        await clients.all.sendasync("userjoined", context.connectionıd);
    //    }

    //    // the function is triggered when any client disconnects to the hub 
    //    public override async task ondisconnectedasync(exception? exception)
    //    {
    //        clientlist.remove(context.connectionıd);
    //        await clients.all.sendasync("clientlist", clientlist);
    //        await clients.all.sendasync("userleaved", context.connectionıd);
    //    }
    //}
}
