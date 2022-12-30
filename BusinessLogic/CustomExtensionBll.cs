using BusinessLogic.Abstract;
using BusinessLogic.Abstract.IPost;
using BusinessLogic.Concrete;
using BusinessLogic.Concrete.Post;
using Microsoft.Extensions.DependencyInjection;

namespace BusinessLogic
{
    public static class CustomExtensionBll
    {
        public static void AddContainerWithDependenciesBll(this IServiceCollection services)
        {
            services.AddScoped<IPostService, PostManager>();

            services.AddScoped(typeof(IGenericService<>), typeof(GenericManager<>));
        }
    }
}
