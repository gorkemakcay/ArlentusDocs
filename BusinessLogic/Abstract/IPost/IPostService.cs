using Common.ViewModels.Post;
using Entity.Concrete.Post;

namespace BusinessLogic.Abstract.IPost
{
    public interface IPostService : IGenericService<Post>
    {
        string GetPostDetail(int id);
        string GetAllPostsByParentId(int parentId);
        int AddPost(AddPostVM model);
        string UpdatePost(UpdatePostVM model);
        string DeletePostById(int id);
        bool HaveAChild(int postId);
    }
}