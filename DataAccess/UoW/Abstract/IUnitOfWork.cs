using DataAccess.Abstract;
using DataAccess.Abstract.IPost;
using DataAccess.Abstract.IRole;
using DataAccess.Abstract.IUser;
using Entity.Abstract;

namespace DataAccess.UoW.Abstract
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository _userRepository { get; }
        IRoleRepository _roleRepository { get; }
        IPostRepository _postRepository { get; }

        IGenericRepository<Table> GetRepository<Table>() where Table : class, IEntity, new();
        void SaveChange();
    }
}
