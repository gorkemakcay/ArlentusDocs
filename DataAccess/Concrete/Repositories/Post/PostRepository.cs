using DataAccess.Abstract.IPost;
using Entity.Concrete.Post;

namespace DataAccess.Concrete.Repositories.EfPostRepository
{
    public class PostRepository : GenericRepository<Post>, IPostRepository
    {
        private readonly ArlentusDocsDbContext _ctx;
        public PostRepository(ArlentusDocsDbContext ctx) : base(ctx)
        {
            _ctx = ctx; 
        }
    }
}
