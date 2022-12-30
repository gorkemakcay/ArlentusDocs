using Entity.Abstract;
using Entity.Concrete;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Linq.Expressions;

namespace DataAccess.Abstract
{
    public interface IGenericRepository<Table> where Table : class, IEntity, new()
    {
        void Add(Table entity);
        void Delete(Table entity);
        void DeleteById(int id);
        void Update(Table entity);
        IQueryable<Table> GetAll(Expression<Func<Table, bool>> filter = null, Func<IQueryable<Table>, IOrderedQueryable<Table>> orderBy = null, string includeProperties = null);
        Table GetFirstOrDefault(Expression<Func<Table, bool>> filter = null, string includeProperties = null);
        Table GetById(int id);
    }
}
