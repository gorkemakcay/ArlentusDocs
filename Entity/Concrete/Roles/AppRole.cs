using Entity.Abstract;
using Microsoft.AspNetCore.Identity;

namespace Entity.Concrete.Roles
{
    public class AppRole : IdentityRole<int>, IEntity
    {
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime UpdatedDate { get; set; }
        public bool isActive { get; set; } = true;
        public bool isDeleted { get; set; } = false;
    }
}
