using AutoMapper;
using BusinessLogic.Abstract.IPost;
using Common.ViewModels.Post;
using DataAccess.Concrete;
using DataAccess.UoW.Abstract;
using Newtonsoft.Json;
using System.Reflection.Metadata.Ecma335;
using System.Text;

namespace BusinessLogic.Concrete.Post
{
    public class PostManager : GenericManager<Entity.Concrete.Post.Post>, IPostService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        public PostManager(IUnitOfWork uow, IMapper mapper) : base(uow)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public int AddPost(AddPostVM model)
        {
            try
            {
                var date = DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Day.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Minute.ToString() + DateTime.Now.Second.ToString() + DateTime.Now.Millisecond.ToString();

                var basePath = @"wwwroot\\Posts\\";
                bool basePathIsExists = Directory.Exists(basePath);
                if (!basePathIsExists)
                    Directory.CreateDirectory(basePath);
                //var fileName = date + "_" + model.Header.Replace(" ", "_") + ".txt";
                var fileName = date + "_" + "UserId" + ".txt";
                var filePath = Path.Combine(basePath, fileName);
                if (!File.Exists(filePath))
                {
                    // Create a new .txt
                    if (model.Context == null)
                        using (File.Create(filePath))
                        { }
                    else
                    {
                        using FileStream fs = File.Create(filePath);
                        // Add text to file    
                        Byte[] context = new UTF8Encoding(true).GetBytes(model.Context);
                        fs.Write(context, 0, context.Length);
                    }

                    using var dbContext = new ArlentusDocsDbContext();
                    var post = new Entity.Concrete.Post.Post()
                    {
                        Context = null,
                        ContextPath = filePath,
                        CreatedBy = model.CreatedBy,
                        CreatedDate = DateTime.Now,
                        Header = model.Header,
                        IsActive = true,
                        IsDeleted = false,
                        ParentId = model.ParentId,
                        UpdatedDate = null
                    };
                    dbContext.Posts.Add(post);
                    dbContext.SaveChanges();
                    return post.Id;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return -1;
                throw;
            }
            return -1;
        }

        public string DeletePostById(int id)
        {
            try
            {
                DeleteById(id);
                _uow.SaveChange();
                return "deleted";
            }
            catch (Exception ex)
            {
                return ex.Message;
                throw;
            }


        }

        public string GetAllPosts()
        {
            var model = _mapper.Map<List<DetailPostVM>>(GetAll());
            if (model != null)
            {
                var JSONmodel = JsonConvert.SerializeObject(model);
                return JSONmodel;
            }
            else return null;

        }

        public string GetAllPostsByParentId(int parentId)
        {
            var model = _mapper.Map<List<ListPostVM>>(GetAll(x => x.ParentId == parentId));
            if (model != null)
            {
                var JSONmodel = JsonConvert.SerializeObject(model);
                return JSONmodel;
            }
            else return null;
        }

        public string GetPostDetail(int id)
        {
            var model = _mapper.Map<DetailPostVM>(GetById(id));
            if (model != null)
            {
                try
                {
                    string text = File.ReadAllText(model.ContextPath);
                    model.Context = text;
                    var JSONmodel = JsonConvert.SerializeObject(model, new JsonSerializerSettings()
                    {
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                    });
                    return JSONmodel;
                }
                catch (Exception ex)
                {
                    return ex.Message;
                    throw;
                }

            }
            else return null;
        }

        public bool HaveAChild(int postId)
        {
            var model = GetFirstOrDefult(x => x.ParentId == postId);
            if (model != null)
                return true;
            else return false;
        }

        public string UpdatePost(UpdatePostVM model)
        {
            try
            {
                if (model.Context == null) File.WriteAllText(model.ContextPath, " ");
                else
                {
                    Byte[] context = new UTF8Encoding(true).GetBytes(model.Context);
                    File.WriteAllBytes(model.ContextPath, context);
                    model.Context = null;
                }
                model.UpdatedDate = DateTime.Now;
                Update(_mapper.Map<Entity.Concrete.Post.Post>(model));
                _uow.SaveChange();
                var updatedModel = GetPostDetail(model.Id);
                return updatedModel;
            }
            catch (Exception ex)
            {
                return ex.Message;
                throw;
            }

        }
    }
}