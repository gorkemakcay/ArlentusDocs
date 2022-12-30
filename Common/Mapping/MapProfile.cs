using AutoMapper;
using Common.ViewModels.Post;
using Entity.Concrete.Post;

namespace Common.Mapping
{
    public class MapProfile : Profile
    {
        public MapProfile()
        {
            #region Post
            CreateMap<Post, AddPostVM>().ReverseMap();
            CreateMap<Post, UpdatePostVM>().ReverseMap();
            CreateMap<Post, ListPostVM>().ReverseMap();
            CreateMap<Post, DetailPostVM>().ReverseMap();
            #endregion

            #region User

            #endregion

            #region Role

            #endregion
        }
    }
}
