using BusinessLogic.Abstract;
using DataAccess.UoW.Abstract;
using Entity.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BusinessLogic.Concrete
{
    public class GenericManager<Table> : IGenericService<Table> where Table : class, IEntity, new()
    {
        private readonly IUnitOfWork _uow;

        public GenericManager(IUnitOfWork uow)
        {
            _uow = uow;
        }

        /// <summary>
        /// Gelen "Table" tipindeki veriyi kaydeder
        /// </summary>
        /// <param name="entity">Veritabanı sınıfı</param>
        public void Add(Table entity)
        {
            try
            {
                if (entity != null)
                {
                    _uow.GetRepository<Table>().Add(entity);
                }
            }
            catch (Exception)
            {
                // TO DO: Global log helper .writewe info message
                throw;
            }
        }

        /// <summary>
        /// Gelen "Table" tipindeki veriyi siler
        /// </summary>
        /// <param name="entity">Veritabanı sınıfı</param>
        public void Delete(Table entity)
        {
            try
            {
                if (entity != null)
                {
                    _uow.GetRepository<Table>().Delete(entity);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Gelen Id'ye sahip entity'yi bulur ve veriyi siler
        /// </summary>
        /// <param name="id"></param>
        public void DeleteById(int id)
        {
            try
            {
                var entity = GetById(id);
                if (entity != null)
                {
                    _uow.GetRepository<Table>().Delete(entity);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Gelen "Table" tipindeki bütün kayıtları çeker
        /// </summary>
        /// <param name="filter">Linq sorgusu</param>
        /// <param name="orderBy">OrderBy koşulu</param>
        /// <param name="includeProperties">Lazy/eager loading</param>
        /// <returns>Gelen "Table" tipindeki kayıtlar</returns>
        public IQueryable<Table> GetAll(Expression<Func<Table, bool>> filter = null, Func<IQueryable<Table>, IOrderedQueryable<Table>> orderBy = null, string includeProperties = null)
        {
            try
            {
                return _uow.GetRepository<Table>().GetAll(filter, orderBy, includeProperties);
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <summary>
        /// Gelen "Table" tipinde id'ye ait olan kaydı çeker
        /// </summary>
        /// <param name="id">İstenilen verinin id'si</param>
        /// <returns>Gelen "Table" tipindeki kayıt</returns>
        public Table GetById(int id)
        {
            try
            {
                if (id > 0)
                {
                    return _uow.GetRepository<Table>().GetById(id);
                }
                else
                    return null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <summary>
        /// Gelen "Table" tipinde kayıtlı olan ilk ya da default kaydı çeker
        /// </summary>
        /// <param name="filter">Linq sorgusu</param>
        /// <param name="includeProperties">Lazy/eager loading</param>
        /// <returns></returns>
        public Table GetFirstOrDefult(Expression<Func<Table, bool>> filter = null, string includeProperties = null)
        {
            try
            {
                return _uow.GetRepository<Table>().GetFirstOrDefault(filter, includeProperties);
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <summary>
        /// Gelen "Table" tipindeki veriyi günceller
        /// </summary>
        /// <param name="entity">Veritabanı sınıfı</param>
        public void Update(Table entity)
        {
            try
            {
                if (entity != null)
                {
                    _uow.GetRepository<Table>().Update(entity);
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
