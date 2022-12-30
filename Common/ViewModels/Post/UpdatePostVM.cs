using Entity.Concrete;

namespace Common.ViewModels.Post
{
    public class UpdatePostVM : BaseEntity
    {
        public int ParentId { get; set; }
        public string? CreatedBy { get; set; }
        public string Header { get; set; }
        public string? Context { get; set; }
        public string ContextPath { get; set; }
    }
}
