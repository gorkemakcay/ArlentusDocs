using BusinessLogic.Concrete.Hubs;
using Microsoft.AspNetCore.Mvc;

namespace ArlentusDocs.Controllers
{
    public class ChatController : Controller
    {
        private readonly ChatHubManager _chatHubManager;
        public ChatController(ChatHubManager chatHubManager)
        {
            _chatHubManager = chatHubManager;
        }

        public async Task SendMessage(string message)
        {
            await _chatHubManager.SendMessageAsync(message);
        }
    }
}
