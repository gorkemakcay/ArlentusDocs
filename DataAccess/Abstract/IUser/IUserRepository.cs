using Entity.Abstract;
using Entity.Concrete.Users;

namespace DataAccess.Abstract.IUser
{
    public interface IUserRepository : IGenericRepository<AppUser>
    {
    }
}
