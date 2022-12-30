using Common.ViewModels.Post;
using Entity.Abstract;
using System.Linq.Expressions;

namespace BusinessLogic.Abstract
{
    public interface IGenericService<Table> where Table : class, IEntity, new()
    {
        void Add(Table entity);
        void Delete(Table entity);
        void DeleteById(int id);
        void Update(Table entity);
        IQueryable<Table> GetAll(Expression<Func<Table, bool>> filter = null, Func<IQueryable<Table>, IOrderedQueryable<Table>> orderBy = null, string includeProperties = null);
        Table GetFirstOrDefult(Expression<Func<Table, bool>> filter = null, string includeProperties = null);
        Table GetById(int id);
    }
}
