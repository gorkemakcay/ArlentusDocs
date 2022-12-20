using Entity.Concrete.Post;
using Entity.Concrete.Roles;
using Entity.Concrete.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Concrete
{
    public class ArlentusDocsDbContext : IdentityDbContext<AppUser, AppRole, int>
    {

        protected override void OnModelCreating(ModelBuilder builder)
        {
            #region Create Admin
            var admin = new AppUser
            {
                Id = 1,
                Email = "admin@portalacbi.com",
                NormalizedEmail = "ADMIN@PORTALACBI.COM",
                LockoutEnabled = true,
                FirstName = "Admin",
                LastName = "Portalacbi",
                UserName = "admin",
                NormalizedUserName = "ADMIN",
                SecurityStamp = "a3635eb1-112c-4cca-9e6e-b81e636d99c2",
                ConcurrencyStamp = "fe13649b-6a19-4964-8db8-1332ba224904",
                PasswordHash = "AQAAAAEAACcQAAAAECnTVUK/QxKYvnJiVDztpm9YuvXVCbwiW86jvTxkNOXv/27Nzr1OVjy4hbtRdcoZjg==",
            };

            #region Set Admin Password
            //PasswordHasher<AppUser> passwordHasher = new();
            //admin.PasswordHash = passwordHasher.HashPassword(appUser, "1");
            #endregion

            #region Seed Admin
            builder.Entity<AppUser>(user =>
            {
                user.HasData(admin);
            });
            #endregion

            #endregion

            #region Seed Role

            #region Admin Role
            builder.Entity<AppRole>(role =>
            {
                role.HasData(
                    new AppRole
                    {
                        Id = 1,
                        Name = "Admin",
                        NormalizedName = "ADMIN",
                        ConcurrencyStamp = "707b717a-d330-450f-a42c-9f2b7fcdfea1"
                    });
            });
            #endregion

            #endregion

            #region Set User Role

            #region To Admin
            builder.Entity<IdentityUserRole<int>>().HasData(new { UserId = 1, RoleId = 1 });
            #endregion


            #endregion

            base.OnModelCreating(builder);
        }

        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<AppRole> AppRoles { get; set; }
        public DbSet<Post> Posts { get; set; }
    }
}