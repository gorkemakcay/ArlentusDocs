using BusinessLogic.Abstract.IPost;
using Common.ViewModels.Post;
using Microsoft.AspNetCore.Mvc;

namespace ArlentusDocs.Controllers
{
    public class PostController : Controller
    {
        private readonly IPostService _service;
        public PostController(IPostService service)
        {
            _service = service;
        }

        [HttpPost]
        public int AddPost(AddPostVM model)
        {
            if (ModelState.IsValid)
            {
                return _service.AddPost(model);
            }

            return -1;
        }

        [HttpPut]
        public IActionResult UpdatePost(UpdatePostVM model)
        {
            if (ModelState.IsValid)
                return Json(_service.UpdatePost(model));

            return Json("ModelState.IsValid = false");
        }

        [HttpGet]
        public IActionResult GetPostById(int id)
        {
            return Json(_service.GetPostDetail(id));
        }

        [HttpGet]
        public IActionResult GetAllPostsByParentId(int parentId)
        {
            return Json(_service.GetAllPostsByParentId(parentId));
        }

        [HttpGet]
        public IActionResult GetAllPosts()
        {
            return Json(_service.GetAllPosts());
        }

        [HttpGet]
        public IActionResult HaveAChild(int postId)
        {
            return Json(_service.HaveAChild(postId));
        }

    }
}
