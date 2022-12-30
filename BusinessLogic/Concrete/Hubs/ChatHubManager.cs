using BusinessLogic.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace BusinessLogic.Concrete.Hubs
{
    public class ChatHubManager
    {
        private readonly IHubContext<ChatHub> _hubContext;
        public ChatHubManager(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendMessageAsync(string message)
        {
            await _hubContext.Clients.All.SendAsync("receiveMessage", message);
        }
    }
}
