using DataAccess.Abstract.IUser;
using Entity.Concrete.Users;

namespace DataAccess.Concrete.Repositories.User
{
    public class UserRepository : GenericRepository<AppUser>, IUserRepository
    {
        private readonly ArlentusDocsDbContext _ctx;
        public UserRepository(ArlentusDocsDbContext ctx) : base(ctx)
        {
            _ctx = ctx; 
        }
    }
}
