using Entity.Abstract;
using Microsoft.AspNetCore.Identity;

namespace Entity.Concrete.Users
{
    public class AppUser : IdentityUser<int>, IEntity
    {
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? UpdatedDate { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;
    }
}