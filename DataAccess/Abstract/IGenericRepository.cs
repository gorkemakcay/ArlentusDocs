using Entity.Concrete;
using System.Linq.Expressions;

namespace DataAccess.Abstract
{
    public interface IGenericRepository<TEntity> where TEntity: BaseEntity
    {
        void Add(TEntity entity);
        void Update(TEntity entity);
        void Delete(TEntity entity);
        void Delete(int id);

        TEntity GetById(int id);
        TEntity Get(Expression<Func<TEntity, bool>> expression);
        IQueryable GetAll();
        IQueryable<TEntity> GetAll(Expression<Func<TEntity, bool>> expression);
    }
}
