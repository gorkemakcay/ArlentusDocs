using Entity.Abstract;

namespace Entity.Concrete.Post
{
    public class Post : BaseEntity
    {
        public int ParentId { get; set; }
        public string CreatedBy { get; set; }
        public string Header { get; set; }
        public string ContextPath { get; set; }
    }
}
