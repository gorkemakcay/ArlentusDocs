using DataAccess.Abstract.IRole;
using Entity.Concrete.Roles;

namespace DataAccess.Concrete.Repositories.Role
{
    public class RoleRepository : GenericRepository<AppRole>, IRoleRepository
    {
        private readonly ArlentusDocsDbContext _ctx;
        public RoleRepository(ArlentusDocsDbContext ctx) : base(ctx)
        {
            _ctx = ctx;
        }
    }
}
