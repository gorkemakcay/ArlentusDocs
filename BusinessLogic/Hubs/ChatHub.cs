using Microsoft.AspNetCore.SignalR;

namespace BusinessLogic.Hubs
{
    public class ChatHub : Hub
    {
        static List<string> clientList = new List<string>();

        // the function is triggered when any client connects to the hub 
        public override async Task OnConnectedAsync()
        {
            clientList.Add(Context.ConnectionId);
            await Clients.All.SendAsync("clientList", clientList);
            await Clients.All.SendAsync("userJoined", Context.ConnectionId);
        }

        // the function is triggered when any client disconnects to the hub 
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            clientList.Remove(Context.ConnectionId);
            await Clients.All.SendAsync("clientList", clientList);
            await Clients.All.SendAsync("userLeaved", Context.ConnectionId);
        }
    }
}
