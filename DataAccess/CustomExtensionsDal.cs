using DataAccess.Abstract;
using DataAccess.Abstract.IPost;
using DataAccess.Concrete.Repositories;
using DataAccess.Concrete.Repositories.EfPostRepository;
using DataAccess.UoW.Abstract;
using DataAccess.UoW.Concrete;
using Microsoft.Extensions.DependencyInjection;

namespace DataAccess
{
    public static class CustomExtensionsDal
    {
        public static void AddContainerWithDependenciesDal(this IServiceCollection services)
        {
            services.AddScoped<IPostRepository, PostRepository>();

            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>))
                    .AddScoped<IUnitOfWork, UnitOfWork>();
        }
    }
}
