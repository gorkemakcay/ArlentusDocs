using DataAccess.Abstract;
using DataAccess.Abstract.IPost;
using DataAccess.Abstract.IRole;
using DataAccess.Abstract.IUser;
using DataAccess.Concrete;
using DataAccess.Concrete.Repositories;
using DataAccess.Concrete.Repositories.EfPostRepository;
using DataAccess.Concrete.Repositories.Role;
using DataAccess.Concrete.Repositories.User;
using DataAccess.UoW.Abstract;

namespace DataAccess.UoW.Concrete
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ArlentusDocsDbContext _ctx;
        public IUserRepository _userRepository { get; private set; }
        public IRoleRepository _roleRepository { get; private set; }
        public IPostRepository _postRepository { get; private set; }
        public UnitOfWork(ArlentusDocsDbContext ctx)
        {
            _ctx = ctx;
            _userRepository = new UserRepository(_ctx);
            _roleRepository = new RoleRepository(_ctx);
            _postRepository = new PostRepository(_ctx);
        }
    
        public void Dispose()
        {
            _ctx.Dispose();
        }

        public void SaveChange()
        {
            try
            {
                _ctx.SaveChanges();
            }
            catch (Exception)
            {

                throw;
            }
        }

        IGenericRepository<TEntity> IUnitOfWork.GetRepository<TEntity>()
        {
            return new GenericRepository<TEntity>(_ctx);
        }
    }
}
