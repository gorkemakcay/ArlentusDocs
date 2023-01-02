using Entity.Concrete;

namespace Common.ViewModels.Post
{
    public class ListPostVM
    {
        public int Id { get; set; }
        public string Header { get; set; }
        public int ParentId { get; set; }
    }

    //public class ListPostVM
    //{
    //    public int Id { get; set; }
    //    public string Header { get; set; }
    //}
}
