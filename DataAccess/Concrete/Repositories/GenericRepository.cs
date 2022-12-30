using DataAccess.Abstract;
using Entity.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace DataAccess.Concrete.Repositories
{
    public class GenericRepository<Table> : IGenericRepository<Table> where Table : class, IEntity, new()
    {
        private readonly ArlentusDocsDbContext _ctx;
        private readonly DbSet<Table> _dbSet;
        public GenericRepository(ArlentusDocsDbContext ctx)
        {
            _ctx = ctx;
            _dbSet = _ctx.Set<Table>();
        }

        public void Add(Table entity)
        {
            _dbSet.Add(entity);
        }

        public void Delete(Table entity)
        {
            _dbSet.Remove(entity);
        }

        public void DeleteById(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
            }
        }

        public IQueryable<Table> GetAll(Expression<Func<Table, bool>> filter = null, Func<IQueryable<Table>, IOrderedQueryable<Table>> orderBy = null, string includeProperties = null)
        {
            IQueryable<Table> query = _dbSet;
            if (filter != null)
                query = query.Where(filter);

            if (includeProperties != null)
            {
                foreach (var item in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(item);
                }
            }

            if (orderBy != null)
            {
                return orderBy(query);
            }

            return query;
        }

        public Table GetById(int id)
        {
            return _dbSet.Find(id);
        }

        public Table GetFirstOrDefault(Expression<Func<Table, bool>> filter = null, string includeProperties = null)
        {
            IQueryable<Table> query = _dbSet;
            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (includeProperties != null)
            {
                foreach (var item in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(item);
                }
            }

            return query.FirstOrDefault();
        }

        public void Update(Table entity)
        {
            _dbSet.Update(entity);
        }
    }
}